import React, { useEffect, useState, useRef} from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { getNeo4jData } from '../../../redux/AsyncActions/getNeo4jData';
import { RibosomalProtein, RibosomeStructure } from '../../../redux/RibosomeTypes';
import Button from '@material-ui/core/Button';
import fileDownload from 'js-file-download';
import Grid from '@material-ui/core/Grid';
import PageAnnotation from '../Display/PageAnnotation';
import { WarningPopover } from './../WorkInProgressChip'
import { DashboardButton } from '../../../materialui/Dashboard/Dashboard';



const useScript = ( url:string ) => {
  useEffect(() => {
    const script = document.createElement('script');

    script.src = url;
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, [url]);
};

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
  const classes = useStyles();

  const [structs, setStructs] = useState<StructRespone[]>([])
  const [prots1, setProts1]   = useState<{nomenclature:string[],strandid:string}[]>([])
  const [prots2, setProts2]   = useState<{nomenclature:string[],strandid:string}[]>([])

  const [struct1,setstruct1] = useState<string>('')
  const [struct2,setstruct2] = useState<string>('')
  const [strand1,setstrand1] = useState<string>('')
  const [strand2,setstrand2] = useState<string>('')

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
  

  useEffect(() => {
      getNeo4jData('neo4j',
     {endpoint:'get_all_structs',params:null}).then(
         r=>{ 
            console.log(r.data)     
            setStructs(r.data)
        },
         e=>console.log("error on fetch")
     )
      return () => {
      }
  }, [])


  useEffect(() => {
      var options = {
        moleculeId: 'none',
        hideControls: true
      }
      var viewerContainer = document.getElementById('molstar-viewer');
      viewerInstance.render(viewerContainer, options);
  }, [])

  const updateViewer = () =>{
    console.log("Updating");
    
    viewerInstance.visual.update(
     { url: 'https://www.ebi.ac.uk/pdbe/coordinates/1cbs/chains?entityId=1&asymId=A&encoding=bcif', format: 'cif', binary:false } )
      
      // {
      // moleculeId:"1cbs"})
  }


  const pageData={
    title:"Subcomponents Alignment",
    text:"Multiple individual components (sets of protein- and RNA-strands, protein-ion clusters, etc. ) belonging to different structures can be extracted, superimposed and exported here\
     for further processing and structural analyses."}

  return (
    <div>
      <Grid container xs={12} direction="column">
        <Grid item xs={1} style={{ margin: 20 }}>
          <WarningPopover content="This module is at proof-of-concept stage and is still in construction. Pairwise alignmnet and download of proteins from different structures is available." />
        </Grid>

        <Grid item xs={12}>
          <PageAnnotation {...pageData} />
        </Grid>
        <Grid item container xs={12}>


        <Grid item xs={2} className='alignment-dash'>

          <div>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="grouped-native-select">
                Structure 1
              </InputLabel>
              <Select
                native
                defaultValue=""
                id="struct1"
                onChange={e => {
                  setProts1(
                    getProteinsForStruct(e.target.value as string, structs)
                  );
                  setstruct1(e.target.value as string);
                }}
              >
                <option aria-label="None" value="" />
                {structs.map(str => (
                  <option value={str.struct.rcsb_id}>
                    {str.struct.rcsb_id}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="grouped-select">Strand</InputLabel>
              <Select
                defaultValue=""
                id="grouped-select"
                onChange={e => setstrand1(e.target.value as string)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>

                {prots1.map(rp => (
                  <MenuItem value={rp.strandid}>
                    {`${rp.strandid} (${rp.nomenclature})`}{" "}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <Grid container direction="column" xs={4} item>
            <Grid direction="column" xs={4} item></Grid>
            <Grid direction="column" xs={4} item></Grid>

            <Grid direction="column" xs={4} item></Grid>
          </Grid>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="grouped-native-select">Structure 2</InputLabel>

            <Select
              native
              defaultValue=""
              id="struct2"
              onChange={e => {
                setProts2(
                  getProteinsForStruct(e.target.value as string, structs)
                );
                setstruct2(e.target.value as string);
              }}
            >
              <option aria-label="None" value="" />
              {structs.map(str => (
                <option value={str.struct.rcsb_id}>{str.struct.rcsb_id}</option>
              ))}
            </Select>
          </FormControl>

          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="grouped-select">Strand</InputLabel>
            <Select
              defaultValue=""
              id="grouped-select"
              onChange={e => {
                setstrand2(e.target.value as string);
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {prots2.map(rp => (
                <MenuItem value={rp.strandid}>
                  {`${rp.strandid} (${rp.nomenclature})`}{" "}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

                <DashboardButton/>


        </Grid>


<Grid item container xs={10}>
      {/* <button onClick={()=>{viewerInstance.visual.update({moleculeId:'1cbs'})}}> Update</button> */}
      <button
        onClick={() => {
          viewerInstance.visual.update({
            customData: {
              url:
                "https://ribosome.xyz:8000/static_files/pairwise_align/?struct1=3j9m&struct2=7k00&strand1=AF&strand2=k",
              format: "cif",
              binary: false,
            },
          });
        }}
      >
        Request Aligned
      </button>

      <div id="molstar-viewer">Molstar Viewer</div>
        <Button variant="outlined"
          onClick={() => {
            viewerInstance.visual.update({
              customData: {
                url: `https://ribosome.xyz:8000/static_files/pairwise_align/?struct1=${struct1}&struct2=${struct2}&strand1=${strand1}&strand2=${strand2}`,
                format: "cif",
                binary: false,
              },
            });
            console.log("requesting ", struct1, struct2, strand1, strand2);
            requestAlignment({
              struct1: struct1,
              struct2: struct2,
              strand1: strand1,
              strand2: strand2,
            });
          }}>
          Align
        </Button>

</Grid>

        </Grid>


      </Grid>

    </div>
  );

}
