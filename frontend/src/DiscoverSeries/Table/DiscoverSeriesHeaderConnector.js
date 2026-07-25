import { connect } from 'react-redux';
import { setListSeriesTableOption } from 'Store/Actions/discoverSeriesActions';
import DiscoverSeriesHeader from './DiscoverSeriesHeader';

function createMapDispatchToProps(dispatch, props) {
  return {
    onTableOptionChange(payload) {
      dispatch(setListSeriesTableOption(payload));
    }
  };
}

export default connect(undefined, createMapDispatchToProps)(DiscoverSeriesHeader);
