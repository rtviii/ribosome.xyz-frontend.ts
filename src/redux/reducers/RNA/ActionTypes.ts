import {  Dispatch } from "redux";
import { getNeo4jData } from "../../AsyncActions/getNeo4jData";
import { NeoHomolog, RNAProfile} from './../../DataInterfaces'
import { flattenDeep } from "lodash";
import { filterChange } from "../Filters/ActionTypes";

export const REQUEST_ALL_RNA_GO       =  "REQUEST_ALL_RNA_GO";
export const REQUEST_ALL_RNA_SUCCESS  =  "REQUEST_ALL_RNA_SUCCESS";
export const REQUEST_ALL_RNA_ERR      =  "REQUEST_ALL_RNA_ERR";

export const GOTO_PAGE_RNA               = "GOTO_PAGE_RNA"
export const NEXT_PAGE_RNA               = "NEXT_PAGE_RNA"
export const PREV_PAGE_RNA               = "PREV_PAGE_RNA"


export interface requestAllRNAGo       {type: typeof REQUEST_ALL_RNA_GO;}
export interface requestAllRNASuccess  {type: typeof REQUEST_ALL_RNA_SUCCESS;payload: RNAProfile[]}
export interface requestAllRNAErrorr   {type: typeof REQUEST_ALL_RNA_ERR;    error: Error;}


export interface nextPageRNA           {type: typeof NEXT_PAGE_RNA;}
export interface prevPageRNA           {type: typeof PREV_PAGE_RNA;}
export interface gotoPageRNA           {type: typeof GOTO_PAGE_RNA;   pid:number ;}

export type RNAActions =
  | requestAllRNAGo
  | requestAllRNASuccess
  | requestAllRNAErrorr
  
  | filterChange

  |nextPageRNA
  |prevPageRNA
  |gotoPageRNA

export const requestAllRNAs =  () => {
  return async (dispatch: Dispatch<RNAActions>) => {
    dispatch({
      type:  REQUEST_ALL_RNA_GO,
    });
    getNeo4jData("neo4j", { endpoint: "get_all_rnas", params: null })
    .then(
      response => {
        dispatch({
          type     :  REQUEST_ALL_RNA_SUCCESS,
          payload  :  flattenDeep( response.data ) as any,
        });
      },
      error => {
        dispatch({
         type   :  REQUEST_ALL_RNA_ERR,
         error  :  error,
        });
      }
    );
  };
};


export const gotopage = (pid: number): gotoPageRNA => ({
  type: GOTO_PAGE_RNA,
  pid
});
export const nextpage = (): nextPageRNA => ({
  type: NEXT_PAGE_RNA

});
export const prevpage = (): prevPageRNA => ({
  type: PREV_PAGE_RNA
});




