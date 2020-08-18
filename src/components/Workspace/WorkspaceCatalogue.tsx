import React, { useEffect } from "react";
import "./WorkspaceCatalogue.css";
import { connect, useSelector } from "react-redux";
import {
  WorkspaceState,
  toggleWorkspaceSelected,
  loadUpWorkspaceStructures,
} from "../../redux/reducers/workspaceCatalogueReducer";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../../redux/types/action.types";
import { AppState } from "../../redux/store";
import StructHero from "./StructureHero/StructHero";

interface OwnProps {}
interface StateProps {
  catalogueAvailable: Array<string>;
  catalogueSelected: Array<string>;
}
interface ActionProps {
  toggleSelected: (pdbid: string) => void;
  loadUp: (structs: Array<string>) => void;
}

type WorkspaceProps = ActionProps & OwnProps & StateProps;

const WorkspaceCatalogue: React.FC<WorkspaceProps> = props => {
  const { loadUp } = props;
  var structs = useSelector((state: AppState) =>
    state.store_data.state_local.structures.map((struct: any) => {
      return struct.pdbid;
    })
  );
  useEffect(() => {
    loadUp(structs);
  }, [loadUp]);

  return (
    <div className="workspace-catalogue">
      <div className="workspace-available">
        {props.catalogueAvailable.map((struct, i: any) => {
          
          
          return <StructHero select={props.toggleSelected} key={i+struct} pdbid={struct} />;
        })}
      </div>
      <div className="workspace-selected">
        {props.catalogueSelected.map((struct, i: any) => {
          return <StructHero select={props.toggleSelected} key={i+struct} pdbid={struct} />;
        })}
      </div>
    </div>
  );
};

const mapState = (state: AppState, OwnProps: OwnProps): WorkspaceState => ({
  catalogueAvailable:
    state.store_ui.state_WorkspaceCatalogue.catalogueAvailable,
  catalogueSelected: state.store_ui.state_WorkspaceCatalogue.catalogueSelected,
});

const mapDispatch = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  ownprops: OwnProps
): ActionProps => ({
  toggleSelected: (pdbid: string) => dispatch(toggleWorkspaceSelected(pdbid)),
  loadUp: (structures: string[]) =>
    dispatch(loadUpWorkspaceStructures(structures)),
});

export default connect(mapState, mapDispatch)(WorkspaceCatalogue);
