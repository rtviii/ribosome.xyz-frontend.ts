import React, { useEffect, useState } from "react";import "./StructuresCatalogue.css";
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import {large_subunit_map} from './../../../static/large-subunit-map'
import {small_subunit_map} from './../../../static/small-subunit-map'
import Grid from '@material-ui/core/Grid';
import { Button, ListSubheader, TextField, Tooltip } from "@material-ui/core";
import Slider from '@material-ui/core/Slider';
import { connect, useDispatch, useSelector, useStore  } from "react-redux";
import { AppState } from "../../../redux/store";
import { AppActions } from "../../../redux/AppActions";import LoadingSpinner  from '../../Other/LoadingSpinner'
import StructHero from './../../../materialui/StructHero'
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import * as redux from '../../../redux/reducers/StructuresReducer/StructuresReducer'
import { Dispatch } from 'redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {useDebounce} from 'use-debounce'
import {  FilterData, FilterType,filterChange, filterChangeActionCreator, resetAllFilters} from "../../../redux/reducers/Filters/ActionTypes"
import {SpeciesGroupings} from './taxid_map'
import _  from "lodash";
import Cart from './../Cart/Cart'
import {Link, useHistory, useParams} from "react-router-dom";
import {DashboardButton} from './../../../materialui/Dashboard/Dashboard'
import PageAnnotation from './PageAnnotation'
import { NeoStruct } from "../../../redux/DataInterfaces";
import { FiltersReducerState, mapDispatchFilter, mapStateFilter, handleFilterChange } from "../../../redux/reducers/Filters/FiltersReducer";
import DropdownTreeSelect from 'react-dropdown-tree-select'
import 'react-dropdown-tree-select/dist/styles.css'
import Pagination from './Pagination'
import Backdrop from './../Backdrop'
import { CSVLink } from "react-csv";
import { StructFilterType, structsFilterChangeAC, structsSortChangeAC } from "../../../redux/reducers/StructuresReducer/ActionTypes";
import Paper from "@material-ui/core/Paper";

const pageData ={
  title:"Whole Ribosome Structures",
  text:'This database presents a catalogue of all the ribosome structures deposited to the RCSB/PDB.\
   These structures are processed here for an easy search and access of the structures and their components\
   (listed below). Various modules (gear icon) are also available to process and analyze the structures'
}

// Workspace itself
interface StateProps {
  structures    :  NeoStruct[];
  loading       :  boolean;
  current_page  :  number;
  pages_total   :  number
}


const data = {
  label     :  'Species Filter',
  value     :  'All',
  children  :  [
    {
      label: "Viruses",
      value: "Viruses",
      children: []
    },
    {
      label: "Archea",
      value: "Archea",
      children: [

        {
          label: "Candidatus Diapherotrites archaeon ADurb.Bin253",
          value: "Candidatus Diapherotrites archaeon ADurb.Bin253",
        },
        {
          label: "Thermococcus celer Vu 13 = JCM 8558",
          value: "Thermococcus celer Vu 13 = JCM 8558",
        }
      ]
    },
    {
      label: "Eukaryota",
      value: "Eukaryota",
      children: [
        {
          label: "Leishmania braziliensis MHOM/BR/75/M2904",
          value: "Leishmania braziliensis MHOM/BR/75/M2904",
        },
        {
          label: "Cryptosporidium hominis TU502",
          value: "Cryptosporidium hominis TU502",
        },
        {
          label: "Yarrowia lipolytica CLIB122",
          value: "Yarrowia lipolytica CLIB122",
        }


      ]
    },
    {
      label: "Bacteria",
      value: "Bacteria",
      children: [

        {
          label: "Acinetobacter sp. RUH2624",
          value: "Acinetobacter sp. RUH2624",
        },
        {
          label: "Gluconobacter oxydans 621H",
          value: "Gluconobacter oxydans 621H",
        }
      ]
    },
  ],
}

//@ts-ignore
const onChange = (currentNode, selectedNodes) => {
  console.log('onChange::', currentNode, selectedNodes)
}
//@ts-ignore
const onAction = (node, action) => {
  console.log('onAction::', action, node)
}
//@ts-ignore
const onNodeToggle = currentNode => {
  console.log('onNodeToggle::', currentNode)
}
 
