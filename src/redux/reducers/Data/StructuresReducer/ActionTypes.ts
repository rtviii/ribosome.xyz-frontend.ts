export const REQUEST_STRUCTS_GO      = "REQUEST_STRUCTS_GO";
export const REQUEST_STRUCTS_SUCCESS = "REQUEST_STRUCTS_SUCCESS";
export const REQUEST_STRUCTS_ERR     = "REQUEST_STRUCTS_ERR";

export const FILTER_STRUCTS_METHOD   = "FILTER_STRUCTS_METHOD";
export const FILTER_STRUCTS_SPECIES  = "FILTER_STRUCTS_SPECIES";
export const SEARCH_STRUCTS_PDBID    = "SEARCH_STRUCTS_PDBID";


 export const FILTER_ON_PDBID   = "FILTER_ON_PDBID"
 export const FILTER_ON_SPECIES = "FILTER_ON_SPECIES"







export interface requestStructsSuccess {type: typeof REQUEST_STRUCTS_SUCCESS;payload: []}
export interface requestStructsGo {type: typeof REQUEST_STRUCTS_GO;}
export interface requestStructsErr {type: typeof REQUEST_STRUCTS_ERR;error: Error;}

export interface filterStructsMethod {type: typeof FILTER_STRUCTS_METHOD; payload: string}
export interface filterStructsSpecies {type: typeof FILTER_STRUCTS_SPECIES; payload: number}
export interface searchStructsPdbid {type: typeof SEARCH_STRUCTS_PDBID; payload: string}

export interface filterOnPpdbid {type: typeof FILTER_ON_PDBID; payload: string}
export interface filterOnSpecies {type: typeof FILTER_ON_SPECIES; payload: number}



export type StructActionTypes =
  | filterStructsMethod
  | filterStructsSpecies
  | searchStructsPdbid
  | requestStructsErr
  | requestStructsGo
  | requestStructsSuccess



  |filterOnPpdbid|filterOnSpecies;