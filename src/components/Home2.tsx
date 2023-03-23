import React, { useEffect, useState } from 'react'
import bioplogo from "./../static/biopython_logo.svg";
import pdb from "./../static/pdb.png";
import pfam from "./../static/pfam.gif";
import raylogo from "./../static/ray-transp-logo.png";
import ubc from "./../static/ubc-logo.png";
import { DashboardButton } from "../materialui/Dashboard/Dashboard";
import Grid from "@material-ui/core/Grid";
import './Home.css'
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import ListItem from '@material-ui/core/ListItem/ListItem';
import List from '@material-ui/core/List/List';
import Typography from '@material-ui/core/Typography/Typography';
import Paper from '@material-ui/core/Paper/Paper';
import proteins from './../static/protein_icon_chain.svg'
import structicon from './../static/struct_icon.svg'
import rnas from './../static/rna_icon.svg'
import { AppState } from '../redux/store';
import { useSelector } from 'react-redux';
import { getNeo4jData } from '../redux/AsyncActions/getNeo4jData';
import { useHistory } from 'react-router-dom';
import { Theme } from '@material-ui/core';
import toast, { Toaster } from 'react-hot-toast';
import Button from '@mui/material/Button/Button';
import ReactDOM from 'react-dom';
const notify = () => toast('Here is your toast.');

class MyWindowPortal extends React.PureComponent {
	externalWindow: any;
	containerEl: any;
	constructor(props: any) {
		super(props);
		// STEP 1: create a container <div>
		this.containerEl = document.createElement('div');
		this.externalWindow = null;
	}

	render() {
		// STEP 2: append props.children to the container <div> that isn't mounted anywhere yet
		return ReactDOM.createPortal(this.props.children, this.containerEl);
	}

	componentDidMount() {
		// STEP 3: open a new browser window and store a reference to it
		this.externalWindow = window.open('', '', 'width=600,height=400,left=200,top=200');

		// STEP 4: append the container <div> (that has props.children appended to it) to the body of the new window
		this.externalWindow.document.body.appendChild(this.containerEl);
	}

	componentWillUnmount() {
		// STEP 5: This will fire when this.state.showWindowPortal in the parent component becomes false
		// So we tidy up by closing the window
		this.externalWindow.close();
	}
}

