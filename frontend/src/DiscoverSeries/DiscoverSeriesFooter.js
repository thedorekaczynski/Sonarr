import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CheckInput from 'Components/Form/CheckInput';
import FormInputGroup from 'Components/Form/FormInputGroup';
import SpinnerButton from 'Components/Link/SpinnerButton';
import PageContentFooter from 'Components/Page/PageContentFooter';
import { inputTypes, kinds } from 'Helpers/Props';
import translate from 'Utilities/String/translate';
import DiscoverSeriesFooterLabel from './DiscoverSeriesFooterLabel';
import ExcludeSeriesModal from './Exclusion/ExcludeSeriesModal';
import styles from './DiscoverSeriesFooter.css';

class DiscoverSeriesFooter extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    const {
      defaultMonitor,
      defaultMonitorNewItems,
      defaultQualityProfileId,
      defaultSeriesType,
      defaultSeasonFolder,
      defaultRootFolderPath,
      defaultSearchForMissingEpisodes
    } = props;

    this.state = {
      monitor: defaultMonitor,
      monitorNewItems: defaultMonitorNewItems,
      qualityProfileId: defaultQualityProfileId,
      seriesType: defaultSeriesType,
      seasonFolder: defaultSeasonFolder,
      rootFolderPath: defaultRootFolderPath,
      searchForMissingEpisodes: defaultSearchForMissingEpisodes,
      isExcludeSeriesModalOpen: false,
      destinationRootFolder: null
    };
  }

  componentDidUpdate(prevProps) {
    const {
      defaultMonitor,
      defaultMonitorNewItems,
      defaultQualityProfileId,
      defaultSeriesType,
      defaultSeasonFolder,
      defaultRootFolderPath,
      defaultSearchForMissingEpisodes
    } = this.props;

    const {
      monitor,
      monitorNewItems,
      qualityProfileId,
      seriesType,
      seasonFolder,
      rootFolderPath,
      searchForMissingEpisodes
    } = this.state;

    const newState = {};

    if (monitor !== defaultMonitor) {
      newState.monitor = defaultMonitor;
    }

    if (qualityProfileId !== defaultQualityProfileId) {
      newState.qualityProfileId = defaultQualityProfileId;
    }

    if (monitorNewItems !== defaultMonitorNewItems) {
      newState.monitorNewItems = defaultMonitorNewItems;
    }

    if (seriesType !== defaultSeriesType) {
      newState.seriesType = defaultSeriesType;
    }

    if (seasonFolder !== defaultSeasonFolder) {
      newState.seasonFolder = defaultSeasonFolder;
    }

    if (rootFolderPath !== defaultRootFolderPath) {
      newState.rootFolderPath = defaultRootFolderPath;
    }

    if (searchForMissingEpisodes !== defaultSearchForMissingEpisodes) {
      newState.searchForMissingEpisodes = defaultSearchForMissingEpisodes;
    }

    if (!_.isEmpty(newState)) {
      this.setState(newState);
    }
  }

  //
  // Listeners

  onExcludeSelectedPress = () => {
    this.setState({ isExcludeSeriesModalOpen: true });
  };

  onExcludeSeriesModalClose = () => {
    this.setState({ isExcludeSeriesModalOpen: false });
  };

  onAddSeriesPress = () => {
    const {
      monitor,
      monitorNewItems,
      qualityProfileId,
      seriesType,
      seasonFolder,
      rootFolderPath,
      searchForMissingEpisodes
    } = this.state;

    const addOptions = {
      monitor,
      monitorNewItems,
      qualityProfileId,
      seriesType,
      seasonFolder,
      rootFolderPath,
      searchForMissingEpisodes,
      tags: []
    };

    this.props.onAddSeriesPress({ addOptions });
  };

  //
  // Render

  render() {
    const {
      selectedIds,
      selectedCount,
      isAdding,
      isExcluding,
      onInputChange
    } = this.props;

    const {
      monitor,
      monitorNewItems,
      qualityProfileId,
      seriesType,
      seasonFolder,
      rootFolderPath,
      searchForMissingEpisodes,
      isExcludeSeriesModalOpen
    } = this.state;

    return (
      <PageContentFooter>
        <div className={styles.inputContainer}>
          <DiscoverSeriesFooterLabel
            label={translate('MonitorSeries')}
            isSaving={isAdding}
          />

          <FormInputGroup
            type={inputTypes.MONITOR_EPISODES_SELECT}
            name="monitor"
            value={monitor}
            isDisabled={!selectedCount}
            onChange={onInputChange}
          />
        </div>

        <div className={styles.inputContainer}>
          <DiscoverSeriesFooterLabel
            label={translate('QualityProfile')}
            isSaving={isAdding}
          />

          <FormInputGroup
            type={inputTypes.QUALITY_PROFILE_SELECT}
            name="qualityProfileId"
            value={qualityProfileId}
            isDisabled={!selectedCount}
            onChange={onInputChange}
          />
        </div>

        <div className={styles.inputContainer}>
          <DiscoverSeriesFooterLabel
            label={translate('MonitorNewSeasons')}
            isSaving={isAdding}
          />

          <FormInputGroup
            type={inputTypes.MONITOR_NEW_ITEMS_SELECT}
            name="monitorNewItems"
            value={monitorNewItems}
            isDisabled={!selectedCount}
            onChange={onInputChange}
          />
        </div>

        <div className={styles.inputContainer}>
          <DiscoverSeriesFooterLabel
            label={translate('SeriesType')}
            isSaving={isAdding}
          />

          <FormInputGroup
            type={inputTypes.SERIES_TYPE_SELECT}
            name="seriesType"
            value={seriesType}
            isDisabled={!selectedCount}
            onChange={onInputChange}
          />
        </div>

        <div className={styles.inputContainer}>
          <DiscoverSeriesFooterLabel
            label={translate('SeasonFolder')}
            isSaving={isAdding}
          />

          <CheckInput
            name="seasonFolder"
            isDisabled={!selectedCount}
            value={seasonFolder}
            onChange={onInputChange}
          />
        </div>

        <div className={styles.inputContainer}>
          <DiscoverSeriesFooterLabel
            label={translate('RootFolder')}
            isSaving={isAdding}
          />

          <FormInputGroup
            type={inputTypes.ROOT_FOLDER_SELECT}
            name="rootFolderPath"
            value={rootFolderPath}
            isDisabled={!selectedCount}
            selectedValueOptions={{ includeFreeSpace: false }}
            onChange={onInputChange}
          />
        </div>

        <div className={styles.inputContainer}>
          <DiscoverSeriesFooterLabel
            label={translate('SearchOnAdd')}
            isSaving={isAdding}
          />

          <CheckInput
            name="searchForMissingEpisodes"
            isDisabled={!selectedCount}
            value={searchForMissingEpisodes}
            onChange={onInputChange}
          />
        </div>

        <div className={styles.buttonContainer}>
          <div className={styles.buttonContainerContent}>
            <DiscoverSeriesFooterLabel
              label={translate('SeriesSelectedInterp', { count: selectedCount })}
              isSaving={false}
            />

            <div className={styles.buttons}>
              <div>
                <SpinnerButton
                  className={styles.addSelectedButton}
                  kind={kinds.PRIMARY}
                  isSpinning={isAdding}
                  isDisabled={!selectedCount || isAdding}
                  onPress={this.onAddSeriesPress}
                >
                  {translate('AddSeries')}
                </SpinnerButton>

                <SpinnerButton
                  className={styles.excludeSelectedButton}
                  kind={kinds.DANGER}
                  isSpinning={isExcluding}
                  isDisabled={!selectedCount || isExcluding}
                  onPress={this.props.onExcludeSeriesPress}
                >
                  {translate('AddExclusion')}
                </SpinnerButton>
              </div>
            </div>
          </div>
        </div>

        <ExcludeSeriesModal
          isOpen={isExcludeSeriesModalOpen}
          seriesIds={selectedIds}
          onModalClose={this.onExcludeSeriesModalClose}
        />
      </PageContentFooter>
    );
  }
}

DiscoverSeriesFooter.propTypes = {
  selectedIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  selectedCount: PropTypes.number.isRequired,
  isAdding: PropTypes.bool.isRequired,
  isExcluding: PropTypes.bool.isRequired,
  defaultMonitor: PropTypes.string.isRequired,
  defaultMonitorNewItems: PropTypes.string,
  defaultQualityProfileId: PropTypes.number,
  defaultSeriesType: PropTypes.string,
  defaultSeasonFolder: PropTypes.bool,
  defaultRootFolderPath: PropTypes.string,
  defaultSearchForMissingEpisodes: PropTypes.bool,
  onInputChange: PropTypes.func.isRequired,
  onAddSeriesPress: PropTypes.func.isRequired,
  onExcludeSeriesPress: PropTypes.func.isRequired
};

export default DiscoverSeriesFooter;
