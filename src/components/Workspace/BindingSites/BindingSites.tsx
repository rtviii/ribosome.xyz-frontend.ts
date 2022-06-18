import React, { useEffect, useState } from 'react'
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography/Typography';
import Paper from '@material-ui/core/Paper/Paper';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { DashboardButton } from '../../../materialui/Dashboard/Dashboard';
import { Cart } from '../Cart/Cart';
import Autocomplete from '@material-ui/lab/Autocomplete/Autocomplete';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../redux/store';
import TextField from '@material-ui/core/TextField/TextField';
import { BindingSite, LigandBindingSite, LigandClass, LigandPrediction, MixedLigand, NeoStruct, Residue } from '../../../redux/DataInterfaces';
import { Button } from '@material-ui/core';
import { getNeo4jData } from '../../../redux/AsyncActions/getNeo4jData';
import fileDownload from 'js-file-download';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import createStyles from '@material-ui/core/styles/createStyles';
import Highlighter from "react-highlight-words";
import { ChainParentPill } from '../RibosomalProteins/RibosomalProteinCard';
import { useHistory } from 'react-router-dom';
import * as action from './../../../redux/reducers/BindingSites/ActionTypes'
import _ from 'lodash';
// import { useToasts } from 'react-toast-notifications';
import { loadingIndicatorCSS } from 'react-select/src/components/indicators';
import { Protein } from '../../../redux/RibosomeTypes';

// @ts-ignore
const viewerInstance = new PDBeMolstarPlugin() as any;



// Tinge of blue for origin #aad5ff
// Tinge of green for prediction #fff8bd

const ChainAlignmentBlock = ({ src_struct, tgt_struct, nomenclature, tgt_aln, src_aln, aln_ids, tgt_strand, src_strand }: { src_struct: string, tgt_struct: string, nomenclature: string, tgt_strand: string, src_strand: string, tgt_aln: string, src_aln: string, aln_ids: number[] }) => {
	const history = useHistory();
	return <Paper
		variant='outlined'
		style={{ padding: "10px", marginBottom: "20px" }}>
		<Grid container xs={12} spacing={2}>
			<Grid item xs={12} direction="row">
				<Grid item xs={12} style={{ padding: "10px" }}>
					<Typography variant="h4" style={{ cursor: "pointer", color: "blue", maxWidth: "400px" }} onClick={() => { history.push(`/rps/${nomenclature}`) }}>
						{nomenclature}
					</Typography>
				</Grid>

				<div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start" }}>
					<div style={{ width: "200px", outline: "1px color black" }} >
						<ChainParentPill parent_id={src_struct} strand_id={src_strand} />
					</div>

					<pre>
						<Highlighter

							findChunks={() => {
								var c = []
								for (var id of aln_ids) {
									c.push({ start: id, end: id + 1 })
								}
								return c
							}}
							searchWords={[
							]}
							autoEscape={true}
							textToHighlight={src_aln}
						/>
					</pre>
				</div>
			</Grid>



			<Grid item xs={12}>
				<div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start" }}>

					<div style={{ width: "200px", outline: "1px color black" }} >
						<ChainParentPill parent_id={tgt_struct} strand_id={tgt_strand} />
					</div>

					<pre>

						<Highlighter
							findChunks={() => {
								var c = []
								for (var id of aln_ids) { c.push({ start: id, end: id + 1 }) }
								return c
							}}
							searchWords={[
							]}
							autoEscape={true}
							textToHighlight={tgt_aln}
						/>
					</pre>

				</div>
			</Grid>
		</Grid>

	</Paper>

}

