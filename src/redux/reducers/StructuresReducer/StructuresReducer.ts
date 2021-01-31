import * as actions from "./ActionTypes";
import { getNeo4jData } from "../../AsyncActions/getNeo4jData";
import { combineReducers, Dispatch } from "redux";
import { RibosomeStructure } from "../../RibosomeTypes";
import { NeoStruct } from "./../../DataInterfaces";
import { flattenDeep } from "lodash";
import {FiltersReducer,FiltersReducerState} from './../Filters/FiltersReducer'
import { AppState, store } from "../../store";
import { useStore } from "react-redux";
import { filterChange, FilterPredicates } from "../Filters/ActionTypes";

export interface StructReducerState {
  // data
  neo_response    : NeoStruct[]
  // filters
  derived_filtered: NeoStruct[],
  // applied_filters : actions.FilterType[],
  // filters         : Record<actions.FilterType, actions.FilterData>
  Loading         : boolean;
  Error           : null | Error;
  // pagination
  current_page: number;
  pages_total : number
  
}


const structReducerDefaultState: StructReducerState = {
  Loading         : false,
  Error           : null,
  neo_response    : [],
  current_page    : 1,
  pages_total     : 1,
  derived_filtered: [],
};



export const _StructuresReducer = (
  state: StructReducerState = structReducerDefaultState,
  action: actions.StructActionTypes
): StructReducerState => {
  switch (action.type) {
    case "REQUEST_STRUCTS_GO":
      return { ...state, Loading: true };
    case "REQUEST_STRUCTS_ERR":
      console.log('Errored out requesting structs')
      return { ...state, Loading: false, Error: action.error };
    case "REQUEST_STRUCTS_SUCCESS":
        return { ...state,
                  neo_response    : [...action.payload],
                  derived_filtered: [...action.payload],
                  pages_total     : Math.ceil(action.payload.length/20),
                  Loading         : false };
    case "NEXT_PAGE":
      if (state.current_page+1 === state.pages_total){
        return state
      }
      return {...state, current_page:state.current_page+1}
    case "PREV_PAGE":
      if (state.current_page-1 < 1){
        return state
      }
      return {...state, current_page:state.current_page-1}
    case "GOTO_PAGE":
      if (action.page_id <= state.pages_total && action.page_id >=1) {
        return {...state, current_page: action.page_id}
      }
    case "FILTER_CHANGE":

      var statethings  = (action as filterChange).derived_filters
      var ftype = (action as filterChange).filttype
    
      var filtered_structs =

       statethings.applied_filters.length === 0
          ? state.neo_response
          : statethings.applied_filters.reduce(
              (filteredStructs: NeoStruct[], filter:typeof ftype ) => {
                return filteredStructs.filter(
                  FilterPredicates[filter](statethings.filters[filter].value)
                );
              },
              state.neo_response
            );

       
      return {...state, derived_filtered:filtered_structs, pages_total: Math.ceil(filtered_structs.length/20)}
    default:
      return state;
    // case "FILTER_CHANGE":
    //   var filtIndex = state.applied_filters.indexOf(action.filttype)
    //   // shallow copy
    //   var appliedFilters = state.applied_filters;
    //   if ( filtIndex === -1  && action.set) {
    //     appliedFilters.push(action.filttype);
    //   }
    //   if (!( filtIndex===-1 )&&  !action.set) {
    //     appliedFilters.splice(filtIndex, 1);
    //   }
    //   var derived_state = {
    //     ...state,
    //     filters: {
    //       ...state.filters,
    //       [action.filttype]: { set: action.set, value: action.newval },
    //     },
    //     applied_filters: appliedFilters,
    //   };
    //   var filtered_structs =
    //     appliedFilters.length === 0
    //       ? state.neo_response
    //       : appliedFilters.reduce(
    //           (filteredStructs: NeoStruct[], filter: actions.FilterType) => {
    //             return filteredStructs.filter(
    //               FilterPredicates[filter](derived_state.filters[filter].value)
    //             );
    //           },
    //           state.neo_response
    //         );
    //   derived_state = {...derived_state, derived_filtered:filtered_structs, pages_total: Math.ceil(filtered_structs.length/20)}
    //   return derived_state

    //   var filtIndex = state.applied_filters.indexOf(action.filttype)
    //   // shallow copy
    //   var appliedFilters = state.applied_filters;
    //   if ( filtIndex === -1  && action.set) {
    //     appliedFilters.push(action.filttype);
    //   }
    //   if (!( filtIndex===-1 )&&  !action.set) {
    //     appliedFilters.splice(filtIndex, 1);
    //   }
    //   var derived_state = {
    //     ...state,
    //     filters: {
    //       ...state.filters,
    //       [action.filttype]: { set: action.set, value: action.newval },
    //     },
    //     applied_filters: appliedFilters,
    //   };
    //   var filtered_structs =
    //     appliedFilters.length === 0
    //       ? state.neo_response
    //       : appliedFilters.reduce(
    //           (filteredStructs: NeoStruct[], filter: actions.FilterType) => {
    //             return filteredStructs.filter(
    //               FilterPredicates[filter](derived_state.filters[filter].value)
    //             );
    //           },
    //           state.neo_response
    //         );
    //   derived_state = {...derived_state, derived_filtered:filtered_structs, pages_total: Math.ceil(filtered_structs.length/20)}
    //   return derived_state
  }
};


// --------------------------------- Action Creators


export const requestAllStructuresDjango =  () => {
  return async (dispatch: Dispatch<actions.StructActionTypes>) => {
    dispatch({
      type: actions.REQUEST_STRUCTS_GO,
    });
    getNeo4jData("neo4j", { endpoint: "get_all_structs", params: null }).then(
      response => {
        dispatch({
          type: actions.REQUEST_STRUCTS_SUCCESS,
          payload: flattenDeep( response.data ) as any,
        });
      },
      error => {
        dispatch({
         type : actions.REQUEST_STRUCTS_ERR,
         error: error,
        });
      }
    );
  };
};




const StructuresReducer = combineReducers({
  filters: FiltersReducer,
  structures:_StructuresReducer
})

// export const filterChange = (filttype:actions.FilterType, newval: any):actions.filterChange =>{ 
//   let set: boolean = (() => {
//     switch (filttype) {
//       case "PROTEINS_PRESENT":
//         return !( newval.length ===0 );
//       case "PROTEIN_COUNT":
//         return !( newval[0] === 25 && newval[1] ===150 );
//       case "RESOLUTION":
//         return !( newval[0] === 1 && newval[1] ===6 );
//       case "SEARCH":
//         return !( newval.length===0  );
//       case "SPECIES":
//         return !( newval.length===0  );
//       case "YEAR":
//         return !( newval[0] === 2012 && newval[1] ===2021 );
//       default:
//         return false;
//     }
//   })();

//   return {
//   type: actions.FILTER_CHANGE,
//   filttype,
//   newval,
//   set
// }}

// ---------------------------------------Pagination


export const gotopage = (pid: number): actions.gotopage => ({
  type: actions.GOTO_PAGE,
  page_id: pid,
});
export const nextpage = (): actions.nextpage => ({
  type: actions.NEXT_PAGE,
});
export const prevpage = (): actions.prevpage => ({
  type: actions.PREV_PAGE,
});
