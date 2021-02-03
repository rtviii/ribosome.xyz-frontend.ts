import React, { useState } from 'react';import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { NeoHomolog } from "../../../redux/DataInterfaces";
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import downicon from "./../../../static/download.png"
import fileDownload from "js-file-download";
import loading from "./../../../static/loading.gif";
import {useHistory} from 'react-router-dom'

import { getNeo4jData } from "../../../redux/AsyncActions/getNeo4jData";
import Popover from '@material-ui/core/Popover';
import { connect } from 'react-redux';
import {  mapDispatchFilter, mapStateFilter, handleFilterChange, FiltersReducerState } from "../../../redux/reducers/Filters/FiltersReducer";
import {  FilterData  } from '../../../redux/reducers/Filters/ActionTypes';

const RPLoader = () => (
  <div className="prot-loading">
    <span>Parsing file..</span>
    <img src={loading} />
  </div>
);


const SimplePopover=() =>{
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
    <div>
      <Button aria-describedby={id} variant="contained" color="primary" onClick={handleClick}>
        Open Popover
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Typography >The content of the Popover.</Typography>
      </Popover>
    </div>
  );
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
  popover:{
    padding:"20px"
  },
  hover:{
      "&:hover": {
        transition: "0.05s all",
        transform: "scale(1.01)",
        cursor: "pointer",
      }
  
  }
});

interface OwnProps{
e:NeoHomolog
}
type RibosomalProtCardProps = handleFilterChange & FilterData & OwnProps
export const _RibosomalProteinCard:React.FC<RibosomalProtCardProps> = (prop) => {
  const history   = useHistory()
  const [isFetching, setisFetching] = useState<boolean>(false);

  const downloadChain = (pdbid:string, cid:string)=>{

    getNeo4jData("static_files", {

      endpoint  :  "cif_chain",
      params    :  { structid: pdbid, chainid: cid },

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
  const classes = useStyles();
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
        <Grid xs={12} container spacing={1}>
          <Grid
            item
            style={{ borderBottom: "1px solid gray" }}
            justify="space-between"
            container
            xs={12}
          >
            <Grid item xs={4}>
              <Tooltip
                title={
                  <Typography>
                    Structure {prop.e.parent}:
                    <br />
                    {prop.e.title}
                  </Typography>
                }
                placement="top-end"
              >
                <Typography
                  className={classes.hover}
                  onClick={() => {
                    history.push(`/structs/${prop.e.parent}`);
                  }}
                  variant="body1"
                >
                  {prop.e.parent}.{prop.e.protein.entity_poly_strand_id}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid
              className={classes.hover}
              onClick={() => {
                prop.handleChange(
                  prop.allFilters as FiltersReducerState,
                  prop.e.orgid
                );
              }}
              item
              xs={6}
            >
              <Typography variant="caption">{prop.e.orgname[0]}</Typography>
            </Grid>
          </Grid>
          <Grid item justify="space-between" container xs={12}></Grid>
          <Grid item justify="space-between" container xs={12}>
            <Typography variant="body2" component="p">
              {prop.e.protein.pfam_descriptions}
              <br /> {prop.e.protein.rcsb_pdbx_description}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>

      <CardActions>
        <Grid container xs={12}>
<Grid container item xs={8}>
            <Button size="small" aria-describedby={id} onClick={handleClick}>
              Seq ({prop.e.protein.entity_poly_seq_length}AAs)
            </Button>
            <Button
              size="small"
              // onClic
              // href={`https://www.uniprot.org/uniprot/${prop.e.protein.uniprot_accession}`}
            >
              <a style={{color:"black", textDecoration:"none"}}
   href={ `https://www.uniprot.org/uniprot/${prop.e.protein.uniprot_accession}` }>
              Uniprot
              </a>
            </Button>
            <Button
              size="small"
              onClick={() =>
                downloadChain(
                  prop.e.parent,
                  prop.e.protein.entity_poly_strand_id
                )
              }
            >
              Download Chain
              {isFetching ? (
                <RPLoader />
              ) : (
                <img
                  id="download-protein"
                  src={downicon}
                  alt="download protein"
                />
              )}
            </Button>

</Grid>
<Grid container item xs={4}>
            <Button  onClick={()=>{
            }}size="small" disabled={true}>
              Add to Workspace
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
        {/* <Typography ></Typography> */}
        <Grid container xs={12}>
          <Typography
            style={{ width: "400px", wordBreak: "break-word" }}
            variant="body2"
            className={classes.popover}
          >
            {prop.e.protein.entity_poly_seq_one_letter_code}
          </Typography>
        </Grid>
      </Popover>
    </Card>
  );
}

export default connect (mapStateFilter("SPECIES"), mapDispatchFilter("SPECIES")) (_RibosomalProteinCard);
