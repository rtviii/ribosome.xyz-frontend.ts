import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import {StaticFilesCatalogue} from './../../../redux/reducers/Utilities/ActionTypes'
import { AppState } from "./../../../redux/store";
import PageAnnotation from './../Display/PageAnnotation'
import { createStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { getNeo4jData } from '../../../redux/AsyncActions/getNeo4jData';
import { Ligand } from '../../../redux/RibosomeTypes';
import { truncate } from '../../Main';


const LigandCard= (props:Ligand, )=> {
  const useLigandCardStyles = makeStyles({
    root: {
      minWidth: "100%",
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      // marginBottom: 12,
    },
  });

  const classes = useLigandCardStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          {props.chemicalId}
        </Typography>
        <Typography variant="h5" component="h2">
        </Typography>

        <Typography className={classes.pos} color="textSecondary">
          {truncate(props.chemicalName, 60, 120)}
        </Typography>

        <Typography variant="body2" component="p">
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small"
        ><a href={`https://www.rcsb.org/ligand/${props.chemicalId}`}>Learn More</a></Button>
      </CardActions>
    </Card>
  );
}



interface ReduxProps {
    static_catalogue: StaticFilesCatalogue
    ligmap          : {[struct:string]:string[]}
    structmap       : {[ligandChemid:string]:string[]}
}

const Interfaces:React.FC<ReduxProps> = (prop) => {

const useSelectStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }),
);
  const classes                                 = useSelectStyles();
  const [chosenLigand, setChosenLigand]         = React.useState<string>('');
  const [chosenLigandData, setChosenLigandData] = React.useState<Ligand>({
    chemicalId      : "",
    chemicalName    : "",
    cif_residueId   : "none",
    formula_weight  : 0,
    pdbx_description: ""
  });
  const [chosenStruct, setChosenStruct]         = React.useState<string>('');

  

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setChosenLigand(event.target.value as string);
    getNeo4jData('neo4j',{endpoint:"get_all_ligands", params:null}).then(
      r=> console.log(r.data)
    )
  };

  const pageData={
    title:"Protein Classification and Localization",
    text:"nLASAFAFAFAFAFSAAAAAAAAAAA"
  }

  const ligands    = Object.keys(prop.ligmap)

  useEffect(() => {
    setChosenLigand("ERY")
  }, [prop.ligmap])


  useEffect(()=>{
        getNeo4jData("neo4j",{endpoint:"get_individual_ligand",params:{
      chemId:chosenLigand
    }}).then(
      r=>{
        
        setChosenLigandData(r.data[0])
        console.log(r.data[0]) }

      
    )
  },[chosenLigand])
  
  return (
    <Grid item container xs={12}>
      <Grid item container>
        <PageAnnotation {...pageData} />
      </Grid>
      <LigandCard {...chosenLigandData}/>

      <Grid xs={12} container item>
        <Grid item xs={12}>

          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Ligand</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={chosenLigand}
              onChange={handleChange}
            >

              {ligands.map(ligand => (
                <MenuItem value={ligand}>{ligand}</MenuItem>
              ))}
            </Select>



            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={chosenStruct}
              onChange={(e)=>{setChosenStruct(e.target.value as any)}}
            >
              {              ligands.length > 0 && chosenLigand !== "" ? prop.ligmap[chosenLigand].map(struct => (
                <MenuItem value={struct}>{struct}</MenuItem>
              )) : <MenuItem>"Choose a Ligand"</MenuItem>}
            </Select>

          </FormControl>

          <Grid item container xs={12}>
            {ligands.length > 0 && chosenLigand !== "" ? prop.ligmap[chosenLigand].map(struct => (
                  <Grid item xs={12}>

                    {/* <Typography>{struct} </Typography> */}



                  </Grid>
                ))
              : ""}
          </Grid>
        </Grid>

        {/* <Grid item xs={6}></Grid> */}
      </Grid>
    </Grid>
  );
}

const mapstate = (appstate:AppState, ownProps:any):ReduxProps => ({
    static_catalogue: appstate.utils.static_catalogue,
    ligmap          : appstate.utils.ligand_by_struct,
    structmap       : appstate.utils.struct_by_ligand
})

export default connect(mapstate,null) ( Interfaces )
