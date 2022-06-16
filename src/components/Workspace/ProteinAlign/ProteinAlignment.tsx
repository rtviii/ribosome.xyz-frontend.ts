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
import Slider from '@mui/material/Slider';
import { log } from 'console';


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

  useEffect(() => {
    var options = {
      moleculeId: 'none',
      hideControls: true
    }
    var viewerContainer = document.getElementById('molstar-viewer');
    viewerInstance.render(viewerContainer, options);
  }, [])

  const structs = useSelector((state: AppState) => state.structures.derived_filtered)

  const [chainStructPair1, setChainStructPair1] = useState<[PolymerMinimal | null, string | null]>([null, null])
  const [chainStructPair2, setChainStructPair2] = useState<[PolymerMinimal | null, string | null]>([null, null])

  const [struct1, setstruct1] = useState<NeoStruct | null>(null)
  const [struct2, setstruct2] = useState<NeoStruct | null>(null)

  const [auth_asym_id1, set_auth_asym_id1] = useState<any>(null)
  const [auth_asym_id2, set_auth_asym_id2] = useState<any>(null)

  const [chains2, setChains2] = useState<PolymerMinimal[]>([])
  const [chains1, setChains1] = useState<PolymerMinimal[]>([])

  const minDistance = 10;

  const [rangeSlider1, setRangeSlider1] = useState<number[]>([0, minDistance]);
  const [rangeSlider2, setRangeSlider2] = useState<number[]>([0, minDistance]);

  useEffect(() => {
    console.log("auth asymid 1:" , auth_asym_id1   )
    console.log("struct pair 1 :", chainStructPair1)
    console.log("struct 1 :"     , struct1         )
    console.log("range 1 :"      , rangeSlider1    )

  }, [chainStructPair1, struct1, rangeSlider1, auth_asym_id1])



  // const [residueRange1, setResidueRange1] = React.useState<number[]>([0, 0]);  // current slider value
  // const [MaxRes1, setMaxRes1] = React.useState<number>(0);         // keep track of what's the max residue range



  useEffect(() =>{
    if (chainStructPair1.includes(null)){setRangeSlider1([0, minDistance])}
    if (chainStructPair1[1]===null){setChains1([])}
    viewerInstance.visual.reset({ camera: true, theme: true })
    viewerInstance.visual.update({      moleculeId: 'none'})

  },[chainStructPair1])

  useEffect(() =>{
    if (chainStructPair2.includes(null)){setRangeSlider2([0, minDistance])}
    if (chainStructPair2[1]===null){setChains1([])}

    viewerInstance.visual.reset({ camera: true, theme: true })

  },[chainStructPair2])

  const visualizeRangedAlignment = (
  ) => {

    
    console.log("-----------------")
    console.log("Requesting ranged alignment with values:")
    console.log(`Struct 2: ${chainStructPair1[1]}, chain ${chainStructPair1[0]} [${rangeSlider1[0]}, ${rangeSlider1[1]}]`)
    console.log(`Struct 1: ${chainStructPair2[1]}, chain ${chainStructPair2[0]} [${rangeSlider2[0]}, ${rangeSlider2[1]}]`)
    console.log("-----------------")
    if (chainStructPair1.includes(null) || chainStructPair2.includes(null)) {alert("Please select a chain in both structures to align and a residue range.")}
    viewerInstance.visual.update({
      customData: {
        url   : 
        `${process.env.REACT_APP_DJANGO_URL}/static_files/ranged_align/?`+
       `r1start=${rangeSlider1[0]}`+
       `&r1end=${[rangeSlider1[1]]}` +
       `&r2start=${[rangeSlider2[0]]}` +
       `&r2end=${[rangeSlider2[1]]}` +
       `&struct1=${chainStructPair1[1]}`+
       `&struct2=${chainStructPair2[1]}`+
       `&auth_asym_id1=${chainStructPair1[0]?.auth_asym_id}`+
       `&auth_asym_id2=${chainStructPair2[0]?.auth_asym_id}`,
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
        setChainStructPair1([null, null])
        // setChainStructPair1([chainStructPair1[0], null])
        set_auth_asym_id1(null)
      }
      else {
        setstruct1(newvalue)

        setChainStructPair1([chainStructPair1[0], newvalue.struct.rcsb_id])
        setChains1([...newvalue.rps.sort(nomenclatureCompareFn), ...newvalue.rnas])
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
        setChains2([...newvalue.rps.sort(nomenclatureCompareFn), ...newvalue.rnas])
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

        setRangeSlider2([0, minDistance])
      } else {
        set_auth_asym_id1(newvalue)
        setChainStructPair1([newvalue, chainStructPair1[1]])
        setRangeSlider1([0, newvalue.entity_poly_seq_one_letter_code.length - 1])
      }
    }

    if (chain_number === 2) {
      if (newvalue === null) {
        set_auth_asym_id2(null)
        setChainStructPair2([null, chainStructPair2[1]])
        setRangeSlider2([0, minDistance])
      } else {
        set_auth_asym_id2(newvalue)
        setChainStructPair2([newvalue, chainStructPair2[1]])
        setRangeSlider2([0, newvalue.entity_poly_seq_one_letter_code.length - 1])
      }
    }
  }


  const pageData = {
    title: "3D Superimposition",
    text: "Multiple individual components (sets of protein- and RNA-strands, protein-ion clusters, etc. ) belonging to different structures can be extracted, superimposed and exported here\
     for further processing and structural analyses."}






  const handleChange1 = (
    event: Event,
    newValue: number | number[],
    activeThumb: number,
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setRangeSlider1([Math.min(newValue[0], rangeSlider1[1] - minDistance), rangeSlider1[1]]);
    } else {
      setRangeSlider1([rangeSlider1[0], Math.max(newValue[1], rangeSlider1[0] + minDistance)]);
    }
  };

  const handleChange2 = (
    event      : Event,
    newValue   : number | number[],
    activeThumb: number,
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setRangeSlider2([Math.min(newValue[0], rangeSlider2[1] - minDistance), rangeSlider2[1]]);
    } else {
      setRangeSlider2([rangeSlider2[0], Math.max(newValue[1], rangeSlider2[0] + minDistance)]);
    }
  };

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
            onChange     = {handleStructChange(1)}
            renderOption = {(option) => (<div style={{ fontSize: "10px", width: "400px" }}><b>{option.struct.rcsb_id}</b> {option.struct.citation_title} </div>)}
            renderInput  = {(params) => <TextField {...params} label={`Structure 1`} variant="outlined" />}
          />
          <Autocomplete
            value={auth_asym_id1}
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

