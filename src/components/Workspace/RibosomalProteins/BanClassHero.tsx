import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import "./BanClassHero.css";
import { BanPaperEntry } from './RPsCatalogue';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Paper from '@material-ui/core/Paper';
import { BanClass } from '../../../redux/RibosomeTypes';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import HelpIcon from '@material-ui/icons/Help';
import Tooltip from '@material-ui/core/Tooltip';

const BanClassHero = ({ nom_class,  unique_organisms  , comments

}:
  {
    nom_class: BanClass,  unique_organisms: number[],   comments: string[][]

  }) => {

  const pfamcomments = _.flattenDeep(comments).filter(s => s !== "NULL")



  const history = useHistory();
  const useStyles = makeStyles(() =>
    createStyles({

      root: {
      },
      tooltipwidth: {
        maxWidth: 600

      },
      paragraph: {
        fontSize: 14
      },
      classbtn: {
        fontSize: 16,
        fontWeight: 700,
      },
      headstat: {
        outline: "1px solid gray"
      },
      comments: {
        height: 100,
        width: "100%",
        padding: 10,
        fontSize: 12,
        overflowY: "auto",
        // overflow:"scroll"
      },
      rowHover: {
        '&:hover': {

          background: "gray",
          cursor: "pointer"

        }
      }
    }),
  )



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
    <Paper
      className="ban-class-hero"
    >

      <Grid container item 
      xs={12} 
      justify="space-between" 
      alignContent="flex-end" alignItems="flex-end"
      spacing={2}
      className={classes.root}
      onClick={() => { history.push(`/rps/${nom_class}`) }}
        >




        <Grid item container justify="space-between">




            <Typography
              onClick={() => { history.push(`/rps/${nom_class}`) }}
              variant="body1"
            ><b>{nom_class}</b> Ribosomal Protein Class </Typography>
        </Grid>


        <Grid item container xs={12}>

          <Grid item container justify="space-between"
                onClick={() => { history.push({ 
          pathname: '/structs',
          state:{"nomclass":nom_class}
          })}}>
            <Button
              size="small"
              variant="outlined">
              Parent Structures
          </Button>



            <Button
              onClick={() => { history.push(`/rps/${nom_class}`) }}
              size="small"
              variant="outlined">
              Export
          </Button>
            <Tooltip
              className={classes.tooltipwidth}

              title={<ul>
                <h6>PFAM Comments</h6>

                {pfamcomments.map(comm => <li>{comm}</li>)}

              </ul>}>
              <HelpIcon
                onClick={() => {
                  // console.log(pfamcomments)
                }}
                className={pfamcomments.length > 0 ? 'helpvisible' : 'helphidden'} style={{ cursor: "pointer" }} />
            </Tooltip>


          </Grid>


        </Grid>



      </Grid>

    </Paper>
  );
}

export default BanClassHero
