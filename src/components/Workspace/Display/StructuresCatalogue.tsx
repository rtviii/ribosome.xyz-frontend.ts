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
import { SliderFilterType } from "../../../redux/reducers/Data/StructuresReducer/ActionTypes";
import { FilterData, FilterType } from "../../../redux/reducers/Data/StructuresReducer/StructuresReducer";


interface filterchangeProp {handleChange: (newval:string)=>void;}

export const mapdispatch = (
  dispatch: Dispatch<AppActions>,
  ownprops: {}
): filterchangeProp => ({
  handleChange: (inputval: string) => dispatch(redux.filterOnPdbid(inputval)),
});


// Search
const _SearchField:React.FC<filterchangeProp> = (prop:filterchangeProp)=> {
  const [name, setName] = React.useState("");
  const [value] = useDebounce(name, 500)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    var newval = event.target.value
    setName(newval);
  };

  useEffect(() => {
    prop.handleChange(value)
  }, [value])

  return (
    <form  noValidate autoComplete="off">
      <FormControl>
        <InputLabel htmlFor="component-simple">Search</InputLabel>
        <Input id="component-simple" value={name} onChange={handleChange} />
      </FormControl>
    </form>
  );
}
const SearchField = connect(null, mapdispatch)(_SearchField);


interface ReduxProps {structures  : redux.NeoStruct[];globalFilter: string;loading     : boolean;}
type WorkspaceCatalogueProps =  ReduxProps;
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
      {/* <Grid container item xs={12} spacing={3}>
        {prop.structures.map((x, i) => (
          <Grid item>
            <StructHero {...x} key={i} />
          </Grid>))}
      </Grid> */}
    </div>
  ) : (
    <LoadingSpinner annotation="Fetching data..." />
  );
};
const mapstate = (state: AppState, ownprops: {}): ReduxProps => ({
  structures: state.Data.RibosomeStructures.derived_filtered,
  loading        : state.Data.RibosomeStructures.Loading,
  globalFilter   : state.UI.state_Filter.filterValue,
});
export default connect(mapstate, null)(WorkspaceCatalogue);



interface handleFilterChange {
  handleChange: (newavalue:number|string|number[]|string[]) => void;
}


export const mapStateFilter=(filttype:FilterType)=>(appstate:AppState, ownprops:any):FilterData =>({
  set    :  appstate.Data.RibosomeStructures.filters[filttype].set,
  value  :  appstate.Data.RibosomeStructures.filters[filttype].value
})

export const mapDispatchFilter = (filttype: FilterType)=>(
  dispatch:Dispatch<AppActions>,
  ownProps:any
):handleFilterChange =>({
  handleChange: ( newrange ) => dispatch(redux.filterChange(filttype, newvalue))
})

// export const mapRangeFilter =(filttype:FilterType) => (
//   dispatch:Dispatch<AppActions>,
//   ownProps:any,
// ):rangeFilterChange=>({
//    handleSliderChange:(newrange)=>dispatch(redux.filterOnRangeChange(filttype, newrange))
// })

interface OwnProps {
  name               :  string;
  max                :  number;
  min                :  number;
  step               :  number;
}
type SliderProps = rangeFilterChange & OwnProps;
const _ValueSlider:React.FC<SliderProps> = (prop:SliderProps) => {
  const useSliderStyles = makeStyles({
    root: {
      width: 300,
    },
  });
  const classes = useSliderStyles();
  const [value, setValue] = React.useState<number[]>([prop.min, prop.max]);
  const [debounced_val] = useDebounce(value,500)

  const handleChange = (event: any, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };

    useEffect(() => {
    prop.handleSliderChange(debounced_val as number[])
  }, [debounced_val])

  return (
    <div className={classes.root}>
      <Typography id="range-slider" gutterBottom>
        {prop.name}
      </Typography>

      <Slider
        min={prop.min}
        max={prop.max}
        marks
        step={prop.step}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
      />
    </div>
  );
};



const YearSlider        =  connect(null,mapRangeFilter("YEAR"))(_ValueSlider)
const ProtcountSlider   =  connect(null,mapRangeFilter("PROTEIN_COUNT"))(_ValueSlider)
const ResolutionSlider  =  connect(null,mapRangeFilter("RESOLUTION"))(_ValueSlider)




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
          <SearchField  />
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



