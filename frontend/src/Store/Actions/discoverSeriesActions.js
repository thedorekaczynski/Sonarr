import _ from 'lodash';
import moment from 'moment/moment';
import { createAction } from 'redux-actions';
import { batchActions } from 'redux-batched-actions';
import { filterBuilderTypes, filterBuilderValueTypes, filterTypes, sortDirections } from 'Helpers/Props';
import { createThunk, handleThunks } from 'Store/thunks';
import sortByProp from 'Utilities/Array/sortByProp';
import createAjaxRequest from 'Utilities/createAjaxRequest';
import getNewSeries from 'Utilities/Series/getNewSeries';
import monitorOptions from 'Utilities/Series/monitorOptions';
import * as seriesTypes from 'Utilities/Series/seriesTypes';
import getSectionState from 'Utilities/State/getSectionState';
import updateSectionState from 'Utilities/State/updateSectionState';
import translate from 'Utilities/String/translate';
import { removeItem, set, update, updateItem } from './baseActions';
import createHandleActions from './Creators/createHandleActions';
import createClearReducer from './Creators/Reducers/createClearReducer';
import createSetClientSideCollectionFilterReducer from './Creators/Reducers/createSetClientSideCollectionFilterReducer';
import createSetClientSideCollectionSortReducer from './Creators/Reducers/createSetClientSideCollectionSortReducer';
import createSetSettingValueReducer from './Creators/Reducers/createSetSettingValueReducer';
import createSetTableOptionReducer from './Creators/Reducers/createSetTableOptionReducer';
import { filterPredicates } from './seriesActions';

//
// Variables

export const section = 'discoverSeries';

//
// State

