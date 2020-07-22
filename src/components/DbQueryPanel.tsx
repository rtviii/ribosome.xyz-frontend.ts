import React from "react";
import "./../styles/DbQueryPanel.css";
import { AppState } from "../redux/store";
import { connect } from "react-redux";
import {  ThunkDispatch } from "redux-thunk";
import { AppActions } from "../types/action.types";
import { toggleToolgroupById } from "../redux/reducers/toolbarReducer";
import { requestStructDjango } from "../redux/reducers/structReducer";

interface DbQueryProps {}

interface StateProps {}
interface DispatchProps {
  toggleCurrentToolbar: () => void;
  submitRequest: (pdbid: string) => void;
}
type Props = DbQueryProps & StateProps & DispatchProps;
// type Props = DispatchProps & StateProps;

const DbQueryPanel: React.FC<Props> = pps => {
  return (
    <div className="db-query-panel">
      <div>
        <p>PDB ID:</p>
        <input type="text" />
      </div>
      <div>
        <p>Request Homologs:</p> <input type="checkbox" name="" id="" />
      </div>
      <div>
        <p>Limit</p> <input type="text" />
      </div>
      <button
        onClick={() => {
        //   pps.toggleCurrentToolbar();
          pps.submitRequest("3J7Z")
        }}
      >
        Fetch
      </button>
    </div>
  );
};

const mapStateToProps = (
  state: AppState,
  ownState: DbQueryProps
): StateProps => ({});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  ownProps: DbQueryProps
): DispatchProps => ({
  toggleCurrentToolbar: () => dispatch(toggleToolgroupById(-1)),
  submitRequest: pdbid => dispatch(requestStructDjango(pdbid)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DbQueryPanel);
