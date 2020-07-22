import React from "react";
import { connect } from "react-redux";
import { AppState } from "../redux/store";
import { bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../types/action.types";
import { toggleToolgroupById } from "../redux/reducers/toolbarReducer";
import "./../styles/Toolbar.css";
import { Link } from "react-router-dom";
import DbQueryPanel from "./DbQueryPanel";

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
  activeToolgroupId: state.store_ui.toolbar.activeToolGroupId,
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

const Tool = (props: any) => {
  return <button className="tool">{props.children}</button>;
};
const DropoutMenu: React.FC = pps => {
  return <div className="dropout-menu" onClick={e=>{e.stopPropagation()}}>{pps.children}</div>;
};
const ToolBar: React.FC = () => {
  return (
    <nav className="toolbar">
      <ToolGroup id={3} name="Toolgroup3D"></ToolGroup>
      <ToolGroup id={2} name="Toolgroup2D"></ToolGroup>
      <ToolGroup id={1} name="Toolgroup1D"></ToolGroup>

      <div style={{ width: "5%", height: "1px", backgroundColor: "white" }} />
      <div style={{ width: "20%", height: "1px", backgroundColor: "white" }} />
      <div style={{ width: "60%", height: "1px", backgroundColor: "white" }} />
      <div style={{ width: "100%", height: "1px", backgroundColor: "white" }} />
      <div style={{ width: "60%", height: "1px", backgroundColor: "white" }} />
      <div style={{ width: "20%", height: "1px", backgroundColor: "white" }} />
      <div style={{ width: "5%", height: "1px", backgroundColor: "white" }} />
      <div>
        <ToolGroup id={6} name="RequestData">
          <DropoutMenu>
            <DbQueryPanel />
          </DropoutMenu>
        </ToolGroup>
        <Link to="./display">
          <ToolGroup id={4} name="Visualization"></ToolGroup>
        </Link>

        <Link to="./data">
          <ToolGroup id={5} name="Analytics"></ToolGroup>
        </Link>
      </div>
    </nav>
  );
};

export default ToolBar;
