import { Typography } from '@material-ui/core';
import { Grid } from '@material-ui/core'
import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';


const PageAnnotation = ({ title, text }: { title: string; text: string }) => {
  const classes = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        padding: 20,
      },
    })
  )();
  return (
    <Grid item container xs={12}>
      <Paper variant="outlined" square className={classes.root}>
        <Typography variant="h5">{title}</Typography>
        <Typography variant="body1">{text}</Typography>
      </Paper>
    </Grid>
  );
};

export default PageAnnotation
