import {InterfaceActions} from './ActionTypes'


interface InterfaceReducerState{
    dashboardHidden: boolean
    structure_page :{
      component: "rna" | 'protein' | 'ligand'
  }
}

const initialStateInterfaceReducer:InterfaceReducerState = {
    dashboardHidden: false,
    structure_page:{
      component: "protein"
    }
}

export const InterfaceReducer = (
  state: InterfaceReducerState = initialStateInterfaceReducer,
  action: InterfaceActions
): InterfaceReducerState => {
  switch (action.type) {
    case "TOGGLE_DASHBOARD":
      return { ...state, dashboardHidden: !state.dashboardHidden };
    case "STRUCT_PAGE_CHOICE":
      return { ...state, structure_page:{
        [action.field]:action.choice
      }};
    default:
      return state;
  }
};

