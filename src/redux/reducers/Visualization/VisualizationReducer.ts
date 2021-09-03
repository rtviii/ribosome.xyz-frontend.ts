import { NeoStruct } from '../../DataInterfaces'
import { BanClass } from '../../RibosomeTypes'
import { RnaClass } from '../RNA/RNAReducer'
import { VisualizationActions } from './ActionTypes'


export interface VisualizationReducerState{
    component_tab: "rna" | "protein"|"structure",
	structure    :{
		struct            :NeoStruct|null,
		highlighted_chain :string   |null
	},
	protein:{
		class :BanClass|null,
		parent:string  |null
	},
	rna:{
		class :RnaClass| null,
		parent:string  | null
	}
    
}

const init:VisualizationReducerState = {
	component_tab:"structure",
	structure:{
		highlighted_chain :null,
		struct            :null
	},
	protein:{
		class :null,
		parent:null
	},
	rna:{
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
	return {...state, protein:{
		class:action.class,
		parent:action.parent
	}}

	case "RNA_CHANGE":
	return {...state, rna:{
		class:action.class,
		parent:action.parent
	}}

	case "STRUCTURE_CHANGE":
		return {
			...state,
			structure:{
				highlighted_chain:action.highlighted_chain,
				struct:action.structure
			}
		}
	default:
		return state
};
}