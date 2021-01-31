import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk, { ThunkMiddleware } from "redux-thunk";
import { createLogger } from "redux-logger";
import { _StructuresReducer } from "./reducers/StructuresReducer/StructuresReducer";
import { FiltersReducer } from "./reducers/Filters/FiltersReducer";

const collapsFilter = (action: any) => {
  // Collapse by action type:
  var toFilter = [""];
  return !toFilter.includes(action!.type);
};
const logger = createLogger({ collapsed: collapsFilter });


export const rootReducer = combineReducers({
  filters:FiltersReducer,
  structures:_StructuresReducer});

export type AppState = ReturnType<typeof rootReducer>;

export const store = createStore(
  rootReducer,
  applyMiddleware(thunk as ThunkMiddleware, logger)
);
