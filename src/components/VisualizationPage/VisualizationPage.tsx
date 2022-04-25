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
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Box from '@mui/material/Box';
import MuiInput from '@mui/material/Input';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import fileDownload from 'js-file-download';
import Tooltip from "@mui/material/Tooltip";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useToasts } from 'react-toast-notifications';
import { DashboardButton } from '../../materialui/Dashboard/Dashboard';
import { getNeo4jData } from '../../redux/AsyncActions/getNeo4jData';
import { NeoStruct } from '../../redux/DataInterfaces';
import { cache_full_struct, COMPONENT_TAB_CHANGE, struct_change, VisualizationTabs } from '../../redux/reducers/Visualization/ActionTypes';
import { AppState, store } from '../../redux/store';
import { nomenclatureCompareFn } from '../Workspace/ProteinAlign/ProteinAlignment';
import { StructHeroVertical } from "./../../materialui/StructHero";
import { Protein, RNA } from "../../redux/RibosomeTypes";


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
  const { addToast } = useToasts();




  const structure_tab_select = (event: React.ChangeEvent<{ value: unknown }>, selected_neostruct: NeoStruct | null) => {
    dispatch(cache_full_struct(selected_neostruct && selected_neostruct?.struct.rcsb_id))
    dispatch(struct_change(null, selected_neostruct))

    if (selected_neostruct !== null) {
      addToast(`Structure ${selected_neostruct.struct.rcsb_id} is being fetched.`,
        {
          appearance: 'info',
          autoDismiss: true,
        })

      viewerInstance.visual.update({ moleculeId: selected_neostruct.struct.rcsb_id.toLowerCase() });

    }
  };

  const handleSelectHighlightChain = (event: React.ChangeEvent<{ value: unknown }>, selected_chain: any) => {



    // get current structure because arguments and functions here are poorly written.
    const curstate = store.getState()
    const curstruct = curstate.visualization.structure_tab.structure
    dispatch(struct_change(selected_chain.props.value, curstruct))


    viewerInstance.visual.select(
      {
        data: [{
          auth_asym_id: selected_chain.props.value,
          color: { r: 50, g: 50, b: 255 }, focus: true
        }]
        , nonSelectedColor: { r: 180, g: 180, b: 180 }
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



        <Tooltip disableHoverListener={current_chain_to_highlight === null} title={
          <>
            <div>"chain x" </div>
            <div>"nasym_id y"</div>
          </>
        }>

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
                    <MenuItem value={chain.auth_asym_id}>{chain.nomenclature.length > 0 ? chain.nomenclature[0] : "Unclassified Polymer"}</MenuItem>)
              }
            </Select>
          </FormControl>

        </Tooltip>



      </ListItem>






    </>
  )
}

// const SelectProtein = ({ proteins, getCifChainByClass }: { proteins: BanClassMetadata[], getCifChainByClass: (strand: string, parent: string) => void }) => {

//   const styles = useSelectStyles();
//   const dispatch = useDispatch();

//   const [curProtClass, setProtClass] = React.useState<ProteinClass | null>(null);
//   const [curProtParent, setProtParent] = React.useState('');
//   const availablestructs = useSelector((state: AppState) => state.proteins.ban_class)

//   const chooseProtein = (event: React.ChangeEvent<{ value: unknown }>) => {
//     let item = event.target.value as string
//     dispatch(requestBanClass(item, false))
//     setProtClass(item as ProteinClass);
//     dispatch(protein_change(event.target.value as ProteinClass, curProtParent))
//   };
//   const chooseProtParent = (event: React.ChangeEvent<{ value: unknown }>, newvalue: any) => {
//     if (newvalue === null || newvalue.parent_rcsb_id === "Choose a protein class.") {
//       protein_change(curProtClass, null)
//       return
//     }

//     setProtParent(newvalue.parent_rcsb_id);
//     getCifChainByClass(curProtClass as ProteinClass, newvalue.parent_rcsb_id)
//     dispatch(protein_change(curProtClass, newvalue.parent_rcsb_id))

//   };
//   return (
//     <Grid item xs={12}>
//       <List style={{ outline: "1px solid gray", borderRadius: "5px" }}>
//         <ListItem>
//           <FormControl className={styles.sub1}>
//             <InputLabel>Protein Class</InputLabel>
//             <Select
//               labelId="demo-simple-select-label"
//               id="demo-simple-select"
//               value={curProtClass}
//               onChange={chooseProtein}>
//               {proteins.map((i) => <MenuItem value={i.banClass}>{i.banClass}
//               </MenuItem>)}
//             </Select>
//           </FormControl>

