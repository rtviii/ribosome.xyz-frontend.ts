import React, { useEffect, useState  } from "react";
import "./RPPage.css";
import { useParams } from "react-router-dom";
import { AppState } from "../../../redux/store";
import { AppActions } from "../../../redux/AppActions";
import { gotopage, nextpage, prevpage, requestBanClass } from "../../../redux/reducers/Proteins/ActionTypes";
import { ThunkDispatch } from "redux-thunk";
import { connect } from "react-redux";
import Pagination from './../Display/Pagination'
import Grid from "@material-ui/core/Grid";
import { _SpecList, _SearchField  } from "../Display/StructuresCatalogue";
import { FiltersReducerState, mapDispatchFilter, mapStateFilter, handleFilterChange } from "../../../redux/reducers/Filters/FiltersReducer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { Divider } from "@material-ui/core";
import { ListSubheader } from "@material-ui/core";
import { NeoHomolog } from "../../../redux/DataInterfaces";
import RibosomalProteinCard from './RibosomalProteinCard'
import Typography from "@material-ui/core/Typography";
import { DashboardButton } from "../../../materialui/Dashboard/Dashboard";
import Cart from "./../../Workspace/Cart/Cart";
import Paper from "@material-ui/core/Paper/Paper";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

interface ReduxProps{
  current_rps: NeoHomolog[]
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
const classes = useStyles();

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
              <SearchField />
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
            <DashboardButton/>
            </ListItem>
          </List>
        </Grid>

        <Grid item container direction="row" spacing={1} xs={10} alignContent="flex-start" alignItems="flex-start">

           
          <Grid item xs={12}>  
          {/* <Paper variant="elevation" elevation={3} style={{
            padding:"20px"
          }}>
            tools


          </Paper> */}

{/* <AppBar position="static">
  <Toolbar>
    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
      <MenuIcon />
    </IconButton>
    <Typography variant="h6" className={classes.title}>
      
    </Typography>
    <Button color="inherit">Login</Button>
  </Toolbar>
</AppBar> */}

          
          </Grid>
          
          {prop.current_rps
            .slice((prop.currentpage - 1) * 20, prop.currentpage * 20)
            .map((protein: NeoHomolog) => {
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
    <div>"Fetching..."</div>
  );
};

export const SearchField       =  connect(mapStateFilter("SEARCH"),       mapDispatchFilter("SEARCH"))(_SearchField)
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
    requestBanClass: (banclass)=>dispatch(requestBanClass(banclass)),
    goto_page      : (pid)=>dispatch(gotopage(pid)),
    next_page      : ()=>dispatch(nextpage()),
    prev_page      : ()=>dispatch(prevpage()),
    
  })

export default connect(mapstate,mapdispatch)( RPPage );

