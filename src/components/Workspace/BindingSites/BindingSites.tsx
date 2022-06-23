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
import { log } from 'console';

// @ts-ignore
const viewerInstance = new PDBeMolstarPlugin() as any;


interface MolStarResidue {
	entity_id?: string,
	auth_asym_id?: string,
	struct_asym_id?: string,
	residue_number?: number,
	start_residue_number?: number,
	end_residue_number?: number,
	auth_residue_number?: number,
	auth_ins_code_id?: string,
	start_auth_residue_number?: number,
	start_auth_ins_code_id?: string,
	end_auth_residue_number?: number,
	end_auth_ins_code_id?: string,
	atoms?: string[],
	label_comp_id?: string,
	color: {
		r: number,
		g: number,
		b: number
	},
	focus?: boolean,
	sideChain?: boolean
}

// Tinge of blue for origin #aad5ff
// Tinge of green for prediction #fff8bd


const __VIEWER_RESET = () => {
	viewerInstance.visual.reset({ camera: true, theme: true })
	viewerInstance.visual.update({ moleculeId: 'none' })
}


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
									return <ChainAlignmentBlock src_struct={src_struct}
										tgt_struct={tgt_struct}
										nomenclature={chain[0]}
										src_strand={chain[1].source.auth_asym_id}
										tgt_strand={chain[1].target.auth_asym_id}
										aln_ids={chain[1].alignment.aln_ids}
										src_aln={chain[1].alignment.src_aln}
										tgt_aln={chain[1].alignment.tgt_aln} />
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

	// Mounting the viewer
	useEffect(() => {
		var options = {
			moleculeId: 'Element to visualize can be selected above.',
			hideControls: true,
			layoutIsExpanded: false,
		}
		var viewerContainer = document.getElementById('molstar-viewer');
		viewerInstance.render(viewerContainer, options);
	}, [])

	const current_binding_site: BindingSite | null = useSelector((state: AppState) => state.binding_sites.current_binding_site)
	const cur_ligclass: LigandClass | null         = useSelector((state: AppState) => state.binding_sites.current_ligand_class)
	const cur_tgt: NeoStruct | null                = useSelector((state: AppState) => state.binding_sites.current_target)

	// const [cur_auth_asym_id, set_cur_auth_asym_id] = useState<string | null>(null)

	const bsites              = useSelector((state: AppState) => state.binding_sites.bsites)
	const antibiotics         = useSelector((state: AppState) => state.binding_sites.antibiotics)
	const factors             = useSelector((state: AppState) => state.binding_sites.factors)
	const mrna                = useSelector((state: AppState) => state.binding_sites.mrna)
	const trna                = useSelector((state: AppState) => state.binding_sites.trna)
	const other_uncategorized = useSelector((state: AppState) => state.binding_sites.other_uncategorized)
	// const mixed       = useSelector                ((state: AppState) => state.binding_sites.mixed_ligands   )

	const [bsites_derived, set_derived_bsites] = useState<BindingSite[]>()
	useEffect(() => { set_derived_bsites(bsites) }, [bsites])

	const [derived_antibiotics, set_derived_antibiotics] = useState<LigandClass[]>([])
	useEffect(() => { set_derived_antibiotics(antibiotics) }, [antibiotics])

	const [derived_factors, set_derived_factors] = useState<LigandClass[]>([])
	useEffect(() => { set_derived_factors(factors) }, [factors])

	const [derived_mrna, set_derived_mrna] = useState<LigandClass[]>([])
	useEffect(() => { set_derived_mrna(mrna) }, [mrna])

	const [derived_trna, set_derived_trna] = useState<LigandClass[]>([])
	useEffect(() => { set_derived_trna(trna) }, [trna])

	const [derived_uncategorized, set_derived_uncategorized] = useState<LigandClass[]>([])
	useEffect(() => { set_derived_uncategorized(other_uncategorized) }, [other_uncategorized])

	const interface_data = useSelector((state: AppState) => state.binding_sites.binding_site_data)
	const prediction_data = useSelector((state: AppState) => state.binding_sites.prediction_data)

	const cur_vis_tab = useSelector((state: AppState) => state.binding_sites.visualization_tab)
	const target_structs = useSelector((state: AppState) => state.structures.neo_response)





	// ※ ------------------------------------------- Ligand/Bsite state machine------------------------------------------------------------


	//** "Ligands" are either ligands(chemicalId is set) or polymers (if they are polymers, then the auth_asym_id is set)
	//** "Binding sites" are a container around the presentIn  object identifying a single structure (in which this molecule is present) 
	//** ex.

	// 	{
	// "polymer": false,
	// "chemicalId": "NAD",
	// "description": "NICOTINAMIDE-ADENINE-DINUCLEOTIDE",
	// "presentIn": {
	// 	"citation_title": "Distinct pre-initiation steps in human mitochondrial translation.",
	// 	"rcsb_id": "6RW4",
	// 	"src_organism_ids": [
	// 	9606
	// 	],
	// 	"description": "NICOTINAMIDE-ADENINE-DINUCLEOTIDE",
	// 	"resolution": 2.97,
	// 	"expMethod": "ELECTRON MICROSCOPY"
	// }
	// }




	const getdesc = (l: LigandClass): string => Object.keys(l)[0]

	// This functions updates the binding site data (i.e. the neighborhood/interface)
	// it is responsible for making requests to the backend via request_LigandBindingSite

	const updateBindingSiteData = (current_bs: BindingSite, mixedligand: MixedLigand) => {
		if (mixedligand.polymer) {
			
			dispatch(action.request_LigandBindingSite(mixedligand.present_in.auth_asym_id as string, mixedligand.polymer, current_bs.rcsb_id))
		} else {
			dispatch(action.request_LigandBindingSite(mixedligand.chemicalId as string, mixedligand.polymer, current_bs.rcsb_id))
		}

	}

	const currentBindingSiteChange = (event: React.ChangeEvent<{ value: unknown }>, newvalue: BindingSite) => {
		if (newvalue === null) {
			dispatch(action.current_struct_change(null))
			// set_cur_auth_asym_id(null)
			__VIEWER_RESET()
		} else {

			dispatch(action.current_struct_change(newvalue))
		}
	}

	const currentLigandClassChange = (event: React.ChangeEvent<{ value: unknown }>, newvalue: LigandClass) => {


		if (newvalue === null) {
			dispatch(action.current_ligand_change(null))
		}
		else {
			dispatch(action.current_ligand_change(newvalue))
		}
	}

	useEffect(() => {
		// On ligand class update:
		
		if (cur_ligclass === null) {
			// if ligclass is null, set all binding sites to original(defilter)
			set_derived_bsites(bsites)
			// ?CLEANUP
			
		} else {
			// if its not null, filter binding sites on whether the description matches that of the just-chosen ligand class
			set_derived_bsites(bsites.filter(( bs:BindingSite ) => { 
				return cur_ligclass[getdesc(cur_ligclass)].map((mixed_ligand:MixedLigand) => mixed_ligand.description).includes(bs.description) 
			}))

			if (current_binding_site !== null) {
				let curligand_with_auth_id = cur_ligclass[getdesc(cur_ligclass)].filter((ml:MixedLigand)=>{return ml.present_in.rcsb_id === current_binding_site.rcsb_id})[0]
				updateBindingSiteData(current_binding_site as BindingSite, curligand_with_auth_id)
			}
		}
		dispatch(action._partial_state_change({ 'binding_site_data': null }))
		dispatch(action.current_target_change(null))

	}, [cur_ligclass])

	useEffect(() => {
		if (current_binding_site === null) {
			set_derived_antibiotics(antibiotics)
			set_derived_factors(factors)
			set_derived_mrna(mrna)
			set_derived_trna(trna)
			set_derived_uncategorized(other_uncategorized)
		} else {

			// if the current binding site changes while the ligclass is null, we filter liglike categories by "presentIn" on that binding site's rcsb_id
			if (cur_ligclass === null) {
				// 
				set_derived_antibiotics(antibiotics.filter((ligclass: LigandClass) => { 
						

						
						return ligclass[getdesc(ligclass)].map((mixedLig: MixedLigand) => mixedLig.present_in.rcsb_id).includes(current_binding_site.rcsb_id) 
					
					}))
				set_derived_factors(factors.filter((ligclass: LigandClass) => { 

					return ligclass[getdesc(ligclass)].map((mixedLig: MixedLigand) => mixedLig.present_in.rcsb_id).includes(current_binding_site.rcsb_id) }))
				set_derived_mrna(mrna.filter((ligclass: LigandClass) => { return ligclass[getdesc(ligclass)].map((mixedLig: MixedLigand) => mixedLig.present_in.rcsb_id).includes(current_binding_site.rcsb_id) }))
				set_derived_trna(trna.filter((ligclass: LigandClass) => { return ligclass[getdesc(ligclass)].map((mixedLig: MixedLigand) => mixedLig.present_in.rcsb_id).includes(current_binding_site.rcsb_id) }))
				set_derived_uncategorized(other_uncategorized.filter((ligclass: LigandClass) => { return ligclass[getdesc(ligclass)].map((mixedLig: MixedLigand) => mixedLig.present_in.rcsb_id).includes(current_binding_site.rcsb_id) }))

			}

			else {

				let curligand_with_auth_id = cur_ligclass[getdesc(cur_ligclass)].filter((ml:MixedLigand)=>{return ml.present_in.rcsb_id === current_binding_site.rcsb_id})[0]
				updateBindingSiteData(current_binding_site, curligand_with_auth_id)
			}

			if (cur_vis_tab === 'origin') {
				viewerInstance.visual.update({
					assemblyId: '1',
					moleculeId: current_binding_site?.rcsb_id.toLowerCase()
				});
			}

		}

		dispatch(action._partial_state_change({ 'binding_site_data': null }))
		dispatch(action.current_target_change(null))
	}, [current_binding_site])

	// ※ ------------------------------------------- Ligand/Bsite state machine------------------------------------------------------------








	// On target change
	const currentTargetChange = (event: React.ChangeEvent<{ value: unknown }>, newvalue: NeoStruct) => {
		if (newvalue === null) {
			dispatch(action.current_target_change(null))
			dispatch(action._partial_state_change({ visualization_tab: 'origin' }))
		}
		else {
			dispatch(action.current_target_change(newvalue))
		}
	}
	// ------------ Tabs state ------------
	useEffect(() => {
		if (cur_tgt !== null) {
			if (cur_ligclass !== null) {
				if (cur_ligclass[getdesc(cur_ligclass)][0].polymer === true) {
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

			if (cur_vis_tab === 'prediction') {
				viewerInstance.visual.update({
					assemblyId: '1',
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
				assemblyId: '1',
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
				assemblyId: '1',
				moleculeId: current_binding_site?.rcsb_id.toLowerCase()
			});
		}
	}, [cur_vis_tab])

	// ------------ + ------------------------------------------------------------

	// msa state
	const [msaOpen, setMsaOpen] = useState<boolean>(false)
	const handleopen = () => { setMsaOpen(true) }
	const handleclose = () => { setMsaOpen(false) }


	// paint the prediction data to molstar viewer
	const color_prediction = () => {
		if (prediction_data == null) {
			return
		}

		var prediction_vis_data: MolStarResidue[] = []
		for (var chain of Object.values(prediction_data)) {
			for (var i of chain.target.tgt_ids) {
				if (i > 0) {
					prediction_vis_data.push({
						residue_number: i,
						focus: true,
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


		var by_chain: Record<string, MolStarResidue[]> = {}
		for (var u of prediction_vis_data) {
			if (Object.keys(by_chain).includes(u.auth_asym_id as string)) {
				by_chain[u.auth_asym_id as string] = [...by_chain[u.auth_asym_id as string], u]
			}
			else {
				by_chain[u.auth_asym_id as string] = [u]
			}

		}

		for (var chain_ress of Object.values(by_chain)) {
			viewerInstance.visual.select(
				{
					data: chain_ress,
					// focus           : true,
					nonSelectedColor: { r: 240, g: 240, b: 240 },
				}
			)

		}

	}

	const highlightInterface = () => {


		if (interface_data === null || interface_data === undefined) {
			alert("Select a binding site or a ligand class.")
			return
		}

		var vis_data: MolStarResidue[] = []


		console.log("Coloring data:", interface_data);
		

		for (var chain of Object.values(interface_data)) {
			var reduced = chain.residues.reduce((x: MolStarResidue[], y: Residue) => {
				if (y.residue_id > 0) {
					x.push({
						// @ts-ignore
						// entity_id     : current_binding_site?.rcsb_id.toLowerCase(),
						assmeblyId    : '1',
						auth_asym_id  : y.parent_auth_asym_id,
						// sideChain     : false,
						auth_residue_number: y.residue_id,
						color         : { r: 1, g: 200, b: 200 },
						// focus         : false,
					})
				}
				return x

			}, [])
			vis_data = [...vis_data, ...reduced]
		}

		console.log("Create vis_Data", vis_data);
		

		viewerInstance.visual.select({
			data: vis_data, 
					nonSelectedColor: { r: 255, g: 255, b: 255 }
		})
		
		if (vis_data.length > 300) {
			if (window.confirm("This ligand binds to more than 300 residues. Your browser might take some time to visualize it.")) {
			}
			else {
				return
			}
		}

		// var by_chain: Record<string, MolStarResidue[]> = {}
		// for (var u of vis_data) {
		// 	if (Object.keys(by_chain).includes(u.auth_asym_id as string)) {
		// 		by_chain[u.auth_asym_id as string] = [...by_chain[u.auth_asym_id as string], u]
		// 	}
		// 	else {
		// 		by_chain[u.auth_asym_id as string] = [u]
		// 	}
		// }

		// viewerInstance.visual.select({
		// 	data: [{
		// 		auth_asym_id: source_auth_asym_id,
		// 		color: { r: 255, g: 100, b: 0 },
		// 		focus: true
		// 	}], nonSelectedColor: { r: 255, g: 255, b: 255 }
		// })

		// for (var chain_ress of Object.values(by_chain)) {
		// 	viewerInstance.visual.select(
		// 		{
		// 			data: chain_ress,
		// 			nonSelectedColor: { r: 240, g: 240, b: 240 },
		// 		}
		// 	)
		// }
	}

	// No polymers in common between the binding site and the target structure
	useEffect(() => {
		if (prediction_data !== null && Object.keys(prediction_data).length === 0) {
			// make this an "Until removed" toast.
			alert(`Could not find matching classes of polymers in target structure (${cur_tgt?.struct.rcsb_id}) for this binding site. Would you mind trying another target?`)
		}
	}, [prediction_data])


	const MixedLigandComparison = (a: LigandClass, b: LigandClass) => {

		if (a !== null && b !== null) {
			var ac = Object.keys(a)[0]
			var bc = Object.keys(b)[0]

			if (ac === 'Antibiotics') {
				return -1
			}
			else if (ac === 'Factors' && bc === 'E/T/I Factors') {
				return -1
			}
			else if (ac === 'E/T/I Factors' && bc === 'Mixed Ligands') {
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
					value={current_binding_site}
					className={classes.autocomplete}
					options={bsites_derived === undefined ? [] : bsites_derived}
					getOptionLabel={(bs: BindingSite) => bs.rcsb_id}
					// @ts-ignore
					groupBy={(option: BindingSite) => `Structure ${option.rcsb_id}`}
					// @ts-ignore
					onChange={currentBindingSiteChange}
					renderOption={(option: BindingSite) => (<>

						<div style={{ fontSize: "10px", width: "100%", zIndex: 2000 }}><b>{option.description} {current_binding_site?.auth_asym_id ? current_binding_site.auth_asym_id : null}</b></div>
					</>)}
					renderInput={(params) =>
						<TextField {...params}
							label={(() => {

								if (current_binding_site !== null && cur_ligclass !== null) {
									return "Binding Site in Structure"
								}
								var parens = ""
								if (bsites_derived !== undefined) {

									parens = cur_ligclass === null ? `${bsites_derived.length}` : `${bsites_derived.length} for ${Object.keys(cur_ligclass)[0]}`
								} else {
									parens = "0"
								}
								return `Binding Sites (${parens})`

							})()} variant="outlined" />}

				/>

				<Autocomplete
					value={cur_ligclass}
					className={classes.autocomplete}
					options={
						[...derived_antibiotics, ...derived_factors, ...derived_mrna, ...derived_trna, ...derived_uncategorized] === undefined ?
							[] :
							[...derived_antibiotics, ...derived_factors, ...derived_mrna, ...derived_trna, ...derived_uncategorized].sort(MixedLigandComparison)
					}
					getOptionLabel={(lc: LigandClass) => Object.keys(lc)[0]}
					// @ts-ignore


					groupBy={(option) => {
						if (trna.includes(option)) {
							return "tRNA"
						}
						else if (mrna.includes(option)) {
							return "mRNA"
						}
						else if (antibiotics.includes(option)) {
							return "Antibiotics"
						}
						else if (derived_factors.includes(option)) {
							return "E/T/I Factors"
						}else{
							return "Other"
						}
					}}

					onChange={(e: any, v: any) => currentLigandClassChange(e, v)}
					renderOption={(option) => {
						return <div style={{ fontSize: "10px", width: "400px" }}><b>{option.description}</b> {option.chemicalId} {getdesc(option)}  </div>
					}
					}
					renderInput={(params) => <TextField {...params} label={

						(() => {


							if (current_binding_site !== null && cur_ligclass !== null) {
								return "Ligand"
							}


							let parens = ""
							if ([...derived_antibiotics, ...derived_factors, ...derived_mrna, ...derived_trna, ...derived_uncategorized] !== undefined) {
								parens = `${current_binding_site === null ? [...derived_antibiotics, ...derived_factors, ...derived_mrna, ...derived_trna, ...derived_uncategorized].length : `${[...derived_antibiotics, ...derived_factors, ...derived_mrna, ...derived_trna, ...derived_uncategorized].length} in ${current_binding_site.rcsb_id}`}`

							} else {

								parens = "0"
							}
							return `Ligands (${parens})`
						})()



					} variant="outlined" />} />

				<Grid item style={{ marginBottom: "10px" }}>
					<Button
						fullWidth
						variant={"outlined"}
						style={[current_binding_site, cur_ligclass].includes(null) ? { color: "gray", textTransform: "none" } : { textTransform: "none" }}
						onClick={() => {
							highlightInterface()

						}}>
						Visualize Binding Site
					</Button>
				</Grid>

				<Grid item style={{ marginBottom: "10px" }} id='csv_download_container'>



					<CSVLink
						aria-disabled={interface_data === null || cur_ligclass === null || current_binding_site === null}
						target="_blank"
						filename={cur_ligclass === null ? `bsite_${current_binding_site?.rcsb_id}.csv` : `bsite_${current_binding_site?.rcsb_id}_${Object.keys(cur_ligclass)[0]}.csv`}
						data={(() => {
							if (interface_data === null) {
								return []
							} else {
								return [
									["chain", "polymer_nomenclature", "auth_asym_id", "residue_ids", "sequence"]
									,
									...Object.entries(interface_data).map((kv) => {
										let chainname = kv[0]
										let chaindata = kv[1]
										return [chainname, chaindata.nomenclature, chaindata.asym_ids, chaindata.residues.map(r => r.residue_id).join(','), chaindata.sequence]
									})
								]
							}
						})()}
						onClick={() => { if (interface_data == null) { return false; } }}>

						<Button

							fullWidth
							variant="outlined"
							style={{ textTransform: "none" }}
							color={[current_binding_site, cur_ligclass].includes(null) ? 'primary' : 'default'}
							disabled={interface_data === null || cur_ligclass === null || current_binding_site === null}>
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

					style={{ textTransform: "none" }}
					// @ts-ignore
					onChange={currentTargetChange}
					renderOption={(option) => (<div style={{ fontSize: "10px", width: "400px" }}><b>{option.struct.rcsb_id}</b> {option.struct.citation_title} </div>)}
					renderInput={(params) => <TextField {...params}
						label={`Prediction Target ( ${target_structs !== undefined ? target_structs.length : "0"} )`} variant="outlined" />} />
				<Grid item style={{ marginBottom: "10px" }}>
					<Button
						disabled={[cur_tgt, cur_ligclass, current_binding_site].includes(null) || (prediction_data !== null && Object.keys(prediction_data).length === 0)}
						onClick={() => {
							color_prediction()
						}}
						style={{ textTransform: "none" }}
						fullWidth
						variant="outlined"> Visualize Prediction</Button>
				</Grid>
				<Grid item style={{ marginBottom: "10px" }}>
					<Button
						color="primary"
						onClick={() => { setMsaOpen(true) }}
						style={{ textTransform: "none" }}
						fullWidth
						disabled={prediction_data === null || (prediction_data !== null && Object.keys(prediction_data).length === 0)}
						variant="outlined"> Inspect Prediction </Button>

				</Grid>
				<Grid item style={{ marginBottom: "10px" }}>
					<CSVLink

						aria-disabled={prediction_data === null || (prediction_data !== null && Object.keys(prediction_data).length === 0)}

						target="_blank"
						filename={cur_ligclass === null || cur_tgt === null || current_binding_site === null ? `ligand_prediction.csv` : `prediction_${Object.keys(cur_ligclass)[0]}_from_${current_binding_site.rcsb_id}_to_${cur_tgt.struct.rcsb_id}.csv`}
						data={(() => {
							if (prediction_data === null || (prediction_data !== null && Object.keys(prediction_data).length === 0)) {
								return []
							} else {

								let total: any = []
								Object.entries(prediction_data).map((kv) => {
									let poly_class = kv[0]
									let poly_data = kv[1]
									total.push([poly_class])
									total.push(["-"])
									total.push(["source_polymer_sequence", "source_auth_asym_id", "source_residue_ids"])
									total.push([poly_data.source.src, poly_data.source.auth_asym_id, poly_data.source.src_ids.join(",")])
									total.push(["-"])
									total.push(["target_polymer_sequence", "target_auth_asym_id", "target_residue_ids"])
									total.push([poly_data.target.tgt, poly_data.target.auth_asym_id, poly_data.target.tgt_ids.join(",")])
									total.push(["-"])
									total.push(["source_alignment", "target_alignment", "alignment_ids"])
									total.push([poly_data.alignment.src_aln, poly_data.alignment.tgt_aln, poly_data.alignment.aln_ids.join(",")])
									total.push([""])
									total.push([""])

								})

								return total


							}
						})()}
						onClick={() => null}>
						<Button
							color="primary"
							style={{ textTransform: "none" }}
							fullWidth
							disabled={prediction_data === null || (prediction_data !== null && Object.keys(prediction_data).length === 0)}
							variant="outlined"> Download Prediction (.csv) </Button>

					</CSVLink>
				</Grid>
				<Grid item style={{ marginBottom: "10px" }}>
					<Button color="primary"
						style={{ textTransform: "none" }}
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
						src_struct={current_binding_site?.rcsb_id as string}
						tgt_struct={cur_tgt?.struct.rcsb_id as string}
						title={`Predicted Residues of ${cur_ligclass?.description} from structure ${current_binding_site?.rcsb_id} in structure ${cur_tgt?.struct.rcsb_id}`}
						open={msaOpen}
						handleclose={handleclose}
						handleopen={handleopen}
						aln_obj={prediction_data} />

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
									textTransform: "none"
								} : {
									textTransform: "none"
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
									textTransform: "none"
								} : {
									textTransform: "none"
								}
							}


							variant="outlined"
							disabled={cur_tgt === null || prediction_data === {} || (prediction_data !== null && Object.keys(prediction_data).length === 0)}
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
