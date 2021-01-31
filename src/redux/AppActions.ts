import { StructActionTypes } from "./reducers/StructuresReducer/ActionTypes";
import { FiltersActionTypes } from "./reducers/Filters/ActionTypes";

export type AppActions = StructActionTypes | FiltersActionTypes;
