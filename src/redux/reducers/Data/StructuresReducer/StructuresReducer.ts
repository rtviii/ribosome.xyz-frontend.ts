import * as actions from "./ActionTypes";
import { getNeo4jData } from "./../../../Actions/getNeo4jData";
import { Dispatch } from "redux";
import { RibosomeStructure } from "../../../RibosomeTypes";
import { flattenDeep  } from "lodash";
import { Filter } from "@material-ui/icons";

export interface NeoStruct{
  struct   :  RibosomeStructure;
  ligands  :  string[];
  rps      :  Array<{ noms: string[]; strands: string }>;
  rnas     :  string[];
}
export interface StructReducerState {
  neo_response    : NeoStruct[]
  derived_filtered: NeoStruct[],
  applied_filters : actions.FilterType[],
  filters         : Record<actions.FilterType, actions.FilterData>
  Loading         : boolean;
  Error           : null | Error;
}



const FilterPredicates : Record<actions.FilterType,actions.FilterPredicate> ={
"PROTEIN_COUNT"   :(value ) =>(struct:NeoStruct) => struct.rps.length >= ( value as number[] )[0] && struct.rps.length<= ( value as number[] )[1],
"YEAR"            :(value ) =>(struct:NeoStruct) => struct.struct.citation_year >= ( value as number[] ) [0]  && struct.struct.citation_year <= (value as number[])[1],
"RESOLUTION"      :(value ) =>(struct:NeoStruct) => struct.struct.resolution >=( value as number[] ) [0]  && struct.struct.resolution <= (value as number[])[1],
// To implement:
"PROTEINS_PRESENT":(value ) =>(struct:NeoStruct) => struct.rps.length >= ( value as number[] )[0] && struct.rps.length<= ( value as number[] )[1],
"SEARCH"          :(value ) =>(struct:NeoStruct) => struct.rps.length >= ( value as number[] )[0] && struct.rps.length<= ( value as number[] )[1],
"SPECIES"         :(value ) =>(struct:NeoStruct) => struct.rps.length >= ( value as number[] )[0] && struct.rps.length<= ( value as number[] )[1],
}

const structReducerDefaultState: StructReducerState = {
  Loading         : false,
  Error           : null,
  neo_response    : [],
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
      console.log("got success payload", action.payload)
        return { ...state,
                  neo_response    : [...action.payload],
                  derived_filtered: [...action.payload],
                  Loading         : false };

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

      // apply >>>>memoized<<<< filter functions based on applied_filters
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
      derived_state = {...derived_state, derived_filtered:filtered_structs}
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
} }
