import Button from "@material-ui/core/Button";
import FormControl from '@material-ui/core/FormControl';
import Grid from "@material-ui/core/Grid";
import InputLabel from '@material-ui/core/InputLabel';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from '@material-ui/core/ListSubheader/ListSubheader';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper/Paper';
import Select from '@material-ui/core/Select';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Popover from '@mui/material/Popover';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import fileDownload from 'js-file-download';
import Tooltip from "@mui/material/Tooltip";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { DashboardButton } from '../../materialui/Dashboard/Dashboard';
import { getNeo4jData } from '../../redux/AsyncActions/getNeo4jData';
import { BanClassMetadata, NeoStruct, ProteinProfile, RNAProfile } from '../../redux/DataInterfaces';
import { cache_full_struct, COMPONENT_TAB_CHANGE, fullstructCache_change, protein_change, protein_update_auth_asym_id, rna_change, rna_update_auth_asym_id, struct_change, VisualizationTabs } from '../../redux/reducers/Visualization/ActionTypes';
import { AppState, store } from '../../redux/store';
import { nomenclatureCompareFn } from '../Workspace/ProteinAlign/ProteinAlignment';
import { StructHeroVertical, CardBodyAnnotation } from "./../../materialui/StructHero";
import ContentCutIcon from '@mui/icons-material/ContentCut';
import SearchIcon from '@mui/icons-material/Search';
import { Protein, ProteinClass, RibosomeStructure, RNA, RNAClass } from "../../redux/RibosomeTypes";
import _, { chain, StringNullableChain } from "lodash";
import { truncate } from "../Main";
import './VisualizationPage.css'
import DownloadIcon from '@mui/icons-material/Download';
import { SeqViz } from "seqviz";
import { DialogProps } from '@mui/material/Dialog';
import { requestBanClass } from "../../redux/reducers/Proteins/ActionTypes";
import { coerce_full_structure_to_neostruct } from "../../redux/reducers/Visualization/VisualizationReducer";


// viewer doc: https://embed.plnkr.co/plunk/afXaDJsKj9UutcTD

