import React, { useEffect, useState, useRef} from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { getNeo4jData } from '../../../redux/Actions/getNeo4jData';
import { RibosomalProtein, RibosomeStructure } from '../../../redux/RibosomeTypes';
import Button from '@material-ui/core/Button';
import fileDownload from 'js-file-download';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  }),
);

type StructRespone = {
    struct : RibosomeStructure,
    rps    : {noms:string[], strands:string}[],
    rnas   : string[],
    ligands: string[]
}

export default function ProteinAlignment() {
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
    getNeo4jData("static_files", {
      endpoint: "pairwise_align",
      params: parameters,
    }).then(
        resp=>{
            fileDownload(resp.data, `${parameters.struct1}-${parameters.strand1}_over_${parameters.struct2}-${parameters.strand2}`)
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






  return (
<div>
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="grouped-native-select">Structure 1</InputLabel>

        <Select native  defaultValue="" id="struct1" onChange={e=>{setProts1(getProteinsForStruct(e.target.value as string, structs))
            setstruct1(e.target.value as string) }} >
          <option aria-label="None" value=""  />
          {structs.map(str=><option value={str.struct.rcsb_id}>{str.struct.rcsb_id}</option>)}
        </Select>

      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="grouped-select">Strand</InputLabel>
        <Select defaultValue="" id="grouped-select"  onChange={e=>setstrand1(e.target.value as string)}>
          <MenuItem value="">
            <em>None</em>
          </MenuItem>

            {prots1.map(rp=> <MenuItem value={rp.strandid}>{`${ rp.strandid } (${rp.nomenclature})`  } </MenuItem>) }

        </Select>
      </FormControl>



    </div>

    <div>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="grouped-native-select">Structure 2</InputLabel>

        <Select native defaultValue="" id="struct2" onChange={e=>{ 
            setProts2(getProteinsForStruct(e.target.value as string, structs))
            setstruct2(e.target.value as string) }}        >
          <option aria-label="None" value="" />
          {structs.map(str=><option value={str.struct.rcsb_id}>{str.struct.rcsb_id}</option>)}
        </Select>

      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="grouped-select">Strand</InputLabel>
        <Select defaultValue="" id="grouped-select" onChange={(e)=>{setstrand2(e.target.value as string)}}>
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
            {prots2.map(rp=> <MenuItem value={rp.strandid}>{`${ rp.strandid } (${rp.nomenclature})`  } </MenuItem>) }

        </Select>
      </FormControl>
    <Button variant="outlined"
    onClick={
        ()=>{
            console.log("requesting ", struct1,struct2,strand1,strand2)
            requestAlignment({
                struct1:struct1,
                struct2:struct2,
                strand1:strand1,
                strand2:strand2
            })

        }
    }
    >Align</Button>
    </div>




</div>
  );

}
