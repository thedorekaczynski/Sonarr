import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { setListSeriesOption, setListSeriesPosterOption } from 'Store/Actions/discoverSeriesActions';
import DiscoverSeriesPosterOptionsModalContent from './DiscoverSeriesPosterOptionsModalContent';

function createMapStateToProps() {
  return createSelector(
    (state) => state.discoverSeries,
    (discoverSeries) => {
      return {
        ...discoverSeries.options,
        ...discoverSeries.posterOptions
      };
    }
  );
}

function createMapDispatchToProps(dispatch, props) {
  return {
    onChangePosterOption(payload) {
      dispatch(setListSeriesPosterOption(payload));
    },
    onChangeOption(payload) {
      dispatch(setListSeriesOption(payload));
    }
  };
}

export default connect(createMapStateToProps, createMapDispatchToProps)(DiscoverSeriesPosterOptionsModalContent);
