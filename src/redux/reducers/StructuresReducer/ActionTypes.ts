import { NeoStruct } from "../../DataInterfaces";
import {FilterType, resetFilters } from './../Filters/ActionTypes'

export const REQUEST_STRUCTS_GO      = "REQUEST_STRUCTS_GO";
export const REQUEST_STRUCTS_SUCCESS = "REQUEST_STRUCTS_SUCCESS";
export const REQUEST_STRUCTS_ERR     = "REQUEST_STRUCTS_ERR";

export const GOTO_PAGE_STRUCTS               = "GOTO_PAGE_STRUCTS"
export const NEXT_PAGE_STRUCTS               = "NEXT_PAGE_STRUCTS"
export const PREV_PAGE_STRUCTS               = "PREV_PAGE_STRUCTS"

export const STRUCTS_FILTER_CHANGE = "STRUCTS_FILTER_CHANGE"
export const STRUCTS_SORT_CHANGE   = "STRUCTS_SORT_CHANGE"

export type StructFilterType =
  | "YEAR"
  | "RESOLUTION"
  | "PROTEINS_PRESENT"
  | "SEARCH"
  | "SPECIES"
  | "EXPERIMENTAL_METHOD";

export type StructSortType = 
"YEAR"|"NUMBER_OF_PROTEINS"|"RESOLUTION" | "PDB_CODENAME"




export interface gotopage {type: typeof GOTO_PAGE_STRUCTS; page_id:number}
export interface nextpage {type: typeof NEXT_PAGE_STRUCTS}
export interface prevpage {type: typeof PREV_PAGE_STRUCTS}

export interface requestStructsSuccess  {
  type   : typeof REQUEST_STRUCTS_SUCCESS;
  payload: NeoStruct[]}
export interface requestStructsGo       {type: typeof REQUEST_STRUCTS_GO;}
export interface requestStructsErr      {type: typeof REQUEST_STRUCTS_ERR;error: Error;}

export interface structsSortChange{type: typeof STRUCTS_SORT_CHANGE;sortType: StructSortType;}

export interface structsFilterChange      {
  type       : typeof STRUCTS_FILTER_CHANGE;
  set        : boolean,
  newval   : string[] | string | number[] | number;
  filter_type: StructFilterType
}

export const structsSortChangeAC = (sortType: StructSortType) => ({ type:  STRUCTS_SORT_CHANGE, sortType })
export const structsFilterChangeAC = (
  newval     : any,
  filter_type: StructFilterType
  ): structsFilterChange =>{

  let filterTypeIsSet: boolean = (() => {
    switch (filter_type) {
      case "PROTEINS_PRESENT":
        return !(newval.length === 0);
      case "EXPERIMENTAL_METHOD":
        return !(newval.length < 1);
      // case "PROTEIN_COUNT":
      //   return !(newval[0] === 25 && newval[1] === 150);
      case "RESOLUTION":
        return !(newval[0] === 1 && newval[1] === 6);
      case "YEAR":
        return !(newval[0] === 2012 && newval[1] === 2021);
      case "SEARCH":
        return !(newval.length === 0);
      case "SPECIES":
        return !(newval.length === 0);
      default:
        return false;
    }
  })();

  return{
    set: filterTypeIsSet,
    filter_type,
    newval,
    type: STRUCTS_FILTER_CHANGE
  }

}


export type StructActionTypes =
  | requestStructsErr
  | requestStructsGo
  | requestStructsSuccess
  | gotopage
  | nextpage
  | prevpage
  | resetFilters
  | structsFilterChange
  | structsSortChange