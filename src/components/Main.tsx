import React, { createContext, useEffect } from "react";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../redux/AppActions";
import { AppState } from "../redux/store";
import "./Main.css";
import Display from "./Workspace/Display/Display";
import * as redux from "../redux/reducers/StructuresReducer/StructuresReducer";
import { connect, useDispatch } from "react-redux";
import { TemporaryDrawer } from "./../materialui/Dashboard/Dashboard";

import { requestAllLigands } from "../redux/reducers/Ligands/ActionTypes";
import { requestBanMetadata } from "../redux/reducers/Proteins/ActionTypes";
import { requestRnaClass } from "../redux/reducers/RNA/ActionTypes";
import { request_all_bsites } from "./../redux/reducers/BindingSites/ActionTypes";
import { RNAClass } from "../redux/RibosomeTypes";

// interface OwnProps {}
// interface ReduxProps {}
// interface DispatchProps {
//   __rx_requestStructures: () => void;
//   __rx_requestAllLigands: () => void;
// }

// type MainProps = DispatchProps & OwnProps & ReduxProps;
const Main = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    // prop.__rx_requestStructures();
    dispatch(redux.requestAllStructuresDjango())
    dispatch(requestAllLigands())
    // prop.__rx_requestAllLigands();


    dispatch(requestBanMetadata("b", "LSU"));
    dispatch(requestBanMetadata("e", "LSU"));
    dispatch(requestBanMetadata("u", "LSU"));

    dispatch(requestBanMetadata("b", "SSU"));
    dispatch(requestBanMetadata("e", "SSU"));
    dispatch(requestBanMetadata("u", "SSU"));

    dispatch(request_all_bsites());

    for (var k of [
      "mRNA",
      "tRNA",
      "5.8SrRNA",
      "12SrRNA",
      "16SrRNA",
      "21SrRNA",
      "23SrRNA",
      "25SrRNA",
      "28SrRNA",
      "35SrRNA",
      "5SrRNA",
    ]) {
      dispatch(requestRnaClass(k as RNAClass));
    }
  }, []);

  return (
    <div>
      <TemporaryDrawer />
      <Display />
    </div>
  );
};

// const mapstate = (state: AppState, ownprops: OwnProps): ReduxProps => ({
//   __rx_structures: state.structures.neo_response,
//   loading: state.structures.Loading,
// });

// const mapdispatch = (
//   dispatch: ThunkDispatch<any, any, AppActions>,
//   ownprops: OwnProps
// ): DispatchProps => ({
//   __rx_requestStructures: () => dispatch(redux.requestAllStructuresDjango()),
//   // __rx_requestRNAs      : ()=> dispatch(requestAllRNAs()),
//   __rx_requestAllLigands: () => dispatch(requestAllLigands()),
// });

// export default connect(mapstate, mapdispatch)(Main);
export default Main;
export const truncate = (str: string, charlim: number, truncateto: number) => {
  if (typeof str === "undefined") {
    return str;
  }
  return str.length > charlim ? str.substring(0, truncateto) + "..." : str;
};
export const transformToShortTax = (taxname: string) => {
  if (typeof taxname === "string") {
    var words = taxname.split(" ");
    if (words.length > 1) {
      var fl = words[0].slice(0, 1);
      var full = fl.toLocaleUpperCase() + ". " + words[1];
      return full;
    } else {
      return words[0];
    }
  } else return taxname;
};

