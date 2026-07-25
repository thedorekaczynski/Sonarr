using System.Collections.Generic;
using NzbDrone.Core.Tv;

namespace NzbDrone.Core.MetadataSource.Tmdb
{
    public interface IProvideSeriesDiscoverInfo
    {
        bool IsConfigured { get; }
        List<Series> GetTrendingSeries();
        List<Series> GetPopularSeries();
        List<Series> GetRecommendedSeries(List<int> seedTmdbIds);
    }
}
