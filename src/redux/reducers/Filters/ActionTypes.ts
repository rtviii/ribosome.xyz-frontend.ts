import _ from "lodash";
import { RXZDataTypes ,NeoStruct, NeoHomolog } from "../../DataInterfaces";
import { FiltersReducerState } from "./FiltersReducer";

export interface filterChange {
  type           : typeof FILTER_CHANGE,
  filttype       : FilterType,
  newval         : any,
  set            : boolean,
  derived_filters: FiltersReducerState}

export type FiltersActionTypes = filterChange;
export const FILTER_CHANGE  = "FILTER_CHANGE"
export type FilterType      = "PROTEIN_COUNT" | "YEAR" | "RESOLUTION" | "PROTEINS_PRESENT" | "SEARCH" | "SPECIES"
export type FilterPredicate = ( value: string[] | string | number[] | number ) =>(item: RXZDataTypes) => boolean;
export type FilterData      = {
  set        : boolean;
  value      : string[] | string | number[] | number;
  allFilters?: FiltersReducerState
}


type DataType = "STRUCTURE"| "PROTEIN"| "LIGAND"| "RNA" 
type   PartialRecord<K extends keyof any, T> = {[P in K]?: T;};


// I would really love to get out of that cast inside each predicate. Not sure how to type this properly.
export const FilterPredicates: Record<
  FilterType,
  PartialRecord<DataType, FilterPredicate>
> = {
  SEARCH: {
    STRUCTURE: (value: any) => (item: RXZDataTypes) => {
      var struct = item as NeoStruct;
      return (
        struct.struct.rcsb_id +
        struct.struct.citation_title +
        struct.struct.citation_year +
        struct.struct.citation_rcsb_authors +
        struct.struct._organismName
      )
        .toLowerCase()
        .includes(value as string);
    },
  },

  YEAR: {
    STRUCTURE: (value: any) => (item: RXZDataTypes) => {
      var struct = item as NeoStruct;
      return (
        struct.struct.citation_year >= (value as number[])[0] &&
        struct.struct.citation_year <= (value as number[])[1]
      );
    },
  },

  RESOLUTION: {
    STRUCTURE: (value: any) => (item: RXZDataTypes) => {
      var struct = item as NeoStruct;

      return (
        struct.struct.resolution >= (value as number[])[0] &&
        struct.struct.resolution <= (value as number[])[1]
      );
    },
  },

  SPECIES: {
    STRUCTURE: (value: any) => (item: RXZDataTypes) => {
      var struct = item as NeoStruct;
      return struct.struct._organismId.reduce(
        (accumulator: boolean, taxid) =>
          accumulator || (value as number[]).includes(taxid),
        false
      );
    },
  },
  // Should be made into generics --------

  PROTEIN_COUNT: {
    STRUCTURE: (value: any) => (item: RXZDataTypes) => {
      var struct = item as NeoStruct;
      return (
        struct.rps.length >= (value as number[])[0] &&
        struct.rps.length <= (value as number[])[1]
      );
    },
  },
  PROTEINS_PRESENT: {
    STRUCTURE: (value: any) => (item: RXZDataTypes) => {
      // if (typeof struct === NeoStruct)
      // for every rp that a structure has, check whether
      // length is zero
      // any of the names conform with the values passed (push to accumulator if yes)
      var struct = item as NeoStruct;
      var presence = struct.rps.reduce((accumulator: string[], instance) => {
        return instance.noms.length === 0
          ? accumulator
          : value.includes(instance.noms[0])
          ? [...accumulator, instance.noms[0]]
          : accumulator;
      }, []);
      // If accumulator contains the same elements as the passed value ==> the struct passes
      return _.isEmpty(_.xor(value, presence));
    },
  },
};








// Filtr predicates are the the set of functionals that define the comparison logic for 
// the spaces that are being filtered.  Reducers  particular to thos spaces import this
// export const FilterPredicates : Record<FilterType,FilterPredicate> ={

// // Should be made into generics --------
// "SEARCH"          :(value:any ) =>(struct:RXZDataTypes) => ( struct.struct.rcsb_id+struct.struct.citation_title+ struct.struct.citation_year+ struct.struct.citation_rcsb_authors+ struct.struct._organismName  ).toLowerCase().includes(value as string) ,
// "YEAR"            :(value:any ) =>(struct:RXZDataTypes) => struct.( struct as NeoStruct ).citation_year >= ( value as number[] ) [0]  && struct.struct.citation_year <= (value as number[])[1],
// "RESOLUTION"      :(value:any ) =>(struct:RXZDataTypes) => struct.struct.resolution >=( value as number[] ) [0]  && struct.struct.resolution <= (value as number[])[1],
// "SPECIES"         :(value:any ) =>(struct:RXZDataTypes) => struct.struct._organismId.reduce((accumulator:boolean,taxid)=>  accumulator || ( value as number[] ).includes(taxid), false),
// // Should be made into generics --------

// "PROTEIN_COUNT"   :(value:any ) =>(struct:RXZDataTypes) => struct.rps.length >= ( value as number[] )[0] && struct.rps.length<= ( value as number[] )[1],
// "PROTEINS_PRESENT":(value:any ) =>(struct:RXZDataTypes) => {
//   // if (typeof struct === NeoStruct)
//   // for every rp that a structure has, check whether 
//   // length is zero
//   // any of the names conform with the values passed (push to accumulator if yes)
//   var presence = struct.rps.reduce((accumulator:string[], instance)=>{
//     return instance.noms.length === 0  ? accumulator : 
//     (value.includes( instance.noms[0] ) ? [...accumulator, instance.noms[0]]:  accumulator)
//   }, [])
//   // If accumulator contains the same elements as the passed value ==> the struct passes
//   return _.isEmpty(_.xor(value,presence))
// },
// }

// This is the "bottleneck" or switchboard action creator where the derived filters-state  is actually calclated
// before it is actually emitted to the FILTERS reducer as well as all the other reducers that rley on the state of th filters like, strucutres reducer, say.
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
