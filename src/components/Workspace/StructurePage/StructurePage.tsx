import   React         , { useEffect, useState } from "react"                        ;
import { Link          , Route, useParams }      from "react-router-dom"             ;
import   VisibilityIcon                          from '@material-ui/icons/Visibility';

import {
  Ligand,
  RibosomalProtein,
  RibosomeStructure,
  rRNA,
} from "../../../redux/RibosomeTypes";

import                                            "./StructurePage.css"                          ;
import { getNeo4jData } from                      "../../../redux/AsyncActions/getNeo4jData"     ;
import { flattenDeep } from                       "lodash"                                       ;
import { connect, useDispatch, useSelector } from "react-redux"                                  ;
import { AppState } from                          "../../../redux/store"                         ;
import { useHistory } from                        'react-router-dom'                             ;
import { ThunkDispatch } from                     "redux-thunk"                                  ;
import { AppActions } from                        "../../../redux/AppActions"                    ;
import LoadingSpinner from                        './../../Other/LoadingSpinner'
import { Tooltip } from                           "react-bootstrap"                              ;
import { OverlayTrigger } from                    "react-bootstrap"                              ;
import Card from                                  "@material-ui/core/Card"                       ;
import CardContent from                           "@material-ui/core/CardContent"                ;
import Grid from                                  "@material-ui/core/Grid"                       ;
import Typography from                            "@material-ui/core/Typography"                 ;
import CardActions from                           "@material-ui/core/CardActions"                ;
import Button from                                "@material-ui/core/Button"                     ;
import Popover from                               "@material-ui/core/Popover"                    ;
import { makeStyles, Theme } from                        "@material-ui/core/styles"                     ;
import { DashboardButton } from                   "../../../materialui/Dashboard/Dashboard"      ;
import RibosomalProteinCard from                  "../RibosomalProteins/RibosomalProteinCard"    ;
import CardMedia from                             '@material-ui/core/CardMedia'                  ;
import CardActionArea from                        '@material-ui/core/CardActionArea'             ;
import List from                                  "@material-ui/core/List"                       ;
import ListItem from                              "@material-ui/core/ListItem"                   ;
import fileDownload from                          "js-file-download"                             ;
import ExpandLess from                            '@material-ui/icons/ExpandLess'                ;
import ExpandMore from                            '@material-ui/icons/ExpandMore'                ;
import Collapse from                              "@material-ui/core/Collapse"                   ;
import CardHeader from                            "@material-ui/core/CardHeader"                 ;
import SimpleBackdrop from                        "../Backdrop"                                  ;
import { struct_page_choice } from                "../../../redux/reducers/Interface/ActionTypes";
import BookmarkIcon from                          '@material-ui/icons/Bookmark'                  ;
import GetAppIcon from                            '@material-ui/icons/GetApp'                    ;
import { RNACard } from                           "../RNA/RNACard"                               ;
import { cart_add_item } from                     "../../../redux/reducers/Cart/ActionTypes"     ;
import { RNAProfile } from "../../../redux/DataInterfaces";
import { Cart } from "../Cart/Cart";

 export const CardBodyAnnotation =({ keyname,value,onClick }:{keyname:string,onClick?:any, value:string| string[]|number})=>{

  const classes=makeStyles({  
            annotation: { fontSize: 12, },
          })();
  return     <ListItem onClick={onClick}><Grid
      container
      direction="row"
      justify="space-between"
      alignItems="center"
      component="div"    >
      <Typography variant="caption"  color="textSecondary" component="p" className={classes.annotation}>
        {keyname}:
            </Typography>
      <Typography variant="caption" color="textPrimary" component="p" 
      
        className={classes.annotation}
      >
        {value}
      </Typography>
    </Grid></ListItem>
  }

