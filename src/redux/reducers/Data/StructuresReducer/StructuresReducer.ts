import * as actions from "./ActionTypes";
import { getNeo4jData } from "./../../../Actions/getNeo4jData";
import { Dispatch } from "redux";
import { RibosomeStructure } from "../../../RibosomeTypes";
import { flattenDeep  } from "lodash";

export interface NeoStruct{
  struct   :  RibosomeStructure;
  ligands  :  string[];
  rps      :  Array<{ noms: string[]; surface_ratio:number|null,strands: string }>;
  rnas     :  string[];
}
export interface StructReducerState {
  // data
  neo_response    : NeoStruct[]
  // filters
  derived_filtered: NeoStruct[],
  applied_filters : actions.FilterType[],
  filters         : Record<actions.FilterType, actions.FilterData>
  Loading         : boolean;
  Error           : null | Error;
  // pagination
  current_page: number;
  pages_total : number
  
}


// THESE NEED TO BE MEMOIZED

const FilterPredicates : Record<actions.FilterType,actions.FilterPredicate> ={
"SEARCH"          :(value ) =>(struct:NeoStruct) => ( struct.struct.rcsb_id+struct.struct.citation_title+ struct.struct.citation_year+ struct.struct.citation_rcsb_authors+ struct.struct._organismName  ).toLowerCase().includes(value as string) ,
"PROTEIN_COUNT"   :(value ) =>(struct:NeoStruct) => struct.rps.length >= ( value as number[] )[0] && struct.rps.length<= ( value as number[] )[1],
"YEAR"            :(value ) =>(struct:NeoStruct) => struct.struct.citation_year >= ( value as number[] ) [0]  && struct.struct.citation_year <= (value as number[])[1],
"RESOLUTION"      :(value ) =>(struct:NeoStruct) => struct.struct.resolution >=( value as number[] ) [0]  && struct.struct.resolution <= (value as number[])[1],
"SPECIES"         :(value ) =>(struct:NeoStruct) => {
  // Structures frequently have more than one taxid associated with them. 
  // InSelected species cheks whether a particular taxid figures in the list of selecte fitlers
  const inSelectedSpecies = (taxid:number) => !( (value as number[]).includes(taxid)   )
  //  Collapse each of a struct's taxids to boolean based on the predicate. ANDQ all.
  return struct.struct._organismId.reduce((accumulator:boolean,taxid)=> { return inSelectedSpecies(taxid) || accumulator }, false)
},



// To implement:
"PROTEINS_PRESENT":(value ) =>(struct:NeoStruct) => struct.rps.length >= ( value as number[] )[0] && struct.rps.length<= ( value as number[] )[1],
}

const structReducerDefaultState: StructReducerState = {
  Loading         : false,
  Error           : null,
  neo_response    : [],
  current_page    : 1,
  pages_total     : 1,
  derived_filtered: [],
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

export const StructuresReducer = (
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
      else return state

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
        ...state,
        filters: {
          ...state.filters,
          [action.filttype]: { set: action.set, value: action.newval },
        },
        applied_filters: appliedFilters,
      };
      var filtered_structs =
        appliedFilters.length === 0
          ? state.neo_response
          : appliedFilters.reduce(
              (filteredStructs: NeoStruct[], filter: actions.FilterType) => {
                return filteredStructs.filter(
                  FilterPredicates[filter](derived_state.filters[filter].value)
                );
              },
              state.neo_response
            );
      derived_state = {...derived_state, derived_filtered:filtered_structs, pages_total: Math.ceil(filtered_structs.length/20)}
      return derived_state
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


export const filterChange = (filttype:actions.FilterType, newval: any):actions.filterChange =>{ 
  let set: boolean = (() => {
    switch (filttype) {
      case "PROTEINS_PRESENT":
        return !( newval.length ===0 );
      case "PROTEIN_COUNT":
        return !( newval[0] === 25 && newval[1] ===150 );
      case "RESOLUTION":
        return !( newval[0] === 1 && newval[1] ===6 );
      case "SEARCH":
        return !( newval.length===0  );
      case "SPECIES":
        return !( newval.length===0  );
      case "YEAR":
        return !( newval[0] === 2012 && newval[1] ===2021 );
      default:
        return false;
    }
  })();

  return {
  type: actions.FILTER_CHANGE,
  filttype,
  newval,
  set
}}

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
