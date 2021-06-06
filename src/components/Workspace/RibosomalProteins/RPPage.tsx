import React, { useEffect, useState } from                                                "react"                                                ;
import                                                                                    "./RPPage.css"                                         ;
import { useParams } from                                                                 "react-router-dom"                                     ;
import { AppState } from                                                                  "../../../redux/store"                                 ;
import { AppActions } from                                                                "../../../redux/AppActions"                            ;
import { gotopage, nextpage, prevpage, ProteinClassFilterChangeAC, requestBanClass } from "../../../redux/reducers/Proteins/ActionTypes"         ;
import { ThunkDispatch } from                                                             "redux-thunk"                                          ;
import { connect, useDispatch, useSelector } from                                         "react-redux"                                          ;
import Pagination from                                                                    './../Display/Pagination'
import Grid from                                                                          "@material-ui/core/Grid"                               ;
import { _SpecList, _SearchField } from                                                   "../Display/StructuresCatalogue"                       ;
import List from                                                                          "@material-ui/core/List"                               ;
import ListItem from                                                                      "@material-ui/core/ListItem"                           ;
import RibosomalProteinCard from                                                          './RibosomalProteinCard'
import Typography from                                                                    "@material-ui/core/Typography"                         ;
import { DashboardButton } from                                                           "../../../materialui/Dashboard/Dashboard"              ;
import { Cart } from                                                                          "./../../Workspace/Cart/Cart"                          ;
import { RibosomalProtein } from                                                          "../../../redux/RibosomeTypes"                         ;
import Backdrop from                                                                      "@material-ui/core/Backdrop"                           ;
import _ from                                                                             "lodash"                                               ;
import DropdownTreeSelect from                                                            "react-dropdown-tree-select"                           ;
import TextField from                                                                     "@material-ui/core/TextField"                          ;
import { makeStyles } from                                                                "@material-ui/core/styles"                             ;
import { Theme } from                                                                     "@material-ui/core/styles/createMuiTheme"              ;
import createStyles from                                                                  "@material-ui/core/styles/createStyles"                ;
import Button from                                                                        "@material-ui/core/Button/Button"                      ;
import Dialog from                                                                        "@material-ui/core/Dialog/Dialog"                      ;
import DialogTitle from                                                                   "@material-ui/core/DialogTitle/DialogTitle"            ;
import FormControl from                                                                   "@material-ui/core/FormControl/FormControl"            ;
import DialogContent from                                                                 "@material-ui/core/DialogContent/DialogContent"        ;
import FormControlLabel from                                                              "@material-ui/core/FormControlLabel/FormControlLabel"  ;
import FormGroup from                                                                     "@material-ui/core/FormGroup/FormGroup"                ;
import Checkbox from                                                                      "@material-ui/core/Checkbox/Checkbox"                  ;
import FormLabel from                                                                     "@material-ui/core/FormLabel/FormLabel"                ;
import FormHelperText from                                                                "@material-ui/core/FormHelperText/FormHelperText"      ;
import { CSVLink } from                                                                   "react-csv"                                            ;
import Divider from                                                                       "@material-ui/core/Divider/Divider"                    ;
import DialogContentText from                                                             "@material-ui/core/DialogContentText/DialogContentText";






const BulkDownloadMenu=()=> {
  const [open, setOpen] = React.useState(false);
  const proteins        = useSelector(( state:AppState ) => state.proteins.ban_class_derived)

const useCheckboxStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(3),
    },
  }),
);
  const classes = useCheckboxStyles();


  const [summaryOpts, setSummaryOpts] = React.useState({
            all                             : false,
            pfam_accessions                 : false,
            rcsb_source_organism_id         : false,
            rcsb_source_organism_description: false,
            uniprot_accession               : false,
            rcsb_pdbx_description           : false,
            entity_poly_strand_id           : false,
            entity_poly_seq_one_letter_code : false,
            entity_poly_seq_length          : false,
            nomenclature                    : false,
  });
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSummaryOpts({ ...summaryOpts, [event.target.name]: event.target.checked });
  };

  const {     all                             ,
              pfam_accessions                 ,
              rcsb_source_organism_id         ,
              rcsb_source_organism_description,
              uniprot_accession               ,
              rcsb_pdbx_description           ,
              entity_poly_strand_id           ,
              entity_poly_seq_one_letter_code ,
              entity_poly_seq_length          ,
              nomenclature
      } =     summaryOpts                     ;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const createSummary = ():any[][] =>{

  var bulkDownload:Array<Array<any>> = [
    ['parent_struct_rcsb_id'],
    ...proteins.map(r =>[ r.parent_rcsb_id ])
  ]
    bulkDownload[0].push("pfam_accessions")
    proteins.map((v,i) => bulkDownload[i+1].push(v.pfam_accessions))
    bulkDownload[0].push("source_organisms_id")
    proteins.map((v,i) => bulkDownload[i+1].push(v.rcsb_source_organism_id))
    bulkDownload[0].push("source_organisms_description")
    proteins.map((v,i) => bulkDownload[i+1].push(v.rcsb_source_organism_description))
    bulkDownload[0].push("uniprot_accession")
    proteins.map((v,i) => bulkDownload[i+1].push(v.uniprot_accession))
    bulkDownload[0].push("rcsb_description")
    proteins.map((v,i) => bulkDownload[i+1].push(v.rcsb_pdbx_description))
    bulkDownload[0].push("strand_id(in-structure_identifier)")
    proteins.map((v,i) => bulkDownload[i+1].push(v.entity_poly_strand_id))
    bulkDownload[0].push("sequence_one_letter_code")
    proteins.map((v,i) => bulkDownload[i+1].push(v.entity_poly_seq_one_letter_code))
    bulkDownload[0].push("seq_length")
    proteins.map((v,i) => bulkDownload[i+1].push(v.entity_poly_seq_length))
    bulkDownload[0].push("universal_rp_nomeclature")
    proteins.map((v,i) => bulkDownload[i+1].push(v.nomenclature))

    return bulkDownload
  }

  return (
    <div style={{width:"100%"}}>
      <Button variant="outlined" style={{width:"100%", textTransform:"none", color:"black"}} color="primary" onClick={handleClickOpen}>
        Download ({proteins.length} strands)
      </Button>



      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">

        <DialogTitle id="form-dialog-title">  Export Options: you have {proteins.length} strands in scope.</DialogTitle>
        <DialogContent>

          <DialogContentText style={{ marginTop: "10px" }}>
          <Typography variant="h5">Download Summary Spreadsheet </Typography>
          A <i>.csv</i> summary of the strands that you have filtered will be downloaded.
          </DialogContentText>

          <CSVLink data={createSummary()}>
            <Button onClick={handleClose} color="primary">
              Download Summary (.csv)
          </Button>
          </CSVLink>

<List>
<Divider/>
</List>
          <DialogContentText style={{ marginTop: "10px"}} >
          <Typography variant="h5">Download Whole Models</Typography>
            Filtered models of the whole ribosome structures that you have filtered will be packed into a <i>.zip</i> archive and downloaded.
          </DialogContentText>

          <Button onClick={handleClose} color="primary">
            Download Model Strands (.zip)
          </Button>

        </DialogContent>
      </Dialog>
    </div>
  );
}


