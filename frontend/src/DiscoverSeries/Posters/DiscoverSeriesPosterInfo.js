import PropTypes from 'prop-types';
import React from 'react';
import HeartRating from 'Components/HeartRating';
import { getSeriesStatusDetails } from 'Series/SeriesStatus';
import getRelativeDate from 'Utilities/Date/getRelativeDate';
import formatRuntime from 'Utilities/Number/formatRuntime';
import translate from 'Utilities/String/translate';
import styles from './DiscoverSeriesPosterInfo.css';

function DiscoverSeriesPosterInfo(props) {
  const {
    status,
    network,
    originalLanguage,
    seriesType,
    firstAired,
    lastAired,
    certification,
    runtime,
    ratings,
    sortKey,
    showRelativeDates,
    shortDateFormat,
    timeFormat,
    showNetwork,
    showRating
  } = props;

  if (sortKey === 'status' && status) {
    return (
      <div className={styles.info} title={translate('Status')}>
        {getSeriesStatusDetails(status).title}
      </div>
    );
  }

  if (!showNetwork && sortKey === 'network' && network) {
    return (
      <div className={styles.info} title={translate('Network')}>
        {network}
      </div>
    );
  }

  if (sortKey === 'originalLanguage' && !!originalLanguage?.name) {
    return (
      <div className={styles.info} title={translate('OriginalLanguage')}>
        {originalLanguage.name}
      </div>
    );
  }

  if (sortKey === 'seriesType' && seriesType) {
    return (
      <div className={styles.info} title={translate('Type')}>
        {seriesType}
      </div>
    );
  }

  if (sortKey === 'firstAired' && firstAired) {
    const firstAiredDate = getRelativeDate({
      date: firstAired,
      shortDateFormat,
      showRelativeDates,
      timeFormat,
      timeForToday: false
    });

    return (
      <div className={styles.info} title={translate('FirstAired')}>
        {firstAiredDate}
      </div>
    );
  }

  if (sortKey === 'lastAired' && lastAired) {
    const lastAiredDate = getRelativeDate({
      date: lastAired,
      shortDateFormat,
      showRelativeDates,
      timeFormat,
      timeForToday: false
    });

    return (
      <div className={styles.info} title={translate('LastAired')}>
        {lastAiredDate}
      </div>
    );
  }

  if (sortKey === 'certification' && certification) {
    return (
      <div className={styles.info} title={translate('Certification')}>
        {certification}
      </div>
    );
  }

  if (sortKey === 'runtime' && runtime) {
    return (
      <div className={styles.info} title={translate('Runtime')}>
        {formatRuntime(runtime)}
      </div>
    );
  }

  if (!showRating && sortKey === 'ratings' && !!ratings?.value) {
    return (
      <div className={styles.info}>
        <HeartRating rating={ratings.value} votes={ratings.votes}
          iconSize={12}
        />
      </div>
    );
  }

  return null;
}

DiscoverSeriesPosterInfo.propTypes = {
  status: PropTypes.string,
  network: PropTypes.string,
  originalLanguage: PropTypes.object,
  seriesType: PropTypes.string,
  firstAired: PropTypes.string,
  lastAired: PropTypes.string,
  certification: PropTypes.string,
  runtime: PropTypes.number,
  ratings: PropTypes.object,
  sortKey: PropTypes.string.isRequired,
  showRelativeDates: PropTypes.bool.isRequired,
  shortDateFormat: PropTypes.string.isRequired,
  timeFormat: PropTypes.string.isRequired,
  showNetwork: PropTypes.bool.isRequired,
  showRating: PropTypes.bool.isRequired
};

export default DiscoverSeriesPosterInfo;