{/* _____________________New slider */}
          {/* <Grid xs={12} item>
            <Paper variant="outlined"
              style={{
                height: "70px", width: "100%", paddingBottom: "5px", paddingTop: "5px", paddingLeft: "10px", paddingRight: "10px"
              }}>

              <Grid container direction="row" xs={12} spacing={1} style={{ width: "100%", height: "50px" }} >
                <Grid item xs={3}>
                  <TextField
                    // style    = {{width:"50px"}}
                    value={residueRange[0]}
                    onChange={handleResRangeStart(residueRange[1])}
                    id="outlined-number"
                    label={`Residue ${currentChainFull?.entity_poly_seq_one_letter_code_can[residueRange[0]]}`}
                    fullWidth
                    disabled={currentChainFull === null}
                    type="number"
                    InputLabelProps={{ style: { fontSize: 16 } }}
                  />
                </Grid>

                <Grid item xs={6} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "10px", }}>
                  <Slider
                    style={{ width: "100%" }}
                    getAriaLabel={() => 'Chain XXX'}
                    value={residueRange}
                    disabled={currentChainFull === null}
                    min={0}
                    max={currentChainFull?.entity_poly_seq_length}
                    // @ts-ignore
                    onChange={handleSliderChange}
                    valueLabelDisplay="auto"
                  // getAriaValueText  = {valuetext}
                  />
                </Grid>

                <Grid item xs={3}>
                  <TextField
                    // style    = {{width:"50px"}}
                    disabled={currentChainFull === null}
                    value={residueRange[1]}
                    onChange={handleResRangeEnd(residueRange[0])}
                    id="ou2tlined-number"
                    fullWidth
                    label={`Residue ${currentChainFull?.entity_poly_seq_one_letter_code_can[residueRange[1] - 1]}`}
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                      style: { fontSize: 16 }
                    }}
                  />

                </Grid>
              </Grid>
            </Paper>
          </Grid> */}
{/* _____________________New slider */}

{/* Old slider 2 */}
          <Slider
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

{/* Old slider 2 */}


          range : {rangeSlider1[0]} - {rangeSlider1[1]}

        </Grid>

        <Grid item style={{ marginBottom: "40px" }}>

          <Autocomplete
            value={struct2}
            className={classes.autocomplete}
            options={structs}
            getOptionLabel={(parent: NeoStruct) => { return parent.struct.rcsb_id ? parent.struct.rcsb_id + " : " + parent.struct.citation_title : "" }}
            // @ts-ignore
            onChange={handleStructChange(2)}
            renderOption={(option) => (<div style={{ fontSize: "10px", width: "400px" }}><b>{option.struct.rcsb_id}</b> {option.struct.citation_title}  </div>)}
            renderInput={(params) => <TextField {...params} label={`Structure 2`} variant="outlined" />}
          />

          <Autocomplete
            value={auth_asym_id2}
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


          <Slider
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
          range : {rangeSlider2[0]} - {rangeSlider2[1]}
        </Grid>

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

          {/* <Button
            style={{ marginBottom: "10px", textTransform: "none" }}
            fullWidth
            variant="outlined"
            onClick={() => {
              visualizeAlignment()
            }}>
            Align
          </Button> */}
        </Grid>
        <Grid item>


          <Button
            style={{ marginBottom: "10px", textTransform: "none" }}
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
                chainStructPair1[0]?.auth_asym_id as string,
                chainStructPair2[0]?.auth_asym_id as string,
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


