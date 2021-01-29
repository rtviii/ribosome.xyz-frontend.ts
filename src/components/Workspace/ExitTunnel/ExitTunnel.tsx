import React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Button, FormControl, FormHelperText, InputLabel, List, ListItemText, Select, Typography } from "@material-ui/core";
import tunneldemogif from './../../../static/tunnel/tunneldemo.gif'
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { withStyles  } from '@material-ui/core/styles';
import fileDownload from 'js-file-download'
import { getNeo4jData } from '../../../redux/Actions/getNeo4jData'
import { Ligand, RibosomalProtein, RibosomeStructure, rRNA } from '../../../redux/RibosomeTypes'
import Tooltip from '@material-ui/core/Tooltip';

const getfile = (pdbid:string,ftype:"report"|"centerline")=>{
  var pdbid = pdbid.toUpperCase()
  getNeo4jData("static_files", {
    endpoint: "tunnel",
    params: {
      struct: pdbid,
      filetype: ftype,
    },
  }).then(r => {
    if (ftype === "report") {
      fileDownload(
        JSON.stringify(r.data),
        ftype === "report"
          ? `${pdbid}_tunnel_walls_report.json`
          : `${pdbid}_tunnel_shape.csv`
      );
    } else {
      fileDownload(r.data, `${pdbid}_tunnel_centerline.csv`);
    }
  });
}

interface ResidueProfile{
    isligand  :  boolean
    strand    :  string
    resid     :  number
    resname   :  string
    polytype  :  string
    nom       :  string[] | null;
}

interface TunnelWall{
    pdbid      : string,
    probeRadius: number,
    proteins   : { [ chain:string ]:ResidueProfile[] }
    rna        : { [ chain:string ]:ResidueProfile[] }
    ligands    : ResidueProfile[]
    nomMap     : {
      [chain:string]: string[]
    }
}

type StructResponseShape = {
  structure: RibosomeStructure,
  ligands  : Ligand[],
  rnas     : rRNA[],
  rps      : RibosomalProtein[]
}

const useStylesBootstrap = makeStyles((theme: Theme) => ({
  arrow: {
    color: theme.palette.common.black,
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
  },
}));

const TunnelDemoTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 600,
    border: '1px solid #dadde9',
  },
}))(Tooltip);

const ExitTunnel = () => {
  const classes = makeStyles((theme: Theme) =>
    createStyles({
      pageAnnotation: {
        padding: 20,
      },
      demogif:{
          maxWidth:"500px",
      },
      annotationlist:{

        "&:hover":{
    background: "rgba(223,223,223,0.5)",
          cursor: "pointer"
        }
      },
    formControl: {
      minWidth  : 120,
      maxWidth  : 1000,
      marginLeft:10,
      width     : "100%",
    },
    downButton:{
      textAlign:"center",
      
      
    }
    })
  )();

  return (
    <Grid container xs={12}>
      <Grid item container xs={12}>
        <Paper variant="outlined" square className={classes.pageAnnotation}>
          <Typography variant="h5">Ribosome Exit Tunnel</Typography>

          <Typography variant="body1">
            Here you can search and export some preliminary data about the             
            <b> location and shape</b> of the ribosome exit tunnel as is
            caputured in a given model. <br/>The <b>tunnel walls</b> report provided
            contains three main features are provided at the moment that
            characterize tunnel walls:
            <TunnelDemoTooltip
            placement="top"
            title={
            <React.Fragment>
            <Typography variant="caption"  style={{ left:"10%",padding:"10px"}}>

Extraction of the ribosome exit tunnel from the <i>H. sapiens</i> ribosome (<a href="https://www.rcsb.org/structure/4UG0">4UG0</a>).<br/>
Proteins adjacent to the tunnel are highlighted as well as the rna nucleotides.
                </Typography>
            <img src={tunneldemogif} className={classes.demogif}/>
          </React.Fragment>}
      >
              <List className={classes.annotationlist}>
                <ListItemText secondary inset>
                    <Typography variant="body1">
                  - Residue profile of the ribosomal proteins that interface with
                  the tunnel.
                    </Typography>
                </ListItemText>
                <ListItemText secondary inset>
                    <Typography variant="body1">
                   - The in-chain IDs of the tunnel-interfacing residues are
                  provided for each protein and nucleotides of the RNA that
                  interface with the tunnel.
                    </Typography>
                </ListItemText>
                <ListItemText secondary inset>
                    <Typography variant="body1">
                  - Ligands, ions or small molecules if any are found embedded in
                  the walls of the tunnel.
                    </Typography>
                </ListItemText>
              </List>
      </TunnelDemoTooltip>
          </Typography>

        </Paper>
      </Grid>

<Grid container item xs={12}>
  <Grid container item spacing={2} xs={6}>
    <Grid item container xs={12}>

      <FormControl className={classes.formControl}>

        <InputLabel htmlFor="grouped-native-select">Ribosome Structure</InputLabel>

        <Select native  defaultValue="some" id="struct1"  >

          <option aria-label="None" value=""  />
          <option aria-label="None" value="sda"  >Struc1</option>
          <option aria-label="None" value="sda"  >Struc1</option>
          <option aria-label="None" value="sda"  >Struc1</option>
          <option aria-label="None" value="sda"  >Struc1</option>
        </Select>

      </FormControl>
    </Grid>

    <Grid container direction="row" item xs={12}>
      <Grid item xs={6}>
      <Button className={classes.downButton}>Download Walls Report</Button>
      </Grid>
      <Grid item xs={6}>
      <Button className={classes.downButton} >Download Tunnel Shape</Button>
      </Grid>
    </Grid>
  </Grid>

{/*  -----------------------------------------------------*/}
  <Grid container item xs={6}>

  </Grid>

</Grid>
    </Grid>
  );
};

export default ExitTunnel;
