import { RNAActions } from './ActionTypes'
import { RNAProfile} from '../../DataInterfaces'
import { filterChange, FilterPredicates } from '../Filters/ActionTypes';
import { filter } from 'lodash';





interface RNAReducerState{

    error          : any,
    is_loading     : boolean;
    errored_out    : boolean;

    all_rna        : RNAProfile[],
    all_rna_derived: RNAProfile[],

    current_page   : number,
    pages_total    : number,
}

const initialStateRNAReducer:RNAReducerState = {

    all_rna        : [],
    all_rna_derived: [],
    // pagination
    current_page  :  1,
    pages_total   :  1,
    // net
    error               : null,
    is_loading          :  false,
    errored_out         :  false

}
export const RNAReducer = (
  state: RNAReducerState = initialStateRNAReducer,
  action: RNAActions
): RNAReducerState => {
  switch (action.type) {
    case "REQUEST_ALL_RNA_GO":
      return {...state, is_loading:true}
    case "REQUEST_ALL_RNA_SUCCESS":
      return {...state, is_loading:false, all_rna:action.payload, all_rna_derived:action.payload,
        pages_total: Math.ceil(action.payload.length / 20),
      }
    case "REQUEST_ALL_RNA_ERR":
      return {...state, is_loading:false, errored_out:true,error:action.error}
    case "GOTO_PAGE_RNA":
      if (action.pid <= state.pages_total && action.pid >= 1) {
        return { ...state, current_page: action.pid };
      }
      return state;
    case "NEXT_PAGE_RNA":
      if (state.current_page + 1 === state.pages_total) {
        return state;
      }
      return { ...state, current_page: state.current_page + 1 };
    case "PREV_PAGE_RNA":
      if (state.current_page - 1 < 1) {
        return state;
      }
      return { ...state, current_page: state.current_page - 1 };
    case "FILTER_CHANGE":
      var newState = (action as filterChange).derived_filters;
      // Type of the recently-change filte
      var ftype = (action as filterChange).filttype;

      var filtered_rna =
        newState.applied_filters.length === 0
          ? state.all_rna
          : newState.applied_filters.reduce(
              (filteredRNA: RNAProfile[], filtertype: typeof ftype) => {
                return filteredRNA.filter(
                  FilterPredicates[filtertype]["RNA"]!(
                    newState.filters[filtertype].value
                  )
                );
              },
              state.all_rna
            );

      return {
        ...state,
        all_rna_derived: filtered_rna,
        pages_total: Math.ceil(filtered_rna.length / 20),
        current_page:1

      };

    default:
      return state;
  }
};

