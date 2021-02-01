import React, { useEffect, useState  } from "react";
import "./RPPage.css";
import { useParams, Link } from "react-router-dom";
import { flattenDeep } from "lodash";
import { RibosomalProtein } from "../../../redux/RibosomeTypes";
import RibosomalProteinHero from "./RibosomalProteinHero";
import { getNeo4jData } from "../../../redux/AsyncActions/getNeo4jData";
import { truncate } from "../../Main";
import { AppState } from "../../../redux/store";
import { Dispatch } from "redux";
import { AppActions } from "../../../redux/AppActions";
import { gotopage, requestBanClass } from "../../../redux/reducers/Proteins/ActionTypes";
import { ThunkDispatch } from "redux-thunk";
import { connect } from "react-redux";
import { createStyles, makeStyles } from "@material-ui/core";
import Pagination from './../Display/Pagination'






interface NeoHomolog {
  parent : string;
  orgname: string[]
  orgid  : number[]
  protein: RibosomalProtein;
  title  : string
}


interface ReduxProps{
  current_rps: NeoHomolog[]
  pagestotal       :  number
  currentpage      :  number
}

interface DispatchProps{
  requestBanClass  :  (banClassString:string)=> void
//  pagination
  goto_page        :  (pid:number)=>void;
}

type  RPPageProps = ReduxProps &  DispatchProps

const RPPage:React.FC<RPPageProps> = (prop) => {

  var params: any = useParams();
  useEffect(() => {
    prop.requestBanClass(params.nom)
  }, [])


  return params!.nom ? (
      <div className="rp-page">
        <h1>Ribosomal Proteins</h1>
        <h1>{params.nom}</h1>
          {prop.current_rps.map((e: NeoHomolog) => {
            return (
              <div className="homolog-hero" style={{ display: "flex" }}>
                <RibosomalProteinHero data={e.protein} pdbid={e.parent} />{" "}
                <div className="homolog-struct">
                  <div id='homolog-struct-title'>
                    <Link
                      style={{ width: "min-content" }}
                      to={`/structs/${e.parent}`}
                    >
                      <h4>{e.parent}</h4>
                    </Link>{" "}
                    <p> {e.title}</p>
                  </div>
                  {
                    e.orgname.map(
                      ( org,i ) =>
                  <span id='homolog-tax-span'>{truncate( e.orgname[i], 40,40 )}( ID: {e.orgid[i]} )</span>
                    )
                  }
                  
                </div>
              </div>
            );
          })}

      </div>
  ) : (
    <div>"Fetching..."</div>
  );
};



const mapstate = (
  appstate:AppState,
  ownProps:any
):ReduxProps =>( {
  current_rps  :  appstate.proteins.current_ban_class,
  pagestotal   :  appstate.proteins.pages_total,
  currentpage  :  appstate.proteins.current_page
})

const mapdispatch = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  ownProps:any):DispatchProps =>({
    requestBanClass  :  (banclass)=>dispatch(requestBanClass(banclass)),
    goto_page: (pid)=>dispatch(gotopage(pid))
  })

export default connect(mapstate,mapdispatch)( RPPage );

