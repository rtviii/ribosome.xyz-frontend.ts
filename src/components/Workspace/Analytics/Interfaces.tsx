import FormControl from '@material-ui/core/FormControl';import Grid from '@material-ui/core/Grid';
import pic from './../../../static/3j9m_gdp.png'
import { connect } from 'react-redux';
import {StaticFilesCatalogue} from './../../../redux/reducers/Utilities/ActionTypes'
import { AppState } from "./../../../redux/store";
import PageAnnotation from './../Display/PageAnnotation'
import { createStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { getNeo4jData } from '../../../redux/AsyncActions/getNeo4jData';
import { Ligand, RibosomalProtein, RibosomeStructure, rRNA } from '../../../redux/RibosomeTypes';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Pagination from './../Display/Pagination'

import { truncate } from '../../Main';
import fileDownload from 'js-file-download';
import Tooltip from '@material-ui/core/Tooltip';
import { useHistory } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

interface StructDBProfile{
  ligands    :  Ligand[],
  rnas       :  rRNA[],
  rps        :  RibosomalProtein[],
  structure  :  RibosomeStructure
}

const LigandCard= (props:Ligand, )=> {
  const useLigandCardStyles = makeStyles({
    root: {
      minWidth: "100%",
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
    },
  });

  const classes = useLigandCardStyles();

  return (
    <Card >
      <CardContent>



        <Grid container xs={12}  justify='flex-start' spacing={2}>

<Grid item >

        <Typography style={{cursor:"pointer"}} variant='overline'>
          
Ligand

        </Typography>
</Grid>
<Grid item >
        <Typography  variant='overline'>
          
          {props.chemicalId}

        </Typography>
</Grid>
        </Grid>

        <Typography >
          {props.chemicalName}
        </Typography>

      </CardContent>
      <CardActions>
        <Button size="small"
        ><a href={`https://www.rcsb.org/ligand/${props.chemicalId}`}>Ligand: Learn More </a></Button>
      </CardActions>
    </Card>
  );
}

const StructureCard= (props:StructDBProfile )=> {

const history = useHistory();
  return (
    <Card >
      <CardContent>
        
        <Grid container xs={12} style={{cursor:"pointer"}}onClick={()=>{history.push(`/structs/${props.structure.rcsb_id}`)}} justify='flex-start' spacing={2}>

<Grid item >

        <Typography style={{cursor:"pointer"}} variant='overline'>
          
        Structure

        </Typography>
</Grid>
<Grid item >
        <Typography  variant='overline'>
          
         {props.structure.rcsb_id}

        </Typography>
</Grid>
        </Grid>
        <Typography>
          {props.structure.citation_title}
        </Typography>

        <Typography >
          {props.structure._organismName[0]}
        </Typography>

      </CardContent>
      <CardActions>
        <Button size="small">
          
          </Button>
      </CardActions>
    </Card>
  );
}


const downloadStrand = (pdbid:string, cid:string)=>{

  getNeo4jData("static_files", {
    endpoint: "cif_chain",
    params: { structid: pdbid, chainid: cid },
  }).then(
    resp => {
      fileDownload(resp.data, `${pdbid}_${cid}.cif`, 'chemical/mm-cif');
    },
    error => {
      alert(
        "This chain is unavailable. This is likely an issue with parsing the given struct.\nTry another struct!" +
          error
      );
    }
  );

}

const donwloadBindingSiteReport = (struct:string, chemid:string) =>{
    getNeo4jData("static_files", {
      endpoint: "download_ligand_nbhd",
      params: {
        chemid    :  chemid,
        structid  :  struct,
      },
    }).then(r =>
      fileDownload(
        JSON.stringify(r.data),
        `${struct}_${chemid}_ligandProfile.json`,
        "application/json"
      )
    );
}



interface ReduxProps {
    static_catalogue: StaticFilesCatalogue
    ligmap          : {[struct:string]:string[]}
    structmap       : {[ligandChemid:string]:string[]}
}

const Interfaces:React.FC<ReduxProps> = (prop) => {

  const history = useHistory();
const useSelectStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }),
);
  const classes                                 = useSelectStyles();
  const [chosenLigand, setChosenLigand]         = React.useState<string>('');
  const [chosenLigandData, setChosenLigandData] = React.useState<Ligand>({
    chemicalId      : "",
    chemicalName    : "",
    cif_residueId   : "none",
    formula_weight  : 0,
    pdbx_description: ""
  });
  const [chosenStruct, setChosenStruct]         = React.useState<string>('');

  

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setChosenLigand(event.target.value as string);
    setChosenStruct('')
    setCurrentStructureData({} as StructDBProfile)
    setBindingSite({} as BindingSite)
  };


  const ligands    = Object.keys(prop.ligmap)

  useEffect(() => {
  }, [prop.ligmap])


  useEffect(()=>{
        getNeo4jData("neo4j",{endpoint:"get_individual_ligand",params:{
      chemId:chosenLigand
    }}).then(
      r=>{
        setChosenLigandData(r.data[0])
        console.log(r.data) }
    )
  },[chosenLigand])

  interface ResidueProfile{

      resn:string
      strand_id:string
      struct:string
      resid: number;
      banClass :string | null
  }
  interface BindingSite{
    constituents  :  ResidueProfile[]
    nbrs          :  ResidueProfile[]
  }
  const [bindingsite, setBindingSite] = useState<BindingSite>({} as BindingSite)

  useEffect(()=>{
        getNeo4jData("static_files",{endpoint:"get_ligand_nbhd",params:{
    chemid:chosenLigand,
    struct:chosenStruct
    }}).then(
      r=>{
        setBindingSite(r.data)
      console.log(r.data);

      },
      e=>{
        console.log("error out fetching binding site file:", e)
      }

      
    )
  },[chosenStruct])
  
