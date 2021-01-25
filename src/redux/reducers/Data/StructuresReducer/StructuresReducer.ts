import * as actions from "./ActionTypes";
import { getNeo4jData } from "./../../../Actions/getNeo4jData";
import { Dispatch } from "redux";
import { RibosomeStructure } from "../../../RibosomeTypes";
import { flattenDeep  } from "lodash";

export interface NeoStruct{
  struct   :  RibosomeStructure;
  ligands  :  string[];
  rps      :  Array<{ noms: string[]; strands: string }>;
  rnas     :  string[];
}
export interface StructReducerState {
  neo_response      :  NeoStruct[]
  derived_filtered  :  NeoStruct[],
  filters           :  Record<actions.FilterType, actions.FilterData>
  Loading           :  boolean;
  Error             :  null | Error;
}

const structReducerDefaultState:StructReducerState = {
  Loading           :  false,
  Error             :  null,
  neo_response      :  [],
  derived_filtered  :  [],
  filters           :  {
    PROTEIN_COUNT        :  {
      set    :  false,
      value  :  [25,150]
    },
    YEAR             : {
      set: false,
      value:[2012,2021]
    },
    RESOLUTION       :  {
      set    :  false,
      value  :  [1,6]
    },
    PROTEINS_PRESENT  :  {
      set: false,
      value:[]
    },
    SEARCH           :  {
      set: false,
      value:""
    },
    SPECIES          :  {
      set: false,
      value:[]
    }
  }
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
                  neo_response      :  [...action.payload],
                  derived_filtered  :  [...action.payload],
                  Loading: false };

    case "FILTER_CHANGE":
      console.log("Filter has changed:", action.filttype, "And is set: ",action.set)
      return {...state, filters}
      // return {...state, s}




    case "FILTER_ON_PDBID":
      var filtered = state.derived_filtered.filter(r=>r.struct.rcsb_id.includes( action.payload ))
      return {...state, derived_filtered:filtered}
    case "FILTER_ON_RANGE_CHANGE":
      switch (action.slidertype){
        case "PROTCOUNT":
          console.log("newragne",action.newrange)
          var filtered = state.derived_filtered.filter(x=> x.rps.length >= action.newrange[0] && action.newrange[1]>=x.struct.resolution)
          return {...state, derived_filtered:filtered}
        case "YEAR":
          var filtered = state.derived_filtered.filter(x=> x.struct.citation_year >= action.newrange[0] && action.newrange[1]>=x.struct.resolution)
          return {...state, derived_filtered:filtered}
        case "RESOLUTION":
          var filtered = state.derived_filtered.filter(x=> x.struct.resolution >= action.newrange[0] && action.newrange[1]>=x.struct.resolution)
          return {...state, derived_filtered:filtered}
        default:
          return state
      }
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
        return newval === [];
      case "PROTEIN_COUNT":
        return newval === [25, 150];
      case "RESOLUTION":
        return newval === [1, 6];
      case "SEARCH":
        return newval === "";
      case "SPECIES":
        return newval === [];
      case "YEAR":
        return newval === [2012, 2021];
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

// export const filterOnRangeChange = (filtertype:FilterType,newrange:number[]):actions.filterOnRangeChange =>({
//   type:actions.FILTER_ON_RANGE_CHANGE,
//   newrange,
//   slidertype
// })
// export const filteronProteinsPresent = (protpresent:string[]):actions.filterOnProteinsPresent =>({
//   type:actions.FILTER_ON_PROTEINS_PRESENT,
//   payload:protpresent
// })
// export const filterOnPdbid = (pid:string):actions.filterOnPpdbid =>({
//   type:actions.FILTER_ON_PDBID,
//   payload:pid
// })
// export const filterOnSpeciesId = (spec:number[]):actions.filterOnSpecies =>({
//   type:actions.FILTER_ON_SPECIES,
//   payload:spec
// })

// export const filterOnMethod = (method:string):actions.filterStructsMethod =>({
//     type: actions.FILTER_STRUCTS_METHOD ,
//     payload: method
// })

// export const filterOnSpecies = (specid:number):actions.filterStructsSpecies =>({
//     type: actions.FILTER_STRUCTS_SPECIES ,
//     payload: specid
// })
