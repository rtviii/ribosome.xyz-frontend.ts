import React, { useEffect, useState } from 'react'
import Grid from "@material-ui/core/Grid";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Popover from "@material-ui/core/Popover";
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { createStyles, lighten, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { AppState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { BanClassMetadata, NeoStruct, PolymerMinimal, ProteinProfile, RNAProfile } from '../../redux/DataInterfaces';
import ListSubheader from '@material-ui/core/ListSubheader/ListSubheader';
import { CardBodyAnnotation } from './../Workspace/StructurePage/StructurePage'
import { requestBanClass } from '../../redux/reducers/Proteins/ActionTypes';
import { getNeo4jData } from '../../redux/AsyncActions/getNeo4jData';
import Paper from '@material-ui/core/Paper/Paper';
import CardHeader from '@material-ui/core/CardHeader/CardHeader';
import Card from '@material-ui/core/Card/Card';
import { ProteinClass, RibosomeStructure, RNAClass } from '../../redux/RibosomeTypes';
import { chain, flattenDeep, uniq } from 'lodash';
import { DashboardButton } from '../../materialui/Dashboard/Dashboard';
import { useHistory, useParams } from 'react-router';
import _ from 'lodash'
import { COMPONENT_TAB_CHANGE, protein_change, rna_change, structureChange, struct_change, VisualizationTabs } from '../../redux/reducers/Visualization/ActionTypes';
import { ToastProvider, useToasts } from 'react-toast-notifications';
import { nomenclatureCompareFn } from '../Workspace/ProteinAlign/ProteinAlignment';
import { RNACard } from '../Workspace/RNA/RNACard';
import fileDownload from 'js-file-download';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import VolumeUp from '@mui/icons-material/VolumeUp';
import StructHero from '../Workspace/StructureHero/StructHero';
import { current_target_change } from '../../redux/reducers/BindingSites/ActionTypes';


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

  const dispatch = useDispatch()
  const selectStructStyles = (makeStyles({
    autocomoplete: {
      width: "100%"
    }
  }))()
  const current_struct = useSelector((state: AppState) => state.visualization.structure_tab.struct)
  const chain_to_highlight: string | null = useSelector((state: AppState) => state.visualization.structure_tab.highlighted_chain)
  const structs = useSelector((state: AppState) => state.structures.derived_filtered)
  const { addToast } = useToasts();

  const paintStructure = (event: React.ChangeEvent<{ value: unknown }>, newvalue: any) => {
    if (newvalue === null) {
      dispatch(struct_change(chain_to_highlight, null))
    } else {
      dispatch(struct_change(null, newvalue))
      addToast(`Structure ${newvalue.struct.rcsb_id} is being fetched.`, {
        appearance: 'info',
        autoDismiss: true,
      })
      viewerInstance.visual.update({
        moleculeId: newvalue.struct.rcsb_id.toLowerCase()
      });
    }
  };

  const handleSelectHighlightChain = (event: React.ChangeEvent<{ value: unknown }>, newvalue: any) => {

    // dispatch(struct_change(newvalue.props.children, current_struct))
    dispatch(struct_change(newvalue.props.value, current_struct))

    viewerInstance.visual.select(
      {
        data: [{
          auth_asym_id: newvalue.props.value,
          color: { r: 50, g: 50, b: 255 }, focus: true
        }]
        , nonSelectedColor: { r: 180, g: 180, b: 180 }
      }
    )


  }

  const classes = (makeStyles((theme: Theme) =>
    createStyles({
      formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
      },
      selectEmpty: {
        marginTop: theme.spacing(2),
      },
    }),
  ))()
  return (
    <>
      <Autocomplete
        className={selectStructStyles.autocomoplete}
        // value={current_struct}
        value={useSelector((state: AppState) => state.visualization.structure_tab.struct)}
        options={structs}
        getOptionLabel={(parent) => {
          if (parent.struct === undefined) {
            return "null"
          }
          else { return parent.struct.rcsb_id }
        }
        }
        // @ts-ignore
        onChange={paintStructure}
        renderOption={(option) => (<div style={{ fontSize: "10px", width: "400px" }}><b>{option.struct.rcsb_id}</b> ({option.struct.citation_title} ) </div>)}
        renderInput={(params) => <TextField {...params} label="Structure" variant="outlined" />}
      />

      <ListItem>
        <FormControl
          // className={classes.formControl} 
          style={{ width: "100%" }}>
          <InputLabel> Highlight Chain</InputLabel>
          <Select
            value={chain_to_highlight}
            onChange={handleSelectHighlightChain}
            // @ts-ignore
            renderValue={(value) => {
              if (value === null) {
                return "null"
              }
              else {
                return <div>{`${value}`}</div>
                // return            <div>{ value === undefined || value===null ? "" : value }</div> 
              }
            }}
          >
            {/* {useSelector(( state:AppState ) => state.visualization.structure_tab.struct?.struct) === null ? null : <MenuItem value="f">{}</MenuItem>} */}
            {current_struct !== null && current_struct !== undefined
              ? [...current_struct?.rnas, ...current_struct?.rps.sort(nomenclatureCompareFn),].map((i) => <MenuItem value={i.auth_asym_id}>{i.nomenclature.length > 0 ? i.nomenclature[0] : "Unclassified Polymer"}</MenuItem>)
              : null}
          </Select>
        </FormControl>



      </ListItem>

    </>
  )
}

