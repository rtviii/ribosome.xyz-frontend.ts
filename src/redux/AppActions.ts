import { StructActionTypes } from "./reducers/StructuresReducer/ActionTypes";
import { FiltersActionTypes } from "./reducers/Filters/ActionTypes";
import { ProteinActions } from "./reducers/Proteins/ActionTypes";
import { RNAActions } from "./reducers/RNA/ActionTypes";
import { LigandsActions } from "./reducers/Ligands/ActionTypes";
import { UtilitiesActions } from "./reducers/Utilities/ActionTypes"
import { InterfaceActions } from "./reducers/Interface/ActionTypes";
import { CartActions } from "./reducers/Cart/ActionTypes";

export type AppActions =
  | StructActionTypes
  | FiltersActionTypes
  | ProteinActions
  | RNAActions
  | LigandsActions
  | UtilitiesActions
  | InterfaceActions
  | CartActions
