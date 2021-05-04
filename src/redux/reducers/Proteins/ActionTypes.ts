import {  Dispatch } from "redux";
import { getNeo4jData } from "../../AsyncActions/getNeo4jData";
import { BanClassMetadata, NeoHomolog} from './../../DataInterfaces'
import { flattenDeep } from "lodash";
import { BanClass, RibosomalProtein } from "../../RibosomeTypes";
import { filterChange } from "../Filters/ActionTypes";
import { TypeOfExpression } from "typescript";
import { AppActions } from "../../AppActions";

export const REQUEST_ALL_PROTEINS_GO       =  "REQUEST_ALL_PROTEINS_GO";
export const REQUEST_ALL_PROTEINS_SUCCESS  =  "REQUEST_ALL_PROTEINS_SUCCESS";
export const REQUEST_ALL_PROTEINS_ERR      =  "REQUEST_ALL_PROTEINS_ERR";

export const REQUEST_BAN_METADATA_GO       =  "REQUEST_BAN_METADATA_GO"
export const REQUEST_BAN_METADATA_SUCCESS  =  "REQUEST_BAN_METADATA_SUCCESS"
export const REQUEST_BAN_METADATA_ERR      =  "REQUEST_BAN_METADATA_ERR"
export const FILTER_BAN_METADATA           =  "FILTER_BAN_METADATA"

export const REQUEST_BAN_CLASS_GO          =  "REQUEST_BAN_CLASS_GO";
export const REQUEST_BAN_CLASS_SUCCESS     =  "REQUEST_BAN_CLASS_SUCCESS";
export const REQUEST_BAN_CLASS_ERR         =  "REQUEST_BAN_CLASS_ERR";

export const GOTO_PAGE_PROTEINS               = "GOTO_PAGE_PROTEINS"
export const NEXT_PAGE_PROTEINS               = "NEXT_PAGE_PROTEINS"
export const PREV_PAGE_PROTEINS               = "PREV_PAGE_PROTEINS"




export interface requestBanMetadataGo      {type: typeof REQUEST_BAN_METADATA_GO}
export interface requestBanMetadataSuccess {type: typeof REQUEST_BAN_METADATA_SUCCESS, payload:BanClassMetadata[]}
export interface requestBanMetadataErr     {type: typeof REQUEST_BAN_METADATA_ERR, error: Error}
export interface filterBanMetadata         {type: typeof FILTER_BAN_METADATA, payload: string}

export interface requestAllProteinsGo       {type: typeof REQUEST_ALL_PROTEINS_GO;}
export interface requestAllProteinsSuccess  {type: typeof REQUEST_ALL_PROTEINS_SUCCESS;payload: RibosomalProtein[]}
export interface requestAllProteinsError    {type: typeof REQUEST_ALL_PROTEINS_ERR;    error: Error;}

export interface requestBanClassGo          {type: typeof REQUEST_BAN_CLASS_GO;}
export interface requestBanClassSuccess     {type: typeof REQUEST_BAN_CLASS_SUCCESS;payload: RibosomalProtein[]}
export interface requestBanClassErr         {type: typeof REQUEST_BAN_CLASS_ERR;    error: Error;}

export interface nextPageProts              {type: typeof NEXT_PAGE_PROTEINS;}
export interface prevPageProts              {type: typeof PREV_PAGE_PROTEINS;}
export interface gotoPageProts              {type: typeof GOTO_PAGE_PROTEINS;   pid:number ;}

export type ProteinActions =
    requestBanMetadataGo 
  | requestBanMetadataSuccess 
  | requestBanMetadataErr
  | filterBanMetadata
  | requestAllProteinsGo
  | requestAllProteinsError
  | requestAllProteinsSuccess

  | requestBanClassGo
  | requestBanClassSuccess
  | requestBanClassErr

  | filterChange

  | nextPageProts
  | prevPageProts
  | gotoPageProts

export const requestBanMetadata =  () => {

  return async (dispatch: Dispatch<ProteinActions>) => {
    dispatch({
      type:  REQUEST_BAN_METADATA_GO,
    });
    getNeo4jData("neo4j", { endpoint: "get_banclasses_metadata", params: null })
    .then(
      response => {
        dispatch({
          type     :  REQUEST_BAN_METADATA_SUCCESS,
          payload  :  flattenDeep( response.data ) as any,
        });
      },
      error => {
        dispatch({
         type   :  REQUEST_BAN_METADATA_ERR,
         error  :  error,
        });
      }
    );
  };
};

export const requestBanClass =  (banName:string, addToWorkspace:boolean) => {
  return async (dispatch: Dispatch<AppActions>) => {
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




