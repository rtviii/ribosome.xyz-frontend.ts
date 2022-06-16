import { RNAActions, RnaFilter } from './ActionTypes'
import { RNAProfile} from '../../DataInterfaces'
import { Filter ,FilterRegistry } from '../Filters/ActionTypes';
import _ from 'lodash';
import { RNAClass } from '../../RibosomeTypes';



export type RnaSortType = "PDB_CODENAME" | "RESOLUTION" | "YEAR" | "SEQLEN"
const RnaSortsState:Record<RnaSortType,{
  reverse  : boolean,
  compareFn: (a:RNAProfile, b:RNAProfile) => 1 | 0 | -1
}> = {
  "PDB_CODENAME":{
    reverse:false,
    compareFn: (a,b)=>{
      var first  = a.parent_rcsb_id
      var second = b.parent_rcsb_id
      if (first===second){
        return 0
      }
      if (first>second){
        return 1
      }
      if (second>first){
        return -1
      }
      else return 0
    }
  },
  "RESOLUTION"         : {
    reverse:false,
    compareFn: (a,b)=>{
      var first  = a.parent_resolution
      var second = b.parent_resolution
      if (first===second){
        return 0
      }
      if (first>second){
        return 1
      }
      if (second>first){
        return -1
      }
      else return 0
    }
  },
  "YEAR"               : {
    reverse:false,
    compareFn: (a,b)=>{

      var first  = a.parent_year
      var second = b.parent_year
      if (first===second){
        return 0
      }
      if (first>second){
        return 1
      }
      if (second>first){
        return -1
      }
      else return 0
    }
  },

  "SEQLEN": {
    reverse:false,
    compareFn: (a,b)=>{
      var first  = a.entity_poly_seq_one_letter_code.length
      var second = b.entity_poly_seq_one_letter_code.length
      if (first===second){
        return 0
      }
      if (first>second){
        return 1
      }
      if (second>first){
        return -1
      }
      else return 0
    }

  }
}


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
        return (  rna.rcsb_pdbx_description + rna.host_organism_ids.reduce((a,b)=>a+b, '') ).toLowerCase().includes(value.toLowerCase())
      }
    },
    "SPECIES": {
      value    : [],
      set      : false,
      predicate: (value) => (rna) => {
        if (value.length ===0 ){return true}
        return _.intersection(value, rna.host_organism_ids).length > 0 
      }
    },
  },
  applied: []

}


interface RNAReducerState{

    seq_sort_applied : boolean
    current_rna_class: RNAClass
    error            : any,
    is_loading       : boolean;
    errored_out      : boolean;
    rna_filters      : FilterRegistry<RnaFilter, RNAProfile>,
    sorts_registry   : Record<RnaSortType, {
    reverse          : boolean,
    compareFn        : (a:RNAProfile, b:RNAProfile) => 1 | 0 | -1
  }>,
    rna_classes      : {
      [K in RNAClass]: RNAProfile[]
    },
    rna_classes_derived:{
      [K in RNAClass]: RNAProfile[]
    },
    current_page: number,
    pages_total : number,
}

const initialStateRNAReducer:RNAReducerState = {
  seq_sort_applied         : false,
  current_rna_class        : "5SrRNA",
  rna_classes              : {
    "5SrRNA"  : [],
    "5.8SrRNA": [],
    "12SrRNA" : [],
    "16SrRNA" : [],
    "21SrRNA" : [],
    "23SrRNA" : [],
    "25SrRNA" : [],
    "28SrRNA" : [],
    "35SrRNA" : [],
    "mRNA"    : [],
    "tRNA"    : [],
  },
  rna_classes_derived:{
    "5SrRNA"  : [],
    '5.8SrRNA': [],
    "12SrRNA" : [],
    "16SrRNA" : [],
    "21SrRNA" : [],
    "23SrRNA" : [],
    "25SrRNA" : [],
    "28SrRNA" : [],
    "35SrRNA" : [],
    "mRNA"    : [],
    "tRNA"    : [],
  },
    rna_filters : RnaClassFilterRegistry,
    sorts_registry: RnaSortsState,
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

        var filtx = [...state.rna_classes[key as RNAClass]].filter(state.rna_filters.filtstate[action.filter_type].predicate(action.newvalue))
        Object.assign(filtered_classes, {[key] : filtx  })
        }

      }
      
     return {...state, rna_filters:nextFilters, rna_classes_derived:filtered_classes, pages_total: Math.ceil(filtered_classes[state.current_rna_class].length/20) }


     case "RNA_SORT_CHANGE":
       
      var sorted_classes:any ={} 
      
      for (var x of Object.entries(state.rna_classes_derived)){
        var sorted_class = x[1].sort(state.sorts_registry[action.sorttype].compareFn)
        if(state.sorts_registry[action.sorttype].reverse){
          sorted_class = sorted_class.reverse()
        }
        sorted_classes[x[0]] = sorted_class
      }

      var newRegistry = Object.assign({}, state.sorts_registry)
      newRegistry[action.sorttype].reverse = !newRegistry[action.sorttype].reverse
      var newstate =  Object.assign({},state,
          { rna_classes_derived: sorted_classes },
          {sorts_registry: newRegistry},
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

