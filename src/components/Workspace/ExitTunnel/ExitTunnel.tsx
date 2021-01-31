import React, { useEffect, useState } from "react";
import fileDownload from 'js-file-download'
import { Accordion, Card, Dropdown, DropdownButton, ListGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getNeo4jData } from '../../../redux/AsyncActions/getNeo4jData'
import './ExitTunnelPage.css'
import downicon from './../../../static/download.png'
import { Ligand, RibosomalProtein, RibosomeStructure, rRNA } from '../../../redux/RibosomeTypes'
import {ReactMarkdownElement,md_files} from './../../Other/ReactMarkdownElement'
import {resolved_tunnels} from './../../../static/tunnel/resolved_tunnels'
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import {  Button,FormControl, FormHelperText, InputLabel, List, ListItemText, Select, Typography } from "@material-ui/core";
import tunneldemogif from './../../../static/tunnel/tunneldemo.gif'
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { withStyles  } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import {WarningPopover} from './../WorkInProgressChip'

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

const WallChain:React.FC<{banid:string|null, chain:string, resids:ResidueProfile[], pdbid:string}> = ({chain, resids, banid, pdbid}) =>{

  const parseAndDownloadChain = (pdbid: string, cid: string) => {
    var duplicates = cid.split(",");
    if (duplicates.length > 1) {
      var cid = duplicates[0];
    }

    getNeo4jData("static_files", {
      endpoint: "cif_chain",
      params: { structid: pdbid, chainid: cid },
    }).then(
      resp => {
        fileDownload(resp.data, `${pdbid}_${cid}.cif`);
      },
      error => {
        alert(
          "This chain is unavailable. This is likely an issue with parsing the given struct.\nTry another struct!" +
            error
        );
      }
    );
  };
  return (
    <div>
      <Card style={{ width: "8rem" }} className="wallchain">
        <Card.Header className="wc-header">
          {banid?  <Link to={`/rps/${banid}`}>{banid}</Link> : chain}

            <div
              className="down-banner"
              onClick={() =>
                parseAndDownloadChain(pdbid, chain)
              }
            >
                <button className='down-prot-button'>
                  <img
                    id="down-wall-prot"
                    src={downicon}
                    alt="download protein"
                  />
                </button>
            </div>
        </Card.Header>

        <ListGroup variant="flush" id='list-group'>
          {resids.map(self => (
            <ListGroup.Item
            style={
              {margin:"0px", padding:"5px"}
            }>
              <div className={ `lig ${self.isligand ? "isligand" : null} ` }><span><strong>{self.resname}</strong></span><span>{self.resid}</span></div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    </div>
  );

}
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
      // minWidth  : 120,
      // maxWidth  : 1000,
      // marginLeft:10,
      width     : "100%",
    },
    downButton:{
      textAlign:"center",
      
      
    },
    wallchainsTray:{
      padding:20
    }

    })
  )();

    const [selectedStruct, setselectedStruct] = useState<string>('')
    const [wall, setwall] = useState<TunnelWall>({
        pdbid        :  "null",
        probeRadius  :  0,
        proteins     :  {},
        rna          :  {},
        ligands      :  [],
        nomMap       :  {}
    })
    const [structState, setstruct] = useState<StructResponseShape>({} as StructResponseShape)

    useEffect(() => {
      setselectedStruct('4UG0')
    }, [])
    
    useEffect(() => {
      getNeo4jData("neo4j",{ endpoint:"get_struct", params:{
        pdbid:selectedStruct
      }}).then(re=>{ 
        console.log("GOT STRUCT ,", re.data);
        setstruct(re.data[0]) 
      }
      )
    }, [ selectedStruct])

    useEffect(() => {
    getNeo4jData("static_files",{endpoint:"tunnel", params:{
        struct:selectedStruct,
        filetype:'report',
    }}).then(
        r=> { setwall(r.data)           },
        e=>console.log("error", e)
    )}, [selectedStruct])

  return (
    <Grid container xs={12}>
      <Grid item container xs={12}>
        <Paper variant="outlined" square className={classes.pageAnnotation}>
      {/* <Grid item xs={1} style={{margin:20}}> */}
      {/* </Grid> */}
      <Grid container alignItems='center' justify='space-between'>
          <Typography variant="h5">Ribosome Exit Tunnel</Typography>
          <WarningPopover content={"We will extend this dataset from overrepresented E.coli to other species in the near future. Working on better export options."}/>
      </Grid>
          <Typography variant="body1">
            Here you can search and export some preliminary data about the
            <b> location and shape</b> of the ribosome exit tunnel as is
            caputured in a given model. <br />
            The <b>tunnel walls report </b>provided contains three main features that characterize tunnel walls:
            <TunnelDemoTooltip
              placement="top"
              title={
                <React.Fragment>
                  <Typography
                    variant="caption"
                    style={{ left: "10%", padding: "10px" }}
                  >
                    Extraction of the ribosome exit tunnel from the{" "}
                    <i>H. sapiens</i> ribosome (
                    <a href="https://www.rcsb.org/structure/4UG0">4UG0</a>).
                    <br />
                    Proteins adjacent to the tunnel are highlighted as well as
                    the rna nucleotides.
                  </Typography>
                  <img src={tunneldemogif} className={classes.demogif} />
                </React.Fragment>
              }
            >
              <List className={classes.annotationlist}>
                <ListItemText secondary inset>
                  <Typography variant="body1">
                    - Residue profile of the ribosomal proteins that interface
                    with the tunnel.
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
                    - Ligands, ions or small molecules if any are found embedded
                    in the walls of the tunnel.
                  </Typography>
                </ListItemText>
              </List>
            </TunnelDemoTooltip>
          </Typography>
        </Paper>
      </Grid>
      <Grid container item xs={12} >
        <Grid container item spacing={1} xs={12}>
          <Grid item container xs={12} style={{padding:20}}  spacing={1} justify="flex-start">


              {/* <Grid item xs={1} alignItems="center" justify="center" alignContent="center"><Typography variant="body1" align="center">Structure:</Typography></Grid> */}
              <Grid item xs={6}>
            <FormControl className={classes.formControl}>
              <Select onChange={(e)=>setselectedStruct(e.target.value as string)} value={selectedStruct}  id="TunnelStructure">
                {resolved_tunnels.map(tunnelstruct=> <option aria-label="hey" value={tunnelstruct.pdbid}>{tunnelstruct.pdbid + " " + tunnelstruct.organism[0]}
                 </option>)}
              </Select>
              <Grid container xs={12}>
<Typography variant={"caption"}>{
  structState ?  structState.structure && structState.structure.citation_title+ " " :""
}</Typography>
              </Grid>
            </FormControl>
              </Grid>
              <Grid item xs={6} >
                <Button className={classes.downButton} onClick={() => getfile(wall.pdbid, "report")}> Download Walls Report</Button>
                <Button className={classes.downButton}onClick={() => getfile(wall.pdbid, "centerline")}>
                  Download Tunnel Shape
                </Button>
              </Grid>
          </Grid>
        </Grid>

        <Grid container item xs={6}>
          <Grid
            className={classes.wallchainsTray} 
            container
            xs      = {12}
            spacing = {1}
          >
            <Grid item xs={12}>

            <Typography variant="overline">
              Tunel-adjacent Proteins
            </Typography>
            </Grid>
            {wall.proteins
              ? Object.entries(wall.proteins).map(r => {
                  return (
                    <Grid item>
                      <WallChain
                        pdbid={wall.pdbid}
                        chain={r[0]}
                        banid={wall.nomMap[r[0]] ? wall.nomMap[r[0]][0] : null}
                        resids={r[1]}
                      />
                    </Grid>
                  );
                })
              : "None"}
          </Grid>
          <Grid
            className={classes.wallchainsTray}
            container
            xs={12}
            spacing={1}
          >
            <Grid item xs={12}>
            <Typography variant="overline">
              Tunel-adjacent RNA-nucleotides
            </Typography>
          </Grid>
            {wall.rna
              ? Object.entries(wall.rna).map(r => {
                  return (
                    <Grid item>
                      <WallChain
                        pdbid={wall.pdbid}
                        chain={r[0]}
                        banid={wall.nomMap[r[0]] ? wall.nomMap[r[0]][0] : null}
                        resids={r[1]}
                      />
                    </Grid>
                  );
                })
              : "None"}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ExitTunnel;
