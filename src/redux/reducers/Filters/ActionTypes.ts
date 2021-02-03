import _ from "lodash";
import {
  RXZDataTypes,
  NeoStruct,
  NeoHomolog,
  RNAProfile,
  LigandResponseShape,
} from "../../DataInterfaces";
import { FiltersReducerState } from "./FiltersReducer";

export interface filterChange {
  type: typeof FILTER_CHANGE;
  filttype: FilterType;
  newval: any;
  set: boolean;
  derived_filters: FiltersReducerState;
}

export type FiltersActionTypes = filterChange;
export const FILTER_CHANGE = "FILTER_CHANGE";
export type FilterType =
  | "PROTEIN_COUNT"
  | "YEAR"
  | "RESOLUTION"
  | "PROTEINS_PRESENT"
  | "SEARCH"
  | "SPECIES";
export type FilterPredicate = (
  value: string[] | string | number[] | number
) => (item: RXZDataTypes) => boolean;
export type FilterData = {
  set: boolean;
  value: string[] | string | number[] | number;
  allFilters?: FiltersReducerState;
};

type DataType = "STRUCTURE" | "PROTEIN" | "LIGAND" | "RNA";
type PartialRecord<K extends keyof any, T> = { [P in K]?: T };

// I would really love to get out of that cast inside each predicate. Not sure how to type this properly.
// If no filter is implemented, the predicate should return TRUE(all items pass)
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
    PROTEIN: (value: any) => (item: RXZDataTypes) => {
      var prot = item as NeoHomolog;
      return (
        prot.parent +
        prot.protein.nomenclature +
        prot.protein.pfam_comments +
        prot.protein.pfam_descriptions +
        prot.protein.rcsb_pdbx_description +
        prot.title +
        prot.orgname.reduce((acc, name) => acc + name, "")
      )
        .toLowerCase()
        .includes(value as string);
    },
    RNA: (value: any) => (item: RXZDataTypes) => {
      var rna = item as RNAProfile;

      return (
        rna.title +
        rna.parent +
        rna.orgname.reduce((acc, name) => acc + name, "")
      )
        .toLowerCase()
        .includes(value as string);
    },
    LIGAND: (value: any) => (item: RXZDataTypes) => {
      var lig = item as LigandResponseShape;
      return (lig.ligand.chemicalName + lig.ligand.chemicalId)
        .toLowerCase()
        .includes(value as string);
    }
  },

  YEAR: {
    STRUCTURE: value => (item: RXZDataTypes) => {
      var struct = item as NeoStruct;
      return (
        struct.struct.citation_year >= (value as number[])[0] &&
        struct.struct.citation_year <= (value as number[])[1]
      );
    },
    PROTEIN: value => item => true,
    RNA: (value: any) => (item: RXZDataTypes) => true,
    LIGAND: (value: any) => (item: RXZDataTypes) => true
  },

  RESOLUTION: {
    STRUCTURE: (value: any) => (item: RXZDataTypes) => {
      var struct = item as NeoStruct;

      return (
        struct.struct.resolution >= (value as number[])[0] &&
        struct.struct.resolution <= (value as number[])[1]
      );
    },
    PROTEIN: value => item => true,
    RNA: (value: any) => (item: RXZDataTypes) => true,

    LIGAND: (value: any) => (item: RXZDataTypes) => true
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
    PROTEIN: (value: any) => (item: RXZDataTypes) => {
      var prot = item as NeoHomolog;
      return prot.orgid.reduce(
        (accumulator: boolean, taxid) =>
          accumulator || (value as number[]).includes(taxid),
        false
      );
    },
    RNA: (value: any) => (item: RXZDataTypes) => {
      var rna = item as RNAProfile;

      return rna.orgid.reduce(
        (accumulator: boolean, taxid) =>
          accumulator || (value as number[]).includes(taxid),
        false
      );
    },
    LIGAND: (value: any) => (item: RXZDataTypes) => {
      var lig = item as LigandResponseShape;

      return lig.presentIn.reduce(
        // oute reduce: for eveyr structure, check wether it is present in the selected species
        (structWiseAccumulator :boolean, struct) => structWiseAccumulator  || struct._organismId.reduce(
        // inner reduce: for every species associated with a structure, check whether it is inside fitler values
        (inStructSpeciesAccumulator: boolean, taxid) =>inStructSpeciesAccumulator || (value as number[]).includes(taxid),false)
        ,false)
    }
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
    PROTEIN: value => item => true,
    RNA: (value: any) => (item: RXZDataTypes) => true,
    LIGAND: (value: any) => (item: RXZDataTypes) => true
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
    PROTEIN: value => item => true,
    RNA: (value: any) => (item: RXZDataTypes) => true,
    LIGAND: (value: any) => (item: RXZDataTypes) => true
  },
};

// This is the "bottleneck" or switchboard action creator where the derived filters-state  is actually calclated
// before it is actually emitted to the FILTERS reducer as well as all the other reducers that rley on the state of th filters like, strucutres reducer, say.
export const filterChangeActionCreator = (
  filtersState: FiltersReducerState,
  filttype: FilterType,
  newval: any
): filterChange => {
  let filterTypeIsSet: boolean = (() => {
    switch (filttype) {
      case "PROTEINS_PRESENT":
        return !(newval.length === 0);
      case "PROTEIN_COUNT":
        return !(newval[0] === 25 && newval[1] === 150);
      case "RESOLUTION":
        return !(newval[0] === 1 && newval[1] === 6);
      case "SEARCH":
        return !(newval.length === 0);
      case "SPECIES":
        return !(newval.length === 0);
      case "YEAR":
        return !(newval[0] === 2012 && newval[1] === 2021);
      default:
        return false;
    }
  })();

  var filtIndex = filtersState.applied_filters.indexOf(filttype);
  // shallow copy
  var appliedFilters = filtersState.applied_filters;
  if (filtIndex === -1 && filterTypeIsSet) {
    appliedFilters.push(filttype);
  }
  if (!(filtIndex === -1) && !filterTypeIsSet) {
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
    derived_filters: derived_state,
    filttype,
    newval,
    set: filterTypeIsSet,
  };
};
