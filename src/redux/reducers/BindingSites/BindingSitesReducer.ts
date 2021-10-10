import { BSitesActions } from './ActionTypes'
import { BindingSite, LigandBindingSite, LigandClass, LigandPrediction, MixedLigand, NeoStruct } from '../../DataInterfaces'
import { Protein } from '../../RibosomeTypes'
import _ from 'lodash'


export interface BindingSitesReducerState{

    error         : any,
    is_loading    : boolean;
    errored_out   : boolean;

    visualization_tab: "origin" | 'prediction',

    bsites        : BindingSite[],
    bsites_derived: BindingSite[],

    mixed_ligands: MixedLigand[],
    factors      : MixedLigand[],
    antibiotics  : MixedLigand[],


    current_structure: BindingSite | null,

    current_ligand   : MixedLigand | null,
    current_target   : NeoStruct   | null,

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

    mixed_ligands: [],
    factors      : [],
    antibiotics  : [],


    // mixed_ligands:MixedLigand[],

    current_ligand   : null,
    current_structure: null,
    current_target   : null,


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

  var antibioitcs:MixedLigand[] = [];
  var factors    :MixedLigand[] = [];
  var mixed      :MixedLigand[] = [];
    
  console.log("received all bsites",action);


    action.mixed_ligands.map(( l ) => {
      if (l.description.toLowerCase().includes('mycin')){
        antibioitcs.push({
          category: 'Antibiotics',
          ...l
        })
      }
      else if(l.description.toLowerCase().includes('factor')){
        
        factors.push({
          category:'I/T/E Factors',
          ...l
        })
      }
      else if(l.description?.toLowerCase().includes('ion')){
        (()=>{})()
      }
      else {
        mixed.push({
          category:"Mixed Ligands",
          ...l
        })
      }

    })
    
    

		return {
      ...state, 
      bsites        : _.uniqBy(action.mixed_ligands.reduce((acc:BindingSite[],next:MixedLigand)=> [...acc, ...next.present_in.map(bs=>( {

        src_organism_ids      : bs.src_organism_ids,
        citation_title        : bs.citation_title,
        expMethod             : bs.expMethod,
        rcsb_id               : bs.rcsb_id,
        resolution            : bs.resolution,
      } ))],[]), 'rcsb_id'),
      mixed_ligands : mixed      ,
      factors       : factors    ,
      antibiotics   : antibioitcs
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
      return {...state, current_ligand:action.next_cur_ligand}

    case "CURRENT_STRUCTURE_CHANGE":
      return {...state, current_structure:action.next_cur_struct}

    case "CURRENT_PREDICTION_CHANGE":
      return {
        ...state, 
        current_target:action.next_cur_prediction}



	default:
		return state
};
}
