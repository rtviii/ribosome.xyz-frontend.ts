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
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { ListSubheader } from '@material-ui/core';

const useStyles = makeStyles({
  list: {
    width: 300,
  },
  fullList: {
    width: 300,
  },
});

type Anchor = 'left' ;

export default function TemporaryDrawer() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    left   : true,
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

  const list = (anchor: Anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'left' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListSubheader>Available Data</ListSubheader>
          <ListItem button key={"Proteins"}>
            <ListItemIcon>{<MailIcon />}</ListItemIcon>
            <ListItemText primary={"Proteins"} />
          </ListItem>
          <ListItem button key={"rRNA"}>
            <ListItemIcon>{<MailIcon />}</ListItemIcon>
            <ListItemText primary={"rRNA"} />
          </ListItem>
          <ListItem button key={"Structures"}>
            <ListItemIcon>{<MailIcon />}</ListItemIcon>
            <ListItemText primary={"Structures"} />
          </ListItem>
          <ListItem button key={"Ligands"}>
            <ListItemIcon>{<MailIcon />}</ListItemIcon>
            <ListItemText primary={"Ligands"} />
          </ListItem>
      </List>
      <Divider />
      <List>
        <ListSubheader>Tools</ListSubheader>
          <ListItem button key={"Binding Interfaces"}>
            <ListItemIcon>{ <MailIcon />}</ListItemIcon>
            <ListItemText primary={"Binding Interfaces"} />
          </ListItem>
          <ListItem button key={"Protein Classification"}>
            <ListItemIcon>{ <MailIcon />}</ListItemIcon>
            <ListItemText primary={"Protein Classification"} />
          </ListItem>
          <ListItem button key={"Protein Alignment"}>
            <ListItemIcon>{ <MailIcon />}</ListItemIcon>
            <ListItemText primary={"Protein Alignment"} />
          </ListItem>
          <ListItem button key={"Exit Tunnel"}>
            <ListItemIcon>{ <MailIcon />}</ListItemIcon>
            <ListItemText primary={"Exit Tunnel"} />
          </ListItem>
      </List>
    </div>
  );

  return (
    <div>
      {
     
        <React.Fragment key={'left'}>
          <Button onClick={toggleDrawer('left', true)}>{'left'}</Button>
          <Drawer anchor={'left'} open={state['left']} onClose={toggleDrawer('left', false)}>
            {list('left')}
          </Drawer>
        </React.Fragment>
      }
    </div>
  );
}
