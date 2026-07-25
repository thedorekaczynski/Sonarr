import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FilterModal from 'Components/Filter/FilterModal';
import { setListSeriesFilter } from 'Store/Actions/discoverSeriesActions';

function createMapStateToProps() {
  return createSelector(
    (state) => state.discoverSeries.items,
    (state) => state.discoverSeries.filterBuilderProps,
    (sectionItems, filterBuilderProps) => {
      return {
        sectionItems,
        filterBuilderProps,
        customFilterType: 'discoverSeries'
      };
    }
  );
}

const mapDispatchToProps = {
  dispatchSetFilter: setListSeriesFilter
};

export default connect(createMapStateToProps, mapDispatchToProps)(FilterModal);
