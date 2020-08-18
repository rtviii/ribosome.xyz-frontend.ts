import { DataActionTypes } from "./../types/action.types";

const defaultLocalDataDefaultState = {
  structures: [],
};

export interface LocalDataState {
  structures: Array<any>;
}

export const loadLocalData = (structures: Array<any>): DataActionTypes => ({
  type: "LOAD_LOCAL_DATA",
  payload: structures,
});

export const localDataReducer = (
  state: LocalDataState = defaultLocalDataDefaultState,
  action: DataActionTypes
): LocalDataState => {
  switch (action.type) {
    case "LOAD_LOCAL_DATA":
      return {
        structures: action.payload,
      };
    default:
      return state;
  }
};
