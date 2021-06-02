import * as actions from "./ActionTypes";
import _ from "lodash";
import { getNeo4jData } from "../../AsyncActions/getNeo4jData";
import {  Dispatch } from "redux";
import { NeoStruct } from "./../../DataInterfaces";
import { flattenDeep } from "lodash";
import { Filter, filterChange, FilterPredicates, FilterRegistry } from "../Filters/ActionTypes";
import { StructFilterType, StructSortType } from "./ActionTypes";

export interface StructReducerState {
  neo_response    : NeoStruct[]
  derived_filtered: NeoStruct[],
  Loading         : boolean;
  Error           : null | Error;
  current_page    : number;
  pages_total     : number
  filter_registry : FilterRegistry<StructFilterType, NeoStruct>
  last_sort_set   : StructSortType,
  sorts_registry  : Record<StructSortType, {
  reverse  : boolean,
  compareFn: (a:NeoStruct, b:NeoStruct) => 1 | 0 | -1
}>
}


const StructsSortsState:Record<StructSortType,{
  reverse  : boolean,
  compareFn: (a:NeoStruct, b:NeoStruct) => 1 | 0 | -1
}> = {
  "PDB_CODENAME":{
    reverse:false,
    compareFn: (a,b)=>{
      var first  = a.struct.rcsb_id
      var second = b.struct.rcsb_id
      if (first==second){
        return 0
      }
      if (first>second){
        return 1
      }
      if (second>first){
        return -1
      }
      else return 0
    }

  },
  "NUMBER_OF_PROTEINS" : {
    reverse:false,
    compareFn: (a,b)=>{
      var first  = a.rps.length
      var second = b.rps.length
      if (first==second){
        return 0
      }
      if (first>second){
        return 1
      }
      if (second>first){
        return -1
      }
      else return 0
    }
  },
  "RESOLUTION"         : {
    reverse:false,
    compareFn: (a,b)=>{
      var first  = a.struct.resolution
      var second = b.struct.resolution
      if (first==second){
        return 0
      }
      if (first>second){
        return 1
      }
      if (second>first){
        return -1
      }
      else return 0
    }
  },
  "YEAR"               : {
    reverse:false,
    compareFn: (a,b)=>{

      var first  = a.struct.citation_year
      var second = b.struct.citation_year
      if (first==second){
        return 0
      }
      if (first>second){
        return 1
      }
      if (second>first){
        return -1
      }
      else return 0
    }
  }
}


const StructsFilterRegistry:FilterRegistry<StructFilterType, NeoStruct> = {
  filtstate:{
   "YEAR": {
     value    : [2012,2021],
     set      : false,
     predicate: (value) => (struct) => 
     {
     return struct.struct.citation_year >= (value as number[])[0] && struct.struct.citation_year <= (value as number[])[1]
     }
    },
   "RESOLUTION"      : {
     value:[1,6],
     set:false,
     predicate:(value) =>(struct) =>
     {
      return struct.struct.resolution >= (value as number[])[0] && struct.struct.resolution <= (value as number[])[1]  
    }
    
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
              { 
                
                return  (
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
   "EXPERIMENTAL_METHOD":{
     value:[],
     set:false,
     predicate: (value) => (struct) =>{
       if (value.length <1 ){return true}
       else{return value.includes(struct.struct.expMethod)}
     }

   }
   
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
  filter_registry : StructsFilterRegistry,
  sorts_registry  : StructsSortsState,
  last_sort_set   : "YEAR"
};

export const _StructuresReducer = (
  state: StructReducerState = structReducerDefaultState,
  action: actions.StructActionTypes
): StructReducerState => {
  switch (action.type) {
    case "REQUEST_STRUCTS_GO":
      return { ...state, Loading: true };
    case "REQUEST_STRUCTS_ERR":
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


      const updateAppliedFilters = (filter_type: StructFilterType, set: boolean, applied: StructFilterType[]): StructFilterType[] => {
        if ((set) && !(applied.includes(filter_type))) {
          return [...applied, filter_type]
        }
        else if (!(set) && (applied.includes(filter_type))) {
          return applied.filter(t => t !== filter_type)
        }
        else if (set && applied.includes(filter_type)) {
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
     var nextFilters = Object.assign({},state.filter_registry,{filtstate:{...state.filter_registry.filtstate, ...{[action.filter_type]:newFilterState}}}, { applied:newApplied })
     for (var filter of newApplied){
      var filtered = filtered.filter(
        nextFilters.filtstate[filter as StructFilterType]
        .predicate(nextFilters.filtstate[filter].value)
        )
     }
     return {...state, filter_registry:nextFilters, derived_filtered:filtered, pages_total: Math.ceil(filtered.length/20), current_page:1}
    case "STRUCTS_SORT_CHANGE":
      
    
    var sorted = state.derived_filtered.sort(
      state.sorts_registry[action.sortType].compareFn
      )

    var newSortRegistry = {...state.sorts_registry}
    newSortRegistry[action.sortType].reverse =!newSortRegistry[action.sortType].reverse
    if(newSortRegistry[action.sortType].reverse){
      sorted= sorted.reverse()
    }

    
    return Object.assign({}, state, {sorts_registry:newSortRegistry},{derived_filtered: sorted},{last_sort_set:action.sortType})

    default:
      return state;
  }
};

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
    ).then(
      r=>{
        dispatch({type:"STRUCTS_SORT_CHANGE",sortType:"PDB_CODENAME"})
        dispatch({type:"STRUCTS_SORT_CHANGE",sortType:"PDB_CODENAME"})
      }

    )
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
