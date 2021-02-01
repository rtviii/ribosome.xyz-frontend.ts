import React, { useEffect, useState } from "react";import "./StructuresCatalogue.css";
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import Chip from '@material-ui/core/Chip';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import {large_subunit_map} from './../../../static/large-subunit-map'
import {small_subunit_map} from './../../../static/small-subunit-map'
import Grid from '@material-ui/core/Grid';
import { ListSubheader, TextField, Tooltip } from "@material-ui/core";
import Slider from '@material-ui/core/Slider';
import { connect, useStore  } from "react-redux";
import { AppState } from "../../../redux/store";
import { AppActions } from "../../../redux/AppActions";import LoadingSpinner  from '../../Other/LoadingSpinner'
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import StructHero from './../../../materialui/StructHero'
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import * as redux from '../../../redux/reducers/StructuresReducer/StructuresReducer'
import { Dispatch } from 'redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {useDebounce} from 'use-debounce'
import {  FilterData, FilterType,filterChange, filterChangeActionCreator} from "../../../redux/reducers/Filters/ActionTypes"
import {SpeciesGroupings} from './taxid_map'
import _  from "lodash";
import {useHistory} from "react-router-dom";
import PageAnnotation from './PageAnnotation'
import { NeoStruct } from "../../../redux/DataInterfaces";
import { FiltersReducerState } from "../../../redux/reducers/Filters/FiltersReducer";
import Pagination from './Pagination'

const pageData ={
  title:"Whole Ribosome Structures",
  text:'This database presents a catalogue of all the ribosome structures deposited to the RCSB/PDB.\
   These structures are processed here for an easy search and access of the structures and their components\
   (listed below). Various modules (gear icon) are also available to process and analyze the structures'
}

// Workspace itself
interface StateProps {
  structures  : NeoStruct[];
  loading     : boolean;
  current_page: number;
  pages_total : number
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



  return !prop.loading ? (
    <div className="workspace-catalogue-grid">
      <div className="wspace-catalogue-filters-tools">
        <StructureFilters />
      </div>

      <Grid container item xs={12} spacing={3}>
        <PageAnnotation {...pageData}/>
        <Grid item xs={12}>
          <Pagination
            {...{ gotopage: prop.goto_page, pagecount: prop.pages_total }}
          />
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
    <LoadingSpinner annotation="Fetching data..." />
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

// Filter Generics-----------------------------------------------------------------------------------------------
interface handleFilterChange {
  handleChange: ( allFilters:FiltersReducerState, newavalue:number|string|number[]|string[]) => void;
}
export const mapStateFilter=(filttype:FilterType)=>(appstate:AppState, ownprops:any):FilterData =>({
  allFilters: appstate.filters,
  set       : appstate.filters.filters[filttype].set,
  value     : appstate.filters.filters[filttype].value
})
export const mapDispatchFilter = (filttype: FilterType) => (
  dispatch: Dispatch<AppActions>,
  ownProps: any
): handleFilterChange => {
  return {
    handleChange: (allFilters, newrange) =>
      dispatch(filterChangeActionCreator(allFilters, filttype, newrange)),
  };
};




const _SearchField:React.FC<FilterData & handleFilterChange> = (props) =>
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

interface OwnSliderFilterProps {
  name               :  string;
  max                :  number;
  min                :  number;
  step               :  number;
}
const _ValueSlider: React.FC<OwnSliderFilterProps & FilterData & handleFilterChange>
 = (prop:OwnSliderFilterProps & FilterData & handleFilterChange) => {
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
      prop.handleChange(prop.allFilters as FiltersReducerState,debounced_val)
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



type SelectedProteinsFilterProps =  handleFilterChange & FilterData 
const _SelectProteins:React.FC<SelectedProteinsFilterProps> =(prop)=> {

const BanClassNames=Object.keys(large_subunit_map).concat(Object.keys(small_subunit_map))

function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const useProteinsSelectedStyles = makeStyles((theme: Theme) =>
  createStyles({
      select:{
          width:300,
          maxWidth:300
      },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
  }),
);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 100,
    },
  },
};



