import { getNeo4jData } from '../../AsyncActions/getNeo4jData'
import { NeoStruct, PolymerMinimal } from '../../DataInterfaces'
import { Protein, ProteinClass, RibosomeStructure, RNA, RNAClass } from '../../RibosomeTypes'
import { VisualizationActions } from './ActionTypes'


// Each structure ought to have full chains represented
export interface VisualizationReducerState {
	component_tab: "rna_tab" | "protein_tab" | "structure_tab",
	full_structure_cache: {
		0: RibosomeStructure | null,
		1: RibosomeStructure | null
	},
	structure_tab: {
		structure: NeoStruct | null,
		highlighted_chain: string | null
	},
	protein_tab: {
		auth_asym_id: string | null,
		class: ProteinClass | null,
		parent: string | null
	},
	rna_tab: {
		auth_asym_id: string | null,
		class: RNAClass | null,
		parent: string | null
	},
	superimpose:{
		struct_1:SuperimposeStruct,
		struct_2:SuperimposeStruct,

	}
}

export type SuperimposeStruct = {
			struct: NeoStruct|null,
			chain  : PolymerMinimal|null,
		};

const init: VisualizationReducerState = {
	component_tab: "structure_tab",
	full_structure_cache: {
		0: null,
		1: null
	},
	structure_tab: {
		structure: null,
		highlighted_chain: null
	},
	protein_tab: {
		auth_asym_id: null,
		class: null,
		parent: null
	},
	rna_tab: {
		auth_asym_id: null,
		class: null,
		parent: null
	},
	superimpose:{
		struct_1:{
			chain  : null,
			struct: null
		},		
		struct_2:{
			chain  : null,
			struct: null
		}
	}
}

export const coerce_full_structure_to_neostruct = (_: RibosomeStructure | null): NeoStruct | null => {
	console.log("Got fullstruct:", _);

	const coerced = _ === null ? null : {
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
	}

	console.log("Coerced to neostruct:", coerced);

	return coerced
}


export const VisualizationReducer = (
	state: VisualizationReducerState = init,
	action: VisualizationActions
): VisualizationReducerState => {
	switch (action.type) {
		case "RESET_ACTION":
			return init

		case "SUPERIMPOSE_SLOT_CHANGE":
			const structn_to_change = action.slot === 1 ? "struct_1" : "struct_2";
			const structn_to_leave = action.slot === 1  ? "struct_2" : "struct_1";

			var in_place_change			= Object.assign({},state.superimpose[structn_to_change])
			var in_place_leave			= Object.assign({},state.superimpose[structn_to_leave])

			in_place_change = {...in_place_change, ...action.payload}

			return {...state,superimpose:{
				struct_1: action.slot ===1 ? in_place_change : in_place_leave,
				struct_2: action.slot ===2 ? in_place_change : in_place_leave,
			}} 

		case "UPDATE_CACHED_FULLSTRUCT":
			return {
				...state, full_structure_cache: {
					...state.full_structure_cache,
					...{ [action.cache_slot_number]: action.nextcache }
				}
			}

		case "STRUCTURE_CHANGE":  // this one is for selected...
			if (action.structure === null) {
				return {
					...state,
					structure_tab: {
						highlighted_chain: null,
						structure: null
					}
				}
			}
			else return {
				...state,

				structure_tab: {
					highlighted_chain: action.highlighted_chain,
					structure: action.structure
				}
			}

		case "COMPONENT_TAB_CHANGE":
			return { ...state, component_tab: action.tab }

		case "PROTEIN_CHANGE":
			return {
				...state, protein_tab: {
					auth_asym_id: state.protein_tab.auth_asym_id,
					class: action.class,
					parent: action.parent
				}
			}

		case "RNA_CHANGE":
			return {
				...state, rna_tab: {
					auth_asym_id: state.rna_tab.auth_asym_id,
					class: action.class,
					parent: action.parent
				}
			}

		// this one is for the bigger state (with full rp & rna profiles). Dx yeah i know
		case "FETCH_FULL_STRUCT_ERR":
			return state
		case "FETCH_FULL_STRUCT_GO":
			return state

		case "PROTEIN_UPDATE_AUTH_ASYM_ID":
			return {
				...state, protein_tab: {
					...state.protein_tab,
					auth_asym_id: action.next_auth_asym_id
				}
			}
		case "RNA_UPDATE_AUTH_ASYM_ID":
			return {
				...state, rna_tab: {
					...state.rna_tab,
					auth_asym_id: action.next_auth_asym_id
				}
			}
		default:
			return state
	};
}