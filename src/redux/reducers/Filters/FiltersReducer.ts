import { Action } from 'redux'
// import { sendMessage } from './store/chat/actions'
// import { RootState } from './store'
import { AppState } from './../../store'
import { ThunkAction } from 'redux-thunk'
import { FilterData, FilterPredicate, FiltersActionTypes, FilterType } from "./ActionTypes";
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,AppState,unknown,Action<string>>




// Basically, you "preload" a given filter's curry-template with an instance of a value(the current value of the filter)
// Then, given an instance of the corresponding datatype, return a boolean based on whether the datatype satisifies the condition predicated on the value of the filter

export interface FiltersReducerState {
  applied_filters : FilterType[],
  filters         : Record<FilterType, FilterData>
}

const filtersReducerDefaultState: FiltersReducerState = {
  applied_filters : [],
  filters         : {
    PROTEIN_COUNT: {
      set: false,
      value: [25, 150],
    },
    YEAR: {
      set: false,
      value: [2012, 2021],
    },
    RESOLUTION: {
      set: false,
      value: [1, 6],
    },
    PROTEINS_PRESENT: {
      set: false,
      value: [],
    },
    SEARCH: {
      set: false,
      value: "",
    },
    SPECIES: {
      set: false,
      value: [],
    },
  },
};




export const FiltersReducer = (
  state: FiltersReducerState = filtersReducerDefaultState,
  action: FiltersActionTypes
): FiltersReducerState => {
  switch (action.type) {
    case "FILTER_CHANGE":
      
      var filtIndex = state.applied_filters.indexOf(action.filttype)
      // shallow copy
      var appliedFilters = state.applied_filters;
      if ( filtIndex === -1  && action.set) {
        appliedFilters.push(action.filttype);
      }
      if (!( filtIndex===-1 )&&  !action.set) {
        appliedFilters.splice(filtIndex, 1);
      }

      var derived_state = {
        filters: {
          ...state.filters,
          [action.filttype]: { set: action.set, value: action.newval },
        },
        applied_filters: appliedFilters,
      };

      
      return derived_state

    default:
      return state;
  }
};