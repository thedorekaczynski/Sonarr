import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import * as commandNames from 'Commands/commandNames';
import withScrollPosition from 'Components/withScrollPosition';
import { executeCommand } from 'Store/Actions/commandActions';
import { addImportListExclusions, addSeriesList, clearAddSeries, fetchDiscoverSeries, setListSeriesFilter, setListSeriesSort, setListSeriesTableOption, setListSeriesView } from 'Store/Actions/discoverSeriesActions';
import { fetchRootFolders } from 'Store/Actions/rootFolderActions';
import scrollPositions from 'Store/scrollPositions';
import createCommandExecutingSelector from 'Store/Selectors/createCommandExecutingSelector';
import createDimensionsSelector from 'Store/Selectors/createDimensionsSelector';
import createDiscoverSeriesClientSideCollectionItemsSelector from 'Store/Selectors/createDiscoverSeriesClientSideCollectionItemsSelector';
import { registerPagePopulator, unregisterPagePopulator } from 'Utilities/pagePopulator';
import DiscoverSeries from './DiscoverSeries';

function createMapStateToProps() {
  return createSelector(
    (state) => state.discoverSeries,
    createDiscoverSeriesClientSideCollectionItemsSelector('discoverSeries'),
    createCommandExecutingSelector(commandNames.IMPORT_LIST_SYNC),
    createDimensionsSelector(),
    (
      discoverSeries,
      series,
      isSyncingLists,
      dimensionsState
    ) => {
      return {
        ...discoverSeries.options,
        ...series,
        isSyncingLists,
        isSmallScreen: dimensionsState.isSmallScreen
      };
    }
  );
}

function createMapDispatchToProps(dispatch, props) {
  return {
    dispatchFetchRootFolders() {
      dispatch(fetchRootFolders());
    },

    dispatchClearListSeries() {
      dispatch(clearAddSeries());
    },

    dispatchFetchListSeries() {
      dispatch(fetchDiscoverSeries());
    },

    onTableOptionChange(payload) {
      dispatch(setListSeriesTableOption(payload));
    },

    onSortSelect(sortKey) {
      dispatch(setListSeriesSort({ sortKey }));
    },

    onFilterSelect(selectedFilterKey) {
      dispatch(setListSeriesFilter({ selectedFilterKey }));
    },

    dispatchSetListSeriesView(view) {
      dispatch(setListSeriesView({ view }));
    },

    dispatchAddSeries(ids, addOptions) {
      dispatch(addSeriesList({ ids, addOptions }));
    },

    dispatchAddImportListExclusions(exclusions) {
      dispatch(addImportListExclusions(exclusions));
    },

    onImportListSyncPress() {
      dispatch(executeCommand({
        name: commandNames.IMPORT_LIST_SYNC,
        commandFinished: this.dispatchFetchListSeries
      }));
    }
  };
}

class DiscoverSeriesConnector extends Component {

  //
  // Lifecycle

  componentDidMount() {
    registerPagePopulator(this.repopulate);
    this.props.dispatchFetchRootFolders();
    this.props.dispatchFetchListSeries();
  }

  componentWillUnmount() {
    this.props.dispatchClearListSeries();
    unregisterPagePopulator(this.repopulate);
  }

  //
  // Listeners

  onViewSelect = (view) => {
    this.props.dispatchSetListSeriesView(view);
  };

  onScroll = ({ scrollTop }) => {
    scrollPositions.discoverSeries = scrollTop;
  };

  onAddSeriesPress = ({ ids, addOptions }) => {
    this.props.dispatchAddSeries(ids, addOptions);
  };

  onExcludeSeriesPress =({ ids }) => {
    this.props.dispatchAddImportListExclusions({ ids });
  };

  //
  // Render

  render() {
    return (
      <DiscoverSeries
        {...this.props}
        onViewSelect={this.onViewSelect}
        onScroll={this.onScroll}
        onAddSeriesPress={this.onAddSeriesPress}
        onExcludeSeriesPress={this.onExcludeSeriesPress}
        onSyncListsPress={this.onSyncListsPress}
      />
    );
  }
}

DiscoverSeriesConnector.propTypes = {
  isSmallScreen: PropTypes.bool.isRequired,
  view: PropTypes.string.isRequired,
  dispatchFetchRootFolders: PropTypes.func.isRequired,
  dispatchFetchListSeries: PropTypes.func.isRequired,
  dispatchClearListSeries: PropTypes.func.isRequired,
  dispatchSetListSeriesView: PropTypes.func.isRequired,
  dispatchAddSeries: PropTypes.func.isRequired,
  dispatchAddImportListExclusions: PropTypes.func.isRequired
};

export default withScrollPosition(
  connect(createMapStateToProps, createMapDispatchToProps)(DiscoverSeriesConnector),
  'discoverSeries'
);
