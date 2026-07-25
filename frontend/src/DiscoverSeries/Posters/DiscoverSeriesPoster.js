import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CheckInput from 'Components/Form/CheckInput';
import HeartRating from 'Components/HeartRating';
import Icon from 'Components/Icon';
import Label from 'Components/Label';
import IconButton from 'Components/Link/IconButton';
import Link from 'Components/Link/Link';
import Popover from 'Components/Tooltip/Popover';
import AddNewDiscoverSeriesModal from 'DiscoverSeries/AddNewDiscoverSeriesModal';
import ExcludeSeriesModal from 'DiscoverSeries/Exclusion/ExcludeSeriesModal';
import { icons } from 'Helpers/Props';
import SeriesDetailsLinks from 'Series/Details/SeriesDetailsLinks';
import SeriesPoster from 'Series/SeriesPoster';
import translate from 'Utilities/String/translate';
import DiscoverSeriesPosterInfo from './DiscoverSeriesPosterInfo';
import styles from './DiscoverSeriesPoster.css';

class DiscoverSeriesPoster extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      hasPosterError: false,
      isNewAddSeriesModalOpen: false,
      isExcludeSeriesModalOpen: false
    };
  }

  //
  // Listeners

  onPress = () => {
    this.setState({ isNewAddSeriesModalOpen: true });
  };

  onAddSeriesModalClose = () => {
    this.setState({ isNewAddSeriesModalOpen: false });
  };

  onExcludeSeriesPress = () => {
    this.setState({ isExcludeSeriesModalOpen: true });
  };

  onExcludeSeriesModalClose = () => {
    this.setState({ isExcludeSeriesModalOpen: false });
  };

  onPosterLoad = () => {
    if (this.state.hasPosterError) {
      this.setState({ hasPosterError: false });
    }
  };

  onPosterLoadError = () => {
    if (!this.state.hasPosterError) {
      this.setState({ hasPosterError: true });
    }
  };

  onChange = ({ value, shiftKey }) => {
    const {
      tvdbId,
      onSelectedChange
    } = this.props;

    onSelectedChange({ id: tvdbId, value, shiftKey });
  };

  //
  // Render

  render() {
    const {
      tvdbId,
      tmdbId,
      imdbId,
      titleSlug,
      seriesType,
      title,
      year,
      overview,
      folder,
      images,
      posterWidth,
      posterHeight,
      showTitle,
      showNetwork,
      showRating,
      ratings,
      isExisting,
      isExcluded,
      isSelected,
      showRelativeDates,
      shortDateFormat,
      timeFormat,
      ...otherProps
    } = this.props;

    const {
      hasPosterError,
      isNewAddSeriesModalOpen,
      isExcludeSeriesModalOpen
    } = this.state;

    const linkProps = isExisting && titleSlug ? { to: `/series/${titleSlug}` } : { onPress: this.onPress };

    const elementStyle = {
      width: `${posterWidth}px`,
      height: `${posterHeight}px`
    };

    return (
      <div className={styles.content}>
        <div className={styles.posterContainer} title={title}>
          {
            <div className={styles.editorSelect}>
              <CheckInput
                className={styles.checkInput}
                name={tvdbId.toString()}
                value={isSelected}
                onChange={this.onChange}
              />
            </div>
          }

          <Label className={styles.controls}>
            <IconButton
              className={styles.action}
              name={icons.REMOVE}
              title={isExcluded ? translate('SeriesAlreadyExcluded') : translate('ExcludeSeries')}
              onPress={this.onExcludeSeriesPress}
              isDisabled={isExcluded}
            />
            <span className={styles.externalLinks}>
              <Popover
                anchor={
                  <Icon
                    name={icons.EXTERNAL_LINK}
                    size={12}
                  />
                }
                title={translate('Links')}
                body={
                  <SeriesDetailsLinks
                    tvdbId={tvdbId}
                    tmdbId={tmdbId}
                    imdbId={imdbId}
                  />
                }
              />
            </span>
          </Label>

          {
            isExcluded &&
              <div
                className={styles.excluded}
                title={translate('Excluded')}
              />
          }

          {
            isExisting &&
              <div
                className={styles.existing}
                title={translate('Existing')}
              />
          }

          <Link
            className={styles.link}
            style={elementStyle}
            {...linkProps}
          >
            <SeriesPoster
              className={styles.poster}
              style={elementStyle}
              images={images}
              size={250}
              lazy={false}
              overflow={true}
              onError={this.onPosterLoadError}
              onLoad={this.onPosterLoad}
            />

            {
              hasPosterError &&
                <div className={styles.overlayTitle}>
                  {title}
                </div>
            }
          </Link>
        </div>

        {showTitle ?
          <div className={styles.title} title={title}>
            {title}
          </div> :
          null}

        {showRating && !!ratings?.value ? (
          <div className={styles.title}>
            <HeartRating rating={ratings.value} votes={ratings.votes}
              iconSize={12}
            />
          </div>
        ) : null}

        <DiscoverSeriesPosterInfo
          showRelativeDates={showRelativeDates}
          shortDateFormat={shortDateFormat}
          timeFormat={timeFormat}
          ratings={ratings}
          seriesType={seriesType}
          showNetwork={showNetwork}
          showRating={showRating}
          {...otherProps}
        />

        <AddNewDiscoverSeriesModal
          isOpen={isNewAddSeriesModalOpen && !isExisting}
          tvdbId={tvdbId}
          initialSeriesType={seriesType}
          title={title}
          year={year}
          overview={overview}
          folder={folder}
          images={images}
          onModalClose={this.onAddSeriesModalClose}
        />

        <ExcludeSeriesModal
          isOpen={isExcludeSeriesModalOpen}
          tvdbId={tvdbId}
          title={title}
          year={year}
          onModalClose={this.onExcludeSeriesModalClose}
        />
      </div>
    );
  }
}

DiscoverSeriesPoster.propTypes = {
  tvdbId: PropTypes.number.isRequired,
  tmdbId: PropTypes.number,
  imdbId: PropTypes.string,
  titleSlug: PropTypes.string,
  seriesType: PropTypes.string,
  title: PropTypes.string.isRequired,
  year: PropTypes.number,
  overview: PropTypes.string,
  folder: PropTypes.string,
  status: PropTypes.string,
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  posterWidth: PropTypes.number.isRequired,
  posterHeight: PropTypes.number.isRequired,
  showTitle: PropTypes.bool.isRequired,
  showNetwork: PropTypes.bool.isRequired,
  showRating: PropTypes.bool.isRequired,
  ratings: PropTypes.object,
  showRelativeDates: PropTypes.bool.isRequired,
  shortDateFormat: PropTypes.string.isRequired,
  timeFormat: PropTypes.string.isRequired,
  isExisting: PropTypes.bool.isRequired,
  isExcluded: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool,
  onSelectedChange: PropTypes.func.isRequired
};

export default DiscoverSeriesPoster;
