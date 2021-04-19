import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import "./BanClassHero.css";
import { ERS, BanPaperEntry } from './RPsCatalogue';
import {  OverlayTrigger, Tooltip } from 'react-bootstrap';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import { truncate } from '../../Main';
import Paper from '@material-ui/core/Paper';


// const popover = (prop: ERS) => (
//   <Popover id="popover-basic">
//     <Popover.Title as="h3">Member proteins</Popover.Title>
//     <Popover.Content className='basic-content'>
//       <Grid item container xs={12} spacing={1}>


//       </Grid>
//       {prop.rps.map(rp => {
//         return(
//           <Grid item xs={12}>
          
//               <Typography variant="overline">

//           {rp.organism_desc} 

//               </Typography>
//              </Grid>
//         );
//       })}
//     </Popover.Content>
//   </Popover>
// );


const BanClassHero = ({prop, paperinfo}:{ prop: ERS, paperinfo: BanPaperEntry }) => {
 const renderTooltip = (props:any) => (
  <Tooltip className="legacy-nomenclature" {...props}>
    <table className="leg-nom-table">
      <th>Legacy Nomenclature</th>
      <tr><td>Human</td><td>{paperinfo.h? paperinfo.h : "-"}</td></tr>
      <tr>Bacteria<td>{paperinfo.b?paperinfo.b :"-"}</td></tr>
      <tr>Yeast<td>{paperinfo.y?paperinfo.y :"-"}</td></tr>
    </table>
  </Tooltip>
);



const history = useHistory();
const usePopoverStyles = makeStyles((theme: Theme) =>
  createStyles({
    typography: {
      padding: theme.spacing(2),
    },
    rowHover:{
      '&:hover':{

        background:"gray",
        cursor:"pointer"

      }
    }
  }),
)
  const classes = usePopoverStyles();
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
    <Paper style={{ marginTop: "10px" }}>

      <Grid container item xs={12} justify="space-between" alignContent="flex-end" alignItems="flex-end">

        <OverlayTrigger placement="left" overlay={renderTooltip}>
          <Grid item>
            <Button style={{ color: "blue" }} onClick={() => { history.push(`/rps/${prop.nom_class}`) }} variant='outlined'>{prop.nom_class}</Button>
          </Grid>
        </OverlayTrigger>
        <Grid item>

          <Button variant="text" size="small" onClick={handleClick}>
            Associated Structures
        </Button>
        </Grid>

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          {prop.rps.map(rp => {
            return (
              <Grid
                className={classes.rowHover}
                xs={12}
                container
                justify="space-between"
                style={{ padding: "10px" }}
                onClick={() => {
                  history.push(`structs/${rp.parent}`);
                }}
              >
                <Grid item xs={6}>
                  <Typography variant="overline">{rp.parent} </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    {truncate(rp.organism_desc, 80, 200)}
                  </Typography>
                </Grid>
              </Grid>
            );
          })}
        </Popover>
      </Grid>

    </Paper>
  );}

export default BanClassHero
