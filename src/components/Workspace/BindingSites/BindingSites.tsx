import React, { useEffect, useState } from 'react'
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography/Typography';
import Paper from '@material-ui/core/Paper/Paper';
import {  makeStyles, Theme } from '@material-ui/core/styles';
import { DashboardButton } from '../../../materialui/Dashboard/Dashboard';
import { Cart } from '../Cart/Cart';
import Autocomplete from '@material-ui/lab/Autocomplete/Autocomplete';
import { useSelector } from 'react-redux';
import { AppState } from '../../../redux/store';
import TextField from '@material-ui/core/TextField/TextField';
import { BindingInterface, BindingSite, LigandClass, NeoStruct } from '../../../redux/DataInterfaces';
import { Button } from '@material-ui/core';
import { getNeo4jData } from '../../../redux/AsyncActions/getNeo4jData';
import fileDownload from 'js-file-download';
import axios from 'axios';

import * as loadingicon from './../../../static/loading2.gif'




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



  const [interface_data, setInterface_data] = useState<BindingInterface | null>(null)
  const [cur_struct, set_cur_struct]        = useState<BindingSite| null>(null)
  const [curligand, set_cur_ligand]         = useState<LigandClass | null>(null)
  const [ligstructPair, setLigstructPair]   = useState< [ string|null , string |null ]>([null, null])

  const bsites                                          = useSelector((state:AppState) => state.binding_sites.bsites)
  const lig_classes                                     = useSelector((state:AppState) => state.binding_sites.ligand_classes)
  const [ bsites_derived, set_bsites_derived ]          = useState<BindingSite[]>()
  const [ lig_classes_derived, set_ligclasses_derived ] = useState<LigandClass[]>()


  const [curTarget, setCurTarget] = useState<NeoStruct | null >(null)

  useEffect(() => {
	  if (ligstructPair[0] == null || ligstructPair[1] == null) {
		  return
	  }
	  else {
		  getLigandNbhd(ligstructPair[0], ligstructPair[1]).then(r => setInterface_data(r))
	  }
  }, [ligstructPair])



  useEffect(() => {

	if (OrigProjection ==='origin'){

    viewerInstance.visual.update({
      moleculeId: cur_struct?.rcsb_id.toLowerCase()
    });

	setloadingcurrent(true)


	}

  }, [cur_struct])




  const get_strand_asymid_map = (gqlresp:any) =>{
    var _ = gqlresp.data.data.entry.polymer_entities

	
    const map:Record<any,any> = {}
      for (var poly of _){
            var strand  = poly.entity_poly.pdbx_strand_id
            var asym    = poly.rcsb_polymer_entity_container_identifiers.asym_ids[0]
            map[strand] = {"asymid":asym}
    }


    getNeo4jData('neo4j', {
      endpoint: "get_struct",
      params: { pdbid: cur_struct!.rcsb_id }
    })
    .then(r=>{
	// 	console.log("got asymid map getstruct", r.data);
    //   iter over rps
     for (var rp of r.data[0].rps){
       if (Object.keys(map).includes(rp.entity_poly_strand_id )){
        map[rp.entity_poly_strand_id] = {
          nomenclature: rp.nomenclature,
          asymid      : map[rp.entity_poly_strand_id].asymid
        }
       }
     }
      
      // iter over rnas
     for (var rna of r.data[0].rnas){
       if (Object.keys(map).includes(rna.entity_poly_strand_id )){
        map[rna.entity_poly_strand_id] = Object.assign({}, map[rna.entity_poly_strand_id],{
          nomenclature : [ rna.rcsb_pdbx_description ]
        })
       }

     }
    })
    
    return map

  }

  const [asymidChainMap, setAsymidChainMap] = useState({} as any)
  const getGqlQuery = (pdbid:string) =>{

    return  encodeURI(`https://data.rcsb.org/graphql?query={
      entry(entry_id: "${pdbid.toLowerCase()}") {
      rcsb_id
      polymer_entities {
          rcsb_polymer_entity_container_identifiers{
      asym_ids
    }
        entity_poly {
          pdbx_strand_id
          type
        }
      }
      nonpolymer_entities {
        rcsb_nonpolymer_entity_container_identifiers{
          asym_ids
        }
        
        pdbx_entity_nonpoly {
          
          comp_id
          name
          entity_id
        }
        rcsb_nonpolymer_entity {
          formula_weight
          pdbx_description
        }
      }
  }}` )
  }
  useEffect(() => {

    if (cur_struct != null){
    axios.get(getGqlQuery(cur_struct.rcsb_id)).then(
      r=>{
        var map = get_strand_asymid_map(r)
        setAsymidChainMap(map)
      }
      ,e=>{console.log("Error", e);
      }
    )
	}
    
  }, [cur_struct])



  const highlightInterface = () =>{
	  //? struct_sym_id: 'B', 
	  //? start_residue_number: 8, 
	  //? end_residue_number: 10, 
	  //? color:{r:255,g:0,b:255},
	  //? sideChain: true

	  if (interface_data === null) {
		  alert("Select a binding site.")
		  return
	  }

	  if (interface_data.nbrs === undefined) {
		  alert("Neighbors of this ligand are ambiguous.")
		  return
	  }

	  var vis_data = interface_data?.nbrs.map(l => {

		  return asymidChainMap[l.strand_id] == undefined ?
			  null
			  :
			  {
				  start_residue_number: l.resid,
				  end_residue_number: l.resid,
				  color: { r: 255, g: 0, b: 255 },
				  struct_sym_id: asymidChainMap[l.strand_id]['asymid']
				  , focus: true
			  }
	  }).filter(val => !(val === null))

	  console.log(vis_data);
	  if (vis_data.length > 500){
		  alert(`The are too many neighboring residues of ${curligand?.ligand.chemicalId} (${vis_data.length}) in this structure.\n Attempting to visualize. You browser may slow down.`)
		  return 
	  }
	  
	  
	  viewerInstance.visual.select(
		  {
			  data: vis_data, nonSelectedColor: { r: 180, g: 180, b: 180 }
		  }
	  )
  }