const AcknowlegementsList = () => {
	const plugstyles = makeStyles({
		root: {
			width: "100%",
			//   outline:"1px solid gray"
		},
		ackntext: {
			fontSize: "10px",
		},
		acknlist: {
			width: "100%",
			marginBottom: "10px"

			//   top: "40%",
		},
		cardmedia: {
			maxHeight: "90px",
			maxWidth: "90px",
			width: "100%",
			height: "100%",

			//   maxWidth: 100,
		},
	})();
	// const openInNewTab = url => {
	//     window.open(url, '_blank', 'noopener,noreferrer');
	//   };




	// function render() {
	//   let html       = ReactDOMServer.renderToStaticMarkup(<HelloWorldPage />);
	//   let htmlWDoc   = "<!DOCTYPE html>" + html;
	//   let prettyHtml = prettier.format(htmlWDoc, { parser: "html" });
	//   let outputFile = "./output.html";
	//   fs.writeFileSync(outputFile, prettyHtml);
	//   console.log(`Wrote ${outputFile}`);
	// }

	// function HelloWorldPage() {
	//   return (
	//     <html lang="en">
	//       <head>
	//         <meta charSet="utf-8" />
	//         <title>Hello world</title>
	//       </head>
	//       <body>
	//         <h1>Hello world</h1>
	//       </body>
	//     </html>
	//   );
	// }

	const [isPortalOpen, setIsPortalOpen] = useState(false);

	return (

		<Grid item className={plugstyles.acknlist} xs={12} spacing={3}>
			<Typography variant="overline"> Acknowledgements</Typography>
			<Grid container xs={12} spacing={1}>

				<Grid item container justify="space-between" className={plugstyles.root} xs={12} >

					<Grid item xs={2} justify="center" alignItems="center" alignContent="center">
						<img className={plugstyles.cardmedia} src={pdb} />
					</Grid>

					<Grid item xs={10}>
						<Typography className={plugstyles.ackntext} style={{ marginTop: "10px" }}>
							Crystallographic strucutures and some of the annotations are
							acquired from <a href={"https://www.rcsb.org/"}>RCSB PDB</a>.
							<a href="https://data.rcsb.org/index.html#gql-api">
								RCSB GraphQL					</a>
							greatly faciliatates the integration of data across structures
						</Typography>
					</Grid>
				</Grid>

				<Grid item container className={plugstyles.root}>
					<Grid item xs={2} justify="center" alignItems="center" alignContent="center">
						<img src={bioplogo} className={plugstyles.cardmedia} />
					</Grid>
					<Grid item xs={10}>

						<Typography variant="caption" className={plugstyles.ackntext}>
							Parsing and search are performed via{" "} <a href="https://biopython.org/">Biopython.PDB</a>
						</Typography>
					</Grid>
				</Grid>
				<Grid item container className={plugstyles.root}>
					<Grid item xs={2}>
						<img src={pfam} className={plugstyles.cardmedia} />
					</Grid>
					<Grid item xs={10}>
						<Typography variant="caption" className={plugstyles.ackntext}>
							<a href="https://pfam.xfam.org/">PFAM</a> Database provides
							context for grouping ribosomal proteins into families.
						</Typography>
					</Grid>
				</Grid>

				<Grid item container className={plugstyles.root}>

					<Grid item xs={2}>
						<img src={ubc} className={plugstyles.cardmedia} />
					</Grid>

					<Grid item xs={10}>
						<Typography variant="caption" className={plugstyles.ackntext} >

							<p style={{ marginTop: "20px" }}>
								Developed by <a href="https://kdaoduc.com/">Khanh Dao-Duc's group</a> at the University of British Columbia, in collaboration with <a href="https://ww2.chemistry.gatech.edu/~lw26/index.html#PI">
									Loren Williams' group
								</a> at Georgia Institute of Technology.
								Please address your questions and suggestions to <a href="mailto:kdd@math.ubc.ca">Khanh Dao-Duc</a>.
							</p>
							<Typography variant="inherit">Consider citing us if you found the tool useful: </Typography> 
							<div>

							<div>- <a href="https://academic.oup.com/Citation/Download?resourceId=6777803&resourceType=3&citationFormat=2">.bibtex</a></div>
							<div>- <a href="https://scholar.google.ca/scholar?hl=en&as_sdt=0%2C5&q=ribosome+xyz&btnG=#d=gs_cit&t=1670386242369&u=%2Fscholar%3Fq%3Dinfo%3AEOd_sW0B1gcJ%3Ascholar.google.com%2F%26output%3Dcite%26scirp%3D0%26hl%3Den">Google Scholar</a></div>

							</div>

							console.

							




							{/* <iframe srcdoc={this.state.file}/>
							  <a href={<InnerHtml} target="_blank" rel="noopener noreferrer">
      </a>

Artem Kushner, Anton S Petrov, Khanh Dao Duc, RiboXYZ: a comprehensive database for visualizing and analyzing ribosome structures, Nucleic Acids Research, 2022;, gkac939, https://doi.org/10.1093/nar/gkac939
@article{10.1093/nar/gkac939,
    author = {Kushner, Artem and Petrov, Anton S and Dao Duc, Khanh},
    title = "{RiboXYZ: a comprehensive database for visualizing and analyzing ribosome structures}",
    journal = {Nucleic Acids Research},
    year = {2022},
    month = {10},
    abstract = "{Recent advances in Cryo-EM led to a surge of ribosome structures deposited over the past years, including structures from different species, conformational states, or bound with different ligands. Yet, multiple conflicts of nomenclature make the identification and comparison of structures and ortholog components challenging. We present RiboXYZ (available at https://ribosome.xyz), a database that provides organized access to ribosome structures, with several tools for visualisation and study. The database is up-to-date with the Protein Data Bank (PDB) but provides a standardized nomenclature that allows for searching and comparing ribosomal components (proteins, RNA, ligands) across all the available structures. In addition to structured and simplified access to the data, the application has several specialized visualization tools, including the identification and prediction of ligand binding sites, and 3D superimposition of ribosomal components. Overall, RiboXYZ provides a useful toolkit that complements the PDB database, by implementing the current conventions and providing a set of auxiliary tools that have been developed explicitly for analyzing ribosome structures. This toolkit can be easily accessed by both experts and non-experts in structural biology so that they can search, visualize and compare structures, with various potential applications in molecular biology, evolution, and biochemistry.}",
    issn = {0305-1048},
    doi = {10.1093/nar/gkac939},
    url = {https://doi.org/10.1093/nar/gkac939},
    note = {gkac939},
    eprint = {https://academic.oup.com/nar/advance-article-pdf/doi/10.1093/nar/gkac939/46673833/gkac939.pdf},
}
 */}


						</Typography>
					</Grid>

				</Grid>


			</Grid>
		</Grid>
	);
};
export const Home2 = () => {

	const useHomepageStyles = makeStyles((theme: Theme) =>
		createStyles({
			root: {
				flexGrow: 1,
			},
			paper: {
				padding: theme.spacing(2),
				textAlign: "center",
				color: theme.palette.text.secondary,
			},
			gridItem: {
				padding: 20
			},
		})
	);
	const classes = useHomepageStyles();
	return (
		<Grid
			container
			justify="space-evenly"
			alignContent="center"
			xs={12}
		>
			<Grid item xs={3} className={classes.gridItem}>
				<List>
					<ListItem>
						<DashboardButton />
					</ListItem>

				</List>
			</Grid>

			<Grid item xs={6} className={classes.gridItem} container alignItems='center'  >

				<MainContent />
				<AcknowlegementsList />


			</Grid>

			<Grid item xs={3} >
			</Grid>

		</Grid>
	)
}

