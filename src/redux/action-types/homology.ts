import { JsonData } from './../../app.types'

export const REQUEST_HOMOLOGS_ERR = "REQUEST_HOMOLOGS_ERR";
export const REQUEST_HOMOLOGS_SUCCESS = "REQUEST_HOMOLOGS_SUCCESS";
export const REQUEST_HOMOLOGS_GO = "REQUEST_HOMOLOGS_GO";

export interface requestHomologsGo {
  type: typeof REQUEST_HOMOLOGS_GO;
}

export interface requestHomolohsSuccess {
  type: typeof REQUEST_HOMOLOGS_SUCCESS;
  payload: JsonData;
}
export interface requestHomologsErr {
  type: typeof REQUEST_HOMOLOGS_ERR;
}

export type HomologsActionTypes =
  | requestHomologsErr
  | requestHomologsGo
  | requestHomolohsSuccess;
