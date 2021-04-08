import {  Dispatch } from "redux";
import {toggleCart}from './../Cart/ActionTypes'

const TOGGLE_DASHBOARD    =  "TOGGLE_DASHBOARD";
const STRUCT_PAGE_CHOICE  =  "STRUCT_PAGE_CHOICE";

export interface toggleDashboard       {type: typeof TOGGLE_DASHBOARD}
export interface structPageChoice      {
  type            :  typeof STRUCT_PAGE_CHOICE
  field   :  "component"
  choice  :  "rna" |"protein" | "ligand"
}

export type InterfaceActions = toggleDashboard | toggleCart | structPageChoice

export const toggle_dashboard = (): toggleDashboard => ({
  type: TOGGLE_DASHBOARD,
});

export const struct_page_choice= (field: "component", choice:"rna"| "protein" | "ligand"): structPageChoice => ({
  type     :  STRUCT_PAGE_CHOICE,
  field,
  choice
});