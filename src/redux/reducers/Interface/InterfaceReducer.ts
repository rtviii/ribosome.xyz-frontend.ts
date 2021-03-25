import { filterChange, FilterPredicates } from '../Filters/ActionTypes';
import {InterfaceActions} from './ActionTypes'


interface InterfaceReducerState{
    dashboardHidden: boolean
}

const initialStateInterfaceReducer:InterfaceReducerState = {
    dashboardHidden: false

}
export const InterfaceReducer = (
  state: InterfaceReducerState = initialStateInterfaceReducer,
  action: InterfaceActions
): InterfaceReducerState => {
  switch (action.type) {
    case "TOGGLE_DASHBOARD":
      return { ...state, dashboardHidden: !state.dashboardHidden };
    default:
      return state;
  }
};

