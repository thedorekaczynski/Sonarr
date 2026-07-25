import PropTypes from 'prop-types';
import React, { Component } from 'react';
import HeartRating from 'Components/HeartRating';
import Icon from 'Components/Icon';
import ImportListList from 'Components/ImportListList';
import IconButton from 'Components/Link/IconButton';
import Link from 'Components/Link/Link';
import RelativeDateCell from 'Components/Table/Cells/RelativeDateCell';
import VirtualTableRowCell from 'Components/Table/Cells/VirtualTableRowCell';
import VirtualTableSelectCell from 'Components/Table/Cells/VirtualTableSelectCell';
import Popover from 'Components/Tooltip/Popover';
import AddNewDiscoverSeriesModal from 'DiscoverSeries/AddNewDiscoverSeriesModal';
import ExcludeSeriesModal from 'DiscoverSeries/Exclusion/ExcludeSeriesModal';
import { icons } from 'Helpers/Props';
import SeriesDetailsLinks from 'Series/Details/SeriesDetailsLinks';
import formatRuntime from 'Utilities/Number/formatRuntime';
import translate from 'Utilities/String/translate';
import ListSeriesStatusCell from './ListSeriesStatusCell';
import styles from './DiscoverSeriesRow.css';

class DiscoverSeriesRow extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isNewAddSeriesModalOpen: false,
      isExcludeSeriesModalOpen: false
    };
  }

  //
  // Listeners

  onAddSeriesPress = () => {
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

  //
  // Render

  render() {
    const {
      status,
      tvdbId,
      tmdbId,
      imdbId,
      titleSlug,
      title,
      originalLanguage,
      network,
      seriesType,
      firstAired,
      lastAired,
      runtime,
      year,
      overview,
      folder,
      images,
      genres,
      ratings,
      certification,
      columns,
      isExisting,
      isExcluded,
      isRecommendation,
      isTrending,
      isPopular,
      isSelected,
      lists,
      onSelectedChange
    } = this.props;

    const {
      isNewAddSeriesModalOpen,
      isExcludeSeriesModalOpen
    } = this.state;

    const linkProps = isExisting && titleSlug ? { to: `/series/${titleSlug}` } : { onPress: this.onAddSeriesPress };

    return (
      <>
        <VirtualTableSelectCell
          inputClassName={styles.checkInput}
          id={tvdbId}
          key={name}
          isSelected={isSelected}
          isDisabled={false}
          onSelectedChange={onSelectedChange}
        />

        {
          columns.map((column) => {
            const {
              name,
              isVisible
            } = column;

            if (!isVisible) {
              return null;
            }

            if (name === 'status') {
              return (
                <ListSeriesStatusCell
                  key={name}
                  className={styles[name]}
                  status={status}
                  isExclusion={isExcluded}
                  isExisting={isExisting}
                  component={VirtualTableRowCell}
                />
              );
            }

            if (name === 'sortTitle') {
              return (
                <VirtualTableRowCell
                  key={name}
                  className={styles[name]}
                >
                  <Link
                    {...linkProps}
                  >
                    {title}
                  </Link>

                  {
                    isExisting ?
                      <Icon
                        className={styles.alreadyExistsIcon}
                        name={icons.CHECK_CIRCLE}
                        title={translate('AlreadyInYourLibrary')}
                      /> : null
                  }

                  {
                    isExcluded ?
                      <Icon
                        className={styles.exclusionIcon}
                        name={icons.DANGER}
                        title={translate('SeriesExcludedFromAutomaticAdd')}
                      /> : null
                  }
                </VirtualTableRowCell>
              );
            }

            if (name === 'year') {
              return (
                <VirtualTableRowCell key={name} className={styles[name]}>
                  {year}
                </VirtualTableRowCell>
              );
            }

            if (name === 'network') {
              return (
                <VirtualTableRowCell
                  key={name}
                  className={styles[name]}
                >
                  {network}
                </VirtualTableRowCell>
              );
            }

            if (name === 'originalLanguage') {
              return (
                <VirtualTableRowCell key={name} className={styles[name]}>
                  {originalLanguage ? originalLanguage.name : null}
                </VirtualTableRowCell>
              );
            }

            if (name === 'seriesType') {
              return (
                <VirtualTableRowCell
                  key={name}
                  className={styles[name]}
                >
                  {seriesType}
                </VirtualTableRowCell>
              );
            }

            if (name === 'firstAired') {
              return (
                <RelativeDateCell
                  key={name}
                  className={styles[name]}
                  date={firstAired}
                  timeForToday={false}
                  component={VirtualTableRowCell}
                />
              );
            }

            if (name === 'lastAired') {
              return (
                <RelativeDateCell
                  key={name}
                  className={styles[name]}
                  date={lastAired}
                  timeForToday={false}
                  component={VirtualTableRowCell}
                />
              );
            }

            if (name === 'runtime') {
              return (
                <VirtualTableRowCell
                  key={name}
                  className={styles[name]}
                >
                  {formatRuntime(runtime)}
                </VirtualTableRowCell>
              );
            }

            if (name === 'genres') {
              const joinedGenres = genres.join(', ');

              return (
                <VirtualTableRowCell
                  key={name}
                  className={styles[name]}
                >
                  <span title={joinedGenres}>
                    {joinedGenres}
                  </span>
                </VirtualTableRowCell>
              );
            }

            if (name === 'ratings') {
              return (
                <VirtualTableRowCell
                  key={name}
                  className={styles[name]}
                >
                  {ratings && ratings.value ?
                    <HeartRating rating={ratings.value} votes={ratings.votes} /> :
                    null}
                </VirtualTableRowCell>
              );
            }

            if (name === 'certification') {
              return (
                <VirtualTableRowCell
                  key={name}
                  className={styles[name]}
                >
                  {certification}
                </VirtualTableRowCell>
              );
            }

            if (name === 'lists') {
              return (
                <VirtualTableRowCell
                  key={name}
                  className={styles[name]}
                >
                  <ImportListList
                    lists={lists}
                  />
                </VirtualTableRowCell>
              );
            }

            if (name === 'isRecommendation') {
              return (
                <VirtualTableRowCell
                  key={name}
                  className={styles[name]}
                >
                  {
                    isRecommendation ?
                      <Icon
                        className={styles.statusIcon}
                        name={icons.RECOMMENDED}
                        size={12}
                        title={translate('SeriesIsRecommend')}
                      /> :
                      null
                  }
                </VirtualTableRowCell>
              );
            }

            if (name === 'isTrending') {
              return (
                <VirtualTableRowCell
                  key={name}
                  className={styles[name]}
                >
                  {
                    isTrending ?
                      <Icon
                        className={styles.statusIcon}
                        name={icons.TRENDING}
                        size={12}
                        title={translate('SeriesIsTrending')}
                      /> :
                      null
                  }
                </VirtualTableRowCell>
              );
            }

            if (name === 'isPopular') {
              return (
                <VirtualTableRowCell
                  key={name}
                  className={styles[name]}
                >
                  {
                    isPopular ?
                      <Icon
                        className={styles.statusIcon}
                        name={icons.POPULAR}
                        size={12}
                        title={translate('SeriesIsPopular')}
                      /> :
                      null
                  }
                </VirtualTableRowCell>
              );
            }

            if (name === 'actions') {
              return (
                <VirtualTableRowCell
                  key={name}
                  className={styles[name]}
                >
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

                  <IconButton
                    name={icons.REMOVE}
                    title={isExcluded ? translate('SeriesAlreadyExcluded') : translate('ExcludeSeries')}
                    onPress={this.onExcludeSeriesPress}
                    isDisabled={isExcluded}
                  />
                </VirtualTableRowCell>
              );
            }

            return null;
          })
        }

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
      </>
    );
  }
}

DiscoverSeriesRow.propTypes = {
  tvdbId: PropTypes.number.isRequired,
  tmdbId: PropTypes.number,
  imdbId: PropTypes.string,
  titleSlug: PropTypes.string,
  status: PropTypes.string,
  title: PropTypes.string.isRequired,
  originalLanguage: PropTypes.object,
  year: PropTypes.number,
  overview: PropTypes.string,
  folder: PropTypes.string,
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  network: PropTypes.string,
  seriesType: PropTypes.string,
  firstAired: PropTypes.string,
  lastAired: PropTypes.string,
  runtime: PropTypes.number,
  genres: PropTypes.arrayOf(PropTypes.string).isRequired,
  ratings: PropTypes.object,
  certification: PropTypes.string,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  isExisting: PropTypes.bool.isRequired,
  isExcluded: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool,
  isRecommendation: PropTypes.bool.isRequired,
  isPopular: PropTypes.bool.isRequired,
  isTrending: PropTypes.bool.isRequired,
  lists: PropTypes.arrayOf(PropTypes.number).isRequired,
  onSelectedChange: PropTypes.func.isRequired
};

DiscoverSeriesRow.defaultProps = {
  genres: [],
  lists: []
};

export default DiscoverSeriesRow;
