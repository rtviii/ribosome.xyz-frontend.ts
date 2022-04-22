import { useSelector } from "react-redux";
import { Dispatch } from "redux";
import { getNeo4jData } from "../../AsyncActions/getNeo4jData";
import { NeoStruct, PolymerMinimal } from "../../DataInterfaces";
import { RibosomeStructure } from "../../RibosomeTypes";
import { ProteinClass, RNAClass } from "../../RibosomeTypes";
import { AppState, store } from "../../store";
import { coerce_full_structure_to_neostruct } from "./VisualizationReducer";

export const FETCH_FULL_STRUCT_GO = "FETCH_FULL_STRUCT_GO"
export const FETCH_FULL_STRUCT_ERR = "FETCH_FULL_STRUCT_ERR"
export const FETCH_FULL_STRUCT_SUCCESS = "FETCH_FULL_STRUCT_SUCCESS"
export const STRUCT_AND_COMPONENT_CHANGE = "STRUCT_AND_COMPONENT_CHANGE"

export const STRUCTURE_CHANGE = "STRUCTURE_CHANGE"
export const PROTEIN_CHANGE = "PROTEIN_CHANGE"
export const RNA_CHANGE = "RNA_CHANGE"
export const COMPONENT_TAB_CHANGE = "COMPONENT_TAB_CHANGE"

export type VisualizationTabs = 'structure_tab' | 'protein_tab' | 'rna_tab';

export interface fetchFullStructGo        { type: typeof FETCH_FULL_STRUCT_GO                                                        }
export interface fetchFullStructSuccess   { type: typeof FETCH_FULL_STRUCT_SUCCESS  , struct: RibosomeStructure                      }
export interface fetchFullStructError     { type: typeof FETCH_FULL_STRUCT_ERR      , err: Error                                     }
export interface structAndComponentChange { type: typeof STRUCT_AND_COMPONENT_CHANGE, struct: RibosomeStructure | null, chain: string | null }


export interface componentTabChange {
	type: typeof COMPONENT_TAB_CHANGE,
	tab: VisualizationTabs,
}
export interface structureChange {
	type: typeof STRUCTURE_CHANGE
	structure: NeoStruct | null,
	highlighted_chain: string | null,
}
export interface proteinChange {
	type: typeof PROTEIN_CHANGE
	class: ProteinClass | null,
	parent: string | null
}
export interface rnaChange {
	type: typeof RNA_CHANGE
	class: RNAClass | null,
	parent: string | null
}

export const struct_and_component_change = (struct: RibosomeStructure | null, chain: string | null) :structAndComponentChange=> ({
	 type: 'STRUCT_AND_COMPONENT_CHANGE', struct, chain })

export const protein_change = (protclass: ProteinClass | null, parent: string | null): proteinChange => ({
	type: "PROTEIN_CHANGE",
	parent,
	class: protclass
})
export const rna_change = (rnaclass: RNAClass | null, parent: string | null): rnaChange => ({
	type: "RNA_CHANGE",
	parent,
	class: rnaclass
})
// export const struct_change = (highlighted_chain: string | null, struct: NeoStruct | null): structureChange => {
// 	return {
// 		type: "STRUCTURE_CHANGE",
// 		structure: struct,
// 		highlighted_chain: highlighted_chain
// 	}
// }
export const tab_change = (tab: VisualizationTabs): componentTabChange => ({
	type: "COMPONENT_TAB_CHANGE",
	tab
})



export const fullStructureChange = (
	struct_id                   : string | null,
	highlight_chain_auth_asym_id: string | null
) => {


	const currentstruct = store.getState().visualization.structure_tab.fullStructProfile
	return async (dispatch: Dispatch<VisualizationActions>) => {
		console.log(`Executing async. got structid :${struct_id} | chain: ${highlight_chain_auth_asym_id} | current struct :${currentstruct}`)
		if (currentstruct?.rcsb_id === struct_id ){
			console.log("landed in equal branch");
			
				dispatch(struct_and_component_change( currentstruct , highlight_chain_auth_asym_id) )
		}
		else if(struct_id === null) {
			dispatch( struct_and_component_change(null, null) )
		}
		else {
			console.log("requesting a new full struct", struct_id);
			
			getNeo4jData('neo4j', { endpoint: 'get_full_struct', params: { pdbid: struct_id } })
				.then(

					response => {

						console.log("fetched successfully. response:", response)
						dispatch({
							type: "FETCH_FULL_STRUCT_SUCCESS",
							struct: response.data[0]
						});
						console.log("Attempting to coerce:");
						dispatch(struct_and_component_change(response.data[0] , highlight_chain_auth_asym_id))
					},
					error => {
						dispatch({
							type: "FETCH_FULL_STRUCT_ERR", err: error
						});
					}
				)

		}
	};
}


export type VisualizationActions = structureChange | rnaChange | proteinChange | componentTabChange |
	fetchFullStructError | fetchFullStructGo | fetchFullStructSuccess | structAndComponentChange;