export const defaultState = {
  isFetching: false,
  isPopulated: false,
  error: null,
  isAdding: false,
  isAdded: false,
  addError: null,
  items: [],
  sortKey: 'sortTitle',
  sortDirection: sortDirections.ASCENDING,
  secondarySortKey: 'sortTitle',
  secondarySortDirection: sortDirections.ASCENDING,
  view: 'overview',

  options: {
    includeRecommendations: true,
    includeTrending: true,
    includePopular: true
  },

  defaults: {
    rootFolderPath: '',
    monitor: monitorOptions[0].key,
    monitorNewItems: 'all',
    qualityProfileId: 0,
    seriesType: seriesTypes.STANDARD,
    seasonFolder: true,
    searchForMissingEpisodes: false,
    searchForCutoffUnmetEpisodes: false,
    tags: []
  },

  posterOptions: {
    size: 'large',
    showTitle: false,
    showNetwork: true,
    showRating: false
  },

  overviewOptions: {
    size: 'medium',
    showYear: true,
    showNetwork: true,
    showGenres: true,
    showRating: false,
    showCertification: true
  },

  tableOptions: {
  },

  columns: [
    {
      name: 'status',
      columnLabel: () => translate('Status'),
      isSortable: true,
      isVisible: true,
      isModifiable: false
    },
    {
      name: 'isRecommendation',
      columnLabel: () => translate('Recommendation'),
      isSortable: true,
      isVisible: true,
      isModifiable: false
    },
    {
      name: 'isTrending',
      columnLabel: () => translate('Trending'),
      isSortable: true,
      isVisible: true,
      isModifiable: false
    },
    {
      name: 'isPopular',
      columnLabel: () => translate('Popular'),
      isSortable: true,
      isVisible: true,
      isModifiable: false
    },
    {
      name: 'sortTitle',
      label: () => translate('SeriesTitle'),
      isSortable: true,
      isVisible: true,
      isModifiable: false
    },
    {
      name: 'originalLanguage',
      label: () => translate('OriginalLanguage'),
      isSortable: true,
      isVisible: false
    },
    {
      name: 'network',
      label: () => translate('Network'),
      isSortable: true,
      isVisible: true
    },
    {
      name: 'seriesType',
      label: () => translate('Type'),
      isSortable: true,
      isVisible: false
    },
    {
      name: 'year',
      label: () => translate('Year'),
      isSortable: true,
      isVisible: false
    },
    {
      name: 'firstAired',
      label: () => translate('FirstAired'),
      isSortable: true,
      isVisible: true
    },
    {
      name: 'lastAired',
      label: () => translate('LastAired'),
      isSortable: true,
      isVisible: false
    },
    {
      name: 'runtime',
      label: () => translate('Runtime'),
      isSortable: true,
      isVisible: false
    },
    {
      name: 'genres',
      label: () => translate('Genres'),
      isSortable: false,
      isVisible: false
    },
    {
      name: 'ratings',
      label: () => translate('Rating'),
      isSortable: true,
      isVisible: false
    },
    {
      name: 'certification',
      label: () => translate('Certification'),
      isSortable: true,
      isVisible: false
    },
    {
      name: 'lists',
      label: () => translate('Lists'),
      isSortable: false,
      isVisible: false
    },
    {
      name: 'actions',
      columnLabel: () => translate('Actions'),
      isVisible: true,
      isModifiable: false
    }
  ],

  sortPredicates: {
    status: function(item) {
      let result = 0;

      if (item.isExcluded) {
        result += 4;
      }

      if (item.status === 'upcoming') {
        result++;
      }

      if (item.status === 'continuing') {
        result += 2;
      }

      if (item.status === 'ended') {
        result += 3;
      }

      return result;
    },

    network: function(item) {
      const network = item.network;

      return network ? network.toLowerCase() : '';
    },

    originalLanguage: function(item) {
      const { originalLanguage = {} } = item;

      return originalLanguage.name;
    },

    firstAired: function(item, direction) {
      if (item.firstAired) {
        return moment(item.firstAired).unix();
      }

      if (direction === sortDirections.DESCENDING) {
        return -1 * Number.MAX_VALUE;
      }

      return Number.MAX_VALUE;
    },

    lastAired: function(item, direction) {
      if (item.lastAired) {
        return moment(item.lastAired).unix();
      }

      if (direction === sortDirections.DESCENDING) {
        return -1 * Number.MAX_VALUE;
      }

      return Number.MAX_VALUE;
    },

    ratings: function({ ratings = {} }) {
      return ratings.value ? ratings.value : 0;
    }
  },

  selectedFilterKey: 'newNotExcluded',

  filters: [
    {
      key: 'all',
      label: () => translate('All'),
      filters: []
    },
    {
      key: 'popular',
      label: () => translate('Popular'),
      filters: [
        {
          key: 'isPopular',
          value: true,
          type: filterTypes.EQUAL
        }
      ]
    },
    {
      key: 'trending',
      label: () => translate('Trending'),
      filters: [
        {
          key: 'isTrending',
          value: true,
          type: filterTypes.EQUAL
        }
      ]
    },
    {
      key: 'newNotExcluded',
      label: () => translate('NewNonExcluded'),
      filters: [
        {
          key: 'isExisting',
          value: false,
          type: filterTypes.EQUAL
        },
        {
          key: 'isExcluded',
          value: false,
          type: filterTypes.EQUAL
        }
      ]
    }
  ],

  filterPredicates,

  filterBuilderProps: [
    {
      name: 'status',
      label: () => translate('Status'),
      type: filterBuilderTypes.EXACT,
      valueType: filterBuilderValueTypes.SERIES_STATUS
    },
    {
      name: 'seriesType',
      label: () => translate('Type'),
      type: filterBuilderTypes.EXACT,
      valueType: filterBuilderValueTypes.SERIES_TYPES
    },
    {
      name: 'network',
      label: () => translate('Network'),
      type: filterBuilderTypes.ARRAY,
      optionsSelector: function(items) {
        const tagList = items.reduce((acc, series) => {
          if (series.network) {
            acc.push({
              id: series.network,
              name: series.network
            });
          }

          return acc;
        }, []);

        return tagList.sort(sortByProp('name'));
      }
    },
    {
      name: 'originalLanguage',
      label: () => translate('OriginalLanguage'),
      type: filterBuilderTypes.EXACT,
      optionsSelector: function(items) {
        const languageList = items.reduce((acc, series) => {
          if (series.originalLanguage) {
            acc.push({
              id: series.originalLanguage.name,
              name: series.originalLanguage.name
            });
          }

          return acc;
        }, []);

        return languageList.sort(sortByProp('name'));
      }
    },
    {
      name: 'firstAired',
      label: () => translate('FirstAired'),
      type: filterBuilderTypes.DATE,
      valueType: filterBuilderValueTypes.DATE
    },
    {
      name: 'lastAired',
      label: () => translate('LastAired'),
      type: filterBuilderTypes.DATE,
      valueType: filterBuilderValueTypes.DATE
    },
    {
      name: 'runtime',
      label: () => translate('Runtime'),
      type: filterBuilderTypes.NUMBER
    },
    {
      name: 'genres',
      label: () => translate('Genres'),
      type: filterBuilderTypes.ARRAY,
      optionsSelector: function(items) {
        const tagList = items.reduce((acc, series) => {
          series.genres.forEach((genre) => {
            acc.push({
              id: genre,
              name: genre
            });
          });

          return acc;
        }, []);

        return tagList.sort(sortByProp('name'));
      }
    },
    {
      name: 'ratings',
      label: () => translate('Rating'),
      type: filterBuilderTypes.NUMBER
    },
    {
      name: 'ratingVotes',
      label: () => translate('RatingVotes'),
      type: filterBuilderTypes.NUMBER
    },
    {
      name: 'certification',
      label: () => translate('Certification'),
      type: filterBuilderTypes.EXACT
    },
    {
      name: 'lists',
      label: () => translate('Lists'),
      type: filterBuilderTypes.ARRAY
    },
    {
      name: 'isExcluded',
      label: () => translate('OnExcludedList'),
      type: filterBuilderTypes.EXACT,
      valueType: filterBuilderValueTypes.BOOL
    },
    {
      name: 'isExisting',
      label: () => translate('ExistsInLibrary'),
      type: filterBuilderTypes.EXACT,
      valueType: filterBuilderValueTypes.BOOL
    },
    {
      name: 'isRecommendation',
      label: () => translate('Recommended'),
      type: filterBuilderTypes.EXACT,
      valueType: filterBuilderValueTypes.BOOL
    },
    {
      name: 'isTrending',
      label: () => translate('Trending'),
      type: filterBuilderTypes.EXACT,
      valueType: filterBuilderValueTypes.BOOL
    },
    {
      name: 'isPopular',
      label: () => translate('Popular'),
      type: filterBuilderTypes.EXACT,
      valueType: filterBuilderValueTypes.BOOL
    }
  ]
};

