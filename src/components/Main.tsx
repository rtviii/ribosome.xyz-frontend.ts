import React, {  createContext } from "react";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../redux/AppActions";
import { AppState } from "../redux/store";
import "./Main.css";
import Navbar from "./NavbarTop/Navbar";
import Display from "./Workspace/Display/Display";
import * as redux from './../redux/reducers/Data/StructuresReducer/StructuresReducer'
import { connect } from "react-redux";

export type PageContexts =
  | "RibosomalProteinPage"
  | "ProteinCatalogue"
  | "StructurePage"
  | "Main"
  | "WorkspaceCatalogue";
export const PageContext = createContext<PageContexts>("Main");

interface OwnProps {}
interface ReduxProps {}
interface DispatchProps {__rx_requestStructures: () => void}

type MainProps = DispatchProps & OwnProps & ReduxProps;
const Main: React.FC<MainProps> = (prop:MainProps) => {

  return (
    <div className="main">
      <Navbar />
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

