import { createSelector } from 'reselect';

function createDiscoverSeriesSelector() {
  return createSelector(
    (state, { seriesId }) => seriesId,
    (state) => state.discoverSeries,
    (seriesId, allSeries) => {
      return allSeries.items.find((series) => series.tvdbId === seriesId);
    }
  );
}

export default createDiscoverSeriesSelector;
