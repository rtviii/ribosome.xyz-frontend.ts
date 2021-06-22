import React, {  createContext, useEffect } from "react";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../redux/AppActions";
import { AppState } from "../redux/store";
import "./Main.css";
import Display from "./Workspace/Display/Display";
import * as redux from '../redux/reducers/StructuresReducer/StructuresReducer'
import { connect, useDispatch } from "react-redux";
import { TemporaryDrawer } from './../materialui/Dashboard/Dashboard'

import { requestAllLigands } from "../redux/reducers/Ligands/ActionTypes";
import { requestStaticCatalogue } from "../redux/reducers/Utilities/UtilitiesReducer";
import { requestBanMetadata } from "../redux/reducers/Proteins/ActionTypes";
import { requestRnaClass } from "../redux/reducers/RNA/ActionTypes";
import { RnaClass } from "../redux/reducers/RNA/RNAReducer";
import { request_all_bsites} from './../redux/reducers/BindingSites/ActionTypes'


interface OwnProps {}
interface ReduxProps {}
interface DispatchProps {

  __rx_requestStructures : ()=>void
  __rx_requestAllLigands : ()=>void
  __rx_staticCatalogue   : ()=>void

}

type MainProps = DispatchProps & OwnProps & ReduxProps;
const Main: React.FC<MainProps> = (prop:MainProps) => {

    const dispatch    =  useDispatch()
    useEffect(() => {
    prop.__rx_requestStructures()
    prop.__rx_requestAllLigands()
    prop.__rx_staticCatalogue()

    dispatch(requestBanMetadata('b','LSU'))
    dispatch(requestBanMetadata('e','LSU'))
    dispatch(requestBanMetadata('u','LSU'))


    dispatch(requestBanMetadata('b','SSU'))
    dispatch(requestBanMetadata('e','SSU'))
    dispatch(requestBanMetadata('u','SSU'))
    dispatch(request_all_bsites())


    for (var k of ["mrna" , "trna"  , "5.8" , "12" , "16", "21", "23" , "25" ,"28" ,"35" , 'other', "5"]){
    dispatch(requestRnaClass(k as RnaClass))
    }
  }, [])

  return (
    <div>
      <TemporaryDrawer/>
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
  // __rx_requestRNAs      : ()=> dispatch(requestAllRNAs()),
  __rx_requestAllLigands: ()=> dispatch(requestAllLigands()),
  __rx_staticCatalogue  : ()=> dispatch(requestStaticCatalogue()),
});

export default connect(mapstate, mapdispatch)(Main);
export const truncate = (str:string, charlim:number, truncateto:number) =>{
  if (typeof str === 'undefined'){
    return str
  }
    return str.length > charlim ? str.substring(0, truncateto) + "..." : str;
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