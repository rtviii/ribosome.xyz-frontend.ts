import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import fileDownload from                          "js-file-download"                             ;
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import { truncate } from '../components/Main';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import { Link,useHistory} from 'react-router-dom';
import { NeoStruct } from '../redux/DataInterfaces';
import { AppState } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { CartItem, cart_add_item, cart_remove_item } from '../redux/reducers/Cart/ActionTypes';
import _ from 'lodash';
import GetAppIcon from '@material-ui/icons/GetApp';
import GetApp from '@material-ui/icons/GetApp';
import { getNeo4jData } from '../redux/AsyncActions/getNeo4jData';

const useStyles = makeStyles({  card: {
    width:300
  },
  title:{
    fontSize:14,
    height:60
  },
  heading: {
    fontSize     : 12,
    paddingTop   : 5,
  },
  annotation: {
    fontSize: 12,
  },

});






const CardBodyAnnotation =({ keyname,value }:{keyname:string, value:string|number})=>{
  const classes=useStyles()
  return   <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            component="div"
                        >
            <Typography variant="caption" color="textSecondary" component="p" 
className={classes.annotation}

            >
              {keyname}:
            </Typography>
            <Typography variant="caption" color="textPrimary" component="p" noWrap  
            className={classes.annotation}
>
              {value}
            </Typography>
</Grid>
}



export const StructHero=({d,inCart}:{ d:NeoStruct, inCart:boolean })=> {
  const classes = useStyles();
  const history = useHistory();





  const dispatch = useDispatch()




  return (
    <Card className={classes.card} >
      
      
      <CardActionArea >
        <CardContent 
        
            onClick={()=>{history.push(`/structs/${d.struct.rcsb_id}`)}}
        >
          <CardMedia
            component="img"
            alt="Ribosome Banner"
            height="150"
            image={process.env.PUBLIC_URL + `/ray_templates/_ray_${d.struct.rcsb_id.toUpperCase()}.png`}
          />
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            component="div"
            className={classes.heading}
          >
            <Typography variant="body2" color="textSecondary" component="p" >
              {d.struct.rcsb_id}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p"  >
              {d.struct.resolution} Å
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p" >
              {d.struct.citation_year}
            </Typography>
          </Grid>
          <Typography variant="body2" component="p" color="primary" className={classes.title}>
            {truncate(d.struct.citation_title,100, 100)}
          </Typography>


          <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems="flex-start"
            component="div"
          >

          <CardBodyAnnotation keyname={"Organism"} value={truncate( d.struct._organismName[0], 20,20)}/>
          <CardBodyAnnotation keyname={"Method"} value={d.struct.expMethod}/>
          <CardBodyAnnotation keyname={"Proteins"} value={d.rps.length}/>
          <CardBodyAnnotation keyname={"RNA"} value={d.rnas.length}/>
          <CardBodyAnnotation keyname={"Ligands"} value={d.ligands.length} />
          <CardBodyAnnotation keyname={"Author"} value={`${d.struct.citation_rcsb_authors[0]} et al.`} />
          </Grid>

        </CardContent>
      </CardActionArea>
{/* ----------------------------- */}
      <CardActions>
        <Button href={`https://www.rcsb.org/structure/${d.struct.rcsb_id}`} size="small" color="primary">
          PDB
        </Button>
        <Button href={`https://doi.org/${d.struct.citation_pdbx_doi}`} size="small" color="primary">
          DOI
        </Button>
        <Button href={`${d.struct.rcsb_external_ref_link}`} size="small" color="primary">
          EMDB
        </Button>
        <GetApp 
        
        
        
        onClick={()=>{

                  getNeo4jData("static_files",{endpoint:"download_structure",params:{struct_id:d.struct.rcsb_id}})
                  .then(r=>{

                    fileDownload(
                      r.data,
                      `${d.struct.rcsb_id}.cif`,
                      "chemical/x-mmcif"
                    )
                  })

                }}
        
        />

{inCart ? 

<BookmarkIcon 

style={{cursor:"pointer"}}
onClick={()=>{
    dispatch(cart_remove_item(d.struct))
}}/> :

<BookmarkBorderIcon
style={{cursor:"pointer"}}
onClick={
  ()=>{
dispatch(cart_add_item(d.struct))
  }
}
/>}
        
        
      </CardActions>
    </Card>
  );
}


export default StructHero;