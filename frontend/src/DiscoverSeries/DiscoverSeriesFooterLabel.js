import PropTypes from 'prop-types';
import React from 'react';
import SpinnerIcon from 'Components/SpinnerIcon';
import { icons } from 'Helpers/Props';
import styles from './DiscoverSeriesFooterLabel.css';

function DiscoverSeriesFooterLabel(props) {
  const {
    className,
    label,
    isSaving
  } = props;

  return (
    <div className={className}>
      {label}

      {
        isSaving &&
          <SpinnerIcon
            className={styles.savingIcon}
            name={icons.SPINNER}
            isSpinning={true}
          />
      }
    </div>
  );
}

DiscoverSeriesFooterLabel.propTypes = {
  className: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  isSaving: PropTypes.bool.isRequired
};

DiscoverSeriesFooterLabel.defaultProps = {
  className: styles.label
};

export default DiscoverSeriesFooterLabel;
