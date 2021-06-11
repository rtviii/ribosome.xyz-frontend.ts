import { RNAActions, RnaFilter } from './ActionTypes'
import { RNAProfile} from '../../DataInterfaces'
import { Filter ,FilterRegistry } from '../Filters/ActionTypes';
import _ from 'lodash';

export type RnaClass  =  "mrna" | "trna" | "5" | "5.8" | "12" | "16"| "21" | "23" | "25" |"28" |"35" | 'other'

const RnaClassFilterRegistry: FilterRegistry<RnaFilter, RNAProfile> = {
  filtstate: {
    "EXPERIMENTAL_METHOD":{
      value    : [],
      set      : false,
      predicate: (value) => (rna)=>{

        if ( value.length === 0){
          return true
        }
        return  value.includes(rna.parent_method)
      }
    },
    "RESOLUTION":{
      value    : [0,5],
      set      : false,
      predicate: (value) => (rna)=>{
return rna.parent_resolution >= (value as number[])[0] && rna.parent_resolution <= (value as number[])[1]
      }
    },

    "YEAR": {
      value    : [2012, 2021],
      set      : false,
      predicate: (value) => (rna)=>{
     return rna.parent_year >= (value as number[])[0] && rna.parent_year <= (value as number[])[1]
      }
    },
    "SEARCH": {
      value: "",
      set: false,
      predicate: (value) => (rna) => {
        return ( rna.parent_citation + rna.description + rna.orgid.reduce((a,b)=>a+b, '') ).toLowerCase().includes(value.toLowerCase())
      }
    },
    "SPECIES": {
      value    : [],
      set      : false,
      predicate: (value) => (rna) => {
        if (value.length ===0 ){return true}
        return _.intersection(value, rna.orgid).length > 0 
      }
    },
  },

  applied: []

}


interface RNAReducerState{

    seq_sort_applied : boolean
    current_rna_class: RnaClass
    error            : any,
    is_loading       : boolean;
    errored_out      : boolean;
    rna_filters      : FilterRegistry<RnaFilter, RNAProfile>,
    rna_classes      : {

      [K in RnaClass]: RNAProfile[]

    },
    rna_classes_derived:{

      [K in RnaClass]: RNAProfile[]

    },
    current_page: number,
    pages_total : number,
}

const initialStateRNAReducer:RNAReducerState = {
  seq_sort_applied         : false,
  current_rna_class        : "5",
  rna_classes              : {
    '5'    : [],
    "5.8"  : [],
    "12"   : [],
    "16"   : [],
    "21"   : [],
    "23"   : [],
    "25"   : [],
    "28"   : [],
    "35"   : [],
    "other": [],
    "mrna" : [],
    "trna" : [],
  },
  rna_classes_derived:{
    '5'    : [],
    "5.8"  : [],
    "12"   : [],
    "16"   : [],
    "21"   : [],
    "23"   : [],
    "25"   : [],
    "28"   : [],
    "35"   : [],
    "other": [],
    "mrna" : [],
    "trna" : [],
  },
    rna_filters : RnaClassFilterRegistry,
    current_page: 1,
    pages_total : 1,
    error       : null,
    is_loading  : false,
    errored_out : false

}
export const RNAReducer = (
  state: RNAReducerState = initialStateRNAReducer,
  action: RNAActions
): RNAReducerState => {
  switch (action.type) {

    case "REQUEST_RNA_CLASS_GO":

    return {...state, is_loading:true}
    case "REQUEST_RNA_CLASS_ERR":
      return {...state, is_loading:false, errored_out:true, error:action.error}
    case "REQUEST_RNA_CLASS_SUCCESS":

      var   base              = Object.assign({}, state.rna_classes)
      var   deriv             = Object.assign({}, state.rna_classes_derived)
      base [action.rna_class] = action.payload
      deriv[action.rna_class] = action.payload
      

      return {...state, ...{rna_classes: base, rna_classes_derived: deriv} , is_loading:false}
    case "FILTER_RNA_CLASS":

      const updateAppliedRnaFilters = (filter_type: RnaFilter, set: boolean, applied: RnaFilter[]): RnaFilter[] => {
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
      var filtered_classes                   = Object.assign({},state.rna_classes)
      var newApplied                         = updateAppliedRnaFilters(action.filter_type, action.set, state.rna_filters.applied)
      var newFilterState: Filter<RNAProfile> = {
        set      : action.set,
        value    : action.newvalue,
        predicate: state.rna_filters.filtstate[action.filter_type].predicate
      }

      
      var nextFilters = Object.assign({},
        state.rna_filters,
        {
          filtstate: {
            ...state.rna_filters.filtstate,
            ...{ [action.filter_type]: newFilterState }
          }
        },
        { applied: newApplied }
        )


      for (var filter of newApplied) {
        for (var key of Object.keys(state.rna_classes)) {

        var filtx = [...state.rna_classes[key as RnaClass]].filter(state.rna_filters.filtstate[action.filter_type].predicate(action.newvalue))
        Object.assign(filtered_classes, {[key] : filtx  })
        }

      }
      
     return {...state, rna_filters:nextFilters, rna_classes_derived:filtered_classes, pages_total: Math.ceil(filtered_classes[state.current_rna_class].length/20) }

    // 
     case"SORT_BY_SEQLEN":

      var sorted_classes:any ={} 
      
      for (var x of Object.entries(state.rna_classes_derived)){
        var sorted_class = x[1].sort((a, b) => {
        var al = a.seq.length;
        var bl = b.seq.length;
        if (al > bl) { 
         return 1 }
        if (bl > al) { 
          return -1 }
        return 0
      })
        if(state.seq_sort_applied){
          sorted_class = sorted_class.reverse()
        }
                    
        sorted_classes[x[0]] = sorted_class
      }
      
      var newstate =  Object.assign({},state,
          { rna_classes_derived: sorted_classes },
          { seq_sort_applied   : !state.seq_sort_applied }  )
      return newstate

    case "SELECT_RNA_CLASS":
      return {...state,
         current_rna_class: action.rna_class,
         pages_total      : Math.ceil(state.rna_classes_derived[action.rna_class].length/20),
         current_page     : 1,
        }

    case "GOTO_PAGE_RNA":
      if (action.pid <= state.pages_total && action.pid >= 1) {
        return { ...state, current_page: action.pid };
      }
      return state;
    case "NEXT_PAGE_RNA":
      if (state.current_page + 1 === state.pages_total) {
        return state;
      }
      return { ...state, current_page: state.current_page + 1 };
    case "PREV_PAGE_RNA":
      if (state.current_page - 1 < 1) {
        return state;
      }
      return { ...state, current_page: state.current_page - 1 };
    default:
      return state;
  }
};

