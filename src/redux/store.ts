import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk, { ThunkMiddleware } from "redux-thunk";
import { homologsReducer } from "./reducers/homologsReducer";
import logger from "redux-logger";
import { toolbarReducer } from "./reducers/toolbarReducer";
import { workspaceCatalogueReducer } from "./reducers/workspaceCatalogueReducer";
import { structReducer } from "./reducers/structReducer";

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
