import React, { useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { NeoHomolog, RNAProfile } from "../../../redux/DataInterfaces";
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import fileDownload from "js-file-download";
import {useHistory} from 'react-router-dom'

import { getNeo4jData } from "../../../redux/AsyncActions/getNeo4jData";
import Popover from '@material-ui/core/Popover';
import { connect } from 'react-redux';
import {  mapDispatchFilter, mapStateFilter, handleFilterChange, FiltersReducerState } from "../../../redux/reducers/Filters/FiltersReducer";
import {  FilterData  } from '../../../redux/reducers/Filters/ActionTypes';

const useStyles = makeStyles({
  tooltiproot: {
    // width: 500,

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

interface OwnProps{e:RNAProfile}
type RNACardProps = handleFilterChange & FilterData & OwnProps

const RNACard:React.FC<RNACardProps> = (prop) => {

  const history                     = useHistory()
  const [isFetching, setisFetching] = useState<boolean>(false);

  const downloadChain = (pdbid:string, cid:string)=>{

    
      var chain = cid;
      if (cid.includes(",")){
        chain = cid.split(',')[0]
      }
    getNeo4jData("static_files", {
      endpoint  :  "cif_chain",
      params    :  { structid: pdbid, chainid: chain },})
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
                   <b> {prop.e.struct}</b>:
                    <br />
                    {prop.e.description}
                  </Typography>
                }
                placement="top-end"
              >
                <Typography
                  className={classes.hover}
                  onClick={() => {
                    history.push(`/structs/${prop.e.struct}`);
                  }}
                  variant="body1"
                >
                {prop.e.description}
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
              {/* <Typography variant="caption">{prop.e.orgid[0]}</Typography> */}
              <Typography variant="caption">
                  {prop.e.struct}.{prop.e.strand}
                
                
                </Typography>
            </Grid>
          </Grid>
          <Grid item justify="space-between" container xs={12}>
            <Typography variant="body2" component="p">
            </Typography>
          </Grid>
        </Grid>
      </CardContent>

      <CardActions>
        <Grid container xs={12}>
<Grid container item xs={8}>
            <Button size="small" style={{textTransform:"none"}}aria-describedby={id} onClick={handleClick}>
              Seq ({prop.e.seq.length}NTs)
            </Button>
            <Button
              size="small"
              onClick={() =>
                downloadChain(
                  prop.e.struct,
                  prop.e.strand
                )
              }
            >
              Download Chain
                <img
                  id="download-protein"
                  src={process.env.PUBLIC_URL + `/public/icons/download.png`}
                  alt=""
                />
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
        <Grid container xs={12}>
          <Typography
            style={{ width: "400px", wordBreak: "break-word" }}
            variant="body2"
            className={classes.popover}
          >
            {prop.e.seq}
          </Typography>
        </Grid>
      </Popover>
    </Card>
  );
}

export default connect (mapStateFilter("SPECIES"), mapDispatchFilter("SPECIES")) (RNACard);