export const persistState = [
  'discoverSeries.defaults',
  'discoverSeries.sortKey',
  'discoverSeries.sortDirection',
  'discoverSeries.selectedFilterKey',
  'discoverSeries.customFilters',
  'discoverSeries.view',
  'discoverSeries.columns',
  'discoverSeries.options',
  'discoverSeries.posterOptions',
  'discoverSeries.overviewOptions',
  'discoverSeries.tableOptions'
];

//
// Actions Types

export const ADD_SERIES = 'discoverSeries/addSeries';
export const ADD_SERIES_LIST = 'discoverSeries/addSeriesList';
export const SET_ADD_SERIES_VALUE = 'discoverSeries/setAddSeriesValue';
export const CLEAR_ADD_SERIES = 'discoverSeries/clearAddSeries';
export const SET_ADD_SERIES_DEFAULT = 'discoverSeries/setAddSeriesDefault';

export const FETCH_DISCOVER_SERIES = 'discoverSeries/fetchDiscoverSeries';

export const SET_LIST_SERIES_SORT = 'discoverSeries/setListSeriesSort';
export const SET_LIST_SERIES_FILTER = 'discoverSeries/setListSeriesFilter';
export const SET_LIST_SERIES_VIEW = 'discoverSeries/setListSeriesView';
export const SET_LIST_SERIES_OPTION = 'discoverSeries/setListSeriesOption';
export const SET_LIST_SERIES_TABLE_OPTION = 'discoverSeries/setListSeriesTableOption';
export const SET_LIST_SERIES_POSTER_OPTION = 'discoverSeries/setListSeriesPosterOption';
export const SET_LIST_SERIES_OVERVIEW_OPTION = 'discoverSeries/setListSeriesOverviewOption';

