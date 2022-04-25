import { getNeo4jData } from '../../AsyncActions/getNeo4jData'
import { NeoStruct } from '../../DataInterfaces'
import { Protein, ProteinClass, RibosomeStructure, RNA, RNAClass } from '../../RibosomeTypes'
import { VisualizationActions } from './ActionTypes'


// Each structure ought to have full chains represented

export interface VisualizationReducerState {
	component_tab      : "rna_tab"         | "protein_tab" | "structure_tab",
	selected_structure : RibosomeStructure | null
	structure_tab: {
		fullStructProfile: RibosomeStructure | null,
		highlighted_chain: string | null
	},
	protein_tab: {
		class: ProteinClass | null,
		parent: string | null
	},
	rna_tab: {
		class: RNAClass | null,
		parent: string | null
	}
}

const init: VisualizationReducerState = {
	component_tab     : "structure_tab",
	selected_structure: null,
	structure_tab     : {
		fullStructProfile: null,
		highlighted_chain: null
	},
	protein_tab: {
		class: null,
		parent: null
	},
	rna_tab: {
		class: null,
		parent: null
	}
}

export const coerce_full_structure_to_neostruct = (_: RibosomeStructure| null): NeoStruct |null => (_ === null ? null :{
	ligands: _.ligands !== null ? _.ligands.map(l => l.chemicalId) : [],
	rnas   : _.rnas    !== null ? _.rnas   .map(r => {
		return {
			auth_asym_id                   : r.auth_asym_id                   ,
			entity_poly_seq_one_letter_code: r.entity_poly_seq_one_letter_code,
			nomenclature                   : r.nomenclature}}) : [],
	rps: _.proteins !== null ? _.proteins.map(rp => {
		return {
			'auth_asym_id': rp.auth_asym_id,
			'entity_poly_seq_one_letter_code': rp.entity_poly_seq_one_letter_code,
			'nomenclature': rp.nomenclature
		}
	}) : [],
	struct: {
		..._
	}
})


export const VisualizationReducer = (
	state : VisualizationReducerState = init,
	action: VisualizationActions

): VisualizationReducerState => {
	switch (action.type) {

		case "STRUCTURE_CHANGE":  // this one is for selected...
			if (action.structure === null) {return state}
			else return state

		case "COMPONENT_TAB_CHANGE":
			return { ...state, component_tab: action.tab }

		case "PROTEIN_CHANGE":
			return {
				...state, protein_tab: {
					class: action.class,
					parent: action.parent
				}
			}

		case "RNA_CHANGE":
			return {
				...state, rna_tab: {
					class: action.class,
					parent: action.parent
				}
			}

		// this one is for the bigger state (with full rp & rna profiles). Dx yeah i know
		case "FETCH_FULL_STRUCT_ERR":
			return state
		case "FETCH_FULL_STRUCT_GO":
			return state
		case "FETCH_FULL_STRUCT_SUCCESS":
			return {
				...state,
				structure_tab: {
					fullStructProfile: action.struct,
					highlighted_chain: state.structure_tab.highlighted_chain,
					// struct           : coerce_full_structure_to_neostruct( action.struct )
				}
			}

		default:
			return state
	};
}