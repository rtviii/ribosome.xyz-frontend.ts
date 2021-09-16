import Grid from '@material-ui/core/Grid/Grid'
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { Typography } from '@material-ui/core';
import List from '@material-ui/core/List/List'
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { large_subunit_map } from '../../static/large-subunit-map';
import { small_subunit_map } from '../../static/small-subunit-map';
import { DashboardButton } from '../../materialui/Dashboard/Dashboard';
import ListItem from '@material-ui/core/ListItem/ListItem';
import Button from '@material-ui/core/Button/Button';
import { CSVLink } from 'react-csv';
import TextField from '@material-ui/core/TextField/TextField';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../redux/store';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Icon } from "@material-ui/core";
import proteins from './../../static/protein_icon_chain.svg'
import structicon from './../../static/struct_icon.svg'
import rnas from './../../static/rna_icon.svg'
import { useParams } from 'react-router';
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import { Theme, createStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Pagination from './../Workspace/Display/Pagination'
import { gotopage } from '../../redux/reducers/StructuresReducer/StructuresReducer';
import { NeoStruct } from '../../redux/DataInterfaces';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    // maxWidth: 700

  },
  labelContainer: {
    width: "auto",
    padding: 0
  },
  iconLabelWrapper: {
    flexDirection: "row"
  },
  table: {
    minWidth: 650,
  },
  classButton: {
    "&:hover, &:focus": {
      // boxShadow: "1px 1px 1px  black"
      backgroundColor: "rgba(125,179,241,0.58)"
    },
    cursor: "pointer",
  },
  pageData:
    { width: "100%", padding: 20, margin: 10 }
});