export const ADD_IMPORT_LIST_EXCLUSIONS = 'discoverSeries/addImportListExclusions';

//
// Action Creators

export const addSeries = createThunk(ADD_SERIES);
export const addSeriesList = createThunk(ADD_SERIES_LIST);
export const clearAddSeries = createAction(CLEAR_ADD_SERIES);
export const setAddSeriesDefault = createAction(SET_ADD_SERIES_DEFAULT);

export const fetchDiscoverSeries = createThunk(FETCH_DISCOVER_SERIES);

export const setListSeriesSort = createAction(SET_LIST_SERIES_SORT);
export const setListSeriesFilter = createAction(SET_LIST_SERIES_FILTER);
export const setListSeriesView = createAction(SET_LIST_SERIES_VIEW);
export const setListSeriesOption = createAction(SET_LIST_SERIES_OPTION);
export const setListSeriesTableOption = createAction(SET_LIST_SERIES_TABLE_OPTION);
export const setListSeriesPosterOption = createAction(SET_LIST_SERIES_POSTER_OPTION);
export const setListSeriesOverviewOption = createAction(SET_LIST_SERIES_OVERVIEW_OPTION);

export const addImportListExclusions = createThunk(ADD_IMPORT_LIST_EXCLUSIONS);

export const setAddSeriesValue = createAction(SET_ADD_SERIES_VALUE, (payload) => {
  return {
    section,
    ...payload
  };
});

//
// Action Handlers

export const actionHandlers = handleThunks({

  [FETCH_DISCOVER_SERIES]: function(getState, payload, dispatch) {
    dispatch(set({ section, isFetching: true }));

    const {
      id,
      ...otherPayload
    } = payload;

    const {
      includeRecommendations = false,
      includeTrending = false,
      includePopular = false
    } = getState().discoverSeries.options;

    const promise = createAjaxRequest({
      url: `/importlist/series?includeRecommendations=${includeRecommendations}&includeTrending=${includeTrending}&includePopular=${includePopular}`,
      data: otherPayload,
      traditional: true
    }).request;

    promise.done((data) => {
      // Set an id so the selectors and updaters don't blow up.
      data = data.map((series) => ({ ...series, id: series.tvdbId }));

      dispatch(batchActions([
        update({ section, data }),

        set({
          section,
          isFetching: false,
          isPopulated: true,
          error: null
        })
      ]));
    });

    promise.fail((xhr) => {
      dispatch(set({
        section,
        isFetching: false,
        isPopulated: false,
        error: xhr.aborted ? null : xhr
      }));
    });
  },

  [ADD_SERIES]: function(getState, payload, dispatch) {
    dispatch(set({ section, isAdding: true }));

    const tvdbId = payload.tvdbId;
    const items = getState().discoverSeries.items;
    const itemToUpdate = _.find(items, { tvdbId });

    const newSeries = getNewSeries(_.cloneDeep(itemToUpdate), payload);
    newSeries.id = 0;

    const promise = createAjaxRequest({
      url: '/series',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(newSeries)
    }).request;

    promise.done((data) => {
      dispatch(batchActions([
        updateItem({ section: 'series', ...data }),

        itemToUpdate.lists.length === 0 ?
          removeItem({ section: 'discoverSeries', ...itemToUpdate }) :
          updateItem({ section: 'discoverSeries', ...itemToUpdate, isExisting: true }),

        set({
          section,
          isAdding: false,
          isAdded: true,
          addError: null
        })
      ]));
    });

    promise.fail((xhr) => {
      dispatch(set({
        section,
        isAdding: false,
        isAdded: false,
        addError: xhr
      }));
    });
  },

  [ADD_SERIES_LIST]: function(getState, payload, dispatch) {
    dispatch(set({ section, isAdding: true }));

    const ids = payload.ids;
    const addOptions = payload.addOptions;
    const items = getState().discoverSeries.items;
    const addedIds = [];

    const allNewSeries = ids.reduce((acc, id) => {
      const selectedSeries = items.find((i) => i.id === id);

      // Make sure we have a selected series and
      // the same series hasn't been added yet.
      if (selectedSeries && !acc.some((a) => a.tvdbId === selectedSeries.tvdbId)) {
        if (!selectedSeries.isExisting) {
          const newSeries = getNewSeries(_.cloneDeep(selectedSeries), addOptions);
          newSeries.id = 0;

          addedIds.push(id);
          acc.push(newSeries);
        }
      }

      return acc;
    }, []);

    const promise = createAjaxRequest({
      url: '/importlist/series',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(allNewSeries)
    }).request;

    promise.done((data) => {
      dispatch(batchActions([
        set({
          section,
          isAdding: false,
          isAdded: true
        }),

        ...data.map((series) => updateItem({ section: 'series', ...series })),

        ...addedIds.map((id) => (items.find((i) => i.id === id).lists.length === 0 ?
          removeItem({ section, id }) :
          updateItem({ section, id, isExisting: true })))
      ]));
    });

    promise.fail((xhr) => {
      dispatch(
        set({
          section,
          isAdding: false,
          isAdded: true,
          addError: xhr
        })
      );
    });
  },

  [ADD_IMPORT_LIST_EXCLUSIONS]: function(getState, payload, dispatch) {
    const ids = payload.ids;
    const items = getState().discoverSeries.items;

    const exclusions = ids.reduce((acc, id) => {
      const item = items.find((i) => i.tvdbId === id);

      acc.push({
        tvdbId: id,
        title: item.title
      });

      return acc;
    }, []);

    const promise = createAjaxRequest({
      url: '/importlistexclusion/bulk',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(exclusions)
    }).request;

    promise.done((data) => {
      dispatch(batchActions([
        ...data.map((item) => updateItem({ section: 'settings.importListExclusions', ...item })),

        ...ids.map((id) => updateItem({ section, id, isExcluded: true })),

        set({
          section,
          isSaving: false,
          saveError: null
        })
      ]));
    });

    promise.fail((xhr) => {
      dispatch(set({
        section,
        isSaving: false,
        saveError: xhr
      }));
    });
  }
});

