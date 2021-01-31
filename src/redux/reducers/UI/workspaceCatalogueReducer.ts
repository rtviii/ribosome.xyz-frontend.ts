import { UIActions } from "./UIActions";

export interface WorkspaceState {
  catalogueAvailable: Array<string>;
  catalogueSelected : Array<string>;
}

export const toggleWorkspaceSelected = (pdbid: string): UIActions => ({
  type: "TOGGLE_WORKSPACE_SELECTED",
  pdbid,
});
export const loadUpWorkspaceStructures = (structures: string[]): UIActions => ({
  type: "LOAD_UP_WORKSPACE_STRUCTURES",
  structures,
});

const workspaceDefaultState: WorkspaceState = {
  catalogueAvailable: [],
  catalogueSelected: [],
};

export const workspaceCatalogueReducer = (
  state: WorkspaceState = workspaceDefaultState,
  action: UIActions
): WorkspaceState => {
  switch (action.type) {
    case "TOGGLE_WORKSPACE_SELECTED":
      return state.catalogueAvailable.includes(action.pdbid)
        ? {
            catalogueAvailable: state.catalogueAvailable.filter(
              e => e !== action.pdbid
            ),
            catalogueSelected: [...state.catalogueSelected, action.pdbid],
          }
        : {
            catalogueAvailable: [...state.catalogueAvailable, action.pdbid],
            catalogueSelected: state.catalogueSelected.filter(
              e => e !== action.pdbid
            ),
          };
    case "LOAD_UP_WORKSPACE_STRUCTURES":
      return {
        catalogueAvailable: action.structures,
        catalogueSelected: [],
      };
    default:
      return state;
  }
};
