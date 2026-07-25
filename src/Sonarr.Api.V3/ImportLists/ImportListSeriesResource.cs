using System;
using System.Collections.Generic;
using System.Linq;
using NzbDrone.Core.Languages;
using NzbDrone.Core.MediaCover;
using NzbDrone.Core.Tv;
using Sonarr.Http.REST;

namespace Sonarr.Api.V3.ImportLists
{
    public class ImportListSeriesResource : RestResource
    {
        public ImportListSeriesResource()
        {
            Lists = new HashSet<int>();
            Images = new List<MediaCover>();
            Genres = new List<string>();
        }

        public string Title { get; set; }
        public string SortTitle { get; set; }
        public SeriesStatusType Status { get; set; }
        public string Overview { get; set; }
        public string Network { get; set; }
        public string AirTime { get; set; }
        public List<MediaCover> Images { get; set; }
        public string RemotePoster { get; set; }
        public int Year { get; set; }
        public DateTime? FirstAired { get; set; }
        public DateTime? LastAired { get; set; }
        public int Runtime { get; set; }
        public string ImdbId { get; set; }
        public int TvdbId { get; set; }
        public int TmdbId { get; set; }
        public string TitleSlug { get; set; }
        public string Folder { get; set; }
        public string Certification { get; set; }
        public List<string> Genres { get; set; }
        public Ratings Ratings { get; set; }
        public SeriesTypes SeriesType { get; set; }
        public Language OriginalLanguage { get; set; }

        public bool IsExcluded { get; set; }
        public bool IsExisting { get; set; }
        public bool IsRecommendation { get; set; }
        public bool IsTrending { get; set; }
        public bool IsPopular { get; set; }
        public HashSet<int> Lists { get; set; }
    }

    public static class ImportListSeriesResourceMapper
    {
        public static ImportListSeriesResource ToImportListSeriesResource(this NzbDrone.Core.Tv.Series model)
        {
            if (model == null)
            {
                return null;
            }

            return new ImportListSeriesResource
            {
                TvdbId = model.TvdbId,
                TmdbId = model.TmdbId,
                ImdbId = model.ImdbId,
                Title = model.Title,
                SortTitle = model.SortTitle,
                Status = model.Status,
                Overview = model.Overview,
                Network = model.Network,
                AirTime = model.AirTime,

                // Copied so cover proxying doesn't mutate the cached series metadata.
                Images = model.Images.Select(i => new MediaCover(i.CoverType, i.RemoteUrl ?? i.Url)).ToList(),
                Year = model.Year,
                FirstAired = model.FirstAired,
                LastAired = model.LastAired,
                Runtime = model.Runtime,
                TitleSlug = model.TitleSlug,
                Certification = model.Certification,
                Genres = model.Genres,
                Ratings = model.Ratings,
                SeriesType = model.SeriesType,
                OriginalLanguage = model.OriginalLanguage
            };
        }
    }
}
