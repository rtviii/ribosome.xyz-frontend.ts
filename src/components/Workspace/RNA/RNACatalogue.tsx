import React, { useEffect, useState } from                             "react"                                                 ;
import                                                                 "./RNACatalogue.css"                                    ;
import PageAnnotation from                                             "./../Display/PageAnnotation"                           ;
import Grid from                                                       "@material-ui/core/Grid"                                ;
import { RNAProfile } from                                             "./../../../redux/DataInterfaces"                       ;
import Tabs from                                                       "@material-ui/core/Tabs"                                ;
import Tab from                                                        "@material-ui/core/Tab"                                 ;
import Box from                                                        "@material-ui/core/Box"                                 ;
import Paper from                                                      "@material-ui/core/Paper"                               ;
import List from                                                       "@material-ui/core/List"                                ;
import ListItem from                                                   "@material-ui/core/ListItem"                            ;
import { connect, useDispatch, useSelector } from                      "react-redux"                                           ;
import { AppActions } from                                             "../../../redux/AppActions"                             ;
import { gotopage_rna, RnaClassFilterChangeAC, select_rna_class, sort_by_seqlen } from "../../../redux/reducers/RNA/ActionTypes"               ;
import { Dispatch } from                                               "redux"                                                 ;
import { DashboardButton } from                                        "../../../materialui/Dashboard/Dashboard"               ;
import makeStyles from                                                 "@material-ui/core/styles/makeStyles"                   ;
import { Theme } from                                                  "@material-ui/core/styles/createMuiTheme"               ;
import Typography from                                                 "@material-ui/core/Typography"                          ;
import { Button } from                                                 "@material-ui/core"                                     ;
import TextField from                                                  "@material-ui/core/TextField/TextField"                 ;
import { AppState } from                                               "../../../redux/store"                                  ;
import { RNACard } from                                                    "./RNACard"                                             ;
import Pagination from                                                 "@material-ui/lab/Pagination/Pagination"                ;
import LinearProgress from                                             "@material-ui/core/LinearProgress"                      ;
import _ from                                                          "lodash"                                                ;
import DropdownTreeSelect from                                         "react-dropdown-tree-select"                            ;
import createStyles from                                               "@material-ui/core/styles/createStyles"                 ;
import Dialog from                                                     "@material-ui/core/Dialog/Dialog"                       ;
import DialogTitle from                                                "@material-ui/core/DialogTitle/DialogTitle"             ;
import DialogContent from                                              "@material-ui/core/DialogContent/DialogContent"         ;
import FormControlLabel from                                           "@material-ui/core/FormControlLabel/FormControlLabel"   ;
import Checkbox from                                                   "@material-ui/core/Checkbox/Checkbox"                   ;
import FormLabel from                                                  "@material-ui/core/FormLabel/FormLabel"                 ;
import FormControl from                                                "@material-ui/core/FormControl/FormControl"             ;
import FormGroup from                                                  "@material-ui/core/FormGroup/FormGroup"                 ;
import Divider from                                                    "@material-ui/core/Divider/Divider"                     ;
import DialogContentText from                                          "@material-ui/core/DialogContentText/DialogContentText" ;
import { RnaClass } from                                               "../../../redux/reducers/RNA/RNAReducer"                ;
import FormHelperText from                                             "@material-ui/core/FormHelperText/FormHelperText"       ;
import { Cart } from "../Cart/Cart";

const pageData = {
  title: "Ribosomal, messenger, transfer RNA",
  text:
    "RNA components, including ribosomal RNA's, but also tRNA's and mRNA's solved\
 with the ribosomes are caccessible and can be searched through all structures.",
};