const MainContent = () => {

	const structnumber = useSelector((state: AppState) => state.structures.neo_response.length)
	const [protn, setsprotn] = useState<number>(0)
	const history = useHistory()
	useEffect(() => {
		getNeo4jData('neo4j', { endpoint: 'proteins_number', params: null }).then(r => setsprotn(r.data))
		return () => {
		}
	}, [])

	const rnan = useSelector((state: AppState) => Object.values(state.rna.rna_classes_derived).reduce((a, b) => { return a + b.length }, 0))
	const mainstyles = (makeStyles((theme: Theme) =>
		createStyles({
			root: {
				flexGrow: 1,
			},
			paper: {
				padding: theme.spacing(2),
				textAlign: "center",
				color: theme.palette.text.secondary,
			},
			titleline: {
				fontSize: "18px",
				width: "100%"
			},
			title: {

				fontFamily: "Optima"
			},
			titlelinesmall: {
				fontSize: "14px",
				width: "100%",
				fontFamily: "Optima",
				marginBottom: "10px"

			},
			bodyline: {
				// fontSize:"8px",
				width: "100%"
			},
			gridItem: {
				padding: 20
			},
			logo: {
				position: "relative",
				width: "100%"
			},
			tabicon: {
				width: "50px",
				height: "50px"
			},
			tabpaper: {
				padding: "10px",
				"&:hover": {
					// color:"red",
					transform: 'translate(3px,3px)',
					transition: "200ms",
					boxShadow: "5px 5px 15px 1px rgba(0,0,0,0.51) "
				},
				cursor: "pointer"
			}
		})
	))()



	let [number_of_structures, set_number_of_structures] = useState(0);

	useEffect(() => {
		getNeo4jData('utils', {
			endpoint: "number_of_structures",
			params: null
		}).then(r => {
			set_number_of_structures(r.data)
			console.log(`Got response  :${r.data}`)
		})
	}, [])

	return (

		<Grid container item style={{ padding: "10px" }} alignItems="flex-start" alignContent='flex-start' xs={12} spacing={3}>

			<Grid item xs={4}>
				<img src={raylogo} className={mainstyles.logo} />
			</Grid>

			<Grid item xs={8} alignContent='center' alignItems='center'>
				<Typography variant='overline' className={mainstyles.titleline}>Welcome to RiboXYZ</Typography>

				<Typography variant="body1" className={mainstyles.titlelinesmall}>
					{`RiboXYZ is a database application that provides organized access to ribosome structures, with several tools for visualisation and study.`}
				</Typography>
				<Typography variant="body1" className={mainstyles.titlelinesmall}>
					{`The database is up-to-date with the worldwide Protein Data Bank (PDB), with a standardized nomenclature that allows for search and comparison of subcomponents across all the available structures.`}
				</Typography>
				<Typography variant="body1" className={mainstyles.titlelinesmall}>
					{`In addition to structured access to this data, the application has several tools to facilitatecomparison and further analysis, e.g. visualization, comparison and export facilities.	`}
				</Typography>
			</Grid>

			<Grid item container spacing={2} justify={"space-between"} >
				<Grid item xs={4}>
					<Paper className={mainstyles.tabpaper} onClick={() => history.push('/structs')}>
						<Grid xs={12} alignContent="center" alignItems="center" justify='center' container>
							<Typography align="center" style={{ fontSize: "18px", width: "100%", fontFamily: "Optima" }}>  {number_of_structures} Ribosome Structures</Typography>
							<Typography align="center" style={{ color: "gray", fontSize: "12px", width: "100%" }}>Sub 4 Å Resolution</Typography>
							<Grid item>
								<img className={mainstyles.tabicon} src={structicon} />
							</Grid>
						</Grid>
					</Paper>
				</Grid>
				<Grid item xs={4}>
					<Paper className={mainstyles.tabpaper} onClick={() => history.push('/rps')}>
						<Grid xs={12} alignContent="center" alignItems="center" justify='center' container>
							<Typography align="center" style={{ fontSize: "18px", width: "100%", fontFamily: "Optima" }}>  {protn} Protein Chains</Typography>
							<Typography align="center" style={{ color: "gray", fontSize: "12px", width: "100%" }}>Eukaryotic, Bacterial and Universal</Typography>
							<Grid item>
								<img className={mainstyles.tabicon} src={proteins} />
							</Grid>
						</Grid>
					</Paper>
				</Grid>

				<Grid item xs={4} >
					<Paper className={mainstyles.tabpaper} onClick={() => history.push('/rnas')}>
						<Grid xs={12} alignContent="center" alignItems="center" justify='center' container>
							<Typography align="center" style={{ fontSize: "18px", width: "100%", fontFamily: "Optima" }}>  {rnan} RNA Chains</Typography>
							<Typography align="center" style={{ color: "gray", fontSize: "12px", width: "100%" }}> rRNA, tRNA & mRNA</Typography>
							<Grid item>
								<img className={mainstyles.tabicon} src={rnas} />
							</Grid>
						</Grid>
					</Paper>
				</Grid>
			</Grid>
		</Grid>
	)



}