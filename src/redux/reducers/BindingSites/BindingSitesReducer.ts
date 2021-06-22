import { BSitesActions, BSitesFilter } from './ActionTypes'
import { BindingSite, RNAProfile} from '../../DataInterfaces'
import { Filter ,FilterRegistry } from '../Filters/ActionTypes';
import _ from 'lodash';
import { lighten } from '@material-ui/core';


// ! DataType for a Binding Site. A union of parent struct with tht-+
const RnaClassFilterRegistry: FilterRegistry<BSitesFilter, BindingSite> = {

  filtstate: {
    "EXPERIMENTAL_METHOD":{
      value    : [],
      set      : false,
      predicate: (value) => (rna)=>{

        // if ( value.length === 0){
        //   return true
        // }
        // return  value.includes(rna.parent_method)
		return true
      }
    },
    "RESOLUTION":{
      value    : [0,5],
      set      : false,
      predicate: (value) => (rna)=>{
// return rna.parent_resolution >= (value as number[])[0] && rna.parent_resolution <= (value as number[])[1]
return true
      }
    },

    "YEAR": {
      value    : [2012, 2021],
      set      : false,
      predicate: (value) => (rna)=>{
    //  return rna.parent_year >= (value as number[])[0] && rna.parent_year <= (value as number[])[1]
     return true
      }
    },
    "SEARCH": {
      value: "",
      set: false,
      predicate: (value) => (rna) => {
        // return ( rna.parent_citation + rna.description + rna.orgid.reduce((a,b)=>a+b, '') ).toLowerCase().includes(value.toLowerCase())
        return true
      }
    },
    "SPECIES": {
      value    : [],
      set      : false,
      predicate: (value) => (rna) => {
        if (value.length ===0 ){return true}
        // return _.intersection(value, rna.orgid).length > 0 
        return true
      }
    },
  },

  applied: []

}


interface BindingSitesReducerState{

    error         : any,
    is_loading    : boolean;
    errored_out   : boolean;
    filters       : FilterRegistry<BSitesFilter, BindingSite>,
    current_page  : number,
    pages_total   : number,
    bsites        : BindingSite[]
    ligand_classes: {chemicalId:string, chemicalName: string}[]
}

const initialstateBindinginSitesReducer:BindingSitesReducerState = {
    current_page  : 1,
    pages_total   : 1,
    error         : null,
    is_loading    : false,
    errored_out   : false,
    filters       : RnaClassFilterRegistry,
    bsites        : [],
    ligand_classes: []
}

export const BindingSitesReducer = (
  state: BindingSitesReducerState = initialstateBindinginSitesReducer,
  action: BSitesActions
): BindingSitesReducerState => {
  switch (action.type) {

	case "REQUEST_ALL_BSITES_GO":
		return state
	case "REQUEST_ALL_BSITES_ERR":
		return state
	case "REQUEST_ALL_BSITES_SUCCESS":
		return {...state, bsites:action.bsites, ligand_classes:action.ligand_classes}
	default:
		return state
};
}
