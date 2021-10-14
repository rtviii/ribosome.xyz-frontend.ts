import { BSitesActions } from './ActionTypes'
import { BindingSite, LigandBindingSite, LigandClass, LigandPrediction, MixedLigand, NeoStruct, StructureBindingSites } from '../../DataInterfaces'
import { Protein } from '../../RibosomeTypes'
import _ from 'lodash'


export interface BindingSitesReducerState{

    error         : any,
    is_loading    : boolean;
    errored_out   : boolean;

    visualization_tab: "origin" | 'prediction',

    bsites        : BindingSite[],
    bsites_derived: BindingSite[],

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
    bsites_derived: [],

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

    // var grouped =_.groupBy(action.mixed_ligands, 'description')
    
    // action.mixed_ligands,'description'

    var filtered = action.mixed_ligands.filter(prelig =>null===prelig.description.match(/ion|cluster\b|((\[|\(|\-).+(\]|\)|\-))/gi));



    var bsites_all                                 = action.mixed_ligands.reduce((bsites:BindingSite[],a:MixedLigand)=> [...bsites, a.present_in] ,[])
    var bsites_by_struct:[string, BindingSite[]][] = Object.entries(_.groupBy(bsites_all,'rcsb_id'))
    var by_struct_array:StructureBindingSites[]    = bsites_by_struct.reduce((a:StructureBindingSites[], b:any)=>[...a, {[ b[0] ]:b[1]}],[])


    var grouped = _.groupBy(filtered,'description')
    

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
