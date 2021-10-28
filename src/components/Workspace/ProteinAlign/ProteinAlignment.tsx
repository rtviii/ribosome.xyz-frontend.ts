import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { getNeo4jData } from '../../../redux/AsyncActions/getNeo4jData';
import { RibosomeStructure } from '../../../redux/RibosomeTypes';
import Button from '@material-ui/core/Button';
import fileDownload from 'js-file-download';
import Grid from '@material-ui/core/Grid';
import PageAnnotation from '../Display/PageAnnotation';
import { DashboardButton } from '../../../materialui/Dashboard/Dashboard';
import { AppState } from '../../../redux/store';
import { useSelector } from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete/Autocomplete';
import TextField from '@material-ui/core/TextField/TextField';
import Paper from '@material-ui/core/Paper/Paper';
import { NeoStruct, PolymerMinimal } from '../../../redux/DataInterfaces';
import { Input } from '@mui/material';
import Box from '@mui/material/Box';
import { Typography } from '@material-ui/core';

// TODO:
// Elements are actually downloadable and visualizable
// Error handling
// Sorted rps (numerical precedence)




   export const nomenclatureCompareFn = (a: PolymerMinimal, b: PolymerMinimal) => {
    //  console.log("Got two to sort" , a, b);
     
    if (a.nomenclature.length < 1 && b.nomenclature.length > 0) {
      return -1
    }
    else if (b.nomenclature.length < 1 && a.nomenclature.length > 0) {
      return 1
    }
    else if (b.nomenclature.length < 1 && a.nomenclature.length < 1) {
      return 0
    }
    else if (a.nomenclature[0] > b.nomenclature[0]) {
      return 1
    }
    else if (a.nomenclature[0] < b.nomenclature[0]) {
      return -1
    }
    else {
      return 0
    }
  }


// @ts-ignore
const viewerInstance = new PDBeMolstarPlugin() as any;

