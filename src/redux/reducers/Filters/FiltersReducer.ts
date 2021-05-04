import { Action, Dispatch } from 'redux'
// import { sendMessage } from './store/chat/actions'
// import { RootState } from './store'
import { AppState } from './../../store'
import { ThunkAction } from 'redux-thunk'
import { filterChangeActionCreator, FilterData, FilterPredicate, FiltersActionTypes, FilterType } from "./ActionTypes";
import { AppActions } from '../../AppActions';
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
    case "RESET_ALL_FILTERS":
      return {
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
} 
    case "FILTER_CHANGE":
      var filtIndex = state.applied_filters.indexOf(action.filttype)
      var appliedFilters = state.applied_filters;

      
      if ( filtIndex === -1  && action.set) {
        appliedFilters.push(action.filttype);
      }

      if (!( filtIndex===-1 )&&  !action.set) {
        appliedFilters.splice(filtIndex, 1);
      }


      console.log("FILTER CHANNGE, got newval: ", action.newval);
      console.log("FILTER CHANNGE, cctions: ", action);
      var derived_state = {
        filters: {
          ...state.filters,

          [action.filttype]: { 
            set    :  action.set,
            value  :  action.newval
           },
        },
        applied_filters: appliedFilters,
      };

      
      return derived_state
    default:
      return state;
  }
};


export interface handleFilterChange {
  handleChange: ( allFilters:FiltersReducerState, newavalue:number|string|number[]|string[]) => void;
}

export const mapStateFilter=(filttype:FilterType)=>(appstate:AppState, ownprops:any):FilterData =>({

  allFilters: appstate.filters,
  set       : appstate.filters.filters[filttype].set,
  value     : appstate.filters.filters[filttype].value

})

export const mapDispatchFilter = (filttype: FilterType) => (
  dispatch: Dispatch<AppActions>,
  ownProps: any
): handleFilterChange => {
  return {
    handleChange: (allFilters, newrange) => dispatch(filterChangeActionCreator(allFilters, filttype, newrange)),
  };
};