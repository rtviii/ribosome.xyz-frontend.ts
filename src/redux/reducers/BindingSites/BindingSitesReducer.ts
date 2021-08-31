import { BSitesActions } from './ActionTypes'
import { BindingSite, LigandBindingSite, LigandClass, LigandPrediction, NeoStruct } from '../../DataInterfaces'


export interface BindingSitesReducerState{

    error         : any,
    is_loading    : boolean;
    errored_out   : boolean;

    visualization_tab: "origin" | 'prediction',

    bsites                : BindingSite[]
    ligand_classes        : LigandClass[],
    bsites_derived        : BindingSite[],
    ligand_classes_derived: LigandClass[],

    current_structure: BindingSite | null,
    current_ligand   : LigandClass | null,
    current_target   : NeoStruct   | null,



    binding_site_data : LigandBindingSite | null,
    prediction_data   : LigandPrediction  | null

}

const initialstateBindinginSitesReducer:BindingSitesReducerState = {
    error      : null,
    is_loading : false,
    errored_out: false,

    visualization_tab: 'origin',

    bsites                : [],
    ligand_classes        : [],
    bsites_derived        : [],
    ligand_classes_derived: [],

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


    case "ARBITRARY_DATA_FIELD_CHANGE":
      return {...state, [action.reducer_state_key]:action.datum}


	case "REQUEST_ALL_BSITES_GO":
		return state
	case "REQUEST_ALL_BSITES_ERR":
		return state
	case "REQUEST_ALL_BSITES_SUCCESS":
		return {...state, bsites:action.bsites, ligand_classes:action.ligand_classes}

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
      return {...state, current_target:action.next_cur_prediction}



	default:
		return state
};
}
