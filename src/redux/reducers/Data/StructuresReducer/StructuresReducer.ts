import * as actions from "./ActionTypes";
import { getNeo4jData } from "./../../../Actions/getNeo4jData";
import { Dispatch } from "redux";
import { RibosomeStructure } from "../../../RibosomeTypes";
import { flattenDeep  } from "lodash";

const structReducerDefaultState = {
  StructuresResponse     : [],
  filteredStructs_derived: [],
  Loading                : false,
  Error                  : null,};

export interface NeoStruct{
  struct : RibosomeStructure;
  ligands: string[];
  rps    : Array<{ noms: string[]; strands: string }>;
  rnas   : string[];
}

export interface StructState {
  StructuresResponse     : NeoStruct[]
  filteredStructs_derived: NeoStruct[],
  Loading                : boolean;
  Error                  : null | Error;
}

export const filterOnRangeChange = (slidertype:actions.SliderFilterType,newrange:number[]):actions.filterOnRangeChange =>({
  type:actions.FILTER_ON_RANGE_CHANGE,
  newrange,
  slidertype
})
export const filteronProteinsPresent = (protpresent:string[]):actions.filterOnProteinsPresent =>({
  type:actions.FILTER_ON_PROTEINS_PRESENT,
  payload:protpresent
})
export const filterOnPdbid = (pid:string):actions.filterOnPpdbid =>({
  type:actions.FILTER_ON_PDBID,
  payload:pid
})

export const filterOnSpeciesId = (spec:number[]):actions.filterOnSpecies =>({
  type:actions.FILTER_ON_SPECIES,
  payload:spec
})


export const filterOnMethod = (method:string):actions.filterStructsMethod =>({
    type: actions.FILTER_STRUCTS_METHOD ,
    payload: method
})

export const filterOnSpecies = (specid:number):actions.filterStructsSpecies =>({
    type: actions.FILTER_STRUCTS_SPECIES ,
    payload: specid
})


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

export const StructuresReducer = (
  state: StructState = structReducerDefaultState,
  action: actions.StructActionTypes
): StructState => {
  switch (action.type) {
    case "REQUEST_STRUCTS_GO":
      return { ...state, Loading: true };
    case "REQUEST_STRUCTS_ERR":
      console.log('Errored out requesting structs')
      return { ...state, Loading: false, Error: action.error };
    case "REQUEST_STRUCTS_SUCCESS":
      return { ...state, StructuresResponse: [...action.payload], filteredStructs_derived:[...action.payload], Loading: false };
    case "FILTER_ON_PDBID":
      var filtered = state.filteredStructs_derived.filter(r=>r.struct.rcsb_id.includes( action.payload ))
      return {...state, filteredStructs_derived:filtered}
    // case  "FILTER_ON_SPECIES":
    //   var filtered = state.filteredStructs_derived.filter(r=>r.struct._organismId.includes(action.payload))
    //   return {...state, filteredStructs_derived:filtered}
    
    case "FILTER_ON_RANGE_CHANGE":
      console.log(action.newrange)
      switch (action.slidertype){
        case "PROTCOUNT":
          var filtered = state.filteredStructs_derived.filter(x=> x.rps.length >= action.newrange[0] && action.newrange[1]>=x.struct.resolution)
          return {...state, filteredStructs_derived:filtered}
        case "YEAR":
          var filtered = state.filteredStructs_derived.filter(x=> x.struct.citation_year >= action.newrange[0] && action.newrange[1]>=x.struct.resolution)
          return {...state, filteredStructs_derived:filtered}
        case "RESOLUTION":
          var filtered = state.filteredStructs_derived.filter(x=> x.struct.resolution >= action.newrange[0] && action.newrange[1]>=x.struct.resolution)
          return {...state, filteredStructs_derived:filtered}
        default:
          return state
      }
      
    default:
      return state;
  }
};
