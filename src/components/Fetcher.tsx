import React, { useState } from "react";
import JsonViewer from "./JsonViewer";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AppState } from "../redux/store";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../types/actions";
import { bindActionCreators } from "redux";
import { startSwitchLever } from "../redux/reducers/leverReducer";
import { connect } from "react-redux";

// const apibase = process.env.REACT_APP_DJANGO_URL;

interface ControlPanelProps {
  any?: any;
}
type Props = ControlPanelProps | any;

const Fetcher: React.FC<Props> = ({hitthelever, leverstate}) => {
  return (
    <div className="input-panel">
      <div>{leverstate ? "NO" : "YES"}</div>
      <button onClick={()=>hitthelever()}>Switch</button>
    </div>
  );
};

interface LinkStateProps {
  leverstate: boolean;
}
interface LinkDispatchProps {
  hitthelever: () => void;
}

const mapStateToProps = (
  state: AppState,
  ownProps: ControlPanelProps
): LinkStateProps => ({
  leverstate: state.leverstate,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  ownProps: ControlPanelProps
): LinkDispatchProps => ({
  hitthelever: bindActionCreators(startSwitchLever, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Fetcher);
