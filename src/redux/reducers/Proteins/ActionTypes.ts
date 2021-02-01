import {  Dispatch } from "redux";
import { getNeo4jData } from "../../AsyncActions/getNeo4jData";
import { NeoHomolog} from './../../DataInterfaces'
import { flattenDeep } from "lodash";
import { RibosomalProtein } from "../../RibosomeTypes";

export const REQUEST_ALL_PROTEINS_GO       =  "REQUEST_ALL_PROTEINS_GO";
export const REQUEST_ALL_PROTEINS_SUCCESS  =  "REQUEST_ALL_PROTEINS_SUCCESS";
export const REQUEST_ALL_PROTEINS_ERR      =  "REQUEST_ALL_PROTEINS_ERR";

export const REQUEST_BAN_CLASS_GO          =  "REQUEST_BAN_CLASS_GO";
export const REQUEST_BAN_CLASS_SUCCESS     =  "REQUEST_BAN_CLASS_SUCCESS";
export const REQUEST_BAN_CLASS_ERR         =  "REQUEST_BAN_CLASS_ERR";

export const GOTO_PAGE_PROTEINS               = "GOTO_PAGE_PROTEINS"
export const NEXT_PAGE_PROTEINS               = "NEXT_PAGE_PROTEINS"
export const PREV_PAGE_PROTEINS               = "PREV_PAGE_PROTEINS"


export interface requestAllProteinsGo       {type: typeof REQUEST_ALL_PROTEINS_GO;}
export interface requestAllProteinsSuccess  {type: typeof REQUEST_ALL_PROTEINS_SUCCESS;payload: RibosomalProtein[]}
export interface requestAllProteinsErrorr   {type: typeof REQUEST_ALL_PROTEINS_ERR;    error: Error;}

export interface requestBanClassGo          {type: typeof REQUEST_BAN_CLASS_GO;}
export interface requestBanClassSuccess     {type: typeof REQUEST_BAN_CLASS_SUCCESS;payload: NeoHomolog[]}
export interface requestBanClassErr         {type: typeof REQUEST_BAN_CLASS_ERR;    error: Error;}

export interface nextPageProts           {type: typeof NEXT_PAGE_PROTEINS;}
export interface prevPageProts           {type: typeof PREV_PAGE_PROTEINS;}
export interface gotoPageProts           {type: typeof GOTO_PAGE_PROTEINS;   pid:number ;}

export type ProteinActions =
  | requestAllProteinsGo
  | requestAllProteinsErrorr
  | requestAllProteinsSuccess

  | requestBanClassGo
  | requestBanClassSuccess
  | requestBanClassErr

  |nextPageProts
  |prevPageProts
  |gotoPageProts

export const requestBanClass =  (banName:string) => {
  return async (dispatch: Dispatch<ProteinActions>) => {
    dispatch({
      type:  REQUEST_BAN_CLASS_GO,
    });
    getNeo4jData("neo4j", { endpoint: "gmo_nom_class", params: {banName} })
    .then(
      response => {
        dispatch({
          type     :  REQUEST_BAN_CLASS_SUCCESS,
          payload  :  flattenDeep( response.data ) as any,
        });
      },
      error => {
        dispatch({
         type   :  REQUEST_BAN_CLASS_ERR,
         error  :  error,
        });
      }
    );
  };
};


export const gotopage = (pid: number): gotoPageProts => ({
  type: GOTO_PAGE_PROTEINS,
  pid
});
export const nextpage = (): nextPageProts => ({
  type: NEXT_PAGE_PROTEINS
});
export const prevpage = (): prevPageProts => ({
  type: PREV_PAGE_PROTEINS
});




