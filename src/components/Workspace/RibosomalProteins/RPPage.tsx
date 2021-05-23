import React, { useEffect, useState  } from "react";
import "./RPPage.css";
import { useParams } from "react-router-dom";
import { AppState } from "../../../redux/store";
import { AppActions } from "../../../redux/AppActions";
import { gotopage, nextpage, prevpage, requestBanClass } from "../../../redux/reducers/Proteins/ActionTypes";
import { ThunkDispatch } from "redux-thunk";
import { connect, useSelector } from "react-redux";
import Pagination from './../Display/Pagination'
import Grid from "@material-ui/core/Grid";
import { _SpecList, _SearchField  } from "../Display/StructuresCatalogue";
import {  mapDispatchFilter, mapStateFilter, handleFilterChange } from "../../../redux/reducers/Filters/FiltersReducer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import RibosomalProteinCard from './RibosomalProteinCard'
import Typography from "@material-ui/core/Typography";
import { DashboardButton } from "../../../materialui/Dashboard/Dashboard";
import Cart from "./../../Workspace/Cart/Cart";
import { makeStyles } from '@material-ui/core/styles';
import { RibosomalProtein } from "../../../redux/RibosomeTypes";
import Backdrop from "@material-ui/core/Backdrop";
import CSVDownloadElement from "../Cart/CSVDownloadElement";

interface ReduxProps{
  current_rps      : RibosomalProtein[]
  pagestotal       :  number
  currentpage      :  number
}

interface DispatchProps{
  requestBanClass  :  (banClassString:string)=> void
  goto_page        :  (pid:number)=>void;
  next_page        :  ()=>void;
  prev_page        :  ()=>void;
}

type  RPPageProps = ReduxProps &  DispatchProps
const RPPage:React.FC<RPPageProps> = (prop) => {

  var params: any = useParams();
  var nameparam = params.nom
  var className = nameparam.slice(0,1).toLowerCase() + nameparam.slice(1,2).toUpperCase() + nameparam.slice(2)

    useEffect(() => {
    console.log(className);
    prop.requestBanClass(className)
  }, [])

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));


    const proteins = useSelector((state: AppState) => state.proteins.ban_class_derived)
    var bulkDownloads = [["rcsb_id", "strand", "nomenclature", "sequence"]]
    proteins.map(prot => bulkDownloads.push([prot.parent_rcsb_id, prot.entity_poly_strand_id, prot.nomenclature[0] || "Unspecified", prot.entity_poly_seq_one_letter_code]))

  return params!.nom ? (
    <Grid xs={12} container>
      <Grid item container xs={12} >
        <Typography variant="h3" style={{ padding: "20px" }}>
          Ribosomal Protein Class {className}
        </Typography>
      </Grid>

      <Grid item container xs={12} spacing={2}>

        <Grid item container xs={2} direction="column">
          <List>

            <ListItem>
              {/* <SearchField /> */}
            </ListItem>
            <ListItem>
              <SpeciesList />
            </ListItem>
            <ListItem>
              <Pagination
                {...{ gotopage: prop.goto_page, pagecount: prop.pagestotal }}
              />
            </ListItem>
            <ListItem>
            <Cart/>
            </ListItem>
            <ListItem>
            <CSVDownloadElement prop={"proteins"}/>
            </ListItem>
            <ListItem>
            <DashboardButton/>
            </ListItem>
          </List>
        </Grid>

        <Grid item container direction="row" spacing={1} xs={10} alignContent="flex-start" alignItems="flex-start">

           
          <Grid item xs={12}>  
          </Grid>
          
          {prop.current_rps
            .slice((prop.currentpage - 1) * 20, prop.currentpage * 20)
            .map((protein: RibosomalProtein) => {
              return (
                <Grid item xs={12}>
                  <RibosomalProteinCard protein={ protein }  />
                </Grid>
              );
            })}
        </Grid>
      </Grid>
    </Grid>
  ) : (
    <Backdrop open={true}/>
  );
};

// export const SearchField       =  connect(mapStateFilter("SEARCH"),       mapDispatchFilter("SEARCH"))(_SearchField)
export const SpeciesList       =  connect(mapStateFilter("SPECIES"),      mapDispatchFilter("SPECIES"))(_SpecList)

const mapstate = (
  appstate:AppState,
  ownProps:any
):ReduxProps =>( {
  current_rps  :  appstate.proteins.ban_class_derived,
  pagestotal   :  appstate.proteins.pages_total,
  currentpage  :  appstate.proteins.current_page
})

const mapdispatch = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  ownProps:any):DispatchProps =>({
    requestBanClass: (banclass)=>dispatch(requestBanClass(banclass, false)),
    goto_page      : (pid)=>dispatch(gotopage(pid)),
    next_page      : ()=>dispatch(nextpage()),
    prev_page      : ()=>dispatch(prevpage()),
    
  })

export default connect(mapstate,mapdispatch)( RPPage );

