import PropTypes from 'prop-types';
import React, { Component } from 'react';
import VirtualTableRowCell from 'Components/Table/Cells/VirtualTableRowCell';

class DiscoverSeriesActionsCell extends Component {

  //
  // Render

  render() {
    const {
      id,
      ...otherProps
    } = this.props;

    return (
      <VirtualTableRowCell
        {...otherProps}
      >
        {/* <SpinnerIconButton
          name={icons.REFRESH}
          title="Refresh Series"
          isSpinning={isRefreshingSeries}
          onPress={onRefreshSeriesPress}
        />

        <IconButton
          name={icons.EDIT}
          title="Edit Series"
          onPress={this.onEditSeriesPress}
        /> */}

        {/* <EditSeriesModalConnector
          isOpen={isEditSeriesModalOpen}
          seriesId={id}
          onModalClose={this.onEditSeriesModalClose}
          onDeleteSeriesPress={this.onDeleteSeriesPress}
        />

        <DeleteSeriesModal
          isOpen={isDeleteSeriesModalOpen}
          seriesId={id}
          onModalClose={this.onDeleteSeriesModalClose}
        /> */}
      </VirtualTableRowCell>
    );
  }
}

DiscoverSeriesActionsCell.propTypes = {
  id: PropTypes.number.isRequired
};

export default DiscoverSeriesActionsCell;
