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
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { AppState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { BanClassMetadata, ProteinProfile, RNAProfile } from '../../redux/DataInterfaces';
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
  title  : string,
  any?   : any
}



const getGqlQuery = (pdbid:string) =>{
  console.log("Got pdbid", pdbid);
  
  console.log("returning,", 

  );

  
  return `https://data.rcsb.org/graphql?query={
{entry(entry_id: "${pdbid}") {
  
    rcsb_id

    polymer_entities {
    

        rcsb_polymer_entity_container_identifiers{
    asym_ids
  }
      entity_poly {
                pdbx_strand_id
        type
      }
    }
    nonpolymer_entities {
      rcsb_nonpolymer_entity_container_identifiers{
        asym_ids
      }
      
      pdbx_entity_nonpoly {
        
        comp_id
        name
        entity_id
      }
      rcsb_nonpolymer_entity {
        formula_weight
        pdbx_description
      }
    }
}}
}`


}

const SelectStruct = ({ items, selectStruct }: { items: StructSnip[], selectStruct: (_: string) => void }) => {
  const selectRnaStyles           = ( makeStyles({
    autocomoplete:{
      width:"100%"
    }}) )()
  const [curVal, setVal] = React.useState('');
  const [csetChainAsyms] = useState([])

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>, newvalue:any) => {
            if (newvalue === null){
              return 
            }
    selectStruct(newvalue!.rcsb_id)
    setVal(newvalue!.rcsb_id);

  };




 const structs = useSelector(( state:AppState ) => state.structures.derived_filtered.map(str=>( { 
  title: str.struct.citation_title, rcsb_id:str.struct.rcsb_id } )))
  return (
          <Autocomplete
          className={selectRnaStyles.autocomoplete}
          // size           = "small"
          options        = {structs}
          getOptionLabel = {(parent) =>   parent.rcsb_id + " : "+ parent.title}

          // @ts-ignore
          onChange     = {handleChange}
          renderOption = {(option) => (<div style={{fontSize:"10px", width:"400px"}}><b>{option.rcsb_id}</b> ({option.title} ) </div>)}
          renderInput  = {(params) => <TextField {...params}  label="Structure" variant="outlined" />}
          />

  )
}

