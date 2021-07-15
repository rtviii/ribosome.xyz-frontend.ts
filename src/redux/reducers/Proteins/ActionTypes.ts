import {  Dispatch } from "redux";
import { getNeo4jData } from "../../AsyncActions/getNeo4jData";
import { BanClassMetadata, NeoHomolog, ProteinProfile} from './../../DataInterfaces'
import { flattenDeep } from "lodash";
import { BanClass, RibosomalProtein } from "../../RibosomeTypes";
import { filterChange } from "../Filters/ActionTypes";
import { TypeOfExpression } from "typescript";
import { AppActions } from "../../AppActions";

export const REQUEST_ALL_PROTEINS_GO      = "REQUEST_ALL_PROTEINS_GO"     ;
export const REQUEST_ALL_PROTEINS_SUCCESS = "REQUEST_ALL_PROTEINS_SUCCESS";
export const REQUEST_ALL_PROTEINS_ERR     = "REQUEST_ALL_PROTEINS_ERR"    ;
export const REQUEST_BAN_METADATA_GO      = "REQUEST_BAN_METADATA_GO"
export const REQUEST_BAN_METADATA_SUCCESS = "REQUEST_BAN_METADATA_SUCCESS"
export const REQUEST_BAN_METADATA_ERR     = "REQUEST_BAN_METADATA_ERR"

export const FILTER_BAN_METADATA          = "FILTER_BAN_METADATA"
export const FILTER_PROTEIN_CLASS         = "FILTER_PROTEIN_CLASS"

export const REQUEST_BAN_CLASS_GO         = "REQUEST_BAN_CLASS_GO"        ;
export const REQUEST_BAN_CLASS_SUCCESS    = "REQUEST_BAN_CLASS_SUCCESS"   ;
export const REQUEST_BAN_CLASS_ERR        = "REQUEST_BAN_CLASS_ERR"       ;

export const GOTO_PAGE_PROTEINS           = "GOTO_PAGE_PROTEINS"
export const NEXT_PAGE_PROTEINS           = "NEXT_PAGE_PROTEINS"
export const PREV_PAGE_PROTEINS           = "PREV_PAGE_PROTEINS"

export const PROTEIN_SORT_CHANGE          = "PROTEIN_SORT_CHANGE"


export type BanClassMetadataFiltType = "SEARCH"       | "SPECIES"
export type ProteinClassFilterTypes  = "SPECIES"      | "SEARCH"     | "YEAR" | "RESOLUTION" | "EXPERIMENTAL_METHOD"
export type ProteinSortType          = "PDB_CODENAME" | "RESOLUTION" | "YEAR" | "SEQLEN"


export interface requestBanMetadataGo      {type: typeof REQUEST_BAN_METADATA_GO }
export interface requestBanMetadataSuccess {type: typeof REQUEST_BAN_METADATA_SUCCESS, payload:BanClassMetadata[], family_subunit:string}
export interface requestBanMetadataErr     {type: typeof REQUEST_BAN_METADATA_ERR, error: Error}
export interface filterBanMetadata         {type: typeof FILTER_BAN_METADATA, 
  newvalue   : string,
  filter_type: BanClassMetadataFiltType
  set        : boolean
}
export interface filterProteinClass         {
  type       : typeof FILTER_PROTEIN_CLASS,
  newvalue   : string,
  filter_type: ProteinClassFilterTypes
  set        : boolean
}

export interface requestAllProteinsGo       {type: typeof REQUEST_ALL_PROTEINS_GO;}
export interface requestAllProteinsSuccess  {type: typeof REQUEST_ALL_PROTEINS_SUCCESS;payload: ProteinProfile[]}
export interface requestAllProteinsError    {type: typeof REQUEST_ALL_PROTEINS_ERR;    error: Error;}

export interface requestBanClassGo          {type: typeof REQUEST_BAN_CLASS_GO;}
export interface requestBanClassSuccess     {type: typeof REQUEST_BAN_CLASS_SUCCESS;payload: ProteinProfile[]}
export interface requestBanClassErr         {type: typeof REQUEST_BAN_CLASS_ERR;    error: Error;}

export interface nextPageProts              {type: typeof NEXT_PAGE_PROTEINS;}
export interface prevPageProts              {type: typeof PREV_PAGE_PROTEINS;}
export interface gotoPageProts              {type: typeof GOTO_PAGE_PROTEINS;   pid:number ;}


export interface proteinSortChange {type:typeof PROTEIN_SORT_CHANGE; sorttype :ProteinSortType}
export type ProteinActions =
    requestBanMetadataGo 
  | requestBanMetadataSuccess 
  | requestBanMetadataErr
  | filterBanMetadata
  | filterProteinClass
  | requestAllProteinsGo
  | requestAllProteinsError
  | requestAllProteinsSuccess

  | requestBanClassGo
  | requestBanClassSuccess
  | requestBanClassErr


  | nextPageProts
  | prevPageProts
  | gotoPageProts

  | proteinSortChange

export const BanMetadataFilterChangeAC = (newvalue:any,filter_type:BanClassMetadataFiltType):filterBanMetadata=>{
  
  let filterTypeIsSet: boolean = (() => {
    switch (filter_type) {
      case "SEARCH":
        return !(newvalue.length === 0);
      case "SPECIES":
        return !(newvalue.length === 0);
      default:
        return false;
    }
  })();
  
  return{
    set: filterTypeIsSet,
    filter_type,
    newvalue,
    type: FILTER_BAN_METADATA
  }
}

export const ProteinClassFilterChangeAC = (newvalue:any,filter_type:ProteinClassFilterTypes):filterProteinClass=>{
  let filterTypeIsSet: boolean = (() => {
    switch (filter_type) {
      case "SEARCH":
        return !(newvalue.length === 0);
      case "SPECIES":
        return !(newvalue.length === 0);
      case "EXPERIMENTAL_METHOD":
        return !(newvalue.length === 0)
      case "RESOLUTION":
        return !(newvalue[0] === 0 && newvalue[1] === 5);
      case "YEAR":
        return !(newvalue[0] === 2012 && newvalue[1] === 2021);
      default:
        return false;
    }
  })();
  return{
    set: filterTypeIsSet,
    filter_type,
    newvalue,
    type: FILTER_PROTEIN_CLASS
  }
}

export const requestBanMetadata =  (family:string, subunit:string) => {
  return async (dispatch: Dispatch<ProteinActions>) => {
    dispatch({
      type:  REQUEST_BAN_METADATA_GO
    });
    getNeo4jData("neo4j", { endpoint: "get_banclasses_metadata", params: {family,subunit} })
    .then(
      response => {
        
        dispatch({
          type          : REQUEST_BAN_METADATA_SUCCESS,
          payload       : flattenDeep( response.data ) as any,
          family_subunit: `${family}_${subunit}`

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

export const protein_sort_change = (sorttype:ProteinSortType): proteinSortChange => ({
  type: PROTEIN_SORT_CHANGE,
  sorttype
});