//           <FormControl className={styles.sub2}>
//             <Autocomplete
//               styles={{ marginRight: "9px", outline: "none" }}
//               options={availablestructs.length > -1 ? availablestructs : [{ parent_rcsb_id: "Choose a protein class." } as ProteinProfile]}
//               getOptionLabel={(parent) => parent.parent_rcsb_id}
//               // @ts-ignore
//               onChange={chooseProtParent}
//               renderOption={(option) => (<div style={{ fontSize: "9px", width: "400px" }}><b>{option.parent_rcsb_id}</b> ({option.pfam_descriptions} ) </div>)}
//               renderInput={(params) => <TextField {...params} style={{ fontSize: "7px" }} label="Parent Structure" variant="outlined" />}

//             />
//           </FormControl>

//         </ListItem>
//       </List>
//     </Grid>
//   )
// }

// const SelectRna = ({ items, getCifChainByClass }: { items: RNAProfile[], getCifChainByClass: (strand: string, parent: string) => void }) => {

//   const styles = useSelectStyles();
//   const dispatch = useDispatch();

//   const [curRna, setCurRna] = React.useState<RNAClass | null>(null);
//   const [curRnaParent, setRnaParent] = React.useState<string | null>(null);

//   const parents = useSelector((state: AppState) => state.rna.rna_classes_derived)
//   useEffect(() => {
//   }, [curRna, curRnaParent])

//   var rnaClasses: { v: string, t: RNAClass }[] = [
//     { v: 'mRNA', t: 'mRNA' },
//     { v: 'tRNA', t: 'tRNA' },
//     { v: '5SrRNA', t: '5SrRNA' },
//     { v: '5.8SrRNA', t: '5.8SrRNA' },
//     { v: '12SrRNA', t: '12SrRNA' },
//     { v: '16SrRNA', t: '16SrRNA' },
//     { v: '21SrRNA', t: '21SrRNA' },
//     { v: '23SrRNA', t: '23SrRNA' },
//     { v: '25SrRNA', t: '25SrRNA' },
//     { v: '28SrRNA', t: '28SrRNA' },
//     { v: '35SrRNA', t: '35SrRNA' },
//   ]
//   return (
//     <Grid item xs={12}>
//       <List style={{ outline: "1px solid gray", borderRadius: "5px" }}>

//         <ListItem>
//           <FormControl className={styles.sub1}>
//             <InputLabel >RNA Class</InputLabel>
//             <Select
//               labelId="demo-simple-select-label"
//               id="demo-simple-select"
//               value={curRna}
//               onChange={(event: any) => {

//                 setCurRna(event.target.value)
//                 dispatch(rna_change(event.target.value, curRnaParent))

//               }}>
//               {rnaClasses.map((i) => <MenuItem value={i.v}>{i.t}</MenuItem>)}
//             </Select>
//           </FormControl>

//           <FormControl className={styles.sub2}>
//             <Autocomplete

//               //@ts-ignore
//               styles={{ marginRight: "10px", outline: "none" }}
//               options={curRna === null ? [] : parents[curRna as RNAClass]}
//               getOptionLabel={(parent) => parent.parent_rcsb_id}
//               // @ts-ignore

//               onChange={(event: any, newValue: any) => {
//                 if (newValue !== null) {
//                   getCifChainByClass(curRna as string, newValue.parent_rcsb_id)
//                   dispatch(rna_change(curRna, newValue.parent_rcsb_id))
//                   setRnaParent(newValue.parent_rcsb_id)
//                 } else {
//                   dispatch(rna_change(curRna, null))
//                   setRnaParent(null)
//                 }
//               }}
//               renderOption={(option) => (<div style={{ fontSize: "10px", width: "400px" }}><b>{option.parent_rcsb_id}</b>  ::: <i>{option.src_organism_names}</i></div>)}
//               renderInput={(params) => <TextField {...params} style={{ fontSize: "8px" }} label="Parent Structure" variant="outlined" />}
//             />

//           </FormControl>



//         </ListItem>


//       </List>
//     </Grid>
//   )
// }

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
    <Paper style={{ width: "100%" }}>
      <Grid>
        {
          (() => {
            if (id === null) {
              return <Button disabled={true}> Download Selected </Button>
            }
            else {
              switch (elemtype) {
                case 'protein':
                  return <Button fullWidth size="small" color='primary' style={{ marginRight: "5px" }} onClick={() => download_elem()} >

                    <FileDownloadIcon />
                    <Typography>Protein {id} in {parent} </Typography>
                  </Button>
                case 'rna':
                  return <Button fullWidth size="small" color='primary' style={{ marginRight: "5px" }} onClick={() => download_elem()} >
                    <FileDownloadIcon />

                    <Typography>RNA {id} in {parent}</Typography>
                  </Button>
                case 'structure':

                  return <Button fullWidth size="small" color='primary' style={{ marginRight: "5px" }} onClick={() => download_elem()} >

                    <FileDownloadIcon />
                    <Typography>Structure {id} </Typography>
                  </Button>
              }
            }
          })()
        }
      </Grid>
    </Paper>
  )
}




