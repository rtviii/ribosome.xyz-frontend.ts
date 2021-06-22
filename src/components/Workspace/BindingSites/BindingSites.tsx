import React, { useEffect, useState } from 'react'
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography/Typography';
import Paper from '@material-ui/core/Paper/Paper';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';
import { DashboardButton } from '../../../materialui/Dashboard/Dashboard';
import { Cart } from '../Cart/Cart';
import Autocomplete from '@material-ui/lab/Autocomplete/Autocomplete';
import { useSelector } from 'react-redux';
import { AppState } from '../../../redux/store';
import TextField from '@material-ui/core/TextField/TextField';
import Select from '@material-ui/core/Select/Select';
import FormControl from '@material-ui/core/FormControl/FormControl';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import { BindingSite } from '../../../redux/DataInterfaces';
import LigandCatalogue from '../Ligand/LigandCatalogue';
import { LigandHeroCard, StructHeroCard } from '../StructurePage/StructurePage';

const BindingSites = () => {


	const classes = makeStyles((theme: Theme) => ({
		autocomplete: {
			width: "100%",
			marginBottom:"10px"
		},
		pageDescription: {
			padding: "20px",
			width  : "100%",
			height : "min-content"
		},
		card: {
			width: "100%"
		},
		title: {
			fontSize: 14,
			height: 300
		},
		heading: {
			fontSize: 12,
			paddingTop: 5,
		},
		annotation: { fontSize: 12, },
		authors: {
			transition: "0.1s all",
			"&:hover": {
				background: "rgba(149,149,149,1)",
				cursor: "pointer",
			},
		},
		nested: {
			paddingLeft: 20,
			color      : "black"
		},
		formControl: {
			width:"40%",
			// marginBottom:"10px"
			// margin  : theme.spacing(1),
			// minWidth: 120,
		},
		selectEmpty: {
			marginTop: theme.spacing(2),
		},
		bspaper:{
			padding:"10px"
		},
		bsHeader:{
			padding:"10px",

		}
	}))();

 const structs = useSelector(( state:AppState ) => state.binding_sites.bsites.map(bs=>( { 
  title: bs.citation_title, rcsb_id:bs.rcsb_id } )))

  const bsites                                   = useSelector((state:AppState) => state.binding_sites.bsites)
  const [ filtered_ligs,setFilteredLigs ]        = useState<BindingSite[]>(bsites)
  const [ filtered_structs, setFilteredStructs ] = useState<BindingSite[]>([])

  useEffect(() => {
	  console.log("bsites",bsites);
	  setFilteredLigs(bsites)
  }, [bsites])

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>, newvalue:any) => {
	  console.log(newvalue);
	  
            if (newvalue === null){
              return 
            }
  };
	return (
    <Grid container xs={12} spacing={1} style={{outline:"1px solid gray", height:"100vh"}} alignContent="flex-start">

      <Grid item  xs={12} style={{ padding: "10px"}}>
        <Paper variant="outlined" className={classes.pageDescription}>
          <Typography paragraph >
            <Typography variant="h4">
              Ligand Binding Sites
          </Typography>
		  Multiple classes of ligands, antibiotics and smaller molecules are bound to ribosomal structures represetned in RCSB.
		Select a ligand and a structure of origin to project this binding site onto another structure in the database.
          </Typography>
        </Paper>
      </Grid>



      <Grid item  direction="column" xs={2} style={{ padding: "5px" }}>
        <List>


        <ListItem>
          <Cart />
        </ListItem>

        <ListItem>
          <DashboardButton />
        </ListItem>



        </List>
      </Grid>

    <Grid item container direction="row" xs={10} style={{ height: "100%" }}>

<Grid item xs={5}>
	<Paper variant="outlined" className={classes.bspaper}>

		<Typography className={classes.bsHeader} variant="h5">Select Origin Binding Site</Typography>

		<FormControl className={classes.formControl}>
          <Autocomplete
          className={classes.autocomplete}
          // size           = "small"
          options        = {structs}
          getOptionLabel = {(parent) =>   parent.rcsb_id + " : "+ parent.title}

          // @ts-ignore
          onChange     = {handleChange}
          renderOption = {(option) => (<div style={{fontSize:"10px", width:"400px"}}><b>{option.rcsb_id}</b> {option.title}  </div>)}
          renderInput  = {(params) => <TextField {...params}  label={ `Structures ( ${structs.length} )` } variant="outlined" />}
          />

          <Autocomplete

          className      = {classes.autocomplete}
          options        = {filtered_ligs}
          getOptionLabel = {(lig) =>   lig.chemicalId + " : "+ lig.chemicalName}

          // @ts-ignore
          onChange     = {handleChange}
          renderOption = {(option) => (<div style={{fontSize:"10px", width:"400px"}}><b>{option.chemicalId}</b> ({option.chemicalName} in <i>{option.citation_title}</i> ) </div>)}
          renderInput  = {(params) => <TextField {...params}  label={ `Ligands (${structs.length})` } variant="outlined" />}
          />

      </FormControl>
						{bsites.length > 0 ? <LigandHeroCard
							lig={{
								chemicalId: bsites[0].chemicalId,
								chemicalName: bsites[0].chemicalName,
								formula_weight: bsites[0].formula_weight,
								pdbx_description: bsites[0].pdbx_description
							}} /> : null}

{true ?<StructHeroCard   rcsb_id={"3j9m"}/>	 : null}
	</Paper>



</Grid >


      <Grid item style={{ width: "100%", height: "100%" }}>
		  <br/>
		  <br/>
		  <br/>
        <div style={{
          width: "100%",
          height: "100%"
        }}
          id="molstar-viewer">
			  
			  Molstar     Viewer     </div             >
      </Grid>
      </Grid>





		</Grid>
	)
}

export default BindingSites
