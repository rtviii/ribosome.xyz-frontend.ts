import React, {  createContext, useEffect } from "react";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../redux/AppActions";
import { AppState } from "../redux/store";
import "./Main.css";
import Display from "./Workspace/Display/Display";
import * as redux from '../redux/reducers/StructuresReducer/StructuresReducer'
import { connect } from "react-redux";
import Dashboard from './../materialui/Dashboard/Dashboard'

import {requestAllRNAs}from './../redux/reducers/RNA/ActionTypes'
import { requestAllLigands } from "../redux/reducers/Ligands/ActionTypes";

interface OwnProps {}
interface ReduxProps {}
interface DispatchProps {
  __rx_requestStructures: () => void

__rx_requestRNAs:()=>void
__rx_requestAllLigands:()=>void
}

type MainProps = DispatchProps & OwnProps & ReduxProps;
const Main: React.FC<MainProps> = (prop:MainProps) => {

  useEffect(() => {
    prop.__rx_requestStructures()
    prop.__rx_requestRNAs()
    prop.__rx_requestAllLigands()
  }, [])

  return (
    <div>
      <Dashboard/>
      <Display />
     </div> 
  );
};

const mapstate = (state: AppState, ownprops: OwnProps): ReduxProps => ({
  __rx_structures: state.structures.neo_response,
  loading        : state.structures.Loading,
});

const mapdispatch = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  ownprops: OwnProps
): DispatchProps => ({
  __rx_requestStructures: ()=> dispatch(redux.requestAllStructuresDjango()),
  __rx_requestRNAs      : ()=> dispatch(requestAllRNAs()),
  __rx_requestAllLigands      : ()=> dispatch(requestAllLigands())
});

export default connect(mapstate, mapdispatch)(Main);

// --------------------------------------------

export const truncate = (str:string, charlim:number, truncateto:number) =>{
  if (typeof str === 'undefined'){
    return str
  }
    return str.length > 20 ? str.substring(0, 15) + "..." : str;
}
export const transformToShortTax = (taxname:string) =>{
  if (typeof taxname === 'string'){
    var words = taxname.split(' ') 
    if ( words.length>1 ){
    var fl =words[0].slice(0,1)
    var full = fl.toLocaleUpperCase() + '. ' + words[1]
    return full
    }
    else
    {
      return words[0]
    }
  }
  else return taxname
}