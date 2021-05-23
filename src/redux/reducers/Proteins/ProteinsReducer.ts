import { RibosomalProtein } from './../../RibosomeTypes'
import { BanClassMetadataFiltType, ProteinActions } from './ActionTypes'
import { Filter, filterChange, FilterPredicates, FilterRegistry } from '../Filters/ActionTypes';
import { BanClassMetadata } from '../../DataInterfaces';
import { StructFilterType } from '../StructuresReducer/ActionTypes';
import { UpdateBundleProject } from 'typescript';
import { toInteger } from 'lodash';
import _ from 'lodash';


// !hack
type subunit_families =
 "e_SSU" |
  "b_SSU" |
  "u_SSU" |
  "u_LSU" |
  "e_LSU" |
  "b_LSU"


const BanClassesFilterRegistry: FilterRegistry<BanClassMetadataFiltType, BanClassMetadata> = {
  filtstate: {
    "SEARCH": {
      value: "",
      set: false,
      predicate: (value) => (banclass) => {
        
        if (value.length <1){return true}
        return banclass.banClass.toLowerCase().includes(value.toLowerCase())
      }
    },
    "SPECIES": {
      value: [],
      set: false,
      predicate: (value) => (banclass) => { return _.difference(banclass.organisms, value).length > 0 }
    },
  },
  applied: []
}







interface ProteinsReducerState {

  error: any,
  is_loading: boolean;
  errored_out: boolean;

  ban_class: RibosomalProtein[];
  ban_class_derived: RibosomalProtein[],

  all_proteins: RibosomalProtein[];
  all_proteins_derived: RibosomalProtein[],
  ban_classes: {
    e_LSU: BanClassMetadata[],
    b_LSU: BanClassMetadata[],
    u_LSU: BanClassMetadata[],
    e_SSU: BanClassMetadata[],
    b_SSU: BanClassMetadata[],
    u_SSU: BanClassMetadata[],
  }
  ban_classes_derived: {
    e_LSU: BanClassMetadata[],
    b_LSU: BanClassMetadata[],
    u_LSU: BanClassMetadata[],
    e_SSU: BanClassMetadata[],
    b_SSU: BanClassMetadata[],
    u_SSU: BanClassMetadata[],
  }
  ,
  ban_classes_filter_registry: FilterRegistry<BanClassMetadataFiltType, BanClassMetadata>



  current_page: number,
  pages_total: number,
}

const initialStateProteinsReducer: ProteinsReducerState = {
  ban_class: [],
  ban_class_derived: [],
  all_proteins: [],
  all_proteins_derived: [],
  ban_classes: {
    e_LSU: [],
    b_LSU: [],
    u_LSU: [],
    e_SSU: [],
    b_SSU: [],
    u_SSU: [],
  },
  ban_classes_derived: {
    e_LSU: [],
    b_LSU: [],
    u_LSU: [],
    e_SSU: [],
    b_SSU: [],
    u_SSU: [],
  },
  ban_classes_filter_registry: BanClassesFilterRegistry,
  error: null,

  // pagination
  current_page: 1,
  pages_total: 1,

  // net
  is_loading: false,
  errored_out: false

}
export const ProteinsReducer = (
  state: ProteinsReducerState = initialStateProteinsReducer,
  action: ProteinActions
): ProteinsReducerState => {
  switch (action.type) {
    // case "REQUEST_BAN_CLASS_GO":
    //   return { ...state, is_loading: true };
    // case "REQUEST_BAN_CLASS_SUCCESS":
    //   return {
    //     ...state,
    //     ban_class: action.payload,
    //     ban_class_derived: action.payload,
    //     pages_total: Math.ceil(action.payload.length / 20),
    //   };
    // case "REQUEST_BAN_CLASS_ERR":
    //   return {
    //     ...state,
    //     is_loading: false,
    //     error: action.error,
    //     errored_out: true,
    //   };
    // case "GOTO_PAGE_PROTEINS":
    //   if (action.pid <= state.pages_total && action.pid >= 1) {
    //     return { ...state, current_page: action.pid };
    //   }
    //   return state;
    // case "NEXT_PAGE_PROTEINS":
    //   if (state.current_page + 1 === state.pages_total) {
    //     return state;
    //   }
    //   return { ...state, current_page: state.current_page + 1 };
    // case "PREV_PAGE_PROTEINS":

    //   if (state.current_page - 1 < 1) {
    //     return state;
    //   }
    //   return { ...state, current_page: state.current_page - 1 };


    case "REQUEST_BAN_METADATA_GO":
      return { ...state, is_loading: true };
    case "REQUEST_BAN_METADATA_SUCCESS":


      var recieved = state.ban_classes
      recieved[action.family_subunit as subunit_families] = action.payload.sort((x, y) =>
        toInteger(x.banClass.slice(2)) - toInteger(y.banClass.slice(2))
      )

      return {
        ...state, is_loading        : false,
                 ban_classes        : recieved,
                 ban_classes_derived: recieved
      }
    case "REQUEST_BAN_METADATA_ERR":
      return { ...state, is_loading: false, errored_out: true }

    case "FILTER_BAN_METADATA":

      const updateAppliedFilters = (filter_type: BanClassMetadataFiltType, set: boolean, applied: BanClassMetadataFiltType[]): BanClassMetadataFiltType[] => {
        if ((set) && !(applied.includes(filter_type))) {
          return [...applied, filter_type]
        }
        else if (!(set) && (applied.includes(filter_type))) {
          return applied.filter(t => t !== filter_type)
        }
        else if (set && applied.includes(filter_type)) {
          return applied
        }
        else {
          return applied
        }
      }

      var filtered_classes = Object.assign({},state.ban_classes)


      var newApplied = updateAppliedFilters(action.filter_type, action.set, state.ban_classes_filter_registry.applied)

      var newFilterState: Filter<BanClassMetadata> = {
        set      : action.set,
        value    : action.newvalue,
        predicate: state.ban_classes_filter_registry.filtstate[action.filter_type].predicate
      }

      
      var nextFilters = Object.assign({},
        state.ban_classes_filter_registry,
        {
          filtstate: {
            ...state.ban_classes_filter_registry.filtstate,
            ...{ [action.filter_type]: newFilterState }
          }
        },
        { applied: newApplied }
        )


      for (var filter of newApplied) {
        
        for (var key of Object.keys(state.ban_classes)) {

        var filtx = [...state.ban_classes[key as subunit_families]].filter(state.ban_classes_filter_registry.filtstate[action.filter_type].predicate(action.newvalue))
        Object.assign(filtered_classes, {[key] : filtx  })
        }

      }
      
     return {...state, ban_classes_filter_registry:nextFilters, ban_classes_derived:filtered_classes}

    default:
      return state;
  }
};