const SelectProtein = ({ proteins, getCifChainByClass }: { proteins: BanClassMetadata[], getCifChainByClass: (strand: string, parent: string) => void }) => {

  const styles = useSelectStyles();
  const dispatch = useDispatch();

  const [curProtClass, setProtClass] = React.useState<ProteinClass | null>(null);
  const [curProtParent, setProtParent] = React.useState('');
  const availablestructs = useSelector((state: AppState) => state.proteins.ban_class)

  const chooseProtein = (event: React.ChangeEvent<{ value: unknown }>) => {
    let item = event.target.value as string
    dispatch(requestBanClass(item, false))
    setProtClass(item as ProteinClass);
    dispatch(protein_change(event.target.value as ProteinClass, curProtParent))
  };
  const chooseProtParent = (event: React.ChangeEvent<{ value: unknown }>, newvalue: any) => {
    if (newvalue === null || newvalue.parent_rcsb_id === "Choose a protein class.") {
      protein_change(curProtClass, null)
      return
    }

    setProtParent(newvalue.parent_rcsb_id);
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

  const styles = useSelectStyles();
  const dispatch = useDispatch();

  const [curRna, setCurRna] = React.useState<RNAClass | null>(null);
  const [curRnaParent, setRnaParent] = React.useState<string | null>(null);

  const parents = useSelector((state: AppState) => state.rna.rna_classes_derived)
  useEffect(() => {
  }, [curRna, curRnaParent])

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
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={curRna}
              onChange={(event: any) => {

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
                  getCifChainByClass(curRna as string, newValue.parent_rcsb_id)
                  dispatch(rna_change(curRna, newValue.parent_rcsb_id))
                  setRnaParent(newValue.parent_rcsb_id)
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



const ChainHighlightSlider = ({ }) => {
  const Input = styled(MuiInput)`width: 42px;`;

  const [value, setValue] = React.useState<number | string | Array<number | string>>(
    30,
  );

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };


  // const currentHighlightedChain = useSelector((state: AppState) => )
  // const currentStructId = useSelector((state: AppState) => state.visualization.structure_tab.struct?.struct.rcsb_id)
  // useEffect(() => {
  //   console.log('id or chain chagned', currentHighlightedChain);

  //   if (currentHighlightedChain === null) { return }
  //   else {
  //     getNeo4jData('neo4j', { endpoint: 'get_struct', params: { pdbid: currentStructId as string } })
  //     .then(r => { console.log("got corresponding struct", r.data) })
  //   }
  // }, [currentHighlightedChain, currentStructId])



  // const find_chain_by_auth_asym_id = (struct:NeoStruct):PolymerMinimal =>{
  //   let x = struct.rps[0]
  // }


  return (
    <Box sx={{ width: 600 }}>

      <Typography id="input-slider" gutterBottom>Chain {currentHighlightedChain}</Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <Slider
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
          />
        </Grid>
        <Grid item>
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
        </Grid>
      </Grid>
    </Box>
  );
}

// @ts-ignore
const viewerInstance = new PDBeMolstarPlugin() as any;
// @ts-ignore
// const viewerInstance2 = new PDBeMolstarPlugin() as any;
const VisualizationPage = (props: any) => {
  const [lastViewed, setLastViewed] = useState<Array<string | null>>([null, null])
  const history: any = useHistory();
  const params = history.location.state;
  const dispatch = useDispatch();
  const { addToast } = useToasts();


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Selectors to get the currently selected item and provide info on it, further selections (residues for chainsw)
  const current_struct: NeoStruct | null = useSelector((state: AppState) => state.visualization.structure_tab.struct)
  const chain_to_highlight: string | null = useSelector((state: AppState) => state.visualization.structure_tab.highlighted_chain)
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  useEffect(() => {
    if (params === undefined || Object.keys(params).length < 1) { return }
    else if ((params as { struct: string }).struct) {

      getNeo4jData('neo4j', { endpoint: "get_struct", params: { pdbid: params.struct } }).then(r => {

        if (r.data.length < 1) {
          dispatch(struct_change(null, null))
        }
        else {

          var x: any = {}
          x['ligands'] = r.data[0].ligands.map((_: any) => _.chemicalId)
          x['struct'] = r.data[0].structure
          x['rps'] = r.data[0].rps.map((_: any) => ({ strands: _.entity_poly_strand_id, nomenclature: _.nomenclature }))
          x['rnas'] = r.data[0].rnas.map((_: any) => ({ strands: _.entity_poly_strand_id, nomenclature: _.nomenclature }))

          dispatch(struct_change(null, x))

          addToast(`Structure ${x.struct.rcsb_id} is being fetched.`, {
            appearance: 'info',
            autoDismiss: true,
          })
        }

      })
      // setstruct(params.struct)
      // selectStruct(params.struct)
      // dispatch(struct_change(null,null))


    }
  },
    [
      params
    ]
  )

  const [inView, setInView] = useState<any>({});

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
        // dispatch(struct_change(null, params.struct))
        selectStruct(params.struct)
      }
  }, [])

  const prot_classes: BanClassMetadata[] = useSelector((state: AppState) => _.flattenDeep(Object.values(state.proteins.ban_classes)))
  const structures = useSelector((state: AppState) => state.structures.neo_response.map(
    r => { return { rcsb_id: r.struct.rcsb_id, title: r.struct.citation_title } }))

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
  const selectRna = (strand: string, parent_struct: string) => {
    setLastViewed([`rna.${strand}`, parent_struct])

  }


  useEffect(() => {

    if (inView.type === "struct") {
      getNeo4jData("neo4j", {
        endpoint: "get_struct",
        params: { pdbid: inView.id },
      }).then(
        resp => {
          const respdata: RibosomeStructure = (flattenDeep(resp.data)[0] as any).structure;
          // setstruct(respdata);
          // setInViewData({ type: "struct", data: respdata })
        },

        err => {
          console.log("Got error on /neo request", err);
        }
      );
    }
    else if (inView.type === "chain") {
      getNeo4jData("neo4j", { endpoint: "nomclass_visualize", params: { ban: inView.id } }).then(r => {
        // setInViewData({ type: "chain", data: r.data })
        // setProtClassInfo(r.data[0])
      })
    }


  }, [inView])

  const RenderInViewInfo = ({ type, structdata, protClassInfo }: {
    type: string,
    structdata: RibosomeStructure,
    protClassInfo: {
      class: string,
      comments: string[][],
      members: { parent: string, chain: string }[]
    }
  }) => {
    switch (type) {
      case "chain":
        return protClassInfo.class ? <List>
          <ListSubheader>Ribosomal Protein Class {protClassInfo.class}</ListSubheader>
          {
            uniq(flattenDeep(protClassInfo.comments)).filter(r => r !== "NULL").map(r =>
              <ListItem>
                <Typography className={"s"}>{r}</Typography>
              </ListItem>
            )
          }

        </List> : <div>Not Found</div>
      case "struct":
        return structdata?.rcsb_id ?
          <Card className={classes.card}>
            <CardHeader
              title={`${structdata.rcsb_id}`}
              subheader={structdata.src_organism_ids.length > 0 ? structdata.src_organism_names[0] : ""}
            />
            <CardActionArea>
              <CardMedia
                onClick={() => { history.push(`/structs/${structdata.rcsb_id.toUpperCase()}`) }}
                image={process.env.PUBLIC_URL + `/ray_templates/_ray_${structdata.rcsb_id.toUpperCase()}.png`}
                title={`${structdata.rcsb_id}\n${structdata.citation_title}`}
                className={classes.title}
              />
            </CardActionArea>
            <List>
              <CardBodyAnnotation keyname="Species" value={structdata.src_organism_ids.length > 0 ? structdata.src_organism_names[0] : ""} />
              <CardBodyAnnotation keyname="Resolution" value={structdata.resolution} />
              < CardBodyAnnotation keyname="Experimental Method" value={structdata.expMethod} />
              < CardBodyAnnotation keyname="Title" value={structdata.citation_title} />


              < CardBodyAnnotation keyname="Year" value={structdata.citation_year} />
            </List>
            <CardActions>
              <Grid container justify="space-evenly" direction="row">

                <Grid item>

                  <Button size="small" color="primary">
                    <a href={`https://www.rcsb.org/structure/${structdata.rcsb_id}`}>
                      PDB
                    </a>
                  </Button>
                </Grid>
                <Grid item>
                  <Button size="small" color="primary">
                    <a href={

                      structdata.rcsb_external_ref_link[0]
                    }>
                      EMD
                    </a>
                  </Button>
                </Grid>
                <Grid item>
                  <Button size="small" color="primary">
                    <a href={
                      `https://doi.org/${structdata.citation_pdbx_doi}`
                    }>
                      DOI
                    </a>
                  </Button>
                </Grid>
              </Grid>
            </CardActions>
          </Card>
          : <div>"Loading"</div>
      default:
        return <div></div>
    }
  }

  const coerce_neo_struct_to_struct_hero = (_: NeoStruct): {
    struct: RibosomeStructure;
    ligands: string[];
    rps: Array<{ nomenclature: string[]; auth_asym_id: string }>;
    rnas: string[];
  } => ({

    struct: _.struct,
    ligands: _.ligands,
    rps: _.rps.map(rp => { return { nomenclature: rp.nomenclature, auth_asym_id: rp.auth_asym_id } }),
    rnas: _.rnas.map(rna => rna.auth_asym_id)
  })

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
    dispatch({ type: COMPONENT_TAB_CHANGE, tab });
  }



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
                Last Item Viewed: {lastViewed[0]?.split('.')[0] == 'protein' ? 'Protein' : 'RNA'} {lastViewed[0]?.split('.')[1]} in Structure {lastViewed[1]}
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

            <Button size="small" color={current_tab === 'structure_tab' ? "primary" : "default"} onClick={() => { handleTabClick('structure_tab') }} variant="outlined" style={{ marginRight: "5px" }} >Structures</Button>
            <Button size="small" color={current_tab === 'protein_tab' ? "primary" : "default"} onClick={() => { handleTabClick("protein_tab") }} variant="outlined" style={{ marginRight: "5px" }} >Proteins  </Button>
            <Button size="small" color={current_tab === 'rna_tab' ? "primary" : "default"} onClick={() => { handleTabClick('rna_tab') }} variant="outlined" style={{ marginRight: "5px" }} >RNA       </Button>
          </ListItem>
          <ListItem>
            {(() => {
              switch (current_tab) {
                case 'protein_tab':
                  return <SelectProtein proteins={prot_classes} getCifChainByClass={getCifChainByClass} />
                case 'structure_tab':
                  return <SelectStruct items={structures} selectStruct={selectStruct} />
                case 'rna_tab':
                  return <SelectRna items={[]} getCifChainByClass={getCifChainByClass} />
                default:
                  return "Null"
              }
            })()}

          </ListItem>

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
                    return <DownloadElement elemtype={'structure'} id={vis_state.structure_tab.struct === null ? null : vis_state.structure_tab.struct?.struct.rcsb_id as string} />
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

                    return <div>
                      {current_struct === null ? null : <StructHero  {...coerce_neo_struct_to_struct_hero(current_struct)} />}
                      {chain_to_highlight === null ?
                        null : <ChainHighlightSlider />}
                    </div>
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
