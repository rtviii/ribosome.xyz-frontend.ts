import {  Dispatch } from "redux";
import {toggleCart}from './../Cart/ActionTypes'

export const TOGGLE_DASHBOARD       =  "TOGGLE_DASHBOARD";

export interface toggleDashboard       {type: typeof TOGGLE_DASHBOARD}


export type InterfaceActions =
toggleDashboard | toggleCart


export const toggle_dashboard = (): toggleDashboard => ({
  type: TOGGLE_DASHBOARD,
});




