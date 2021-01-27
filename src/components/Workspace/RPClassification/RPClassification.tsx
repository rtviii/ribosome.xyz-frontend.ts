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
import { AppBar, Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core'
import { useHistory } from 'react-router-dom';
import {SearchField, YearSlider, ProtcountSlider, SpeciesList, ResolutionSlider}  from './../../Workspace/Display/StructuresCatalogue'
import { Divider } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';


const surface_structs  = ['3J7Z',"3J9M","3J79","5JVG","5NRG","5X8T","5XY3"]

const ProteinCategories=() =>{

interface TabPanelProps {
  children?: React.ReactNode;
  index    : any;
  value    : any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const useProteinCategoriesStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "white",
  },
}));
  const classes = useProteinCategoriesStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

  return (
    <div className={classes.root}>

        <Tabs value={value} onChange={handleChange} >
          <Tab label="Penetration Ratios" {...a11yProps(0)} />
          <Tab label="Exit Tunnel Distance" {...a11yProps(1)} />
          <Tab label="PTC Distance" {...a11yProps(2)} />
        </Tabs>

      <TabPanel value={value} index={0}>
      </TabPanel>
      <TabPanel value={value} index={1}>

      </TabPanel>
      <TabPanel value={value} index={2}>
      </TabPanel>
    </div>
  );
}

const RPClassificationStructAvatar=() =>{

const useClassificationAvatarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      outline:"1px solid gray",
      width: '100%',
      fontSize:20,
      borderRadius: "5px",
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
    structSubheader:{
      fontSize:20,
      fontWeight:"bold",
      borderBottom:"1px solid black"
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
        <ListSubheader className={classes.structSubheader}>
          <Grid direction="row">            
         3J9M {"                 "}
            {/* <Grid item> */}
              <Typography variant="caption">Species</Typography>
            {/* </Grid> */}
            {/* <Grid item> */}
              {/* <Typography variant="caption">Assembly Phase</Typography> */}
            {/* </Grid> */}
          </Grid>
        </ListSubheader>
      }
    >
      <ListItem
        className={classes.root}
        button
        onClick={() => {
          handleClick("lsu");
        }}
      >
        <ListItemText secondary="LSU" />
        {lsuOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse in={lsuOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map(r => (
            <ProteinRow {...{ measure: r, strand: "uL4" }} />
          ))}
        </List>
      </Collapse>

      <ListItem
        button
        onClick={() => {
          handleClick("ssu");
        }}
      >
        <ListItemText secondary="SSU" />
        {ssuOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse in={ssuOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map(r => (
            <ListItem className={classes.listItem}>
              <Grid container direction="row" justify="space-between">
                <ListItemText
                  disableTypography
                  children={
                    <Typography className={classes.protein}>uL4</Typography>
                  }
                />
                <div
                  style={{
                    zIndex: 20,
                    minWidth: `${r * 60}%`,
                    alignSelf: "center",
                    minHeight: "8px",
                    height: "8px",
                    backgroundColor: "rgba(243,221,74,0.45)",
                  }}
                />
              </Grid>
            </ListItem>
          ))}
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
      // background:"black"
    }
  })()
  return (
    <Grid item container className={style.root} xs={12}>
      <Grid item container>
        -"in constructon" chip -explanation
      </Grid>

      <Grid item container xs={12}>
        <Grid item container xs={12} justify="flex-end">
          <Grid item xs={3}></Grid>
          <Grid item xs={9}><ProteinCategories/></Grid>
        </Grid>
        <Grid item container xs={12} justify="flex-end">
          <Grid item container direction="column" xs={3}>
            <List>
              <ListItem>
                <Typography variant="h5">Structure Filters</Typography>
              </ListItem>
              <Divider/>
              <ListItem>
                <SearchField />
              </ListItem>
              <ListItem>
                <ProtcountSlider min={25} max={150}  name={"Protein Count"} step={1}/>
              </ListItem>
              <ListItem>
                <ResolutionSlider min={1} max={6}  name={"Resolution(A)"} step={0.1}/>
              </ListItem>
              <ListItem>
                <YearSlider min={2012} max={2021}  name={"Deposition Date"} step={1}/>
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={9}>
            <RPClassificationStructAvatar />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default RPClassification
