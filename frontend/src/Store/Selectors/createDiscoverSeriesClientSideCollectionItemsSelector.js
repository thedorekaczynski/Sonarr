import { createSelector } from 'reselect';
import createClientSideCollectionSelector from './createClientSideCollectionSelector';
import createDeepEqualSelector from './createDeepEqualSelector';

function createUnoptimizedSelector(uiSection) {
  return createSelector(
    createClientSideCollectionSelector('discoverSeries', uiSection),
    (series) => {
      const items = series.items.map((s) => {
        const {
          tvdbId,
          sortTitle
        } = s;

        return {
          tvdbId,
          sortTitle
        };
      });

      return {
        ...series,
        items
      };
    }
  );
}

function createDiscoverSeriesClientSideCollectionItemsSelector(uiSection) {
  return createDeepEqualSelector(
    createUnoptimizedSelector(uiSection),
    (series) => series
  );
}

export default createDiscoverSeriesClientSideCollectionItemsSelector;
