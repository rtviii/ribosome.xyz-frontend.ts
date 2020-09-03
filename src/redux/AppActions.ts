import { UIActions } from "./reducers/UI/UIActions";
import { DataActions } from "./reducers/Data/DataActions";

export type AppActions = DataActions | UIActions;
