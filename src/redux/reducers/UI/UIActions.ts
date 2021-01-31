export const TOGGLE_TOOLGROUP_BY_ID = "TOGGLE_TOOLGROUP_BY_ID";
export interface toggleToolgroupById {
  type: typeof TOGGLE_TOOLGROUP_BY_ID;
  id: number;
}

export const TOGGLE_WORKSPACE_SELECTED    = "TOGGLE_WORKSPACE_SELECTED"
export const LOAD_UP_WORKSPACE_STRUCTURES = "LOAD_UP_WORKSPACE_STRUCTURES"
export interface toggleWorkspaceSelected {
  type: typeof TOGGLE_WORKSPACE_SELECTED,
  pdbid:string
}



export const INPUT_FILTER_VALUE = "INPUT_FILTER_VALUE";
export interface inputFilterValue{
  type: typeof INPUT_FILTER_VALUE,
  payload: string
}


export interface loadUpWorkspaceStructures {
  type: typeof LOAD_UP_WORKSPACE_STRUCTURES,
  structures: string[]
}
export type WorkspaceActions = toggleWorkspaceSelected | loadUpWorkspaceStructures;

export type UIActions = WorkspaceActions | inputFilterValue;