const ChainHighlightSlider = () => {
  // takes in a full protein or rna


  const current_chain_to_highlight = useSelector((appstate: AppState) => appstate.visualization.structure_tab.highlighted_chain)
  const fullstruct_cache = useSelector((appstate: AppState) => appstate.visualization.full_structure_cache)

  useEffect(() => {

    if (fullstruct_cache && current_chain_to_highlight ) {
       const allchains = [...fullstruct_cache.proteins,  ...(() => {
        if (fullstruct_cache.rnas === undefined || fullstruct_cache.rnas === null) {
          return []
        } else {
          return fullstruct_cache.rnas

        }
      })()]
      console.log("Allchains: ", allchains);
      console.log("Allchains length: ", allchains.length);
    console.log("props changed in slideR:", fullstruct_cache);
    console.log("props changed in slideR:", current_chain_to_highlight);
      // console.log("picked full chain", pickFullChain);
      
    }




  }, [

    current_chain_to_highlight,
    fullstruct_cache
  ])


  const [value, setValue] = React.useState<number[]>([20, 37]);
  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };



  return (
    <Card variant="outlined" style={{ display: "flex", flexDirection: "row", width: "maxWidth" }}>

      <CardMedia
        style={{ padding: "10px" }}
        component="img"
        alt={"image_of_the_ribosome"}
        // height    = "150"
        image={require('./../../static/protein_icon.png')} />
      {/* Things to annotate here:
            
                      asym_ids: (2) ['ED', 'FD']
          auth_asym_id: "Z6"
          entity_poly_entity_type: "polyribonucleotide"
          entity_poly_polymer_type: "RNA"
          entity_poly_seq_length: 3
          entity_poly_seq_one_letter_code: "CC(PPU)"
          entity_poly_seq_one_letter_code_can: "CCA"
          entity_poly_strand_id: "Z6,Z8"
          host_organism_ids: []
          host_organism_names: []
          ligand_like: false
          nomenclature: []
          parent_rcsb_id: "1VVJ"
          rcsb_pdbx_description: "RNA (5'-R(*CP*CP*(PPU))-3')"
          src_organism_ids: [32630]
          src_organism_names: ['Synthetic']
            
            
            */}

      <Slider
        style={{ width: "200px" }}
        getAriaLabel={() => 'Chain XXX'}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
      // getAriaValueText  = {valuetext}
      />
      {/* <Grid item>
          <Input
            value={value}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 10,
              min: 0,
              max: 100,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid> */}
    </Card>
  );
}

// @ts-ignore
const viewerInstance = new PDBeMolstarPlugin() as any;
// @ts-ignore
// const viewerInstance2 = new PDBeMolstarPlugin() as any;
const VisualizationPage = (props: any) => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
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

  // const prot_classes: BanClassMetadata[] = useSelector((state: AppState) => _.flattenDeep(Object.values(state.proteins.ban_classes)))

  const selectStruct = (rcsb_id: string) => {
    viewerInstance.visual.update({
      moleculeId: rcsb_id.toLowerCase()
    });

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

  // const selectRna = (strand: string, parent_struct: string) => { setLastViewed([`rna.${strand}`, parent_struct]) }
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
  const handleTabClick = (tab: VisualizationTabs) => { dispatch({ type: COMPONENT_TAB_CHANGE, tab }); }

  const current_neostruct = useSelector((state: AppState) => state.visualization.structure_tab.structure)
  const current_chain_to_highlight = useSelector((state: AppState) => state.visualization.structure_tab.highlighted_chain)


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

          <ListItem>
            {(() => {
              switch (current_tab) {
                case 'protein_tab':
                  return "Select protein "
                // return <SelectProtein proteins={prot_classes} getCifChainByClass={getCifChainByClass} />
                case 'structure_tab':
                  return <SelectStruct items={all_structures} selectStruct={selectStruct} />
                case 'rna_tab':
                  return "Select rna"
                // return <SelectRna items={[]} getCifChainByClass={getCifChainByClass} />
                default:
                  return "Null"
              }
            })()}

          </ListItem>


          {current_neostruct === null
            ? null
            : <ListItem> <StructHeroVertical d={current_neostruct} inCart={false} topless={true} /></ListItem>}

          {current_chain_to_highlight === null ? null :


            <ListItem style={{ width: "maxWidth" }}>

              <ChainHighlightSlider />

            </ListItem>
          }

          {current_tab === 'structure_tab' ?
            <ListItem>
              <Button fullWidth variant="outlined" color="primary" onClick={
                () => {
                  viewerInstance.visual.reset({ camera: true, theme: true })
                }
              }>
                Reset
              </Button>
            </ListItem>
            : null

          }


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


          <ListItem>
            {/* Currently selected */}
            {
              (() => {
                switch (current_tab) {
                  case 'structure_tab':

                    return 'this should be in the custom component'

                  case 'protein_tab':
                    return 'protein chain x'
                  case 'rna_tab':
                    return 'rna x'
                }
              })()
            }
          </ListItem>


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
