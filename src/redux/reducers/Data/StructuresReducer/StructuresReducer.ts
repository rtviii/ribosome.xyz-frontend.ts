import * as actions from "./ActionTypes";
import { getNeo4jData } from "./../../../Actions/getNeo4jData";
import { Dispatch } from "redux";
import { RibosomeStructure } from "../../../RibosomeTypes";
import { flattenDeep } from "lodash";

const structReducerDefaultState = {
  StructuresResponse: [],
  Loading           : false,
  Error             : null,
};

export interface NeoStructResp{
        struct : RibosomeStructure;
        ligands: string[];
        rps    : Array<{ noms: string[]; strands: string }>;
        rnas   : string[];
      }
export interface StructState {
  StructuresResponse: NeoStructResp[]
  Loading           : boolean;
  Error             : null | Error;
}

// PRELOAD

export const filterOnMethod = (method:string):actions.filterStructsMethod =>({
    type: actions.FILTER_STRUCTS_METHOD ,
    payload: method
})

export const filterOnSpecies = (specid:number):actions.filterStructsSpecies =>({
    type: actions.FILTER_STRUCTS_SPECIES ,
    payload: specid
})


export const searchByPdbid = (pdbid:string):actions.searchStructsPdbid =>({
  type: actions.SEARCH_STRUCTS_PDBID,
  payload: pdbid
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
      return { ...state, StructuresResponse: [...action.payload], Loading: false };
    default:
      return state;
  }
};