const useSelectStyles = makeStyles((theme: Theme) =>
  createStyles({
    select: {
      zIndex: 200
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 400,
    },
    sub1: {
      margin: theme.spacing(1),
      minWidth: "30%",
    },
    sub2: {
      margin: theme.spacing(1),
      minWidth: "60%",
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }),
);

interface StructSnip {
  rcsb_id: string,
  title: string,
  any?: any
}

const SelectStruct = ({ items, selectStruct }: { items: StructSnip[], selectStruct: (_: string) => void }) => {
  //! This component controls the structure selection

  const dispatch = useDispatch()
  const selectStructStyles = (makeStyles({ autocomoplete: { width: "100%" } }))()

  // const current_full_struct: RibosomeStructure | null = useSelector((state: AppState) => state.visualization.structure_tab.fullStructProfile)
  // const current_neo_struct: NeoStruct | null = useSelector((state: AppState) => coerce_full_structure_to_neostruct(state.visualization.structure_tab.fullStructProfile))

  // useSelector((state: AppState) => coerce_full_structure_to_neostruct(state.visualization.structure_tab.fullStructProfile))

  const current_neostruct: NeoStruct | null = useSelector((state: AppState) => state.visualization.structure_tab.structure)
  const current_chain_to_highlight: string | null = useSelector((state: AppState) => state.visualization.structure_tab.highlighted_chain)
  const structs = useSelector((state: AppState) => state.structures.derived_filtered)
  const cached_struct = useSelector((state: AppState) => state.visualization.full_structure_cache)
  // const { addToast                   }                 = useToasts  (                                                                        );


  const structure_tab_select = (event: React.ChangeEvent<{ value: unknown }>, selected_neostruct: NeoStruct | null) => {



    dispatch(cache_full_struct(selected_neostruct && selected_neostruct?.struct.rcsb_id))
    if (selected_neostruct !== null) {
      dispatch(struct_change(null, selected_neostruct))

      // addToast(`Structure ${selected_neostruct.struct.rcsb_id} is being fetched.`, { appearance: 'info', autoDismiss: true, })
      // viewer params : https://github.com/molstar/pdbe-molstar/wiki/1.-PDBe-Molstar-as-JS-plugin#plugin-parameters-options
      const viewerParams = {
        moleculeId: selected_neostruct.struct.rcsb_id.toLowerCase(),
        assemblyId: "1"
      }

      viewerInstance.visual.update(viewerParams);

    } else {

      console.log("Dispatched with null");

      dispatch(struct_change(null, null))
    }
  };

  useEffect(() => {
    console.log("current neostruct changed:", current_neostruct);

  }, [current_neostruct])

  const handleSelectHighlightChain = (event: React.ChangeEvent<{ value: unknown }>, selected_chain: any) => {

    // get current structure because arguments and functions here are poorly written.
    const curstate = store.getState()
    const curstruct = curstate.visualization.structure_tab.structure
    console.log("Passing args to struct_change dispatch", selected_chain.props.value, curstruct);


    dispatch(struct_change(selected_chain.props.value, curstruct))

    viewerInstance.visual.select(
      {
        data: [{
          auth_asym_id: selected_chain.props.value,
          color:
            { r: 50, g: 50, b: 255 },
          focus: true
        }], nonSelectedColor: { r: 180, g: 180, b: 180 }
      }
    )
  }

  return (
    <>

      <Autocomplete
        className={selectStructStyles.autocomoplete}
        value={current_neostruct}
        options={structs}
        getOptionLabel={(parent) => {
          if (parent.struct === undefined) {
            return "null"
          }
          else { return parent.struct.rcsb_id }
        }
        }

        // @ts-ignore
        onChange={structure_tab_select}
        renderOption={(option) => (<div style={{ fontSize: "10px", width: "400px" }}><b>{option.struct.rcsb_id}</b> ({option.struct.citation_title} ) </div>)}
        renderInput={(params) => <TextField {...params} label="Structure" variant="outlined" />}
      />

      {/* list item for highlighted_chain */}
      <ListItem>
        {/* <Tooltip disableHoverListener={current_chain_to_highlight === null} title={
          <>
            <div> auth_asym_id : {current_chain_to_highlight} </div>
            <div> Duplicate chains of the same class imply an X-RAY structure with multiple models. You can alternate between models in Molstar viewer: Structure {`->`} Asm Id </div> 
          </>
        }> */}

        <FormControl
          // className={classes.formControl} 
          style={{ width: "100%" }}>
          <InputLabel> {current_neostruct === null ? "Select a structure.." : "Highlight Chain"}</InputLabel>
          <Select
            value={current_chain_to_highlight}
            onChange={handleSelectHighlightChain}
            disabled={current_neostruct === null}
            // @ts-ignore
            renderValue={(value: undefined) => {

              if (value === null) {
                return "null"
              }
              else {
                // @ts-ignore
                return <div>{value}</div>
              }
            }}>

            {current_neostruct === null || current_neostruct === undefined
              ? null
              : [...current_neostruct.rnas, ...current_neostruct.rps.sort(nomenclatureCompareFn),]
                .map((chain) =>
                  <MenuItem value={chain.auth_asym_id}>
                    {chain.nomenclature && chain.nomenclature.length > 0 ? <b>{chain.nomenclature[0]}</b> : <>{chain.auth_asym_id}</>}
                  </MenuItem>)
            }
          </Select>
        </FormControl>

        {/* </Tooltip> */}



      </ListItem>

    </>
  )
}

const SelectProtein = ({ proteins, getCifChainByClass }:
  { proteins: BanClassMetadata[], getCifChainByClass: (strand: string, parent: string) => void }) => {

  const styles   = useSelectStyles();
  const dispatch = useDispatch();

  const [curProtClass, setProtClass] = React.useState<ProteinClass | null>(null);
  const [curProtParent, setProtParent] = React.useState<string | null>(null);
  const availablestructs = useSelector((state: AppState) => state.proteins.ban_class)

  const chooseProtein = (event: React.ChangeEvent<{ value: unknown }>) => {
    let item = event.target.value as string
    dispatch(requestBanClass(item, false))
    setProtClass(item as ProteinClass);
    dispatch(protein_change(event.target.value as ProteinClass, curProtParent))
  };

  const chooseProtParent = (event: React.ChangeEvent<{ value: unknown }>, newvalue: any) => {
    if (newvalue === null || newvalue.parent_rcsb_id === "Choose a protein class.") {
      setProtParent(null);
      dispatch(protein_change(curProtClass, null))
      return
    }

    setProtParent(newvalue.parent_rcsb_id);
    dispatch(cache_full_struct(newvalue.parent_rcsb_id))
    getCifChainByClass(curProtClass as ProteinClass, newvalue.parent_rcsb_id)
    dispatch(protein_change(curProtClass, newvalue.parent_rcsb_id))

  };
  return (
    <Grid item xs={12}>
      <List style={{ outline: "1px solid gray", borderRadius: "5px" }}>
        <ListItem>
          <FormControl className={styles.sub1}>
            <InputLabel>Protein Class</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={curProtClass}
              onChange={chooseProtein}>
              {proteins.map((i) => <MenuItem value={i.banClass}>{i.banClass}
              </MenuItem>)}
            </Select>
          </FormControl>

          <FormControl className={styles.sub2}>
            <Autocomplete
              styles={{ marginRight: "9px", outline: "none" }}
              options={availablestructs.length > -1 ? availablestructs : [{ parent_rcsb_id: "Choose a protein class." } as ProteinProfile]}
              getOptionLabel={(parent) => parent.parent_rcsb_id}
              // @ts-ignore
              onChange={chooseProtParent}
              renderOption={(option) => (<div style={{ fontSize: "9px", width: "400px" }}><b>{option.parent_rcsb_id}</b> ({option.pfam_descriptions} ) </div>)}
              renderInput={(params) => <TextField {...params} style={{ fontSize: "7px" }} label="Parent Structure" variant="outlined" />}
            />
          </FormControl>

        </ListItem>
      </List>
    </Grid>
  )
}

const SelectRna = ({ items, getCifChainByClass }: { items: RNAProfile[], getCifChainByClass: (strand: string, parent: string) => void }) => {

  const styles   = useSelectStyles();
  const dispatch = useDispatch();

  const [curRna, setCurRna]          = React.useState<RNAClass | null>(null);
  const [curRnaParent, setRnaParent] = React.useState<string | null>(null);

  const parents                      = useSelector((state: AppState) => state.rna.rna_classes_derived)


  var rnaClasses: { v: string, t: RNAClass }[] = [
    { v: 'mRNA', t: 'mRNA' },
    { v: 'tRNA', t: 'tRNA' },
    { v: '5SrRNA', t: '5SrRNA' },
    { v: '5.8SrRNA', t: '5.8SrRNA' },
    { v: '12SrRNA', t: '12SrRNA' },
    { v: '16SrRNA', t: '16SrRNA' },
    { v: '21SrRNA', t: '21SrRNA' },
    { v: '23SrRNA', t: '23SrRNA' },
    { v: '25SrRNA', t: '25SrRNA' },
    { v: '28SrRNA', t: '28SrRNA' },
    { v: '35SrRNA', t: '35SrRNA' },
  ]
  return (
    <Grid item xs={12}>
      <List style={{ outline: "1px solid gray", borderRadius: "5px" }}>

        <ListItem>
          <FormControl className={styles.sub1}>
            <InputLabel >RNA Class</InputLabel>
            <Select
              labelId  = "demo-simple-select-label"
              id       = "demo-simple-select"
              value    = {curRna}
              onChange = {(event: any) => {
                setCurRna(event.target.value)
                dispatch(rna_change(event.target.value, curRnaParent))
              }}>
              {rnaClasses.map((i) => <MenuItem value={i.v}>{i.t}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl className={styles.sub2}>
            <Autocomplete

              //@ts-ignore
              styles={{ marginRight: "10px", outline: "none" }}
              options={curRna === null ? [] : parents[curRna as RNAClass]}
              getOptionLabel={(parent) => parent.parent_rcsb_id}
              // @ts-ignore

              onChange={(event: any, newValue: any) => {
                if (newValue !== null) {
                  console.log("Got newvalue for rna select parent", newValue.parent_rcsb_id)
                  setRnaParent(newValue.parent_rcsb_id)
                  dispatch(cache_full_struct(newValue.parent_rcsb_id))
                  getCifChainByClass(curRna as string, newValue.parent_rcsb_id)
                  dispatch(rna_change(curRna, newValue.parent_rcsb_id))
                } else {
                  dispatch(rna_change(curRna, null))
                  setRnaParent(null)
                }
              }}
              renderOption={(option) => (<div style={{ fontSize: "10px", width: "400px" }}><b>{option.parent_rcsb_id}</b>  ::: <i>{option.src_organism_names}</i></div>)}
              renderInput={(params) => <TextField {...params} style={{ fontSize: "8px" }} label="Parent Structure" variant="outlined" />}
            />
          </FormControl>
        </ListItem>
      </List>
    </Grid>
  )
}

interface DownloadElement_P { elemtype: 'rna' | 'protein' | 'structure', id: string | null, parent?: string }
const DownloadElement = ({ elemtype, id, parent }: DownloadElement_P) => {


  const download_elem = () => {
    if (elemtype === 'structure') {

      getNeo4jData('static_files', {
        endpoint: "download_structure", params: {
          struct_id: id as string
        }
      }).then(
        resp => {
          fileDownload(resp.data, `${id}.cif`);
        },
        error => {
          alert(
            "Structure is unavailable." +
            error
          );
        }
      );



    } else {

      getNeo4jData('static_files', {
        endpoint: "cif_chain_by_class", params: {
          "classid": id as string,
          "struct": parent as string
        }
      }).then(
        resp => {
          fileDownload(resp.data, `${id}_${parent}.cif`);
        },
        error => {
          alert(
            "This chain is unavailable. This is likely an issue with parsing the given struct.\nTry another struct!" +
            error
          );
        }
      );

    }


  }

  return (
    // <Paper style={{ width: "100%" }}>
    <Grid style={{ width: "100%" }}>
      {
        (() => {
          if (id === null) {
            return <Button disabled={true}> Download Selected </Button>
          }
          else {
            switch (elemtype) {
              case 'protein':
                return <Button fullWidth size="small" variant="outlined" color='primary' style={{ marginRight: "5px" }} onClick={() => download_elem()} >

                  <FileDownloadIcon />
                  <Typography>Protein {id} in {parent} </Typography>
                </Button>
              case 'rna':
                return <Button fullWidth size="small" variant="outlined" color='primary' style={{ marginRight: "5px" }} onClick={() => download_elem()} >
                  <FileDownloadIcon />

                  <Typography>RNA {id} in {parent}</Typography>
                </Button>
              case 'structure':
                return null

              // return <Button fullWidth size="small" variant="outlined" color='primary' style={{ marginRight: "5px" }} onClick={() => download_elem()} >

              //   <FileDownloadIcon />
              //   <Typography>Structure {id} </Typography>
              // </Button>
            }
          }
        })()
      }
    </Grid>
    // </Paper>
  )
}

// --------------------------------------------------------------------------------------------------

const ChainHighlightSlider = ({ auth_asym_id, full_structure_cache }: { auth_asym_id: string | null, full_structure_cache: RibosomeStructure | null }) => {
  // takes in a full protein or rna
  const [currentChainFull, setCurrentChainFull] = React.useState<Protein | RNA | null>(null)

  const [residueRange, setResidueRange] = React.useState<number[]>([0, 0]);  // current slider value
  const [MaxRes, setMaxRes] = React.useState<number>(0);         // keep track of what's the max residue range


  useEffect(() => {
    if (full_structure_cache && auth_asym_id) {
      // pluck the chain off the full structure
      const pickFullChain = [...full_structure_cache.proteins, ...(() => {
        if (full_structure_cache.rnas === undefined || full_structure_cache.rnas === null) {
          return []
        } else {
          return full_structure_cache.rnas
        }
      })()].filter(c => c.auth_asym_id === auth_asym_id)

      if (pickFullChain.length < 1) {
        console.log("Haven't found chain with this asym_id on the full structure. Something went terribly wrong.");
      } else {
        setCurrentChainFull(pickFullChain[0])
        setResidueRange([0, pickFullChain[0].entity_poly_seq_length])
        setMaxRes(pickFullChain[0].entity_poly_seq_length)
      }
    }
    if (full_structure_cache === null) {
      setCurrentChainFull(null)
      setMaxRes(0)
    }

    else if (auth_asym_id === null) {
      // setInFocus(null)
    }

  }, [
    auth_asym_id,
    full_structure_cache
  ])


  const paintMolstarCanvas = (resRange: number[], chain_to_highlight: string) => {
    var selectSections =
    {
      instance_id: 'ASM_1',
      auth_asym_id: chain_to_highlight,
      start_residue_number: resRange[0] === 0 ? 1 : resRange[0],
      end_residue_number: resRange[1],
      color: { r: 255, g: 255, b: 255 },
      focus: true
    }
    // console.log("got select params options", selectSections);

    // viewerInstance.visual.select({ data: selectSections, nonSelectedColor: { r: 180, g: 180, b: 180 } })
    // { data: [{ struct_asym_id: 'B', start_residue_number: 1, end_residue_number: 6, color:{r:255,g:255,b:0}, focus: true }]}
    viewerInstance.visual.select({
      data: [selectSections], nonSelectedColor: { r: 50, g: 50, b: 50 }
    })
  };

  // const paintMolstarCanvas__debounced = _.debounce(paintMolstarCanvas, 300)

  const handleSearchRange = () => {
    if (auth_asym_id === null) { window.alert('Chain to highlight is null. Provide asym_id to paint.'); return }
    paintMolstarCanvas(residueRange, auth_asym_id)
    console.log(`Target asym_id: ${auth_asym_id}. Searching range: [${residueRange}]`)

  }

  const handleSliderChange = (event: Event, newvalue: number[]) => {
    let _: number[] = newvalue;
    if (newvalue[1] > MaxRes) { _[1] = MaxRes }
    if (newvalue[0] < 0) { _[0] = 0 }
    if (_[0] > _[1] || _[1] < _[0]) { const t = _[0]; _[0] = _[1]; _[1] = t }
    setResidueRange(_);

    if (_[0] === _[1]) { return }
    paintMolstarCanvas(_, auth_asym_id as string);
  }


  const handleResRangeStart = (endVal: number) => (event: React.ChangeEvent<HTMLInputElement>) => {

    let numeric = Number(event.target.value.replace(/^\D+/g, ''));
    if (numeric > MaxRes) { numeric = MaxRes }
    if (numeric < 0) { numeric = 0 }
    setResidueRange([numeric.toString() === '' ? 0 : numeric, endVal])
    paintMolstarCanvas(residueRange, auth_asym_id as string)
  };

  const handleResRangeEnd = (startVal: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`Max res is ${MaxRes} res range 0 is ${residueRange[0]}    resrange 1 is ${residueRange[1]}`);
    let numeric = Number(event.target.value.replace(/^\D+/g, ''));
    if (numeric > MaxRes) {
      numeric = MaxRes
    }
    if (numeric < 0) {
      numeric = 0
    }
    setResidueRange([startVal, numeric.toString() === '' ? MaxRes : Number(numeric)])
    paintMolstarCanvas(residueRange, auth_asym_id as string)
  };



  // Donwload Popover
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const handlePopoverClick = (event: any) => { setAnchorEl(event.currentTarget); };
  const handlePopoverClose = () => { setAnchorEl(null); };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;


  // Dialgoue sequence
  const [dialogueOpen, setDialogueOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);


  type SeqVizSelection = {
    clockwise: boolean
    element: any
    end: number
    gc: number
    length: number
    name: string
    ref: string
    seq: string
    start: number
    tm: number
    type: string
  }


  return (
    <Card variant="outlined" style={{ minWidth: "100%", height: "maxContent", display: "flex", flexDirection: "row" }}>


      <Grid container >

        <Grid container direction={"column"} item spacing={2} xs={3} style={{ padding: "10px" }} >

          <Grid item xs={4}>
            <Paper variant="outlined" elevation={2}
              id='outlined-interact'
              style={{ width: "60px", height: "60px", padding: "5px", cursor: "pointer" }} >
              <DownloadIcon onClick={handlePopoverClick} style={{ width: "50px", height: "50px" }} />
            </Paper>
          </Grid>


          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            style={{ padding: "20px" }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{ vertical: "top", horizontal: "center", }}>

            <Grid container direction="column">

              <Grid item xs={10}>

                <SeqViz
                  style={{ padding: "10px", margin: "10px", fontSize: "8px", size: '8px', width: "800px", height: "200px" }}
                  onSelection={(e) => {
                    console.log("Got range : ", e.start, " --> ", e.end);
                    console.log(e);
                    if (e.start === e.end) {
                      return
                    }

                    if (e.start > e.end) {
                      setResidueRange([e.end, e.start])
                    }
                    else {
                      setResidueRange([e.start, e.end])
                    }

                    paintMolstarCanvas(residueRange, auth_asym_id as string)
                  }}
                  showIndex={true}
                  viewer="linear"
                  annotations={[{
                    color: "blue",
                    direction: 1,
                    end: residueRange[1],
                    start: residueRange[0],
                    name: 'selected',
                    id: "none",
                    // @ts-ignore
                    type: ""
                  }]}
                  seq={currentChainFull?.entity_poly_seq_one_letter_code_can} showAnnotations={false} />
              </Grid>

              <div style={{ display: "flex", justifyContent: "center", justifyItems: "center" }}>

                <Button fullWidth>Select</Button>
                <Button fullWidth>Download seq</Button>
                <Button fullWidth>Download cif</Button>
              </div>

            </Grid>

          </Popover>

          <Grid item xs={4} >
            <Paper variant="outlined" elevation={2} id='outlined-interact' style={{ width: "60px", height: "60px", padding: "5px", cursor: "pointer" }} >
              <SearchIcon onClick={handleSearchRange} style={{ width: "50px", height: "50px" }} />
            </Paper>
          </Grid>

          <Grid item xs={4}>
            <Paper variant="outlined" elevation={2}
              id='outlined-interact'
              style={{ width: "60px", height: "60px", padding: "5px", cursor: "pointer" }} >
              <ContentCutIcon style={{ width: "50px", height: "50px" }}
              />
            </Paper>
          </Grid>
        </Grid>

        <Grid container xs={9} style={{ height: "100%", width: "100%" }}>

          <Grid xs={12} item >

            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
              component="div"
              style={{
                fontSize: "12",
                padding: "5px",
              }}
            >
              <Typography variant="body2" color="textSecondary" component="p" >
                {currentChainFull?.entity_poly_polymer_type || " "}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p"  >
                {currentChainFull?.nomenclature[0] as string || ""}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p" >
                Chain {currentChainFull?.auth_asym_id || " "}
              </Typography>
            </Grid>

            <Grid
              container
              style={{ padding: "5px" }}
              direction="column"
              justify="flex-start"
              alignItems="flex-start"
              component="div"
            >
              <CardBodyAnnotation keyname={"Source Organism"} value={truncate(currentChainFull?.src_organism_names[0] || " ", 50, 50)} />
              <CardBodyAnnotation keyname={"Host Organism"} value={truncate(currentChainFull?.host_organism_names[0] || " ", 50, 50)} />
              <CardBodyAnnotation keyname={"Description"} value={currentChainFull?.rcsb_pdbx_description || ""} />
            </Grid>

          </Grid>


          <Grid xs={12} item
          >
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
          </Grid>

        </Grid>
      </Grid>

    </Card>
  );
}



// const ChainHighlightSlider = () => {

//   // takes in a full protein or rna
//   const current_chain_to_highlight              = useSelector((appstate: AppState) => appstate.visualization.structure_tab.highlighted_chain)
//   const fullstruct_cache                        = useSelector((appstate: AppState) => appstate.visualization.full_structure_cache)

//   const [currentChainFull, setCurrentChainFull] = React.useState<Protein | RNA | null>(null)

//   const [residueRange, setResidueRange] = React.useState<number[]>([0, 0]);  // current slider value
//   const [MaxRes, setMaxRes] = React.useState<number>(0);         // keep track of what's the max residue range


//   useEffect(() => {
//     if (fullstruct_cache && current_chain_to_highlight) {
//       // pluck the chain off the full structure
//       const pickFullChain = [...fullstruct_cache.proteins, ...(() => {
//         if (fullstruct_cache.rnas === undefined || fullstruct_cache.rnas === null) {
//           return []
//         } else {
//           return fullstruct_cache.rnas
//         }
//       })()].filter(c => c.auth_asym_id === current_chain_to_highlight)

//       if (pickFullChain.length < 1) {
//         console.log("Haven't found chain with this asym_id on the full structure. Something went terribly wrong.");
//       } else {
//         setCurrentChainFull(pickFullChain[0])
//         setResidueRange([0, pickFullChain[0].entity_poly_seq_length])
//         setMaxRes(pickFullChain[0].entity_poly_seq_length)
//       }
//     }
//     if (fullstruct_cache === null) {
//       setCurrentChainFull(null)
//       setMaxRes(0)
//     }

//     else if (current_chain_to_highlight === null) {
//       // setInFocus(null)
//     }

//   }, [
//     current_chain_to_highlight,
//     fullstruct_cache
//   ])


//   const paintMolstarCanvas = (resRange: number[], chain_to_highlight: string) => {
//     var selectSections =
//     {
//       instance_id: 'ASM_1',
//       auth_asym_id: chain_to_highlight,
//       start_residue_number: resRange[0] === 0 ? 1 : resRange[0],
//       end_residue_number: resRange[1],
//       color: { r: 255, g: 255, b: 255 },
//       focus: true
//     }
//     // console.log("got select params options", selectSections);

//     // viewerInstance.visual.select({ data: selectSections, nonSelectedColor: { r: 180, g: 180, b: 180 } })
//     // { data: [{ struct_asym_id: 'B', start_residue_number: 1, end_residue_number: 6, color:{r:255,g:255,b:0}, focus: true }]}
//     viewerInstance.visual.select({
//       data: [selectSections], nonSelectedColor: { r: 50, g: 50, b: 50 }
//     })
//   };

//   // const paintMolstarCanvas__debounced = _.debounce(paintMolstarCanvas, 300)

//   const handleSearchRange = () => {
//     if (current_chain_to_highlight === null) { window.alert('Chain to highlight is null. Provide asym_id to paint.'); return }
//     paintMolstarCanvas(residueRange, current_chain_to_highlight)
//     console.log(`Target asym_id: ${current_chain_to_highlight}. Searching range: [${residueRange}]`)

//   }

//   const handleSliderChange = (event: Event, newvalue: number[]) => {
//     let _: number[] = newvalue;
//     if (newvalue[1] > MaxRes) { _[1] = MaxRes }
//     if (newvalue[0] < 0) { _[0] = 0 }
//     if (_[0] > _[1] || _[1] < _[0]) { const t = _[0]; _[0] = _[1]; _[1] = t }
//     setResidueRange(_);

//     if (_[0] === _[1]) { return }
//     paintMolstarCanvas(_, current_chain_to_highlight as string);
//   }


//   const handleResRangeStart = (endVal: number) => (event: React.ChangeEvent<HTMLInputElement>) => {

//     let numeric = Number(event.target.value.replace(/^\D+/g, ''));
//     if (numeric > MaxRes) { numeric = MaxRes }
//     if (numeric < 0) { numeric = 0 }
//     setResidueRange([numeric.toString() === '' ? 0 : numeric, endVal])
//     paintMolstarCanvas(residueRange, current_chain_to_highlight as string)
//   };

//   const handleResRangeEnd = (startVal: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
//     console.log(`Max res is ${MaxRes} res range 0 is ${residueRange[0]}    resrange 1 is ${residueRange[1]}`);
//     let numeric = Number(event.target.value.replace(/^\D+/g, ''));
//     if (numeric > MaxRes) {
//       numeric = MaxRes
//     }
//     if (numeric < 0) {
//       numeric = 0
//     }
//     setResidueRange([startVal, numeric.toString() === '' ? MaxRes : Number(numeric)])
//     paintMolstarCanvas(residueRange, current_chain_to_highlight as string)
//   };



//   // Donwload Popover
//   const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
//   const handlePopoverClick = (event: any) => { setAnchorEl(event.currentTarget); };
//   const handlePopoverClose = () => { setAnchorEl(null); };
//   const open = Boolean(anchorEl);
//   const id = open ? 'simple-popover' : undefined;


//   // Dialgoue sequence
//   const [dialogueOpen, setDialogueOpen] = React.useState(false);
//   const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');

//   const handleDialogueClickOpen = (scrollType: DialogProps['scroll']) => () => {
//     setDialogueOpen(true);
//     setScroll(scrollType);
//   };

//   const handleDialogueClose = () => {
//     setDialogueOpen(false);
//   };

//   const descriptionElementRef = React.useRef<HTMLElement>(null);
//   React.useEffect(() => {
//     if (open) {
//       const { current: descriptionElement } = descriptionElementRef;
//       if (descriptionElement !== null) {
//         descriptionElement.focus();
//       }
//     }
//   }, [open]);


//   type SeqVizSelection = {
//     clockwise: boolean
//     element: any
//     end: number
//     gc: number
//     length: number
//     name: string
//     ref: string
//     seq: string
//     start: number
//     tm: number
//     type: string
//   }


//   return (
//     <Card variant="outlined" style={{ minWidth: "100%", height: "maxContent", display: "flex", flexDirection: "row" }}>


//       <Grid container >

//         <Grid container direction={"column"} item spacing={2} xs={3} style={{ padding: "10px" }} >

//           <Grid item xs={4}>
//             <Paper variant="outlined" elevation={2}
//               id='outlined-interact'
//               style={{ width: "60px", height: "60px", padding: "5px", cursor: "pointer" }} >
//               <DownloadIcon onClick={handlePopoverClick} style={{ width: "50px", height: "50px" }} />
//             </Paper>
//           </Grid>


//           <Popover
//             id={id}
//             open={open}
//             anchorEl={anchorEl}
//             onClose={handlePopoverClose}
//             style={{ padding: "20px" }}
//             anchorOrigin={{
//               vertical: "bottom",
//               horizontal: "center",
//             }}
//             transformOrigin={{ vertical: "top", horizontal: "center", }}>

//             <Grid container direction="column">

//               <Grid item xs={10}>

//                 <SeqViz
//                   style={{ padding: "10px", margin: "10px", fontSize: "8px", size: '8px', width: "800px", height: "200px" }}
//                   onSelection={(e) => {
//                     console.log("Got range : ", e.start, " --> ", e.end);
//                     console.log(e);
//                     if (e.start === e.end) {
//                       return
//                     }

//                     if (e.start > e.end) {
//                       setResidueRange([e.end, e.start])
//                     }
//                     else {
//                       setResidueRange([e.start, e.end])
//                     }

//                     paintMolstarCanvas(residueRange, current_chain_to_highlight as string)
//                   }}
//                   showIndex={true}
//                   viewer="linear"
//                   annotations={[{
//                     color: "blue",
//                     direction: 1,
//                     end: residueRange[1],
//                     start: residueRange[0],
//                     name: 'selected',
//                     id: "none",
//                     // @ts-ignore
//                     type: ""
//                   }]}
//                   seq={currentChainFull?.entity_poly_seq_one_letter_code_can} showAnnotations={false} />
//               </Grid>

//               <div style={{ display: "flex", justifyContent: "center", justifyItems: "center" }}>

//                 <Button fullWidth>Select</Button>
//                 <Button fullWidth>Download seq</Button>
//                 <Button fullWidth>Download cif</Button>
//               </div>
//               {/* <Grid direction="row"  container xs={2} style={{ display:"flex",  outline:"1px solid black", width: "100%" }}>

//                 <Grid item xs={3}></Grid>

//                 <Grid item xs={3}><Button fullWidth>Download seq</Button></Grid>

//                 <Grid item xs={3}></Grid>
//               </Grid> */}

//             </Grid>

//           </Popover>
//           {/* <Dialog
//         open={dialogueOpen}
//         onClose={handleDialogueClose}
//         scroll={scroll}
//         aria-labelledby="scroll-dialog-title"
//         aria-describedby="scroll-dialog-description"
//       >
//         <DialogTitle id="scroll-dialog-title">Subscribe</DialogTitle>
//         <DialogContent dividers={scroll === 'paper'} style={{height:"20vh", width:"70vw", padding:"10px", margin:"5px", display:"flex", justifyContent:"center"}}>
//             <SeqViz
//             style={{padding:"20px"}}
//               onSelection = {(e) => { console.log(e) }}
//               showIndex   = {true}
//               viewer      = "linear"
//               seq         = {currentChainFull?.entity_poly_seq_one_letter_code_can} showAnnotations = {false} />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose}>Cancel</Button>
//           <Button onClick={handleClose}>Subscribe</Button>
//         </DialogActions>
//       </Dialog> */}

//           {/* <Popover
//             // id           = {id}
//             open         = {open}
//             anchorEl     = {anchorEl}
//             onClose      = {handleClose}
//             anchorOrigin = {{
//               vertical: 'bottom',
//               horizontal: 'left',
//             }}


//             >
//               <Paper style={{outline:"1px solid black"}}>


//               </Paper>
//           </Popover> */}

//           <Grid item xs={4} >
//             <Paper variant="outlined" elevation={2} id='outlined-interact' style={{ width: "60px", height: "60px", padding: "5px", cursor: "pointer" }} >
//               <SearchIcon onClick={handleSearchRange} style={{ width: "50px", height: "50px" }} />
//             </Paper>
//           </Grid>

//           <Grid item xs={4}>
//             <Paper variant="outlined" elevation={2}
//               id='outlined-interact'
//               style={{ width: "60px", height: "60px", padding: "5px", cursor: "pointer" }} >
//               <ContentCutIcon style={{ width: "50px", height: "50px" }}
//               />
//             </Paper>
//           </Grid>
//         </Grid>

//         <Grid container xs={9} style={{ height: "100%", width: "100%" }}>

//           <Grid xs={12} item >

//             <Grid
//               container
//               direction="row"
//               justify="space-between"
//               alignItems="center"
//               component="div"
//               style={{
//                 fontSize: "12",
//                 padding: "5px",
//               }}
//             >
//               <Typography variant="body2" color="textSecondary" component="p" >
//                 {currentChainFull?.entity_poly_polymer_type || " "}
//               </Typography>
//               <Typography variant="body2" color="textSecondary" component="p"  >
//                 {currentChainFull?.nomenclature[0] as string || ""}
//               </Typography>
//               <Typography variant="body2" color="textSecondary" component="p" >
//                 Chain {currentChainFull?.auth_asym_id || " "}
//               </Typography>
//             </Grid>

//             <Grid
//               container
//               style={{ padding: "5px" }}
//               direction="column"
//               justify="flex-start"
//               alignItems="flex-start"
//               component="div"
//             >
//               <CardBodyAnnotation keyname={"Source Organism"} value={truncate(currentChainFull?.src_organism_names[0] || " ", 50, 50)} />
//               <CardBodyAnnotation keyname={"Host Organism"} value={truncate(currentChainFull?.host_organism_names[0] || " ", 50, 50)} />
//               <CardBodyAnnotation keyname={"Description"} value={currentChainFull?.rcsb_pdbx_description || ""} />
//             </Grid>

//           </Grid>


//           <Grid xs={12} item
//           >
//             <Paper variant="outlined"
//               style={{
//                 height: "70px", width: "100%", paddingBottom: "5px", paddingTop: "5px", paddingLeft: "10px", paddingRight: "10px"
//               }}>

//               <Grid container direction="row" xs={12} spacing={1} style={{ width: "100%", height: "50px" }} >
//                 <Grid item xs={3}>
//                   <TextField
//                     // style    = {{width:"50px"}}
//                     value={residueRange[0]}
//                     onChange={handleResRangeStart(residueRange[1])}
//                     id="outlined-number"
//                     label={`Residue ${currentChainFull?.entity_poly_seq_one_letter_code_can[residueRange[0]]}`}
//                     fullWidth
//                     disabled={currentChainFull === null}
//                     type="number"
//                     InputLabelProps={{ style: { fontSize: 16 } }}
//                   />
//                 </Grid>

//                 <Grid item xs={6} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "10px", }}>
//                   <Slider
//                     style={{ width: "100%" }}
//                     getAriaLabel={() => 'Chain XXX'}
//                     value={residueRange}
//                     disabled={currentChainFull === null}
//                     min={0}
//                     max={currentChainFull?.entity_poly_seq_length}
//                     // @ts-ignore
//                     onChange={handleSliderChange}
//                     valueLabelDisplay="auto"
//                   // getAriaValueText  = {valuetext}
//                   />
//                 </Grid>

//                 <Grid item xs={3}>
//                   <TextField
//                     // style    = {{width:"50px"}}
//                     disabled={currentChainFull === null}
//                     value={residueRange[1]}
//                     onChange={handleResRangeEnd(residueRange[0])}
//                     id="ou2tlined-number"
//                     fullWidth
//                     label={`Residue ${currentChainFull?.entity_poly_seq_one_letter_code_can[residueRange[1] - 1]}`}
//                     type="number"
//                     InputLabelProps={{
//                       shrink: true,
//                       style: { fontSize: 16 }
//                     }}
//                   />

//                 </Grid>
//               </Grid>
//             </Paper>
//           </Grid>

//         </Grid>
//       </Grid>

//     </Card>
//   );
// }

// @ts-ignore
const viewerInstance = new PDBeMolstarPlugin() as any;
// @ts-ignore
// const viewerInstance2 = new PDBeMolstarPlugin() as any;
const VisualizationPage = (props: any) => {
  const dispatch = useDispatch();
  // const { addToast } = useToasts();
  // ? Get uri parametrs ----------------------------
  const history: any = useHistory();
  const params = history.location.state;
  //? Get uri parametrs ----------------------------

  const [lastViewed, setLastViewed] = useState<Array<string | null>>([null, null])


  // structure titles for populating the dropdown
  const all_structures: StructSnip[] = useSelector((state: AppState) => state.structures.neo_response.map(
    r => { return { rcsb_id: r.struct.rcsb_id, title: r.struct.citation_title } }))



  // ----------- This one, i think is for fetching struct on uri parmas pass. Should be able to do in redux
  // useEffect(() => {
  //   if (params === undefined || Object.keys(params).length < 1) { return }
  //   else if ((params as { struct: string }).struct) {

  //     getNeo4jData('neo4j', { endpoint: "get_struct", params: { pdbid: params.struct } }).then(r => {

  //       if (r.data.length < 1) {
  //         dispatch(fullStructureChange(null, null))
  //       }
  //       else {

  //         var x: any = {}
  //         x['ligands'] = r.data[0].ligands.map((_: any) => _.chemicalId)
  //         x['struct'] = r.data[0].structure
  //         x['rps'] = r.data[0].rps.map((_: any) => ({ strands: _.entity_poly_strand_id, nomenclature: _.nomenclature }))
  //         x['rnas'] = r.data[0].rnas.map((_: any) => ({ strands: _.entity_poly_strand_id, nomenclature: _.nomenclature }))

  //         dispatch(fullStructureChange(x['struct'].rcsb_id, null))
  //         addToast(`Structure ${x.struct.rcsb_id} is being fetched.`, {
  //           appearance: 'info',
  //           autoDismiss: true,
  //         })
  //       }

  //     })
  //   }
  // },
  //   [
  //     params
  //   ]
  // )

  const [inView, setInView] = useState<any>({});

  ////////////////////////////////    <<<<<>>>>>>>>>>   /////////////   <<<<<>>>>>>>>>>     /////////////////////////////// <<<<<>>>>>>>>>>

  useEffect(() => {

    var options = {
      moleculeId: 'Element to visualize can be selected above.',
      hideControls: true,
      layoutIsExpanded: false,
    }


    var viewerContainer = document.getElementById('molstar-viewer');

    viewerInstance.render(viewerContainer, options);

    if (params === undefined || Object.keys(params).length < 1) { return }
    if ((params as { banClass: string, parent: string }).parent) {
      getCifChainByClass(params.banClass, params.parent)
    }
    else
      if ((params as { struct: string }).struct) {
        selectStruct(params.struct)
      }
  }, [])

  const prot_classes: BanClassMetadata[] = useSelector((state: AppState) => _.flattenDeep(Object.values(state.proteins.ban_classes)))

  const selectStruct = (rcsb_id: string) => {
    // https://github.com/molstar/pdbe-molstar/wiki/1.-PDBe-Molstar-as-JS-plugin#plugin-parameters-options
    console.log("Selecting struct with params");

    const viewerParams = {
      moleculeId: rcsb_id.toLowerCase(),
      assemblyId: 'ASM_1'
    }

    viewerInstance.visual.update(viewerParams);

  }
  const getCifChainByClass = (banclass: string, parent_struct: string) => {

    viewerInstance.visual.update({
      customData: {
        url: `${process.env.REACT_APP_DJANGO_URL}/static_files/cif_chain_by_class/?classid=${banclass}&struct=${parent_struct}`,
        format: "cif",
        binary: false,
      },
    });
    setInView({
      type: "chain",
      id: banclass,
      parent: parent_struct,
    })

    setLastViewed([`protein.${banclass}`, parent_struct])

  }

  // useEffect(() => {
  //   if (inView.type === "struct") {
  //     getNeo4jData("neo4j", {
  //       endpoint: "get_struct",
  //       params: { pdbid: inView.id },
  //     }).then(
  //       resp => {
  //         const respdata: RibosomeStructure = (flattenDeep(resp.data)[0] as any).structure;
  //         // setstruct(respdata);
  //         // setInViewData({ type: "struct", data: respdata })
  //       },

  //       err => {
  //         console.log("Got error on /neo request", err);
  //       }
  //     );
  //   }
  //   else if (inView.type === "chain") {getNeo4jData("neo4j", { endpoint: "nomclass_visualize", params: { ban: inView.id } }).then(r => { }) } }, [inView])

  // const RenderInViewInfo = ({ type, structdata, protClassInfo }: {
  //   type: string,
  //   structdata: RibosomeStructure,
  //   protClassInfo: {
  //     class: string,
  //     comments: string[][],
  //     members: { parent: string, chain: string }[]
  //   }
  // }) => {
  //   switch (type) {
  //     case "chain":
  //       return protClassInfo.class ? <List>
  //         <ListSubheader>Ribosomal Protein Class {protClassInfo.class}</ListSubheader>
  //         {
  //           uniq(flattenDeep(protClassInfo.comments)).filter(r => r !== "NULL").map(r =>
  //             <ListItem>
  //               <Typography className={"s"}>{r}</Typography>
  //             </ListItem>
  //           )
  //         }

  //       </List> : <div>Not Found</div>
  //     case "struct":
  //       return structdata?.rcsb_id ?
  //         <Card className={classes.card}>
  //           <CardHeader
  //             title={`${structdata.rcsb_id}`}
  //             subheader={structdata.src_organism_ids.length > 0 ? structdata.src_organism_names[0] : ""}
  //           />
  //           <CardActionArea>
  //             <CardMedia
  //               onClick={() => { history.push(`/structs/${structdata.rcsb_id.toUpperCase()}`) }}
  //               image={process.env.PUBLIC_URL + `/ray_templates/_ray_${structdata.rcsb_id.toUpperCase()}.png`}
  //               title={`${structdata.rcsb_id}\n${structdata.citation_title}`}
  //               className={classes.title}
  //             />
  //           </CardActionArea>
  //           <List>
  //             <CardBodyAnnotation keyname="Species" value={structdata.src_organism_ids.length > 0 ? structdata.src_organism_names[0] : ""} />
  //             <CardBodyAnnotation keyname="Resolution" value={structdata.resolution} />
  //             < CardBodyAnnotation keyname="Experimental Method" value={structdata.expMethod} />
  //             < CardBodyAnnotation keyname="Title" value={structdata.citation_title} />


  //             < CardBodyAnnotation keyname="Year" value={structdata.citation_year} />
  //           </List>
  //           <CardActions>
  //             <Grid container justify="space-evenly" direction="row">

  //               <Grid item>

  //                 <Button size="small" color="primary">
  //                   <a href={`https://www.rcsb.org/structure/${structdata.rcsb_id}`}>
  //                     PDB
  //                   </a>
  //                 </Button>
  //               </Grid>
  //               <Grid item>
  //                 <Button size="small" color="primary">
  //                   <a href={

  //                     structdata.rcsb_external_ref_link[0]
  //                   }>
  //                     EMD
  //                   </a>
  //                 </Button>
  //               </Grid>
  //               <Grid item>
  //                 <Button size="small" color="primary">
  //                   <a href={
  //                     `https://doi.org/${structdata.citation_pdbx_doi}`
  //                   }>
  //                     DOI
  //                   </a>
  //                 </Button>
  //               </Grid>
  //             </Grid>
  //           </CardActions>
  //         </Card>
  //         : <div>"Loading"</div>
  //     default:
  //       return <div></div>
  //   }
  // }

  // const coerce_neo_struct_to_struct_hero = (_: NeoStruct): {
  //   struct: RibosomeStructure;
  //   ligands: string[];
  //   rps: Array<{ nomenclature: string[]; auth_asym_id: string }>;
  //   rnas: string[];
  // } => ({
  //   struct : _.struct,
  //   ligands: _.ligands,
  //   rps    : _.rps.map(rp => { return { nomenclature: rp.nomenclature, auth_asym_id: rp.auth_asym_id } }),
  //   rnas   : _.rnas.map(rna => rna.auth_asym_id)
  // })

  const classes = makeStyles({
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
    }
  })();





  const current_tab = useSelector((state: AppState) => state.visualization.component_tab)
  const vis_state = useSelector((state: AppState) => state.visualization)
  const handleTabClick = (tab: VisualizationTabs) => {
    dispatch({ type: "RESET_ACTION" });
    dispatch({ type: COMPONENT_TAB_CHANGE, tab });
  }
  const cached_struct = useSelector((state: AppState) => state.visualization.full_structure_cache)
  const current_neostruct = useSelector((state: AppState) => state.visualization.structure_tab.structure)
  const current_chain_to_highlight = useSelector((state: AppState) => state.visualization.structure_tab.highlighted_chain)

  const current_protein_class: ProteinClass | null = useSelector((state: AppState) => state.visualization.protein_tab.class)
  const current_protein_parent: string | null = useSelector((state: AppState) => state.visualization.protein_tab.parent)
  const current_protein_auth_asym_id: string | null = useSelector((state: AppState) => state.visualization.protein_tab.auth_asym_id)
  const current_protein_neostruct: NeoStruct | null = useSelector((state: AppState) => current_protein_parent === null ? null : state.structures.neo_response.filter(s => s.struct.rcsb_id === current_protein_parent)[0])

  const current_rna_class: RNAClass | null = useSelector((state: AppState) => state.visualization.rna_tab.class)
  const current_rna_parent: string | null = useSelector((state: AppState) => state.visualization.rna_tab.parent)
  const current_rna_auth_asym_id: string | null = useSelector((state: AppState) => state.visualization.rna_tab.auth_asym_id)
  const current_rna_neostruct: NeoStruct | null = useSelector((state: AppState) => current_rna_parent === null ? null : state.structures.neo_response.filter(s => s.struct.rcsb_id === current_rna_parent)[0])

  useEffect(() => {
    if (current_protein_class && current_protein_parent) {
      // identify the asym_id of the given class in the parent (the cached version should be available)
      if (cached_struct === null) {
        console.log("We have a problem! cahched struct not here");
      } else {
        const found = cached_struct.proteins.filter(c => c.nomenclature.includes(current_protein_class))
        if (found.length < 1) {
          alert("Could not find protein class " + current_protein_class + ` in the cached structure ${cached_struct === null ? "null" : cached_struct.rcsb_id}. This is a bug, please report it.`);
        }
        dispatch(protein_update_auth_asym_id(found[0].auth_asym_id))
      }
    } else {
      dispatch(protein_update_auth_asym_id(null))
    }
  }, [current_protein_class, current_protein_parent, cached_struct])


  useEffect(() => {
    if (current_rna_class && current_rna_parent) {
      // identify the asym_id of the given class in the parent (the cached version should be available)
      if (cached_struct === null) {
        console.log("We have a problem! cahched struct not here");
      } else {

        if (!cached_struct.rnas) {
          dispatch(rna_update_auth_asym_id(null))
          return
        }

        const found = cached_struct.rnas.filter(c => c.nomenclature.includes(current_rna_class))
        if (found.length < 1) {
          alert("Could not find rna class " + current_rna_class + ` in the cached structure ${cached_struct === null ? "null" : cached_struct.rcsb_id}. This is a bug, please report it.`);
        }
        dispatch(rna_update_auth_asym_id(found[0].auth_asym_id))
      }
    } else {
      dispatch(rna_update_auth_asym_id(null))
    }
  }, [current_rna_class, current_rna_parent, cached_struct])

  return (
    <Grid container xs={12} spacing={1} alignContent="flex-start">
      <Grid item xs={12} style={{ padding: "10px" }}>
        <Paper variant="outlined" className={classes.pageDescription}>
          <Typography variant="h4">
            Visualization
          </Typography>
        </Paper>
      </Grid>


      <Grid item direction="column" xs={3} style={{ padding: "5px" }}>
        <List>

          {(() => {
            if (lastViewed[0] == null && lastViewed[1] != null) {
              return <ListItem>
                Last Item Viewed:   Structure {lastViewed[1]}
              </ListItem>
            }
            else if (lastViewed[0] == null && lastViewed[1] == null) {
              return null
            }
            else {
              return <ListItem>
                Last Item Viewed: {lastViewed[0]?.split('.')[0] === 'protein' ? 'Protein' : 'RNA'} {lastViewed[0]?.split('.')[1]} in Structure {lastViewed[1]}
              </ListItem>
            }
          }
          )()}


          <ListSubheader>Select Item Category: {(() => {
            switch (current_tab) {
              case 'protein_tab':
                return 'Proteins'
              case 'structure_tab':
                return 'Structures'
              case 'rna_tab':
                return 'RNA'
            }
          })()} </ListSubheader>

          <ListItem style={{ display: "flex", flexDirection: "row" }}>

            <Button size="small" color={current_tab === 'structure_tab' ? "primary" : "default"} onClick={() => { handleTabClick('structure_tab') }} variant="outlined" style={{ marginRight: "5px" }} >Structures </Button>
            <Button size="small" color={current_tab === 'protein_tab' ? "primary" : "default"} onClick={() => { handleTabClick("protein_tab") }} variant="outlined" style={{ marginRight: "5px" }} >Proteins   </Button>
            <Button size="small" color={current_tab === 'rna_tab' ? "primary" : "default"} onClick={() => { handleTabClick('rna_tab') }} variant="outlined" style={{ marginRight: "5px" }} >RNA        </Button>

          </ListItem>



          {/* Tab Selectors */}
          <ListItem>
            {(() => {
              switch (current_tab) {
                case 'protein_tab':
                  return <SelectProtein proteins={prot_classes} getCifChainByClass={getCifChainByClass} />

                case 'structure_tab':
                  return <SelectStruct items={all_structures} selectStruct={selectStruct} />

                case 'rna_tab':
                  return <SelectRna items={[]} getCifChainByClass={getCifChainByClass} />
                default:
                  return "Null"
              }
            })()}
          </ListItem>

          {/*  */}
          {(() => {
            switch (current_tab) {
              case 'protein_tab':
                return current_protein_parent === null ? null : <ListItem> <StructHeroVertical d={current_protein_neostruct} inCart={false} topless={true} /></ListItem>

              case 'structure_tab':
                return current_neostruct === null ? null : <ListItem> <StructHeroVertical d={current_neostruct} inCart={false} topless={true} /></ListItem>
              case 'rna_tab':
                return current_rna_parent === null ? null : <ListItem> <StructHeroVertical d={current_rna_neostruct} inCart={false} topless={true} /></ListItem>
              default:
                return "Null"
            }
          })()}

          {/* {
            coerce_full_structure_to_neostruct(cached_struct) === null ? null : <ListItem> <StructHeroVertical d={coerce_full_structure_to_neostruct(cached_struct) as NeoStruct} 
            inCart={false} topless={true} /></ListItem>
          } */}



          {/* Chain Selector  */}
          {(() => {
            switch (current_tab) {
              case 'protein_tab':
                return current_protein_auth_asym_id === null ? null : <ListItem> <ChainHighlightSlider auth_asym_id={current_protein_auth_asym_id} full_structure_cache={cached_struct} /></ListItem>
              case 'structure_tab':
                return current_chain_to_highlight === null ? null : <ListItem> <ChainHighlightSlider auth_asym_id={current_chain_to_highlight} full_structure_cache={cached_struct} /></ListItem>
              case 'rna_tab':
                // return "Select rna"
                return current_rna_auth_asym_id === null ? null : <ListItem> <ChainHighlightSlider auth_asym_id={current_rna_auth_asym_id} full_structure_cache={cached_struct} /></ListItem>
                return // <SelectRna items={[]} getCifChainByClass={getCifChainByClass} />
              default:
                return "Null"
            }
          })()}





          <ListItem>
            {
              (() => {
                switch (current_tab) {
                  case 'protein_tab':
                    return <DownloadElement elemtype={'protein'} id={vis_state.protein_tab.class} parent={vis_state.protein_tab.parent as string} />
                  case 'rna_tab':
                    return <DownloadElement elemtype={'rna'} id={vis_state.rna_tab.class} parent={vis_state.rna_tab.parent as string} />
                  case 'structure_tab':
                    return <DownloadElement elemtype={'structure'} id={vis_state.structure_tab.structure?.struct.rcsb_id === null ? null : vis_state.structure_tab.structure?.struct.rcsb_id as string} />
                }
              })()
            }
          </ListItem>


          {/* <ListItem>
            {
              (() => {
                switch (current_tab) {
                  case 'structure_tab':



                  case 'protein_tab':
                    return 'protein chain x'
                  case 'rna_tab':
                    return 'rna x'
                }
              })()
            }
          </ListItem> */}

          <ListItem>
            <DashboardButton />
          </ListItem>

        </List>
      </Grid>

      <Grid item container direction="row" xs={9} style={{ height: "100%" }}>


        <Grid item xs={12} >
          <Paper variant="outlined" style={{ position: "relative", padding: "10px", height: "80vh" }} >
            <div style={{ position: "relative", width: "100%", height: "100%" }} id="molstar-viewer"></div>
          </Paper>
        </Grid >
      </Grid>



    </Grid>
  )
}

export default VisualizationPage;
