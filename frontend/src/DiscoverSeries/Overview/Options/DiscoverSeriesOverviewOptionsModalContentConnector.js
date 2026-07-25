import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { setListSeriesOption, setListSeriesOverviewOption } from 'Store/Actions/discoverSeriesActions';
import DiscoverSeriesOverviewOptionsModalContent from './DiscoverSeriesOverviewOptionsModalContent';

function createMapStateToProps() {
  return createSelector(
    (state) => state.discoverSeries,
    (discoverSeries) => {
      return {
        ...discoverSeries.options,
        ...discoverSeries.overviewOptions
      };
    }
  );
}

function createMapDispatchToProps(dispatch, props) {
  return {
    onChangeOverviewOption(payload) {
      dispatch(setListSeriesOverviewOption(payload));
    },
    onChangeOption(payload) {
      dispatch(setListSeriesOption(payload));
    }
  };
}

export default connect(createMapStateToProps, createMapDispatchToProps)(DiscoverSeriesOverviewOptionsModalContent);
