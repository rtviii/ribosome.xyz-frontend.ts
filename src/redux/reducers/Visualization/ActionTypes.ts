import { log } from "console";
import { useSelector } from "react-redux";
import { Dispatch } from "redux";
import { resetAction } from "../../AppActions";
import { getNeo4jData } from "../../AsyncActions/getNeo4jData";
import { NeoStruct, PolymerMinimal } from "../../DataInterfaces";
import { RibosomeStructure } from "../../RibosomeTypes";
import { ProteinClass, RNAClass } from "../../RibosomeTypes";
import { AppState, store } from "../../store";
import { coerce_full_structure_to_neostruct, SuperimposeStruct } from "./VisualizationReducer";

export const FETCH_FULL_STRUCT_GO      = "FETCH_FULL_STRUCT_GO"
export const FETCH_FULL_STRUCT_ERR     = "FETCH_FULL_STRUCT_ERR"
export const FETCH_FULL_STRUCT_SUCCESS = "FETCH_FULL_STRUCT_SUCCESS"

export const UPDATE_CACHED_FULLSTRUCT = "UPDATE_CACHED_FULLSTRUCT"
export const STRUCTURE_CHANGE         = "STRUCTURE_CHANGE"

export const PROTEIN_CHANGE              = "PROTEIN_CHANGE"
export const PROTEIN_UPDATE_AUTH_ASYM_ID = "PROTEIN_UPDATE_AUTH_ASYM_ID"

export const RNA_CHANGE                  = "RNA_CHANGE"
export const RNA_UPDATE_AUTH_ASYM_ID     = "RNA_UPDATE_AUTH_ASYM_ID"

export const COMPONENT_TAB_CHANGE        = "COMPONENT_TAB_CHANGE"


export const UPDATE_STRUCTTAB_RANGE  = "UPDATE_STRUCTTAB_RANGE"
export interface updateStructTabRange { type: typeof UPDATE_STRUCTTAB_RANGE, nextrange: number[]}
export const update_struct_tab_range = (range:number[]): updateStructTabRange => ({
	type     : "UPDATE_STRUCTTAB_RANGE",
	nextrange: range
})


export type VisualizationTabs = 'structure_tab' | 'protein_tab' | 'rna_tab';

export interface fetchFullStructGo { type: typeof FETCH_FULL_STRUCT_GO }
export interface updateCachedFullstruct { 
	type             : typeof UPDATE_CACHED_FULLSTRUCT,
	nextcache        : RibosomeStructure | null
	cache_slot_number: 0 | 1
	 }
export interface fetchFullStructError { type: typeof FETCH_FULL_STRUCT_ERR, err: Error }



export interface componentTabChange {
	type: typeof COMPONENT_TAB_CHANGE,
	tab: VisualizationTabs,
}
export interface structureChange {
	type: typeof STRUCTURE_CHANGE
	structure: NeoStruct | null,
	highlighted_chain: string | null,
}
export interface proteinUpdateAuthAsymId {
	type: typeof PROTEIN_UPDATE_AUTH_ASYM_ID,
	next_auth_asym_id: string | null
}
export interface rnaUpdateAuthAsymId {
	type:typeof RNA_UPDATE_AUTH_ASYM_ID,
	next_auth_asym_id: string | null
}
export interface proteinChange {
	type        : typeof PROTEIN_CHANGE
	class       : ProteinClass | null,
	parent      : string | null
}
export interface rnaChange {
	type: typeof RNA_CHANGE
	class: RNAClass | null,
	parent: string | null
}

// export const struct_and_component_change = (struct: RibosomeStructure | null, chain: string | null) :structAndComponentChange => 
// ({type: 'STRUCT_AND_COMPONENT_CHANGE', struct, chain })

export const protein_update_auth_asym_id = (next_auth_asym_id : string|null): proteinUpdateAuthAsymId => ({
	type: "PROTEIN_UPDATE_AUTH_ASYM_ID",
	next_auth_asym_id
})
export const rna_update_auth_asym_id = (next_auth_asym_id : string|null): rnaUpdateAuthAsymId => ({
	type: "RNA_UPDATE_AUTH_ASYM_ID",
	next_auth_asym_id
})
export const protein_change = (protclass: ProteinClass | null, parent: string | null ): proteinChange => ({
	type: "PROTEIN_CHANGE",
	parent,
	class: protclass
})
export const rna_change = (rnaclass: RNAClass | null, parent: string | null): rnaChange => ({
	type: "RNA_CHANGE",
	parent,
	class: rnaclass
})
export const struct_change = (highlighted_chain: string | null, struct: NeoStruct | null): structureChange => {
	console.log("dispatching struct change with struct :", struct);
	
	return {
		type             : "STRUCTURE_CHANGE",
		structure        : struct,
		highlighted_chain: highlighted_chain
	}
}

export const fullstructCache_change = (nextcache: RibosomeStructure | null, cache_slot_number:0|1): updateCachedFullstruct => ({
	nextcache,
	cache_slot_number,
	type: 'UPDATE_CACHED_FULLSTRUCT'
})

export const tab_change = (tab: VisualizationTabs): componentTabChange => ({
	type: "COMPONENT_TAB_CHANGE",
	tab
})

export const cache_full_struct = (
	struct_id_to_cache: string | null,
	cache_slot_number: 0|1
) => {

	console.log("Changing struct cache: ", struct_id_to_cache);
	// 1.check if the current structure is the same
	// if yes --> return
	// if no:
	// 	 		2.request struct from server
	// 	 				- if successful : update struct cache


	return async (dispatch: Dispatch<VisualizationActions>) => {
		const currentstruct = store.getState().visualization.structure_tab.structure
		// if neither is null and they are equal
		if ((struct_id_to_cache && currentstruct) && struct_id_to_cache === currentstruct?.struct.rcsb_id) {
			console.log("They are one and the same.");
			dispatch({type:"NOOP"})
		}
		else if (struct_id_to_cache === null) {
			console.log("Updated to null");
			fullstructCache_change(null,cache_slot_number)
		}
		else {

			dispatch({ type: FETCH_FULL_STRUCT_GO })
			// getNeo4jData('neo4j', { endpoint: 'get_full_struct', params: { pdbid: struct_id_to_cache } })
			getNeo4jData("neo4j", {
				endpoint: "get_RibosomeStructure",
				params: { pdbid: struct_id_to_cache }
			}).then(
				response => {
					console.log("fetched fullstruct successfully. response:", response)
					dispatch(fullstructCache_change(response.data[0], cache_slot_number));
				},
				error => {
					console.log("couldnt fetch with error: ", error);
					
					dispatch({
						type: "FETCH_FULL_STRUCT_ERR", err: error
					});
				}
			)

		}
	};
}

// Superimpose


export const SUPERIMPOSE_SLOT_CHANGE = "SUPERIMPOSE_SLOT_CHANGE"
export interface superimposeSlotChange { 
	type   : typeof SUPERIMPOSE_SLOT_CHANGE,
	payload: Partial<SuperimposeStruct>,
	slot   : 1 | 2
}

export const superimpose_slot_change = (slot: 1 | 2, payload: Partial<SuperimposeStruct>): superimposeSlotChange => ({
	payload,
	slot,
	type: SUPERIMPOSE_SLOT_CHANGE
})

export type VisualizationActions = resetAction|  structureChange | rnaChange | proteinChange | componentTabChange |
	fetchFullStructError | fetchFullStructGo | updateCachedFullstruct | {type:"NOOP"}| proteinUpdateAuthAsymId | rnaUpdateAuthAsymId
	| superimposeSlotChange | updateStructTabRange;
