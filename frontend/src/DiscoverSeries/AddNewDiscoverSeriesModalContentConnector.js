import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import AddNewSeriesModalContent from 'AddSeries/AddNewSeries/AddNewSeriesModalContent';
import { addSeries, setAddSeriesDefault } from 'Store/Actions/discoverSeriesActions';
import createDimensionsSelector from 'Store/Selectors/createDimensionsSelector';
import createSystemStatusSelector from 'Store/Selectors/createSystemStatusSelector';
import selectSettings from 'Store/Selectors/selectSettings';

function createMapStateToProps() {
  return createSelector(
    (state) => state.discoverSeries,
    createDimensionsSelector(),
    createSystemStatusSelector(),
    (discoverSeriesState, dimensions, systemStatus) => {
      const {
        isAdding,
        addError,
        defaults
      } = discoverSeriesState;

      const {
        settings,
        validationErrors,
        validationWarnings
      } = selectSettings(defaults, {}, addError);

      return {
        isAdding,
        addError,
        isSmallScreen: dimensions.isSmallScreen,
        validationErrors,
        validationWarnings,
        isWindows: systemStatus.isWindows,
        ...settings
      };
    }
  );
}

const mapDispatchToProps = {
  setAddSeriesDefault,
  addSeries
};

class AddNewDiscoverSeriesModalContentConnector extends Component {

  //
  // Listeners

  onInputChange = ({ name, value }) => {
    this.props.setAddSeriesDefault({ [name]: value });
  };

  onAddSeriesPress = () => {
    const {
      tvdbId,
      rootFolderPath,
      monitor,
      monitorNewItems,
      qualityProfileId,
      seriesType,
      seasonFolder,
      searchForMissingEpisodes,
      searchForCutoffUnmetEpisodes,
      tags
    } = this.props;

    this.props.addSeries({
      tvdbId,
      rootFolderPath: rootFolderPath.value,
      monitor: monitor.value,
      monitorNewItems: monitorNewItems.value,
      qualityProfileId: qualityProfileId.value,
      seriesType: seriesType.value,
      seasonFolder: seasonFolder.value,
      searchForMissingEpisodes: searchForMissingEpisodes.value,
      searchForCutoffUnmetEpisodes: searchForCutoffUnmetEpisodes.value,
      tags: tags.value
    });

    this.props.onModalClose(true);
  };

  //
  // Render

  render() {
    return (
      <AddNewSeriesModalContent
        {...this.props}
        onInputChange={this.onInputChange}
        onAddSeriesPress={this.onAddSeriesPress}
      />
    );
  }
}

AddNewDiscoverSeriesModalContentConnector.propTypes = {
  tvdbId: PropTypes.number.isRequired,
  rootFolderPath: PropTypes.object,
  monitor: PropTypes.object.isRequired,
  monitorNewItems: PropTypes.object.isRequired,
  qualityProfileId: PropTypes.object,
  seriesType: PropTypes.object.isRequired,
  seasonFolder: PropTypes.object.isRequired,
  searchForMissingEpisodes: PropTypes.object.isRequired,
  searchForCutoffUnmetEpisodes: PropTypes.object.isRequired,
  tags: PropTypes.object.isRequired,
  onModalClose: PropTypes.func.isRequired,
  setAddSeriesDefault: PropTypes.func.isRequired,
  addSeries: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(AddNewDiscoverSeriesModalContentConnector);
