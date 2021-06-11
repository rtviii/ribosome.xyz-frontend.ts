import React, { useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { NeoHomolog } from "../../../redux/DataInterfaces";
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import downicon from "./../../../static/download.png"
import fileDownload from "js-file-download";
import loading from "./../../../static/loading.gif";
import { useHistory } from 'react-router-dom'
import GetAppIcon from '@material-ui/icons/GetApp';
import bookmark from './../../../static/bookmark_icon.svg'

import BookmarkIcon from '@material-ui/icons/Bookmark';
import { getNeo4jData } from "../../../redux/AsyncActions/getNeo4jData";
import Popover from '@material-ui/core/Popover';
import { connect, useDispatch, useSelector } from 'react-redux';
import { FiltersReducerState } from "../../../redux/reducers/Filters/FiltersReducer";
import { filterChangeActionCreator, FilterData, FilterType } from '../../../redux/reducers/Filters/ActionTypes';
import { CartItem, cart_add_item } from '../../../redux/reducers/Cart/ActionTypes';
import { AppState } from '../../../redux/store';
import { Dispatch } from 'redux'
import { AppActions } from '../../../redux/AppActions';
import { RibosomalProtein, RibosomeStructure } from '../../../redux/RibosomeTypes';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar/Avatar';
import CardHeader from '@material-ui/core/CardHeader/CardHeader';
import CardActionArea from '@material-ui/core/CardActionArea/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia/CardMedia';
import List from '@material-ui/core/List/List';
import { CardBodyAnnotation } from '../StructurePage/StructurePage';
import ListItem from '@material-ui/core/ListItem/ListItem';
import LinearProgress from '@material-ui/core/LinearProgress';
import { flattenDeep } from 'lodash';
import { useEffect } from 'react';


const RPLoader = () => (
  <div className="prot-loading">
    <span>Parsing file..</span>
    <img src={loading} />
  </div>
);


export const ChainParentPill = ({ strand_id, parent_id }:{strand_id:string, parent_id:string}) =>{
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    popover: {
      pointerEvents: 'none',
    },
    popoverContent:{
      pointerEvents:"auto"
    },
    paper: {
      padding: theme.spacing(1),
    },
          card: {
            width:300,

            padding:10
          },
          title: {
            fontSize: 12,
            height  : 200
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
  }),
);


 const classes                 = useStyles();
 const history                 = useHistory();
 const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
 const [structdata, setstruct] = useState<RibosomeStructure>();

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {


    if (! structdata ){
    getNeo4jData("neo4j", {
      endpoint: "get_struct",
      params: { pdbid: parent_id },
    }).then(
      resp => {
        const respdat:any = flattenDeep(
          resp.data
        )[0];
        setstruct(respdat.structure);

      },
      err => {
        console.log("Got error on /neo request", err);
      }
    );
    }
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

const open     = Boolean(anchorEl);
const id       = open ? 'simple-popover' : undefined;
const dispatch = useDispatch();
  return (
    <>
 <Typography
        onMouseEnter={handlePopoverOpen}
      >

  <Chip  color="primary" variant="outlined" label={<Typography style={{fontSize:"12px"}}>chain <b>{strand_id}</b> of <b>{parent_id}</b></Typography>  }/>

      </Typography>
      <Popover

          id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}


        className={classes.popover}
        classes={{
          paper: classes.popoverContent,
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >

{
              structdata ? 
        <Card className={classes.card}
        onMouseLeave={handlePopoverClose}
        
        >
          <CardHeader
          style={{cursor:"pointer"}}
        onClick={() => { history.push({ pathname: `/structs/${parent_id}`}) }}
            title={`${structdata.rcsb_id}`}
            subheader={structdata._organismName}
          />
          <CardActionArea>
            <CardMedia
              image={process.env.PUBLIC_URL + `/ray_templates/_ray_${parent_id.toUpperCase()}.png`}
              title={ `${structdata.rcsb_id}\n${structdata.citation_title}` }
              className={classes.title}
            />
          </CardActionArea>
          <List>
            <CardBodyAnnotation keyname="Species" value={structdata._organismName} />
            <CardBodyAnnotation keyname="Resolution" value={structdata.resolution} />
            < CardBodyAnnotation keyname="Title" value={structdata.citation_title} />


            < CardBodyAnnotation keyname="Year" value={structdata.citation_year} />
          </List>
          <CardActions>
            <Grid container> 
            <Grid item container justify="space-evenly" direction="row" xs={12}>

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
            <Grid item container justify="space-evenly" direction="row" xs={12}>

              <Grid item>

                <Button onClick={() => { history.push({ pathname: `/vis`, state: { struct: structdata.rcsb_id } }) }} style={{textTransform:"none"}}>
                  <VisibilityIcon />
          Visualize
          </Button>
              </Grid>
              <Grid item>
                <Button onClick={(e)=>{


dispatch(cart_add_item(structdata))
                }} style={{textTransform:"none"}} >
                  <BookmarkIcon/>
Add To Workspace
          </Button>
              </Grid>
 </Grid>           </Grid>
          </CardActions>
          </Card>

 :
        <Card className={classes.card}>


 <LinearProgress/>
 </Card>
 


}


      </Popover>
    </>
  )
}

const useStyles = makeStyles({
  tooltiproot: {
    width: 500,

  },
  root: {
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 10,
  },
  pos: {
    marginBottom: 12,
  },
  popover: {
    padding: "20px"
  },
  banclass:{
    fontSize:20
  },
  // hover: {
  //   "&:hover": {
  //     transition: "0.05s all",
  //     transform: "scale(1.01)",
  //     cursor: "pointer",
  //   }

  // },
  fieldTypography: {
    fontSize: "12px"
  }

});

interface OwnProps {
  protein: RibosomalProtein
  displayPill: boolean
}

interface StateProps {
  allFilters: FiltersReducerState
}

interface DispatchProps {
  handleFilterChange: (allFilters: FiltersReducerState, filtertype: FilterType, newavalue: number | string | number[] | string[]) => void
  addCartItem: (item: CartItem) => void
}



type RibosomalProtCardProps = DispatchProps & StateProps & OwnProps
const _RibosomalProteinCard: React.FC<RibosomalProtCardProps> = (prop) => {
  const history                     = useHistory()
  const [isFetching, setisFetching] = useState<boolean>(false);
  const downloadChain               = (pdbid: string, cid: string) => {
    var chain = cid;
    if (cid.includes(",")) {
      chain = cid.split(",")[0]
    }
    getNeo4jData("static_files", {
      endpoint: "cif_chain",
      params: { structid: pdbid, chainid: chain },

    })
      .then(
        resp => {
          setisFetching(false);
          fileDownload(resp.data, `${pdbid}_${cid}.cif`);
        },
        error => {
          alert(
            "This chain is unavailable. This is likely an issue with parsing the given struct.\nTry another struct!" + error
          );
          setisFetching(false);
        }
      );
  }
  const classes                 = useStyles();
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
    <Card className={classes.root} variant="elevation" >

      <CardContent>
        <Grid xs={12} container spacing={1}>
          <Grid
            item
            style={{ borderBottom: "1px solid gray" }}
            justify="space-between"
            container
            xs={12}
          >
            <Grid
              // className={classes.hover}
              onClick={() => {
                prop.handleFilterChange(
                  prop.allFilters as FiltersReducerState,
                  "SPECIES",
                  prop.protein.rcsb_source_organism_id
                );
              }}
              item
              container
              xs           = {6}
              alignItems   = "center"
              alignContent = "center"
              spacing={2}
              // justify="space-between"
            >




              <Grid item>
                <Typography className={classes.banclass} onClick={() => { return prop.protein.nomenclature[0] ? history.push(`/rps/${prop.protein.nomenclature[0]}`) : "" }}>
                  {prop.protein.nomenclature[0] ? prop.protein.nomenclature[0] : " "} 
                </Typography>
              </Grid>

{prop.displayPill ? 
              <Grid item >
                <ChainParentPill strand_id={prop.protein.entity_poly_strand_id} parent_id={prop.protein.parent_rcsb_id} />

              </Grid>:null
}

            </Grid>
          </Grid>
          <Grid item justify="space-between" container xs={12}></Grid>
          <Grid item justify="space-between" container xs={12}>
            <Typography className={classes.fieldTypography} variant="body2" component="p">
              {prop.protein.pfam_descriptions}
              <br /> {prop.protein.rcsb_pdbx_description}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Grid container xs={12}>
          <Grid container item xs={8}>
            <Button 
            
              style={{textTransform:"none"}}
            size="small" className={classes.fieldTypography} aria-describedby={id} onClick={handleClick}>
              Sequence ({prop.protein.entity_poly_seq_length}AAs)
            </Button>
            <Button
              style={{textTransform:"none"}}
              size="small">
              <a style={{ color: "black", textDecoration: "none" }}
                href={`https://www.uniprot.org/uniprot/${prop.protein.uniprot_accession}`}>
                Uniprot
              </a>
            </Button>
            <Button
              // className={classes.fieldTypography}
              style={{textTransform:"none"}}
              size="small"
              onClick={() =>
                downloadChain
                  (
                    prop.protein.parent_rcsb_id,
                    prop.protein.entity_poly_strand_id
                  )
              }
            >
              Download Chain
              {isFetching ? (
                <RPLoader />
              ) : (
                <img
                  style={{
                    width: "20px", height: "20px"
                  }}
                  id="download-protein"
                  src={downicon}
                  alt="download protein"
                />
              )}
            </Button>
                <Button 
                
              style={{textTransform:"none"}}
        size="small"
                onClick={() => {  history.push({pathname:`/vis`, state:{banClass:prop.protein.nomenclature[0], parent:prop.protein.parent_rcsb_id} })}}>
          Visualize
                  <VisibilityIcon />
          </Button>

          </Grid>
          <Grid container item xs={4}>
            <Button
              style={{textTransform:"none"}}
              onClick={() => {

                prop.addCartItem(prop.protein)

              }} size="small" >
              Add to Workspace
<img src={bookmark} style={{width:"30px",height:"30px"}}/>
            </Button>
          </Grid>
        </Grid>
      </CardActions>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        className={classes.popover}

        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Grid container xs={12}>
          <Typography
            style={{ width: "400px", fontSize: "14px", wordBreak: "break-word" }}
            variant="body2"
            className={classes.popover}          >
            {prop.protein.entity_poly_seq_one_letter_code}
          </Typography>


<Button 

style={{textTransform:"none"}}
onClick={()=>{


}}>

  .fasta
  <GetAppIcon/>

</Button>
        </Grid>
      </Popover>
    </Card>
  );
}


const mapstate = (appstate: AppState, ownprops: OwnProps): StateProps => ({
  allFilters: appstate.filters,
});

const mapdispatch = (dispatch: Dispatch<AppActions>, ownprops: any): DispatchProps =>
({
  handleFilterChange: (allfilters, filttype, newval) => dispatch(filterChangeActionCreator(allfilters, filttype, newval)),
  addCartItem: (item) => dispatch(cart_add_item(item))
})

const RibosomalProteinCard = connect(mapstate, mapdispatch)(_RibosomalProteinCard)

export default RibosomalProteinCard;

