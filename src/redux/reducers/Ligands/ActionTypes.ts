import {  Dispatch } from "redux";
import { getNeo4jData } from "../../AsyncActions/getNeo4jData";
import { LigandResponseShape} from './../../DataInterfaces'
import { flattenDeep } from "lodash";
import { filterChange } from "../Filters/ActionTypes";

export const REQUEST_ALL_LIGANDS_GO       =  "REQUEST_ALL_LIGANDS_GO";
export const REQUEST_ALL_LIGANDS_SUCCESS  =  "REQUEST_ALL_LIGANDS_SUCCESS";
export const REQUEST_ALL_LIGANDS_ERR      =  "REQUEST_ALL_LIGANDS_ERR";

export const GOTO_PAGE_LIGANDS               = "GOTO_PAGE_LIGANDS"
export const NEXT_PAGE_LIGANDS               = "NEXT_PAGE_LIGANDS"
export const PREV_PAGE_LIGANDS               = "PREV_PAGE_LIGANDS"


export interface requestAllLigandsGo       {type: typeof REQUEST_ALL_LIGANDS_GO;}
export interface requestAllLigandsSuccess  {type: typeof REQUEST_ALL_LIGANDS_SUCCESS;payload: LigandResponseShape[]}
export interface requestAllLigandsError    {type: typeof REQUEST_ALL_LIGANDS_ERR;    error: Error;}


export interface nextPageLigands           {type: typeof NEXT_PAGE_LIGANDS;}
export interface prevPageLigands           {type: typeof PREV_PAGE_LIGANDS;}
export interface gotoPageLigands           {type: typeof GOTO_PAGE_LIGANDS;   pid:number ;}

export type LigandsActions =
  | requestAllLigandsSuccess
  | requestAllLigandsGo
  | requestAllLigandsError

  | filterChange

  |nextPageLigands
  |prevPageLigands
  |gotoPageLigands

export const requestAllLigands =  () => {
  return async (dispatch: Dispatch<LigandsActions>) => {
    dispatch({
      type:  REQUEST_ALL_LIGANDS_GO,
    });
    getNeo4jData("neo4j", { endpoint: "get_all_ligands", params: null })
    .then(
      response => {
        dispatch({
          type     :  REQUEST_ALL_LIGANDS_SUCCESS,
          payload  :  flattenDeep( response.data ) as any,
        });
      },
      error => {
        dispatch({
         type   :  REQUEST_ALL_LIGANDS_ERR,
         error  :  error,
        });
      }
    );
  };
};


export const gotopage = (pid: number): gotoPageLigands => ({
  type: GOTO_PAGE_LIGANDS,
  pid
});
export const nextpage = (): nextPageLigands => ({
  type: NEXT_PAGE_LIGANDS
});
export const prevpage = (): prevPageLigands => ({
  type: PREV_PAGE_LIGANDS
});




