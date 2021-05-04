import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  Ligand,
  RibosomalProtein,
  RibosomeStructure,
  rRNA,
} from "../../../redux/RibosomeTypes";

import "./StructurePage.css";
import { getNeo4jData } from "../../../redux/AsyncActions/getNeo4jData";
import { flattenDeep } from "lodash";
import { connect, useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../redux/store";
import { useHistory } from 'react-router-dom';
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../../../redux/AppActions";
import LoadingSpinner from './../../Other/LoadingSpinner'
import { Tooltip } from "react-bootstrap";
import { OverlayTrigger } from "react-bootstrap";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Popover from "@material-ui/core/Popover";
import { makeStyles } from "@material-ui/core/styles";
import { DashboardButton } from "../../../materialui/Dashboard/Dashboard";
import RibosomalProteinCard from "../RibosomalProteins/RibosomalProteinCard";
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import fileDownload from "js-file-download";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from "@material-ui/core/Collapse";
import CardHeader from "@material-ui/core/CardHeader";
import SimpleBackdrop from "../Backdrop";
import { struct_page_choice } from "../../../redux/reducers/Interface/ActionTypes";



const RNACard = (prop: rRNA) => {
  const useRNAStyles = makeStyles({
    tooltiproot: {
      width: 500,
    },
    root: {},
    bullet: {
      display: "inline-block",
      margin: "0 2px",
      transform: "scale(0.8)",
    },
    title: {
      fontSize: 10,
    },
    pos: {
      marginBottom: 12,
    },
    popover: {
      padding: "20px",
    },
    hover: {
      "&:hover": {
        transition: "0.05s all",
        transform: "scale(1.01)",
        cursor: "pointer",
      },
    },
  });
  const [isFetching, setisFetching] = useState<boolean>(false);

  const downloadChain = (pdbid: string, cid: string) => {
    getNeo4jData("static_files", {
      endpoint: "cif_chain",
      params: { structid: pdbid, chainid: cid },
    }).then(
      resp => {
        setisFetching(false);
        fileDownload(resp.data, `${pdbid}_${cid}.cif`);
      },
      error => {
        alert(
          "This chain is unavailable. This is likely an issue with parsing the given struct.\nTry another struct!" +
            error
        );
        setisFetching(false);
      }
    );
  };
  const classes = useRNAStyles();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Grid xs={12} container spacing={1}>
          <Grid
            item
            style={{ borderBottom: "1px solid gray" }}
            justify="space-between"
            container
            xs={12}
          >
            <Grid item xs={4}>
              <Typography variant="body1">
                {prop.parent_rcsb_id}.{prop.entity_poly_strand_id}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption">
                {prop.rcsb_source_organism_description[0]}
              </Typography>
            </Grid>
          </Grid>
          <Grid item justify="space-between" container xs={12}>
            <Typography variant="body1" component="p">
              {prop.rcsb_pdbx_description}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>

      <CardActions>
        <Grid container xs={12}>
          <Grid container item xs={8}>
            <Button size="small" aria-describedby={id} onClick={handleClick}>
              Seq ({prop.entity_poly_seq_length}AAs)
            </Button>
            <Button
              size="small"
              onClick={() =>
                downloadChain(prop.parent_rcsb_id, prop.entity_poly_strand_id)
              }
            >
              Download Chain
              <img
                id="download-protein"
                src={process.env.PUBLIC_URL + `/public/icons/download.png`}
                alt=""
              />
            </Button>
          </Grid>
          <Grid container item xs={4}>
            <Button onClick={() => {}} size="small" disabled={true}>
              Add to Workspace
            </Button>
          </Grid>
        </Grid>
      </CardActions>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        className={classes.popover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Grid container xs={12}>
          <Typography
            style={{ width: "400px", wordBreak: "break-word" }}
            variant="body2"
            className={classes.popover}
          >
            {prop.entity_poly_seq_one_letter_code}
          </Typography>
        </Grid>
      </Popover>
    </Card>
  );
};

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
        const respdat: ResponseShape = flattenDeep(
          resp.data
        )[0] as ResponseShape;

        type ResponseShape = {
          structure  :  RibosomeStructure;
          ligands    :  Ligand[];
          rnas       :  rRNA[];
          rps        :  RibosomalProtein[];
        };

        setstruct(respdat.structure);
        setprots(respdat.rps);
        setrrnas(respdat.rnas);
        setligands(respdat.ligands);

      },

      err => {
        console.log("Got error on /neo request", err);
      }
    );

    return () => {};
  }, [pdbid]);

  const [lsu, setlsu]     = useState<RibosomalProtein[]>([])
  const [ssu, setssu]     = useState<RibosomalProtein[]>([])
  const [other, setother] = useState<RibosomalProtein[]>([])

