import { Dispatch } from "redux";
import { getNeo4jData } from "../../AsyncActions/getNeo4jData";
import { NeoHomolog, RNAProfile } from './../../DataInterfaces'
import { flattenDeep } from "lodash";
import { filterChange } from "../Filters/ActionTypes";
import { RnaClass, RNAReducer } from "./RNAReducer";

export const REQUEST_RNA_CLASS_GO      = "REQUEST_RNA_CLASS_GO"     ;
export const REQUEST_RNA_CLASS_SUCCESS = "REQUEST_RNA_CLASS_SUCCESS";
export const REQUEST_RNA_CLASS_ERR     = "REQUEST_RNA_CLASS_ERR"    ;
export const FILTER_RNA_CLASS          = "FILTER_RNA_CLASS"         ;
export const GOTO_PAGE_RNA             = "GOTO_PAGE_RNA"
export const NEXT_PAGE_RNA             = "NEXT_PAGE_RNA"
export const PREV_PAGE_RNA             = "PREV_PAGE_RNA"

export const SELECT_RNA_CLASS = "SELECT_RNA_CLASS"

export type RnaFilter = "SPECIES" | "SEARCH"

export interface requestRnaClassGo { type: typeof REQUEST_RNA_CLASS_GO; rna_class: RnaClass }
export interface requestRnaClassSuccess { type: typeof REQUEST_RNA_CLASS_SUCCESS; payload: RNAProfile[], rna_class: RnaClass }
export interface requestRnaClassError { type: typeof REQUEST_RNA_CLASS_ERR; error: Error; }
export interface requestRnaClassError { type: typeof REQUEST_RNA_CLASS_ERR; error: Error; }
export interface filterRnaClass {
  type: typeof FILTER_RNA_CLASS;
  set: boolean;
  filter_type: RnaFilter;
  newvalue: any
}
export interface nextPageRNA { type: typeof NEXT_PAGE_RNA; }
export interface prevPageRNA { type: typeof PREV_PAGE_RNA; }
export interface gotoPageRNA { type: typeof GOTO_PAGE_RNA; pid: number; }
export interface selectRNAClass { type: typeof SELECT_RNA_CLASS; rna_class: RnaClass; }
export type RNAActions =
  | requestRnaClassGo
  | requestRnaClassError
  | requestRnaClassSuccess
  | filterRnaClass
  | selectRNAClass
  | nextPageRNA
  | prevPageRNA
  | gotoPageRNA;

export const requestRnaClass = (rna_class: RnaClass) => {
  return async (dispatch: Dispatch<RNAActions>) => {
    dispatch({
      type: REQUEST_RNA_CLASS_GO,
      rna_class
    });
    getNeo4jData("neo4j", {
      endpoint: "get_rna_class", params: {
        rna_class
      }
    })
      .then(
        response => {
          dispatch({
            type: REQUEST_RNA_CLASS_SUCCESS,
            payload: flattenDeep(response.data) as any,
            rna_class
          });
        },
        error => {
          dispatch({
            type: REQUEST_RNA_CLASS_ERR,
            error: error,
          });
        }
      ).then(
        a => {
          dispatch(select_rna_class("5"))
        }
      )
  };
};

export const select_rna_class = (rna_class: RnaClass): selectRNAClass => ({
  type: SELECT_RNA_CLASS,
  rna_class,
})

export const RnaClassFilterChangeAC = (newvalue: any, filter_type: RnaFilter): filterRnaClass => {

  let filterTypeIsSet: boolean = (() => {
    switch (filter_type) {
      case "SEARCH":
        return !(newvalue.length === 0);
      case "SPECIES":
        return !(newvalue.length === 0);
      default:
        return false;
    }
  })();

  return {
    set: filterTypeIsSet,
    filter_type,
    newvalue,
    type: FILTER_RNA_CLASS
  }
}

export const gotopage_rna = (pid: number): gotoPageRNA => ({
  type: GOTO_PAGE_RNA,
  pid
});
export const nextpage_rna = (): nextPageRNA => ({
  type: NEXT_PAGE_RNA

});
export const prevpage_rna = (): prevPageRNA => ({
  type: PREV_PAGE_RNA
});




