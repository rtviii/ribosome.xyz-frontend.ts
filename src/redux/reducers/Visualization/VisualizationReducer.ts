import { getNeo4jData } from '../../AsyncActions/getNeo4jData'
import { NeoStruct } from '../../DataInterfaces'
import { Protein, ProteinClass, RibosomeStructure, RNA, RNAClass } from '../../RibosomeTypes'
import { VisualizationActions } from './ActionTypes'


// Each structure ought to have full chains represented

export interface VisualizationReducerState {
	component_tab: "rna_tab" | "protein_tab" | "structure_tab",
	full_structure_cache: RibosomeStructure | null
	structure_tab: {
		structure        : NeoStruct | null,
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
	component_tab: "structure_tab",
	full_structure_cache: null,
	structure_tab: {
		structure: null,
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

export const coerce_full_structure_to_neostruct = (_: RibosomeStructure | null): NeoStruct | null => (_ === null ? null : {
	ligands: _.ligands !== null ? _.ligands.map(l => l.chemicalId) : [],
	rnas: _.rnas !== null ? _.rnas.map(r => {
		return {
			auth_asym_id: r.auth_asym_id,
			entity_poly_seq_one_letter_code: r.entity_poly_seq_one_letter_code,
			nomenclature: r.nomenclature
		}
	}) : [],
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
	state: VisualizationReducerState = init,
	action: VisualizationActions

): VisualizationReducerState => {
	switch (action.type) {

		case "UPDATE_CACHED_FULLSTRUCT":
			return { ...state, full_structure_cache: action.nextcache }

		case "STRUCTURE_CHANGE":  // this one is for selected...
			if (action.structure === null) { return {
				...state,
				structure_tab: {
					highlighted_chain: null,
					structure        : null
				}
			} }
			else return {
				...state,

				structure_tab: {
					highlighted_chain: action.highlighted_chain,
					structure        : action.structure
				}
			}

		case "COMPONENT_TAB_CHANGE":
			return { ...state, component_tab: action.tab }

		case "PROTEIN_CHANGE":
			return {
				...state, protein_tab: {
					class : action.class,
					parent: action.parent
				}
			}

		case "RNA_CHANGE":
			return {
				...state, rna_tab: {
					class : action.class,
					parent: action.parent
				}
			}

		// this one is for the bigger state (with full rp & rna profiles). Dx yeah i know
		case "FETCH_FULL_STRUCT_ERR":
			return state
		case "FETCH_FULL_STRUCT_GO":
			return state

		default:
			return state
	};
}