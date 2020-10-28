export const REQUEST_STRUCTS_GO      = "REQUEST_STRUCTS_GO";
export const REQUEST_STRUCTS_SUCCESS = "REQUEST_STRUCTS_SUCCESS";
export const REQUEST_STRUCTS_ERR     = "REQUEST_STRUCTS_ERR";

export const FILTER_STRUCTS_METHOD   = "FILTER_STRUCTS_METHOD";
export const FILTER_STRUCTS_SPECIES  = "FILTER_STRUCTS_SPECIES";
export const SEARCH_STRUCTS_PDBID    = "SEARCH_STRUCTS_PDBID";





export interface requestStructsSuccess {type: typeof REQUEST_STRUCTS_SUCCESS;payload: []}
export interface requestStructsGo {type: typeof REQUEST_STRUCTS_GO;}
export interface requestStructsErr {type: typeof REQUEST_STRUCTS_ERR;error: Error;}


export interface filterStructsMethod {type: typeof FILTER_STRUCTS_METHOD; payload: string}
export interface filterStructsSpecies {type: typeof FILTER_STRUCTS_SPECIES; payload: number}
export interface searchStructsPdbid {type: typeof SEARCH_STRUCTS_PDBID; payload: string}




export type StructActionTypes =
  | filterStructsMethod
  | filterStructsSpecies
  | searchStructsPdbid
  | requestStructsErr
  | requestStructsGo
  | requestStructsSuccess;