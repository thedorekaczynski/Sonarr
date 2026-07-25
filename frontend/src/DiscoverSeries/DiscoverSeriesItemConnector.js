import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import createDiscoverSeriesSelector from 'Store/Selectors/createDiscoverSeriesSelector';

function createMapStateToProps() {
  return createSelector(
    createDiscoverSeriesSelector(),
    (
      series
    ) => {

      // If a series is deleted this selector may fire before the parent
      // selectors, which will result in an undefined series, if that happens
      // we want to return early here and again in the render function to avoid
      // trying to show a series that has no information available.

      if (!series) {
        return {};
      }

      return {
        ...series
      };
    }
  );
}

class DiscoverSeriesItemConnector extends Component {

  //
  // Render

  render() {
    const {
      tvdbId,
      component: ItemComponent,
      ...otherProps
    } = this.props;

    if (!tvdbId) {
      return null;
    }

    return (
      <ItemComponent
        {...otherProps}
        tvdbId={tvdbId}
      />
    );
  }
}

DiscoverSeriesItemConnector.propTypes = {
  tvdbId: PropTypes.number,
  component: PropTypes.elementType.isRequired
};

export default connect(createMapStateToProps)(DiscoverSeriesItemConnector);
