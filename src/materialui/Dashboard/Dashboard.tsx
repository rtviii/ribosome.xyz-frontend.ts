import React from 'react';
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
const MenuItem = (d:MenuItemData, tooltip:boolean
)=>{
  const history = useHistory();


  return (
    <ListItem button key={d.key}  onClick={()=>{history.push(d.linkto)}}>

      <ListItemIcon>
        {<img src={enzymes} style={{ height: "20px", width: "20px" }} />}
      </ListItemIcon>

        <ListItemText primary={d.menutext} />

    </ListItem>)
}

export default function TemporaryDrawer() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    left   : false,
  });

  const toggleDrawer = (anchor: Anchor, open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event.type === 'keydown' &&((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const current_path = useHistory().location.pathname;

  
  const list = (anchor: Anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'left' || anchor === 'top',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
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

  return current_path ==="/home" ? 
    <div style={{ position: "fixed", left: "20px", bottom: "20px", zIndex: 4000 }}>
      <React.Fragment key={"left"}>

       {!state.left ? 
       <Button onClick={toggleDrawer("left", true)} className={classes.root}>
          <img
            src={gear}
            style={{ width: "100px", opacity:"0.5", height: "100px" }}
            className={classes.root}
          />

        <Typography variant="overline"  style={{fontSize:"1.2rem"}}>
      Data & Tools
        </Typography>

        </Button> 
        
        : <></>} 
        <Drawer
          anchor={"left"}
          open={state["left"]}
          onClose={toggleDrawer("left", false)}
        >
          {list("left")}
        </Drawer>
      </React.Fragment>
  </div>  

  :
    <div
      style={{ position: "fixed", left: "20px", bottom: "20px", zIndex: 4000 }}
    >
      <React.Fragment key={"left"}>
       {!state.left ? <Button onClick={toggleDrawer("left", true)} className={classes.root}>
          <img
            src={gear}
            style={{ width: "100px", opacity:"0.5", height: "100px" }}
            className={classes.root}
          />
        </Button> : <></>} 
        <Drawer
          anchor={"left"}
          open={state["left"]}
          onClose={toggleDrawer("left", false)}
        >
          {list("left")}
        </Drawer>
      </React.Fragment>
  </div>  
}
