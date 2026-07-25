import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { icons } from 'Helpers/Props';
import dimensions from 'Styles/Variables/dimensions';
import translate from 'Utilities/String/translate';
import DiscoverSeriesOverviewInfoRow from './DiscoverSeriesOverviewInfoRow';
import styles from './DiscoverSeriesOverviewInfo.css';

const infoRowHeight = parseInt(dimensions.seriesIndexOverviewInfoRowHeight);

const rows = [
  {
    name: 'year',
    showProp: 'showYear',
    valueProp: 'year'
  },
  {
    name: 'network',
    showProp: 'showNetwork',
    valueProp: 'network'
  },
  {
    name: 'genres',
    showProp: 'showGenres',
    valueProp: 'genres'
  },
  {
    name: 'ratings',
    showProp: 'showRating',
    valueProp: 'ratings.value'
  },
  {
    name: 'certification',
    showProp: 'showCertification',
    valueProp: 'certification'
  }
];

function isVisible(row, props) {
  const {
    name,
    showProp,
    valueProp
  } = row;

  return _.has(props, valueProp) && _.get(props, valueProp) !== null && (props[showProp] || props.sortKey === name);
}

function getInfoRowProps(row, props) {
  const { name } = row;

  if (name === 'year') {
    return {
      title: translate('Year'),
      iconName: icons.CALENDAR,
      label: props.year
    };
  }

  if (name === 'network') {
    return {
      title: translate('Network'),
      iconName: icons.NETWORK,
      label: props.network
    };
  }

  if (name === 'genres') {
    return {
      title: translate('Genres'),
      iconName: icons.GENRE,
      label: props.genres.slice(0, 2).join(', ')
    };
  }

  if (name === 'ratings' && !!props.ratings) {
    return {
      title: translate('Rating'),
      iconName: icons.HEART,
      label: `${(props.ratings.value * 10).toFixed()}%`
    };
  }

  if (name === 'certification') {
    return {
      title: translate('Certification'),
      iconName: icons.FILM,
      label: props.certification
    };
  }
}

function DiscoverSeriesOverviewInfo(props) {
  const {
    height
  } = props;

  let shownRows = 1;
  const maxRows = Math.floor(height / (infoRowHeight + 4));

  return (
    <div className={styles.infos}>
      {
        rows.map((row) => {
          if (!isVisible(row, props)) {
            return null;
          }

          if (shownRows >= maxRows) {
            return null;
          }

          shownRows++;

          const infoRowProps = getInfoRowProps(row, props);

          return (
            <DiscoverSeriesOverviewInfoRow
              key={row.name}
              {...infoRowProps}
            />
          );
        })
      }
    </div>
  );
}

DiscoverSeriesOverviewInfo.propTypes = {
  height: PropTypes.number.isRequired,
  showYear: PropTypes.bool.isRequired,
  showNetwork: PropTypes.bool.isRequired,
  showGenres: PropTypes.bool.isRequired,
  showRating: PropTypes.bool.isRequired,
  showCertification: PropTypes.bool.isRequired,
  network: PropTypes.string,
  year: PropTypes.number,
  certification: PropTypes.string,
  ratings: PropTypes.object,
  genres: PropTypes.arrayOf(PropTypes.string).isRequired,
  sortKey: PropTypes.string.isRequired
};

export default DiscoverSeriesOverviewInfo;