const Dialogue = ({ open, handleclose, handleopen, aln_obj, title, src_struct, tgt_struct }: { src_struct: string, tgt_struct: string, open: boolean, handleopen: () => void, handleclose: () => void, aln_obj: LigandPrediction | null, title: string }) => {

	const [fullWidth, setFullWidth] = React.useState(true);
	const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('xl');

	return (
		<React.Fragment>
			<Dialog
				fullWidth={fullWidth}
				maxWidth={maxWidth}
				open={open}
				onClose={handleclose}
				aria-labelledby="max-width-dialog-title"
			>
				<DialogTitle id="max-width-dialog-title">{title}</DialogTitle>
				<DialogTitle id="max-width-dialog-title">

					<span>

						Calculated binding site residues are highlighted in orange.

					</span>
				</DialogTitle>
				<DialogContent>
					{aln_obj === null ? '' :
						<div id="root-msa" style={{ height: "80vh", width: "max-content" }}>
							{
								Object.entries(aln_obj).map(chain => {
									return <ChainAlignmentBlock src_struct = {src_struct}
									       tgt_struct                      = {tgt_struct}
									       nomenclature                    = {chain[0]}
									       src_strand                      = {chain[1].source.auth_asym_id}
									       tgt_strand                      = {chain[1].target.auth_asym_id}
									       aln_ids                         = {chain[1].alignment.aln_ids}
									       src_aln                         = {chain[1].alignment.src_aln}
									       tgt_aln                         = {chain[1].alignment.tgt_aln} />
								})
							}
						</div>
					}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleclose} color="primary">
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
}

