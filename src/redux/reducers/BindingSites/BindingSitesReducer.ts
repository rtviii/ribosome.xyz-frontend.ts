import { BSitesActions } from './ActionTypes'
import { BindingSite, LigandBindingSite, LigandClass, LigandPrediction, MixedLigand, NeoStruct, StructureBindingSites } from '../../DataInterfaces'
import { Protein } from '../../RibosomeTypes'
import _, { filter } from 'lodash'


export interface BindingSitesReducerState{

    error         : any,
    is_loading    : boolean;
    errored_out   : boolean;

    visualization_tab: "origin" | 'prediction',
    bsites           : BindingSite[],

    factors    : LigandClass[],
    antibiotics: LigandClass[],
    mrna       : LigandClass[],
    trna       : LigandClass[],

    current_binding_site: BindingSite | null
    current_ligand_class: LigandClass | null,
    current_target      : NeoStruct   | null,

    binding_site_data : LigandBindingSite | null,
    prediction_data   : LigandPrediction  | null


}

const initialstateBindinginSitesReducer:BindingSitesReducerState = {

    error      : null,
    is_loading : false,
    errored_out: false,

    visualization_tab: 'origin',

    bsites        : [],

    factors      : [],
    antibiotics  : [],
    mrna         : [],
    trna         : [],


    // mixed_ligands:MixedLigand[],

    current_ligand_class: null,
    current_binding_site: null,
    current_target      : null,


    binding_site_data: null,
    prediction_data  : null,

}

export const BindingSitesReducer = (
  state: BindingSitesReducerState = initialstateBindinginSitesReducer,
  action: BSitesActions
): BindingSitesReducerState => {
  switch (action.type) {


    case "PARTIAL_STATE_CHANGE":
      return {...state, ...action.statelike_slice}


	case "REQUEST_ALL_BSITES_GO":
		return state
	case "REQUEST_ALL_BSITES_ERR":
		return state
	case "REQUEST_ALL_BSITES_SUCCESS":


    var _antibiotics_reg =  /(\w*(?<!(cha|pro|dom|str|pla))in\b|(\b\w*zyme\b))/gi; 
    var antibioitcs :LigandClass[] = [];
    var factors     :LigandClass[] = [];
    var mrna        :LigandClass[] = [];
    var trna        :LigandClass[] = [];

    var filtered= action.mixed_ligands

    var grouped    = _.groupBy(filtered,'description')
    var bsites_all = filtered.reduce(( a:BindingSite[],b:MixedLigand )=>{
      return [...a, b.present_in]
    },[])

    // console.log("All mixed ligands:" , action.mixed_ligands);
    // console.log("Factors initially" , action.mixed_ligands.filter(a => a.description.toLowerCase().includes("elongation") || a.description.toLowerCase().includes("initiation")));
    // console.log("Cleaned" , filtered);
    // console.log("Factors cleaned" , filtered.filter(a => a.description.toLowerCase().includes("elongation") || a.description.toLowerCase().includes("initiation")));
    // console.log("Grouped into ligand_classes" , grouped);
    // console.log("Factors cleaned" , Object.keys(grouped).filter(a => a.toLowerCase().includes("elongation") || a.toLowerCase().includes("initiation")))
    // console.log("Bsites_extracted:" , bsites_all);

    

    Object.entries(grouped).map(( l ) => {
      if (l[0].toLowerCase().match(_antibiotics_reg)){
        antibioitcs = [...antibioitcs, {
          [l[0]] : l[1]
        }]
      }
      else if(l[0].toLowerCase().includes('factor')){
        factors = [...factors, {
          [l[0]] : l[1]
        }]
      }
      else if(l[0].toLowerCase().includes('mrna')||l[0].toLowerCase().includes('messenger')){
        mrna = [...mrna, {
          [l[0]] : l[1]
        }]
      }
      else if(l[0].toLowerCase().includes('trna')||l[0].toLowerCase().includes('transfer')){
        trna = [...trna, {
          [l[0]] : l[1]
        }]
      }
      else {
        (()=>{})()
      }
    })

		return {
      ...state,
      bsites     : bsites_all,
      factors    : factors,
      antibiotics: antibioitcs,
      mrna       : mrna,
      trna       : trna
    }

    case "FILE_REQUEST_ERROR":
  return {...state, is_loading:false, error:action.error}
    case "REQUEST_LIGAND_BINDING_SITE":
      return {...state, is_loading:true}
    case "REQUEST_LIGAND_PREDICTION":
      return {...state, is_loading:true}
  case "LIGAND_BINDING_SITE_SUCCESS":
    return {...state, binding_site_data:action.binding_site_object, is_loading:false}
  case "LIGAND_PREDICTION_SUCCESS":
    console.log("receieved prediction object", action.prediction_object);
    // console.log("receieved prediction object. it's empty", Object.b);
    
    return {...state, prediction_data:action.prediction_object, is_loading:false}
    case "CHANGE_VIS_TAB":
      return{...state, visualization_tab:action.tab}
    case "CURRENT_LIGAND_CHANGE":
      return {...state, current_ligand_class:action.next_cur_ligand}
    case "CURRENT_STRUCTURE_CHANGE":
      return {...state, current_binding_site:action.next_cur_struct}
    case "CURRENT_PREDICTION_CHANGE":
      return {
        ...state, 
        current_target:action.next_cur_prediction}



	default:
		return state
};
}
