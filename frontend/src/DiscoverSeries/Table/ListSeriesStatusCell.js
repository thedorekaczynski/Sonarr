import PropTypes from 'prop-types';
import React from 'react';
import Icon from 'Components/Icon';
import VirtualTableRowCell from 'Components/Table/Cells/TableRowCell';
import { getSeriesStatusDetails } from 'Series/SeriesStatus';
import styles from './ListSeriesStatusCell.css';

function ListSeriesStatusCell(props) {
  const {
    className,
    status,
    component: Component,
    ...otherProps
  } = props;

  const statusDetails = getSeriesStatusDetails(status);

  return (
    <Component
      className={className}
      {...otherProps}
    >
      <Icon
        className={styles.statusIcon}
        name={statusDetails.icon}
        title={`${statusDetails.title}: ${statusDetails.message}`}
      />

    </Component>
  );
}

ListSeriesStatusCell.propTypes = {
  className: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  component: PropTypes.elementType
};

ListSeriesStatusCell.defaultProps = {
  className: styles.status,
  component: VirtualTableRowCell
};

export default ListSeriesStatusCell;