  const classes = useProteinsSelectedStyles();
  const theme = useTheme();
  const [selectedProteins, setSelectedProteins] = React.useState<string[]>([]);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedProteins(event.target.value as string[]);
    var newval:string[]  =  event.target.value as string[]
    // prop.handleChange(prop.allFilters as FiltersReducerState, newval)
  };


  return (
        <Grid xs={12} container spacing={2}> 
        <Grid item>
        <Select
          labelId="demo-mutiple-chip-label"
          id="demo-mutiple-chip"
          multiple
          value={selectedProteins}
          onChange={handleChange}
          input={<Input id="select-multiple-chip" />}
          className={classes.select}
          renderValue={(selected) => (
            <div className={classes.chips}>
              {(selected as string[]).map((value) => (
                <Chip key={value} label={value} className={classes.chip} />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {BanClassNames.map((name) => (
            <MenuItem key={name} value={name} style={getStyles(name, selectedProteins, theme)}>
              {name}
            </MenuItem>
          ))}
        </Select>
</Grid>
        <Grid item container xs={12}>
        <Grid item container xs={6}>
        <button onClick={()=>{

      prop.handleChange(prop.allFilters as FiltersReducerState, selectedProteins)
        }}>Search</button>

</Grid>
        <Grid item container xs={6}>
        <button
        onClick={
()=>{
      setSelectedProteins([] as string[])
      prop.handleChange(prop.allFilters as FiltersReducerState, [] as string[])
}
        }
        
        >Reset</button>
</Grid>
</Grid>
        </Grid>
  );
}


type SpecListProps = handleFilterChange & FilterData;
export const _SpecList:React.FC<SpecListProps> =(prop)=> {
  const useSpecListStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        padding: 10,
        fontSize: 8,
        width: "100%",
        "& > * + *": {
          marginTop: theme.spacing(3),
          fontSize: 8,
        },
      },
        autocomplete: {
          fontSize: 8,
        "& > * + *": {
          fontSize: 8,
        },
        },
    })
  );



  
  const taxIdMap  =  Object.entries(SpeciesGroupings);
    const classes = useSpecListStyles();

    return (
      <div className={classes.root}>
        <Autocomplete
        onChange={

            (e:any,value:Array<
              [string, number[]]
              >)=>{
              var taxids  = value.map(k => k[1]).reduce((acc, taxarr) => [...acc, ...taxarr], [])
              prop.handleChange(prop.allFilters as FiltersReducerState, taxids)
              
            }
        }
          multiple
          id="tags-standard"
          options={taxIdMap}
          getOptionLabel={(option) => option[0] as string}
          defaultValue={[]}
          renderInput={(params) => (
            <TextField

        className={classes.autocomplete}
              {...params}
              variant="outlined"
            />
          )}
        />
      </div>
    );
}


export const SelectProteins    =  connect(mapStateFilter("PROTEINS_PRESENT"), mapDispatchFilter("PROTEINS_PRESENT"))(_SelectProteins)
export const YearSlider        =  connect(mapStateFilter("YEAR"),          mapDispatchFilter("YEAR"))(_ValueSlider)
export const ProtcountSlider   =  connect(mapStateFilter("PROTEIN_COUNT"), mapDispatchFilter("PROTEIN_COUNT"))(_ValueSlider)
export const ResolutionSlider  =  connect(mapStateFilter("RESOLUTION"),    mapDispatchFilter("RESOLUTION"))(_ValueSlider)
export const SearchField       =  connect(mapStateFilter("SEARCH"),       mapDispatchFilter("SEARCH"))(_SearchField)
export const SpeciesList       =  connect(mapStateFilter("SPECIES"),      mapDispatchFilter("SPECIES"))(_SpecList)
// export const SelectedProteins  =  connect(mapStateFilter("PROTEINS_PRESENT"), mapDispatchFilter("PROTEINS_PRESENT"))(_SelectProteins)

// Filters component
export const StructureFilters = () => {
  const drawerWidth = 240;
  const useFiltersStyles = makeStyles((theme: Theme) =>
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
  const history = useHistory();

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
      <Divider />
        <ListItem className={filterClasses.home} >
          <ListItemText  onClick={()=>{

          history.push(`/home`)

          }} primary={"Home"} />
        </ListItem>
      <Divider />
        <ListItem key={"search"}>
          <SearchField/>
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

        <ListItem key={"select-proteins-typography"} >
          <Typography id="range-slider">Proteins Present</Typography>
        </ListItem>
        <ListItem key={"select-proteins"} >
          <SelectProteins />
        </ListItem>
      </List>

      <Divider />
      <List>
        <ListSubheader> Species</ListSubheader>

      <SpeciesList/>

      </List>
    </Drawer>
  );
};
