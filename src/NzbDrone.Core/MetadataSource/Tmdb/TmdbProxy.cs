using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using NLog;
using NzbDrone.Common.Cache;
using NzbDrone.Common.Extensions;
using NzbDrone.Common.Http;
using NzbDrone.Core.Configuration;
using NzbDrone.Core.Languages;
using NzbDrone.Core.MediaCover;
using NzbDrone.Core.MetadataSource.Tmdb.Resource;
using NzbDrone.Core.Parser;
using NzbDrone.Core.Tv;

namespace NzbDrone.Core.MetadataSource.Tmdb
{
    public class TmdbProxy : IProvideSeriesDiscoverInfo
    {
        private const string BaseUrl = "https://api.themoviedb.org/3";
        private const string ImageUrl = "https://image.tmdb.org/t/p/original";

        private static readonly TimeSpan DiscoverCacheDuration = TimeSpan.FromHours(6);
        private static readonly TimeSpan SeriesCacheDuration = TimeSpan.FromHours(24);

        private readonly IHttpClient _httpClient;
        private readonly IConfigService _configService;
        private readonly ICached<List<int>> _discoverCache;
        private readonly ICached<Series> _seriesCache;
        private readonly Logger _logger;

        public TmdbProxy(IHttpClient httpClient,
                         IConfigService configService,
                         ICacheManager cacheManager,
                         Logger logger)
        {
            _httpClient = httpClient;
            _configService = configService;
            _discoverCache = cacheManager.GetCache<List<int>>(GetType(), "discover");
            _seriesCache = cacheManager.GetCache<Series>(GetType(), "series");
            _logger = logger;
        }

        public bool IsConfigured => _configService.TmdbApiKey.IsNotNullOrWhiteSpace();

        public List<Series> GetTrendingSeries()
        {
            return MapMany(GetDiscoverIds("trending", "/trending/tv/week"));
        }

        public List<Series> GetPopularSeries()
        {
            return MapMany(GetDiscoverIds("popular", "/tv/popular"));
        }

        public List<Series> GetRecommendedSeries(List<int> seedTmdbIds)
        {
            if (!IsConfigured || seedTmdbIds.Empty())
            {
                return new List<Series>();
            }

            // Limit the number of seeds so a large library doesn't hammer TMDb.
            var seeds = seedTmdbIds.Where(id => id > 0).OrderBy(_ => Guid.NewGuid()).Take(10).ToList();

            var recommendedIds = new List<int>();

            foreach (var seed in seeds)
            {
                recommendedIds.AddRange(GetDiscoverIds($"recommendations-{seed}", $"/tv/{seed}/recommendations"));
            }

            return MapMany(recommendedIds.Distinct().ToList());
        }

        private List<int> GetDiscoverIds(string cacheKey, string resource)
        {
            if (!IsConfigured)
            {
                return new List<int>();
            }

            return _discoverCache.Get(cacheKey, () => FetchDiscoverIds(resource), DiscoverCacheDuration);
        }

        private List<int> FetchDiscoverIds(string resource)
        {
            try
            {
                var request = BuildRequest(resource);
                var response = _httpClient.Get<TmdbSeriesListResponseResource>(request);

                return response.Resource.Results.Select(s => s.Id).Distinct().ToList();
            }
            catch (Exception ex)
            {
                _logger.Warn(ex, "Failed to fetch discover results from TMDb for {0}", resource);
                return new List<int>();
            }
        }

        private List<Series> MapMany(List<int> tmdbIds)
        {
            if (!IsConfigured || tmdbIds.Empty())
            {
                return new List<Series>();
            }

            var results = new ConcurrentBag<Series>();

            Parallel.ForEach(tmdbIds, new ParallelOptions { MaxDegreeOfParallelism = 5 }, tmdbId =>
            {
                var series = GetSeries(tmdbId);

                if (series != null)
                {
                    results.Add(series);
                }
            });

            // Preserve the ordering TMDb returned, it is meaningful for trending/popular.
            var ordering = tmdbIds.Select((id, index) => new { id, index }).ToDictionary(x => x.id, x => x.index);

            return results.OrderBy(s => ordering.TryGetValue(s.TmdbId, out var index) ? index : int.MaxValue).ToList();
        }

        private Series GetSeries(int tmdbId)
        {
            return _seriesCache.Get(tmdbId.ToString(), () => FetchSeries(tmdbId), SeriesCacheDuration);
        }

        private Series FetchSeries(int tmdbId)
        {
            try
            {
                var request = BuildRequest($"/tv/{tmdbId}", "append_to_response", "external_ids,content_ratings");
                var response = _httpClient.Get<TmdbSeriesResource>(request);

                return MapSeries(response.Resource);
            }
            catch (Exception ex)
            {
                _logger.Debug(ex, "Failed to fetch series {0} from TMDb", tmdbId);
                return null;
            }
        }

