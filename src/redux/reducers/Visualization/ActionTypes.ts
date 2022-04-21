import { TableHeadClassKey } from "@material-ui/core";
import { Dispatch } from "redux";
import { getNeo4jData } from "../../AsyncActions/getNeo4jData";
import { NeoStruct } from "../../DataInterfaces";
import { RibosomeStructure } from "../../old_RibosomeTypes";
import { ProteinClass, Ligand, RNAClass, RNA, Protein } from "../../RibosomeTypes";

export const FULL_STRUCT_PROFILE_CHANGE = "FULL_STRUCT_PROFILE_CHANGE"
export const FULL_COMPONENT_CHANGE  = "STRUCTURE_CHANGESTRUCTURE_CHANGE"

export const STRUCTURE_CHANGE     = "STRUCTURE_CHANGE"
export const PROTEIN_CHANGE       = "PROTEIN_CHANGE"
export const RNA_CHANGE           = "RNA_CHANGE"
export const COMPONENT_TAB_CHANGE = "COMPONENT_TAB_CHANGE"

export type VisualizationTabs = 'structure_tab' | 'protein_tab' | 'rna_tab';

export interface fullStructProfileChange {
	type                : typeof FULL_STRUCT_PROFILE_CHANGE,
	fullStructureProfile: RibosomeStructure | null
}

export interface fullComponentChange {
	type               : typeof FULL_COMPONENT_CHANGE,
	fullComponentChange: RNA|Protein | null
}


export interface componentTabChange {
	type: typeof COMPONENT_TAB_CHANGE,
	tab : VisualizationTabs,
}
export interface structureChange {
	type             : typeof STRUCTURE_CHANGE
	structure        : NeoStruct | null,
	highlighted_chain: string | null,
}
export interface proteinChange {
	type  : typeof PROTEIN_CHANGE
	class : ProteinClass | null,
	parent: string | null
}
export interface rnaChange {
	type  : typeof RNA_CHANGE
	class : RNAClass | null,
	parent: string | null
}


export const full_struct_profile_change = (struct_profile: RibosomeStructure| null):fullStructProfileChange =>({
	type:'FULL_STRUCT_PROFILE_CHANGE',
	fullStructureProfile:struct_profile
})
export const full_component_change = (component:RNA|Protein| null):fullComponentChange =>({
	type               : 'STRUCTURE_CHANGESTRUCTURE_CHANGE',
	fullComponentChange: component
})


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
export const struct_change = (chain: string | null, struct: NeoStruct | null): structureChange => {
	return {
		type             : "STRUCTURE_CHANGE",
		structure        : struct,
		highlighted_chain: chain
	}
}
export const tab_change = (tab: VisualizationTabs): componentTabChange => ({
	type: "COMPONENT_TAB_CHANGE",
	tab
})



export const selectedStructureChange = (highlighted_chain:null|string, struct:NeoStruct|null) => {
  return async (dispatch: Dispatch<VisualizationActions>) => {
    dispatch({type: "STRUCTURE_CHANGE",highlighted_chain, structure:struct});


	if (struct === null) {
		dispatch()

	}
 


				const r = await getNeo4jData('neo4j', { endpoint: 'get_struct', params: { pdbid:struct.structure?.struct.rcsb_id as string } })
				console.log("Got data from r:", r);
    getNeo4jData("neo4j", {
      endpoint: "get_rna_class", params: {
        rna_class
      }
    })
      .then(
        response => {
          dispatch({            type   : REQUEST_RNA_CLASS_SUCCESS,
            payload: flattenDeep(response.data) as any,
            rna_class
          });
        },
        error => {
          dispatch({
            type: REQUEST_RNA_CLASS_ERR,error: error,
          });
        }
      )
  };
};




// //* hack
// export interface _partialStateChange   {
// 	type           : typeof PARTIAL_STATE_CHANGE,
// 	statelike_slice: Partial<BindingSitesReducerState>
// 					}

export type VisualizationActions = structureChange | rnaChange | proteinChange | componentTabChange
            // _partialStateChange

// export const _partial_state_change = (statelike_slice:Partial<BindingSitesReducerState> ):_partialStateChange=>( {
// 	type: "PARTIAL_STATE_CHANGE",
// 	statelike_slice
// } )
