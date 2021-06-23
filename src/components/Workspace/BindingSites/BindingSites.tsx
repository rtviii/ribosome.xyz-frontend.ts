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
import { BindingSite, LigandClass } from '../../../redux/DataInterfaces';
import LigandCatalogue from '../Ligand/LigandCatalogue';
import { LigandHeroCard, StructHeroCard } from '../StructurePage/StructurePage';
import { Button } from '@material-ui/core';
import { CodeTwoTone } from '@material-ui/icons';
import ReactDOM from 'react-dom';





// @ts-ignore
const viewerInstance = new PDBeMolstarPlugin() as any;

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



  const [cur_struct, set_cur_struct]                    = useState<BindingSite| null>(null)
  const [curligand, set_cur_ligand]                     = useState<LigandClass | null>(null)

  const bsites                                          = useSelector((state:AppState) => state.binding_sites.bsites)
  const lig_classes                                     = useSelector((state:AppState) => state.binding_sites.ligand_classes)

  const [ bsites_derived, set_bsites_derived ]          = useState<BindingSite[]>()
  const [ lig_classes_derived, set_ligclasses_derived ] = useState<LigandClass[]>()



  useEffect(() => {
	  if (curligand === null){
			set_bsites_derived(bsites)
	  }else{
		  set_bsites_derived(bsites.filter(bs=>bs.chemicalId === curligand.ligand.chemicalId))
	  }
  }, [curligand])

  useEffect(() => {
	  if (cur_struct === null){
			set_ligclasses_derived(lig_classes)
	  }else{
		  set_ligclasses_derived(lig_classes.filter(lc=>{ return lc.presentIn.filter(str=>str.rcsb_id === cur_struct.rcsb_id).length > 0}))
	  }
  }, [cur_struct])

  useEffect(() => {
	  set_ligclasses_derived(lig_classes)
  }, [lig_classes])

  useEffect(() => {
	  set_bsites_derived(bsites)
  }, [bsites])

  const handleStructChange = (event: React.ChangeEvent<{ value: unknown }>, newvalue:any) => {
	  console.log("struct",newvalue);

            if (newvalue === null){
				set_cur_struct(null)
            }else{

				set_cur_struct(newvalue)
			}
  }

  const handleLigChange = (event: React.ChangeEvent<{ value: unknown }>, newvalue:any) => {
            if (newvalue === null){
				set_cur_ligand(null)
            }
			else{
				set_cur_ligand(newvalue)
			}
  }

  useEffect(() => {

    var options = {
      moleculeId  : 'Element to visualize can be selected above.',
      hideControls: true,
		layoutIsExpanded: false,
    }
    var viewerContainer = document.getElementById('molstar-viewer');
    viewerInstance.render(viewerContainer, options);
  }, [])

  const [originStructTab, setOriginStructTab] = useState<'profile' | 'visual' | 'interface' >('profile')
	return (
		<Grid container xs={12} spacing={1} style={{ outline: "1px solid gray", height: "100vh" }} alignContent="flex-start">

			<Grid item xs={12} style={{ padding: "10px" }}>
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

			<Grid item direction="column" xs={2} style={{ padding: "5px" }}>
				<List>


					<ListItem>
						<Cart />
					</ListItem>

					<ListItem>
						<DashboardButton />
					</ListItem>



				</List>
			</Grid>

			<Grid item container spacing={2} direction="row" xs={10} style={{ height: "100%" }}>
				<Grid item xs={5} >
					<Paper variant="outlined" className={classes.bspaper}>
						<Typography className={classes.bsHeader} variant="h5">Select Origin Binding Site</Typography>
						<Autocomplete
							className={classes.autocomplete}
							// size  sit         = "small"
							options={bsites_derived as any}
							getOptionLabel={(parent:BindingSite) => parent.rcsb_id + " : " + parent.citation_title}
							// @ts-ignore
							onChange={handleStructChange}
							renderOption={(option) => (<div style={{ fontSize: "10px", width: "400px" }}><b>{option.rcsb_id}</b> {option.citation_title}  </div>)}
							renderInput={(params) => <TextField {...params} label={`Structure ( ${bsites_derived!=undefined ? bsites_derived.length :"0"} )`} variant="outlined" />}
						/>

						<Autocomplete

							className={classes.autocomplete}
							options={lig_classes_derived as LigandClass[]}
							getOptionLabel={(lc:LigandClass) => lc.ligand.chemicalId + " : " + lc.ligand.chemicalName}

							// @ts-ignore
							onChange={handleLigChange}
							renderOption={(option) => (<div style={{ fontSize: "10px", width: "400px" }}><b>{option.ligand.chemicalId}</b> ({option.ligand.chemicalName}) </div>)}
							renderInput={(params) => <TextField {...params} label={`Ligand Class (${lig_classes_derived != undefined ? lig_classes_derived.length: "0"})`} variant="outlined" />}
						/>
						<Button color="primary" fullWidth variant="outlined"> Reset</Button>

						<Grid item xs={12}>

							<Typography variant="overline"> Ligand</Typography>

							{bsites.length > 0 ? <LigandHeroCard
								lig={{
									chemicalId: bsites[0].chemicalId,
									chemicalName: bsites[0].chemicalName,
									formula_weight: bsites[0].formula_weight,
									pdbx_description: bsites[0].pdbx_description
								}} /> : null}
						</Grid>

						<Grid item xs={12}>

							<Grid item xs={12}>
								<Typography variant="overline"                                                                                                               > Structure of Origin</Typography>
								<Button variant="outlined" color={originStructTab == 'profile' ? 'primary' : "default"} onClick={() => { setOriginStructTab('profile') }}     > Profile            </Button    >
								<Button variant="outlined" color={originStructTab == 'visual' ? 'primary' : "default"} onClick={() => { setOriginStructTab('visual') }}       > Visual             </Button    >
								<Button variant="outlined" color={originStructTab == 'interface' ? 'primary' : "default"} onClick={() => { setOriginStructTab('interface') }} > Binding   Interface</Button    >
							</Grid>



									 <Grid item style={{ width: "100%", height: "100%", display: originStructTab ==='profile' ? "inline" :"none"}}>
										<StructHeroCard rcsb_id={"3j9m"} />
									</Grid>

									
									 <Grid item style={{ width: "100%", height: "100%", display: originStructTab ==='visual' ? "inline" :"none"}}>
										<div id="molstar-viewer"></div>
									</Grid>

									<div>interface</div>
									
						</Grid>
					</Paper>
				</Grid >
				<Grid item xs={5} >
					<Paper variant="outlined" style={{outline:"1px solid gray",height:"100%"}}>
					</Paper>
				</Grid >


			</Grid>





		</Grid>
	)
}

export default BindingSites
