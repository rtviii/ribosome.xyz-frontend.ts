// import Typography from '@material-ui/core/Typography';

import { Typography } from '@material-ui/core';
import { Grid } from '@material-ui/core'
import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';


const PageAnnotation = ({title,text}:{title:string,text:string}) => {
  const classes = makeStyles((theme: Theme) =>

  createStyles({
    root: {
        padding:20
    //   display: 'flex',
    //   '& > *': {
    //     margin: theme.spacing(1),
    //     width: theme.spacing(16),
    //     height: theme.spacing(16),
    //   },
    
    },
  }),
)()
    return (

        <Grid item container xs={12} >
        <Paper variant="outlined" square className={classes.root} >

    <Typography variant="h5">
        {title}
    </Typography>
    <Typography variant="body1">

    {text}
    </Typography>


        </Paper>

            </Grid>
            
            )
    //     <Paper>
    //         <Grid>

    //         </Grid>
            


    //     </Paper>
    // )
}

export default PageAnnotation
