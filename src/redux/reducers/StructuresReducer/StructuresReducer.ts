import * as actions from "./ActionTypes";
import { getNeo4jData } from "../../AsyncActions/getNeo4jData";
import {  Dispatch } from "redux";
import { NeoStruct } from "./../../DataInterfaces";
import { flattenDeep } from "lodash";
import { filterChange, FilterPredicates } from "../Filters/ActionTypes";

export interface StructReducerState {
  neo_response    : NeoStruct[]
  derived_filtered: NeoStruct[],
  Loading         : boolean;
  Error           : null | Error;
  current_page    : number;
  pages_total     : number
  
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
    case "NEXT_PAGE_STRUCTS":
      if (state.current_page+1 === state.pages_total){
        return state
      }
      return {...state, current_page:state.current_page+1}
    case "PREV_PAGE_STRUCTS":
      if (state.current_page-1 < 1){
        return state
      }
      return {...state, current_page:state.current_page-1}
    case "GOTO_PAGE_STRUCTS":
      if (action.page_id <= state.pages_total && action.page_id >=1) {
        return {...state, current_page: action.page_id}
      }
    case "FILTER_CHANGE":

      // Filter change action emits new state of filters
      var newState       =  (action as filterChange).derived_filters
      // Type of the recently-change filte
      var ftype             =  (action as filterChange).filttype

      var filtered_structs  =  

       newState.applied_filters.length === 0
          ? state.neo_response

          : newState.applied_filters
          .reduce(
              (filteredStructs: NeoStruct[], filter:typeof ftype ) => {
                return filteredStructs.filter(FilterPredicates[filter][ 'STRUCTURE' ]!(newState.filters[filter].value));
              },
              state.neo_response
            );
       
      return {...state, derived_filtered:filtered_structs, pages_total: Math.ceil(filtered_structs.length/20)}
    default:
      return state;
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


// ---------------------------------------Pagination


export const gotopage = (pid: number): actions.gotopage => ({
  type: actions.GOTO_PAGE_STRUCTS,
  page_id: pid,
});
export const nextpage = (): actions.nextpage => ({
  type: actions.NEXT_PAGE_STRUCTS,
});
export const prevpage = (): actions.prevpage => ({
  type: actions.PREV_PAGE_STRUCTS,
});
