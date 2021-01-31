import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { NeoStruct } from "./../redux/DataInterfaces"
import { AppState } from "../redux/store";
import "./Home.css";
import { Link } from "react-router-dom";

import bioplogo from "./../static/biopython_logo.svg";
import pdb from "./../static/pdb.png";
import pfam from "./../static/pfam.gif";
import raylogo from "./../static/ray-transp-logo.png";
import ubc from "./../static/ubc-logo.png";
import gatech from "./../static/gatech.png";
import InlineSpinner from "./Other/InlineSpinner";

// import { Accordion, Card } from "react-bootstrap";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { getNeo4jData } from "../redux/AsyncActions/getNeo4jData";

import {useHistory} from 'react-router-dom'
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";

import {
  Card,
  Container,
  createStyles,
  makeStyles,
  Theme,
} from "@material-ui/core";

import List from "@material-ui/core/List";
import ListItem, { ListItemProps } from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

interface ReduxProps {
  __rx_structures: NeoStruct[];
}
const mapstate = (state: AppState, ownprops: any): ReduxProps => ({
  __rx_structures: state.structures.neo_response,
});

const _StatsList: React.FC<ReduxProps> = prop => {
  const useStatsListStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        width: "100%",
        fontSize: "1em",
        // maxWidth: 360,
        // backgroundColor: theme.palette.background.paper,
      },
    })
  );
  const classes = useStatsListStyles();
  var [structn, setstructn] = useState<number>(0);
  var [protn, setProtn] = useState<number>(0);
  var [rnan, setrnan] = useState<number>(0);
  var [xray, setxray] = useState<number>(0);
  var [em, setem] = useState<number>(0);
  var [ligs, setligs] = useState<number>(0);
  var [ligClasses, setligclasses] = useState<number>(0);

  useEffect(() => {
    interface NeoLigandClass {
      ligand: {
        chemicalId: string;
        chemicalName: string;
        cif_residue: string | number | null;
        formula_weight: number;
        pdbx_description: string;
      };
      presentIn: {
        orgid: number[];
        orgname: string[];
        struct: string;
      }[];
    }
    getNeo4jData("neo4j", { endpoint: "get_all_ligands", params: null }).then(
      r => {
        var ligs: NeoLigandClass[] = r.data;
        setligclasses(ligs.length);
        var total: number = ligs
          .map(lig => lig.presentIn.length)
          .reduce((acc, ligclasscount) => acc + ligclasscount, 0);
        setligs(total);
      },
      e => {
        console.log("Error when fetching ligands");
      }
    );
  }, []);
  useEffect(() => {
    var structs = prop.__rx_structures;
    var prot = 0;
    var rna = 0;
    var struct = 0;
    struct = structs.length;

    for (var str of structs) {
      prot += str.rps.length;
      rna += str.rnas.length;
    }

    setProtn(prot);
    setrnan(rna);
    setstructn(struct);

    var xray = 0;
    var em = 0;
    structs.map(struct => {
      if (struct.struct.expMethod === "X-RAY DIFFRACTION") {
        xray += 1;
      } else if (struct.struct.expMethod === "ELECTRON MICROSCOPY") {
        em += 1;
      }
    });
    setxray(xray);
    setem(em);
  }, [prop.__rx_structures]);

  return (
    <List className={classes.root} component="div">
      <ListItem button>
        <Link to="/rps">
          {protn ? (
            <ListItemText primary={`${protn} r-proteins`} />
          ) : (
            <InlineSpinner />
          )}
        </Link>
      </ListItem>
      <ListItem button>
        <Link to="/structs">
          {structn ? (
            <ListItemText
              primary={`${structn ? structn : ""} unique structures`}
            />
          ) : (
            <InlineSpinner />
          )}
        </Link>
      </ListItem>
      <ListItem button>
        <Link to="/rnas">
          {rnan ? (
            <ListItemText primary={`${rnan ? rnan : ""} rRNA strands`} />
          ) : (
            <InlineSpinner />
          )}
        </Link>
      </ListItem>
      <ListItem button>
        <Link to="/ligands">
          {ligs && ligClasses ? (
            <ListItemText
              primary={`${ligs ? ligs : <InlineSpinner />} ligands in ${
                ligClasses ? ligClasses : <InlineSpinner />
              } ligand classes`}
            />
          ) : (
            <InlineSpinner />
          )}
        </Link>
      </ListItem>
    </List>
  );
};

const StatsList = connect(mapstate, null)(_StatsList);

