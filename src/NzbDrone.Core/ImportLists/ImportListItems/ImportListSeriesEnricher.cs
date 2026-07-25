using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NLog;
using NzbDrone.Common.Cache;
using NzbDrone.Common.Extensions;
using NzbDrone.Core.MetadataSource;
using NzbDrone.Core.Parser.Model;
using NzbDrone.Core.Tv;

namespace NzbDrone.Core.ImportLists.ImportListItems
{
    public interface IEnrichImportListSeries
    {
        List<ImportListSeries> Enrich(List<ImportListItemInfo> items);
    }

    /// <summary>
    /// Import list items only carry titles and ids. The discover page needs artwork, overviews and
    /// ratings, so each item is resolved to full series metadata and cached.
    /// </summary>
    public class ImportListSeriesEnricher : IEnrichImportListSeries
    {
        private static readonly TimeSpan CacheDuration = TimeSpan.FromHours(24);

        private readonly ISearchForNewSeries _seriesSearch;
        private readonly ICached<Series> _cache;
        private readonly Logger _logger;

        public ImportListSeriesEnricher(ISearchForNewSeries seriesSearch,
                                        ICacheManager cacheManager,
                                        Logger logger)
        {
            _seriesSearch = seriesSearch;
            _cache = cacheManager.GetCache<Series>(GetType(), "listSeries");
            _logger = logger;
        }

        public List<ImportListSeries> Enrich(List<ImportListItemInfo> items)
        {
            if (items.Empty())
            {
                return new List<ImportListSeries>();
            }

            var results = new ConcurrentBag<ImportListSeries>();

            Parallel.ForEach(items, new ParallelOptions { MaxDegreeOfParallelism = 5 }, item =>
            {
                var series = Resolve(item);

                if (series == null)
                {
                    return;
                }

                results.Add(new ImportListSeries
                {
                    Series = series,
                    ListId = item.ImportListId
                });
            });

            return results.ToList();
        }

        private Series Resolve(ImportListItemInfo item)
        {
            var term = GetSearchTerm(item);

            if (term == null)
            {
                return null;
            }

            return _cache.Get(term, () => Lookup(term, item), CacheDuration);
        }

        private Series Lookup(string term, ImportListItemInfo item)
        {
            try
            {
                var series = _seriesSearch.SearchForNewSeries(term).FirstOrDefault();

                if (series == null)
                {
                    return null;
                }

                // Series resolved by imdb/tmdb/mal won't have the list's tvdb id filled in yet.
                if (series.TvdbId <= 0 && item.TvdbId > 0)
                {
                    series.TvdbId = item.TvdbId;
                }

                return series;
            }
            catch (Exception ex)
            {
                _logger.Debug(ex, "Unable to resolve metadata for list item '{0}'", item.Title);
                return null;
            }
        }

        private static string GetSearchTerm(ImportListItemInfo item)
        {
            if (item.TvdbId > 0)
            {
                return $"tvdb:{item.TvdbId}";
            }

            if (item.ImdbId.IsNotNullOrWhiteSpace())
            {
                return $"imdb:{item.ImdbId}";
            }

            if (item.TmdbId > 0)
            {
                return $"tmdb:{item.TmdbId}";
            }

            if (item.MalId > 0)
            {
                return $"mal:{item.MalId}";
            }

            if (item.AniListId > 0)
            {
                return $"anilist:{item.AniListId}";
            }

            return null;
        }
    }

    public class ImportListSeries
    {
        public Series Series { get; set; }
        public int ListId { get; set; }
    }
}
