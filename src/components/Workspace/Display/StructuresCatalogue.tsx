import React, { useEffect, useState } from "react";import "./StructuresCatalogue.css";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { ListSubheader, TextField } from "@material-ui/core";
import Slider from '@material-ui/core/Slider';
import { connect, useStore  } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AppState } from "../../../redux/store";
// import StructHero from "../StructureHero/StructHero";
import { AppActions } from "../../../redux/AppActions";
import LoadingSpinner  from '../../Other/LoadingSpinner'
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import SelectProteins from './../../../materialui/SelectProteins'
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
import { filterChange, FilterData, FilterType } from "../../../redux/reducers/Data/StructuresReducer/ActionTypes";
import {SpeciesGroupings} from './taxid_map'
import Pagination from '@material-ui/lab/Pagination';
import _, { includes, propertyOf } from "lodash";
import Home from "../../Home";
import {useHistory} from "react-router-dom";



export const PaginationRounded=({gotopage, pagecount}:{
  gotopage : (pid:number)=>void;
  pagecount: number
})=> {
const usePaginationStyles = makeStyles((theme) =>
  createStyles({
    root: {
      '& > *': {
        marginTop: theme.spacing(2),
      },
    },
  }),
);
  const classes = usePaginationStyles();
  return (
    <div className={classes.root}>
      <Pagination count={pagecount} onChange={(_,page)=>{ 
        gotopage(page)
        }} variant="outlined" shape="rounded" />
    </div>
  );
}


// Workspace itself
interface StateProps {
  structures  : redux.NeoStruct[];
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

const specs =_.uniq(prop.structures.map((e)=>e.struct._organismId).reduce((accumulator,specarr:number[])=>{
  return [...accumulator, ...specarr]
}, []))


  return !prop.loading ? (
    <div className="workspace-catalogue-grid">
      <div className="wspace-catalogue-filters-tools">
        <StructureFilters />
      </div>

      <Grid container item xs={12} spacing={3}>
        <Grid item xs={12}>
          <PaginationRounded
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
          <PaginationRounded
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
  structures: state.structures.derived_filtered,
  loading: state.structures.Loading,
  current_page: state.structures.current_page,
  pages_total: state.structures.pages_total,
});
const mapdispatch =(
  dispatch:Dispatch<AppActions>,
  ownProps:any):DispatchProps=>({
    goto_page: (pid)=>dispatch( redux.gotopage(pid)),
    next_page: ()=>dispatch( redux.nextpage()),
    prev_page: ()=>dispatch( redux.prevpage()),
  })

export default connect(mapstate, mapdispatch)(WorkspaceCatalogue);

// SPECIES 




interface OwnSpecFilterProps{}
type SpeciesFilterProps = OwnSpecFilterProps & handleFilterChange & FilterData 
const _SpeciesList:React.FC<SpeciesFilterProps> = (prop)=> {
  const useSpeciesListStyles = makeStyles((theme: Theme) =>
    createStyles({
    item: {
      // color: theme.palette.secondary.main,
      '& span, & svg': {
        fontSize: '12px'
      }
    },
      root: {
        width: '100%',
        maxWidth: 360,
        fontSize:12,
        backgroundColor: theme.palette.background.paper,
      }
    }),
  );

  const classes = useSpeciesListStyles();
  // ----------------
  const taxIdMap = Object.entries(SpeciesGroupings);

  var inxs = taxIdMap.map((val, index) => index);
  const [checked, setChecked] = React.useState(inxs);


  const handleToggle = (value: number, speckey:string) => () => {
      
    
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
      // -------
      var newarr = prop.value
      newarr = ( newarr as number[]).filter((n:number)=>!(SpeciesGroupings[speckey].includes(n)))
      prop.handleChange(newarr)
    } else {
      newChecked.splice(currentIndex, 1);

      var newvalue  = SpeciesGroupings[speckey].reduce( ( acc,e:number ) => [ ...acc,e ], ( prop.value as number[] ))
      prop.handleChange(newvalue)
    }

    
    setChecked(newChecked);
  };


  return (
    <List className={classes.root}>
      {Object.entries(SpeciesGroupings).map((value,index) => {
        const labelId = `checkbox-list-label-${value}`;

        return (
          <ListItem
            key={value[0]}
            button
            onClick={handleToggle(index,value[0])}
          >
            <ListItemText
              className = { classes.item }
              id        = {labelId}
              primary   = {value[0]}

            />

            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checked.indexOf(index) !== -1}
                tabIndex={-1}
                disableRipple
                color={"primary"}
                inputProps={{ "aria-labelledby": labelId }}
              />
            </ListItemIcon>
          </ListItem>
        );
      })}
    </List>
  );
}







// Filter Generics-----------------------------------------------------------------------------------------------
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


const _SearchField:React.FC<FilterData & handleFilterChange> = (props) =>
{
  const [value, setValue] = useState('')
  const [debounced] = useDebounce(value,250)

  const handleChange = (e:any)=>{
    setValue(e.target.value)
  }
  useEffect(() => {
    props.handleChange(debounced)
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


const YearSlider       = connect(mapStateFilter("YEAR"),          mapDispatchFilter("YEAR"))(_ValueSlider)
const ProtcountSlider  = connect(mapStateFilter("PROTEIN_COUNT"), mapDispatchFilter("PROTEIN_COUNT"))(_ValueSlider)
const ResolutionSlider = connect(mapStateFilter("RESOLUTION"),    mapDispatchFilter("RESOLUTION"))(_ValueSlider)
const SearchField      = connect(mapStateFilter("SEARCH"), mapDispatchFilter("SEARCH"))(_SearchField)
const SpeciesList      = connect(mapStateFilter("SPECIES"), mapDispatchFilter("SPECIES"))(_SpeciesList)

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
        {/* <SpeciesFilter species={['Kluyveromyces Lactis','Escherichia Coli','Homo Sapiens','Tetrahymena Thermophila','Deinococcus Radiodurans']}/> */}

      <SpeciesList/>

      </List>
    </Drawer>
  );
};



