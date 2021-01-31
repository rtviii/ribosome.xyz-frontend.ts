import { NeoStruct } from "../../DataInterfaces";
import {filterChange} from './../Filters/ActionTypes'

export const REQUEST_STRUCTS_GO      = "REQUEST_STRUCTS_GO";
export const REQUEST_STRUCTS_SUCCESS = "REQUEST_STRUCTS_SUCCESS";
export const REQUEST_STRUCTS_ERR     = "REQUEST_STRUCTS_ERR";

export const GOTO_PAGE               = "GOTO_PAGE"
export const NEXT_PAGE               = "NEXT_PAGE"
export const PREV_PAGE               = "PREV_PAGE"




export interface gotopage {type: typeof GOTO_PAGE; page_id:number}
export interface nextpage {type: typeof NEXT_PAGE}
export interface prevpage {type: typeof PREV_PAGE}

export interface requestStructsSuccess  {type: typeof REQUEST_STRUCTS_SUCCESS;payload: NeoStruct[]}
export interface requestStructsGo       {type: typeof REQUEST_STRUCTS_GO;}
export interface requestStructsErr      {type: typeof REQUEST_STRUCTS_ERR;error: Error;}

export type StructActionTypes =
  | requestStructsErr
  | requestStructsGo
  | requestStructsSuccess
  | filterChange
  | gotopage
  | nextpage
  | prevpage;