export default function Nomenclature() {
  const [search, setsearch] = useState('')
  const gentable = () => {

    var x = { ...large_subunit_map, ...small_subunit_map }
    var summary: Array<Array<any>> = []
    summary.push(['nomenclature_class', 'bacteria', 'yeast', 'human', 'pfams'])

    Object.entries(x).map(
      (s) => {
        summary.push([s[0], s[1].b, s[1].y, s[1].h, s[1].pfamDomainAccession.reduce((a, b) => a + "," + b, '')])
      }
    )

    return summary

  }
  type NomenclatureParams = {
    subcomponent: string | undefined
  }
  const params = useParams<NomenclatureParams>();
  useEffect(() => {
    const { subcomponent } = params;
    if ((subcomponent !== undefined) && ['structure', 'rna', 'protein'].includes(subcomponent.toLowerCase())) {
      setValue(subcomponent)
    }

    console.log("ogt params", params);


  }, [params])

  const [value, setValue] = React.useState('structure');
  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setValue(newValue);
  };

  const structures = useSelector((state: AppState) => state.structures.neo_response)
  const classes = useStyles();
  const banclasses = { ...large_subunit_map, ...small_subunit_map }
  const history = useHistory();
  const rnaClasses = useSelector((state: AppState) => Object.keys(state.rna.rna_classes))

  const tbstyles = (makeStyles({
    root: { width: "100%" }
  }))()

  const pagecount = useSelector((state: AppState) => state.structures.pages_total)
  const curpage = useSelector((state: AppState) => state.structures.current_page)
  const dispatch = useDispatch();


  // !hack, cutting corners by not elevating state of search bar from all 3 of structs/prots/rnas to nomenclature reducer.

  // useEffect(() => {
  //   structures.filter


  // }, [search])
  return (
    <Grid xs={12} container spacing={1}>



      <Grid item xs={12}>


        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
          variant="fullWidth"
          aria-label="icon label tabs example"
        >
          <Tab label="Structures" value='structure' />
          <Tab label="Proteins" value='protein' />
          <Tab label="RNA" value='rna' />

        </Tabs>


        {(() => {


          if (value === 'protein') {

            return <Paper variant="outlined" className={classes.pageData}>
              <Typography variant="h5">
                Protein Nomenclature reference table
              </Typography>
              <Typography variant="body2">
                Proteins of the database adopt Ban et al.'s naming system (Current opinion in structural biology, 2014). <a href="https://bangroup.ethz.ch/research/nomenclature-of-ribosomal-proteins.html">See paper</a> for more details.
              </Typography>
            </Paper>
          }
          else if (value === 'rna') {

            return <Paper variant="outlined" className={classes.pageData}>
              <Typography variant="h5">
                RNA Nomenclature Classes
              </Typography>
            </Paper>

          }
          else if (value === 'structure') {


            return <Paper variant="outlined" className={classes.pageData}>
              <Typography variant="h5">
                Whole-Structure Nomenclature Mappings
              </Typography>
            </Paper>

          }


        })()}




      </Grid>
      <Grid item xs={2}>

        <List >
          <ListItem>
            <TextField
              id="outlined-required"
              label="Search"
              disabled={value === 'structure'}
              defaultValue=""
              variant="outlined"
              onChange={(e) => { setsearch(e.target.value) }}
            />
          </ListItem>
          <ListItem>
            <CSVLink data={gentable()}>
              <Button fullWidth style={{ textTransform: "none" }} 
              
              disabled={true}
              
              color="primary" variant="outlined"> Download as Table</Button>
            </CSVLink>
          </ListItem>
          <ListItem>
            <DashboardButton />
          </ListItem>
        </List>
      </Grid>
      <Grid item xs={10}>
        {(
          () => {
            if (value === 'protein') {

              return <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Protein Nomenclature Class</TableCell>
                      <TableCell>In      Bacteria          </TableCell>
                      <TableCell>In      Yeast             </TableCell>
                      <TableCell>In      Human             </TableCell>


                      <TableCell align="right">Associated PFAM Families</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {

                      Object.entries(banclasses).filter(r => {

                        if (search === 'Search' || search === '') { return true }
                        else {
                          return (r[0] + r[1].b + r[1].y + r[1].h).toLowerCase().includes(search.toLowerCase())

                        }
                      }).map(row => {
                        return <TableRow key={row[0]}>
                          <TableCell

                            className={classes.classButton}
                            color="primary"
                            scope="row"

                            onClick={() => { history.push(`/rps/${row[0]}`) }}>
                            <b>{row[0]}</b>
                          </TableCell>
                          <TableCell >{row[1].b}</TableCell>
                          <TableCell >{row[1].y}</TableCell>
                          <TableCell >{row[1].h}</TableCell>
                          <TableCell align="right">{row[1].pfamDomainAccession.map((a) => <div><a href={`https://pfam.xfam.org/family/${a}`}>{a}</a></div>)}</TableCell>
                        </TableRow>
                      })
                    }
                  </TableBody>
                </Table>
              </TableContainer>

            } else if (value === 'rna') {

              return <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell><b>RNA Nomenclature Classes</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[...rnaClasses.filter(r => r !== 'other')]
                      .map((rncl) => {
                        if (!['mrna', 'trna'].includes(rncl)) {
                          return [`${rncl}S RNA`, rncl]
                        } else if (rncl === 'mrna') {
                          return ['mRNA', 'mrna']
                        } else if (rncl === 'trna') {
                          return ['tRNA', 'trna']
                        }
                      }
                      )
                      .map((rncl: any) => {
                        return <TableRow key={rncl[1]}>
                          <TableCell
                            className={classes.classButton}
                            color="primary"
                            scope="row"
                            onClick={() => { history.push(`/rnas/${rncl[1]}`) }}>
                            {rncl[0]}
                          </TableCell>
                        </TableRow>
                      })
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            } else if (value === 'structure') {
              return <div className={classes.root} style={{display:"flex", flexDirection:"column"}}>
                {structures.length > 0 ? <>
                  <Pagination {...{ gotopage: (pid) => dispatch(gotopage(pid)), pagecount: pagecount }} />
                  {structures


                    .slice((curpage - 1) * 20, curpage * 20)
                    .map(s => {

                      const source = s.rnas.map(rp => ({ [rp.strands]: rp.noms }))
                      return <Accordion
                      
                        style={{marginBottom:"10px"}}
                      >
                        <AccordionSummary
                          style={{display:"flex", alignContent:"center",alignItems:"center", justifyContent:"center", justifyItems:"center"}}
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header">

                          <img src={structicon} height={25} width={25} />

                          <Typography style={{marginRight:"20px"}} >{s.struct.rcsb_id} </Typography>

                          <Typography  style={{fontSize:"10px"}}>{s.struct.citation_title}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <StructPaper {...s}/>



                        </AccordionDetails>
                      </Accordion>


                    })
                  }
                </> : <LinearProgress />}
              </div>



            }


          }
        )()}
      </Grid>

    </Grid>
  );
}



const StructPaper = (struct:NeoStruct) =>{

  

  useEffect(() => {
    for (var _ of struct.rnas){
      if ( _.noms == null ){
        console.log("------>",struct);
        console.log(struct.rnas);
        
      }
    }
  }, [])

  return <Paper variant="outlined">
  {struct.rnas !== null ?   struct.rnas.map(rna => {
    
    if (rna.noms!== null){
    return <pre> {rna.strands}:{rna.noms.length> 0 ? rna.noms : "Undefined"} </pre>
    }
  }
    ) 
    : ""
   }





  {struct.rps !== null ? struct.rps.map(rp  => {return <pre> {rp.strands}:{rp.noms.length> 0 ? rp.noms.reduce((a,b)=>{return a + ',' + b}, '') : "Undefined"} </pre>}): ""}
              </Paper>

}