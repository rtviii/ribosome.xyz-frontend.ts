import React, { useState, ReactPropTypes } from "react";
import { connect } from "react-redux";
import { AppState } from "../redux/store";
import { Dispatch, bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../types/action.types";
import { toggleToolgroupById } from "../redux/reducers/toolbarReducer";

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
      {pps.activeToolgroupId === pps.id ? <DropoutMenu /> : null}
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
const ToolGroup = connect(mapState, mapDispatch)(ToolGroupTemplate);

const DropoutMenu = (props: any) => {
  const Tool = (props: any) => {
    return <button className="tool">{props.children}</button>;
  };

  return (
    <div className="dropout-menu">
      <Tool> Tool1</Tool>
      <Tool> Tool2</Tool>
    </div>
  );
};
const ToolBar = () => {
  return (
    <nav className="toolbar">
      <ToolGroup id={3} name="Toolgroup3D" />
      <ToolGroup id={2} name="Toolgroup2D" />
      <ToolGroup id={1} name="Toolgroup1D" />
    </nav>
  );
};

export default ToolBar;
