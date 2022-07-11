import React, { useEffect, useState } from               'react'
import bioplogo from "./../static/biopython_logo.svg";
import pdb from "./../static/pdb.png";
import pfam from "./../static/pfam.gif";
import raylogo from             "./../static/ray-transp-logo.png"        ;
import ubc from                 "./../static/ubc-logo.png"               ;
import { DashboardButton } from "../materialui/Dashboard/Dashboard"       ;
import Grid from                "@material-ui/core/Grid"                  ;
import                          './Home.css'
import makeStyles from          '@material-ui/core/styles/makeStyles'     ;
import createStyles from        '@material-ui/core/styles/createStyles'   ;
import ListItem from            '@material-ui/core/ListItem/ListItem'     ;
import List from                '@material-ui/core/List/List'             ;
import Typography from          '@material-ui/core/Typography/Typography';
import Paper from               '@material-ui/core/Paper/Paper'           ;
import proteins from            './../static/protein_icon_chain.svg'
import structicon from          './../static/struct_icon.svg'
import rnas from                './../static/rna_icon.svg'
import { AppState } from        '../redux/store'                          ;
import { useSelector } from     'react-redux'                             ;
import { getNeo4jData } from    '../redux/AsyncActions/getNeo4jData'      ;
import { useHistory } from 'react-router-dom';
import { Theme } from '@material-ui/core';


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
		width:"100%",
		marginBottom:"10px"

    //   top: "40%",
    },
    cardmedia: {
		maxHeight: "90px",
		maxWidth : "90px",
		width    : "100%",
		height   : "100%",

    //   maxWidth: 100,
    },
  })();
  return (

    <Grid item className={plugstyles.acknlist} xs={12} spacing={3}>
      <Typography variant="overline"> Acknowledgements</Typography>
      <Grid container xs={12} spacing={1}>

		<Grid item container justify="space-between" className={plugstyles.root} xs={12} >

			<Grid item xs={2} justify="center" alignItems="center" alignContent="center">
				<img className={plugstyles.cardmedia} src={pdb} />
			</Grid>

			<Grid item xs={10}>
				<Typography  className={plugstyles.ackntext} style={{marginTop:"10px"}}>
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

				<Typography variant="caption"  className={plugstyles.ackntext}>
					Parsing and search are performed via{" "} <a href="https://biopython.org/">Biopython.PDB</a>
				</Typography>
				</Grid>
			</Grid>

        <Grid item  container className={plugstyles.root}>
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

        <Grid item  container className={plugstyles.root}>

				  <Grid item xs={2}>
                  <img src={ubc} className={plugstyles.cardmedia} />
				  </Grid>

				  <Grid item xs={10}>
              <Typography variant="caption" className={plugstyles.ackntext} >

                <p style={{marginTop:"20px"}}>
Developed by <a href="https://kdaoduc.com/">Khanh Dao-Duc's group</a> at the University of British Columbia, in collaboration with <a href="https://ww2.chemistry.gatech.edu/~lw26/index.html#PI">
                    Loren Williams' group
                  </a> at Georgia Institute of Technology.
 Please address your questions and suggestions regarding RiboXYZ to <a href="mailto:ribosome.xyz@gmail.com">ribosome.xyz@gmail.com</a>.
 </p>

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
        padding:20
      },
    })
  );
  const classes = useHomepageStyles();
	return (
    <Grid
      container
      justify      = "space-evenly"
      alignContent = "center"
      xs           = {12}
    >
			<Grid item xs={3} className={classes.gridItem}>
				<List>
					<ListItem>
						<DashboardButton />
					</ListItem>

				</List>
			</Grid>

			<Grid item xs={6} className={classes.gridItem} container alignItems='center'  >

        <MainContent/>
		<AcknowlegementsList />


      </Grid>

      <Grid item xs={3} > 
      </Grid>

    </Grid>
	)
}

const MainContent = () =>{

	const  structnumber             = useSelector        (( state:AppState ) => state.structures.neo_response.length)
	 const [protn       , setsprotn] = useState   <number>(0                                                             )
	 const  history                  = useHistory         (                                                              )
	useEffect(() => {
		getNeo4jData('neo4j',{endpoint:'proteins_number', params:null}).then(r=> setsprotn(r.data[0]))
		return () => {
		}
	}, [])
	const rnan         = useSelector(( state:AppState ) => Object.values(state.rna.rna_classes_derived).reduce((a,b)=>{ return a + b.length}, 0))
	const mainstyles   = ( makeStyles((theme: Theme) =>
    createStyles({
      root: {
        flexGrow: 1,
      },
      paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary,
      },
	  titleline:{
		fontSize:"18px",
		width:"100%"
	  },
	  title:{

		fontFamily:"Optima"
	  },
	  titlelinesmall:{
		fontSize:"14px",
		width:"100%",
		fontFamily:"Optima",
		marginBottom:"10px"

	  },
	  bodyline:{
		// fontSize:"8px",
		width:"100%"
	  },
      gridItem: {
        padding:20
      },
	  logo:{
		  position:"relative",
		  width:"100%"
	  },
	  tabicon:{
		  width : "50px",
		  height: "50px"
	  },
	  tabpaper:{
		  padding:"10px",
		  "&:hover":{
			// color:"red",
            transform: 'translate(3px,3px)',
			transition:"200ms",
			boxShadow:"5px 5px 15px 1px rgba(0,0,0,0.51) "
		  },
		  cursor:"pointer"
	  }
    })
  ))()



return(

		<Grid container item style={{  padding: "10px" }} alignItems="flex-start"  alignContent='flex-start' xs={12} spacing={3}>

			<Grid item xs={4}>
				<img src={raylogo} className={mainstyles.logo}/>
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

			<Grid item container  spacing={2} justify={"space-between"} >
				<Grid item xs={4}>
					<Paper className={mainstyles.tabpaper} onClick={() => history.push('/structs')}>
						<Grid xs={12} alignContent="center" alignItems="center" justify='center' container>
							<Typography align="center" style={{ fontSize: "18px", width: "100%", fontFamily: "Optima" }}>  {structnumber} Ribosome Structures</Typography>
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