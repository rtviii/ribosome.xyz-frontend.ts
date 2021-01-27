import React from 'react';
import {getNeo4jData} from './../../../redux/Actions/getNeo4jData'
import {RibosomeStructure} from './../../../redux/RibosomeTypes'
import  { useEffect, useState } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import { Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core'
import { useHistory } from 'react-router-dom';

const surface_structs  = ['3J7Z',"3J9M","3J79","5JVG","5NRG","5X8T","5XY3"]
const RPClassificationStructAvatar=() =>{

const useClassificationAvatarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      fontSize:20,
      borderRadius: "5px",
      // fontSize:"20px",
      maxWidth: 300,
      "> element":{
        fontSize:8
      },
      overflowY:"auto",
      overflow:"hidden",
      maxHeight:"300px",
      backgroundColor: theme.palette.background.paper,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
    listsubheader:{
      fontsize:40
    },
    listItem:{
      paddingTop:"10px",
      paddingBottom:"10px",
      maxHeight:"10px",
      fontSize:"8px",
      "&:hover":{
        backgroundColor:"gray"
      },

      display:"flex",
      alignContent:"center",
      alignItems:"center"
    },
    protein:{
      fontSize:12,
      padding:0,
      zIndex:50,
      "&:hover":{
        cursor:"pointer",
      },
    },
    struct:{
    }
  }),
);
  const classes = useClassificationAvatarStyles();
  const [lsuOpen, setlsuOpen] = React.useState(true);
  const [ssuOpen, setssuOpen] = React.useState(true);
  const history= useHistory();

  const handleClick = (sub:'lsu'|'ssu') => {
    sub === 'lsu' ? setlsuOpen(!lsuOpen) : setssuOpen(!ssuOpen);
  };


  const ProteinRow = ({measure,strand}:{measure:number, strand:string}) =>{

    return (
          <ListItem className={classes.listItem}>
            <Grid container direction='row' justify='space-between'>
            <ListItemText  onClick={()=>{history.push(`/rps/${strand}`)}} disableTypography children={<Typography className={classes.protein}>{strand}</Typography>} />
            <div style={{zIndex:20, minWidth:`${measure*60}%`, alignSelf:"center",minHeight:"8px", height:"8px", backgroundColor:"rgba(243,221,74,0.45)"}} /> 

            </Grid>
          </ListItem>

    )
  }

  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      className={classes.root}
      subheader={
        <ListSubheader className={classes.root}>3J9M</ListSubheader>
      }
    >
      <ListItem className={classes.root} button onClick={()=>{ handleClick('lsu') }}>
        <ListItemText secondary="LSU" />
        {lsuOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse in={lsuOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>

{[0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9].map(r=>
  
  <ProteinRow {...{measure:r, strand:"uL4"}}/>


  )}

        </List>
      </Collapse>




      <ListItem button onClick={()=>{ handleClick('ssu') }}>
        <ListItemText secondary="SSU" />
        {ssuOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse in={ssuOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>

{[0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9].map(r=>
  

          <ListItem className={classes.listItem}>
            <Grid container direction='row' justify='space-between'>
            <ListItemText  disableTypography children={<Typography className={classes.protein}>uL4</Typography>} />
            <div style={{zIndex:20, minWidth:`${r*60}%`, alignSelf:"center",minHeight:"8px", height:"8px", backgroundColor:"rgba(243,221,74,0.45)"}} /> 

            </Grid>
          </ListItem>
  )}
        </List>
      </Collapse>
    </List>
  );
}

const RPClassification = () => {

  getNeo4jData("neo4j", {
    endpoint: "TEMP_classification_sample",
    params: null
  }).then(l => console.log(l.data));

  const [structs, setStructs] = useState<RibosomeStructure[]>([])
  const style = makeStyles({
    root:{
      backgroundColor:"gray",
      // background:"black"
    }
  })()
  return (
   <Grid item container className={style.root} xs={12}>
     <Grid item container >
    -"in constructon" chip
    -explanation
     </Grid>

     <Grid item container xs={12} >

{/* [ ]                       |struct filters row */}
<Grid item container xs={12} justify="flex-end" >
  <Grid item xs={8}> ffiltersfiltersfiltersfiltersfiltersfiltersilters</Grid>
</Grid>
{/* protein filters,categories|struct cards*/}
<Grid item container xs={12} justify="flex-end" >
  <Grid item xs={4}> filters</Grid>
  <Grid item xs={8}>

<RPClassificationStructAvatar/>


  </Grid>
</Grid>
     </Grid>



   </Grid> 
  );
};

export default RPClassification