//
// Reducers

export const reducers = createHandleActions({

  [SET_ADD_SERIES_VALUE]: createSetSettingValueReducer(section),

  [SET_ADD_SERIES_DEFAULT]: function(state, { payload }) {
    const newState = getSectionState(state, section);

    newState.defaults = {
      ...newState.defaults,
      ...payload
    };

    return updateSectionState(state, section, newState);
  },

  [SET_LIST_SERIES_SORT]: createSetClientSideCollectionSortReducer(section),
  [SET_LIST_SERIES_FILTER]: createSetClientSideCollectionFilterReducer(section),

  [SET_LIST_SERIES_VIEW]: function(state, { payload }) {
    return Object.assign({}, state, { view: payload.view });
  },

  [SET_LIST_SERIES_OPTION]: function(state, { payload }) {
    const discoverSeriesOptions = state.options;

    return {
      ...state,
      options: {
        ...discoverSeriesOptions,
        ...payload
      }
    };
  },

  [SET_LIST_SERIES_TABLE_OPTION]: createSetTableOptionReducer(section),

  [SET_LIST_SERIES_POSTER_OPTION]: function(state, { payload }) {
    const posterOptions = state.posterOptions;

    return {
      ...state,
      posterOptions: {
        ...posterOptions,
        ...payload
      }
    };
  },

  [SET_LIST_SERIES_OVERVIEW_OPTION]: function(state, { payload }) {
    const overviewOptions = state.overviewOptions;

    return {
      ...state,
      overviewOptions: {
        ...overviewOptions,
        ...payload
      }
    };
  },

  [CLEAR_ADD_SERIES]: createClearReducer(section, {
    isFetching: false,
    isPopulated: false,
    error: null,
    items: []
  })

}, defaultState, section);
