import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { setAddSeriesDefault } from 'Store/Actions/discoverSeriesActions';
import DiscoverSeriesFooter from './DiscoverSeriesFooter';

function createMapStateToProps() {
  return createSelector(
    (state) => state.discoverSeries,
    (state) => state.settings.importListExclusions,
    (state, { selectedIds }) => selectedIds,
    (discoverSeries, importListExclusions, selectedIds) => {
      const {
        monitor: defaultMonitor,
        monitorNewItems: defaultMonitorNewItems,
        qualityProfileId: defaultQualityProfileId,
        seriesType: defaultSeriesType,
        seasonFolder: defaultSeasonFolder,
        rootFolderPath: defaultRootFolderPath,
        searchForMissingEpisodes: defaultSearchForMissingEpisodes
      } = discoverSeries.defaults;

      const {
        isAdding
      } = discoverSeries;

      const {
        isSaving
      } = importListExclusions;

      return {
        selectedCount: selectedIds.length,
        isAdding,
        isExcluding: isSaving,
        defaultMonitor,
        defaultMonitorNewItems,
        defaultQualityProfileId,
        defaultSeriesType,
        defaultSeasonFolder,
        defaultRootFolderPath,
        defaultSearchForMissingEpisodes
      };
    }
  );
}

const mapDispatchToProps = {
  setAddSeriesDefault
};

class DiscoverSeriesFooterConnector extends Component {

  //
  // Listeners

  onInputChange = ({ name, value }) => {
    this.props.setAddSeriesDefault({ [name]: value });
  };

  //
  // Render

  render() {
    return (
      <DiscoverSeriesFooter
        {...this.props}
        onInputChange={this.onInputChange}
      />
    );
  }
}

DiscoverSeriesFooterConnector.propTypes = {
  setAddSeriesDefault: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(DiscoverSeriesFooterConnector);
