import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk, { ThunkMiddleware } from "redux-thunk";
import { homologsReducer } from "./reducers/homologsReducer";
import logger from "redux-logger";
import { toolbarReducer } from "./reducers/toolbarReducer";

export const UIReducer = combineReducers({
  toolbar: toolbarReducer,
});
export const DataReducer = combineReducers({
  homologs: homologsReducer,
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
