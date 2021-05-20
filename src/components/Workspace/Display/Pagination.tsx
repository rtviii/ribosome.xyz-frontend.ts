import React, { useEffect, useState  } from "react";
import { createStyles, makeStyles } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";



const PaginationRounded=({gotopage, pagecount}:{
  gotopage : (pid:number)=>void;
  pagecount: number
})=> {
  return (
      <Pagination count={pagecount} onChange={(_,page)=>{ gotopage(page)}} variant="outlined" shape="rounded" />
  );
}



export default PaginationRounded;