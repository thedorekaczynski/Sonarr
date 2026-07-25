import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { setListSeriesOption } from 'Store/Actions/discoverSeriesActions';
import DiscoverSeriesTableOptions from './DiscoverSeriesTableOptions';

function createMapStateToProps() {
  return createSelector(
    (state) => state.discoverSeries,
    (discoverSeries) => {
      return discoverSeries.options;
    }
  );
}

function createMapDispatchToProps(dispatch, props) {
  return {
    onChangeOption(payload) {
      dispatch(setListSeriesOption(payload));
    }
  };
}

export default connect(createMapStateToProps, createMapDispatchToProps)(DiscoverSeriesTableOptions);

