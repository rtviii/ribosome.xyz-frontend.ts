import { getNeo4jData } from '../../AsyncActions/getNeo4jData'
import { NeoStruct } from '../../DataInterfaces'
import { Protein, ProteinClass, RibosomeStructure, RNA, RNAClass } from '../../RibosomeTypes'
import { VisualizationActions } from './ActionTypes'


export interface VisualizationReducerState {
	component_tab: "rna_tab" | "protein_tab" | "structure_tab",
	structure_tab: {
		fullStructProfile: RibosomeStructure | null,
		fullChainProfile: Protein | RNA | null,
		struct: NeoStruct | null,
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
	structure_tab: {

		fullChainProfile: null,
		fullStructProfile: null,
		highlighted_chain: null,
		struct: null
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

export const VisualizationReducer = async (
	state: VisualizationReducerState = init,
	action: VisualizationActions
): Promise<VisualizationReducerState> => {
	switch (action.type) {

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

		case "STRUCTURE_CHANGE":

			if (action.structure === null) {
				return {
					...state,
					structure_tab: {
						highlighted_chain: null,
						struct: null,
						fullChainProfile: null,
						fullStructProfile: null

					}

				}
			}
			else {

				return {
					...state,
					structure_tab: {
						highlighted_chain: action.highlighted_chain,
						struct           : action.structure,
						fullChainProfile : null,                       // <-------
						fullStructProfile: null                        // <-------
					}
				}
			}
		default:
			return state
	};
}