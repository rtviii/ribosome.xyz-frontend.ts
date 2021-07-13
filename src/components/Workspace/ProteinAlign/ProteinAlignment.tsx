import React, { useEffect, useState} from 'react';
import Typography from '@material-ui/core/Typography/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { getNeo4jData } from '../../../redux/AsyncActions/getNeo4jData';
import {  RibosomeStructure } from '../../../redux/RibosomeTypes';
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
import { NeoStruct } from '../../../redux/DataInterfaces';


type StructRespone = {
    struct : RibosomeStructure,
    rps    : {noms:string[], strands:string}[],
    rnas   : string[],
    ligands: string[]
}

// @ts-ignore
const viewerInstance = new PDBeMolstarPlugin() as any;

export default function ProteinAlignment() {
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {      margin: theme.spacing(1),
      minWidth: 120,
      marginLeft:20
    }

  })
);
	const classes = makeStyles((theme: Theme) => ({
		autocomplete: {
			width: "100%",
			marginBottom:"10px"
		},
		pageDescription: {
			padding: "20px",
			width  : "100%",
			height : "min-content"
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
			color      : "black"
		},
		formControl: {
			width:"40%",
			// marginBottom:"10px"
			// margin  : theme.spacing(1),
			// minWidth: 120,
		},
		selectEmpty: {
			marginTop: theme.spacing(2),
		},
		bspaper:{
			padding:"10px"
		},
		bsHeader:{
			padding:"10px",

		}
	}))();


  const structs = useSelector(( state:AppState ) => state.structures.derived_filtered)

  const [chainStructPair1, setChainStructPair1]   = useState< [ string|null , string |null ]>([null, null])
  const [chainStructPair2, setChainStructPair2]   = useState< [ string|null , string |null ]>([null, null])

  const [struct1,setstruct1] = useState<NeoStruct | null>(null)
  const [struct2,setstruct2] = useState<NeoStruct | null>(null)
  const [strand1,setstrand1] = useState<any>(null)
  const [strand2,setstrand2] = useState<any>(null)



  const [chains1, setChains1] = useState<{ noms: string[]; surface_ratio: number | null; strands: string; }[]>([])
  const [chains2, setChains2] = useState<{ noms: string[]; surface_ratio: number | null; strands: string; }[]>([])

  useEffect(() => {
    if (struct1!==null){
      setChains1(struct1.rps)
    }
  }, [struct1])

  useEffect(() => {
    if (struct2!==null){
      setChains2(struct2.rps)
    }
  }, [struct2])



  const requestAlignment = (parameters: {
    struct1: string;
    struct2: string;
    strand1: string;
    strand2: string;
  }) => {

    if (strand1.includes(',')){
      alert(`Please select two single-chain proteins for now: \n ${strand1} is a duplicated chain (as per ${struct1}-PDB deposition). Working on parsing this. `)
      return
    }
    if (strand1.includes(',')){
      alert(`Please select two single-chain proteins for now: \n ${strand1} is a duplicated chain (as per ${struct1}-PDB deposition). Working on parsing this. `)
      return
    }

    getNeo4jData("static_files", {
      endpoint: "pairwise_align",
      params: parameters,
    }).then(
        resp=>{
            fileDownload(resp.data, `${parameters.struct1}-${parameters.strand1}_over_${parameters.struct2}-${parameters.strand2}.cif`)
        },
        e=>console.log(e)
    )
  };



  const getProteinsForStruct = (rcsbid:string, structs:StructRespone[]):{nomenclature:string[],strandid:string}[]=>{
    var sought = structs.filter(struct=>struct.struct.rcsb_id===rcsbid)[0]
    return sought.rps.map(rp=> ( { "nomenclature":rp.noms,"strandid": rp.strands } ))
  }


  const handleStructChange =( struct_number:number )=> (event: React.ChangeEvent<{ value: unknown }>, newvalue:NeoStruct) => {

    if ( struct_number == 1 ){

      if (newvalue === null){
				setstruct1(null)
				setChainStructPair1([chainStructPair1[0], null])
      }else{
        console.log("set tuple 1 value to ", newvalue.struct.rcsb_id);
				setstruct1(newvalue)
				setChainStructPair1([chainStructPair1[0], newvalue.struct.rcsb_id])
			}
        console.log("tuple 1", chainStructPair1);
    }

    if ( struct_number == 2 ){

      if (newvalue === null){
				setstruct2(null)
				setChainStructPair2([chainStructPair2[0], null])
      }else{
        console.log("set tuple 2 value to ", newvalue.struct.rcsb_id);
				setstruct2(newvalue)
				setChainStructPair2([chainStructPair2[0], newvalue.struct.rcsb_id])
			}
        console.log("tuple 2", chainStructPair2);
    }
  }



  const handleChainChange =( struct_number:number )=> (event: React.ChangeEvent<{ value: unknown }>, newvalue:{ noms: string[]; surface_ratio: number | null; strands: string; }) => {

    if ( struct_number == 1 ){

      if (newvalue === null){
				setstrand1(null)
				setChainStructPair1([null, chainStructPair1[1]])
      }else{
				setstrand1(newvalue)
				setChainStructPair1([ newvalue.strands , chainStructPair1[0]])
			}
    }

    if ( struct_number == 2 ){

      if (newvalue === null){
				setstrand2(null)
				setChainStructPair2([null, chainStructPair2[1]])
      }else{
				setstrand2(newvalue)
				setChainStructPair2([ newvalue.strands , chainStructPair2[0]])
			}
    }
  }

  useEffect(() => {
      var options = {
        moleculeId  : 'none',
        hideControls: true
      }
      var viewerContainer = document.getElementById('molstar-viewer');
      viewerInstance.render(viewerContainer, options);
  }, [])

  const pageData={
    title:"Alignment",
    text:"Multiple individual components (sets of protein- and RNA-strands, protein-ion clusters, etc. ) belonging to different structures can be extracted, superimposed and exported here\
     for further processing and structural analyses."}

  return (
		<Grid container xs={12} spacing={1} style={{ outline: "1px solid gray", height: "100vh" }} alignContent="flex-start">

        <Grid item xs={12}>
          <PageAnnotation {...pageData} />
        </Grid>

			<Grid item direction="column" xs={2} spacing={2} style={{ padding: "10px" }}>


<Grid item style={{marginBottom:"40px"}}>   

				<Autocomplete
					value={struct1}
					className={classes.autocomplete}
					options={structs }
					getOptionLabel={(parent: NeoStruct) => { return parent.struct.rcsb_id ? parent.struct.rcsb_id + " : " + parent.struct.citation_title : "" }}
					// @ts-ignore
					onChange     = {handleStructChange(1)}
					renderOption = {(option) => (<div style={{ fontSize: "10px", width: "400px" }}><b>{option.struct.rcsb_id}</b> {option.struct.citation_title}  </div>)}
					renderInput  = {(params) => <TextField {...params} label={`Structure 1`} variant="outlined" />}
				/>
				 <Autocomplete
					value          = {strand1}
					className      = {classes.autocomplete}
					options        = {chains1}
					getOptionLabel = {(chain:  {noms: string[]; surface_ratio: number | null; strands: string;} ) => { return chain.strands ? chain.strands  : "" }}
					// @ts-ignore
					onChange     = {handleChainChange(1)}
					renderOption = {(option) => (<div style={{ fontSize: "10px", width: "400px" }}><b>{option.noms.length > 0 ? option.noms[0] :" "}</b> {option.strands}  </div>)}
					renderInput  = {(params) => <TextField {...params} label={`Chain 1`} variant="outlined" />}
				/> 

</Grid>
<Grid item style={{marginBottom:"40px"}}>   

				<Autocomplete
					value={struct2}
					className={classes.autocomplete}
					options={structs}
					getOptionLabel={(parent: NeoStruct) => { return parent.struct.rcsb_id ? parent.struct.rcsb_id + " : " + parent.struct.citation_title : "" }}
					// @ts-ignore
					onChange     = {handleStructChange(2)}
					renderOption = {(option) => (<div style={{ fontSize: "10px", width: "400px" }}><b>{option.struct.rcsb_id}</b> {option.struct.citation_title}  </div>)}
					renderInput  = {(params) => <TextField {...params} label={`Structure 2`} variant="outlined" />}
				/>
				 <Autocomplete
					value          = {strand2}
					className      = {classes.autocomplete}
					options        = {chains2}
					getOptionLabel = {(chain:  {noms: string[]; surface_ratio: number | null; strands: string;} ) => { return chain.strands ? chain.strands  : "" }}
					// @ts-ignore
					onChange     = {handleChainChange(2)}
					renderOption = {(option) => (<div style={{ fontSize: "10px", width: "400px" }}><b>{option.noms.length > 0 ? option.noms[0] :" "}</b> {option.strands}  </div>)}
					renderInput  = {(params) => <TextField {...params} label={`Chain 2`} variant="outlined" />}
				/> 

</Grid>
{/* 
<Grid item>  
<Typography style={{padding:"10px"}}>
  Select a pair to align with.
</Typography>
</Grid> */}

<Grid item>  


</Grid>

<Grid item>  

        <Button 
        style={{marginBottom:"10px"}}
        fullWidth
        variant="outlined"

        onClick={() => {

          viewerInstance.visual.update({
            customData: {
              url:
                `${process.env.REACT_APP_DJANGO_URL}/static_files/pairwise_align/?struct1=${chainStructPair1[1]}&struct2=${chainStructPair2[1]}&strand1=${chainStructPair1[0]}&strand2=${chainStructPair2[0]}`,
              format: "cif",
              binary: false,
            },
          });
        }}>
        Align
        </Button>
</Grid>
<Grid item>  

        <Button 
        style={{marginBottom:"10px"}}
        fullWidth
        variant="outlined"
          onClick={() => {


            console.log("requesting ", chainStructPair1[1], chainStructPair2[1], chainStructPair1[0], chainStructPair2[0]);
            if (chainStructPair1.includes(null) || chainStructPair2.includes(null)){
              alert("Select chains to align.")
              return
            }


            viewerInstance.visual.update({
              customData: {
                url   : `${process.env.REACT_APP_DJANGO_URL}/static_files/pairwise_align/?struct1=${chainStructPair1[1]}&struct2=${chainStructPair2[1]}&strand1=${chainStructPair1[0]}&strand2=${chainStructPair2[0]}`,
                format: "cif",
                binary: false,
              },
            });
            console.log("requesting ", chainStructPair1[1], chainStructPair2[1], chainStructPair1[0], chainStructPair2[0]);
            requestAlignment({
              struct1: chainStructPair1[1] as string,
              struct2: chainStructPair2[1] as string,
              strand1: chainStructPair1[0] as string,
              strand2: chainStructPair2[0] as string,
            });
          }}>
          Download Aligned
        </Button>
</Grid>
{/* <Grid item>  
          <Cart/>
</Grid> */}
<Grid item>  
                <DashboardButton/>
</Grid>



          </Grid>

<Grid item container xs={10}>
      {/* <button onClick={()=>{viewerInstance.visual.update({moleculeId:'1cbs'})}}> Update</button> */}

				<Grid item xs={12} >
					<Paper variant="outlined" style={{ height: "50vw", position: "relative", padding: "10px" }} >
						<div style={{ position: "relative", width: "100%", height: "100%" }} id="molstar-viewer"></div>
					</Paper>
				</Grid >

</Grid>

      </Grid>

  );

}
