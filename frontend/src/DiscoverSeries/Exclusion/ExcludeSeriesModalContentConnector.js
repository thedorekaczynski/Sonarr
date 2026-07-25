import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addImportListExclusions } from 'Store/Actions/discoverSeriesActions';
import ExcludeSeriesModalContent from './ExcludeSeriesModalContent';

const mapDispatchToProps = {
  addImportListExclusions
};

class ExcludeSeriesModalContentConnector extends Component {

  //
  // Listeners

  onExcludePress = () => {
    this.props.addImportListExclusions({ ids: [this.props.tvdbId] });

    this.props.onModalClose(true);
  };

  //
  // Render

  render() {
    return (
      <ExcludeSeriesModalContent
        {...this.props}
        onExcludePress={this.onExcludePress}
      />
    );
  }
}

ExcludeSeriesModalContentConnector.propTypes = {
  tvdbId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  onModalClose: PropTypes.func.isRequired,
  addImportListExclusions: PropTypes.func.isRequired
};

export default connect(undefined, mapDispatchToProps)(ExcludeSeriesModalContentConnector);
