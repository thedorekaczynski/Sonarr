using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using NzbDrone.Core.ImportLists;
using NzbDrone.Core.ImportLists.Exclusions;
using NzbDrone.Core.ImportLists.ImportListItems;
using NzbDrone.Core.MediaCover;
using NzbDrone.Core.MetadataSource.Tmdb;
using NzbDrone.Core.Organizer;
using NzbDrone.Core.Tv;
using Sonarr.Api.V3.Series;
using Sonarr.Http;

namespace Sonarr.Api.V3.ImportLists
{
    [V3ApiController("importlist/series")]
    public class ImportListSeriesController : Controller
    {
        private readonly ISeriesService _seriesService;
        private readonly IAddSeriesService _addSeriesService;
        private readonly IImportListItemService _importListItemService;
        private readonly IEnrichImportListSeries _listSeriesEnricher;
        private readonly IImportListFactory _importListFactory;
        private readonly IImportListExclusionService _importListExclusionService;
        private readonly IProvideSeriesDiscoverInfo _discoverInfo;
        private readonly IBuildFileNames _fileNameBuilder;
        private readonly INamingConfigService _namingService;
        private readonly IMapCoversToLocal _coverMapper;

        public ImportListSeriesController(ISeriesService seriesService,
                                          IAddSeriesService addSeriesService,
                                          IImportListItemService importListItemService,
                                          IEnrichImportListSeries listSeriesEnricher,
                                          IImportListFactory importListFactory,
                                          IImportListExclusionService importListExclusionService,
                                          IProvideSeriesDiscoverInfo discoverInfo,
                                          IBuildFileNames fileNameBuilder,
                                          INamingConfigService namingService,
                                          IMapCoversToLocal coverMapper)
        {
            _seriesService = seriesService;
            _addSeriesService = addSeriesService;
            _importListItemService = importListItemService;
            _listSeriesEnricher = listSeriesEnricher;
            _importListFactory = importListFactory;
            _importListExclusionService = importListExclusionService;
            _discoverInfo = discoverInfo;
            _fileNameBuilder = fileNameBuilder;
            _namingService = namingService;
            _coverMapper = coverMapper;
        }

        [HttpGet]
        public object GetDiscoverSeries(bool includeRecommendations = false, bool includeTrending = false, bool includePopular = false)
        {
            var results = new List<ImportListSeriesResource>();
            var listExclusions = _importListExclusionService.All();
            var existingTvdbIds = _seriesService.AllSeriesTvdbIds();

            if (includeRecommendations)
            {
                var seeds = _seriesService.GetAllSeries().Select(s => s.TmdbId).Where(id => id > 0).ToList();

                results.AddRange(MapToResource(_discoverInfo.GetRecommendedSeries(seeds), isRecommendation: true));
            }

            if (includeTrending)
            {
                results.AddRange(MapToResource(_discoverInfo.GetTrendingSeries(), isTrending: true));
            }

            if (includePopular)
            {
                results.AddRange(MapToResource(_discoverInfo.GetPopularSeries(), isPopular: true));
            }

            var listIds = _importListFactory.All().Select(l => l.Id).ToList();
            var listItems = _listSeriesEnricher.Enrich(_importListItemService.GetAllForLists(listIds));

            results.AddRange(listItems.Select(item =>
            {
                var resource = MapToResource(item.Series);
                resource.Lists = new HashSet<int> { item.ListId };

                return resource;
            }));

            // Collapse duplicates across lists and discovery sources.
            return results.GroupBy(x => x.TvdbId).Select(group =>
            {
                var series = group.First();

                series.Lists = group.SelectMany(s => s.Lists).ToHashSet();
                series.IsExcluded = listExclusions.Any(e => e.TvdbId == series.TvdbId);
                series.IsExisting = existingTvdbIds.Contains(series.TvdbId);
                series.IsRecommendation = group.Any(s => s.IsRecommendation);
                series.IsTrending = group.Any(s => s.IsTrending);
                series.IsPopular = group.Any(s => s.IsPopular);

                return series;
            }).ToList();
        }

        [HttpPost]
        public object AddSeries([FromBody] List<SeriesResource> resource)
        {
            var newSeries = resource.ToModel();

            return _addSeriesService.AddSeries(newSeries, true).ToResource();
        }

        private List<ImportListSeriesResource> MapToResource(List<NzbDrone.Core.Tv.Series> series, bool isRecommendation = false, bool isTrending = false, bool isPopular = false)
        {
            var namingConfig = _namingService.GetConfig();

            return series.Select(s =>
            {
                var resource = MapToResource(s, namingConfig);

                resource.IsRecommendation = isRecommendation;
                resource.IsTrending = isTrending;
                resource.IsPopular = isPopular;

                return resource;
            }).ToList();
        }

        private ImportListSeriesResource MapToResource(NzbDrone.Core.Tv.Series series, NamingConfig namingConfig = null)
        {
            var resource = series.ToImportListSeriesResource();

            var poster = series.Images.FirstOrDefault(c => c.CoverType == MediaCoverTypes.Poster);

            if (poster != null)
            {
                resource.RemotePoster = poster.RemoteUrl ?? poster.Url;
            }

            // The series isn't in the library, so covers are served through Sonarr's proxy.
            _coverMapper.ConvertToLocalUrls(0, resource.Images);

            resource.Folder = _fileNameBuilder.GetSeriesFolder(series, namingConfig ?? _namingService.GetConfig());

            return resource;
        }
    }
}
