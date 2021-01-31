import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk, { ThunkMiddleware } from "redux-thunk";
import { createLogger } from "redux-logger";
import { PagewideFilterReducer } from "./reducers/UI/PagewideFilterReducer";
import { workspaceCatalogueReducer } from "./reducers/UI/workspaceCatalogueReducer";
import { StructuresReducer } from "./reducers/Data/StructuresReducer/StructuresReducer";

const collapsFilter = (action: any) => {
  var toFilter = ["TOGGLE_WORKSPACE_SELECTED"];
  return !toFilter.includes(action!.type);
};
const logger = createLogger({ collapsed: collapsFilter });


export const rootReducer = combineReducers({
structures:StructuresReducer
});

export type AppState = ReturnType<typeof rootReducer>;

export const store = createStore(
  rootReducer,
  applyMiddleware(thunk as ThunkMiddleware, logger)
);
