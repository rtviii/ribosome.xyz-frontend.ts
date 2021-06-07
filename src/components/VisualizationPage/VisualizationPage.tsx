import React, { useEffect, useState } from 'react'
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Popover from "@material-ui/core/Popover";
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import fileDownload from "js-file-download";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from "@material-ui/core/Collapse";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { AppState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { BanClassMetadata, RNAProfile } from '../../redux/DataInterfaces';
import ListSubheader from '@material-ui/core/ListSubheader/ListSubheader';
import { CardBodyAnnotation } from './../Workspace/StructurePage/StructurePage'
import { requestBanClass } from '../../redux/reducers/Proteins/ActionTypes';
import { getNeo4jData } from '../../redux/AsyncActions/getNeo4jData';
import Paper from '@material-ui/core/Paper/Paper';
import CardHeader from '@material-ui/core/CardHeader/CardHeader';
import Card from '@material-ui/core/Card/Card';
import { RibosomeStructure } from '../../redux/RibosomeTypes';
import { flattenDeep, uniq } from 'lodash';
import { DashboardButton } from '../../materialui/Dashboard/Dashboard';
import { Widgets } from '@material-ui/icons';
import { useHistory, useParams } from 'react-router';
import _ from 'lodash'
import { Cart } from '../Workspace/Cart/Cart';


const useSelectStyles = makeStyles((theme: Theme) =>
  createStyles({
    select: {
      zIndex: 200
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 400,
    },
    sub: {
      margin: theme.spacing(1),

      minWidth: 200,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }),
);


interface StructSnip {
  rcsb_id: string,
  title  : string,
  any?   : any
}


const SelectStruct = ({ items, selectStruct }: { items: StructSnip[], selectStruct: (_: string) => void }) => {
  const styles = useSelectStyles();
  const [curVal, setVal] = React.useState('');
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    let item = event.target.value as string
    setVal(item);
    selectStruct(item)
  };
  return (
    <FormControl className={styles.formControl}>
      <InputLabel id="demo-simple-select-label">Structures</InputLabel>
      <Select
        className={styles.select}
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={curVal}
        onChange={handleChange}>
        {items.map((i) =>
          <MenuItem value={i.rcsb_id}>{i.rcsb_id}</MenuItem>
        )}
      </Select>
    </FormControl>
  )
}

const SelectProtein = ({ proteins, getCifChainByClass }: { proteins: BanClassMetadata[], getCifChainByClass: (strand: string, parent: string) => void }) => {

  const styles = useSelectStyles();
  const dispatch = useDispatch();

  const [curProtClass, setProtClass] = React.useState('');
  const [curProtParent, setProtParent] = React.useState('');
  const availablestructs = useSelector((state: AppState) => state.proteins.ban_class.map(i => i.parent_rcsb_id))

  const chooseProtein = (event: React.ChangeEvent<{ value: unknown }>) => {
    let item = event.target.value as string
    dispatch(requestBanClass(item, false))
    setProtClass(item);
  };
  const chooseProtParent = (event: React.ChangeEvent<{ value: unknown }>) => {
    let item = event.target.value as string
    setProtParent(item);
    getCifChainByClass(curProtClass, item)

  };
  return (
    <div>
      <FormControl className={styles.sub}>
        <InputLabel id="demo-simple-select-label">Protein Chain</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={curProtClass}
          onChange={chooseProtein}>

          {proteins.map((i) => <MenuItem value={i.banClass}>
            {i.banClass}
          </MenuItem>)}
        </Select>
      </FormControl>

      <FormControl className={styles.sub}>
        <InputLabel htmlFor="grouped-select">From Structure</InputLabel>
        <Select onChange={chooseProtParent} defaultValue="" id="grouped-select">
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {availablestructs.map((i) =>
            <MenuItem value={i}>{i}</MenuItem>
          )}
        </Select>
      </FormControl>
    </div>
  )
}

const SelectRna = ({ rnas, selectItem }: { rnas: RNAProfile[], selectItem: (strand: string, parent: string) => void }) => {

  const styles = useSelectStyles();
  const dispatch = useDispatch();

  const [curRna, setCurRna] = React.useState('');
  const [curRnaParent, setRnaParent] = React.useState('');
  const availablestructs = useSelector((state: AppState) => state.proteins.ban_class.map(i => i.parent_rcsb_id))

  const chooseRna = (event: React.ChangeEvent<{ value: unknown }>) => {
    let item = event.target.value as string
    // dispatch(requestBanClass(item, false))
    setCurRna(item);
  };
  const chooseRnaParent = (event: React.ChangeEvent<{ value: unknown }>) => {
    let item = event.target.value as string
    setRnaParent(item);
  };
  return (
    <div>
      <FormControl className={styles.sub}>
        <InputLabel id="demo-simple-select-label">rRNA Chain</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={curRna}
          onChange={chooseRna}>

          {/* {rnas.map((i) => <MenuItem value={i.rna.entity_poly_strand_id}>
            {i.rna.entity_poly_strand_id}

          </MenuItem>)} */}
        </Select>
      </FormControl>

    </div>
  )
}

// @ts-ignore
const viewerInstance = new PDBeMolstarPlugin() as any;
const VisualizationPage = (props:any) => {

  const history:any= useHistory();

  const params =  history.location.state;

  useEffect(() => {

    if ( params == undefined || Object.keys(params).length < 1 ){return}

    if (( params as {banClass:string, parent:string}  ).parent){
      
      getCifChainByClass(params.banClass,params.parent)
      
    }
    
    else 
    if (( params as {struct:string}  ).struct){
      selectStruct(params.struct)
    }
  }, [params])



  const [inView, setInView]               = useState<any>({});
  const [inViewData, setInViewData]       = useState<any>({});
  const [structdata, setstruct]           = useState<RibosomeStructure>({} as RibosomeStructure);
  const [protClassInfo, setProtClassInfo] = useState<any>({});

  useEffect(() => {
    var options = {
      moleculeId: 'Element to visualize can be selected above.',
      hideControls: true
    }
    var viewerContainer = document.getElementById('molstar-viewer');
    viewerInstance.render(viewerContainer, options);

    if ( params == undefined || Object.keys(params).length < 1 ){return}

    if (( params as {banClass:string, parent:string}  ).parent){
      
      getCifChainByClass(params.banClass,params.parent)
      
    }
    
    else 
    if (( params as {struct:string}  ).struct){
      selectStruct(params.struct)
    }
  }, [])

  const prot_classes: BanClassMetadata[] = useSelector((state: AppState) => _.flattenDeep ( Object.values(state.proteins.ban_classes )))
  const structures = useSelector((state: AppState) => state.structures.neo_response.map(
    r => { return { rcsb_id: r.struct.rcsb_id, title: r.struct.citation_title } }))

  // const rnas         = useSelector(( state:AppState ) => state.rna.all_rna)
  const selectStruct = (rcsb_id: string) => {
    setInView({
      type: "struct",
      id  : rcsb_id,
      data:{}
    })

    viewerInstance.visual.update({
      moleculeId: rcsb_id.toLowerCase()
    });
  }
  const getCifChainByClass = (banclass: string, parent_struct: string) => {

    console.log("triggered cifchain");
    
    viewerInstance.visual.update({
      customData: {
        url: `${process.env.REACT_APP_DJANGO_URL}/static_files/cif_chain_by_class/?classid=${banclass}&struct=${parent_struct}`,
        format: "cif",
        binary: false,
      },
    });
    setInView({
      type  : "chain",
      id    : banclass,
      parent: parent_struct,
    })
  }

  useEffect(() => {

    if ( inView.type =="struct" ){
    getNeo4jData("neo4j", {
      endpoint: "get_struct",
      params: { pdbid: inView.id },
    }).then(
      resp => {
        const respdata:RibosomeStructure =  ( flattenDeep(resp.data)[0] as any ).structure;
        setstruct(respdata);
        setInViewData({ type:"struct", data:respdata})
      },

      err => {
        console.log("Got error on /neo request", err);
      }
    );
        
        
    }
    else if (inView.type =="chain"){

      getNeo4jData("neo4j",{endpoint:"nomclass_visualize", params:{ban:inView.id}}).then(r =>{
        setInViewData({type:"chain", data:r.data})
        setProtClassInfo(r.data[0])
      })
    }
  

  }, [inView])

  const RenderInViewInfo = ({type,structdata, protClassInfo}:{ type:string, structdata:RibosomeStructure,protClassInfo:{
    class:string,
    comments:string[][],
    members:{parent:string, chain:string}[]
  } })=>{
   switch (type){
      case "chain":
        return protClassInfo.class ? <List>
          <ListSubheader>Ribosomal Protein Class {protClassInfo.class}</ListSubheader>
{
uniq(flattenDeep(protClassInfo.comments)).filter(r=>r!=="NULL").map(r => 
<ListItem>
<Typography className={"s"}>{r}</Typography> 
</ListItem>
)
}

        </List> : <div>Not Found</div>
      case "struct":
      return          structdata?.rcsb_id  ? 
        <Card className={classes.card}>
          <CardHeader
            title={`${structdata.rcsb_id}`}
            subheader={structdata._organismName}
          />
          <CardActionArea>
            <CardMedia
              onClick={()=>{history.push(`/structs/${structdata.rcsb_id.toUpperCase()}`)}}
              image={process.env.PUBLIC_URL + `/ray_templates/_ray_${structdata.rcsb_id.toUpperCase()}.png`}
              title={ `${structdata.rcsb_id}\n${structdata.citation_title}` }
              className={classes.title}
            />
          </CardActionArea>
          <List>
            <CardBodyAnnotation keyname="Species" value={structdata._organismName} />
            <CardBodyAnnotation keyname="Resolution" value={structdata.resolution} />
              < CardBodyAnnotation keyname="Experimental Method" value={structdata.expMethod} />
            < CardBodyAnnotation keyname="Title" value={structdata.citation_title} />


            < CardBodyAnnotation keyname="Year" value={structdata.citation_year} />
          </List>
          <CardActions>
            <Grid container justify="space-evenly" direction="row">

              <Grid item>

                <Button size="small" color="primary">
                  <a href={ `https://www.rcsb.org/structure/${structdata.rcsb_id}` }>
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
                  :<div>"Loading"</div>
  default:
    return <Typography variant="caption"> Select a structure or a protein.</Typography>
  }}


  const classes=makeStyles({  
            pageDescription:{
              padding:"20px",
              width:"100%"
            },
            card: {
              width:"100%"
            },
            title: {
              fontSize: 14,
              height  : 300
            },
            heading: {
              fontSize  : 12,
              paddingTop: 5,
            },
            annotation: { fontSize: 12, },
            authors   : {
                transition: "0.1s all",
                "&:hover" : {
                  background: "rgba(149,149,149,1)",
                  cursor    : "pointer",
              },
            },
            nested:{
              paddingLeft: 20,
              color      : "black"
            }
          })();


  return (
    <Grid container xs={12} spacing={1}>

      <Grid item container xs={12} style={{padding:"10px"}}>

<Paper variant="outlined" className={classes.pageDescription}>

          <Typography paragraph >
          <Typography variant="h4">
            Visualization
          </Typography>
          Please select an element to inspect. Entire structures and protein classes are avaialable.
          </Typography>
</Paper>


      </Grid>


      <Grid item container direction="column" xs={3} spacing={1}style={{padding:"10px"}}>
        <List>


          <ListItem>
<Typography variant="overline">Currently Selected:</Typography>
          </ListItem>
          <ListItem>

<RenderInViewInfo type={inViewData.type} structdata={structdata as RibosomeStructure} protClassInfo={protClassInfo}/>
          </ListItem>
          <ListItem>
          <Cart/>
          </ListItem>

          <ListItem>
            <DashboardButton />
          </ListItem>
        </List>


      </Grid>
      <Grid item container direction="column" xs={9} >


        <SelectStruct items={structures} selectStruct={selectStruct} />
        <SelectProtein proteins={prot_classes} getCifChainByClass={getCifChainByClass} />
        <div style={{
          width: "100%",
          height:"50vh"

        }} id="molstar-viewer">Molstar     Viewer     </div             >
      </Grid>



    </Grid>
  )
}

export default VisualizationPage;
