import { RXZDataTypes } from "../../DataInterfaces";
import { FiltersReducerState } from "./FiltersReducer";

export const FILTER_CHANGE           = "FILTER_CHANGE"
export type FilterType      = "PROTEIN_COUNT" | "YEAR" | "RESOLUTION" | "PROTEINS_PRESENT" | "SEARCH" | "SPECIES"
export type FilterPredicate = ( value: string[] | string | number[] | number ) =>(struct:RXZDataTypes) => boolean;
export type FilterData      = {
  set       : boolean;
  value     : string[] | string | number[] | number;
  allFilters?: FiltersReducerState
}

export interface filterChange {
  type: typeof FILTER_CHANGE,
   filttype:FilterType,
    newval: any,
     set:boolean,
    derived_filters: FiltersReducerState}

export type FiltersActionTypes = filterChange;

export const FilterPredicates : Record<FilterType,FilterPredicate> ={
"SEARCH"          :(value:any ) =>(struct:RXZDataTypes) => ( struct.struct.rcsb_id+struct.struct.citation_title+ struct.struct.citation_year+ struct.struct.citation_rcsb_authors+ struct.struct._organismName  ).toLowerCase().includes(value as string) ,
"PROTEIN_COUNT"   :(value:any ) =>(struct:RXZDataTypes) => struct.rps.length >= ( value as number[] )[0] && struct.rps.length<= ( value as number[] )[1],
"YEAR"            :(value:any ) =>(struct:RXZDataTypes) => struct.struct.citation_year >= ( value as number[] ) [0]  && struct.struct.citation_year <= (value as number[])[1],
"RESOLUTION"      :(value:any ) =>(struct:RXZDataTypes) => struct.struct.resolution >=( value as number[] ) [0]  && struct.struct.resolution <= (value as number[])[1],
"SPECIES"         :(value:any ) =>(struct:RXZDataTypes) => {
  // Structures frequently have more than one taxid associated with them. 
  // InSelected species cheks whether a particular taxid figures in the list of selecte fitlers
  const inSelectedSpecies = (taxid:number) => !( (value as number[]).includes(taxid)   )
  //  Collapse each of a struct's taxids to boolean based on the predicate. ANDQ all.
  return struct.struct._organismId.reduce((accumulator:boolean,taxid)=> { return inSelectedSpecies(taxid) || accumulator }, false)
},

// To implement:
"PROTEINS_PRESENT":(value:any ) =>(struct:RXZDataTypes) => struct.rps.length >= ( value as number[] )[0] && struct.rps.length<= ( value as number[] )[1],
}

export const filterChangeActionCreator = (filtersState:FiltersReducerState,filttype:FilterType, newval: any):filterChange =>{ 
  let filterTypeIsSet: boolean = (() => {
    switch (filttype) {
      case "PROTEINS_PRESENT":
        return !( newval.length ===0 );
      case "PROTEIN_COUNT":
        return !( newval[0] === 25 && newval[1] ===150 );
      case "RESOLUTION":
        return !( newval[0] === 1 && newval[1] ===6 );
      case "SEARCH":
        return !( newval.length===0  );
      case "SPECIES":
        return !( newval.length===0  );
      case "YEAR":
        return !( newval[0] === 2012 && newval[1] ===2021 );
      default:
        return false;
    }
  })();

  var filtIndex = filtersState.applied_filters.indexOf(filttype)
  // shallow copy
  var appliedFilters = filtersState.applied_filters;
  if ( filtIndex === -1  && filterTypeIsSet) {
    appliedFilters.push(filttype);
  }
  if (!( filtIndex===-1 )&&  !filterTypeIsSet) {
    appliedFilters.splice(filtIndex, 1);
  }

  var derived_state = {
    filters: {
      ...filtersState.filters,
      [filttype]: { set: filterTypeIsSet, value: newval },
    },
    applied_filters: appliedFilters,
  };

  return {
  type: FILTER_CHANGE,
  derived_filters:derived_state,
  filttype,
  newval,
  set:filterTypeIsSet
}}