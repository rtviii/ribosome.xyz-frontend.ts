import {
  StructActionTypes,
  REQUEST_HOMOLOGS_GO,
  REQUEST_STRUCT_ERR,
  REQUEST_STRUCT_SUCCESS,
} from "./../../types/action.types";
import axios from "axios";
import { Dispatch } from "redux";
import { Objshape } from './../../components/Workspace/DataDisplay'

const apibase = process.env.REACT_APP_DJANGO_URL;

const structReducerDefaultState = {
  structs: [],
  loading: false,
  error: null,
};

export interface StructState {
  structs: Objshape[];
  loading: boolean;
  error: null | Error;
}

export const requestStructDjango = (pdbid: string) => {
  return async (dispatch: Dispatch<StructActionTypes>) => {
    dispatch({
      type: REQUEST_HOMOLOGS_GO,
    });
    var params = {
      pdbid: pdbid,
    };
    try {
      const mydata = await axios.get(`${apibase}/get_struct/`, { params });

      dispatch({
        type: REQUEST_STRUCT_SUCCESS,
        payload: mydata.data,
      });
    } catch (e) {
      dispatch({
        type: REQUEST_STRUCT_ERR,
        error: e,
      });
    }
  };
};


export const structReducer = (
  state: StructState = structReducerDefaultState,
  action: StructActionTypes
): StructState => {
  switch (action.type) {
    case "REQUEST_HOMOLOGS_GO":
      return { ...state, loading: true };
    case "REQUEST_STRUCT_ERR":
      return { ...state, loading: false, error: action.error };
    case "REQUEST_STRUCT_SUCCESS":
      return { ...state, structs: [...action.payload], loading: false };
    default:
      return state;
  }
};