const BindingSites = () => {

	const classes = makeStyles((theme: Theme) => ({
		autocomplete: {
			width: "100%",
			marginBottom: "10px"
		},
		pageDescription: {
			padding: "20px",
			width: "100%",
			height: "min-content"
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
			color: "black"
		},
		formControl: {
			width: "40%",
		},
		selectEmpty: {
			marginTop: theme.spacing(2),
		},
		bspaper: {
			padding: "10px"
		},
		bsHeader: {
			padding: "10px",

		}
	}))();

	const dispatch = useDispatch();

	const current_binding_site : BindingSite | null      = useSelector ((state: AppState) => state.binding_sites.current_binding_site )
	const cur_ligclass              : LigandClass | null = useSelector ((state: AppState) => state.binding_sites.current_ligand_class       )
	const cur_tgt              : NeoStruct   | null      = useSelector ((state: AppState) => state.binding_sites.current_target       )

	const [cur_auth_asym_id, set_cur_auth_asym_id]       = useState<string|null>(null)


	const  bsites                                             = useSelector                ((state: AppState) => state.binding_sites.bsites           )
	const antibiotics = useSelector                ((state: AppState) => state.binding_sites.antibiotics   )
	const factors     = useSelector                ((state: AppState) => state.binding_sites.factors   )
	const mrna        = useSelector                ((state: AppState) => state.binding_sites.mrna   )
	const trna        = useSelector                ((state: AppState) => state.binding_sites.trna   )
	// const mixed       = useSelector                ((state: AppState) => state.binding_sites.mixed_ligands   )

	const [bsites_derived      , set_derived_bsites ]         = useState    <BindingSite[]>(                                                          )
	useEffect(() => {set_derived_bsites(bsites)}, [bsites])
	const [derived_antibiotics , set_derived_antibiotics ] = useState <LigandClass[]>([] )
	useEffect(() => {set_derived_antibiotics(antibiotics)}, [antibiotics])
	const [derived_factors     , set_derived_factors     ] = useState <LigandClass[]>([] )
	useEffect(() => {
		
		set_derived_factors(factors)}, [factors])
	const [derived_mrna       , set_derived_mrna       ]   = useState <LigandClass[]>([] )
	useEffect(() => {set_derived_mrna(mrna)}, [mrna])
	const [derived_trna       , set_derived_trna      ]    = useState <LigandClass[]>([] )
	useEffect(() => {set_derived_trna(trna)}, [trna])


	const  interface_data                                     = useSelector                ((state: AppState) => state.binding_sites.binding_site_data)
	const  prediction_data                                    = useSelector                ((state: AppState) => state.binding_sites.prediction_data  )


	useEffect(() => {
		console.log("Got interface data:",interface_data)
	}, [interface_data])

	const cur_vis_tab    = useSelector((state: AppState) => state.binding_sites.visualization_tab)
	const target_structs = useSelector((state: AppState) => state.structures.neo_response)


	useEffect(() => {
		var options = {
			moleculeId: 'Element to visualize can be selected above.',
			hideControls: true,
			layoutIsExpanded: false,
		}
		var viewerContainer = document.getElementById('molstar-viewer');
		viewerInstance.render(viewerContainer, options);
	}, [])

	useEffect(() => {
		console.log("Current prediction changed" , prediction_data);
		
	}, [prediction_data])


	const color_prediction = () => {
		if (prediction_data == null) {
			return
		}
		console.log("Got new prediction:", prediction_data);
		interface MolStarResidue            { 
			entity_id                ? : string,
			 auth_asym_id              ?: string,
			 struct_asym_id            ?: string,
			 residue_number            ?: number,
			 start_residue_number      ?: number,
			 end_residue_number        ?: number,
			 auth_residue_number       ?: number,
			 auth_ins_code_id          ?: string,
			 start_auth_residue_number ?: number,
			 start_auth_ins_code_id   ? : string,
			 end_auth_residue_number  ? : number,
			 end_auth_ins_code_id     ? : string,
			 atoms                    ? : string[],
			 label_comp_id            ? : string,
			 color                      : { 
					r : number ,
					g : number ,
					b : number 
				},
			 focus                    ? : boolean,
			 sideChain                ? : boolean 
			}

		var prediction_vis_data: MolStarResidue[] = []

		for (var chain of Object.values(prediction_data)) {
			for (var i of chain.target.tgt_ids) {
				if (i > 0) {
					prediction_vis_data.push({
						residue_number: i,
						focus: false,
						color: { r: 1, g: 200, b: 200 },
						auth_asym_id: chain.target.auth_asym_id
					})
				}
			}
		}
		if (prediction_vis_data.length > 300) {
			if (window.confirm("This ligand binds to more than 300 residues. Your browser might take some time to visualize it.")) {
			}
			else {
				return
			}
		}


		var by_chain:Record<string, MolStarResidue[]> ={}
		for (var u of prediction_vis_data){
			if (Object.keys(by_chain).includes(u.auth_asym_id as string)){
				by_chain[u.auth_asym_id as string] = [...by_chain[u.auth_asym_id as string], u]
			}
			else{
				by_chain[u.auth_asym_id as string] = [u]
			}
			
		}

		for (var chain_ress of Object.values(by_chain)){
			viewerInstance.visual.select(
				{ data            : chain_ress,
				nonSelectedColor: { r: 240, g: 240, b: 240 }, }
			)

		}

		// viewerInstance.visual.select(
		// 	{
		// 		data: prediction_vis_data,
		// 		nonSelectedColor: { r: 240, g: 240, b: 240 }
		// }
		// )
	}

	const highlightInterface = (source_auth_asym_id:string|null) => {
		console.log("Called highlihgt iface.");
		

		if (interface_data === null || interface_data === undefined) {
			alert("Select a binding site.")
			return
		}

		interface MolStarResidue            { 
			           entity_id                ?  : string,
			           auth_asym_id              ? : string,
			           struct_asym_id            ? : string,
			           residue_number            ? : number,
			           start_residue_number      ? : number,
			           end_residue_number        ? : number,
			           auth_residue_number       ? : number,
			           auth_ins_code_id          ? : string,
			           start_auth_residue_number?  : number,
			           start_auth_ins_code_id    ? : string,
			           end_auth_residue_number   ? : number,
			           end_auth_ins_code_id      ? : string,
			           atoms                     ? : string[],
			           label_comp_id             ? : string,
			           color                       : { r: number, g: number,b: number },
			           focus                     ? : boolean,
			           sideChain                 ? : boolean 
				}

		var vis_data: MolStarResidue[] = []
		for (var chain of Object.values(interface_data)) {
			var reduced = chain.residues.reduce((x: MolStarResidue[], y: Residue) => {
				if (y.residue_id > 0) {
					x.push({
						// @ts-ignore
						// entity_id     : current_binding_site?.rcsb_id.toLowerCase(),
						auth_asym_id  : y.parent_auth_asym_id,
						sideChain     : false,
						residue_number: y.residue_id,
						color         : { r: 1, g: 200, b: 200 },
						focus         : false,

					})
				}
				return x

			}, [])
			vis_data = [...vis_data, ...reduced]
		}


		console.log("Painting visdata", vis_data);
		if (vis_data.length > 300) {
			if (window.confirm("This ligand binds to more than 300 residues. Your browser might take some time to visualize it.")) {
			}
			else {
				return
			}
		}

		var by_chain:Record<string, MolStarResidue[]> ={}
		for (var u of vis_data){
			if (Object.keys(by_chain).includes(u.auth_asym_id as string)){
				by_chain[u.auth_asym_id as string] = [...by_chain[u.auth_asym_id as string], u]
			}
			else{
				by_chain[u.auth_asym_id as string] = [u]
			}
		}
		
		viewerInstance.visual.select({ data: [{auth_asym_id: source_auth_asym_id, color:{r: 255, g:100, b:0}, focus:true}], nonSelectedColor: {r:255,g:255,b:255} })

		for (var chain_ress of Object.values(by_chain)){
			viewerInstance.visual.select(
				{ data            : chain_ress,
				nonSelectedColor: { r: 240, g: 240, b: 240 }, }
			)
		}
	}


	const updateBindingSiteData = (current_bs: BindingSite, curligand: LigandClass) => {
		
		if(curligand[getdesc(curligand)][0].polymer){
				console.log("Dispatching:");
				console.log(current_bs.auth_asym_id ,curligand[getdesc(curligand)][0].polymer  , current_bs.rcsb_id)
			dispatch(action.request_LigandBindingSite( current_bs.auth_asym_id as string ,curligand[getdesc(curligand)][0].polymer  , current_bs.rcsb_id))
		}else{
			dispatch(action.request_LigandBindingSite( curligand[getdesc(curligand)][0].chemicalId as string ,curligand[getdesc(curligand)][0].polymer, current_bs.rcsb_id))
		}
	}


	var comparefn = (a:LigandClass,b:LigandClass) => {
			var akey= Object.keys(a)[0];
			var bkey= Object.keys(b)[0];

			if(akey.toLowerCase() > bkey.toLowerCase()){
				return  1
			}

			if(akey.toLowerCase() < bkey.toLowerCase()){
				return  -1
			}
			else 
			{return 0}
	} 


	const currentBindingSiteChange = (event: React.ChangeEvent<{ value: unknown }>, newvalue: BindingSite) => {
		if (newvalue === null) {
			dispatch(action.current_struct_change(null))
				set_cur_auth_asym_id(null)
		} else {
			if (newvalue.auth_asym_id !== undefined){
				set_cur_auth_asym_id(newvalue.auth_asym_id)
			}
			dispatch(action.current_struct_change(newvalue))
		}
	}
	const currentLigandClassChange = (event: React.ChangeEvent<{ value: unknown }>, newvalue: LigandClass) => {
		
		console.log(cur_ligclass === newvalue);
		
		if (newvalue === null) {
			dispatch(action.current_ligand_change(null))
		}
		else {
			dispatch(action.current_ligand_change(newvalue))
		}
	}
	const currentTargetChange = (event: React.ChangeEvent<{ value: unknown }>, newvalue: NeoStruct) => {
		if (newvalue === null) {
			dispatch(action.current_target_change(null))
			dispatch(action._partial_state_change({ visualization_tab: 'origin' }))
		}
		else {
			dispatch(action.current_target_change(newvalue))
		}
	}



	useEffect(() => {
		if (cur_ligclass === null) {
			set_derived_bsites(bsites)
			dispatch(action._partial_state_change({ 'binding_site_data': null }))

		} else {

			set_derived_bsites(bsites.filter(bs=> cur_ligclass[getdesc(cur_ligclass)].map(f=>f.description).includes(bs.description)))
			if (current_binding_site !== null){
				updateBindingSiteData(current_binding_site as BindingSite, cur_ligclass)
			}
		}
	}, [cur_ligclass])

	useEffect(() => {

		console.log("Current binding site changed to " ,current_binding_site);
		
		if (current_binding_site === null) {
				set_derived_antibiotics(antibiotics)
				set_derived_factors(factors)
				set_derived_mrna(mrna)
				set_derived_trna(trna)
		} else {
			if (cur_ligclass === null) {
				set_derived_antibiotics(
					antibiotics
						.filter((ligclass: LigandClass) => { return ligclass[getdesc(ligclass)].map((mixedLig: MixedLigand) => mixedLig.present_in.rcsb_id).includes(current_binding_site.rcsb_id) })
				)
				set_derived_factors(factors
					.filter((ligclass: LigandClass) => { return ligclass[getdesc(ligclass)].map((mixedLig: MixedLigand) => mixedLig.present_in.rcsb_id).includes(current_binding_site.rcsb_id) })
				)
				set_derived_mrna(mrna
					.filter((ligclass: LigandClass) => { return ligclass[getdesc(ligclass)].map((mixedLig: MixedLigand) => mixedLig.present_in.rcsb_id).includes(current_binding_site.rcsb_id) })
				)
				set_derived_trna(trna
					.filter((ligclass: LigandClass) => { return ligclass[getdesc(ligclass)].map((mixedLig: MixedLigand) => mixedLig.present_in.rcsb_id).includes(current_binding_site.rcsb_id) })
				)

			}
			else {
				updateBindingSiteData(current_binding_site, cur_ligclass)
			}

			if (cur_vis_tab === 'origin') {

				// addToast(`Structure ${current_binding_site?.rcsb_id} is being loaded.`,

				// 	{
				// 		appearance: 'info',
				// 		autoDismiss: true,
				// 	})

				viewerInstance.visual.update({
					moleculeId: current_binding_site?.rcsb_id.toLowerCase()
				});
			}

		}
	}, [current_binding_site])

	useEffect(() => {
		if (cur_tgt !== null) {
			console.log("this fired");
			
			if (cur_ligclass !== null ){
					console.log("Pre dispatch: " );
					console.log(current_binding_site );
					console.log(cur_ligclass[getdesc(cur_ligclass)][0].polymer );
				if (cur_ligclass[getdesc(cur_ligclass)][0].polymer === true){

					
					dispatch(action.request_Prediction(
							true,
							current_binding_site?.auth_asym_id as string,
							current_binding_site?.rcsb_id as string,
							cur_tgt.struct.rcsb_id
						))
				}
				else {
					dispatch(action.request_Prediction(
							false,
							cur_ligclass[getdesc(cur_ligclass)][0].chemicalId as string,
							current_binding_site!.rcsb_id as string,
							cur_tgt!.struct.rcsb_id,
						))

				}
			}

				if (cur_vis_tab==='prediction'){
					viewerInstance.visual.update({
						moleculeId: cur_tgt?.struct.rcsb_id.toLowerCase()
					});
				}

		} else {
			dispatch(action._partial_state_change({ 'prediction_data': null }))
		}
	}, [cur_tgt])

	useEffect(() => {

		if (cur_tgt != null && cur_vis_tab === 'prediction') {

						// 		addToast(`Switched into PREDICTION view.`,
						// 							{
						// 	appearance: 'warning',
						// 	autoDismiss: true,
						// })

			viewerInstance.visual.update({
				moleculeId: cur_tgt?.struct.rcsb_id.toLowerCase()
			});
						// 		addToast(`Structure ${cur_tgt?.struct.rcsb_id} is being loaded.`,
						// 							{
						// 	appearance: 'info',
						// 	autoDismiss: true,
						// })

		}

		if (current_binding_site != null && cur_vis_tab === 'origin') {

						// 		addToast(`Switched into ORIGINAL STRUCTURE view.`,
						// 							{
						// 	appearance: 'warning',
						// 	autoDismiss: true,
						// })
						// 		addToast(`Structure ${current_binding_site?.rcsb_id} is being loaded.`,
						// 							{
						// 	appearance: 'info',
						// 	autoDismiss: true,
						// })
			viewerInstance.visual.update({
				moleculeId: current_binding_site?.rcsb_id.toLowerCase()
			});
		}
	}, [cur_vis_tab])

	const [msaOpen, setMsaOpen] = useState<boolean>(false)
	const handleopen = () => { setMsaOpen(true) }
	const handleclose = () => { setMsaOpen(false) }

	// const { addToast } = 								useToasts();


	const generatePredictionCSV = () => {
		if (prediction_data === null || _.isEqual(prediction_data, {})) {
			alert("Prediction is empty. Either not chosen by user or no chains with overlapping nomenclature found for target and source structures. ")
			return
		}
		else {

			// prediction_data



		}
	}


	const getdesc = (l:LigandClass):string => Object.keys(l)[0]

	const MixedLigandComparison = (a:LigandClass,b:LigandClass)=>{
							

						
							if (a !== null && b !== null){
								var ac = Object.keys(a)[0]
								var bc = Object.keys(b)[0]

								if (ac==='Antibiotics'){
									return -1
								}
								else if (ac==='Factors' && bc ==='E/T/I Factors'){
									return -1
								}
								else if (ac==='E/T/I Factors' && bc ==='Mixed Ligands'){
									return -1
								}
								else return 1
							
							}
							else return 1
					

						}

	return (
		<Grid container xs={12} spacing={1} style={{ outline: "1px solid gray", height: "100vh" }} alignContent="flex-start">
			<Paper variant="outlined" className={classes.pageDescription}>
				<Typography variant="h4">
					Ligands/Binding Sites
				</Typography>
			</Paper>
			<Grid item direction="column" xs={2} spacing={2} style={{ padding: "10px" }}>
				<Typography className={classes.bsHeader} variant="h5">Original Structure</Typography>

				<Autocomplete
					value     = {current_binding_site}
					className = {classes.autocomplete}
					options   = {bsites_derived ===undefined ? [] : bsites_derived}
					getOptionLabel={(bs: BindingSite) =>  bs.rcsb_id + "  " +  bs.description + " " }
					// @ts-ignore
					groupBy={(option:BindingSite) => `Structure ${option.rcsb_id}`}
					// @ts-ignore
					onChange={currentBindingSiteChange}
					renderOption={(option:BindingSite) => (<>
				
					<div style={{ fontSize: "10px", width: "100%",zIndex:2000 }}><b>{option.description} {current_binding_site?.auth_asym_id ? current_binding_site.auth_asym_id : null}</b></div>
					</>)}
					renderInput={(params) => <TextField {...params} label={`Binding Sites ( ${bsites_derived !== undefined ? bsites_derived.length : "0"} )`} variant="outlined" />}
				/>

				<Autocomplete
					value={cur_ligclass}
					className={classes.autocomplete}
					options={
						[  ...derived_antibiotics,...derived_factors, ...derived_mrna, ...derived_trna]
						=== undefined ? [] :
						  [  ...derived_antibiotics,...derived_factors, ...derived_mrna, ...derived_trna].sort(MixedLigandComparison)
						}
					getOptionLabel={(lc: LigandClass) => Object.keys(lc)[0]}
					// @ts-ignore


					groupBy={(option) => {
						if(trna.includes(option)){
							return "tRNA"
						}
						if(mrna.includes(option)){
							return "mRNA"
						}
						if(antibiotics.includes(option)){
							return "Antibiotics"
						}
						if(derived_factors.includes(option)){
							return "E/T/I Factors"
						}
					}}

					onChange={(e:any,v:any)=>currentLigandClassChange(e,v)}
					renderOption={(option) => {
							return<div style={{ fontSize: "10px", width: "400px" }}><b>{option.description}</b> {option.chemicalId} {getdesc(option)}  </div> 
						}
					}
					renderInput={(params) => <TextField {...params} label={
						`Ligands  (${[  ...derived_antibiotics,...derived_factors, ...derived_mrna, ...derived_trna] !== undefined ? [  ...derived_antibiotics,...derived_factors, ...derived_mrna, ...derived_trna].length : "0"})`
						} variant="outlined" />} />

				<Grid item style={{ marginBottom: "10px" }}>
					<Button
						fullWidth
						variant={"outlined"}
						style={[current_binding_site, cur_ligclass].includes(null) ? { color: "gray", textTransform:"none" } : {textTransform:"none"}}
						onClick={() => {
							highlightInterface(cur_auth_asym_id as string)

						}}>
						Visualize Binding Site
					</Button>
				</Grid>

				<Grid item style={{ marginBottom: "10px" }} id='csv_download_container'>



					<CSVLink
						data={[]}
						onClick={() => {
							if (interface_data == null) {

								return false;
							}
						}}
					>

						<Button

							fullWidth
							variant="outlined"
							style    = {{textTransform:"none"}}
							color={[current_binding_site, cur_ligclass].includes(null) ? 'primary' : 'default'}
							disabled={interface_data == null}>
							Download Binding Site 
						</Button>

					</CSVLink>


				</Grid>
				<Typography className={classes.bsHeader} variant="h5">Prediction</Typography>
				<Autocomplete
					value={cur_tgt}
					className={classes.autocomplete}
					options={target_structs}
					getOptionLabel={(parent: NeoStruct) => { return parent.struct ? parent.struct.rcsb_id + " : " + parent.struct.citation_title : "" }}

						style={{textTransform:"none"}}
					// @ts-ignore
					onChange={currentTargetChange}
					renderOption={(option) => (<div style={{ fontSize: "10px", width: "400px" }}><b>{option.struct.rcsb_id}</b> {option.struct.citation_title} </div>)}
					renderInput={(params) => <TextField {...params}
						label={`Prediction Target ( ${target_structs !== undefined ? target_structs.length : "0"} )`} variant="outlined" />} />
				<Grid item style={{ marginBottom: "10px" }}>
					<Button
						disabled={[cur_ligclass, current_binding_site].includes(null)}
						onClick={() => {
							// 
							// alert("Implement this")
							color_prediction()

						}}
						style={{textTransform:"none"}}
						fullWidth
						variant="outlined"> Visualize Prediction</Button>
				</Grid>
				<Grid item style={{ marginBottom: "10px" }}>
					<Button
						color="primary"
						onClick={() => {
							setMsaOpen(true)
						}}
						style={{textTransform:"none"}}
						fullWidth
						disabled={prediction_data === null}
						variant="outlined"> Inspect Prediction </Button>

				</Grid>
				<Grid item style={{ marginBottom: "10px" }}>
					<CSVLink
						data={[]}
						onClick={() => {
							if (prediction_data === null || _.isEqual(prediction_data, {})) {
								return false;
							}
						}}>
						<Button
							color="primary"
						style={{textTransform:"none"}}
							fullWidth
							disabled={prediction_data === null}
							variant="outlined"> Download Prediction (.csv) </Button>

					</CSVLink>
				</Grid>
				<Grid item style={{ marginBottom: "10px" }}>
					<Button color="primary"
						style={{textTransform:"none"}}
						onClick={() => {
							dispatch(action.current_struct_change(null))
							dispatch(action.current_ligand_change(null))
							dispatch(action.current_target_change(null))
							viewerInstance.visual.reset({ camera: true, theme: true })
						}}
						fullWidth
						variant="outlined"> Reset</Button>
				</Grid>
				<Grid item style={{ marginBottom: "10px" }}>

					<Dialogue
						src_struct ={                         current_binding_site     ?.rcsb_id as string                                                                                }
						tgt_struct ={                         cur_tgt        ?.struct.rcsb_id as string                                                                         }
						title      ={`Predicted Residues of ${cur_ligclass?.description} from structure ${current_binding_site?.rcsb_id} in structure ${cur_tgt?.struct.rcsb_id}`}
						open       ={                         msaOpen                                                                                                           }
						handleclose={                         handleclose                                                                                                       }
						handleopen ={                         handleopen                                                                                                        }
						aln_obj    ={                         prediction_data                                                                                                   } />

				</Grid>
				<Grid item xs={4} justify={"center"} >
					<DashboardButton />
				</Grid>
			</Grid>
			<Grid item container spacing={2} direction="row" xs={10} style={{ height: "100%" }} alignContent="flex-start">
				<Grid item container xs={12} spacing={2} alignContent="flex-start" alignItems="flex-start" justify="flex-start" >


					<Grid item>
						<Button
							variant="outlined"
							style={
								cur_vis_tab === 'origin' ? {
									transition: "all 0.2s ease-in-out",
									boxShadow: "0 2px 4px #8ac5ff",
									textTransform:"none"
								} : {
									textTransform:"none"
								}
							}
							color={cur_vis_tab === 'origin' ? 'primary' : "default"}
							onClick={() => {
								dispatch(
									action._partial_state_change({
										visualization_tab: 'origin'
									}))
							}
							} >
							Original Structure {current_binding_site === null ? "" : `(${current_binding_site.rcsb_id})`}
						</Button >
					</Grid>

					<Grid item>

						<Button


							style={
								cur_vis_tab === 'prediction' ? {
									transition: "all 0.2s ease-in-out",
									boxShadow: "0 2px 4px #8ac5ff",
									textTransform:"none"
								} : {
									textTransform:"none"
								}
							}


							variant="outlined"
							disabled={cur_tgt === null}
							color={cur_vis_tab === 'prediction' ? 'primary' : "default"}
							onClick={() => {

								dispatch(action._partial_state_change({
									visualization_tab: 'prediction'
								}))


													

							}
							} > Prediction
							{cur_tgt === null ? "" : `(${cur_tgt.struct.rcsb_id})`}
						</Button >
					</Grid>
				</Grid>
				<Grid item xs={12} >
					<Paper variant="outlined" style={{ position: "relative", padding: "10px", height: "80vh" }} >
						<div style={{ position: "relative", width: "100%", height: "100%" }} id="molstar-viewer"></div>
					</Paper>
				</Grid >
			</Grid>
		</Grid>
	)
}

export default BindingSites
