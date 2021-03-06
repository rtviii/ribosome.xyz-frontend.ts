import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk, { ThunkMiddleware } from "redux-thunk";
import { createLogger } from "redux-logger";
import { _StructuresReducer } from "./reducers/StructuresReducer/StructuresReducer";
import { FiltersReducer } from "./reducers/Filters/FiltersReducer";
import { ProteinsReducer } from "./reducers/Proteins/ProteinsReducer";
import { RNAReducer } from "./reducers/RNA/RNAReducer";
import { LigandsReducer } from "./reducers/Ligands/LigandsReducer";
import { UtilitiesReducer } from "./reducers/Utilities/UtilitiesReducer"
import { InterfaceReducer } from "./reducers/Interface/InterfaceReducer"
import { CartReducer } from "./reducers/Cart/CartReducer"
import { BindingSitesReducer } from "./reducers/BindingSites/BindingSitesReducer"

const collapsFilter = (action: any) => {

  var toFilter  =  [""];
  return !toFilter.includes(action!.type);

};
const logger = createLogger({ collapsed: collapsFilter });

export const rootReducer = combineReducers({
  filters      : FiltersReducer,
  structures   : _StructuresReducer,
  proteins     : ProteinsReducer,
  rna          : RNAReducer,
  ligands      : LigandsReducer,
  utils        : UtilitiesReducer,
  Interface    : InterfaceReducer,
  cart         : CartReducer,
  binding_sites: BindingSitesReducer
});

export type AppState = ReturnType<typeof rootReducer>;

export const store = 
createStore(
  rootReducer,
  applyMiddleware(thunk as ThunkMiddleware, logger)
);
