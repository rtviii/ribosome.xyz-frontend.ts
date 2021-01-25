import React, { useEffect, useState } from "react";import "./StructuresCatalogue.css";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { ListSubheader } from "@material-ui/core";
import Slider from '@material-ui/core/Slider';
import { connect  } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AppState } from "../../../redux/store";
// import StructHero from "../StructureHero/StructHero";
import { AppActions } from "../../../redux/AppActions";
import LoadingSpinner  from '../../Other/LoadingSpinner'
import SpeciesFilter from './../../../materialui/SpeciesFilter'
import SelectProteins from './../../../materialui/SelectProteins'
import { Button } from "react-bootstrap";
import {md_files, ReactMarkdownElement } from './../../Other/ReactMarkdownElement'
import { getNeo4jData } from "../../../redux/Actions/getNeo4jData";
import {large_subunit_map} from './../../../static/large-subunit-map'
import {small_subunit_map} from './../../../static/small-subunit-map'
import StructHero from './../../../materialui/StructHero'
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import * as redux from '../../../redux/reducers/Data/StructuresReducer/StructuresReducer'
import { Dispatch } from 'redux';
import {useDebounce} from 'use-debounce'
import {transformToShortTax} from './../../Main'
import { FilterData, FilterType } from "../../../redux/reducers/Data/StructuresReducer/ActionTypes";


// Workspace itself
interface StateProps {
  structures  : redux.NeoStruct[];
  loading     : boolean;
  current_page: number;
  }

interface DispatchProps{
  next_page: ()=>void;
  prev_page: ()=>void;
  goto_page: (pid:number)=>void;
}
type WorkspaceCatalogueProps =  StateProps & DispatchProps;
const WorkspaceCatalogue: React.FC<WorkspaceCatalogueProps> = (prop: WorkspaceCatalogueProps) => {
  useEffect(() => {
  console.log(prop.structures)
    return () => {
    }
  }, [prop.structures])

  return !prop.loading ? (
    <div className="workspace-catalogue-grid">
      <div className="wspace-catalogue-filters-tools">
        <StructureFilters />
      </div>
      <button onClick={()=>{prop.next_page()}}>Nextpage</button>
      <button onClick={()=>{prop.prev_page()}}>Prevpage</button>
      <Grid container item xs={12} spacing={3}>
        {
          prop.structures.slice(prop.current_page * 20, prop.current_page*20+20).map((x, i) => (
          <Grid item>
            <StructHero {...x} key={i} />
          </Grid>))}
      </Grid>
    </div>
  ) : (
    <LoadingSpinner annotation="Fetching data..." />
  );
};
const mapstate = (state: AppState, ownprops: {}): StateProps => ({
  structures  : state.structures.derived_filtered,
  loading     : state.structures.Loading,
  current_page: state.structures.current_page
});
const mapdispatch =(
  dispatch:Dispatch<AppActions>,
  ownProps:any):DispatchProps=>({
    goto_page: (pid)=>dispatch( redux.gotopage(pid)),
    next_page: ()=>dispatch( redux.nextpage()),
    prev_page: ()=>dispatch( redux.prevpage()),
  })

export default connect(mapstate, mapdispatch)(WorkspaceCatalogue);


// Filter -----------------------------------------------------------------------------------------------

interface handleFilterChange {
  handleChange: (newavalue:number|string|number[]|string[]) => void;
}

export const mapStateFilter=(filttype:FilterType)=>(appstate:AppState, ownprops:any):FilterData =>({
  set    :  appstate.structures.filters[filttype].set,
  value  :  appstate.structures.filters[filttype].value
})

export const mapDispatchFilter = (filttype: FilterType)=>(
  dispatch:Dispatch<AppActions>,
  ownProps:any
):handleFilterChange =>({
  handleChange: ( newrange ) => dispatch(redux.filterChange(filttype, newrange))
})

interface OwnFilterProps {
  name               :  string;
  max                :  number;
  min                :  number;
  step               :  number;
}

const _ValueSlider: React.FC<OwnFilterProps & FilterData & handleFilterChange>
 = (prop:OwnFilterProps & FilterData & handleFilterChange) => {
  const useSliderStyles = makeStyles({
    root: {
      width: 300,
    },
  });

  const classes           = useSliderStyles();
  const [value, setValue] = React.useState<number[]>([prop.min, prop.max]);
  const [debounced_val]   = useDebounce(value,500)

  const handleChange = (event: any, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };
  useEffect(() => {
      prop.handleChange(debounced_val)
  }, [debounced_val])

  return (
    <div className={classes.root}>
      <Typography id="range-slider" gutterBottom>
        {prop.name}
      </Typography>

      <Slider
        marks
        min               = {prop.min}
        max               = {prop.max}
        step              = {prop.step}
        value             = {value as any}
        onChange          = {handleChange}
        valueLabelDisplay = "auto"
        aria-labelledby   = "range-slider"
      />
    </div>
  );
};

// Filter -----------------------------------------------------------------------------------------------


const YearSlider       = connect(mapStateFilter("YEAR"),          mapDispatchFilter("YEAR"))(_ValueSlider)
const ProtcountSlider  = connect(mapStateFilter("PROTEIN_COUNT"), mapDispatchFilter("PROTEIN_COUNT"))(_ValueSlider)
const ResolutionSlider = connect(mapStateFilter("RESOLUTION"),    mapDispatchFilter("RESOLUTION"))(_ValueSlider)




// Filters component
const StructureFilters = () => {
  const drawerWidth = 240;
  const useFiltersStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        display: "flex",
        zIndex: -1,
      },
      appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
      drawer: {
        width: drawerWidth,
        flexShrink: 0,
      },
      drawerPaper: {
        width: drawerWidth,
      },
      // necessary for content to be below app bar
      toolbar: theme.mixins.toolbar,
      content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
      },
    })
  );

  const filterClasses = useFiltersStyles();

  return (
    <Drawer
      style={{ zIndex: -20 }}
      className={filterClasses.drawer}
      variant="permanent"
      classes={{
        paper: filterClasses.drawerPaper,
      }}
      anchor="left"
    >
      <div className={filterClasses.toolbar} />
      <List>
        <ListSubheader>Search and Filter</ListSubheader>
      <Divider />
        <ListItem key={"search"}>
          {/* <SearchField  /> */}
        </ListItem>
        <ListItem key={"year"}>
          <YearSlider min={2012} max={2021}  name={"Deposition Date"} step={1}/> 
        </ListItem>
        <ListItem key={"number-of-proteins"}>
          <ProtcountSlider min={25} max={150}  name={"Protein Count"} step={1}/> 
        </ListItem>
        <ListItem key={"resolution"}>
          <ResolutionSlider min={1} max={6}  name={"Resolution(A)"} step={0.1}/> 
        </ListItem>

      <Divider />
        <ListItem key={"select-proteins-typography"}>
          <Typography id="range-slider">Proteins Present</Typography>
        </ListItem>
        <ListItem key={"select-proteins"}>
          <SelectProteins />
        </ListItem>

      </List>

      <Divider />
      <List>
        <ListSubheader> Species</ListSubheader>
        <SpeciesFilter species={['Kluyveromyces Lactis','Escherichia Coli','Homo Sapiens','Tetrahymena Thermophila','Deinococcus Radiodurans'
        
        ]}/>

      </List>
    </Drawer>
  );
};



