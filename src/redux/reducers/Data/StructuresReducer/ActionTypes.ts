import { NeoStruct } from "./StructuresReducer";

export const REQUEST_STRUCTS_GO      = "REQUEST_STRUCTS_GO";
export const REQUEST_STRUCTS_SUCCESS = "REQUEST_STRUCTS_SUCCESS";
export const REQUEST_STRUCTS_ERR     = "REQUEST_STRUCTS_ERR";

export const FILTER_CHANGE           = "FILTER_CHANGE"

export const GOTO_PAGE               = "GOTO_PAGE"
export const NEXT_PAGE               = "NEXT_PAGE"
export const PREV_PAGE               = "PREV_PAGE"

export type FilterType      = "PROTEIN_COUNT" | "YEAR" | "RESOLUTION" | "PROTEINS_PRESENT" | "SEARCH" | "SPECIES"
export type FilterPredicate = ( value: string[] | string | number[] | number ) =>(struct:NeoStruct) => boolean;
export type FilterData      = {
  set            : boolean;
  value          : string[] | string | number[] | number;
}



export interface gotopage {type: typeof GOTO_PAGE; page_id:number}
export interface nextpage {type: typeof NEXT_PAGE}
export interface prevpage {type: typeof PREV_PAGE}

export interface filterChange {type: typeof FILTER_CHANGE, filttype:FilterType, newval: any, set:boolean}

export interface requestStructsSuccess {type: typeof REQUEST_STRUCTS_SUCCESS;payload: []}
export interface requestStructsGo {type: typeof REQUEST_STRUCTS_GO;}
export interface requestStructsErr {type: typeof REQUEST_STRUCTS_ERR;error: Error;}


export type StructActionTypes =
  | requestStructsErr
  | requestStructsGo
  | requestStructsSuccess
  | filterChange
  | gotopage|nextpage|prevpage;