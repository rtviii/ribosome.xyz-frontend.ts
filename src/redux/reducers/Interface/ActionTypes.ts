import {  Dispatch } from "redux";

export const TOGGLE_DASHBOARD       =  "TOGGLE_DASHBOARD";

export interface toggleDashboard       {type: typeof TOGGLE_DASHBOARD}


export type InterfaceActions =
toggleDashboard


export const toggle_dashboard = (): toggleDashboard => ({
  type: TOGGLE_DASHBOARD,
});




