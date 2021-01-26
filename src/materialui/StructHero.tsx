import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import hero from './../static/sample-hero.png'
import { Grid, TextareaAutosize } from '@material-ui/core';
import { NeoStruct } from '../redux/reducers/Data/StructuresReducer/StructuresReducer';
import { truncate } from '../components/Main';
import { Link,useHistory} from 'react-router-dom';

const useStyles = makeStyles({
  card: {
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



const StructHero=(d:NeoStruct)=> {
  const classes = useStyles();

  const history = useHistory();
  return (
    <Card className={classes.card} >
      
      <CardActionArea onClick={()=>history.push(`/structs/${d.struct.rcsb_id}`)}>
        <CardContent >
          <CardMedia
            component="img"
            alt="Ribosome Banner"
            height="150"
            image={`ray_templates/_ray_${d.struct.rcsb_id.toUpperCase()}.png`}
            title="Ribosome Banner"
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
            {d.struct.citation_title}
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
      </CardActions>
    </Card>
  );
}


export default StructHero;