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
        {/* <Typography></Typography> */}
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
  const dispatch                      =  useDispatch()

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
          <Grid xs={9} container item spacing={1}>

            {/* <Grid item xs={12}> */}

              {/* <Paper>

                Filters
        </Paper>

            </Grid> */}
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

        <Grid container xs={10} spacing={1}>{
          rrnas.map(obj => (
          <Grid item xs={12}>
            <RNACard {...obj} />
            </Grid>
          ))}
        </Grid>);

      case "ligand":

        return (
          <div className="struct-page-ligands">

            <div>
              Hide Ions:{" "}
              <input type="checkbox" id="ionscheck"
                onChange={() => {
                  setions(!ions);
                }}
              />
            </div>
            {ligands
              .filter(lig => {
                return ions ? true : !lig.chemicalName.includes("ION");
              })
              .map(lig => (
                <div className="ligand-hero">
                  <h3>
                    <Link to={`/bindingsites`}>{lig.chemicalId}</Link>
                  </h3>
                  <div>Name: {lig.chemicalName}</div>
                  <div>
                    <code>cif</code> residue:{" "}
                    {lig.cif_residueId ? lig.cif_residueId : "not calculated"}
                  </div>
                </div>
              ))}
          </div>
        );

      default:
        return "Something went wrong";
    }
  };



  const StructCardField = ({field,value}:{ field:string,value:string[]|string|number}) => { 
    return <ListItem className="annotation"><Typography variant="overline">{field}:</Typography> <Typography variant="body2">{value}</Typography> </ListItem> }
  
  return structdata ? (
    <Grid xs={12} container item>
    <Grid xs={3} container item alignContent="flex-start">

    <Card     >
      <CardActionArea>

        <CardMedia
          // className={CardClasses.media}
          image={process.env.PUBLIC_URL + `/ray_templates/_ray_${pdbid.toUpperCase()}.png`}
          title="Such and such ribosome"
        />

      </CardActionArea>
        <List>
          <StructCardField field="Species" value={structdata._organismName} />

          {/* <ListItem className="annotation"><Typography variant="overline">Species:</Typography> {structdata._organismName} </ListItem> */}
          <StructCardField field="Resolution" value={structdata.resolution} />
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
          <ListItem className="annotation"><Typography variant="overline">Experimental Method:</Typography><Typography variant="body2"> {structdata.expMethod}</Typography>
          </ListItem>
            </OverlayTrigger>
            <ListItem className="annotation">Title: {structdata.citation_title}</ListItem>
          <StructCardField field="Title" value={structdata.citation_title} />
          <StructCardField field="Publication" value={structdata.citation_title} />

          <ListItem className="annotation">
            Orgnaism Id: {structdata._organismId}
          </ListItem>
          <ListItem className="annotation">
            Authors:{" "}
            {structdata.citation_rcsb_authors.length > 1
              ? structdata.citation_rcsb_authors.reduce((acc:any, curr:any) => {
                  return acc.concat(curr, ",");
                }, "")
              : structdata.citation_rcsb_authors[0]}
          </ListItem>
          <ListItem className="annotation">Year: {structdata.citation_year}</ListItem>
          <DashboardButton/>
        </List>
      <CardActions>
        <Button size="small" color="primary">
          Share
        </Button>
        <Button size="small" color="primary">
          Learn More
        </Button>
      </CardActions>
    {/* !!! ADD                                       DOI  <<<<<<<<<<<<<<<<<<<<<<<*/}
    </Card>

    </Grid>
        {renderSwitch(activecat)}
    </Grid>
  ) : (
    <LoadingSpinner annotation="Loading structure..." />
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
