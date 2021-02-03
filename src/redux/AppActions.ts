import { StructActionTypes } from "./reducers/StructuresReducer/ActionTypes";
import { FiltersActionTypes } from "./reducers/Filters/ActionTypes";
import { ProteinActions } from "./reducers/Proteins/ActionTypes";
import { RNAActions } from "./reducers/RNA/ActionTypes";
import { LigandsActions } from "./reducers/Ligands/ActionTypes";

export type AppActions = StructActionTypes | FiltersActionTypes | ProteinActions | RNAActions | LigandsActions;
