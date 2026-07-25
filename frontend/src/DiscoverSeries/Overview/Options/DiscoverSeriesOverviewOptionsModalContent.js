import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import Button from 'Components/Link/Button';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import { inputTypes } from 'Helpers/Props';
import translate from 'Utilities/String/translate';

const posterSizeOptions = [
  {
    key: 'small',
    get value() {
      return translate('Small');
    }
  },
  {
    key: 'medium',
    get value() {
      return translate('Medium');
    }
  },
  {
    key: 'large',
    get value() {
      return translate('Large');
    }
  }
];

class DiscoverSeriesOverviewOptionsModalContent extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      size: props.size,
      showYear: props.showYear,
      showNetwork: props.showNetwork,
      showGenres: props.showGenres,
      showRating: props.showRating,
      showCertification: props.showCertification,
      includeRecommendations: props.includeRecommendations,
      includeTrending: props.includeTrending,
      includePopular: props.includePopular
    };
  }

  componentDidUpdate(prevProps) {
    const {
      size,
      showYear,
      showNetwork,
      showGenres,
      showRating,
      showCertification,
      includeRecommendations,
      includeTrending,
      includePopular
    } = this.props;

    const state = {};

    if (size !== prevProps.size) {
      state.size = size;
    }

    if (showYear !== prevProps.showYear) {
      state.showYear = showYear;
    }

    if (showNetwork !== prevProps.showNetwork) {
      state.showNetwork = showNetwork;
    }

    if (showGenres !== prevProps.showGenres) {
      state.showGenres = showGenres;
    }

    if (showRating !== prevProps.showRating) {
      state.showRating = showRating;
    }

    if (showCertification !== prevProps.showCertification) {
      state.showCertification = showCertification;
    }

    if (includeRecommendations !== prevProps.includeRecommendations) {
      state.includeRecommendations = includeRecommendations;
    }

    if (includeTrending !== prevProps.includeTrending) {
      state.includeTrending = includeTrending;
    }

    if (includePopular !== prevProps.includePopular) {
      state.includePopular = includePopular;
    }

    if (!_.isEmpty(state)) {
      this.setState(state);
    }
  }

  //
  // Listeners

  onChangeOverviewOption = ({ name, value }) => {
    this.setState({
      [name]: value
    }, () => {
      this.props.onChangeOverviewOption({ [name]: value });
    });
  };

  onChangeOption = ({ name, value }) => {
    this.setState({
      [name]: value
    }, () => {
      this.props.onChangeOption({
        [name]: value
      });
    });
  };

  //
  // Render

  render() {
    const {
      onModalClose
    } = this.props;

    const {
      size,
      showYear,
      showNetwork,
      showGenres,
      showRating,
      showCertification,
      includeRecommendations,
      includeTrending,
      includePopular
    } = this.state;

    return (
      <ModalContent onModalClose={onModalClose}>
        <ModalHeader>
          {translate('OverviewOptions')}
        </ModalHeader>

        <ModalBody>
          <Form>
            <FormGroup>
              <FormLabel>{translate('IncludeRecommendations')}</FormLabel>

              <FormInputGroup
                type={inputTypes.CHECK}
                name="includeRecommendations"
                value={includeRecommendations}
                helpText={translate('IncludeRecommendationsHelpText')}
                onChange={this.onChangeOption}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>{translate('IncludeTrending')}</FormLabel>

              <FormInputGroup
                type={inputTypes.CHECK}
                name="includeTrending"
                value={includeTrending}
                helpText={translate('IncludeTrendingSeriesHelpText')}
                onChange={this.onChangeOption}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>{translate('IncludePopular')}</FormLabel>

              <FormInputGroup
                type={inputTypes.CHECK}
                name="includePopular"
                value={includePopular}
                helpText={translate('IncludePopularSeriesHelpText')}
                onChange={this.onChangeOption}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>{translate('PosterSize')}</FormLabel>

              <FormInputGroup
                type={inputTypes.SELECT}
                name="size"
                value={size}
                values={posterSizeOptions}
                onChange={this.onChangeOverviewOption}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>{translate('ShowYear')}</FormLabel>

              <FormInputGroup
                type={inputTypes.CHECK}
                name="showYear"
                value={showYear}
                onChange={this.onChangeOverviewOption}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>{translate('ShowNetwork')}</FormLabel>

              <FormInputGroup
                type={inputTypes.CHECK}
                name="showNetwork"
                value={showNetwork}
                onChange={this.onChangeOverviewOption}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>{translate('ShowGenres')}</FormLabel>

              <FormInputGroup
                type={inputTypes.CHECK}
                name="showGenres"
                value={showGenres}
                onChange={this.onChangeOverviewOption}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>{translate('ShowRating')}</FormLabel>

              <FormInputGroup
                type={inputTypes.CHECK}
                name="showRating"
                value={showRating}
                onChange={this.onChangeOverviewOption}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>{translate('ShowCertification')}</FormLabel>

              <FormInputGroup
                type={inputTypes.CHECK}
                name="showCertification"
                value={showCertification}
                onChange={this.onChangeOverviewOption}
              />
            </FormGroup>
          </Form>
        </ModalBody>

        <ModalFooter>
          <Button
            onPress={onModalClose}
          >
            {translate('Close')}
          </Button>
        </ModalFooter>
      </ModalContent>
    );
  }
}

DiscoverSeriesOverviewOptionsModalContent.propTypes = {
  size: PropTypes.string.isRequired,
  showYear: PropTypes.bool.isRequired,
  showNetwork: PropTypes.bool.isRequired,
  showGenres: PropTypes.bool.isRequired,
  showRating: PropTypes.bool.isRequired,
  showCertification: PropTypes.bool.isRequired,
  includeRecommendations: PropTypes.bool.isRequired,
  includeTrending: PropTypes.bool.isRequired,
  includePopular: PropTypes.bool.isRequired,
  onChangeOverviewOption: PropTypes.func.isRequired,
  onChangeOption: PropTypes.func.isRequired,
  onModalClose: PropTypes.func.isRequired
};

export default DiscoverSeriesOverviewOptionsModalContent;
