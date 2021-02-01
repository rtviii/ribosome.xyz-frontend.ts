import {RibosomalProtein} from './../../RibosomeTypes'
import { ProteinActions } from './ActionTypes'
import {NeoHomolog} from './../../DataInterfaces'





interface ProteinsReducerState{

    error              :  any,
    isLoading          :  boolean;
    erroredOut         :  boolean;
    current_ban_class  :  NeoHomolog[];
    allProteins        :  RibosomalProtein[];

    current_page       :  number,
    pages_total        :  number,

    derived_filtered   :  RibosomalProtein[];
}

const initialStateProteinsReducer:ProteinsReducerState = {
    current_ban_class  :  [],
    allProteins        :  [],
    error              :  null,
    derived_filtered   :  [],
    // pagination
    current_page  :  1,
    pages_total   :  1,

    // net
    isLoading          :  false,
    erroredOut         :  false

}
export const ProteinsReducer = (
  state: ProteinsReducerState = initialStateProteinsReducer,
  action: ProteinActions
): ProteinsReducerState => {
  switch (action.type) {
    case "REQUEST_BAN_CLASS_GO":
      return { ...state, isLoading: true };
    case "REQUEST_BAN_CLASS_SUCCESS":
      return {
        ...state,
        current_ban_class: action.payload,
        pages_total: Math.ceil(action.payload.length / 20),
      };
    case "REQUEST_BAN_CLASS_ERR":
      return {
        ...state,
        isLoading: false,
        error: action.error,
        erroredOut: true,
      };
    case "GOTO_PAGE_PROTEINS":
      if (action.pid <= state.pages_total && action.pid >=1) {
        return {...state, current_page: action.pid}
      }
      return state;
    case "NEXT_PAGE_PROTEINS":
      if (state.current_page + 1 === state.pages_total) {
        return state;
      }
      return { ...state, current_page: state.current_page + 1 };
    case "PREV_PAGE_PROTEINS":
      if (state.current_page - 1 < 1) {
        return state;
      }
      return { ...state, current_page: state.current_page - 1 };
    default:
      return state;
  }
};