interface ReduxProps{
  current_rps      : RibosomalProtein[]
  pagestotal       :  number
  currentpage      :  number
}

interface DispatchProps{
  requestBanClass  :  (banClassString:string)=> void
  goto_page        :  (pid:number)=>void;
  next_page        :  ()=>void;
  prev_page        :  ()=>void;
}

type  RPPageProps                  = ReduxProps &  DispatchProps
const RPPage:React.FC<RPPageProps> = (prop) => {

var params: any = useParams();
var nameparam   = params.nom
var className   = nameparam.slice(0,1).toLowerCase() + nameparam.slice(1,2).toUpperCase() + nameparam.slice(2)
var isloading =  useSelector(( state:AppState ) => state.proteins.is_loading)


useEffect(() => {
  
  dispatch(requestBanClass(nameparam,false))


}, [nameparam])
const proteins      = useSelector((state: AppState) => state.proteins.ban_class_derived)
var   bulkDownloads = [["rcsb_id", "strand", "nomenclature", "sequence"]]
proteins.map(prot => bulkDownloads.push([prot.parent_rcsb_id, prot.entity_poly_strand_id, prot.nomenclature[0] || "Unspecified", prot.entity_poly_seq_one_letter_code]))





  // * -------tax filter --------

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
  // * -------tax filter --------

const dispatch = useDispatch();

const [selectedSpecies, setSelectedSpecies] = useState<any>([])
useEffect(() => {
  dispatch(ProteinClassFilterChangeAC(selectedSpecies,"SPECIES"))
}, [selectedSpecies])



    const [search, setSearch] = useState<string>("")
    useEffect(() => {
        dispatch(ProteinClassFilterChangeAC(search, "SEARCH"))
    }, [search])

    const handleSearchChange = (e:any) =>{
        var change = e.target.value
        setSearch(change)
    }
  return !isloading ? (
    <Grid xs={12} container>
      <Grid item container xs={12} >
        <Typography variant="h3" style={{ padding: "20px" }}>
          Ribosomal Protein Class {className}
        </Typography>
      </Grid>

      <Grid item container xs={12} spacing={2}>

        <Grid item container xs={2} direction="column">
          <List>

            <ListItem key={"rps-searchfield"} >

              <TextField id="standard-basic" label="Search" value={search} onChange={handleSearchChange} />

            </ListItem>
            <ListItem>

              <DropdownTreeSelect data={data}
                onChange={onChange}
                keepOpenOnSelect={true}
                keepTreeOnSearch={true}
                keepChildrenOnSearch={true}
              />

            </ListItem>
            <ListItem>
              <Pagination
                {...{ gotopage: prop.goto_page, pagecount: prop.pagestotal }}
              />
            </ListItem>
            <ListItem>
              <Cart />
            </ListItem>
            <ListItem key={"rps-searchfield"} >
              <BulkDownloadMenu />
            </ListItem>
            <ListItem>
              <DashboardButton />
            </ListItem>
          </List>
        </Grid>

        <Grid item container direction="row" spacing={1} xs={10} alignContent="flex-start" alignItems="flex-start">

           
          <Grid item xs={12}>  
          </Grid>
          
          {prop.current_rps
            .slice((prop.currentpage - 1) * 20, prop.currentpage * 20)
            .map((protein: RibosomalProtein) => {
              return (
                <Grid item xs={12}>
                  <RibosomalProteinCard displayPill={true}protein={ protein }  />
                </Grid>
              );
            })}
        </Grid>
      </Grid>
    </Grid>
  ) : (
    <Backdrop open={true} 
    />
  );
};

const mapstate = (
  appstate:AppState,
  ownProps:any
):ReduxProps =>( {
  current_rps  :  appstate.proteins.ban_class_derived,
  pagestotal   :  appstate.proteins.pages_total,
  currentpage  :  appstate.proteins.current_page
})

const mapdispatch = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  ownProps:any):DispatchProps =>({
    requestBanClass: (banclass)=>dispatch(requestBanClass(banclass, false)),
    goto_page      : (pid)=>dispatch(gotopage(pid)),
    next_page      : ()=>dispatch(nextpage()),
    prev_page      : ()=>dispatch(prevpage()),
    
  })






export default connect(mapstate,mapdispatch)( RPPage );
