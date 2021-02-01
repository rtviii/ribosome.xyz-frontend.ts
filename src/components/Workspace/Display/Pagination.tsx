import React, { useEffect, useState  } from "react";
import { createStyles, makeStyles } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";



const PaginationRounded=({gotopage, pagecount}:{
  gotopage : (pid:number)=>void;
  pagecount: number
})=> {
const usePaginationStyles = makeStyles((theme) =>
  createStyles({
    root: {
      '& > *': {
        marginTop: theme.spacing(2),
      },
    },
  }),
);
  const classes = usePaginationStyles();
  return (
    <div className={classes.root}>
      <Pagination count={pagecount} onChange={(_,page)=>{ 
        gotopage(page)
        }} variant="outlined" shape="rounded" />
    </div>
  );
}



export default PaginationRounded;