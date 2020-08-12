// -⋯⋯⋅⋱ DATA Action types⋰⋆⋅⋅⋄⋅⋅∶⋅⋅⋄▫▪▭┈┅✕⋅⋅⋄⋅⋅✕∶⋅⋅⋄⋱⋰⋯⋯⋯⋯⋅⋱⋰⋆⋅⋅⋄⋅⋅∶⋅⋅⋄▫▪▭┈┅✕⋅⋅⋄⋅⋅✕∶⋅⋅⋄⋱⋰⋯⋯⋯⋅⋱⋰⋆⋅⋅⋄⋅⋅∶⋅⋅⋄▫▪▭┈┅✕⋅⋅⋄⋅⋅✕∶⋅⋅⋄⋱⋰⋯
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
export type HomologyActionTypes =
  | requestHomologsErr
  | requestHomologsGo
  | requestHomolohsSuccess;

// --------------------------------------------------
export const REQUEST_STRUCT_GO = "REQUEST_STRUCT_GO";
export const REQUEST_STRUCT_SUCCESS = "REQUEST_STRUCT_SUCCESS";
export const REQUEST_STRUCT_ERR = "REQUEST_STRUCT_ERR";
export interface requestStructSuccess {
  type: typeof REQUEST_STRUCT_SUCCESS;
  payload: []
}
export interface requestStructGo {
  type: typeof REQUEST_STRUCT_GO;
}
export interface requestStructErr {
  type: typeof REQUEST_STRUCT_ERR;
  error: Error;
}
export type StructActionTypes =
  | requestStructErr
  | requestStructSuccess
  | requestHomologsGo;
// --------------------------------------------------

export type DataActionTypes = HomologyActionTypes | StructActionTypes;

// -⋯⋯⋅⋱ DATA Action types⋰⋆⋅⋅⋄⋅⋅∶⋅⋅⋄▫▪▭┈┅✕⋅⋅⋄⋅⋅✕∶⋅⋅⋄⋱⋰⋯⋯⋯⋯⋅⋱⋰⋆⋅⋅⋄⋅⋅∶⋅⋅⋄▫▪▭┈┅✕⋅⋅⋄⋅⋅✕∶⋅⋅⋄⋱⋰⋯⋯⋯⋅⋱⋰⋆⋅⋅⋄⋅⋅∶⋅⋅⋄▫▪▭┈┅✕⋅⋅⋄⋅⋅✕∶⋅⋅⋄⋱⋰⋯

// -⋯⋯⋅⋱ UI Action types⋰⋆⋅⋅⋄⋅⋅∶⋅⋅⋄▫▪▭┈┅✕⋅⋅⋄⋅⋅✕∶⋅⋅⋄⋱⋰⋯⋯⋯⋯⋅⋱⋰⋆⋅⋅⋄⋅⋅∶⋅⋅⋄▫▪▭┈┅✕⋅⋅⋄⋅⋅✕∶⋅⋅⋄⋱⋰⋯⋯⋯⋅⋱⋰⋆⋅⋅⋄⋅⋅∶⋅⋅⋄▫▪▭┈┅✕⋅⋅⋄⋅⋅✕∶⋅⋅⋄⋱⋰⋯
export const TOGGLE_TOOLGROUP_BY_ID = "TOGGLE_TOOLGROUP_BY_ID";
export interface toggleToolgroupById {
  type: typeof TOGGLE_TOOLGROUP_BY_ID;
  id: number;
}

export const TOGGLE_WORKSPACE_SELECTED="TOGGLE_WORKSPACE_SELECTED"
export const LOAD_UP_WORKSPACE_STRUCTURES="LOAD_UP_WORKSPACE_STRUCTURES"
export interface toggleWorkspaceSelected {
  type: typeof TOGGLE_WORKSPACE_SELECTED,
  pdbid:string
}

export interface loadUpWorkspaceStructures {
  type: typeof LOAD_UP_WORKSPACE_STRUCTURES,
  structures: string[]
}
export type WorkspaceActions = toggleWorkspaceSelected | loadUpWorkspaceStructures;

// -⋯⋯⋅⋱UI Action types⋰⋆⋅⋅⋄⋅⋅∶⋅⋅⋄▫▪▭┈┅✕⋅⋅⋄⋅⋅✕∶⋅⋅⋄⋱⋰⋯⋯⋯⋯⋅⋱⋰⋆⋅⋅⋄⋅⋅∶⋅⋅⋄▫▪▭┈┅✕⋅⋅⋄⋅⋅✕∶⋅⋅⋄⋱⋰⋯⋯⋯⋅⋱⋰⋆⋅⋅⋄⋅⋅∶⋅⋅⋄▫▪▭┈┅✕⋅⋅⋄⋅⋅✕∶⋅⋅⋄⋱⋰⋯


export type UIActions = WorkspaceActions | toggleToolgroupById;




export type AppActions = DataActionTypes | UIActions;
