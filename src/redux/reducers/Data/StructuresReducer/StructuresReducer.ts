import {
  REQUEST_STRUCTS_ERR,
  REQUEST_STRUCTS_GO,
  REQUEST_STRUCTS_SUCCESS,
  StructActionTypes,
} from "./ActionTypes";
import { getNeo4jData } from "./../../../Actions/getNeo4jData";

import { Dispatch } from "redux";
import { RibosomeStructure } from "../../../RibosomeTypes";
import { ThunkDispatch } from "redux-thunk";
const apibase = process.env.REACT_APP_DJANGO_URL;

const structReducerDefaultState = {
  Structures: [],
  Loading: false,
  Error: null,
};

export interface StructState {
  Structures: RibosomeStructure[];
  Loading: boolean;
  Error: null | Error;
}

export const requestAllStructuresDjango = (pdbid: string) => {
  return async (dispatch: Dispatch<StructActionTypes>) => {
    dispatch({
      type: REQUEST_STRUCTS_GO,
    });

    getNeo4jData("neo4j", { endpoint: "get_all_structs", params: null }).then(
      response => {
        dispatch({
          type: REQUEST_STRUCTS_SUCCESS,
          payload: response.data,
        });
      },
      error => {
        dispatch({
          type: REQUEST_STRUCTS_ERR,
          error: error,
        });
      }
    );
  };
};

export const StructuresReducer = (
  state: StructState = structReducerDefaultState,
  action: StructActionTypes
): StructState => {
  switch (action.type) {
    case "REQUEST_STRUCTS_GO":
      return { ...state, Loading: true };
    case "REQUEST_STRUCTS_ERR":
      return { ...state, Loading: false, Error: action.error };
    case "REQUEST_STRUCTS_SUCCESS":
      return { ...state, Structures: [...action.payload], Loading: false };
    default:
      return state;
  }
};
