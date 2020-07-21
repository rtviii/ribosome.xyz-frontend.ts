export const REQUEST_HOMOLOGS_ERR = "REQUEST_HOMOLOGS_ERR";
export const REQUEST_HOMOLOGS_SUCCESS = "REQUEST_HOMOLOGS_SUCCESS";
export const REQUEST_HOMOLOGS_GO = "REQUEST_HOMOLOGS_GO";

export interface requestHomologsGo {
  type: typeof REQUEST_HOMOLOGS_GO;
}

export interface requestHomolohsSuccess {
  type: typeof REQUEST_HOMOLOGS_SUCCESS;
  payload: {};
}
export interface requestHomologsErr {
  type: typeof REQUEST_HOMOLOGS_ERR;
}

export type HomologsActionTypes =
  | requestHomologsErr
  | requestHomologsGo
  | requestHomolohsSuccess;


// --- UI Action types
export const TOGGLE_TOOLGROUP_BY_ID = "TOGGLE_TOOLGROUP_BY_ID";
export interface AtoggleToolgroupById {
  type: typeof TOGGLE_TOOLGROUP_BY_ID;
  id: number;
}
export type UIActionTypes = AtoggleToolgroupById;



export type AppActions  = HomologsActionTypes | UIActionTypes;