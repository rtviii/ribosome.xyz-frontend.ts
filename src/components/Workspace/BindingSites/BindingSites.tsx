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
import { BindingInterface, BindingSite, LigandBindingSite, LigandClass, LigandPrediction, NeoStruct, Residue } from '../../../redux/DataInterfaces';
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
import { useToasts } from 'react-toast-notifications';

// @ts-ignore
const viewerInstance = new PDBeMolstarPlugin() as any;



// Tinge of blue for origin #aad5ff
// Tinge of green for prediction #fff8bd


const origin_blue = '#aad5ff'
const prediction_yellow = 'fff8bd'



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
										src_strand={chain[1].source.strand}
										tgt_strand={chain[1].target.strand}

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

	const cur_struct = useSelector((state: AppState) => state.binding_sites.current_structure)
	const cur_lig = useSelector((state: AppState) => state.binding_sites.current_ligand)
	const cur_tgt = useSelector((state: AppState) => state.binding_sites.current_target)

	const  bsites                                = useSelector               ((state: AppState) => state.binding_sites.bsites)
	const [bsites_derived , set_bsites_derived ] = useState   <BindingSite[]>(                                               )

	const  lig_classes                                  = useSelector               ((state: AppState) => state.binding_sites.ligand_classes)
	const [lig_classes_derived, set_ligclasses_derived] = useState   <LigandClass[]>(                                                       )

	const interface_data = useSelector((state: AppState) => state.binding_sites.binding_site_data)
	const prediction_data = useSelector((state: AppState) => state.binding_sites.prediction_data)



	useEffect(() => {
		var options = {
			moleculeId: 'Element to visualize can be selected above.',
			hideControls: true,
			layoutIsExpanded: false,
		}
		var viewerContainer = document.getElementById('molstar-viewer');
		viewerInstance.render(viewerContainer, options);
	}, [])


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
						auth_asym_id: chain.target.strand
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
		viewerInstance.visual.select(
			{
				data: prediction_vis_data,
				nonSelectedColor: { r: 240, g: 240, b: 240 }
			}
		)
	}

	const highlightInterface = () => {

		if (interface_data === null || interface_data === undefined) {
			alert("Select a binding site.")
			return
		}
		interface MolStarResidue { entity_id?: string, auth_asym_id?: string, struct_asym_id?: string, residue_number?: number, start_residue_number?: number, end_residue_number?: number, auth_residue_number?: number, auth_ins_code_id?: string, start_auth_residue_number?: number, start_auth_ins_code_id?: string, end_auth_residue_number?: number, end_auth_ins_code_id?: string, atoms?: string[], label_comp_id?: string, color: { r: number, g: number, b: number }, focus?: boolean, sideChain?: boolean }
		var vis_data: MolStarResidue[] = []

		for (var chain of Object.values(interface_data)) {
			var reduced = chain.residues.reduce((x: MolStarResidue[], y: Residue) => {
				if (y.residue_id > 0) {
					x.push({
						residue_number: y.residue_id,
						focus: false,
						color: { r: 1, g: 200, b: 200 },
						auth_asym_id: y.parent_strand_id
					})
				}
				return x

			}, [])
			vis_data = [...vis_data, ...reduced]
		}


		if (vis_data.length > 300) {
			// alert("This ligand binds to more than 300 residues. Your browser might take some time to load it.")
			if (window.confirm("This ligand binds to more than 300 residues. Your browser might take some time to visualize it.")) {
			}
			else {
				return
			}
		}

		viewerInstance.visual.select(
			{
				data: vis_data,
				nonSelectedColor: { r: 240, g: 240, b: 240 }
			}
		)
	}

	const updateBindingSiteData = (current_bs: BindingSite, curligand: LigandClass) => {
		dispatch(action.request_LigandBindingSite(curligand?.ligand.chemicalId, current_bs.rcsb_id))
	}



	useEffect(() => {
		set_ligclasses_derived(lig_classes)
	}, [lig_classes])
	useEffect(() => {
		set_bsites_derived(bsites)
	}, [bsites])

	const handleStructChange = (event: React.ChangeEvent<{ value: unknown }>, newvalue: any) => {
		if (newvalue === null) {

			dispatch(action.current_struct_change(null))
			// set_cur_struct(null)
		} else {
			dispatch(action.current_struct_change(newvalue))
			// set_cur_struct(newvalue)

		}
	}
	const handleLigChange = (event: React.ChangeEvent<{ value: unknown }>, newvalue: LigandClass) => {
		if (newvalue === null) {
			dispatch(action.current_ligand_change(null))
		}
		else {
			dispatch(action.current_ligand_change(newvalue))
		}
	}
	const handleTargetChange = (event: React.ChangeEvent<{ value: unknown }>, newvalue: NeoStruct) => {

		if (newvalue === null) {
			dispatch(action.current_target_change(null))
			dispatch(action._partial_state_change({ visualization_tab: 'origin' }))
		}
		else {
			dispatch(action.current_target_change(newvalue))
			// dispatch(action._partial_state_change({ visualization_tab: 'prediction' }))
		}
	}


	const cur_vis_tab = useSelector((state: AppState) => state.binding_sites.visualization_tab)
	const target_structs = useSelector((state: AppState) => state.structures.derived_filtered)

	useEffect(() => {
		if (cur_lig === null) {
			set_bsites_derived(bsites)
			dispatch(action._partial_state_change({ 'binding_site_data': null }))
		} else {
			set_bsites_derived(bsites.filter(bs => bs.chemicalId === cur_lig.ligand.chemicalId))
			// * Make sure this is nonnull
			if (cur_struct !== null){
				updateBindingSiteData(cur_struct as BindingSite, cur_lig)
			}
		}
	}, [cur_lig])

	useEffect(() => {
		console.log("changed curstruct. curlig", cur_lig);
		
		if (cur_struct === null) {
			if (cur_lig ===null)	{
				set_ligclasses_derived(lig_classes)
			}
		} else {

			if ( cur_lig  === null){

				set_ligclasses_derived(lig_classes.filter(lc => { return lc.presentIn.filter(str => str.rcsb_id === cur_struct.rcsb_id).length > 0 }))

			}
			else {
				updateBindingSiteData(cur_struct,cur_lig)
			}

			if ( cur_vis_tab ==='origin') {
								addToast(`Structure ${cur_struct?.rcsb_id} is being loaded.`,
													{
								appearance: 'info',
								autoDismiss: true,
							})
			viewerInstance.visual.update({
				moleculeId: cur_struct?.rcsb_id.toLowerCase()
			});
			}

		}
	}, [cur_struct])
	useEffect(() => {

		if (cur_tgt !== null) {
			dispatch(action.request_Prediction(
				cur_lig?.ligand.chemicalId as string,
				cur_struct?.rcsb_id as string,
				cur_struct?._organismId[0] as number,
				cur_tgt!.struct.rcsb_id,
				cur_tgt.struct._organismId[0]

				))

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

								addToast(`Switched into PREDICTION view.`,
													{
							appearance: 'warning',
							autoDismiss: true,
						})
			viewerInstance.visual.update({
				moleculeId: cur_tgt?.struct.rcsb_id.toLowerCase()
			});
								addToast(`Structure ${cur_tgt?.struct.rcsb_id} is being loaded.`,
													{
							appearance: 'info',
							autoDismiss: true,
						})

		}

		if (cur_struct != null && cur_vis_tab === 'origin') {

								addToast(`Switched into ORIGINAL STRUCTURE view.`,
													{
							appearance: 'warning',
							autoDismiss: true,
						})
								addToast(`Structure ${cur_struct?.rcsb_id} is being loaded.`,
													{
							appearance: 'info',
							autoDismiss: true,
						})
			viewerInstance.visual.update({
				moleculeId: cur_struct?.rcsb_id.toLowerCase()
			});
		}
	}, [cur_vis_tab])

	const [msaOpen, setMsaOpen] = useState<boolean>(false)
	const handleopen = () => { setMsaOpen(true) }
	const handleclose = () => { setMsaOpen(false) }

	const { addToast } = 								useToasts();


	const generatePredictionCSV = () => {
		if (prediction_data === null || _.isEqual(prediction_data, {})) {
			alert("Prediction is empty. Either not chosen by user or no chains with overlapping nomenclature found for target and source structures. ")
			return
		}
		else {

			// prediction_data



		}
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
					value={cur_struct}
					className={classes.autocomplete}
					options={bsites_derived ===undefined ? [] : bsites_derived.filter(bsite => !bsite.chemicalName.toLowerCase().includes("ion"))}
					// options={bsites_derived as any}
					getOptionLabel={(parent: BindingSite) => { return parent.rcsb_id ? parent.rcsb_id + " : " + parent.citation_title : "" }}
					// @ts-ignore
					onChange={handleStructChange}
					renderOption={(option) => (<div style={{ fontSize: "10px", width: "400px" }}><b>{option.rcsb_id}</b> {option.citation_title}  </div>)}
					renderInput={(params) => <TextField {...params} label={`Structures  ( ${bsites_derived !== undefined ? bsites_derived.filter(bsite=>!bsite.chemicalName.toLowerCase().includes("ion")).length : "0"} )`} variant="outlined" />}
				/>
				<Autocomplete
					value={cur_lig}
					className={classes.autocomplete}
					options={lig_classes_derived === undefined ? [] : ( lig_classes_derived as LigandClass[]  ).filter((ligand_class)=>!ligand_class.ligand.chemicalName.toLowerCase().includes("ion"))}
					getOptionLabel={(lc: LigandClass) => { return lc.ligand ? lc.ligand.chemicalId + " : " + lc.ligand.chemicalName : "" }}
					// @ts-ignore
					onChange={handleLigChange}
					renderOption={(option) => (<div style={{ fontSize: "10px", width: "400px" }}><b>{option.ligand.chemicalId}</b> ({option.ligand.chemicalName}) </div>)}
					renderInput={(params) => <TextField {...params} label={`Ligands  (${lig_classes_derived !== undefined ? lig_classes_derived.filter((ligand_class)=>!ligand_class.ligand.chemicalName.toLowerCase().includes("ion")).length : "0"})`} variant="outlined" />} />

				<Grid item style={{ marginBottom: "10px" }}>
					<Button
						fullWidth
						variant={"outlined"}
						style={[cur_struct, cur_lig].includes(null) ? { color: "gray", textTransform:"none" } : {textTransform:"none"}}
						// color={!ligstructPair.includes(null) ? 'primary' : 'default'}
						onClick={() => {
							highlightInterface()
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
							color={[cur_struct, cur_lig].includes(null) ? 'primary' : 'default'}
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
					onChange={handleTargetChange}
					renderOption={(option) => (<div style={{ fontSize: "10px", width: "400px" }}><b>{option.struct.rcsb_id}</b> {option.struct.citation_title} </div>)}
					renderInput={(params) => <TextField {...params}
						label={`Prediction Target ( ${target_structs !== undefined ? target_structs.length : "0"} )`} variant="outlined" />} />

				<Grid item style={{ marginBottom: "10px" }}>
					<Button
						disabled={[cur_lig, cur_struct].includes(null)}
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
						src_struct={cur_struct?.rcsb_id as string}
						tgt_struct={cur_tgt?.struct.rcsb_id as string}
						title={`Predicted Residues of ${cur_lig?.ligand.chemicalId} from structure ${cur_struct?.rcsb_id} in structure ${cur_tgt?.struct.rcsb_id}`}
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
							Original Structure {cur_struct === null ? "" : `(${cur_struct.rcsb_id})`}
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
