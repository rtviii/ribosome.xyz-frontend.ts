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

import { getNeo4jData } from "../../../redux/AsyncActions/getNeo4jData";
import Popover from '@material-ui/core/Popover';
import { connect } from 'react-redux';
import { FiltersReducerState } from "../../../redux/reducers/Filters/FiltersReducer";
import { filterChangeActionCreator, FilterData, FilterType } from '../../../redux/reducers/Filters/ActionTypes';
import { CartItem, cart_add_item } from '../../../redux/reducers/Cart/ActionTypes';
import { AppState } from '../../../redux/store';
import { Dispatch } from 'redux'
import { AppActions } from '../../../redux/AppActions';
import { RibosomalProtein } from '../../../redux/RibosomeTypes';

const RPLoader = () => (
  <div className="prot-loading">
    <span>Parsing file..</span>
    <img src={loading} />
  </div>
);




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
  hover: {
    "&:hover": {
      transition: "0.05s all",
      transform: "scale(1.01)",
      cursor: "pointer",
    }

  },
  fieldTypography: {
    fontSize: "12px"
  }

});

interface OwnProps {
  protein: RibosomalProtein
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

  const history = useHistory()
  const [isFetching, setisFetching] = useState<boolean>(false);
  const downloadChain = (pdbid: string, cid: string) => {

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
              className={classes.hover}
              onClick={() => {
                prop.handleFilterChange(
                  prop.allFilters as FiltersReducerState,
                  "SPECIES",
                  prop.protein.rcsb_source_organism_id
                );
              }}
              item
              xs = {6}
            >
              <Typography variant = "caption" className = {classes.fieldTypography}
              
              onClick={()=>{
                return prop.protein.nomenclature[0] ? history.push(`/rps/${prop.protein.nomenclature[0]}`) : ""
            }}
              >{prop.protein.nomenclature[0]? <b>{ prop.protein.nomenclature[0] } </b>: " " }</Typography>
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
            <Button size="small" className={classes.fieldTypography} aria-describedby={id} onClick={handleClick}>
              Seq ({prop.protein.entity_poly_seq_length}AAs)
            </Button>
            <Button
              className={classes.fieldTypography}
              size="small">
              <a style={{ color: "black", textDecoration: "none" }}
                href={`https://www.uniprot.org/uniprot/${prop.protein.uniprot_accession}`}>
                Uniprot
              </a>
            </Button>
            <Button
              className={classes.fieldTypography}
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
                
        className={classes.fieldTypography}
        size="small"
                onClick={() => {  history.push({pathname:`/vis`, state:{banClass:prop.protein.nomenclature[0], parent:prop.protein.parent_rcsb_id} })}}>
          Visualize
                  <VisibilityIcon />
          </Button>

          </Grid>
          <Grid container item xs={4}>
            <Button
              className={classes.fieldTypography}
              onClick={() => {

                prop.addCartItem(prop.protein)

              }} size="small" >
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
            style={{ width: "400px", fontSize: "14px", wordBreak: "break-word" }}
            variant="body2"
            className={classes.popover}          >
            {prop.protein.entity_poly_seq_one_letter_code}
          </Typography>
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
