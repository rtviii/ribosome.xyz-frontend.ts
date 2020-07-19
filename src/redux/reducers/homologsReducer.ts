import AppActions from './../action-types/app.actions'
import JsonData from './../../app.types'

const HomologsReducerDefaultState = {
  loading: false,
  error: false,
  data: {},
};

export const homologsReducer = (state = HomologsReducerDefaultState, action: AppActions): JsonData => {
  switch (action.type) {
    case "REQUEST_HOMOLOGS_ERR":
      return Object.assign(state, { error: true, loading: false });
    case "REQUEST_HOMOLOGS_GO":
      return Object.assign(state, { loading: true });
    case "REQUEST_HOMOLOGS_SUCCESS":
      return Object.assign(state, {
        data: action.payload,
        loading: false,
        error: false,
      });

    default:
      return state;
  }
};
