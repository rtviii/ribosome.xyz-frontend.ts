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
import { debounce } from 'lodash';

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

  useEffect(() => {
    var options = {
      moleculeId: 'none',
      hideControls: true
    }
    var viewerContainer = document.getElementById('molstar-viewer');
    viewerInstance.render(viewerContainer, options);
  }, [])

  const structs = useSelector((state: AppState) => state.structures.derived_filtered)

  const debounedRangeChange1__redux = debounce((redux_range: number[]) => {
    dispatch(superimpose_slot_change(1, { chain_range: redux_range }))
  }, 200)

  const debounedRangeChange2__redux = debounce((redux_range: number[]) => {
    dispatch(superimpose_slot_change(2, { chain_range: redux_range }))
  }, 200)


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

  // 
  // 
  // 
  // 
  // 

  // | ------------------------------------------ OLD STATE ----------------------------------|
  const [chains2, setChains2] = useState<PolymerMinimal[]>([])
  const [chains1, setChains1] = useState<PolymerMinimal[]>([])
  // | ------------------------------------------ OLD STATE ----------------------------------|
  const minDistance = 10;



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
            `${process.env.REACT_APP_DJANGO_URL}/static_files/ranged_align/?` +
            `r1start=${range_slot_1![0]}` +
            `&r1end=${range_slot_1![1]}` +
            `&r2start=${range_slot_2![0]}` +
            `&r2end=${range_slot_2![1]}` +
            `&struct1=${slot_1.struct?.struct.rcsb_id}` +
            `&struct2=${slot_2.struct?.struct.rcsb_id}` +
            `&auth_asym_id1=${slot_1.chain?.auth_asym_id}` +
            `&auth_asym_id2=${slot_2.chain?.auth_asym_id}`,
          format: "pdb",
          binary: false,
        },
      })
    }

  }

  // const requestAlignment = (
  //   struct1: string,
  //   struct2: string,
  //   asym_id1: string,
  //   asym_id2: string,
  // ) => {

  //   getNeo4jData("static_files", {
  //     endpoint: "align_3d",
  //     params: {
  //       struct1,
  //       struct2,
  //       auth_asym_id1: asym_id1,
  //       auth_asym_id2: asym_id2
  //     },
  //   })
  //     .then(
  //       resp => { fileDownload(resp.data, `${struct1}-${asym_id1}_over_${struct2}-${asym_id2}.pdb`) },
  //       e => console.log(e)
  //     )
  // };


  const handleStructChange = (struct_number: number) => (event: React.ChangeEvent<{ value: unknown }>, newvalue: NeoStruct) => {
    if (struct_number === 1) {
      if (newvalue === null) {
        dispatch(superimpose_slot_change(1, {
          struct: null,
          chain: null
        }))

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

      } else {

        dispatch(superimpose_slot_change(2, { struct: newvalue, }))
        dispatch(cache_full_struct(newvalue.struct.rcsb_id, 1))
        setChains2([...newvalue.rps.sort(nomenclatureCompareFn), ...newvalue.rnas])

      }
    }
  }

  const handleChainChange = (chain_number: number) => (event: React.ChangeEvent<{ value: unknown }>,
    newvalue: PolymerMinimal) => {

    console.log("Changing chain. Newavalue: ", newvalue);

    if (chain_number === 1) {
      if (newvalue === null) {
        dispatch(superimpose_slot_change(1, {
          chain: null
        }))
        // setRangeSlider2([0, minDistance])

      } else {
        dispatch(superimpose_slot_change(1, {
          chain: newvalue
        }))

        // setRangeSlider1([0, newvalue.entity_poly_seq_one_letter_code.length - 1])

      }
    }

    if (chain_number === 2) {
      if (newvalue === null) {

        dispatch(superimpose_slot_change(2, {
          chain: null
        }))
        // set_auth_asym_id2(null)
        // setChainStructPair2([null, chainStructPair2[1]])
        // setRangeSlider2([0, minDistance])
      } else {
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
    text: "Multiple individual components (sets of protein- and RNA-strands, protein-ion clusters, etc. ) belonging to different structures can be extracted, superimposed and exported here\
     for further processing and structural analyses."}




  // const handleChange1 = (
  //   event: Event,
  //   newValue: number | number[],
  //   activeThumb: number,
  // ) => {
  //   if (!Array.isArray(newValue)) {
  //     return;
  //   }
  //   if (activeThumb === 0) {
  //     setRangeSlider1([Math.min(newValue[0], rangeSlider1[1] - minDistance), rangeSlider1[1]]);
  //   } else {
  //     setRangeSlider1([rangeSlider1[0], Math.max(newValue[1], rangeSlider1[0] + minDistance)]);
  //   }
  // };

  // const handleChange2 = (
  //   event: Event,
  //   newValue: number | number[],
  //   activeThumb: number,
  // ) => {
  //   if (!Array.isArray(newValue)) {
  //     return;
  //   }

  //   if (activeThumb === 0) {
  //     setRangeSlider2([Math.min(newValue[0], rangeSlider2[1] - minDistance), rangeSlider2[1]]);
  //   } else {
  //     setRangeSlider2([rangeSlider2[0], Math.max(newValue[1], rangeSlider2[0] + minDistance)]);
  //   }
  // };

  return (
    <Grid container xs={12} spacing={1} style={{ outline: "1px solid gray", height: "100vh" }} alignContent="flex-start">

      <Grid item xs={12}>
        <PageAnnotation {...pageData} />
      </Grid>

      <Grid item direction="column" xs={2} spacing={2} style={{ padding: "10px" }}>


        {/*  ------------------------------------------------------- SLOT 1 --------------------------------------*/}
        <Grid item style={{ marginBottom: "40px" }}>
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

          <ChainHighlightSlider
            redux_effect={debounedRangeChange1__redux}
            auth_asym_id={slot_1.chain?.auth_asym_id as string}
            full_structure_cache={struct_cache_1} />

          <ChainHighlightSlider
            redux_effect={debounedRangeChange2__redux}
            auth_asym_id={slot_2.chain?.auth_asym_id as string}
            full_structure_cache={struct_cache_2} />



          {/* <Slider
            getAriaLabel={() => 'Minimum distance'}
            value={rangeSlider1}
            min={0}
            max={chainStructPair1[0] !== null ? chainStructPair1[0].entity_poly_seq_one_letter_code.length : minDistance}
            onChange={handleChange1}
            valueLabelDisplay="auto"
            // getAriaValueText={valuetext}
            disabled={chainStructPair1[0] === null}
            disableSwap
          />

          range : {rangeSlider1[0]} - {rangeSlider1[1]} */}



          {/* <ChainHighlightSlider auth_asym_id={}/> */}
        </Grid>
        {/*  ------------------------------------------------------- SLOT 1 --------------------------------------*/}





        {/* ------------------------------------------  SLOT 2 */}
        <Grid item style={{ marginBottom: "40px" }}>

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


          {/* <Slider
            getAriaLabel={() => 'Minimum distance'}
            value={rangeSlider2}
            min={0}
            max={chainStructPair2[0] !== null ? chainStructPair2[0].entity_poly_seq_one_letter_code.length : minDistance}
            onChange={handleChange2}
            valueLabelDisplay="auto"
            // getAriaValueText={valuetext}
            disabled={chainStructPair2[0] === null}
            disableSwap
          />
          range : {rangeSlider2[0]} - {rangeSlider2[1]} */}
        </Grid>

        {/* ------------------------------------------  SLOT 2 */}



        <Grid item>

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

          {/* 
          <Button
            style={{ marginBottom: "10px", textTransform: "none" }}
            fullWidth
            variant="outlined"
            onClick={() => {
              if ([slot_1.chain, slot_1.struct, slot_2.chain, slot_2.struct].includes(null)) {
                alert("Select chains to align.")
                return
              }

              viewerInstance.visual.update({
                customData: {
                  url: `${process.env.REACT_APP_DJANGO_URL}/static_files/align_3d/?struct1=${slot_1.struct?.struct.rcsb_id}&struct2=${slot_2.struct?.struct.rcsb_id}&strand1=${slot_1.chain?.auth_asym_id}&strand2=${slot_2.chain?.auth_asym_id}`,
                  format: "pdb",
                  binary: false,
                },
              });

              requestAlignment(
                chainStructPair1[1] as string,
                chainStructPair2[1] as string,
                chainStructPair1[0]?.auth_asym_id as string,
                chainStructPair2[0]?.auth_asym_id as string,
              );
            }}>
            Download Aligned
          </Button> */}
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


