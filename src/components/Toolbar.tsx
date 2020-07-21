import React, { useState, ReactPropTypes } from "react";
import { connect } from "react-redux";
import { AppState } from "../redux/store";
import { Dispatch, bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../types/action.types";
import { toggleToolgroupById } from "../redux/reducers/toolbarReducer";
import "./../styles/Toolbar.css";

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
  return <div className="dropout-menu">{pps.children}</div>;
};
const ToolBar: React.FC = () => {
  return (
    <nav className="toolbar">
      <ToolGroup id={3} name="Toolgroup3D">
        <DropoutMenu>
          <Tool />
        </DropoutMenu>
      </ToolGroup>
      <ToolGroup id={2} name="Toolgroup2D"></ToolGroup>
      <ToolGroup id={1} name="Toolgroup1D"></ToolGroup>
    </nav>
  );
};

export default ToolBar;
