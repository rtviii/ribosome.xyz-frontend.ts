import React, { useEffect } from "react";
import "./../styles/Main.css";
import Toolbar from "./ToolbarLeft/Toolbar";
import Navbar from "./NavbarTop/Navbar";
import Display from "./Workspace/Display";
import { withRouter, useHistory } from "react-router-dom";
import { AppState } from "../redux/store";
import { ThunkDispatch } from "redux-thunk";
import { DataActionTypes } from "../redux/types/action.types";
import { loadLocalData } from "../redux/reducers/localDataReducer";
import { connect } from "react-redux";
import { structs_kdd2019 } from "./../static/kdd-paper-table";

interface OwnProps {}
interface StateProps {
  structures: Array<any>;
}
interface ActionProps {
  loadStaticData: (structures: any) => void;
}
type MainProps = ActionProps & OwnProps & StateProps;

const Main: React.FC<MainProps> = props => {
  const history = useHistory();
  useEffect(() => {
    // history.push("");
    const reshaped = Object.values(structs_kdd2019).map((e: any) => {
      return { pdbid: e!.metadata.pdbid, ...e };
    });

    props.loadStaticData(reshaped);
    return () => {};
  }, [history]);

  // const baseapi = process.env.REACT_APP_DJANGO_URL;
  return (
    <div className="main">
      <Navbar />
      <Toolbar />
      <Display />
    </div>
  );
};

const mapState = (state: AppState, OwnProps: OwnProps): StateProps => ({
  structures: state.store_data.state_local.structures,
});
const mapDispatch = (
  dispatch: ThunkDispatch<any, any, DataActionTypes>,
  OwnProps: OwnProps
): ActionProps => ({
  loadStaticData: (structures: any) => dispatch(loadLocalData(structures)),
});

export default withRouter(connect(mapState, mapDispatch)(Main));
