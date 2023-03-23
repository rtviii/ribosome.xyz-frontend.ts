import React, { useCallback, useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { getNeo4jData } from '../../../redux/AsyncActions/getNeo4jData';
import { RibosomeStructure } from '../../../redux/RibosomeTypes';
import Button from '@material-ui/core/Button';
import fileDownload from 'js-file-download';
import Grid from '@material-ui/core/Grid';
import PageAnnotation from '../Display/PageAnnotation';
import { DashboardButton } from '../../../materialui/Dashboard/Dashboard';
import { AppState } from '../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete/Autocomplete';
import TextField from '@material-ui/core/TextField/TextField';
import Paper from '@material-ui/core/Paper/Paper';
import { NeoStruct, PolymerMinimal } from '../../../redux/DataInterfaces';
import { ChainHighlightSlider } from '../../VisualizationPage/VisualizationPage';
import { cache_full_struct, superimpose_slot_change } from '../../../redux/reducers/Visualization/ActionTypes';
import { debounce, filter } from 'lodash';
import Divider from '@mui/material/Divider';
import { useParams } from 'react-router-dom';
import toast, { Toaster } from "react-hot-toast";

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
  const dispatch = useDispatch();
  const { rcsb_id_param }: { rcsb_id_param: string | undefined } = useParams();

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

  useEffect(() => {
    var options = {
      moleculeId: 'none',
      hideControls: true,
      landscape:true,

    }
    var viewerContainer = document.getElementById('molstar-viewer');
    viewerInstance.render(viewerContainer, options);
  }, [])

  const structs = useSelector((state: AppState) => state.structures.derived_filtered)

  useEffect(()=>{

    if (rcsb_id_param !== undefined) {
      var filtered = structs.filter(s => s.struct.rcsb_id === rcsb_id_param.toUpperCase())
      if (filtered.length > 0) {
        dispatch(superimpose_slot_change(1, {
          struct: filtered[0],
        }))
        dispatch(cache_full_struct(filtered[0].struct.rcsb_id, 0))
        setChains1([...filtered[0].rps.sort(nomenclatureCompareFn), ...filtered[0].rnas])
       var corresponding_species =  structs
        .filter(s => [ ...s.struct.src_organism_ids,  ]
          .includes([ ...filtered[0].struct.src_organism_ids ][0]))
          console.log(corresponding_species)

      toast.success(`Loaded structure ${rcsb_id_param.toUpperCase()} (${filtered[0].struct.src_organism_names.length > 0 ? filtered[0].struct.src_organism_names[0] : ""}) as Structure 1. \nSelect Structure 2 to align against.\n ${corresponding_species.length> 0 ? `${corresponding_species[0].struct.rcsb_id} might also be ${filtered[0].struct.src_organism_names[0]}` : null}.`, {
        duration:7000,
        position:"bottom-left"
      })
      }

    }
  },[structs, rcsb_id_param,dispatch])

  const debounedRangeChange1__redux = debounce((redux_range: number[]) => {
    dispatch(superimpose_slot_change(1, { chain_range: redux_range }))
  }, 300)

  const debounedRangeChange2__redux = debounce((redux_range: number[]) => {
    dispatch(superimpose_slot_change(2, { chain_range: redux_range }))
  }, 301)


  // | ------------------------------------------ NEW STATE ----------------------------------|
  const struct_1 = useSelector((state: AppState) => state.visualization.superimpose.struct_1.struct)
  const struct_2 = useSelector((state: AppState) => state.visualization.superimpose.struct_2.struct)

  const slot_1 = useSelector((state: AppState) => state.visualization.superimpose.struct_1)
  const slot_2 = useSelector((state: AppState) => state.visualization.superimpose.struct_2)

  const struct_cache_1 = useSelector((state: AppState) => state.visualization.full_structure_cache[0])
  const struct_cache_2 = useSelector((state: AppState) => state.visualization.full_structure_cache[1])

  const range_slot_1 = useSelector((state: AppState) => state.visualization.superimpose.struct_1.chain_range)
  const range_slot_2 = useSelector((state: AppState) => state.visualization.superimpose.struct_2.chain_range)
  // | ------------------------------------------ NEW STATE ----------------------------------|


  // | ------------------------------------------ OLD STATE ----------------------------------|
  const [chains2, setChains2] = useState<PolymerMinimal[]>([])                              
  const [chains1, setChains1] = useState<PolymerMinimal[]>([])                             
  // | ------------------------------------------ OLD STATE ----------------------------------|
  const minDistance = 10;

  useEffect(() => {

    console.log("Alignment page got cache struct 1 ", struct_cache_1)
    console.log("Alignment page got cache struct 2 ", struct_cache_2)
  }, [
    struct_cache_1,
    struct_cache_2
  ])

  const downloadRangedAlignment = () => {

    console.log("-----------------")
    console.log("Requesting ranged alignment DOWNLOAD:")
    // @ts-ignore
    console.log(`Struct 1: ${slot_1.struct?.struct.rcsb_id}, chain ${slot_1.chain?.auth_asym_id} [${range_slot_1[0]}, ${range_slot_1[1]}]`)
    // @ts-ignore
    console.log(`Struct 2: ${slot_2.struct?.struct.rcsb_id}, chain ${slot_2.chain?.auth_asym_id} [${range_slot_2[0]}, ${range_slot_2[1]}]`)
    console.log("-----------------")
    if ([slot_1.chain, slot_1.struct, slot_2.chain, slot_2.struct].includes(null)) { alert("Please select a chain in both structures to align and a residue range.") }
    getNeo4jData('v0', {
      endpoint: 'ranged_align',
      params: {
        res_range       : [range_slot_1![0], range_slot_1![1]],
        src_rcsb_id     : slot_1.struct?.struct.rcsb_id as string,
        tgt_rcsb_id     : slot_2.struct?.struct.rcsb_id as string,
        src_auth_asym_id: slot_1.chain?.auth_asym_id as string,
        tgt_auth_asym_id: slot_2.chain?.auth_asym_id as string,
      }
    }).then(response => {
      console.log("got alignment file:", response.data);
      fileDownload(
        response.data,
        `alignment_${slot_1.struct?.struct.rcsb_id as string}.${slot_1.chain?.auth_asym_id as string}_${slot_2.struct?.struct.rcsb_id as string}.${slot_1.chain?.auth_asym_id as string}.cif`,
        "chemical/x-mmcif"
      )
    })

  }

  const visualizeRangedAlignment = (
  ) => {
    console.log("-----------------")
    console.log("Requesting ranged alignment with values:")
    // @ts-ignore
    console.log(`Struct 1: ${slot_1.struct?.struct.rcsb_id}, chain ${slot_1.chain?.auth_asym_id} [${range_slot_1[0]}, ${range_slot_1[1]}]`)
    // @ts-ignore
    console.log(`Struct 2: ${slot_2.struct?.struct.rcsb_id}, chain ${slot_2.chain?.auth_asym_id} [${range_slot_2[0]}, ${range_slot_2[1]}]`)
    console.log("-----------------")

    if ([slot_1.chain, slot_1.struct, slot_2.chain, slot_2.struct].includes(null)) { alert("Please select a chain in both structures to align and a residue range.") }

    if ([range_slot_1, range_slot_2].includes(null)) { alert("range_slot_1 or range_slot_2 is null. Soemthing went wrong"); return } else {
      viewerInstance.visual.update({
        customData: {
          url:
            `${process.env.REACT_APP_DJANGO_URL}/v0/ranged_align?` +
            `range_start=${range_slot_1![0]}` +
            `&range_end=${range_slot_1![1]}` +
            `&src_rcsb_id=${slot_1.struct?.struct.rcsb_id}` +
            `&tgt_rcsb_id=${slot_2.struct?.struct.rcsb_id}` +
            `&src_auth_asym_id=${slot_1.chain?.auth_asym_id}` +
            `&tgt_auth_asym_id=${slot_2.chain?.auth_asym_id}`,
          format: "cif",
          binary: false,
        },
      })
    }

  }


  const handleStructChange = (struct_number: number) => (event: React.ChangeEvent<{ value: unknown }>, newvalue: NeoStruct) => {
    if (struct_number === 1) {
      if (newvalue === null) {
        dispatch(superimpose_slot_change(1, {
          struct: null,
          chain: null
        }))
        setMaxRange1(0)
        dispatch(cache_full_struct(null, 0))
      }
      else {
        dispatch(superimpose_slot_change(1, {
          struct: newvalue,
        }))
        dispatch(cache_full_struct(newvalue.struct.rcsb_id, 0))
        setChains1([...newvalue.rps.sort(nomenclatureCompareFn), ...newvalue.rnas])
      }
    }
    if (struct_number === 2) {
      if (newvalue === null) {
        dispatch(superimpose_slot_change(2, {
          struct: null,
          chain: null
        }))
        dispatch(cache_full_struct(null, 1))

        setMaxRange2(0)

      } else {

        dispatch(superimpose_slot_change(2, { struct: newvalue, }))
        dispatch(cache_full_struct(newvalue.struct.rcsb_id, 1))
        setChains2([...newvalue.rps.sort(nomenclatureCompareFn), ...newvalue.rnas])

      }
    }
  }

  const [ maxRange1, setMaxRange1 ] = useState(0)
  const [ maxRange2, setMaxRange2 ] = useState(0)

  const handleChainChange = (chain_number: number) => (event: React.ChangeEvent<{ value: unknown }>,
    newvalue: PolymerMinimal) => {
    console.log("Changing chain. Newavalue: ", newvalue);
    if (chain_number === 1) {
      if (newvalue === null) {

        setMaxRange1(0)
        dispatch(superimpose_slot_change(1, {
          chain: null
        }))
        // setRangeSlider2([0, minDistance])

      } else {

        setMaxRange1(newvalue.entity_poly_seq_one_letter_code.length)
        dispatch(superimpose_slot_change(1, {
          chain: newvalue
        }))


        // setRangeSlider1([0, newvalue.entity_poly_seq_one_letter_code.length - 1])

      }
    }

    if (chain_number === 2) {
      if (newvalue === null) {

        setMaxRange2(0)
        dispatch(superimpose_slot_change(2, {
          chain: null
        }))
        // set_auth_asym_id2(null)
        // setChainStructPair2([null, chainStructPair2[1]])
        // setRangeSlider2([0, minDistance])

      } else {

        setMaxRange2(newvalue.entity_poly_seq_one_letter_code.length)
        dispatch(superimpose_slot_change(2, {
          chain: newvalue
        }))
        // set_auth_asym_id2(newvalue)
        // setChainStructPair2([newvalue, chainStructPair2[1]])
        // setRangeSlider2([0, newvalue.entity_poly_seq_one_letter_code.length - 1])
      }
    }
  }

  const pageData = {
    title: "3D Superimposition",
    text: ""
  }


  return (
    <Grid container xs={12} spacing={1} style={{ outline: "1px solid gray", height: "100vh" }} alignContent="flex-start">

      <Grid item xs={12}>
        <PageAnnotation {...pageData} />
      </Grid>

      <Grid item direction="column" xs={2}  style={{ paddingRight: "10px" , paddingLeft:"10px"}} >


        {/*  ------------------------------------------------------- SLOT 1 --------------------------------------*/}
        <Grid item >
          <Autocomplete
            value={struct_1}
            className={classes.autocomplete}
            options={structs}
            getOptionLabel={(parent: NeoStruct) => { return parent.struct.rcsb_id ? parent.struct.rcsb_id + " : " + parent.struct.citation_title : "" }}
            // @ts-ignore
            onChange={handleStructChange(1)}
            renderOption={(option) => (<div style={{ fontSize: "10px", width: "400px" }}><b>{option.struct.rcsb_id}</b> {option.struct.citation_title} </div>)}
            renderInput={(params) => <TextField {...params} label={`Structure 1`} variant="outlined" />}
          />
          <Autocomplete
            value={slot_1.chain}
            className={classes.autocomplete}
            options={chains1}
            getOptionLabel={(chain: PolymerMinimal) => {
              // if (chain.nomenclature === null)
              return chain.nomenclature && chain.nomenclature.length > 0 ? chain.nomenclature[0] : chain.auth_asym_id
            }}

            // @ts-ignore
            onChange={handleChainChange(1)}
            renderOption={(option) => (<div style={{ fontSize: "10px", width: "400px" }}><b>{option.nomenclature.length > 0 ? option.nomenclature[0] : " "}</b> {option.auth_asym_id}  </div>)}
            renderInput={(params) => <TextField {...params} label={`Chain 1`} variant="outlined" />}
          />

        </Grid>

        <Grid item >
          <ChainHighlightSlider
            redux_effect={debounedRangeChange1__redux}
            auth_asym_id={slot_1.chain?.auth_asym_id as string}
            full_structure_cache={struct_cache_1} />
        </Grid>

<Grid item>
<Divider/>
</Grid>
        <Grid item style={{marginTop:"40px"}}>
          <Autocomplete
            value={struct_2}
            className={classes.autocomplete}
            options={structs}
            getOptionLabel={(parent: NeoStruct) => { return parent.struct.rcsb_id ? parent.struct.rcsb_id + " : " + parent.struct.citation_title : "" }}
            // @ts-ignore
            onChange={handleStructChange(2)}
            renderOption={(option) => (<div style={{ fontSize: "10px", width: "400px" }}><b>{option.struct.rcsb_id}</b> {option.struct.citation_title}  </div>)}
            renderInput={(params) => <TextField {...params} label={`Structure 2`} variant="outlined" />}
          />

          <Autocomplete
            value={slot_2.chain}
            className={classes.autocomplete}
            options={chains2}
            getOptionLabel={(chain: PolymerMinimal) => {
              if (chain.nomenclature !== null) {
                return chain.nomenclature.length > 0 ? chain.nomenclature[0] : chain.auth_asym_id
              }
              else {
                return "Undefined Class"

              }
            }}
            // @ts-ignore
            onChange={handleChainChange(2)}
            renderOption={(option) => {
              return <div style={{ fontSize: "10px", width: "400px" }}><b>{option.nomenclature && option.auth_asym_id ? option.nomenclature.length > 0 ? option.nomenclature[0] : " " : " "}</b> {option.auth_asym_id}  </div>
            }}
            renderInput={(params) => <TextField {...params} label={`Chain 2`} variant="outlined" />}
          />

        </Grid>

        <Grid item style={{marginBottom:"20px"}}>
          <ChainHighlightSlider
            redux_effect={debounedRangeChange2__redux}
            auth_asym_id={slot_2.chain?.auth_asym_id as string}
            full_structure_cache={struct_cache_2} />
        </Grid>

        <Grid item>

          <Button
            style={{ marginBottom: "10px", textTransform: "none" }}
            fullWidth
            variant="outlined"
            onClick={() => {
              visualizeRangedAlignment()
            }}>
            Align
          </Button>
        </Grid>

        <Grid item>
          <Button
            style={{ marginBottom: "10px", textTransform: "none" }}
            fullWidth
            variant="outlined"
            onClick={() => {
              if ([slot_1.chain, slot_1.struct, slot_2.chain, slot_2.struct].includes(null)) {
                alert("Select chains to align.")
                return
              }

              downloadRangedAlignment()

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

        <Toaster />
    </Grid>

  );

}