        private HttpRequest BuildRequest(string resource, string extraKey = null, string extraValue = null)
        {
            var builder = new HttpRequestBuilder(BaseUrl + resource)
                .AddQueryParam("api_key", _configService.TmdbApiKey)
                .AddQueryParam("language", "en-US");

            if (extraKey.IsNotNullOrWhiteSpace())
            {
                builder.AddQueryParam(extraKey, extraValue);
            }

            var request = builder.Build();

            request.AllowAutoRedirect = true;
            request.RequestTimeout = TimeSpan.FromSeconds(15);

            return request;
        }

        private Series MapSeries(TmdbSeriesResource resource)
        {
            // Sonarr is keyed on TVDB, a show we can't map to a TVDB id can never be added.
            var tvdbId = resource.ExternalIds?.TvdbId ?? 0;

            if (tvdbId <= 0)
            {
                return null;
            }

            var series = new Series
            {
                TvdbId = tvdbId,
                TmdbId = resource.Id,
                ImdbId = resource.ExternalIds?.ImdbId,
                Title = resource.Name,
                CleanTitle = Parser.Parser.CleanSeriesTitle(resource.Name),
                SortTitle = SeriesTitleNormalizer.Normalize(resource.Name, tvdbId),
                Overview = resource.Overview,
                Status = MapSeriesStatus(resource.Status),
                Network = resource.Networks.FirstOrDefault()?.Name,
                Runtime = MapRuntime(resource),
                Genres = resource.Genres.Select(g => g.Name).ToList(),
                Ratings = new Ratings
                {
                    Votes = resource.VoteCount,
                    Value = resource.VoteAverage
                },
                Images = MapImages(resource),
                Monitored = true
            };

            series.OriginalLanguage = resource.OriginalLanguage.IsNotNullOrWhiteSpace()
                ? IsoLanguages.Find(resource.OriginalLanguage.ToLowerInvariant())?.Language ?? Language.English
                : Language.English;

            if (TryParseDate(resource.FirstAirDate, out var firstAired))
            {
                series.FirstAired = firstAired;
                series.Year = firstAired.Year;
            }

            if (TryParseDate(resource.LastAirDate, out var lastAired))
            {
                series.LastAired = lastAired;
            }

            var certification = resource.ContentRatings?.Results
                ?.FirstOrDefault(r => r.Country.Equals("US", StringComparison.InvariantCultureIgnoreCase))?.Rating;

            if (certification.IsNotNullOrWhiteSpace())
            {
                series.Certification = certification.ToUpperInvariant();
            }

            return series;
        }

        private static List<MediaCover.MediaCover> MapImages(TmdbSeriesResource resource)
        {
            var images = new List<MediaCover.MediaCover>();

            if (resource.PosterPath.IsNotNullOrWhiteSpace())
            {
                images.Add(new MediaCover.MediaCover(MediaCoverTypes.Poster, ImageUrl + resource.PosterPath));
            }

            if (resource.BackdropPath.IsNotNullOrWhiteSpace())
            {
                images.Add(new MediaCover.MediaCover(MediaCoverTypes.Fanart, ImageUrl + resource.BackdropPath));
            }

            return images;
        }

        private static int MapRuntime(TmdbSeriesResource resource)
        {
            // episode_run_time is empty for most modern shows, fall back to the latest episode.
            var runtime = resource.EpisodeRunTime.FirstOrDefault();

            if (runtime > 0)
            {
                return runtime;
            }

            return resource.LastEpisodeToAir?.Runtime ?? 0;
        }

        private static bool TryParseDate(string value, out DateTime date)
        {
            return DateTime.TryParseExact(value,
                "yyyy-MM-dd",
                DateTimeFormatInfo.InvariantInfo,
                DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal,
                out date);
        }

        private static SeriesStatusType MapSeriesStatus(string status)
        {
            if (status.IsNullOrWhiteSpace())
            {
                return SeriesStatusType.Continuing;
            }

            if (status.Equals("Ended", StringComparison.InvariantCultureIgnoreCase) ||
                status.Equals("Canceled", StringComparison.InvariantCultureIgnoreCase))
            {
                return SeriesStatusType.Ended;
            }

            if (status.Equals("Planned", StringComparison.InvariantCultureIgnoreCase) ||
                status.Equals("In Production", StringComparison.InvariantCultureIgnoreCase) ||
                status.Equals("Pilot", StringComparison.InvariantCultureIgnoreCase))
            {
                return SeriesStatusType.Upcoming;
            }

            return SeriesStatusType.Continuing;
        }
    }
}
