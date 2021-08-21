import { flattenDeep } from "lodash";
import { Dispatch } from "redux";
import { getNeo4jData } from "../../AsyncActions/getNeo4jData";
import { BindingSite, LigandBindingSite, LigandClass, LigandPrediction, NeoStruct } from "../../DataInterfaces";
import { Ligand } from "../../RibosomeTypes";
import { BindingSitesReducer,BindingSitesReducerState } from "./BindingSitesReducer";

export type BSitesFilter                = "SPECIES" | "SEARCH" | "YEAR" | "EXPERIMENTAL_METHOD" | "RESOLUTION"

export const REQUEST_ALL_BSITES_GO      = "REQUEST_ALL_BSITES_GO";
export const REQUEST_ALL_BSITES_ERR     = "REQUEST_ALL_BSITES_ERR";
export const REQUEST_ALL_BSITES_SUCCESS = "REQUEST_ALL_BSITES_SUCCESS";


export const FILE_REQUEST_ERROR          = "FILE_REQUEST_ERROR"

export const REQUEST_LIGAND_BINDING_SITE = "REQUEST_LIGAND_BINDING_SITE";
export const REQUEST_LIGAND_PREDICTION   = "REQUEST_LIGAND_PREDICTION";

export const LIGAND_BINDING_SITE_SUCCESS = "LIGAND_BINDING_SITE_SUCCESS";
export const LIGAND_PREDICTION_SUCCESS   = "LIGAND_PREDICTION_SUCCESS";

export const CURRENT_STRUCTURE_CHANGE  = "CURRENT_STRUCTURE_CHANGE";
export const CURRENT_LIGAND_CHANGE     = "CURRENT_LIGAND_CHANGE";
export const CURRENT_PREDICTION_CHANGE = "CURRENT_PREDICTION_CHANGE";

export const CHANGE_VIS_TAB = "CHANGE_VIS_TAB";

export const DATA_FIELD_CHANGE = "ARBITRARY_DATA_FIELD_CHANGE";


export interface requestAllBsitesGo      { type: typeof REQUEST_ALL_BSITES_GO                                                            }
export interface requestAllBsitesErr     { type: typeof REQUEST_ALL_BSITES_ERR    ; error: Error                                         }
export interface requestAllBsitesSuccess { type: typeof REQUEST_ALL_BSITES_SUCCESS; bsites: BindingSite[], ligand_classes: LigandClass[] }

export interface fileRequestError 		 { type: typeof FILE_REQUEST_ERROR, error: Error}

export interface requestLigandBindingSite { type: typeof REQUEST_LIGAND_BINDING_SITE; }
export interface reqeustLigandPrediction  { type: typeof REQUEST_LIGAND_PREDICTION  ; }

export interface ligandBindingSiteSuccess { type: typeof LIGAND_BINDING_SITE_SUCCESS; binding_site_object:LigandBindingSite }
export interface ligandPredictionSuccess  { type: typeof LIGAND_PREDICTION_SUCCESS  ; prediction_object: LigandPrediction}

export interface currentStructureChange  { type: typeof CURRENT_STRUCTURE_CHANGE  ; next_cur_struct     : BindingSite| null }
export interface currentLigandChange     { type: typeof CURRENT_LIGAND_CHANGE     ; next_cur_ligand     : LigandClass| null }
export interface currentPredictionChange { type: typeof CURRENT_PREDICTION_CHANGE ; next_cur_prediction : NeoStruct  | null }

export interface changeVisTab { 
	type: typeof CHANGE_VIS_TAB;
	tab : 'origin' | 'prediction' }

export interface dataFieldChange { type: typeof DATA_FIELD_CHANGE ; datum:any, reducer_state_key: keyof BindingSitesReducerState}

export type BSitesActions            =
            requestAllBsitesGo       |
            requestAllBsitesErr      |
            requestAllBsitesSuccess  |
            requestLigandBindingSite |
            reqeustLigandPrediction  |
            ligandBindingSiteSuccess |
            ligandPredictionSuccess  |
            currentStructureChange   |
            currentLigandChange      |
            currentPredictionChange  |
            changeVisTab             |
            fileRequestError         |
            dataFieldChange

export type AllLigandsResponseType = {
	ligand   : Ligand,
	presentIn: {
		_organismId   : number[],
		citation_title: string,
		expMethod     : string,
		rcsb_id       : string,
		resolution    : number,
	}[]
}


export const _data_field_change = (reducer_state_key: keyof BindingSitesReducerState, datum:any )=>( {
	type: 'ARBITRARY_DATA_FIELD_CHANGE',
	reducer_state_key,
	datum
} )


export const current_struct_change=(struct:BindingSite| null):currentStructureChange =>( {
	type           : "CURRENT_STRUCTURE_CHANGE",
	next_cur_struct: struct
})
export const current_ligand_change=(lig:LigandClass|null):currentLigandChange =>( {
	type           : "CURRENT_LIGAND_CHANGE",
	next_cur_ligand: lig
})
export const current_target_change=(tgt:NeoStruct|null):currentPredictionChange =>( {
	type               : "CURRENT_PREDICTION_CHANGE",
	next_cur_prediction: tgt
})

export const request_LigandBindingSite = (chemid:string, struct:string) => {
	return async (dispatch: Dispatch<BSitesActions>) => {
		dispatch({
			type: "REQUEST_LIGAND_BINDING_SITE",
		});
		getNeo4jData("static_files", { endpoint: "get_ligand_nbhd", params: {
			chemid,
			struct
		} })
			.then(
				response => {;
					dispatch({
						type               : "LIGAND_BINDING_SITE_SUCCESS",
						binding_site_object: response.data
					});
				},
				error => {
					console.log(`Error fetching the Binding Site for ligand ${chemid} in struct ${struct}.`);
					dispatch({
						type: FILE_REQUEST_ERROR,
						error: error,
					});
				}
			)
	};
};

export const request_Prediction = (chemid:string, src_struct:string, tgt_struct:string) => {
	return async (dispatch: Dispatch<BSitesActions>) => {
		dispatch({
			type: "REQUEST_LIGAND_PREDICTION",
		});
		getNeo4jData("static_files", { endpoint: "ligand_prediction", params: {
									chemid,
									src_struct,
									tgt_struct
		} })
			.then(
				response => {
					dispatch({
						type             : "LIGAND_PREDICTION_SUCCESS",
						prediction_object: response.data
					});
				},
				error => {
					console.log(`Error fetching prediction data for ligand ${chemid}(from source struct ${src_struct}) in target struct ${tgt_struct}.`);
					dispatch({
						type : FILE_REQUEST_ERROR,
						error: error,
					});
				}
			)
	};
};

export const request_all_bsites = () => {
	return async (dispatch: Dispatch<BSitesActions>) => {
		dispatch({
			type: "REQUEST_ALL_BSITES_GO"
		});
		getNeo4jData("neo4j", { endpoint: "get_all_ligands", params: null })
			.then(
				response => {

					var ligand_classes = response.data
					var disaggregated = response.data.map((bs: AllLigandsResponseType) => { return bs.presentIn.map(struct => Object.assign({}, { ...bs.ligand }, struct)) })
					disaggregated = flattenDeep(disaggregated)
					dispatch({
						type: REQUEST_ALL_BSITES_SUCCESS,
						bsites: disaggregated,
						ligand_classes
					});
				},
				error => {
					console.log("errored out");
					console.log(error);

					dispatch({
						type: REQUEST_ALL_BSITES_ERR,
						error: error,
					});
				}
			)
	};
};