const donwloadBindingSiteReport = (struct:string, chemid:string) =>{
    getNeo4jData("static_files", {
      endpoint: "download_ligand_nbhd",
      params: {
        chemid    :  chemid,
        structid  :  struct,
      },
    }).then(r =>
      fileDownload(
        JSON.stringify(r.data),
        `${struct}_${chemid}_ligandProfile.json`,
        "application/json"
      )
    );
}

const getLigandNbhd = async (chemid:string, struct:string):Promise<BindingInterface>=>{

	var data = {}
	await getNeo4jData("static_files",{endpoint:"get_ligand_nbhd",params:{
    chemid,
    struct
    }}).then(
      r=>{
		data = r.data

      },
      e=>{
        console.log("error out fetching binding site file:", e)
      }
    )

	return data as BindingInterface
}


useEffect(() => {
}, [ligstructPair])

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
            if (newvalue === null){
				set_cur_struct(null)
				setLigstructPair([ligstructPair[0], null])
            }else{

				set_cur_struct(newvalue)
				setLigstructPair([ ligstructPair[0],newvalue.rcsb_id ])

			}
  }
  const handleLigChange = (event: React.ChangeEvent<{ value: unknown }>, newvalue:LigandClass) => {
            if (newvalue === null){
				set_cur_ligand(null)
				setLigstructPair([null,ligstructPair[1]])
            }
			else{
				set_cur_ligand(newvalue)
				setLigstructPair([ newvalue.ligand.chemicalId, ligstructPair[1], ])
			}
  }

  const handleTargetChange = (event: React.ChangeEvent<{ value: unknown }>, newvalue:NeoStruct) => {

            if (newvalue === null){

				console.log("Current target set to");
				console.log(newvalue);
				setCurTarget(null)

            }
			else{
				setCurTarget(newvalue)
			}
  }

  useEffect(() => {

    var options = {
      moleculeId      : 'Element to visualize can be selected above.',
      hideControls    : true,
      layoutIsExpanded: false,
    }
    var viewerContainer = document.getElementById('molstar-viewer');
	  viewerInstance.render(viewerContainer, options);
  }, [])

	const [OrigProjection, setOrigProj] = useState<'origin' | 'projection'>('origin')
	const target_structs = useSelector((state: AppState) => state.structures.derived_filtered)



	useEffect(() => {

		if (curTarget != null && OrigProjection === 'projection'){
			viewerInstance.visual.update({
				moleculeId: curTarget?.struct.rcsb_id.toLowerCase()
			});

			setloadingtarget(true)
		}

		if (cur_struct != null && OrigProjection === 'origin'){
			viewerInstance.visual.update({
				moleculeId: cur_struct?.rcsb_id.toLowerCase()
			});
			setloadingcurrent(true)
		}
	}, [OrigProjection])



	const [loading_current, setloadingcurrent] = useState<boolean>(false)
	const [loading_target , setloadingtarget ] = useState<boolean>(false)

	useEffect(() => {
		if(loading_current) {
			setTimeout(() => {
				setloadingcurrent(false)
			}, 5000);
		}
		if(loading_target) {
			setTimeout(() => {
				setloadingtarget(false)
			}, 5000);
		}
	}, [loading_current,loading_target])





	return (
		<Grid container xs={12} spacing={1} style={{ outline: "1px solid gray", height: "100vh" }} alignContent="flex-start">
			<Paper variant="outlined" className={classes.pageDescription}>
						<Typography variant="h4">
							Ligand Binding Site
				</Typography>
			</Paper>
			<Grid item direction="column" xs={2} spacing={2} style={{ padding: "10px" }}>
				<Typography className={classes.bsHeader} variant="h5">Origin Binding Site</Typography>
				<Autocomplete
					value={cur_struct}
					className={classes.autocomplete}
					options={bsites_derived as any}
					getOptionLabel={(parent: BindingSite) => { return parent.rcsb_id ? parent.rcsb_id + " : " + parent.citation_title : "" }}
					// @ts-ignore
					onChange     = {handleStructChange}
					renderOption = {(option) => (<div style={{ fontSize: "10px", width: "400px" }}><b>{option.rcsb_id}</b> {option.citation_title}  </div>)}
					renderInput  = {(params) => <TextField {...params} label={`Binding Sites  ( ${bsites_derived != undefined ? bsites_derived.length : "0"} )`} variant="outlined" />}
				/>

				<Autocomplete
					value={curligand}
					className={classes.autocomplete}
					options={lig_classes_derived as LigandClass[]}
					getOptionLabel={(lc: LigandClass) => { return lc.ligand ? lc.ligand.chemicalId + " : " + lc.ligand.chemicalName : "" }}
					// @ts-ignore
					onChange={handleLigChange}
					renderOption={(option) => (<div style={{ fontSize: "10px", width: "400px" }}><b>{option.ligand.chemicalId}</b> ({option.ligand.chemicalName}) </div>)}
					renderInput={(params) => <TextField {...params} label={`Ligand (${lig_classes_derived !== undefined ? lig_classes_derived.length : "0"})`} variant="outlined" />} />


				<Typography className={classes.bsHeader} variant="h5">Prediction</Typography>
				<Autocomplete
					value={curTarget}
					// placeholder={{struct:{

					// 	rcsb
					// }}}
					className={classes.autocomplete}
					options={target_structs}
					getOptionLabel={(parent: NeoStruct) => { return parent.struct ? parent.struct.rcsb_id + " : " + parent.struct.citation_title : "" }}
					// @ts-ignore
					onChange={handleTargetChange}
					renderOption={(option) => (<div style={{ fontSize: "10px", width: "400px" }}><b>{option.struct.rcsb_id}</b> {option.struct.citation_title}  </div>)}
					renderInput={(params) => <TextField {...params} label={`Target Structure ( ${target_structs != undefined ? target_structs.length : "0"} )`} variant="outlined" />} />

				<Button color="primary"
					style={{ marginBottom: "10px" }}
					onClick={() => {
						setCurTarget(null)
						set_cur_ligand(null)
						set_cur_struct(null)
						setLigstructPair([null, null])
						viewerInstance.visual.reset({ camera: true, theme: true })

						// ? reset molstar highlight 


					}}

					fullWidth variant="outlined"> Reset</Button>

				<Grid item style={{ marginBottom: "10px" }}>
					<Button variant="outlined" fullWidth 
						style={ligstructPair.includes(null) ? { color: "gray" } : {}}
						color={!ligstructPair.includes(null) ? 'primary' : 'default'}
						onClick={() => {
						if (ligstructPair.includes(null)) {
							alert("Select a binding site.")
							return
						} donwloadBindingSiteReport(ligstructPair[1] as string, ligstructPair[0] as string)
					}} >
						Download Binding Site
								</Button>
				</Grid>

				<Grid item style={{ marginBottom: "10px" }}>
					<Button
						fullWidth
						variant = {"outlined"}
						style   = {ligstructPair.includes(null) ? { color: "gray" } : {}}
						color   = {!ligstructPair.includes(null) ? 'primary' : 'default'}
						onClick = {() => { highlightInterface() }}>
						Visualize Interface
					</Button>
				</Grid>
				<Grid item  >
					<Cart />
				</Grid>
				<Grid item xs={3} justify={"flex-start"} >
					<DashboardButton />
				</Grid>

			</Grid>
			<Grid item container spacing={2} direction="row" xs={10} style={{ height: "100%" }} alignContent="flex-start">
				<Grid item container xs={12} spacing={2} alignContent="flex-start" alignItems="flex-start" justify="flex-start" >

					<Grid item>
					</Grid>

					<Grid item>
						<Button variant="outlined" color={OrigProjection == 'origin' ? 'primary' : "default"} onClick={() => { setOrigProj('origin') }} > Structure  of Origin
					{cur_struct === null ? "" : `( ${cur_struct.rcsb_id} )`}
							{loading_current ? <img style={{ marginLeft: "10px", width: "30px", height: "10px" }} src={loadingicon} /> : null}
						</Button >
					</Grid>

					<Grid item>
						<Button variant="outlined"
							disabled={curTarget === null}
							color={OrigProjection == 'projection' ? 'primary' : "default"} onClick={() => { setOrigProj('projection') }} > Prediction
					{curTarget === null ? "" : `( ${curTarget.struct.rcsb_id} )`}
							{loading_target ? <img style={{ marginLeft: "10px", width: "30px", height: "10px" }} src={loadingicon} /> : null}
						</Button >
					</Grid>
				</Grid>
				<Grid item xs={12} >
					<Paper variant="outlined" style={{ height: "50vw", position: "relative", padding: "10px" }} >
						<div style={{ position: "relative", width: "100%", height: "100%" }} id="molstar-viewer"></div>
					</Paper>
				</Grid >
			</Grid>
		</Grid>
	)
}

export default BindingSites