interface DispatchProps{
  next_page: ()=>void;
  prev_page: ()=>void;
  goto_page: (pid:number)=>void;
}
type WorkspaceCatalogueProps =  StateProps & DispatchProps;
const WorkspaceCatalogue: React.FC<WorkspaceCatalogueProps> = (
  prop: WorkspaceCatalogueProps
) => {
  
  const history:any  =  useHistory();
  const nomclass     =  history.location.state ? history.location.state.nomclass : ""
  const dispatch     =  useDispatch();
  const filters      =  useSelector((state:AppState)=>{
    return state.filters
  })
  
  useEffect(() => {
    console.log("Got a parameter chagnge:: nomclass is", nomclass);
    
    dispatch({
      type             :  "FILTER_CHANGE",
      filttype         :  "PROTEINS_PRESENT",
      newval           :  [nomclass],
      set              :  true,
      derived_filters  :  filters
    })
  }, [nomclass])


  const last_sort_set = useSelector(( state:AppState ) => state.structures.last_sort_set)
  const sortPredicates = useSelector(( state:AppState ) => state.structures.sorts_registry)
  
  useEffect(() => {
    prop.structures.sort(sortPredicates[last_sort_set].compareFn)
  }, [last_sort_set])

  useEffect(() => {
    console.log(_.uniq(prop.structures.map(s => s.struct.expMethod)))
  }, [prop.structures])
  return ! prop.loading ? (
    <div className="workspace-catalogue-grid">
      <div className="wspace-catalogue-filters-tools">
        <StructureFilters />
      </div>
      <Grid container item xs={12} spacing={3}>
        <PageAnnotation {...pageData}/>
        {/* <Grid item container xs={12}  >
          
          </Grid> */}
        <Grid item xs={12} alignContent={"center"} alignItems={"center"} >
          <Paper variant="outlined" style={{padding:"10px"}}>
        <Grid item container xs={12} alignContent={"center"} alignItems={"center"} justify="space-between" direction='row'>

          <Grid item container>
          <Typography variant="overline" style={{color:"gray", padding:"5px"}}>Page: </Typography>
          <Pagination {...{ gotopage: prop.goto_page, pagecount: prop.pages_total }}/>
          </Grid>

          <Grid item container>
          <Typography variant="overline" style={{color:"gray", padding:"5px"}}>Sort By: </Typography>

            <Button onClick={() =>{dispatch(structsSortChangeAC("RESOLUTION"))}}>
              Resolution</Button>
            <Button onClick={() =>{dispatch(structsSortChangeAC("YEAR"))}}>
              Year</Button>
            <Button onClick={() =>{dispatch(structsSortChangeAC("NUMBER_OF_PROTEINS"))}}>
              Number of Proteins</Button>
              <Button onClick={() =>{dispatch(structsSortChangeAC("EXPERIMENTAL_METHOD"))}}>
              Experimental Method</Button>
          
          </Grid>
          </Grid>
          </Paper>
        </Grid>
        <Grid container item xs={12} spacing={3}  alignItems="flex-start">
          {prop.structures
            .slice(( prop.current_page-1 ) * 20, prop.current_page * 20 )
            .map((x, i) => (
              <Grid item>
                <StructHero {...x} key={i} />
              </Grid>
            ))}
        </Grid>
        <Grid item xs={12}>
          <Pagination
            {...{ gotopage: prop.goto_page, pagecount: prop.pages_total }}
          />
        </Grid>
      </Grid>
    </div>
  ) : (
    <Backdrop/>
  );
};

const mapstate = (state: AppState, ownprops: {}): StateProps => ({
  structures  : state.structures.derived_filtered,
  loading     : state.structures.Loading,
  current_page: state.structures.current_page,
  pages_total : state.structures.pages_total,
});

const mapdispatch =(
  dispatch:Dispatch<AppActions>,
  ownProps:any):DispatchProps=>({
    goto_page: (pid)=>dispatch( redux.gotopage(pid)),
    next_page: ()=>dispatch( redux.nextpage()),
    prev_page: ()=>dispatch( redux.prevpage()),
  })

export default connect(mapstate, mapdispatch)(WorkspaceCatalogue);


const StructuresSearchField = () =>
{

  const dispatch = useDispatch();
  // dispatch(structsFilterChangeAC(

  // ))
  const [value, setValue] = useState('')
  const [debounced] = useDebounce(value,250)

  const handleChange = (e:any)=>{
    setValue(e.target.value)
  }

  useEffect(() => {

    // handleChange(props.allFilters as FiltersReducerState,debounced)
    dispatch(structsFilterChangeAC(value,'SEARCH'))

  }, [debounced])

  return(
      <TextField id="standard-basic" label="Search" value={value}  onChange={handleChange}/>
  )
}


export const _SearchField:React.FC<FilterData & handleFilterChange> = (props) =>
{
  const [value, setValue] = useState('')
  const [debounced] = useDebounce(value,250)

  const handleChange = (e:any)=>{
    setValue(e.target.value)
  }
  useEffect(() => {
    props.handleChange(props.allFilters as FiltersReducerState,debounced)
  }, [debounced])

  return(
      <TextField id="standard-basic" label="Search" value={value}  onChange={handleChange}/>
  )
}

