import {RibosomalProtein} from '../../RibosomeTypes'
import {LigandResponseShape, NeoHomolog} from '../../DataInterfaces'
import { filterChange, FilterPredicates } from '../Filters/ActionTypes';
import { LigandsActions } from './ActionTypes';





interface LigandsReducerState{

    error               : any,
    is_loading          : boolean;
    errored_out         : boolean;

    ligands_all        : LigandResponseShape[],
    ligands_all_derived: LigandResponseShape[],

    current_page        : number,
    pages_total         : number,
}

const initialStateLigandsReducer:LigandsReducerState = {
  ligands_all        : [],
  ligands_all_derived: [],
  error              : null,
    // pagination
    current_page  :  1,
    pages_total   :  1,
    // net
    is_loading          :  false,
    errored_out         :  false

}
export const LigandsReducer = (
  state: LigandsReducerState = initialStateLigandsReducer,
  action: LigandsActions
): LigandsReducerState => {
  switch (action.type) {
    case "REQUEST_ALL_LIGANDS_GO":
      return { ...state, is_loading: true };
    case "REQUEST_ALL_LIGANDS_SUCCESS":
      return {
        ...state,
        ligands_all        : action.payload,
        ligands_all_derived: action.payload,
        pages_total      : Math.ceil(action.payload.length / 20),
      };
    case "REQUEST_ALL_LIGANDS_ERR":
      return {
        ...state,
        is_loading: false,
        error: action.error,
        errored_out: true,
      };
    case "GOTO_PAGE_LIGANDS":
      if (action.pid <= state.pages_total && action.pid >= 1) {
        return { ...state, current_page: action.pid };
      }
      return state;
    case "NEXT_PAGE_LIGANDS":
      if (state.current_page + 1 === state.pages_total) {
        return state;
      }
      return { ...state, current_page: state.current_page + 1 };
    case "PREV_PAGE_LIGANDS":
      if (state.current_page - 1 < 1) {
        return state;
      }
      return { ...state, current_page: state.current_page - 1 };
    case "FILTER_CHANGE":
      var newState = (action as filterChange).derived_filters;
      // Type of the recently-change filte
      var ftype = (action as filterChange).filttype;

      var filtered_ligands =
        newState.applied_filters.length === 0
          ? state.ligands_all
          : newState.applied_filters.reduce(

              (filteredligands: LigandResponseShape[], filtertype: typeof ftype) => {
                return filteredligands.filter(
                  FilterPredicates[filtertype]["LIGAND"]!(
                    newState.filters[filtertype].value
                  )
                );
              },
              state.ligands_all
            );

      return {
        ...state,
        ligands_all_derived: filtered_ligands,
        pages_total        : Math.ceil(filtered_ligands.length / 20),
        current_page       : 1

      };

    default:
      return state;
  }
};
