import React from "react";
import { AppActions } from "./../../redux/AppActions";
import { connect } from "react-redux";
import { AppState } from "../../redux/store";
import { bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { toggleToolgroupById } from "../../redux/reducers/UI/toolbarReducer";
import { Link, withRouter } from "react-router-dom";
import "./../../styles/Toolbar.css";

interface ReduxProps {
  activeToolgroupId: number;
}
interface ActionProps {
  toggleToolgroupById: (id: number) => void;
}

interface OwnProps {
  id: number;
  name?: string;
}

type ToolGroupProps = ActionProps & ReduxProps & OwnProps;
const ToolGroupTemplate: React.FC<ToolGroupProps> = pps => {
  return (
    <div
      className="toolgroup"
      onClick={() => {
        pps.toggleToolgroupById(pps.id);
      }}
    >
      {pps.name}
      {pps.activeToolgroupId === pps.id ? pps.children : null}
    </div>
  );
};
const mapState = (state: AppState, ownProps: OwnProps): ReduxProps => ({
  activeToolgroupId: state.UI.state_Toolbar.activeToolGroupId,
});
const mapDispatch = (
  dispatch: ThunkDispatch<any, any, AppActions>,

  ownProps: OwnProps
): ActionProps => ({
  toggleToolgroupById: bindActionCreators(toggleToolgroupById, dispatch),
});
const ToolGroup: React.FC<OwnProps> = connect(
  mapState,
  mapDispatch
)(ToolGroupTemplate);

// const Tool = (props: any) => {
//   return <button className="tool">{props.children}</button>;
// };
const DropoutMenu: React.FC = pps => {
  return (
    <div
      className="dropout-menu"
      onClick={e => {
        e.stopPropagation();
      }}
    >
      {pps.children}
    </div>
  );
};
const ToolBar: React.FC = () => {
  return (
    <nav className="toolbar">
      <Link to="/catalogue">
        <ToolGroup id={4} name="Structures Catalogue"></ToolGroup>
      </Link>
      <Link to="/rps">
        <ToolGroup id={4} name="Ribosomal Proteins Catalogue"></ToolGroup>
      </Link>

      <div
        onClick={() => {
          alert(
            "Please refer to the API docs. At this moment Prisma/GraphQL server is under construction."
          );
        }}
      >
        <ToolGroup id={6} name="RequestData"></ToolGroup>
      </div>

      <Link to="/display">
        <ToolGroup id={4} name="Visualization"></ToolGroup>
      </Link>

      <Link to="/data">
        <ToolGroup id={5} name="Analytics"></ToolGroup>
      </Link>
    </nav>
  );
};

export default withRouter(ToolBar);
