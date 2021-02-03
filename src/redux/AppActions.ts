import { StructActionTypes } from "./reducers/StructuresReducer/ActionTypes";
import { FiltersActionTypes } from "./reducers/Filters/ActionTypes";
import { ProteinActions } from "./reducers/Proteins/ActionTypes";
import { RNAActions } from "./reducers/RNA/ActionTypes";

export type AppActions = StructActionTypes | FiltersActionTypes | ProteinActions | RNAActions;