interface OwnProps {}
interface ReduxProps {
  globalFilter: string;
}
interface DispatchProps {}
const MethodSwitch = (r: RibosomeStructure) => {
  var record;
  if (r.expMethod.toUpperCase() === "X-RAY DIFFRACTION") {
    record = {
      diffrn_source_details: r.diffrn_source_details,
      diffrn_source_pdbx_synchrotron_beamline:
        r.diffrn_source_pdbx_synchrotron_beamline,
      diffrn_source_pdbx_synchrotron_site:
        r.diffrn_source_pdbx_synchrotron_site,
      diffrn_source_pdbx_wavelength: r.diffrn_source_pdbx_wavelength,
      diffrn_source_pdbx_wavelength_list: r.diffrn_source_pdbx_wavelength_list,
      diffrn_source_source: r.diffrn_source_source,
      diffrn_source_type: r.diffrn_source_type,
    };
  } else if (r.expMethod.toUpperCase() === "ELECTRON MICROSCOPY") {
    record = {
      cryoem_exp_detail: r.cryoem_exp_detail,
      cryoem_exp_algorithm: r.cryoem_exp_algorithm,
      cryoem_exp_resolution_method: r.cryoem_exp_resolution_method,
      cryoem_exp_resolution: r.cryoem_exp_resolution,
      cryoem_exp_num_particles: r.cryoem_exp_num_particles,
      cryoem_exp_magnification_calibration:
        r.cryoem_exp_magnification_calibration,
    };
  } else {
    record = {};
  }

  return (
    <table className="methods-table">
      Experimental Method Data
      {Object.entries(record).map(entry => (
        <tr>
          <td>{entry[0]}</td>
          <td>{entry[1]}</td>
        </tr>
      ))}
    </table>
  );
};



export const LigandHeroCard = ({lig}:{ lig:Ligand }) =>{

  const history = useHistory()
  const ligcardstyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display  : 'inline-block',
    margin   : '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
})();

  return ( <Card className = {ligcardstyles.root} elevation={2}>
                      <CardContent>
                        <Typography className = {ligcardstyles.pos} color = "textSecondary">{lig.chemicalId}</Typography>
                        <Typography variant = "body2" component = "p">
                          {lig.pdbx_description}
                        </Typography>
                        <Typography className = {ligcardstyles.title} color = "textSecondary" gutterBottom>
                          Formula Weight: {lig.formula_weight}
                        </Typography>
                        {/* <Typography className = {ligcardstyles.title} color = "textSecondary" gutterBottom>
                          Residues ID: {lig.cif_residueId ? lig.cif_residueId : "not available"}
                        </Typography> */}
                      </CardContent>
                      <CardActions>
                        <Button onClick={()=>{history.push(`/bindingsites`)}} size = "small">Binding Sites</Button>
                      </CardActions>
                    </Card> )
}