const BulkDownloadMenu=()=> {

  const [open              , setOpen] = React       . useState(false);
  const current_class:RnaClass                 = useSelector(( state    : AppState) => state.rna.current_rna_class)
  const current_class_derived         = useSelector(( state    : AppState) => state.rna.rna_classes_derived[current_class])
  const useCheckboxStyles             = makeStyles  ((theme    : Theme) =>
    createStyles({
    formControl: {
      margin: theme.spacing(3),
    },
  }),
);

  const  classes                      = useCheckboxStyles         ();
  const [summaryOpts, setSummaryOpts] = React            .useState({
    all                 : false,
    source_organisms    : false,
    rcsb_pdb_description: false,
    nucleotide_sequence : false,
    strand_id           : false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSummaryOpts({ ...summaryOpts, [event.target.name]: event.target.checked });
  };
  const {all,source_organisms, rcsb_pdb_description, nucleotide_sequence, strand_id} = summaryOpts;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const createSummary = ():any[][] =>{

  var bulkDownload:Array<Array<any>> = [
    ['parent_structure_rcsb_id'],...current_class_derived.map(r =>[ r.struct ])
  ]
          if ( summaryOpts.source_organisms ){
            bulkDownload[0].push("source_organisms")
            current_class_derived.map((v,i)=>bulkDownload[i+1].push(v.orgid))
          }

          if ( summaryOpts.rcsb_pdb_description ){
            bulkDownload[0].push("rcsb_descriptions")
            current_class_derived.map((v,i)=>bulkDownload[i+1].push(v.description))
          }

          if ( summaryOpts.nucleotide_sequence ){
            bulkDownload[0].push("nucleotide_sequence")
            current_class_derived.map((v,i)=>bulkDownload[i+1].push(v.seq))
          }

          if ( summaryOpts.strand_id ){
            bulkDownload[0].push("in-structure_strand_id")
            current_class_derived.map((v,i)=>bulkDownload[i+1].push(v.strand))
          }
    return bulkDownload
  }

  return (
    <div style={{width:"100%"}}>
      <Button 
      variant = "outlined"
      style   = {{width:"100%", color:"black", textTransform:"none"}}
      color   = "primary"
      onClick = {handleClickOpen}>
        Download (<i>{current_class_derived.length} strands  </i>)
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
            control={<Checkbox checked={all} onChange={()=>setSummaryOpts({
              all                 : !all,
              nucleotide_sequence : !all,
              source_organisms    : !all,
              rcsb_pdb_description: !all,
              strand_id           : !all
              })} name="all" />}
            label="All Options"
          />
          <FormControlLabel
            control={<Checkbox checked={nucleotide_sequence} onChange={handleChange} name="nucleotide_sequence" />}
            label="Nucleotide Sequence"
          />
          <FormControlLabel
            control={
            <Checkbox checked={source_organisms} onChange={handleChange} name="organisms" />}
            label="Source Organisms"
          />
          <FormControlLabel
            control={<Checkbox checked={rcsb_pdb_description} onChange={handleChange} name="rcsb_pdb_description" />}
            label="Description"
          />
          <FormControlLabel
            control = {<Checkbox checked={strand_id} onChange={handleChange} name="strand_id" />}
            label   = "Strand ID (Structure-specific identifier)"
          />

        </FormGroup>
        <FormHelperText>You have {current_class_derived.length} strands in scope.</FormHelperText>
      </FormControl>																									
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



type  ReduxProps                        = {rna_strands: RNAProfile[], current_page: number, page_total:number}
type  DispatchProps                     = {gotopage: (pid:number)=>void}
const RNACatalogue: React.FC<ReduxProps & DispatchProps> = (prop) => {



  const dispatch = useDispatch();


  const [search, setSearch] = useState<string>("")
  useEffect(() => { dispatch(RnaClassFilterChangeAC(search, "SEARCH")) }, [search])
  const handleSearchChange = (e: any) => {
    var change = e.target.value
    setSearch(change)
  }
  const [rnaSubgroup  , setRnaSubgrop] = useState   <'exogenous' | 'ribosomal' | 'other'>('ribosomal'                                                       )
  const  pages_total                   = useSelector                                     ((state: AppState) => state.rna.pages_total                        )
  const  current_class                 = useSelector                                     ((state: AppState) => state.rna.current_rna_class                  )
  const  current_page                  = useSelector                                     ((state: AppState) => state.rna.current_page                       )
  const  currclass                     = useSelector                                     (( state:AppState ) => state.rna.rna_classes_derived[current_class])
  const  other                         = useSelector                                     ((state: AppState) => state.rna.rna_classes_derived.other          )

const filters = useSelector((state: AppState) => state.rna.rna_filters.applied)

//   * ----------taxonomic filter -----

const [ data, setDropdownData ] = useState([
{ "label": "Bacteria"            , "value": [1977881 , 243230, 562, 224308, 574, 262724, 585, 474186, 575584, 1217649, 544404, 663, 1217710, 421052, 367830, 1772, 1773, 1280, 274, 1299, 287, 300852, 1351, 585035, 1144663, 1144670, 331111, 480119, 83333, 93061, 83334, 93062, 1931, 1223565, 52133, 1310637, 246196, 679895, 470, 1310678, 1960940], "checked": false ,  "children": [{"label": "Acinetobacter sp. ANC 4470", "value": [1977881], "checked": false}, {"label": "Deinococcus radiodurans R1", "value": [243230], "checked": false}, {"label": "Escherichia coli", "value": [562], "checked": false}, {"label": "Bacillus subtilis subsp. subtilis str. 168", "value": [224308], "checked": false}, {"label": "Klebsiella pneumoniae subsp. ozaenae", "value": [574], "checked": false}, {"label": "Thermus thermophilus HB27", "value": [262724], "checked": false}, {"label": "Proteus vulgaris", "value": [585], "checked": false}, {"label": "Enterococcus faecalis OG1RF", "value": [474186], "checked": false}, {"label": "Acinetobacter baumannii ATCC 19606 = CIP 70.34 = JCM 6841", "value": [575584], "checked": false}, {"label": "Acinetobacter beijerinckii ANC 3835", "value": [1217649], "checked": false}, {"label": "Escherichia coli O157:H7 str. TW14359", "value": [544404], "checked": false}, {"label": "Vibrio alginolyticus", "value": [663], "checked": false}, {"label": "Acinetobacter sp. NIPH 899", "value": [1217710], "checked": false}, {"label": "Acinetobacter rudis CIP 110305", "value": [421052], "checked": false}, {"label": "Staphylococcus aureus subsp. aureus USA300", "value": [367830], "checked": false}, {"label": "Mycolicibacterium smegmatis", "value": [1772], "checked": false}, {"label": "Mycobacterium tuberculosis", "value": [1773], "checked": false}, {"label": "Staphylococcus aureus", "value": [1280], "checked": false}, {"label": "Thermus thermophilus", "value": [274], "checked": false}, {"label": "Deinococcus radiodurans", "value": [1299], "checked": false}, {"label": "Pseudomonas aeruginosa", "value": [287], "checked": false}, {"label": "Thermus thermophilus HB8", "value": [300852], "checked": false}, {"label": "Enterococcus faecalis", "value": [1351], "checked": false}, {"label": "Escherichia coli S88", "value": [585035], "checked": false}, {"label": "Acinetobacter sp. CIP 102082", "value": [1144663], "checked": false}, {"label": "Acinetobacter sp. CIP 51.11", "value": [1144670], "checked": false}, {"label": "Escherichia coli O139:H28 str. E24377A", "value": [331111], "checked": false}, {"label": "Acinetobacter baumannii AB0057", "value": [480119], "checked": false}, {"label": "Escherichia coli K-12", "value": [83333], "checked": false}, {"label": "Staphylococcus aureus subsp. aureus NCTC 8325", "value": [93061], "checked": false}, {"label": "Escherichia coli O157:H7", "value": [83334], "checked": false}, {"label": "Staphylococcus aureus subsp. aureus COL", "value": [93062], "checked": false}, {"label": "Streptomyces sp.", "value": [1931], "checked": false}, {"label": "Rhizobium sp. Pop5", "value": [1223565], "checked": false}, {"label": "Acinetobacter venetianus", "value": [52133], "checked": false}, {"label": "Acinetobacter sp. 809848", "value": [1310637], "checked": false}, {"label": "Mycolicibacterium smegmatis MC2 155", "value": [246196], "checked": false}, {"label": "Escherichia coli BW25113", "value": [679895], "checked": false}, {"label": "Acinetobacter baumannii", "value": [470], "checked": false}, {"label": "Acinetobacter sp. 263903-1", "value": [1310678], "checked": false}, {"label": "Acinetobacter sp. ANC 5600", "value": [1960940], "checked": false}].sort()},
{ "label": "Eukaryota"           , "value": [9739    , 5661, 5693, 5702, 5722, 9823, 1177187, 3702, 55431, 37000, 5811, 9913, 559292, 9986, 7460, 28985, 4932, 285006, 7536, 9606, 209285, 9615, 6039, 284590, 1247190, 759272, 36329, 3562],                                                                                                             "checked": false ,  "children": [{"label": "Tursiops truncatus", "value": [9739], "checked": false}, {"label": "Leishmania donovani", "value": [5661], "checked": false}, {"label": "Trypanosoma cruzi", "value": [5693], "checked": false}, {"label": "Trypanosoma brucei brucei", "value": [5702], "checked": false}, {"label": "Trichomonas vaginalis", "value": [5722], "checked": false}, {"label": "Sus scrofa", "value": [9823], "checked": false}, {"label": "Saccharomyces cerevisiae P283", "value": [1177187], "checked": false}, {"label": "Arabidopsis thaliana", "value": [3702], "checked": false}, {"label": "Palomena prasina", "value": [55431], "checked": false}, {"label": "Pyrrhocoris apterus", "value": [37000], "checked": false}, {"label": "Toxoplasma gondii", "value": [5811], "checked": false}, {"label": "Bos taurus", "value": [9913], "checked": false}, {"label": "Saccharomyces cerevisiae S288C", "value": [559292], "checked": false}, {"label": "Oryctolagus cuniculus", "value": [9986], "checked": false}, {"label": "Apis mellifera", "value": [7460], "checked": false}, {"label": "Kluyveromyces lactis", "value": [28985], "checked": false}, {"label": "Saccharomyces cerevisiae", "value": [4932], "checked": false}, {"label": "Saccharomyces cerevisiae RM11-1a", "value": [285006], "checked": false}, {"label": "Oncopeltus fasciatus", "value": [7536], "checked": false}, {"label": "Homo sapiens", "value": [9606], "checked": false}, {"label": "Chaetomium thermophilum", "value": [209285], "checked": false}, {"label": "Canis lupus familiaris", "value": [9615], "checked": false}, {"label": "Vairimorpha necatrix", "value": [6039], "checked": false}, {"label": "Kluyveromyces lactis NRRL Y-1140", "value": [284590], "checked": false}, {"label": "Saccharomyces cerevisiae BY4741", "value": [1247190], "checked": false}, {"label": "Chaetomium thermophilum var. thermophilum DSM 1495", "value": [759272], "checked": false}, {"label": "Plasmodium falciparum 3D7", "value": [36329], "checked": false}, {"label": "Spinacia oleracea", "value": [3562], "checked": false}].sort()},
{ "label": "Archaea"             , "value": [311400  , 273057, 1293037, 2287, 69014, 272844],                                                                                                                                                                                                                                                             "checked": false ,  "children": [{"label": "Thermococcus kodakarensis", "value": [311400], "checked": false}, {"label": "Saccharolobus solfataricus P2", "value": [273057], "checked": false}, {"label": "Thermococcus celer Vu 13 = JCM 8558", "value": [1293037], "checked": false}, {"label": "Saccharolobus solfataricus", "value": [2287], "checked": false}, {"label": "Thermococcus kodakarensis KOD1", "value": [69014], "checked": false}, {"label": "Pyrococcus abyssi GE5", "value": [272844], "checked": false}].sort()},
])

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
  dispatch(RnaClassFilterChangeAC(selectedSpecies,"SPECIES"))
}, [selectedSpecies])


  return (
    <Grid container xs={12} spacing={1}>
      <Grid item xs={12}>
        <PageAnnotation {...pageData} />
      </Grid>

      <Grid container item xs={2}>
        <List>
          <ListItem key={"rps-searchfield"} >
            <TextField id="standard-basic" label="Search" value={search} onChange={handleSearchChange} />
          </ListItem>
          <ListItem>
            <DropdownTreeSelect data={data} onChange={onChange} keepOpenOnSelect={true} keepTreeOnSearch={true} keepChildrenOnSearch={true} />
          </ListItem>
          <ListItem>

<Button 
variant="outlined"
color="primary"
style={{textTransform:"none", width:"100%"}}

onClick={()=>{
  dispatch(sort_by_seqlen())
}}>
Sort By Sequence Length

</Button>

        </ListItem>
        <ListItem>
          <BulkDownloadMenu />
        </ListItem>
        <ListItem>
<Cart/>
        </ListItem>


        <DashboardButton />

      </List>
    </Grid>

    <Grid item xs={10} container spacing={1}>
      <Grid item xs={12}>
        <Paper style={{ padding: '5px', marginBottom: "5px", display: "flex", justifyItems: "spaceBetween" }} variant="elevation" elevation={0}>

          <Grid container spacing={2}>
            <Grid item>
              <Button style={{
                marginRight: "5px",
                textTransform: "none"
              }} variant={'outlined'}
                onClick={() => {
                  dispatch(select_rna_class("5"))
                  setRnaSubgrop('ribosomal')
                }}
                color={rnaSubgroup == 'ribosomal' ? 'primary' : 'default'}> Ribosomal RNA</Button>
            </Grid>

            <Grid item>
              <Button style={{ marginRight: "5px", textTransform: "none" }} variant={'outlined'} onClick={() => {
                setRnaSubgrop('exogenous')
                dispatch(select_rna_class("trna"))
              }}

                color={rnaSubgroup == 'exogenous' ? 'primary' : 'default'}> Non-ribosomal RNA</Button>
            </Grid>

            {/* <Grid item>
<Button style={{marginRight:"5px"}}variant = {'outlined'}  onClick={()=>{setRnaSubgrop('other')
              dispatch(select_rna_class("other"))
}}
color={ rnaSubgroup == 'other' ? 'primary' : 'default' }> Uncategorized Strands</Button>
  </Grid>  */}

            <Grid item xs={12}>


              <Pagination
                count={pages_total}
                page={current_page}
                variant="outlined"
                color="primary"
                onChange={(e, page) => { dispatch(gotopage_rna(page)) }} />

            </Grid>
          </Grid>
        </Paper>
        {((_: 'exogenous' | 'ribosomal' | 'other') => {
          switch (_) {
            case 'ribosomal':
              return (currclass.length == 0 && filters.length == 0) ? <LinearProgress /> : <RRNATabs tagname={'rrna'} />
            case 'exogenous':
              return (currclass.length == 0 && filters.length == 0) ? <LinearProgress /> : <ExogenousTabs tagname={'exo-rna'} />
            case 'other':
              return (currclass.length == 0 && filters.length == 0) ? <LinearProgress /> : <List>{other.slice((current_page - 1) * 20, current_page * 20).map(other => <ListItem><RNACard 
                
                displayPill={true}
                e={other} /></ListItem>)}</List>
            default:
              return <></>
          }
        })(rnaSubgroup)}

      </Grid>
    </Grid>
  </Grid>
);
};

const  ExogenousTabs= ({tagname}:{tagname:string})=> {

interface TabPanelProps {
children?: React.ReactNode;
index: any;
value: any;
}

function TabPanel(props: TabPanelProps) {
const { children, value, index, ...other } = props;
return (
  <div
    role            = "tabpanel"
    hidden          = {value !== index}
    id              = {`simple-tabpanel-${tagname}-${index}`}
    aria-labelledby = {`simple-tab-${tagname}-${index}`}
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
function a11yProps(index: any) {
  return {
    id             : `simple-tab-${tagname}-${index}`,
    'aria-controls': `simple-tabpanel-${tagname}-${index}`,
  };
}

const dispatch = useDispatch()
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));
const classes           = useStyles();
const [value, setValue] = React.useState(0);

const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {

  
  if (newValue === 0){
      dispatch(select_rna_class("trna"))
  }
  if (newValue === 1){
      dispatch(select_rna_class("mrna"))
  }
  setValue(newValue);
};
const indexlabels = [ [0,'tRNA'],[ 1,'mRNA' ] ];
const current_page = useSelector(( state:AppState ) => state.rna.current_page)

const whole   = useSelector(( state:AppState ) => state.rna.rna_classes_derived)

const [mrna, setmrna] = useState<RNAProfile[]>([])
const [trna, settrna] = useState<RNAProfile[]>([])

useEffect(() => {
settrna(whole.trna)
setmrna(whole.mrna)
}, [whole])



return (
  <div className={classes.root}>
      <Tabs value={value} onChange={handleChange}

      indicatorColor = "primary"
      aria-label     = "simple tabs">

        {
        indexlabels.map(i =>
        <Tab label = {<Typography style={{ textTransform:"none"}}>{i[1]} </Typography>}   {...a11yProps(i[0])} />)
          }

      </Tabs>

    <TabPanel value={value} index={0}>

      <List>
        {trna.slice(( current_page-1 )*20, current_page*20).map(trna => <ListItem><RNACard displayPill={true} e={trna}/></ListItem>)}
      </List>

    </TabPanel>

    <TabPanel value={value} index={1}>
      
      <List>
        {mrna.slice(( current_page-1 )*20, current_page*20).map(mrna => <ListItem><RNACard displayPill={true} e={mrna}/></ListItem>)}
      </List>
      </TabPanel>

  </div>
);
}

const  RRNATabs= ({tagname}:{tagname:string})=> {

interface TabPanelProps {
children?: React.ReactNode;
index: any;
value: any;
}

function TabPanel(props: TabPanelProps) {
const { children, value, index, ...other } = props;
return (
  <div
    role            = "tabpanel"
    hidden          = {value !== index}
    id              = {`simple-tabpanel-${tagname}-${index}`}
    aria-labelledby = {`simple-tab-${tagname}-${index}`}
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
function a11yProps(index: any) {
  return {
    id             : `simple-tab-${tagname}-${index}`,
    'aria-controls': `simple-tabpanel-${tagname}-${index}`,
  };
}

const dispatch          = useDispatch();
const [value, setValue] = React.useState(0);

const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
  if (newValue === 0){
      dispatch(select_rna_class("5"))
  }
  if (newValue === 1){
      dispatch(select_rna_class("5.8"))
  }
  if (newValue === 2){
      dispatch(select_rna_class("12"))
  }
  if (newValue === 3){
      dispatch(select_rna_class("16"))
  }
  if (newValue === 4){
      dispatch(select_rna_class("21"))
  }
  if (newValue === 5){
      dispatch(select_rna_class("23"))
  }
  if (newValue === 6){
      dispatch(select_rna_class("25"))
  }
  if (newValue === 7){
      dispatch(select_rna_class("28"))
  }
  if (newValue === 8){
      dispatch(select_rna_class("35"))
  }
  setValue(newValue);
};

const whole   = useSelector(( state:AppState ) => state.rna.rna_classes_derived)

const [classr5, setr5] = useState<RNAProfile[]>([])
const [classr5_8, setr5_8] = useState<RNAProfile[]>([])
const [classr12 , setr12 ] = useState<RNAProfile[]>([])
const [classr16 , setr16 ] = useState<RNAProfile[]>([])
const [classr21 , setr21 ] = useState<RNAProfile[]>([])
const [classr23 , setr23 ] = useState<RNAProfile[]>([])
const [classr25 , setr25 ] = useState<RNAProfile[]>([])
const [classr28 , setr28 ] = useState<RNAProfile[]>([])
const [classr35 , setr35 ] = useState<RNAProfile[]>([])

useEffect(() => {
setr5(whole[5])
setr5_8(whole["5.8"])
setr12(whole[12])
setr16(whole[16])
setr21(whole[21])
setr23(whole[23])
setr25(whole[25])
setr28(whole[28])
setr35(whole[35])

}, [whole])

const current_page = useSelector(( state:AppState ) => state.rna.current_page)

const indexlabels = [ 
  [5, '5S RNA'     ]
, [58, '5.8S RNA']
, [12, '12S RNA' ]
, [16, '16S RNA' ]
, [21, '21S RNA' ]
, [23, '23S RNA' ]
, [25, '25S RNA' ]
, [28, '28S RNA' ]
, [35, '35S RNA' ]
                  ];
return (
<>
      <Tabs 
              value          = {value}
              onChange       = {handleChange}
              indicatorColor = "primary"
              aria-label     = "simple tabs example"
              variant        = "scrollable"
              scrollButtons  = "auto"
      >
        {indexlabels.map(i =><Tab label = {<Typography style={{ textTransform:"none"}}>{i[1]} </Typography>}   {...a11yProps(i[0])} />)}
      </Tabs>

    <TabPanel value={value} index={0}>
      <List>
        {/* {r5.map(r=><div>{r.seq.length}</div>)} */}
        {classr5.slice(( current_page-1 )*20, current_page*20).map(rna => <ListItem><RNACard displayPill={true} e={rna}/></ListItem>)}
      </List>
    </TabPanel>

    <TabPanel value={value} index={1}>
      <List>
        {classr5_8.slice(( current_page-1 )*20, current_page*20).map(rna => <ListItem><RNACard displayPill={true} e={rna}/></ListItem>)}
      </List>
    </TabPanel>

    <TabPanel value={value} index={2}>
      <List>
        {classr12.slice(( current_page-1 )*20, current_page*20).map(rna => <ListItem><RNACard displayPill={true} e={rna}/></ListItem>)}
      </List>
    </TabPanel>
    <TabPanel value={value} index={3}>
      <List>
        {classr16.slice(( current_page-1 )*20, current_page*20).map(rna => <ListItem><RNACard displayPill={true} e={rna}/></ListItem>)}
      </List>
    </TabPanel>
    <TabPanel value={value} index={4}>
      <List>
        {classr21.slice(( current_page-1 )*20, current_page*20).map(rna => <ListItem><RNACard displayPill={true} e={rna}/></ListItem>)}
      </List>
    </TabPanel>
    <TabPanel value={value} index={5}>
      <List>
        {classr23.slice(( current_page-1 )*20, current_page*20).map(rna => <ListItem><RNACard displayPill={true} e={rna}/></ListItem>)}
      </List>
    </TabPanel>
    <TabPanel value={value} index={6}>
      <List>
        {classr25.slice(( current_page-1 )*20, current_page*20).map(rna => <ListItem><RNACard displayPill={true} e={rna}/></ListItem>)} 
      </List>
    </TabPanel>
    <TabPanel value={value} index={7}>
      <List>
        {classr28.slice(( current_page-1 )*20, current_page*20).map(rna => <ListItem><RNACard displayPill={true} e={rna}/></ListItem>)}
      </List>
    </TabPanel>

    <TabPanel value={value} index={8}>
      <List>
        {classr35.slice(( current_page-1 )*20, current_page*20).map(rna => <ListItem><RNACard displayPill={true} e={rna}/></ListItem>)}
      </List>
    </TabPanel>
</>
);
}

const mapdispatch = ( dispatch:Dispatch<AppActions>, ownprops:any):DispatchProps =>({
gotopage:(pid) => dispatch(gotopage_rna(pid))
})

export default connect(null, mapdispatch)( RNACatalogue );// 

