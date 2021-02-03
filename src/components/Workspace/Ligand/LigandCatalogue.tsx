
import { flattenDeep } from "lodash";
import fileDownload from "js-file-download";
import React, { useEffect, useState } from "react";
import { getNeo4jData } from '../../../redux/AsyncActions/getNeo4jData';
import "./LigandCatalogue.css";
import { Ligand } from "./../../../redux/RibosomeTypes";
import { Link, useHistory, useParams } from "react-router-dom";
import LoadingSpinner from "../../Other/LoadingSpinner";
import { Accordion } from "react-bootstrap";
import {md_files, ReactMarkdownElement } from '../../Other/ReactMarkdownElement'

import download from './../../../static/download.png'
import PageAnnotation from "../Display/PageAnnotation";
import Grid from "@material-ui/core/Grid";
import { StructureWithLigand,LigandResponseShape}from './../../../redux/DataInterfaces'
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import { SearchField, SpeciesList } from "../Display/StructuresCatalogue";
import Pagination from "../Display/Pagination";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { AppState } from "../../../redux/store";
import { AppActions } from "../../../redux/AppActions";
import { gotopage } from "../../../redux/reducers/Ligands/ActionTypes";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { truncate } from "../../Main";
import Popover from "@material-ui/core/Popover";
import Tooltip from "@material-ui/core/Tooltip";


const pageData= {
  title:"Ligands, Antibiotics and Small Molecules",
  text:"We provide a residue-level catalogue of ligands, small molecules and antibiotics that are solved with ribosome structures.\
   Additional tools allow to visualize their physical neighborhood and search for similar molecules across other structures in the database."
}

 
const LigandCard =(l:LigandResponseShape)=> {


 const history = useHistory()
  const classes = makeStyles({
  
  root: {
    minWidth: 275,
      "&:hover": {
        background: "rgba(223,223,223,0.5)",
        cursor: "pointer",
      },
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  hover:{
      "&:hover": {
        background: "rgba(223,223,223,0.5)",
        cursor: "pointer",
      },
  },
  hoverpop:{
    transition:"0.01s",
      "&:hover": {
        // background: "rgba(223,223,223,0.5)",
        transform: "scale(1.01)",
        cursor: "pointer",
      },
  }
})()

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        {/* <Typography className={classes.title} color="textSecondary" gutterBottom>
        </Typography> */}
        <Typography variant="h5">{l.ligand.chemicalId}</Typography>
        <Typography className={classes.pos} color="textSecondary">
          {truncate(l.ligand.chemicalName, 40, 50)}
        </Typography>
        {/* <Typography variant="body2" component="p" noWrap={false}>
          {truncate( l.ligand.pdbx_description, 40,40)}
        </Typography> */}
      </CardContent>
      <CardActions>
        {/* <OverlayTrigger 
        rootClose trigger={'click'}
        placement='bottom'
        overlay={popoverstructs(data, speciesFilter,data.ligand.chemicalId)}>
          <div id='lig-str-present'>
          Associated structures({filterByorg( data.presentIn, speciesFilter ).length})</div>
          </OverlayTrigger> */}
        {/* <Link to={`/interfaces/${null}/ligand/${l.chemicalId}`}>{l.chemicalId}</Link> (<span style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>{truncate(l.chemicalName)}</span>) */}

        {/* <Button size="small">Binding Sites</Button> */}

        <Button
          size="small"
          aria-describedby={id}
          variant="outlined"
          onClick={handleClick}
        >
          In Strucutres
        </Button>
      </CardActions>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Grid xs={12} container style={{ padding: "20px" }}>
          {l.presentIn.map(r => (
            <Grid item container className={classes.hover}>
              <Grid item xs={1} justify="flex-end" container>
                <Typography onClick={()=>{
                  history.push(`/structs/${r.rcsb_id}`)
                }} className={classes.hoverpop}>
                    {r.rcsb_id}
                </Typography>
              </Grid>

              <Grid item xs={1} justify="flex-start" container>
<Tooltip title="Download binding site analytics as a .json file.">

                  <img

                    onClick={()=>{
                      getNeo4jData("neo4j",{endpoint:"download_ligand_nbhd",params:{
                        chemid:l.ligand.chemicalId,
                        structid:r.rcsb_id
                      }}).then(
                        response=>{
                            fileDownload(response.data, `LIGAND_${l.ligand.chemicalId}_${r.rcsb_id}.json`);
                        },
                        e=>alert("Sorry, this structure has not been parsed yet.")
                        
                        
                      )
                    }}
                    src={process.env.PUBLIC_URL + "/icons/download.png"}
                    style={{ height: "20px", width: "20px", marginLeft:"30px"}}
                  />
</Tooltip></Grid>
              <Grid item xs={6}>
                <Typography>{r.citation_title}</Typography>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Popover>
    </Card>
  );
}



interface ReduxProps{all_ligands: LigandResponseShape[], current_page: number, page_total:number}
interface DispatchProps{gotopage: (pid:number)=>void}

type      LigandsCatalogueProps                           = ReduxProps & DispatchProps
const     LigandCatalogue:React.FC<LigandsCatalogueProps> = (prop) => {
  const [ligs, setligs]     = useState<LigandResponseShape[]>([]);
  const [ionsOn, setionsOn] = useState(true);

  var params: any = useParams();


  var params:any = useParams()
  const lig = params.lig


  return (
    <Grid container xs={12} spacing={3}>
      <Grid item xs={12}>
        <PageAnnotation {...pageData} />
      </Grid>

      <Grid item xs={2}>
        
          <List>
            <ListSubheader>Species</ListSubheader>
            <ListItem>
              <SpeciesList />
            </ListItem>

            <Divider />
            <ListItem>
              <SearchField />
            </ListItem>
            <ListItem>
              <Pagination
                {...{ gotopage: prop.gotopage, pagecount: prop.page_total }}
              />
            </ListItem>
            
          </List>
      </Grid>

      <Grid item xs={10} container spacing={1}>

        {prop.all_ligands.slice(( prop.current_page-1 )*20, prop.current_page*20).map((l: LigandResponseShape) => (
            <Grid item>
              <LigandCard {...l}  />
            </Grid>
          ))
          }

      </Grid>
    </Grid>
  );
};


const mapstate = (appstate:AppState, ownprops:any):ReduxProps =>({
  all_ligands : appstate.ligands.ligands_all_derived,
  page_total  : appstate.ligands.pages_total,
  current_page: appstate.ligands.current_page,
})

const mapdispatch = ( dispatch:Dispatch<AppActions>, ownprops:any):DispatchProps =>({
  gotopage:(pid) => dispatch(gotopage(pid))
})

export default connect(mapstate,mapdispatch)(LigandCatalogue)