const _MainContentCard: React.FC<ReduxProps> = prop => {
  const useMainContentCardStyles = makeStyles({
    root: {
      boxShadow: "4px 10px 52px -20px rgba(0,0,0,0.75)",
      marginTop: 30,
      marginBottom: 30,
      textDecoration: "none",
      color: "black",
    },
    bullet: {
      display: "inline-block",
      margin: "0 2px",
      transform: "scale(0.8)",
    },

    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    logoimg: {
      maxWidth: "100%",
      maxHeight: "100%",
    },
    section: {
      padding: 10,
      transition: "0.1s all",
      "&:hover": {
        background: "rgba(223,223,223,0.5)",
        cursor: "pointer",
      },
    },
    cardtitle:{
      fontWeight:"bold"
    },
    tool:{
      transition: "0.1s all",
      "&:hover": {
        background: "rgba(171,243,255,0.75)",
        cursor: "pointer",
      },

    }

  });

  const classes = useMainContentCardStyles();
  const history = useHistory();

  const gotoonclick = (page:string)=>{
    history.push(`/${page}`)
  }
  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid
          container
          xs={12}
          justify="space-between"
          alignItems="flex-start"
          spacing={1}
        >
          <Grid
            justify="center"
            alignContent="center"
            alignItems="center"
            container
            item
            xs={4}
          >
            <img src={raylogo} className={classes.logoimg} />
          </Grid>

          <Grid item xs={6}>
            <div className="stats area">
              <div id="stats-proper">
                <StatsList />
              </div>
            </div>
          </Grid>
        </Grid>
        <Typography className={classes.cardtitle} variant="h5">
          A Comprehensive Resource for Ribosome Structures
        </Typography>
      </CardContent>

      <CardActions>
        <Grid container xs={12} spacing={2}>
          <Grid item xs={12}>
            <Paper
              onClick={() => {
                history.push(`/structs`);
              }}
              className={classes.section}
              variant="outlined"
            >
              <Typography variant="h5">Ribosome Structures</Typography>
              <Typography variant="body2">
                This database presents a catalogue of all the ribosome
                structures deposited to the RCSB/PDB. These structures are
                processed here for an easy search and access of the structures
                and their components (listed below). Various modules are also
                available to process and analyze the structures
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper
              onClick={() => {
                history.push(`/rps`);
              }}
              className={classes.section}
              variant="outlined"
            >
              <Typography variant="h5">Ribosomal Proteins</Typography>
              <Typography variant="body2">
                To enable comprehensive comparison of structures deposited by
                the community in to the RCSB/PDB, we have provided a common
                ontology that allows to get access to the structure of ribosomal
                proteins across multiple files, by refering to their standard
                names. This ontology is notably based on a nomenclature that was
                recently adopted for naming ribosomal proteins.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper
              onClick={() => {
                history.push(`/rnas`);
              }}
              className={classes.section}
              variant="outlined"
            >
              <Typography variant="h5">Ribosomal RNA, tRNA and mRNA</Typography>
              <Typography variant="body2">
                This database presents a catalogue of all the ribosome
                structures deposited to the RCSB/PDB. These structures are
                processed here for an easy search and access of the structures
                and their components (listed below). Various modules are also
                available to process and analyze the structures
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper
              onClick={() => {
                history.push(`/ligands`);
              }}
              className={classes.section}
              variant="outlined"
            >
              <Typography variant="h5">
                Ligands, Antibiotics and Small Molecules
              </Typography>
              <Typography variant="body2">
                We provide a residue-level catalogue of ligands, small molecules
                and antibiotics that are solved with ribosome structures.
                Additional tools allow to visualize their physical neighborhood
                and search for similar molecules across other structures in the
                database.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.section} elevation={2} variant="outlined">
              <Typography variant="h5">Tools & Analytics</Typography>

              <Container
                onClick={() => {
                  gotoonclick("rpclassification");
                }}
                className={classes.tool}
              >
                <Typography variant="h6" className={classes.tool}>
                  Protein Classification
                </Typography>
                <Typography variant="body2">
                  A tool to filter and compare r-proteins present according to
                  their classes, spatial localization, conservation profiles and
                  contact sites with crucial components of the ribosome like the
                  PTC.
                </Typography>
              </Container>
              <Container
                onClick={() => {
                  gotoonclick("rpalign");
                }}
                className={classes.tool}
              >
                <Typography variant="h6" className={classes.tool}>
                  Subcomponent Alignment
                </Typography>
                <Typography variant="body2">
                  A tool is to spatially align, superimpose and export sets of
                  sub-components from different ribosomal structures.
                </Typography>
              </Container>
              <Container
                onClick={() => {
                  gotoonclick("interfaces");
                }}
                className={classes.tool}
              >
                <Typography variant="h6" className={classes.tool}>
                  Ligand Binding Sites
                </Typography>
                <Typography variant="body2">
                  A interface to navigate and export ligands present across the
                  deposited strucutres and their binding sites.
                </Typography>
              </Container>
              <Container
                onClick={() => {
                  gotoonclick("tunnel");
                }}
                className={classes.tool}
              >
                <Typography variant="h6" className={classes.tool}>
                  Exit Tunnel
                </Typography>
                <Typography variant="body2">
                  The database contains ribosome exit-tunnel models from some
                  selected structures in the current version, which will be
                  extended to more structures in the future. Data export is
                  available, focusing on the three following main features:
                  Residue profile of the RPs that interface with the tunnel.
                  (Each protein is identified by its new nomenclature (ex. uL4)
                  where is possible and can thus be compared against homologous
                  chains in other structures. The in-chain IDs of the
                  tunnel-interfacing residues are provided for each protein.)
                  Nucleotides of the RNA that interface with the tunnel.
                  Ligands, ions or small molecules if any are found embedded in
                  the walls of the tunnel.
                </Typography>
              </Container>
            </Paper>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};
