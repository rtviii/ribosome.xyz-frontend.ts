import { HomologsActionTypes } from "./homology";
import { switchLever } from "../reducers/leverReducer";

type AppActions = HomologsActionTypes | switchLever;

export default AppActions;