import { NeoStruct } from '../../DataInterfaces'
import { ProteinClass, RNAClass } from '../../RibosomeTypes'
import { VisualizationActions } from './ActionTypes'


export interface VisualizationReducerState{
    component_tab: "rna_tab" | "protein_tab"|"structure_tab",
	structure_tab    :{
		struct            :NeoStruct|null,
		highlighted_chain :string   |null
	},
	protein_tab:{
		class :ProteinClass|null,
		parent:string  |null
	},
	rna_tab:{
		class :RNAClass| null,
		parent:string  | null
	}
    
}

const init:VisualizationReducerState = {
	component_tab:"structure_tab",
	structure_tab:{
		highlighted_chain :null,
		struct            :null
	},
	protein_tab:{
		class :null,
		parent:null
	},
	rna_tab:{
		class :null,
		parent:null
	}

}

export const VisualizationReducer = (
  state: VisualizationReducerState = init,
  action: VisualizationActions
): VisualizationReducerState => {
  switch (action.type) {

	case"COMPONENT_TAB_CHANGE":

	return {...state, component_tab:action.tab}

	case "PROTEIN_CHANGE":
	return {...state, protein_tab:{
		class:action.class,
		parent:action.parent
	}}

	case "RNA_CHANGE":
	return {...state, rna_tab:{
		class:action.class,
		parent:action.parent
	}}

	case "STRUCTURE_CHANGE":
		console.log("assigned state with ", action);
		
		return {
			...state,
			structure_tab:{
				highlighted_chain:action.highlighted_chain,
				struct           :action.structure
			}
		}
	default:
		return state
};
}