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
import {WarningPopover} from './../WorkInProgressChip'
import { AppState } from '../../../redux/store';
import { NeoStruct } from '../../../redux/reducers/Data/StructuresReducer/StructuresReducer';
import { connect } from 'react-redux';
import { truncate } from '../../Main';




interface prot {noms: string[], surface_ratio:number|null, strands:string}
const ProteinSortingFunctions =  {
  bySelectedUid: (uid:string)=>(rp1:prot,rp2:prot) => {
    if (uid===""){
      return 0
    }
    if (rp1.noms[0] === uid && rp2.noms[0] !== uid) { return -1 }
    if (rp1.noms[0] !== uid && rp2.noms[0] === uid) { return 1 }
    else {return 0}
  }

}

// const surface_structs  = ['3J7Z',"3J9M","3J79","5JVG","5NRG","5X8T","5XY3"]

const RPClassificationStructAvatar=({r,proteinSelected, protNameFilter}:{r:NeoStruct,protNameFilter:string,  proteinSelected:(uid:string)=>void}) =>{

const useClassificationAvatarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      outline:"1px solid gray",
      fontSize:20,
      borderRadius: "5px",
      width:300,
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
    subheaderTitle:{
      zIndex:400
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
      zIndex:400,
      fontSize:20,
      fontWeight:"bold",
      borderBottom:"1px solid black"
    }
  }),
);
  const classes                   = useClassificationAvatarStyles();
  const [lsuOpen, setlsuOpen]     = React.useState(true);
  const [ssuOpen, setssuOpen]     = React.useState(false);
  const [otherOpen, setotherOpen] = React.useState(false);
  const history                   = useHistory();

  const handleClick = (sub:'lsu'|'ssu'|'other') => {
    switch(sub){
      case 'lsu':
        setlsuOpen(!lsuOpen)
      case 'ssu':
        setssuOpen(!ssuOpen)
      case 'other':
        setotherOpen(!otherOpen)
      default:
    }
  };

  const ProteinRow = ({measure,strand, proteinSelected}:
    {measure:number, strand:string, proteinSelected: (uid:string)=>void}) =>{
    return (
          <ListItem className={classes.listItem}>
            <Grid container direction='row' justify='space-between'>
            <ListItemText  onClick={()=>{
              proteinSelected(strand)
              }} disableTypography children={<Typography className={classes.protein}>{strand}</Typography>} />
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
        <ListSubheader
        
      onClick={()=>{
        setlsuOpen(false)
        setssuOpen(false)
        setotherOpen(false)
      }}
        className={classes.structSubheader} >
          <Grid direction="row">            
         { r.struct.rcsb_id } {"                 "}
              <Typography className={classes.subheaderTitle} variant="caption"
              

              >{truncate( r.struct._organismName[0],40,30 )}</Typography>
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
          {r.rps.sort(ProteinSortingFunctions.bySelectedUid(protNameFilter)).filter(r =>(r.noms.length>0&& r.noms[0].toLocaleLowerCase().includes("l") )).map(r => (
            <ProteinRow {...{ proteinSelected:proteinSelected,measure: r.surface_ratio as number, strand: r.noms[0] ? r.noms[0] : r.strands }} />
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
          {r.rps.sort(ProteinSortingFunctions.bySelectedUid(protNameFilter)).filter(r =>( r.noms.length >0  && r.noms[0].toLocaleLowerCase().includes("s") )).map(r => (
            <ProteinRow {...{ proteinSelected:proteinSelected,measure: r.surface_ratio as number, strand: r.noms[0] ? r.noms[0] : r.strands }} />
          ))}
        </List>
      </Collapse>

      <ListItem
        button
        onClick={() => {handleClick("other")}}
      >
        <ListItemText secondary="Other" />
        {otherOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse in={otherOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {r.rps.sort(ProteinSortingFunctions.bySelectedUid(protNameFilter)).filter(r =>!( r.noms.length > 0 )).map(r => (
            <ProteinRow {...{proteinSelected:proteinSelected, measure: r.surface_ratio as number, strand: r.noms[0] ? r.noms[0] : r.strands }} />
          ))}
        </List>
      </Collapse>
    </List>
  );
}
interface ReduxProps{
  filteredStructs: NeoStruct[]
}
const _ProteinCategories:React.FC<ReduxProps> =(prop) =>{

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
          {children}
        </Box>
      )}
    </div>
  );
}

const useProteinCategoriesStyles = makeStyles((theme: Theme) => ({
  root: {
    outline:"1px solid black",
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

useEffect(() => {
  getNeo4jData("neo4j", {
    endpoint: "TEMP_classification_sample",
    params: null
  }).then(l => {
    setStructs(l.data)
    setFilteredLocalStructs(l.data)
  });
}, [])

useEffect(() => {


  const predicate      = (filteredids:string[])=>(r:NeoStruct) => filteredids.includes(r.struct.rcsb_id)
  const globalFiltered = prop.filteredStructs.map(r=>r.struct.rcsb_id)
  var   localFiltered  = structs.filter(predicate(globalFiltered))
  setFilteredLocalStructs(localFiltered)

  
}, [prop.filteredStructs])

  const [structs, setStructs]                           = useState<NeoStruct[]>([])
  const [filteredLocalstructs, setFilteredLocalStructs] = useState<NeoStruct[]>([])
  const [protNameFilter, setpProtNameFilter] = useState<string>("")

  const proteinSelected = (uid:string) =>{

    
    setpProtNameFilter(uid)
  }
  return (
    <div className={classes.root}>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Penetration Ratios" {...a11yProps(0)} />
        <Tab label="Exit Tunnel Contact" {...a11yProps(1)} />
        <Tab label="PTC Distance" {...a11yProps(2)} />
        <Tab label="Intersubunit Region" {...a11yProps(3)} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <Grid container spacing={3} xs={12}>
          {filteredLocalstructs.map(r => (
            <Grid item>
              <RPClassificationStructAvatar {...{ r, proteinSelected, protNameFilter }}/>
             </Grid>
          ))}
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <WarningPopover content="This feature is under construction" />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <WarningPopover content="This feature is under construction" />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <WarningPopover content="This feature is under construction" />
      </TabPanel>
    </div>
  );
}
const mapstate= (appstate:AppState, ownstate:any):ReduxProps =>({
  filteredStructs:appstate.structures.derived_filtered
})
const ProteinCategories = connect(mapstate, null)(_ProteinCategories);


const RPClassification = () => {
  


  const style = makeStyles({
    root:{
    }
  })()
  return (
    <Grid item container className={style.root} xs={12}>
      <Grid item container>
      </Grid>

      <Grid item container xs={12} direction="row">
          <Grid item container direction="column" xs={3}>
            <List>
              <ListItem>
                <Typography variant="overline">Structure Control</Typography>
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


              <Divider/>
              <ListItem>
                <Typography variant="overline">Protein Control</Typography>
              </ListItem>


            </List>
          </Grid>
          <Grid item xs={9}><ProteinCategories/></Grid>
          <Grid item xs={9}></Grid>
          </Grid>
    </Grid>
  );
};

export default RPClassification
