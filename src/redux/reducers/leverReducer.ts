import { AppActions } from "../../types/actions";
import { Dispatch } from "redux";
import { AppState } from "../store";

export interface Lever {
  leverstate: boolean;
}

export const SWITCH_LEVER = "SWITCH_LEVER";
export interface switchLever {
  type: typeof SWITCH_LEVER;
}

const leverReducerDefaultState: boolean = false;

export const switchLever = (): AppActions => ({
  type: "SWITCH_LEVER",
});

export const startSwitchLever = () => {
  return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
    console.log("Timer on");

    setTimeout(() => {
      dispatch(switchLever());
    }, 2000);
  };
};
export const leverReducer = (
  state: boolean = leverReducerDefaultState,
  action: AppActions
): boolean => {
  switch (action.type) {
    case "SWITCH_LEVER":
      return !state;
    default:
      return state;
  }
};
