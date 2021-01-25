import { NeoStruct } from "./StructuresReducer";

export const REQUEST_STRUCTS_GO       =  "REQUEST_STRUCTS_GO";
export const REQUEST_STRUCTS_SUCCESS  =  "REQUEST_STRUCTS_SUCCESS";
export const REQUEST_STRUCTS_ERR      =  "REQUEST_STRUCTS_ERR";
export const FILTER_ON_SPECIES        =  "FILTER_ON_SPECIES"
export const FILTER_CHANGE            =  "FILTER_CHANGE"

export type FilterType      = "PROTEIN_COUNT" | "YEAR" | "RESOLUTION" | "PROTEINS_PRESENT" | "SEARCH" | "SPECIES"
export type FilterPredicate = ( value: string[] | string | number[] | number ) =>(struct:NeoStruct) => boolean;
export type FilterData      = {
  set            : boolean;
  value          : string[] | string | number[] | number;
}


export interface filterChange {type: typeof FILTER_CHANGE, filttype:FilterType, newval: any, set:boolean}
export interface requestStructsSuccess {type: typeof REQUEST_STRUCTS_SUCCESS;payload: []}
export interface requestStructsGo {type: typeof REQUEST_STRUCTS_GO;}
export interface requestStructsErr {type: typeof REQUEST_STRUCTS_ERR;error: Error;}

// export interface filterStructsMethod {type: typeof FILTER_STRUCTS_METHOD; payload: string}
// export interface filterStructsSpecies {type: typeof FILTER_STRUCTS_SPECIES; payload: number}

// export interface filterOnPpdbid {type: typeof FILTER_ON_PDBID; payload: string}
// export interface filterOnRangeChange {type: typeof FILTER_ON_RANGE_CHANGE; slidertype:SliderFilterType, newrange:number[]}

// // TO IMPLEMENT
// export interface filterOnSpecies {type: typeof FILTER_ON_SPECIES; payload: number[]}
// export interface filterOnProteinsPresent    {type: typeof FILTER_ON_PROTEINS_PRESENT; payload: string[]}

export type StructActionTypes =
  // | filterStructsMethod
  // | filterStructsSpecies
  | requestStructsErr
  | requestStructsGo
  | requestStructsSuccess
  |filterChange
  // | filterOnPpdbid
  // | filterOnSpecies
  // | filterOnProteinsPresent
  // | filterOnRangeChange;