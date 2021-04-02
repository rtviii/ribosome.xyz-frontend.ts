import React, { useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { ListSubheader, Tooltip } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import gear from './../../static/gear.png'
import enzymes from './../../static/enzymes-icon.png'
import Typography from '@material-ui/core/Typography';
import {toggle_dashboard} from './../../redux/reducers/Interface/ActionTypes'
import { AppState } from '../../redux/store';
import { ThunkDispatch } from 'redux-thunk';
import { AppActions } from '../../redux/AppActions';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  root:{
    zIndex:200
  },
  list: {
    width: 300,
  },
  fullList: {
    width: 300,
  },
});

type Anchor = 'left' ;

type MenuItemData = {
  key     : string
  iconsrc?: string
  linkto  : string
  menutext: string
}


interface DashState{dashboard_hidden:boolean};
interface ToggleDash{toggle_dash:()=>void};
type DashProps = DashState & ToggleDash;


const ms = (state:AppState, ownProps:any): DashState  =>({
   dashboard_hidden: state.Interface.dashboardHidden
})
const md = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  ownprops: any
):ToggleDash  => ({
  toggle_dash: () =>dispatch(toggle_dashboard())
});

const _MenuItem:React.FC<{toggle_dash:()=>void; tooltip:boolean} & MenuItemData> = (props)=>{
  const history = useHistory();
  return (
    <ListItem button key={props.key}  onClick={()=>{
      
      props.toggle_dash()
      history.push(props.linkto)}}>

      <ListItemIcon>
        {<img src={enzymes} style={{ height: "20px", width: "20px" }} />}
      </ListItemIcon>

        <ListItemText primary={props.menutext} />

    </ListItem>)}

const _DashboardButton: React.FC<DashProps> = (props) => {
  return <Grid 
  onClick={() => props.toggle_dash()} container xs={12} 
  style={{cursor:"pointer"}}
  justify="flex-start" 
  alignContent='center'
  // alignItems='center'
  direction='row' >
    <Grid item xs={4} > 
      <img style={{maxWidth:"100%",maxHeight:"100%"}} src={gear}/>
    </Grid>
  </Grid>
}
const _TemporaryDrawer: React.FC<DashProps> = (props) => {

  const classes = useStyles();

  useEffect(() => {
      console.log("got dahsborad change", props.dashboard_hidden)
  }, [props.dashboard_hidden])

  const current_path = useHistory().location.pathname;


  const list = (anchor: Anchor) => (
    <div
      className={clsx(classes.list, {[classes.fullList]: anchor === 'left' || anchor === 'top',})}
      role="presentation">

        <MenuItem key='new' menutext="Home" linkto='/home'/>

      <List>
        <ListSubheader>Available Data</ListSubheader>
        <MenuItem key='new' menutext="Structures" linkto='/structs'/>
        <MenuItem key='new' menutext="Proteins" linkto='/rps'/>
        <MenuItem key='new' menutext="rRNA" linkto='/rnas'/>
        <MenuItem key='new' menutext="Ligands" linkto='/ligands'/>
      </List>
      <Divider />
      <List>
        <ListSubheader>Tools</ListSubheader>
        <MenuItem key='new1' menutext="Binding Sites" linkto='/bindingsites'/>
        <MenuItem key='new1' menutext="Protein Classification" linkto='/rpclassification'/>
        <MenuItem key='new1' menutext="Protein Alignment" linkto='/rpalign'/>
        <MenuItem key='new1' menutext="Exit Tunnel" linkto='/tunnel'/>
      </List>
    </div>
  );

 return( 
      <React.Fragment key={"left"}>
        <Drawer
          anchor={"left"}
          open={props.dashboard_hidden}
          onClose={()=>props.toggle_dash()}>
          {list("left")}
        </Drawer>
      </React.Fragment>
)
}

const MenuItem = connect(null, md)(_MenuItem)
export const DashboardButton = connect(ms,md)(_DashboardButton)
export const TemporaryDrawer  = connect(ms,md)(_TemporaryDrawer)