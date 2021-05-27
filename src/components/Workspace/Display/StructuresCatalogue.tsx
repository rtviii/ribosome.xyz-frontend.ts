import React, { Component, useEffect, useState } from "react";import "./StructuresCatalogue.css";
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import {large_subunit_map} from './../../../static/large-subunit-map'
import {small_subunit_map} from './../../../static/small-subunit-map'
import Grid from '@material-ui/core/Grid';
import { Button, ListItemText, ListSubheader, TextField, Tooltip } from "@material-ui/core";
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
import _, { isEqual }  from "lodash";
import Cart from './../Cart/Cart'
import {Link, useHistory, useParams} from "react-router-dom";
import {DashboardButton} from './../../../materialui/Dashboard/Dashboard'
import PageAnnotation from './PageAnnotation'
import { NeoStruct } from "../../../redux/DataInterfaces";
import { FiltersReducerState, mapDispatchFilter, mapStateFilter, handleFilterChange } from "../../../redux/reducers/Filters/FiltersReducer";
import DropdownTreeSelect from 'react-dropdown-tree-select'
import Pagination from './Pagination'
import Backdrop from './../Backdrop'
import { CSVLink } from "react-csv";
import { StructFilterType, structsFilterChangeAC, structsSortChangeAC } from "../../../redux/reducers/StructuresReducer/ActionTypes";
import Paper from "@material-ui/core/Paper";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from "@material-ui/core/Divider";
import 'react-dropdown-tree-select/dist/styles.css'
import './StructuresCatalogue.css'
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight';
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const pageData ={
  title:"Ribosome Structures",
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

 
interface DispatchProps{
  next_page: ()=>void;
  prev_page: ()=>void;
  goto_page: (pid:number)=>void;
  }
type WorkspaceCatalogueProps =  StateProps & DispatchProps;
const WorkspaceCatalogue: React.FC<WorkspaceCatalogueProps> = (
  prop: WorkspaceCatalogueProps
) => {
  
  
  const dispatch       = useDispatch(                                                     );
  const last_sort_set  = useSelector(( state:AppState ) => state.structures.last_sort_set )
  const sortPredicates = useSelector(( state:AppState ) => state.structures.sorts_registry)
  
  useEffect(() => {
    prop.structures.sort(sortPredicates[last_sort_set].compareFn)
  }, [last_sort_set])

  return ! prop.loading ? (
    <Grid container xs={12} spacing={1}>
      <Grid item xs={12}>
        <PageAnnotation {...pageData} />
      </Grid>
      <Grid item xs={2} style={{padding:"10px"}}>
        <StructureFilters />
      </Grid>
      <Grid container item xs={10} spacing={1}>
        <Grid item xs={12} alignContent={"center"} alignItems={"center"} >
          <Paper variant="outlined" style={{padding:"10px"}}>
        <Grid item container xs={12} alignContent={"center"} alignItems={"center"} justify="space-between" direction='row'>

          <Grid item container>
          <Typography variant="overline" style={{color:"gray"}}>Page: </Typography>
          <Pagination {...{ gotopage: prop.goto_page, pagecount: prop.pages_total }}/>
          </Grid>

          <Grid item container alignContent={"center"} alignItems={"center"} spacing={1} >
            <Grid item>

          <Typography variant="overline" style={{color:"gray" }}>Sort By: </Typography>
            </Grid>
            <Grid item>

            <Button variant= "outlined"  color="primary" onClick={() =>{dispatch(structsSortChangeAC("RESOLUTION"))}}>
              Resolution</Button>
            </Grid>


            <Grid item>
            <Button variant= "outlined"  color="primary" onClick={() =>{dispatch(structsSortChangeAC("YEAR"))}}>
              Year</Button>

            </Grid>

            <Grid item>

            <Button variant= "outlined"  color="primary" onClick={() =>{dispatch(structsSortChangeAC("NUMBER_OF_PROTEINS"))}}>
              Number of Proteins</Button>
            </Grid>

          
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
        </Grid>
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
  const [value, setValue] = useState('')
  const [debounced] = useDebounce(value,250)

  const handleChange = (e:any)=>{
    setValue(e.target.value)
  }
  useEffect(() => {
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

  
  const history:any  =  useHistory();
  const nomclass     =  history.location.state ? history.location.state.nomclass : ""

  useEffect(() => {
    console.log("Got a parameter chagnge:: nomclass is", nomclass);

    if (nomclass.length > 1){
      dispatch(structsFilterChangeAC([nomclass],"PROTEINS_PRESENT"))
    }
  }, [nomclass])


  const BanClassNames            = Object.keys(large_subunit_map).concat(Object.keys(small_subunit_map))
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
  const dispatch        = useDispatch();

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



const BulkDownloadMenu=()=> {
  const [open, setOpen] = React.useState(false);
  const structs = useSelector(( state:AppState ) => state.structures.derived_filtered)
const useCheckboxStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(3),
    },
  }),
);
  const classes = useCheckboxStyles();
  const [summaryOpts, setSummaryOpts] = React.useState({
            all:false,
            experimental_method           : false,
            resolution                    : false,
            organisms                     : false,
            present_ligands               : false,
            universal_protein_nomenclature: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSummaryOpts({ ...summaryOpts, [event.target.name]: event.target.checked });
  };
  const { all,experimental_method, resolution,organisms,present_ligands,
    // universal_protein_nomenclature 
  } = summaryOpts;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const createSummary = ():any[][] =>{

  var bulkDownload:Array<Array<any>> = [
    ['rcsb_id'],
    ...structs.map(r =>[ r.struct.rcsb_id ])
  ]

          if ( summaryOpts.experimental_method ){
          bulkDownload[0].push("experimental_method")
          structs.map((v,i)=>bulkDownload[i+1].push(v.struct.expMethod))
          }
          if ( summaryOpts.resolution ){
          bulkDownload[0].push("resolution")
          structs.map((v,i)=>bulkDownload[i+1].push(v.struct.resolution))
          }
          if ( summaryOpts.organisms ){
          bulkDownload[0].push("organisms")
          structs.map((v,i)=>bulkDownload[i+1].push(v.struct._organismName
            ))}
          if ( summaryOpts.present_ligands ){
          bulkDownload[0].push("ligands")
          structs.map((v,i)=>bulkDownload[i+1].push(v.ligands))
          }
      

    return bulkDownload
  }

  return (
    <div style={{width:"100%"}}>
      <Button variant="outlined" style={{width:"100%", color:"black"}} color="primary" onClick={handleClickOpen}>
        Bulk Download
      </Button>

      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">

        <DialogTitle id="form-dialog-title">Bulk Download Options</DialogTitle>
        <DialogContent>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">
          
            Please select the fields that you would like the summary to contain.
          </FormLabel>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={all} onChange={()=>setSummaryOpts({all:!all, experimental_method:!all,organisms:!all,resolution:!all,present_ligands:!all,universal_protein_nomenclature:!all})} name="all" />}
            label="All Options"
          />
          <FormControlLabel
            control={<Checkbox checked={resolution} onChange={handleChange} name="resolution" />}
            label="Resolution"
          />
          <FormControlLabel
            control={<Checkbox checked={experimental_method} onChange={handleChange} name="experimental_method" />}
            label="Experimental Method"
          />
          <FormControlLabel
            control={<Checkbox checked={organisms} onChange={handleChange} name="organisms" />}
            label="Organisms"
          />
          {/* <FormControlLabel
            control={<Checkbox checked={universal_protein_nomenclature} onChange={handleChange} name="universal_protein_nomenclature" />}
            label="Universal r-Protein Nomenclature"
          /> */}
          <FormControlLabel
            control={<Checkbox checked={present_ligands} onChange={handleChange} name="present_ligands" />}
            label="Present Ligands"
          />
        </FormGroup>
        <FormHelperText>You have {structs.length} structures in scope.</FormHelperText>
      </FormControl>																									
    <CSVLink data={createSummary()}>
                <Button onClick={handleClose} color="primary">

            Download Summary (.csv)
          </Button>
</CSVLink>
          <Divider/>
            <DialogContentText style={{marginTop:"10px"}}>
            Filtered models of the whole ribosome structures that you have filtered will be packed into a .zip archive and downloaded.
          </DialogContentText>
          <Button onClick={handleClose} color="primary">
            Download Models (.zip)
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}





const _StructureFilters = () => {

    const structs = useSelector((state: AppState) => state.structures.derived_filtered)
    var bulkDownloads = [["rcsb_id"]]
    structs.map(s => {
      bulkDownloads.push(
        [s.struct.rcsb_id]
      )
    })



const dispatch                  = useDispatch();
const [ data, setDropdownData ] = useState([
{"label": "Bacteria", "value": [1977881, 243230, 562, 224308, 574, 262724, 585, 474186, 575584, 1217649, 544404, 663, 1217710, 421052, 367830, 1772, 1773, 1280, 274, 1299, 287, 300852, 1351, 585035, 1144663, 1144670, 331111, 480119, 83333, 93061, 83334, 93062, 1931, 1223565, 52133, 1310637, 246196, 679895, 470, 1310678, 1960940], "checked": false, "children": [{"label": "Acinetobacter sp. ANC 4470", "value": [1977881], "checked": false}, {"label": "Deinococcus radiodurans R1", "value": [243230], "checked": false}, {"label": "Escherichia coli", "value": [562], "checked": false}, {"label": "Bacillus subtilis subsp. subtilis str. 168", "value": [224308], "checked": false}, {"label": "Klebsiella pneumoniae subsp. ozaenae", "value": [574], "checked": false}, {"label": "Thermus thermophilus HB27", "value": [262724], "checked": false}, {"label": "Proteus vulgaris", "value": [585], "checked": false}, {"label": "Enterococcus faecalis OG1RF", "value": [474186], "checked": false}, {"label": "Acinetobacter baumannii ATCC 19606 = CIP 70.34 = JCM 6841", "value": [575584], "checked": false}, {"label": "Acinetobacter beijerinckii ANC 3835", "value": [1217649], "checked": false}, {"label": "Escherichia coli O157:H7 str. TW14359", "value": [544404], "checked": false}, {"label": "Vibrio alginolyticus", "value": [663], "checked": false}, {"label": "Acinetobacter sp. NIPH 899", "value": [1217710], "checked": false}, {"label": "Acinetobacter rudis CIP 110305", "value": [421052], "checked": false}, {"label": "Staphylococcus aureus subsp. aureus USA300", "value": [367830], "checked": false}, {"label": "Mycolicibacterium smegmatis", "value": [1772], "checked": false}, {"label": "Mycobacterium tuberculosis", "value": [1773], "checked": false}, {"label": "Staphylococcus aureus", "value": [1280], "checked": false}, {"label": "Thermus thermophilus", "value": [274], "checked": false}, {"label": "Deinococcus radiodurans", "value": [1299], "checked": false}, {"label": "Pseudomonas aeruginosa", "value": [287], "checked": false}, {"label": "Thermus thermophilus HB8", "value": [300852], "checked": false}, {"label": "Enterococcus faecalis", "value": [1351], "checked": false}, {"label": "Escherichia coli S88", "value": [585035], "checked": false}, {"label": "Acinetobacter sp. CIP 102082", "value": [1144663], "checked": false}, {"label": "Acinetobacter sp. CIP 51.11", "value": [1144670], "checked": false}, {"label": "Escherichia coli O139:H28 str. E24377A", "value": [331111], "checked": false}, {"label": "Acinetobacter baumannii AB0057", "value": [480119], "checked": false}, {"label": "Escherichia coli K-12", "value": [83333], "checked": false}, {"label": "Staphylococcus aureus subsp. aureus NCTC 8325", "value": [93061], "checked": false}, {"label": "Escherichia coli O157:H7", "value": [83334], "checked": false}, {"label": "Staphylococcus aureus subsp. aureus COL", "value": [93062], "checked": false}, {"label": "Streptomyces sp.", "value": [1931], "checked": false}, {"label": "Rhizobium sp. Pop5", "value": [1223565], "checked": false}, {"label": "Acinetobacter venetianus", "value": [52133], "checked": false}, {"label": "Acinetobacter sp. 809848", "value": [1310637], "checked": false}, {"label": "Mycolicibacterium smegmatis MC2 155", "value": [246196], "checked": false}, {"label": "Escherichia coli BW25113", "value": [679895], "checked": false}, {"label": "Acinetobacter baumannii", "value": [470], "checked": false}, {"label": "Acinetobacter sp. 263903-1", "value": [1310678], "checked": false}, {"label": "Acinetobacter sp. ANC 5600", "value": [1960940], "checked": false}].sort()},
  
{"label": "Eukaryota", "value": [9739, 5661, 5693, 5702, 5722, 9823, 1177187, 3702, 55431, 37000, 5811, 9913, 559292, 9986, 7460, 28985, 4932, 285006, 7536, 9606, 209285, 9615, 6039, 284590, 1247190, 759272, 36329, 3562], "checked": false, "children": [{"label": "Tursiops truncatus", "value": [9739], "checked": false}, {"label": "Leishmania donovani", "value": [5661], "checked": false}, {"label": "Trypanosoma cruzi", "value": [5693], "checked": false}, {"label": "Trypanosoma brucei brucei", "value": [5702], "checked": false}, {"label": "Trichomonas vaginalis", "value": [5722], "checked": false}, {"label": "Sus scrofa", "value": [9823], "checked": false}, {"label": "Saccharomyces cerevisiae P283", "value": [1177187], "checked": false}, {"label": "Arabidopsis thaliana", "value": [3702], "checked": false}, {"label": "Palomena prasina", "value": [55431], "checked": false}, {"label": "Pyrrhocoris apterus", "value": [37000], "checked": false}, {"label": "Toxoplasma gondii", "value": [5811], "checked": false}, {"label": "Bos taurus", "value": [9913], "checked": false}, {"label": "Saccharomyces cerevisiae S288C", "value": [559292], "checked": false}, {"label": "Oryctolagus cuniculus", "value": [9986], "checked": false}, {"label": "Apis mellifera", "value": [7460], "checked": false}, {"label": "Kluyveromyces lactis", "value": [28985], "checked": false}, {"label": "Saccharomyces cerevisiae", "value": [4932], "checked": false}, {"label": "Saccharomyces cerevisiae RM11-1a", "value": [285006], "checked": false}, {"label": "Oncopeltus fasciatus", "value": [7536], "checked": false}, {"label": "Homo sapiens", "value": [9606], "checked": false}, {"label": "Chaetomium thermophilum", "value": [209285], "checked": false}, {"label": "Canis lupus familiaris", "value": [9615], "checked": false}, {"label": "Vairimorpha necatrix", "value": [6039], "checked": false}, {"label": "Kluyveromyces lactis NRRL Y-1140", "value": [284590], "checked": false}, {"label": "Saccharomyces cerevisiae BY4741", "value": [1247190], "checked": false}, {"label": "Chaetomium thermophilum var. thermophilum DSM 1495", "value": [759272], "checked": false}, {"label": "Plasmodium falciparum 3D7", "value": [36329], "checked": false}, {"label": "Spinacia oleracea", "value": [3562], "checked": false}].sort()},

{"label": "Archaea", "value": [311400, 273057, 1293037, 2287, 69014, 272844], "checked": false, "children": [{"label": "Thermococcus kodakarensis", "value": [311400], "checked": false}, {"label": "Saccharolobus solfataricus P2", "value": [273057], "checked": false}, {"label": "Thermococcus celer Vu 13 = JCM 8558", "value": [1293037], "checked": false}, {"label": "Saccharolobus solfataricus", "value": [2287], "checked": false}, {"label": "Thermococcus kodakarensis KOD1", "value": [69014], "checked": false}, {"label": "Pyrococcus abyssi GE5", "value": [272844], "checked": false}].sort()},
{"label": "Viruses", "value": [194966, 10665], "checked": false, "children":
 [{"label": "Salmonella virus SP6", "value": [194966], "checked": false}, {"label": "Escherichia virus T4", "value": [10665], "checked": false}].sort()}
]
)
// @ts-ignore
const onChange = (currentNode, selectedNodes) => {
for (var parent of data){
  if (_.isEmpty(_.xor(parent.value, currentNode.value))){
   var     updatedIn             = parent.children.map(child => { return {...child, checked:currentNode.checkedk} })
   var     parentIndex           = data.findIndex(d=> d.label === parent.label)
   var     newdata               = data;
   newdata[parentIndex].checked  = currentNode.checked
   newdata[parentIndex].children = updatedIn

    setDropdownData(newdata)
  }
  else if( parent.value.includes( currentNode.value[0] ) ) 
  {
  var         childindex            = parent.children.findIndex(x => currentNode.label === x.label)
  var         newChildren           = [...parent.children ]
  newChildren[childindex].checked   = currentNode.checked
  var         parentIndex           = data.findIndex(d=> d.label === parent.label)
  var         newdata               = data;
  newdata    [parentIndex].children = newChildren
  setDropdownData(newdata)

  }
}
  if ( currentNode.checked ){
  setSelectedSpecies([...selectedSpecies, ...currentNode.value])
  }else{
  setSelectedSpecies(selectedSpecies.filter(( r:any )=> !currentNode.value.includes(r)))
  }

}
const [selectedSpecies, setSelectedSpecies] = useState<any>([])
useEffect(() => {
  dispatch(structsFilterChangeAC(selectedSpecies,"SPECIES"))
}, [selectedSpecies])






  const [method, setMethod] = React.useState<string | null>('');
  const handleAlignment = (event: React.MouseEvent<HTMLElement>, newAlignment: string | null) => {
    setMethod(newAlignment);
  };
  const MethodClasses =  makeStyles({
    root:{
        width:"100%",
    }
  })();

  useEffect(() => {
    dispatch(structsFilterChangeAC(method,"EXPERIMENTAL_METHOD"))
  }, [method])

// () =>{dispatch(structsSortChangeAC("EXPERIMENTAL_METHOD"))}
  return (
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
        <ListItem key={"method-toggle"} >
    <ToggleButtonGroup
      value = {method}
      // exclusive
      onChange={handleAlignment}
      aria-label="text alignment"
      className={MethodClasses.root}
    >
      <ToggleButton 
      className={MethodClasses.root}
      value="X-RAY DIFFRACTION" aria-label="left aligned">
        XRAY
      </ToggleButton>

      <ToggleButton 
      
      className={MethodClasses.root}
      value="ELECTRON MICROSCOPY" aria-label="right aligned" >
        EM
      </ToggleButton>

    </ToggleButtonGroup>
        </ListItem>
        <Divider/>

        <ListItem >
        <DropdownTreeSelect data={data} onChange={onChange}  keepOpenOnSelect={true} keepTreeOnSearch={true} keepChildrenOnSearch={true}/>
        </ListItem>

        <ListItem >
        <Cart />
        </ListItem>
        <ListItem key={"bulkdownload"} >
        <BulkDownloadMenu/>
        </ListItem>
        <ListItem >
        <DashboardButton/>
        </ListItem>
      </List>
  );
};

export const StructureFilters = connect(null, mapResetFilters)(_StructureFilters);
