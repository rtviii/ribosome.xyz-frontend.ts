import {
  StructActionTypes,
  REQUEST_HOMOLOGS_GO,
  REQUEST_STRUCT_ERR,
  REQUEST_STRUCT_SUCCESS,
} from "./../../types/action.types";
import axios from "axios";
import { Dispatch } from "redux";

const apibase = process.env.REACT_APP_DJANGO_URL;

const structReducerDefaultState = {
  data: {},
  loading: false,
  error: false,
};

export const requestStructDjango = (pdbid: string) => {
  return async (dispatch: Dispatch<StructActionTypes>) => {
    dispatch({
      type: REQUEST_HOMOLOGS_GO,
    });
    var params = {
      pdbid: pdbid,
    };
    try {
      const response = await axios.get(`${apibase}/get_struct/`, { params });
      console.log("got resposne", response);
      dispatch({
        type: REQUEST_STRUCT_SUCCESS,
        payload: response.data,
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
  state = structReducerDefaultState,
  action: StructActionTypes
) => {
  switch (action.type) {
    case "REQUEST_HOMOLOGS_GO":
      return { ...state, loading: true };
    case "REQUEST_STRUCT_ERR":
      return { ...state, loading: false, error: action.error };
    case "REQUEST_STRUCT_SUCCESS":
      return { ...state, data: action.payload };
    default:
      return state;
  }
};