export const StructHeroCard =({rcsb_id}:{ rcsb_id:string })=>{
  
  const classes = ( makeStyles((theme:Theme)=>({
    card: {
      padding: "5px"
    },
    title: {
      fontSize: 14,
      height: 300
    },
    heading: {
      fontSize: 12,
      paddingTop: 5,
    },
    annotation: { fontSize: 12, },
    authors: {
      transition: "0.1s all",
      "&:hover": {
        background: "rgba(149,149,149,1)",
        cursor: "pointer",
      },
    },
    nested: {
      paddingLeft: 20,
      color: "black"
    }
  })) )()



  const [structdata, setstructdata] = useState<GetStructResponseShape>({} as GetStructResponseShape) 

  useEffect(() => {

  getNeo4jData("neo4j",{endpoint:"get_struct",params:{
    pdbid:rcsb_id
  }}).then(r=>{
    console.log("got response", r.data[0]);
    setstructdata(r.data[0])
  }, e=>{
    console.log("errored out requesting struct", e);
  })
  



}, [])

  const dispatch               = useDispatch()
  const history                = useHistory()
  const [authorsOpen, setOpen] = React.useState(false);
  const handleAuthorsToggle    = () => {
    setOpen(!authorsOpen);
  };

  return structdata.structure !== undefined ? (
    <Card>
          <CardHeader
            title     = {`${structdata.structure.rcsb_id}`}
            subheader = {structdata.structure._organismName}
          />
          <CardActionArea>
            <CardMedia
              image     = {process.env.PUBLIC_URL + `/ray_templates/_ray_${structdata.structure.rcsb_id.toUpperCase()}.png`}
              // title     = { `${structdata.rcsb_id}\n${structdata.citation_title}` }
              className = {classes.title}
            />
          </CardActionArea>
          <List>
            <CardBodyAnnotation keyname="Species" value={structdata.structure._organismName} />
            <CardBodyAnnotation keyname="Resolution" value={`${ structdata.structure.resolution } Å`} />
            <OverlayTrigger
              key="bottom-overlaytrigger"
              placement="bottom"
              overlay={
                <Tooltip
                  style     = {{ backgroundColor: "black" }}
                  className = "tooltip-bottom"
                  id        = "tooltip-bottom"
                >

                  <MethodSwitch {...structdata.structure} />
                </Tooltip>
              }
            >
              < CardBodyAnnotation keyname="Experimental Method" value={structdata.structure.expMethod} />
            </OverlayTrigger>
            < CardBodyAnnotation keyname="Title" value={structdata.structure.citation_title} />

            <ListItem onClick={handleAuthorsToggle}><Grid
              container
          direction="row"
          justify="space-between"
          alignItems="center"
          component="div"
          className={classes.authors}
            >
              <Typography variant="caption" color="textSecondary" component="p" className={classes.annotation}>
                Authors
            </Typography>
              {authorsOpen ? <ExpandLess /> : <ExpandMore />}
            </Grid></ListItem>
            <Collapse in={authorsOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {structdata.structure.citation_rcsb_authors.length > 1
                  ? structdata.structure.citation_rcsb_authors.map(author =>
                    <ListItem button className={classes.nested}>
                      <Typography variant="caption" color="textSecondary" component="p" className={classes.nested}>
                        {author}
                      </Typography>
                    </ListItem>
                  )
                  : structdata.structure.citation_rcsb_authors[0]}
              </List>
            </Collapse>

            < CardBodyAnnotation keyname="Year" value={structdata.structure.citation_year} />
          </List>
          <CardActions>
            <Grid container> 
            <Grid item container justify="space-evenly" direction="row" xs={12}>

              <Grid item>

                <Button size="small" color="primary">
                  <a href={ `https://www.rcsb.org/structure/${structdata.structure.rcsb_id}` }>
                  PDB
                  </a>
            </Button>
              </Grid>
              <Grid item>
                <Button size="small" color="primary">
                  <a href={
                    
                    structdata.structure.rcsb_external_ref_link[0]
                     }>
                  EMD
                  </a>
            </Button>
              </Grid>
              <Grid item>
                <Button size="small" color="primary">
                  <a href={
                     `https://doi.org/${structdata.structure.citation_pdbx_doi}`
                     }>
                  DOI
                  </a>
            </Button>
              </Grid>
            </Grid>
            <Grid item container justify="space-evenly" direction="row" xs={12}>

              <Grid item>

                <Button 
                size="small"
                style={{textTransform:"none"}}
                
                onClick={() => { history.push({ pathname: `/vis`, state: { struct: structdata.structure.rcsb_id } }) }}>
                  <VisibilityIcon />
          Visualize
          </Button>
              </Grid>
              <Grid item>
                <Button
                size="small"
                style={{textTransform:"none"}}
                
                onClick={()=>{
                  dispatch(cart_add_item(structdata.structure))
                }}>
<BookmarkIcon/>
Add To Workspace
          </Button>
              </Grid>

              <Grid item>
                <Button
                size="small"
                style={{textTransform:"none"}}
                
                onClick={()=>{

                  getNeo4jData("static_files",{endpoint:"download_structure",params:{struct_id:structdata.structure.rcsb_id}})
                  .then(r=>{

                    fileDownload(
                      r.data,
                      `${structdata.structure.rcsb_id}.cif`,
                      "chemical/x-mmcif"
                    )
                  })

                }}>
Download 
<GetAppIcon/>
          </Button>
              </Grid>

 </Grid>           </Grid>
          </CardActions>
        </Card>

  ): null

}

        export type GetStructResponseShape = {
          structure  :  RibosomeStructure;
          ligands    :  Ligand[];
          rnas       :  rRNA[];
          rps        :  RibosomalProtein[];
        };
type StructurePageProps = OwnProps & ReduxProps & DispatchProps;
const StructurePage: React.FC<StructurePageProps> = (
  props: StructurePageProps
) => {

  const { pdbid }: { pdbid: string }  =  useParams();
  const [structdata, setstruct]       =  useState<RibosomeStructure>();
  const [protdata, setprots]          =  useState<RibosomalProtein[]>([]);
  const [rrnas, setrrnas]             =  useState<rRNA[]>([]);
  const [ligands, setligands]         =  useState<Ligand[]>([]);
  const [ions, setions]               =  useState(true);

  const activecat                     =  useSelector(( state:AppState ) => state.Interface.structure_page.component)
  

  useEffect(() => {
    getNeo4jData("neo4j", {
      endpoint: "get_struct",
      params: { pdbid: pdbid },
    }).then(
      resp => {
        const respdat: GetStructResponseShape = flattenDeep(
          resp.data
        )[0] as GetStructResponseShape;


        setstruct(respdat.structure);
        setprots(respdat.rps);
        setrrnas(respdat.rnas);
        setligands(respdat.ligands);

      },

      err => {
        console.log("Got error on /neo request", err);
      }
    );

  }, [pdbid]);

  const [lsu, setlsu]     = useState<RibosomalProtein[]>([])
  const [ssu, setssu]     = useState<RibosomalProtein[]>([])
  const [other, setother] = useState<RibosomalProtein[]>([])



  useEffect(() => {

    var lsu   = protdata.filter(x=> x.nomenclature.length === 1 && flattenDeep(x.nomenclature.map(name => { return name.match(/L/)})).includes('L') )
    var ssu   = protdata.filter(x=> x.nomenclature.length === 1 && flattenDeep(x.nomenclature.map(name => { return name.match(/S/)})).includes('S'))
    var other = protdata.filter(x=> ![...lsu,...ssu].includes(x))

    setlsu(lsu)
    setssu(ssu)
    setother(other)

  }, [protdata])


  const renderSwitch = (activecategory: string) => {
    
    switch (activecategory) {
      case "protein":
        return (
          lsu.length < 1 ? <SimpleBackdrop/> :
          <Grid  item container  spacing={1}>

            <Grid item justify="flex-start" alignItems='flex-start' alignContent='flex-start' container xs={4} spacing={1}>
              <Grid item xs={12} style={{ paddingTop: "10px" }} >
                <Typography color="primary" variant="h4">

                  LSU Proteins
              </Typography>
              </Grid>

              {lsu.map(protein => {

                return <Grid item xs={12}>
                  <RibosomalProteinCard  displayPill={false} protein={protein} />
                </Grid>
              })}

            </Grid>
            <Grid item justify="flex-start" alignItems='flex-start' container alignContent='flex-start' xs={4} spacing={1}>
              <Grid item xs={12} style={{ paddingTop: "10px" }} >
                <Typography color="primary" variant="h4">

                  SSU Proteins
              </Typography>
              </Grid>
              {ssu.map(protein => {
                return <Grid item xs={12}>
                  <RibosomalProteinCard displayPill={false} protein={protein} />
                </Grid>
              })}

            </Grid>
            <Grid item justify="flex-start" alignItems='flex-start' alignContent='flex-start' container xs={4} spacing={1}>
              <Grid item xs={12} style={{ paddingTop: "10px" }} >
                <Typography color="primary" variant="h4">

                  Other/Unclassified
              </Typography>
              </Grid>
              {other.map(protein => {
                return <Grid item xs={12}>
                  <RibosomalProteinCard  displayPill={false} protein={protein} />
                </Grid>
              })}

            </Grid>
          </Grid>
        );
      case "rna":

      return (

        <Grid item container    spacing={1}>
          {
          rrnas.map( obj => (
          <Grid item xs={12}>
            <RNACard e={{
description      : obj.rcsb_pdbx_description as string,
orgid            : obj.rcsb_source_organism_id,
seq              : obj.entity_poly_seq_one_letter_code,
strand           : obj.entity_poly_strand_id,
struct           : obj.parent_rcsb_id,
parent_method    : structdata!.expMethod,
parent_resolution: structdata!.resolution,
parent_citation  : structdata!.citation_title,
parent_year      : structdata!.citation_year
            }} 
            
            displayPill={false}/>
            </Grid>
          ))}
        </Grid>
        );

      case "ligand":

        return (
        <Grid item container    spacing={1}>

<Grid container item xs={12}>


<Grid item>

<Typography>Hide Ions:</Typography>
</Grid>
<Grid item>

</Grid>
              <input type="checkbox" 
                onChange={() => {
                  setions(!ions);
                }}
              />
</Grid>


            {
              ligands.filter(lig => {
                return ions ? true : !lig.chemicalName.includes("ION");
              })
                .map(lig => (
                  <Grid item>
                    <LigandHeroCard lig={lig}/>
        </Grid>
              ))}

          

            

          </Grid>
        );

      default:
        return "Something went wrong";
    }
  };
  const dispatch = useDispatch();

  const classes=makeStyles({  
            card: {
              // width:300
            },
            title: {
              fontSize: 14,
              height  : 300
            },
            heading: {
              fontSize  : 12,
              paddingTop: 5,
            },
            annotation: { fontSize: 12, },
            authors   : {
                transition: "0.1s all",
                "&:hover" : {
                  background: "rgba(149,149,149,1)",
                  cursor    : "pointer",
              },
            },

            nested:{
              paddingLeft: 20,
              color      : "black"
            }
          })();



  const [authorsOpen, setOpen] = React.useState(false);
  const handleAuthorsToggle = () => {
    setOpen(!authorsOpen);
  };


  return structdata ? (
    <Grid xs={12} container item spacing={2} style={{ padding: "5px" }}>
      <Grid xs={3} container item alignContent="flex-start" spacing={2}>
        <StructHeroCard rcsb_id={structdata.rcsb_id}/>
        <Grid item>

        <Cart/>
        </Grid>
        <Grid item>
        <DashboardButton />
        </Grid>
      </Grid>

      <Grid  container item xs={9}  spacing={1} alignContent="flex-start" alignItems="flex-start">


<Grid item >
        <Button 
        color={ activecat === "protein" ? 'primary' : 'default' }
        variant="outlined"
        onClick = {()=>dispatch(struct_page_choice("component","protein"))}>Proteins</Button>
   </Grid>
<Grid item > 
        <Button 
        color={ activecat === "rna" ? 'primary' : 'default' }
        variant="outlined"
        
        onClick = {()=>dispatch(struct_page_choice("component","rna"))}>RNA</Button>
</Grid>

<Grid item >
        <Button 
        
        color={ activecat === "ligand" ? 'primary' : 'default' }
        variant="outlined"
        onClick = {()=>dispatch(struct_page_choice("component","ligand"))}>Ligands</Button>
   </Grid>


<Grid container xs={12} >


      {renderSwitch(activecat)}
</Grid>

      </Grid>
    </Grid>
  ) : (
    <SimpleBackdrop/>
  );
};

const mapstate = (state: AppState, ownprops: OwnProps): ReduxProps => ({
  globalFilter: "",
});
const mapdispatch = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  ownprops: OwnProps
): DispatchProps => ({});

export default connect(mapstate, mapdispatch)(StructurePage);
