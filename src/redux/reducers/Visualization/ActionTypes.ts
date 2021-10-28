import { TableHeadClassKey } from "@material-ui/core";
import { NeoStruct } from "../../DataInterfaces";
import { ProteinClass, Ligand, RNAClass } from "../../RibosomeTypes";

export const STRUCTURE_CHANGE     = "STRUCTURE_CHANGE"
export const PROTEIN_CHANGE       = "PROTEIN_CHANGE"
export const RNA_CHANGE           = "RNA_CHANGE"
export const COMPONENT_TAB_CHANGE = "COMPONENT_TAB_CHANGE"

export interface componentTabChange {
	type: typeof COMPONENT_TAB_CHANGE ,
	tab: 'structure_tab' | 'protein_tab' | 'rna_tab',
}
export interface structureChange {
		type              : typeof STRUCTURE_CHANGE
		structure         : NeoStruct|null,
		highlighted_chain : string|null,
	}
	export interface proteinChange {
		type  : typeof PROTEIN_CHANGE
		class : ProteinClass|null,
		parent:string|null
	}
	export interface rnaChange {
		type  : typeof RNA_CHANGE
		class : RNAClass|null,
		parent:string|null
}

export const protein_change = (protclass:ProteinClass|null,parent:string|null):proteinChange =>({
	type:"PROTEIN_CHANGE",
	parent,
	class:protclass
})
export const rna_change = (rnaclass:RNAClass|null,parent:string|null):rnaChange =>({
	type:"RNA_CHANGE",
	parent,
	class:rnaclass
})
export const struct_change = (chain:string|null,struct:NeoStruct|null):structureChange =>{
	console.log("Dispatched struct vis change", struct);
	
	return {

	type             : "STRUCTURE_CHANGE",
	structure        : struct,
	highlighted_chain: chain
	}
}
export const tab_change = (tab:'protein_tab'|'rna_tab'|'structure_tab'):componentTabChange =>({
	type:"COMPONENT_TAB_CHANGE",
	tab
})




// //* hack
// export interface _partialStateChange   {
// 	type           : typeof PARTIAL_STATE_CHANGE,
// 	statelike_slice: Partial<BindingSitesReducerState>
// 					}

export type VisualizationActions            =structureChange| rnaChange|proteinChange|componentTabChange
            // _partialStateChange

// export const _partial_state_change = (statelike_slice:Partial<BindingSitesReducerState> ):_partialStateChange=>( {
// 	type: "PARTIAL_STATE_CHANGE",
// 	statelike_slice
// } )
