import { createStore, combineReducers, applyMiddleware, Action } from "redux";
import thunk, { ThunkMiddleware } from "redux-thunk";
import { homologsReducer } from "./reducers/homologsReducer";
import { createLogger } from "redux-logger";
import { toolbarReducer } from "./reducers/toolbarReducer";
import { workspaceCatalogueReducer } from "./reducers/workspaceCatalogueReducer";
import { structReducer } from "./reducers/structReducer";

const collapsFilter = (action: any) => {
  var toFilter = ["TOGGLE_WORKSPACE_SELECTED"];
  return ! toFilter.includes(action!.type);
};

const logger = createLogger({
  collapsed: collapsFilter,
});

export const UIReducer = combineReducers({
  state_Toolbar: toolbarReducer,
  state_WorkspaceCatalogue: workspaceCatalogueReducer,
});
export const DataReducer = combineReducers({
  state_Homologs: homologsReducer,
  state_Structs: structReducer,
});

export const rootReducer = combineReducers({
  store_data: DataReducer,
  store_ui: UIReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export const store = createStore(
  rootReducer,
  applyMiddleware(thunk as ThunkMiddleware, logger)
);
