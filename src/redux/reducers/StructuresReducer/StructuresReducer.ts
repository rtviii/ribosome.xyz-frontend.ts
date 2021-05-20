import * as actions from "./ActionTypes";
import _ from "lodash";
import { getNeo4jData } from "../../AsyncActions/getNeo4jData";
import {  Dispatch } from "redux";
import { NeoStruct } from "./../../DataInterfaces";
import { flattenDeep } from "lodash";
import { Filter, filterChange, FilterPredicates, FilterRegistry } from "../Filters/ActionTypes";
import { SwitchCamera } from "@material-ui/icons";
import { StructFilterType } from "./ActionTypes";
import { log } from "console";

export interface StructReducerState {

  neo_response    : NeoStruct[]
  derived_filtered: NeoStruct[],
  Loading         : boolean;
  Error           : null | Error;
  current_page    : number;
  pages_total     : number
  filter_registry : FilterRegistry<StructFilterType, NeoStruct>
}

const StructsFilterRegistry:FilterRegistry<StructFilterType, NeoStruct> = {
  filtstate:{
   "PROTEIN_COUNT"   : {
     value:[],
     set:false,
     predicate:(value) =>(struct) =>
        struct.rps.length >= (value as number[])[0] &&
        struct.rps.length <= (value as number[])[1]
   },
   "YEAR": {
     value    : [2012,2021],
     set      : false,
     predicate: (value) => (struct) => struct.struct.citation_year >= (value as number[])[0] && struct.struct.citation_year <= (value as number[])[1]
      
    },
   "RESOLUTION"      : {
     value:[],
     set:false,

     predicate:(value) =>(struct) =>      struct.struct.citation_year >= (value as number[])[0] && struct.struct.citation_year <= (value as number[])[1]
   },
   "PROTEINS_PRESENT": {
     value:[],
     set:false,
     predicate:(value) =>(struct) =>
        {var presence = struct.rps.reduce((accumulator: string[], instance) => {
        return instance.noms.length === 0
          ? accumulator
          : value.includes(instance.noms[0])
          ? [...accumulator, instance.noms[0]]
          : accumulator;
      }, []);
      // If accumulator contains the same elements as the passed value ==> the struct passes
      return _.isEmpty(_.xor(value, presence));
     }
   },
   "SEARCH"          : {
     value:"",
     set:false,

     predicate:(value) =>(struct) =>
              { return  (
          struct.struct.rcsb_id +
          struct.struct.citation_title +
          struct.struct.citation_year +
          struct.struct.citation_rcsb_authors +
          struct.struct._organismName
        ).toLowerCase().includes(value as string) }
   },
   "SPECIES"         : {
     value:[],
     set:false,
     predicate:(value) =>(struct) =>
       struct.struct._organismId.reduce(
        (accumulator: boolean, taxid) =>
          accumulator || (value as number[]).includes(taxid),
        false
      )
   },

  },
  applied:[]
}


const structReducerDefaultState: StructReducerState = {
  Loading         : false,
  Error           : null,
  neo_response    : [],
  derived_filtered: [],
  current_page    : 1,
  pages_total     : 1,
  filter_registry : StructsFilterRegistry

  
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
    case "RESET_ALL_FILTERS":
      return {...state, derived_filtered: state.neo_response,pages_total: Math.ceil(state.neo_response.length/20), current_page:1}
    case "STRUCTS_FILTER_CHANGE":


      const updateAppliedFilters = (type: StructFilterType, set: boolean, applied: StructFilterType[]): StructFilterType[] => {
        if ((set) && !(applied.includes(type))) {
          return [...applied, type]
        }
        else if (!(set) && (applied.includes(type))) {
          return applied.filter(t => t !== type)
        }
        else if (set && applied.includes(type)) {
          return applied
        }
        else {
         return applied
       }
     }

     var filtered   = state.neo_response
     var newApplied = updateAppliedFilters(action.filter_type,action.set, state.filter_registry.applied)
     var newFilterState:Filter<NeoStruct> =  {
       set      : action.set,
       value    : action.newval,
       predicate: state.filter_registry.filtstate[action.filter_type].predicate
     }
     var nextFilters = Object.assign(state.filter_registry,{filtstate:{...state.filter_registry.filtstate, ...{[action.filter_type]:newFilterState}}}, { applied:newApplied })
     for (var filter of newApplied){
       filtered= filtered.filter(nextFilters.filtstate[filter as StructFilterType].predicate(nextFilters.filtstate[action.filter_type].value))
     }
     return {...state, filter_registry:nextFilters, derived_filtered:filtered, pages_total: Math.ceil(filtered.length/20), current_page:1}

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