const SelectProtein = ({ proteins, getCifChainByClass }: { proteins: BanClassMetadata[], getCifChainByClass: (strand: string, parent: string) => void }) => {

  const styles = useSelectStyles();
  const dispatch = useDispatch();

  const [curProtClass, setProtClass] = React.useState('');
  const [curProtParent, setProtParent] = React.useState('');
  const availablestructs = useSelector((state: AppState) => state.proteins.ban_class)

  const chooseProtein = (event: React.ChangeEvent<{ value: unknown }>) => {
    let item = event.target.value as string
    dispatch(requestBanClass(item, false))
    setProtClass(item);
  };
  const chooseProtParent = (event: React.ChangeEvent<{ value: unknown }>, newvalue:any) => {
    console.log(newvalue)
    if (newvalue === null || newvalue.parent_rcsb_id === "Choose a protein class."){
      return 
    }
    setProtParent(newvalue.parent_rcsb_id);
    getCifChainByClass(curProtClass, newvalue.parent_rcsb_id)

  };
  return (
    <Grid item xs={12}>
      <List style={{ outline: "1px solid gray", borderRadius: "5px" }}>
        <ListItem>
          <FormControl className={styles.sub1}>
            <InputLabel>Protein Class</InputLabel>
            <Select
              labelId ="demo-simple-select-label"
              id      ="demo-simple-select"
              value   ={curProtClass}
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

const SelectRna = ({ items, selectRna }: { items: RNAProfile[], selectRna: (strand: string, parent: string) => void }) => {

  const styles                       = useSelectStyles();
  const dispatch                     = useDispatch();

  const [curRna, setCurRna]          = React.useState('');
  const [curRnaParent, setRnaParent] = React.useState('');


  const chooseRna = (event: React.ChangeEvent<{ value: unknown }>) => {
    let item = event.target.value as string
    // dispatch(requestBanClass(item, false))
    setCurRna(item);
  };
  const chooseRnaParent = (event: React.ChangeEvent<{ value: unknown }>) => {
    let item = event.target.value as string
    setRnaParent(item);
    console.log(item);
    
    // selectRna(item)
  };



  const [state, setState] = React.useState<{ age: string | number; name: string }>({
    age: '',
    name: 'hai',
  });

  const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = event.target.name as keyof typeof state;
    setState({
      ...state,
      [name]: event.target.value,
    });
  };


  const [selectBy, setSelectBy] = useState<string>('Parent Structure');


const parents = useSelector(( state:AppState ) => Object.values(state.rna.rna_classes_derived)
.reduce(( agg, rnaclass )=>{return [...agg,...rnaclass]},[]))
.map((_:RNAProfile)=>( { 
  des    : _.description,
  rcsb_id: _.struct,
  title  : _.parent_citation
}))



const [selectrnaClass, setSelectRnaClass] = useState<string>('5')

  return (
    <Grid item xs={12}>
      <List style={{outline:"1px solid gray", borderRadius:"5px"}}>

<ListItem>
        <FormControl className={styles.sub1}>

          <InputLabel >RNA Class</InputLabel>
          <Select

          labelId  ="demo-simple-select-label"
          id       ="demo-simple-select"
          value    = {selectBy}
          onChange = {(event: any) => {setSelectBy(event.target.value)}}>
            {[
             { v: 'mrna', t: 'mRNA' },
             { v: 'trna', t: 'tRNA' },
             { v: '5'   , t: '5S'    },
             { v: '5.8' , t: '5.8S' },
             { v: '12'  , t: '12S'  },
             { v: '16S' , t: '16S'  },
             { v: '21'  , t: '21S'  },
             { v: '23'  , t: '23S'  },
             { v: '25'  , t: '25S'  },
             { v: '28'  , t: '28S'  },
             { v: '35'  , t: '35S'  },
             ].map((i) => <MenuItem value={i.v}>{i.t}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl  className={styles.sub2}>
          <Autocomplete
          styles={{marginRight:"10px", outline:"none"}}
          options        = {parents}
          getOptionLabel = {(parent) =>   parent.rcsb_id }
          // @ts-ignore
          onChange     = {(event: any, newValue: string | null) => {
            if (newValue === null){
              return
            }
            console.log(newValue)

          }}
          renderOption = {(option) => (<div style={{fontSize:"10px", width:"400px"}}><b>{option.rcsb_id}</b> ({option.title} ) ::: <i>{option.des}</i></div>)}
          renderInput  = {(params) => <TextField {...params} style={{ fontSize:"8px"}} label="Parent Structure" variant="outlined" />}
          />


        </FormControl>



</ListItem>


</List>
</Grid>
  )
}



const selectAndFocusOnChain = (viewerInstance:any, asymId:string)=>{
        viewerInstance.visual.select({ data: [{struct_asym_id: 'B', color:{r:255,g:255,b:0}, focus:true}], nonSelectedColor: {r:255,g:255,b:255} })
}


// @ts-ignore
// const viewerInstance = new PDBeMolstarPlugin() as any;
// @ts-ignore
// const viewerInstance2 = new PDBeMolstarPlugin() as any;
const VisualizationPage = (props:any) => {
  const [lastViewed, setLastViewed] = useState<Array<string | null>>([ null,null ])
  const history:any                 = useHistory();
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


const [mode, setMode] = useState<'single'|'split'>('single')

  useEffect(() => {
    var options = {
      moleculeId  : 'Element to visualize can be selected above.',
      hideControls: true,
       layoutIsExpanded: false,
    }

    // var viewerContainer = document.getElementById('molstar-viewer');
    // viewerInstance.render(viewerContainer, options);




    if ( params == undefined || Object.keys(params).length < 1 ){return}

    if (( params as {banClass:string, parent:string}  ).parent){
      getCifChainByClass(params.banClass,params.parent)
    }
    else 
    if (( params as {struct:string}  ).struct){
      selectStruct(params.struct)
    }
  }, [mode])

  const prot_classes: BanClassMetadata[] = useSelector((state: AppState) => _.flattenDeep ( Object.values(state.proteins.ban_classes )))
  const structures = useSelector((state: AppState) => state.structures.neo_response.map(
    r => { return { rcsb_id: r.struct.rcsb_id, title: r.struct.citation_title } }))



  // const rnas         = useSelector(( state:AppState ) => state.rna.all_rna)
  const selectStruct = (rcsb_id: string) => {
    setInView({
      type: "struct",
      id  : rcsb_id,
      data: {}
    })

    // viewerInstance.visual.update({
    //   moleculeId: rcsb_id.toLowerCase()
    // });

    setLastViewed([null, rcsb_id])


  }
  const getCifChainByClass = (banclass: string, parent_struct: string) => {
    
    // viewerInstance.visual.update({
    //   customData: {
    //     url: `${process.env.REACT_APP_DJANGO_URL}/static_files/cif_chain_by_class/?classid=${banclass}&struct=${parent_struct}`,
    //     format: "cif",
    //     binary: false,
    //   },
    // });
    setInView({
      type  : "chain",
      id    : banclass,
      parent: parent_struct,
    })

    setLastViewed([`protein.${banclass}`,parent_struct])

  }
  const selectRna  =(strand:string, parent_struct:string)=>{
    setLastViewed([`rna.${strand}`,parent_struct])

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
    return <div></div>
  }}


  const classes=makeStyles({  
            pageDescription:{
              padding:"20px",
              width:"100%",
              height:"min-content"
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

// ? rna/struct/prot tab
const [current_tab, set_current_tab] = useState<string>('struct')
const handleTabClick =(tab:string) =>{

  set_current_tab(tab)

}

return (
    <Grid container xs={12} spacing={1} style={{outline:"1px solid gray", height:"100vh"}} alignContent="flex-start">

      {/* <Grid item  xs={12} style={{ padding: "10px"}}>
        <Paper variant="outlined" className={classes.pageDescription}>
          <Typography paragraph >
            <Typography variant="h4">
              Visualization
          </Typography>
          Please select an element to inspect. Entire structures and protein classes are avaialable.
          </Typography>
        </Paper>
      </Grid>


      <Grid item  direction="column" xs={3} style={{ padding: "5px" }}>
        <List>

        <ListItem>
          <Cart />
        </ListItem>
{
( ()=>{
  if (lastViewed[0] == null && lastViewed[1] != null){
      return         <ListItem>
            Last Item Viewed:   Structure {lastViewed[1]} 
          </ListItem>}
    else if(lastViewed[0] == null && lastViewed[1] == null){
      return null
    }
else{

      return         <ListItem>
            Last Item Viewed: { lastViewed[0]?.split('.')[0] =='protein' ? 'Protein' : 'RNA' } {lastViewed[0]?.split('.')[1]} in Structure {lastViewed[1]} 
          </ListItem>
}
  }

 )()

}

        <ListSubheader>Select Item Category</ListSubheader>
        <ListItem style={{ display: "flex", flexDirection: "row" }}>

          <Button size = "small" color = {current_tab == 'struct' ? "primary" : "default"} onClick = {() => { handleTabClick('struct') }} variant = "outlined" style = {{ marginRight: "5px" }} >Structures</Button>
          <Button size = "small" color = {current_tab == 'rp'     ? "primary" : "default"} onClick = {() => { handleTabClick("rp"    ) }} variant = "outlined" style = {{ marginRight: "5px" }} >Proteins  </Button>
          <Button size = "small" color = {current_tab == 'rna'    ? "primary" : "default"} onClick = {() => { handleTabClick('rna'   ) }} variant = "outlined" style = {{ marginRight: "5px" }} >RNA       </Button>
        </ListItem>
        <ListItem>
          {(() => {
            switch (current_tab) {
              case 'rp':
                return <SelectProtein proteins={prot_classes} getCifChainByClass={getCifChainByClass} />
              case 'struct':
                return <SelectStruct items={structures} selectStruct={selectStruct} />

              case 'rna':
                return <SelectRna items={[]} selectRna={selectRna}/>
              default:
                return "Null"
            }
          })()}

        </ListItem>

{

current_tab ==='struct' ?  
<ListItem >
  <Button variant="outlined"
  
  fullWidth
  color="primary"
  onClick={
    ()=>{



viewerInstance.visual.select({ data: [{struct_asym_id: 'B', color:{r:255,g:255,b:0}, focus:true}], nonSelectedColor: {r:255,g:255,b:255} })
    }

  }
  >
    Highlight chain [B]
  </Button>

</ListItem> : null
}


{

current_tab ==='struct' ?  
<ListItem >
  <Button variant="outlined"
  
  color="primary"
  onClick={
    ()=>{
viewerInstance.visual.select({ data: [{ struct_asym_id: 'B', start_residue_number: 1, end_residue_number: 6, color:{r:255,g:255,b:0}, focus: true }], nonSelectedColor: {r:255,g:255,b:255}})
    }

  }
  >
    Binding Site
  </Button>

</ListItem> : null
}



        <ListItem>
          <DashboardButton />
        </ListItem>



        </List>
      </Grid> */}

{/* ------------------------------------------------------------------------------------------------ */}
    {/* <Grid item container direction="row" xs={9} style={{ height: "100%" }}>

      <Grid item style={{ width: "100%", height: "100%" }}>
        <div style={{
          width: "100%",
          height: "100%"
        }}
          id="molstar-viewer">Molstar     Viewer     </div             >
      </Grid>:
      </Grid> */}



hey

    </Grid>
  )
}

export default VisualizationPage;