const useTableStyles = makeStyles({

  table: {
    width:"100%",
  },
  hovercell:{
        cursor:"pointer",
        fontSize:20,
        "&:hover":{
          background:"gray"
        }}
});

const tableClasses = useTableStyles()


const [currentStructureData, setCurrentStructureData]  = useState<StructDBProfile>({} as StructDBProfile)
const [nbrsPage, setNbrsPage]                  =  useState<number>(1);
const [constituentsPage, setConstituentsPage]  =  useState<number>(1);
useEffect(() => {
  if (chosenStruct !== '')
  {

  getNeo4jData("neo4j",{endpoint:"get_struct", params:{
    pdbid:chosenStruct
  }}).then(
    r=>{ 
      setCurrentStructureData(r.data[0]) 
      console.log("got struct", r.data[0]);
      
    },
    e =>{
      console.log("Couldnt fetch the current structure!");
      
    }
  )
  }
}, [chosenStruct])

const TunnelDemoTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 600,
    border: '1px solid #dadde9',
  },
}))(Tooltip);
  return (
    <Grid item container xs={12}>
        <Paper>
      <Grid  container xs={12} style={{padding:"10px"}}>




<Grid container item xs={12}>
<Typography variant="h4"> Ligands & Antibiotic Binding Sites</Typography>
</Grid>
<Grid container item xs={12}>
<Typography variant="body2">
        For a number of ribosomal structures ligands are available. 
        One can inspect and download a "binding site report" for each available ligand.
</Typography></Grid>


            <TunnelDemoTooltip
              placement="bottom"
              title={
                <React.Fragment>
                  <Typography
                    variant="caption"
                    // style={{ left: "10%", padding: "10px" }}
                  >
                    An illustration of guanosine-diphosphate (GDP) binding site inside the 
                    structure of the 
                    <i>E. coli</i> ribosome (
                    <a href="https://www.rcsb.org/structure/3J7Z">3J7Z</a>).
                    Residues surrounding the antibiotic are highlighted in blue.
                  </Typography>
                  <img style={{width:"100%"}} src={pic}  />
                </React.Fragment>
              }
            >
<Grid container item xs={12}>
<Typography variant="body2">
        A binding interface consists of the residue-wise profile of the ligand
        itself(<b> Constituents</b>) and the non-ligand neighbor-residues(
        <b>Neighbors</b>) that are within the radius of 5 Angstrom of the
        ligand.
</Typography></Grid>
</TunnelDemoTooltip>
      </Grid>
</Paper>
      <Grid item container xs={10} spacing={2} justify="flex-start" alignContent='flex-end' alignItems='flex-end'>

<Grid item>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Ligand</InputLabel>
          <Select
            labelId   =  "demo-simple-select-label"
            id        =  "demo-simple-select"
            value     =  {chosenLigand}
            onChange  =  {handleChange}
          >
            {ligands.map(ligand => (
              <MenuItem value={ligand}>{ligand}</MenuItem>
            ))}
          </Select>
        </FormControl>
</Grid>
<Grid item>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Structure</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={chosenStruct}
            onChange={e => {
              setChosenStruct(e.target.value as any);
            }}
          >
            {ligands.length > 0 && chosenLigand !== "" ? (
              prop.ligmap[chosenLigand].map(struct => (
                <MenuItem value={struct}>{struct}</MenuItem>
              ))
            ) : (
              <MenuItem>Choose a Ligand</MenuItem>
            )}
          </Select>
        </FormControl>
</Grid>
<Grid item>
        <Button
          onClick={() => {
            donwloadBindingSiteReport(chosenStruct, chosenLigand);
          }}
          variant="outlined"
        >
          Download Binding Site Report
        </Button>

</Grid>

      </Grid>

<Grid item container xs={10} spacing={2}>

<Grid item xs={5}>
  {chosenLigandData ? 
      <LigandCard {...chosenLigandData} />:
      ""
  }
</Grid>
<Grid item xs={5}>
      {currentStructureData.structure ? (
        <StructureCard {...currentStructureData} />
      ) : (
        ""
      )}
</Grid>

</Grid>
      <Grid xs={12} container item spacing={2} style={{ padding: "10px" }}>
        <Grid xs={5} container item>
          <Grid xs={12} container justify="space-between">
            <Typography variant="overline">Neighboring Strands </Typography>
            {bindingsite.nbrs ? (
              <Pagination
                {...{
                  gotopage: (pid: number) => {
                    setNbrsPage(pid);
                  },
                  pagecount: Math.ceil(bindingsite.nbrs.length / 20),
                }}
              />
            ) : (
              <Pagination
                {...{
                  gotopage: (pid: number) => {},
                  pagecount: 0,
                }}
              />
            )}

            <Table
              className={tableClasses.table}
              size="small"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  <Tooltip
                    title="The name of the residue according to th .mmcif deposition"
                    arrow
                  >
                    <TableCell align="right">Residue Name</TableCell>
                  </Tooltip>
                  <Tooltip
                    title="The position of the residue in the chain according to the .mmcif deposition"
                    arrow
                  >
                    <TableCell align="right">Residue Number</TableCell>
                  </Tooltip>
                  <Tooltip
                    title="The name of the subchain containing the residue (Click to download)"
                    arrow
                  >
                    <TableCell align="right">Parent Strand</TableCell>
                  </Tooltip>
                  <Tooltip
                    title="Ribosomal Protein class of the containing strand(  according to Ban et. al 2014)"
                    arrow
                  >
                    <TableCell align="right">Nomenclature Class</TableCell>
                  </Tooltip>
                </TableRow>
              </TableHead>
              <TableBody>
                {bindingsite.nbrs
                  ? bindingsite.nbrs
                      .slice((nbrsPage - 1) * 20, nbrsPage * 20)
                      .map(nbr => (
                        <TableRow key={nbr.resid}>
                          <TableCell component="th" scope="row">
                            {nbr.resn}
                          </TableCell>
                          <TableCell align="right">{nbr.resid}</TableCell>
                          <TableCell
                            className={tableClasses.hovercell}
                            onClick={() => {
                              downloadStrand(chosenStruct, nbr.strand_id);
                            }}
                            align="right"
                          >
                            {nbr.strand_id}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              return nbr.banClass
                                ? history.push(`/rps/${nbr.banClass}`)
                                : null;
                            }}
                            align="right"
                          >
                            {nbr.banClass}
                          </TableCell>
                        </TableRow>
                      ))
                  : ""}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
        <Grid xs={5} container item>
          <Grid xs={12} container justify="space-between">
            <Typography variant="overline">Ligand Residues</Typography>
            {bindingsite.constituents ? (
              <Pagination
                {...{
                  gotopage: (pid: number) => {
                    setConstituentsPage(pid);
                  },
                  pagecount: Math.ceil(bindingsite.constituents.length / 20),
                }}
              />
            ) : (
              <Pagination
                {...{
                  gotopage: (pid: number) => {},
                  pagecount: 0,
                }}
              />
            )}
          </Grid>
          <Table
            className={tableClasses.table}
            size="small"
            aria-label="a dense table"
          >
            <TableHead>
              <TableRow>
                <Tooltip
                  title="The name of the residue according to th .mmcif deposition"
                  arrow
                >
                  <TableCell align="right">Residue Name</TableCell>
                </Tooltip>
                <Tooltip
                  title="The position of the residue in the chain according to the .mmcif deposition"
                  arrow
                >
                  <TableCell align="right">Residue Number</TableCell>
                </Tooltip>
                <Tooltip
                  title="The name of the subchain containing the residue (Click to download)"
                  arrow
                >
                  <TableCell align="right">Parent Strand</TableCell>
                </Tooltip>
                <Tooltip
                  title="Ribosomal Protein class of the containing strand(  according to Ban et. al 2014)"
                  arrow
                >
                  <TableCell align="right">Nomenclature Class</TableCell>
                </Tooltip>
              </TableRow>
            </TableHead>
            <TableBody>
              {bindingsite.constituents
                ? bindingsite.constituents
                    .slice((constituentsPage - 1) * 20, constituentsPage * 20)
                    .map(residue => (
                      <TableRow key={residue.resid}>
                        <TableCell component="th" scope="row">
                          {residue.resn}
                        </TableCell>
                        <TableCell align="right">{residue.resid}</TableCell>

                        <TableCell
                          className={tableClasses.hovercell}
                          onClick={() => {
                            downloadStrand(chosenStruct, residue.strand_id);
                          }}
                          align="right"
                        >
                          {residue.strand_id}
                        </TableCell>
                        <TableCell
                          onClick={() => {
                            return residue.banClass
                              ? history.push(`/rps/${residue.banClass}`)
                              : null;
                          }}
                          align="right"
                        >
                          {residue.banClass}
                        </TableCell>
                      </TableRow>
                    ))
                : ""}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </Grid>
  );
}

const mapstate = (appstate:AppState, ownProps:any):ReduxProps => ({
    static_catalogue: appstate.utils.static_catalogue,
    ligmap          : appstate.utils.ligand_by_struct,
    structmap       : appstate.utils.struct_by_ligand
})

export default connect(mapstate,null) ( Interfaces )