const history = useHistory();


  useEffect(() => {

    var lsu   = protdata.filter(x=> x.nomenclature.length === 1 && flattenDeep(x.nomenclature.map(name => { return name.match(/L/)})).includes('L') )
    var ssu   = protdata.filter(x=> x.nomenclature.length === 1 && flattenDeep(x.nomenclature.map(name => { return name.match(/S/)})).includes('S'))
    var other = protdata.filter(x=> ![...lsu,...ssu].includes(x))

    setlsu(lsu)
    setssu(ssu)
    setother(other)

  }, [protdata])


  const ligcardstyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
})();
  const renderSwitch = (activecategory: string) => {
    
    switch (activecategory) {
      case "protein":
        return (
          lsu.length < 1 ? <SimpleBackdrop/> :
          <Grid  container  spacing={1}>

            <Grid item justify="flex-start" alignItems='flex-start' alignContent='flex-start' container xs={4} spacing={1}>
              <Grid item xs={12} style={{ paddingTop: "10px" }} >
                <Typography color="primary" variant="h4">

                  LSU Proteins
              </Typography>
              </Grid>

              {lsu.map(protein => {

                return <Grid item xs={12}>
                  <RibosomalProteinCard protein={protein} />
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
                  <RibosomalProteinCard protein={protein} />
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
                  <RibosomalProteinCard protein={protein} />
                </Grid>
              })}

            </Grid>
          </Grid>
        );
      case "rna":

      return (

        <Grid container    >{
          rrnas.map(obj => (
          <Grid item xs={12}>
            <RNACard {...obj} />
            </Grid>
          ))}
        </Grid>
        );

      case "ligand":

        return (
          <Grid  container  spacing={1}>
            {
              ligands.filter(lig => {
                return ions ? true : !lig.chemicalName.includes("ION");
              })
                .map(lig => (
                  <Grid item>
                      <Card className = {ligcardstyles.root}>
                      <CardContent>
                        <Typography className = {ligcardstyles.pos} color = "textSecondary">{lig.chemicalId}</Typography>
                        <Typography variant = "body2" component = "p">
                          {lig.pdbx_description}
                        </Typography>
                        <Typography className = {ligcardstyles.title} color = "textSecondary" gutterBottom>
                          Formula Weight: {lig.formula_weight}
                        </Typography>
                        <Typography className = {ligcardstyles.title} color = "textSecondary" gutterBottom>
                          Residues ID: {lig.cif_residueId ? lig.cif_residueId : "not available"}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button onClick={()=>{history.push(`/bindingsites`)}} size = "small">Binding Sites</Button>
                      </CardActions>
                    </Card>
        </Grid>
              ))}

          

              <input type="checkbox" 
                onChange={() => {
                  setions(!ions);
                }}
              />
            

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

const CardBodyAnnotation =({ keyname,value,onClick }:{keyname:string,onClick?:any, value:string| string[]|number})=>{
  return     <ListItem onClick={onClick}><Grid
      container
      direction="row"
      justify="space-between"
      alignItems="center"
      component="div"    >
      <Typography variant="caption" color="textSecondary" component="p" className={classes.annotation}>
        {keyname}:
            </Typography>
      <Typography variant="caption" color="textPrimary" component="p" noWrap
        className={classes.annotation}
      >
        {value}
      </Typography>
    </Grid></ListItem>
  }


  const [authorsOpen, setOpen] = React.useState(false);

  const handleAuthorsToggle = () => {
    setOpen(!authorsOpen);
  };


  return structdata ? (
    <Grid xs={12} container item spacing={1} style={{ padding: "5px" }}>
      <Grid xs={3} container item alignContent="flex-start">
        <Card className={classes.card}>
          <CardHeader
            title={`${structdata.rcsb_id}`}
            subheader={structdata._organismName}
          />
          <CardActionArea>
            <CardMedia
              image={process.env.PUBLIC_URL + `/ray_templates/_ray_${pdbid.toUpperCase()}.png`}
              title={ `${structdata.rcsb_id}\n${structdata.citation_title}` }
              className={classes.title}
            />
          </CardActionArea>
          <List>
            <CardBodyAnnotation keyname="Species" value={structdata._organismName} />
            <CardBodyAnnotation keyname="Resolution" value={structdata.resolution} />
            <OverlayTrigger
              key="bottom-overlaytrigger"
              placement="bottom"
              overlay={
                <Tooltip
                  style={{ backgroundColor: "black" }}
                  className="tooltip-bottom"
                  id="tooltip-bottom"
                >
                  <MethodSwitch {...structdata} />
                </Tooltip>
              }
            >
              < CardBodyAnnotation keyname="Experimental Method" value={structdata.expMethod} />
            </OverlayTrigger>
            < CardBodyAnnotation keyname="Title" value={structdata.citation_title} />

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
                {structdata.citation_rcsb_authors.length > 1
                  ? structdata.citation_rcsb_authors.map(author =>
                    <ListItem button className={classes.nested}>
                      <Typography variant="caption" color="textSecondary" component="p" className={classes.nested}>
                        {author}
                      </Typography>
                    </ListItem>
                  )
                  : structdata.citation_rcsb_authors[0]}
              </List>
            </Collapse>

            < CardBodyAnnotation keyname="Year" value={structdata.citation_year} />
          </List>
          <CardActions>
            <Grid container justify="space-evenly" direction="row">

              <Grid item>

                <Button size="small" color="primary">
                  PDB
            </Button>
              </Grid>
              <Grid item>
                <Button size="small" color="primary">
                  EMD
            </Button>
              </Grid>
              <Grid item>
                <Button size="small" color="primary">
                  DOI
            </Button>
              </Grid>
            </Grid>
          </CardActions>
          <DashboardButton />
        </Card>
      </Grid>


      <Grid  container item xs={9}  spacing={1} alignContent="flex-start" alignItems="flex-start">


<Grid item > 
        <Button onClick = {()=>dispatch(struct_page_choice("component","rna"))}>RNAs</Button>
</Grid>

<Grid item >
        <Button onClick = {()=>dispatch(struct_page_choice("component","ligand"))}>Ligands</Button>
   </Grid>
<Grid item >
        <Button onClick = {()=>dispatch(struct_page_choice("component","protein"))}>Proteins</Button>
  
   </Grid>


      {renderSwitch(activecat)}

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