interface SliderFilterProps {
  filter_type: StructFilterType;
  name               :  string;
  max                :  number;
  min                :  number;
  step               :  number;
}
const ValueSlider= (prop:SliderFilterProps ) => {

  const useSliderStyles = makeStyles({
    root: {
      width: 300,
    },
  });

  const dispatch = useDispatch();
  const classes           = useSliderStyles();
  const [value, setValue] = React.useState<number[]>([prop.min, prop.max]);
  const [debounced_val]   = useDebounce(value,500)

  const handleChange = (event: any, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };
  useEffect(() => {
    dispatch(structsFilterChangeAC(value,prop.filter_type))
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

const ProteinsPresentFilter =()=> {

  const BanClassNames = Object.keys(large_subunit_map).concat(Object.keys(small_subunit_map))
  const useProteinsPresentStyles = makeStyles((theme: Theme) =>
    createStyles({
      
      root: {
        fontSize: 6,
        width: "100%",
        minWidth: "100%",
        "& > * + *": {
          fontSize: 6,
        },
      },
    })
  );
  const classes         = useProteinsPresentStyles();
  const proteinsPresent = useSelector(( state:AppState ) => state.structures.filter_registry.filtstate.PROTEINS_PRESENT.value)
  const dispatch = useDispatch();

  return (

    <div className={classes.root}>

      <Autocomplete
        multiple
        id="size-small-outlined-multi"
        size="small"
        options={BanClassNames}
        getOptionLabel={(option) => option}
        defaultValue={[]}
        value={proteinsPresent as string[]}
        onChange={
          
          (e:any, value:string[])=>{
            console.log(value)
            dispatch(structsFilterChangeAC( value, "PROTEINS_PRESENT"))
          }
        }
        renderInput={(params) => { 
          return <TextField {...params} variant="outlined" label="Proteins Present" placeholder="" />
          }}
      />

    </div>



  );
}


type SpecListProps = handleFilterChange & FilterData;
export const _SpecList: React.FC<SpecListProps> = (prop) => {

  const useSpecListStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        fontSize: 8,
        maxWidth: "2em",
        width: "100%",
        minWidth: "100%",
        "& > * + *": {
          fontSize: 8,
        },
      },
    })
  );

  const taxIdMap = Object.entries(SpeciesGroupings);
  const classes = useSpecListStyles();

  const [specListValues, setSpecListValues] = useState<Array<[string, number[]]>>([]);

  useEffect(() => {
    var filtered = taxIdMap.filter(
      (r: [string, number[]]) =>
        (prop.value as number[]).reduce(
          (bool: boolean, next: number) => r[1].includes(next),
          false
        )
    );
    setSpecListValues(filtered);
  }, [prop.value]);
  return (
    <div className={classes.root}>
      <Autocomplete
        multiple
        id="size-small-outlined-multi"
        size="small"
        options={taxIdMap}
        getOptionLabel={(option) => option[0] as string}
        defaultValue={[]}
        onChange={
          (e: any, value: [string, number[]][]) => {
            var taxids = value.map(k => k[1]).reduce((acc, taxarr) => [...acc, ...taxarr], [])
            prop.handleChange(prop.allFilters as FiltersReducerState, taxids)
          }}
        renderInput={(params) => {
          return <TextField {...params} variant="outlined" label="Species" placeholder="" />
        }}
      />
    </div>
  );
}
export const SearchField       =  connect(mapStateFilter("SEARCH"),       mapDispatchFilter("SEARCH"))(_SearchField)
export const SpeciesList       =  connect(mapStateFilter("SPECIES"),      mapDispatchFilter("SPECIES"))(_SpecList)

const mapResetFilters = (dispatch: Dispatch<AppActions>, ownprops:any):{
  reset_filters: () =>void
} =>({
  reset_filters: ()=>    { dispatch(resetAllFilters()) }
})

type StructureFilterProps ={
  reset_filters: () =>void
};

const _StructureFilters:React.FC<StructureFilterProps> = (props) => {

const drawerWidth       =  240;
const useFiltersStyles  =  makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      zIndex: -1,
      width:300
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

    toolbar: theme.mixins.toolbar,
    home:{
      cursor:"pointer",
      fontSize:20,
      "&:hover":{
        background:"gray"
      }
    }
  })
);

  const filterClasses = useFiltersStyles();
  
    const structs = useSelector((state: AppState) => state.structures.derived_filtered)
    var bulkDownloads = [["rcsb_id"]]
    structs.map(s => {
      bulkDownloads.push(
        [s.struct.rcsb_id]

      )
    })

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
        <ListItem key={"search"}>
          <StructuresSearchField/>
        </ListItem>
        <ListItem key={"year"}>
          <ValueSlider {...{filter_type: "YEAR",max:2021,min:2012,name:"Deposition Date", step:1}}/>
        </ListItem>
        <ListItem key={"resolution"}>
          <ValueSlider {...{filter_type: "RESOLUTION",max:6,min:1,name:"Resolution", step:0.1}}/>
        </ListItem>
        <ListItem key={"select-proteins"} >
          <ProteinsPresentFilter/>
        </ListItem>
        <ListItem >
          <DashboardButton/>
        </ListItem>

        <ListItem >
         <Cart/>
        </ListItem>
        <ListItem key={"select-species"} >
          <DropdownTreeSelect data={data} onChange={onChange} onAction={onAction} onNodeToggle={onNodeToggle} />
        </ListItem>
        <ListItem key={"bulkdownload"} >
<CSVLink data={bulkDownloads}>
<Typography variant="body2"> Download Fitlered</Typography>

</CSVLink>
        </ListItem>
      </List>
    </Drawer>
  );
};




export const StructureFilters = connect(null, mapResetFilters)(_StructureFilters);
