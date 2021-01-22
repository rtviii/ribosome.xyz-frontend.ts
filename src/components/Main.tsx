import React, {  createContext } from "react";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../redux/AppActions";
import { AppState } from "../redux/store";
import "./Main.css";
import Navbar from "./NavbarTop/Navbar";
import Display from "./Workspace/Display/Display";
import * as redux from './../redux/reducers/Data/StructuresReducer/StructuresReducer'
import { connect } from "react-redux";
import Dashboard from './../materialui/Dashboard/Dashboard'

// Some other comment to conflict. mdfields it is.lgtm
// diverge from mdfields


interface OwnProps {}
interface ReduxProps {}
interface DispatchProps {__rx_requestStructures: () => void}

type MainProps = DispatchProps & OwnProps & ReduxProps;
const Main: React.FC<MainProps> = (prop:MainProps) => {

  return (
    <div className="main">
      <Dashboard/>
      <Display />
     </div> 
  );
};

const mapstate = (state: AppState, ownprops: OwnProps): ReduxProps => ({
  __rx_structures: state.Data.RibosomeStructures.StructuresResponse,
  loading        : state.Data.RibosomeStructures.Loading,
  globalFilter   : state.UI.state_Filter.filterValue,
});

const mapdispatch = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  ownprops: OwnProps
): DispatchProps => ({
  __rx_requestStructures: ()=> dispatch(redux.requestAllStructuresDjango())
});

export default connect(mapstate, mapdispatch)(Main);


export const truncate = (str:string, charlim:number, truncateto:number) =>{
  if (typeof str === 'undefined'){
    return str
  }
    return str.length > 20 ? str.substring(0, 15) + "..." : str;
}