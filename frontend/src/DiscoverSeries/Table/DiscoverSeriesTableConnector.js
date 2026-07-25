import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { setListSeriesSort } from 'Store/Actions/discoverSeriesActions';
import DiscoverSeriesTable from './DiscoverSeriesTable';

function createMapStateToProps() {
  return createSelector(
    (state) => state.app.dimensions,
    (state) => state.discoverSeries.columns,
    (dimensions, columns) => {
      return {
        isSmallScreen: dimensions.isSmallScreen,
        columns
      };
    }
  );
}

function createMapDispatchToProps(dispatch, props) {
  return {
    onSortPress(sortKey) {
      dispatch(setListSeriesSort({ sortKey }));
    }
  };
}

export default connect(createMapStateToProps, createMapDispatchToProps)(DiscoverSeriesTable);
