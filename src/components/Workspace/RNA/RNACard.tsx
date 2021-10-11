import React, { useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { RNAProfile } from "../../../redux/DataInterfaces";
import Grid from '@material-ui/core/Grid';
import fileDownload from "js-file-download";
import {useHistory} from 'react-router-dom'

import { getNeo4jData } from "../../../redux/AsyncActions/getNeo4jData";
import Popover from '@material-ui/core/Popover';

import {ChainParentPill} from './../RibosomalProteins/RibosomalProteinCard'
import bookmark from './../../../static/bookmark_icon.svg'
import GetAppIcon from '@material-ui/icons/GetApp';
import { cart_add_item } from '../../../redux/reducers/Cart/ActionTypes';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles({
  tooltiproot: {

  },
  root: {
    width: "100%"

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

  actionButton:{
    fontSize:12,
    height:"100%",
    padding:"5px"

  },
  hover: {
    "&:hover": {
      transition: "0.05s all",
      transform: "scale(1.01)",
      cursor: "pointer",
    }

  }
});

interface OwnProps {
  e: RNAProfile,
  displayPill: boolean
}
type RNACardProps = OwnProps

export const RNACard: React.FC<RNACardProps> = (prop) => {

  const history                     = useHistory()
  const [isFetching, setisFetching] = useState<boolean>(false);

  const downloadChain = (pdbid: string, cid: string) => {


    var chain = cid;
    if (cid.includes(",")) {
      chain = cid.split(',')[0]
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
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const dispatch = useDispatch();
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Card className={classes.root} variant="elevation" elevation={2}>
      <CardContent>
        <Grid xs={12} container spacing={1}>
          <Grid
            item
            style={{ borderBottom: "1px solid gray" }}
            container
            xs           = {12}
            alignContent = "center"
            alignItems   = "center"

            spacing={2}
          >

            <Grid item >
              <Typography
                onClick={() => {
                }}
                variant="body1"
              >
                {prop.e.nomenclature.length> 0 ?
                <Typography  onClick={()=>{history.push('/rnas/')}}>{prop.e.nomenclature}</Typography>
                
                 : `Unidentified(${prop.e.description })`}
              </Typography>
            </Grid>
            {
              prop.displayPill ?
                <Grid item >
                  <ChainParentPill parent_id = {prop.e.struct as string} strand_id = {prop.e.strand as string} />
                </Grid>: ""
            }
          </Grid>
          <Grid item justify="space-between" container xs={12}>
            <Typography variant="body2" component="p">
            </Typography>
          </Grid>
        </Grid>
      </CardContent>

      <CardActions>
        <Grid container xs={12}>
          <Grid container item xs={8}spacing={1}>
            <Grid item>
            <Button 
            variant="outlined"
            className={classes.actionButton}
            size="small" style={{ textTransform: "none" }} aria-describedby={id} onClick={handleClick}>
              Sequence (<i>{(prop.e.seq as string).length} NTs</i>)
            </Button>
               </Grid>




            <Grid item>
            <Button
            variant="outlined"
              size="small"
            className={classes.actionButton}
              style={{ textTransform: "none" }}
              onClick={() =>
                downloadChain(
                  prop.e.struct as string,
                  prop.e.strand as string
                )
              }
            >
              Download Structure (.cif)

              <GetAppIcon />
            </Button>
               </Grid>

            <Grid item>

      <Button

        variant="outlined"
        className={classes.actionButton}
        style={{ textTransform: "none" }}
        onClick={() => {


        var text = `>${prop.e.struct}_${prop.e.strand}  | ${prop.e.description} | rna`
        fileDownload(text, `rRNA_${prop.e.struct}_${prop.e.strand}.fasta`)
        }}>
        Download Sequence (.fasta)
        <GetAppIcon />

      </Button>

               </Grid>

          </Grid>
          <Grid container item xs={4}>
            <Button
            className={classes.actionButton}

              onClick={() => {
                dispatch(cart_add_item(prop.e))
              }}

              size="small"

              style={{ textTransform: "none" }}
            >
              Add to Workspace
              <img src={bookmark} style={{ width: "30px", height: "30px" }} />
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
        }}>

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