export default function ProteinAlignment() {
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        marginLeft: 20
      }

    })
  );
  const classes = makeStyles((theme: Theme) => ({
    autocomplete: {
      width: "100%",
      marginBottom: "10px"
    },
    pageDescription: {
      padding: "20px",
      width: "100%",
      height: "min-content"
    },
    card: {
      width: "100%"
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
    },
    formControl: {
      width: "40%",
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    bspaper: {
      padding: "10px"
    },
    bsHeader: {
      padding: "10px",

    }
  }))();


  const structs = useSelector((state: AppState) => state.structures.derived_filtered)

  const [chainStructPair1, setChainStructPair1] = useState<[string | null, string | null]>([null, null])
  const [chainStructPair2, setChainStructPair2] = useState<[string | null, string | null]>([null, null])

  const [struct1, setstruct1] = useState<NeoStruct | null>(null)
  const [struct2, setstruct2] = useState<NeoStruct | null>(null)

  const [auth_asym_id1, set_auth_asym_id1] = useState<any>(null)
  const [auth_asym_id2, set_auth_asym_id2] = useState<any>(null)

  const [chains2, setChains2] = useState<PolymerMinimal[]>([])
  const [chains1, setChains1] = useState<PolymerMinimal[]>([])


  const [resrange1, setresrange1] = useState<number>(0)
  const [resrange2, setresrange2] = useState<number>(0)


  const visualizeAlignment = (
  )=>{
        console.log("Got:",
        struct1,struct2,auth_asym_id1,auth_asym_id2
        );

      if ( chainStructPair1.includes(null) || chainStructPair2.includes(null) ){
        alert("Please select a chain in both structures to align.")
      }
              viewerInstance.visual.update({
                customData: {
                  url:
                    `${process.env.REACT_APP_DJANGO_URL}/static_files/align_3d/?struct1=${chainStructPair1[1]}&struct2=${chainStructPair2[1]}&auth_asym_id1=${chainStructPair1[0]}&auth_asym_id2=${chainStructPair2[0]}`,
                  format: "pdb",
                  binary: false,
                },
              });
  }
  const requestAlignment = (
    struct1: string,
    struct2: string,
    auth_asym_id1: string,
    auth_asym_id2: string,
  ) => {

    getNeo4jData("static_files", {
      endpoint: "align_3d",
      params: {
        struct1,
        struct2,
        auth_asym_id1,
        auth_asym_id2
      },
    })
      .then(
        resp => { fileDownload(resp.data, `${struct1}-${auth_asym_id1}_over_${struct2}-${auth_asym_id2}.pdb`) },
        e => console.log(e)
      )
  };


  const handleStructChange = (struct_number: number) => (event: React.ChangeEvent<{ value: unknown }>, newvalue: NeoStruct) => {

      

    
    if (struct_number === 1) {
      if (newvalue === null) {
        setstruct1(null)
        setChainStructPair1([chainStructPair1[0], null])
        set_auth_asym_id1(null)
      }
      else {

        setstruct1(newvalue)
        setChainStructPair1([chainStructPair1[0], newvalue.struct.rcsb_id])
        setChains1([ ...newvalue.rps.sort(nomenclatureCompareFn), ...newvalue.rnas])
        set_auth_asym_id1(null)

      }
    }

    if (struct_number === 2) {
      if (newvalue === null) {
        setstruct2(null)
        setChainStructPair2([chainStructPair2[0], null])
        set_auth_asym_id2(null)
      } else {
        setstruct2(newvalue)
        setChainStructPair2([chainStructPair2[0], newvalue.struct.rcsb_id])
        setChains2( [ ...newvalue.rps.sort(nomenclatureCompareFn), ...newvalue.rnas ])
        set_auth_asym_id2(null)
      }
    }
  }


  const handleChainChange = (chain_number: number) => (event: React.ChangeEvent<{ value: unknown }>,
    newvalue: PolymerMinimal) => {
      

    if (chain_number === 1) {
      if (newvalue === null) {
        set_auth_asym_id1(null)
        setChainStructPair1([null, chainStructPair1[1]])
      } else {
        set_auth_asym_id1(newvalue)
        setChainStructPair1([newvalue.auth_asym_id, chainStructPair1[1]])
      }
    }

    if (chain_number === 2) {
      if (newvalue === null) {
        set_auth_asym_id2(null)
        setChainStructPair2([null, chainStructPair2[1]])
      } else {
        set_auth_asym_id2(newvalue)
        setChainStructPair2([newvalue.auth_asym_id, chainStructPair2[1]])
      }
    }
  }

  useEffect(() => {
    var options = {
      moleculeId: 'none',
      hideControls: true
    }
    var viewerContainer = document.getElementById('molstar-viewer');
    viewerInstance.render(viewerContainer, options);
  }, [])

  const pageData = {
    title: "3D Superimposition",
    text: "Multiple individual components (sets of protein- and RNA-strands, protein-ion clusters, etc. ) belonging to different structures can be extracted, superimposed and exported here\
     for further processing and structural analyses."}

  return (
    <Grid container xs={12} spacing={1} style={{ outline: "1px solid gray", height: "100vh" }} alignContent="flex-start">

      <Grid item xs={12}>
        <PageAnnotation {...pageData} />
      </Grid>

      <Grid item direction="column" xs={2} spacing={2} style={{ padding: "10px" }}>


        <Grid item style={{ marginBottom: "40px" }}>
          <Autocomplete
            value={struct1}
            className={classes.autocomplete}
            options={structs}
            getOptionLabel={(parent: NeoStruct) => { return parent.struct.rcsb_id ? parent.struct.rcsb_id + " : " + parent.struct.citation_title : "" }}
            // @ts-ignore
            onChange={handleStructChange(1)}
            renderOption={(option) => (<div style={{ fontSize: "10px", width: "400px" }}><b>{option.struct.rcsb_id}</b> {option.struct.citation_title} </div>)}
            renderInput={(params) => <TextField {...params} label={`Structure 1`} variant="outlined" />}
          />
          <Autocomplete
            value          = {auth_asym_id1}
            className      = {classes.autocomplete}
            options        = {chains1}
            getOptionLabel = {(chain: PolymerMinimal) => { 
              // if (chain.nomenclature === null)

              
              return chain.nomenclature && chain.nomenclature.length > 0 ? chain.nomenclature[0] : chain.auth_asym_id }}
            // @ts-ignore
            onChange     = {handleChainChange(1)}
            renderOption = {(option) => (<div style={{ fontSize: "10px", width: "400px" }}><b>{option.nomenclature.length > 0 ? option.nomenclature[0] : " "}</b> {option.auth_asym_id}  </div>)}
            renderInput  = {(params) => <TextField {...params} label={`Chain 1`} variant="outlined" />}
          />

        </Grid>

        <Grid item style={{ marginBottom: "40px" }}>

          <Autocomplete
            value          = {struct2}
            className      = {classes.autocomplete}
            options        = {structs}
            getOptionLabel = {(parent: NeoStruct) => { return parent.struct.rcsb_id ? parent.struct.rcsb_id + " : " + parent.struct.citation_title : "" }}
            // @ts-ignore
            onChange     = {handleStructChange(2)}
            renderOption = {(option) => (<div style={{ fontSize: "10px", width: "400px" }}><b>{option.struct.rcsb_id}</b> {option.struct.citation_title}  </div>)}
            renderInput  = {(params) => <TextField {...params} label={`Structure 2`} variant="outlined" />}
          />

          <Autocomplete
            value={auth_asym_id2}
            className={classes.autocomplete}
            options={chains2}
            getOptionLabel={(chain: PolymerMinimal) => { 
              if (chain.nomenclature !== null){

                return chain.nomenclature.length > 0 ? chain.nomenclature[0] : chain.auth_asym_id
              }
              else{
                return "Undefined Class"

              }
            }}
            // @ts-ignore
            onChange={handleChainChange(2)}
            renderOption={(option) => { 
              
              
              return <div style={{ fontSize: "10px", width: "400px" }}><b>{ option.nomenclature && option.auth_asym_id ? option.nomenclature.length > 0 ? option.nomenclature[0] : " " : " "}</b> {option.auth_asym_id}  </div> }}
            renderInput={(params) => <TextField {...params} label={`Chain 2`} variant="outlined" />}
          />

        </Grid>




        <Grid item>
          <div       style = {{marginBottom: "10px"}}>
          <TextField style = {{width:"100%"}}id = "standard-basic" value={resrange1}  label = "Start Residue"  onChange = {(e)=>{setresrange1(parseInt(e.target.value))}}/>
          <TextField style = {{width:"100%"}}id = "standard-basic"   value={resrange2} label = "End Residue"   onChange = {(e)=>{setresrange2(parseInt(e.target.value))}}/>
</div>
        </Grid>



        <Grid item>

          <Button
            style={{ marginBottom: "10px",textTransform:"none" }}
            fullWidth
            variant="outlined"
          onClick={() =>{

            if (typeof resrange1 === 'number' && typeof resrange2 ==='number' && resrange1 <= resrange2){


            viewerInstance.visual.select({
                data:[
                  {  start_residue_number: resrange1, end_residue_number: resrange2 , color:{r:10,g:200,b:200}, focus:true}
                ],
                nonSelectedColor:{r:240,g:240,b:240}
              })
            
            
            } else{
              alert("Enter an appropriate residue range.")
            }

            }}>
            Select Residue Range
          </Button>
        </Grid>

        <Grid item>

          <Button
            style={{ marginBottom: "10px",textTransform:"none" }}
            fullWidth
            variant="outlined"
            onClick={() => {
              visualizeAlignment()
            }}>
            Align
          </Button>
        </Grid>
        <Grid item>


          <Button
            style={{ marginBottom: "10px" , textTransform:"none"}}
            fullWidth
            variant="outlined"
            onClick={() => {
              if (chainStructPair1.includes(null) || chainStructPair2.includes(null)) {
                alert("Select chains to align.")
                return
              }

              viewerInstance.visual.update({
                customData: {
                  url: `${process.env.REACT_APP_DJANGO_URL}/static_files/align_3d/?struct1=${chainStructPair1[1]}&struct2=${chainStructPair2[1]}&strand1=${chainStructPair1[0]}&strand2=${chainStructPair2[0]}`,
                  format: "pdb",
                  binary: false,
                },
              });



              requestAlignment(
                chainStructPair1[1] as string,
                chainStructPair2[1] as string,
                chainStructPair1[0] as string,
                chainStructPair2[0] as string,
              );
            }}>
            Download Aligned
          </Button>
        </Grid>

      
        <Grid item>
          <DashboardButton />
        </Grid>



      </Grid>

      <Grid item container xs={10}>

				<Grid item xs={12} >
					<Paper variant="outlined" style={{ position: "relative", padding: "10px", height: "80vh" }} >
						<div style={{ position: "relative", width: "100%", height: "100%" }} id="molstar-viewer"></div>
					</Paper>
				</Grid >

      </Grid>

    </Grid>

  );

}


