import { NeoStruct } from "../../DataInterfaces";
import {filterChange} from './../Filters/ActionTypes'

export const REQUEST_STRUCTS_GO      = "REQUEST_STRUCTS_GO";
export const REQUEST_STRUCTS_SUCCESS = "REQUEST_STRUCTS_SUCCESS";
export const REQUEST_STRUCTS_ERR     = "REQUEST_STRUCTS_ERR";

export const GOTO_PAGE_STRUCTS               = "GOTO_PAGE_STRUCTS"
export const NEXT_PAGE_STRUCTS               = "NEXT_PAGE_STRUCTS"
export const PREV_PAGE_STRUCTS               = "PREV_PAGE_STRUCTS"




export interface gotopage {type: typeof GOTO_PAGE_STRUCTS; page_id:number}
export interface nextpage {type: typeof NEXT_PAGE_STRUCTS}
export interface prevpage {type: typeof PREV_PAGE_STRUCTS}

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