const MainContentCard = connect(mapstate, null)(_MainContentCard);

const AcknPlug: React.FC = children => {
  const plugstyles = makeStyles({
    root: {
      padding: 10,
      width: "100%"},
    cardmedia: {
      width: "100%",
      height: "100%"},
  })();
  return (
    <Paper elevation={1} className={plugstyles.root}>
      <Grid>

        <Typography variant="caption">
          Crystallographic strucutures and some of the annotations are acquired
          from <a href={"https://www.rcsb.org/"}>RCSB PDB</a>.
          <br />
          <a href="https://data.rcsb.org/index.html#gql-api">RCSB GQL</a>{" "}
          greatly faciliatates the integration of data across structures
        </Typography>

        <img src={pdb} className={plugstyles.cardmedia} />
      </Grid>
    </Paper>
  );
};
const AcknowlegementsList = () => {
  const plugstyles = makeStyles({
    root: {
      padding: 10,
      width: "100%",
      // backgroundColor:"cyan"
    },
    ackntext: {
      maxWidth: 100,
      fontSize: 10,
    },
    acknlist: {
      top: "40%",
    },
    cardmedia: {
      maxWidth: 100,
    },
  })();
  return (

    <Grid item className={plugstyles.acknlist}>
      <Typography variant="overline"> Acknowledgements</Typography>
      <Grid container xs={12} spacing={1}>
        <Grid item justify="space-between">
          <Paper elevation={1} className={plugstyles.root}>
            <Grid container direction="row">
              <Typography variant="caption">
                Crystallographic strucutures and some of the annotations are
                acquired from <a href={"https://www.rcsb.org/"}>RCSB PDB</a>.
                <br />
                <a href="https://data.rcsb.org/index.html#gql-api">
                  RCSB GQL
                </a>{" "}
                greatly faciliatates the integration of data across structures
              </Typography>

              <img src={pdb} className={plugstyles.cardmedia} />
            </Grid>
          </Paper>
        </Grid>
        <Grid item>
          <Paper elevation={1} className={plugstyles.root}>
            <Grid container direction="row">
              <Typography variant="caption">
                Parsing and search are performed via{" "}
                <a href="https://biopython.org/">Biopython.PDB</a>
              </Typography>
              <img src={bioplogo} className={plugstyles.cardmedia} />
            </Grid>
          </Paper>
        </Grid>
        <Grid item>
          <Paper elevation={1} className={plugstyles.root}>
            <Grid container direction="row">
              <Typography variant="caption">
                <a href="https://pfam.xfam.org/">PFAM</a> Database provides
                context for grouping ribosomal proteins into families.
              </Typography>
              <img src={pfam} className={plugstyles.cardmedia} />
            </Grid>
          </Paper>
        </Grid>
        <Grid item>
          <Paper elevation={1} className={plugstyles.root}>
            <Grid container direction="row">
              <Typography variant="caption">
                <a href="https://jcheminf.biomedcentral.com/articles/10.1186/1758-2946-5-39">
                  MOLE
                </a>{" "}
                software is used to extract the ribosomal exit tunnel.
              </Typography>
            </Grid>
          </Paper>
        </Grid>
        <Grid item>
          <Paper elevation={1} className={plugstyles.root}>
            <Grid container direction="row">
              <Typography variant="caption">
                <p>
                  Developed by the <a href="https://kdaoduc.com/">Khanh Dao-Duc's group</a>{" "}
                  at the University of British Columbia.
                </p>
                <p>
                  In collaboration with{" "}
                  <a href="https://ww2.chemistry.gatech.edu/~lw26/index.html#PI">
                    Loren Williams' group
                  </a>{" "}
                  at Georgia Institute of Technology.
                </p>
                {/* <p className="in-dev"> */}
                  This is still in active development phase. All usability and
                  conceptual suggestions would be very much appreciated. Thanks
                  for <a href="mailto:rtkushner@gmail.com">getting in touch</a>!
                {/* </p> */}

                <Grid justify="space-between" container direction="row">
                  <img src={ubc} className={plugstyles.cardmedia} />
                  <img src={gatech} className={plugstyles.cardmedia} />
                </Grid>
              </Typography>
            </Grid>
          </Paper>
        </Grid>{" "}
      </Grid>
    </Grid>
  );
};

const Home: React.FC<ReduxProps> = prop => {
  const useHomepageStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        flexGrow: 1,
      },
      paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary,
      },
      gridItem: {},
    })
  );

  const classes = useHomepageStyles();
  return (
    <Grid
      container
      justify="space-evenly"
      alignContent="center"
      xs={12}
    >
      <Grid item xs={2} className={classes.gridItem}>
        <AcknowlegementsList />
      </Grid>
      <Grid item xs={5} className={classes.gridItem}>
        <MainContentCard />
      </Grid>
      <Grid item xs={2}></Grid>
    </Grid>
  );
};

export default connect(mapstate, null)(Home);
