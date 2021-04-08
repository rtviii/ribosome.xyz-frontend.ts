import {RibosomalProtein} from './../../RibosomeTypes'
import { ProteinActions } from './ActionTypes'
import {NeoHomolog} from './../../DataInterfaces'
import { filterChange, FilterPredicates } from '../Filters/ActionTypes';





interface ProteinsReducerState{

    error               : any,
    is_loading          : boolean;
    errored_out         : boolean;
    ban_class           : RibosomalProtein[];
    ban_class_derived   : RibosomalProtein[],
    all_proteins        : RibosomalProtein[];
    all_proteins_derived: RibosomalProtein[],

    current_page        : number,
    pages_total         : number,
}

const initialStateProteinsReducer:ProteinsReducerState = {
    ban_class           : [],
    ban_class_derived   : [],

    all_proteins        : [],
    all_proteins_derived: [],
    error               : null,
    // pagination
    current_page  :  1,
    pages_total   :  1,
    // net
    is_loading          :  false,
    errored_out         :  false

}
export const ProteinsReducer = (
  state: ProteinsReducerState = initialStateProteinsReducer,
  action: ProteinActions
): ProteinsReducerState => {
  switch (action.type) {
    case "REQUEST_BAN_CLASS_GO":
      return { ...state, is_loading: true };
    case "REQUEST_BAN_CLASS_SUCCESS":
      return {
        ...state,
        ban_class: action.payload,
        ban_class_derived: action.payload,
        pages_total: Math.ceil(action.payload.length / 20),
      };
    case "REQUEST_BAN_CLASS_ERR":
      return {
        ...state,
        is_loading: false,
        error: action.error,
        errored_out: true,
      };
    case "GOTO_PAGE_PROTEINS":
      if (action.pid <= state.pages_total && action.pid >= 1) {
        return { ...state, current_page: action.pid };
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
    case "FILTER_CHANGE":
      var newState = (action as filterChange).derived_filters;
      // Type of the recently-change filte
      var ftype = (action as filterChange).filttype;

      var filtered_proteins =
        newState.applied_filters.length === 0
          ? state.ban_class
          : newState.applied_filters.reduce(
              (filteredProteins: RibosomalProtein[], filtertype: typeof ftype) => {
                return filteredProteins.filter(
                  FilterPredicates[filtertype]["PROTEIN"]!(
                    newState.filters[filtertype].value
                  )
                );
              },
              state.ban_class
            );

      return {
        ...state,
        ban_class_derived: filtered_proteins,
        pages_total: Math.ceil(filtered_proteins.length / 20),
        current_page:1

      };

    default:
      return state;
  }
};
