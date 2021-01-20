import React, { useEffect, useState } from "react";import "./StructuresCatalogue.css";
import Slider from '@material-ui/core/Slider';
import { connect  } from "react-redux";
import clsx from 'clsx';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import { ThunkDispatch } from "redux-thunk";
import { AppState } from "../../../redux/store";
// import StructHero from "../StructureHero/StructHero";
import { PageContext } from "../../Main";
import { AppActions } from "../../../redux/AppActions";
import LoadingSpinner  from '../../Other/LoadingSpinner'
import * as redux from '../../../redux/reducers/Data/StructuresReducer/StructuresReducer'
import { Accordion, Card } from "react-bootstrap";
import FilledInput from '@material-ui/core/FilledInput';
import SpeciesFilter from './../../../materialui/SpeciesFilter'
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import SelectProteins from './../../../materialui/SelectProteins'
import { Button } from "react-bootstrap";
import {md_files, ReactMarkdownElement } from './../../Other/ReactMarkdownElement'
import { getNeo4jData } from "../../../redux/Actions/getNeo4jData";
import {large_subunit_map} from './../../../static/large-subunit-map'
import {small_subunit_map} from './../../../static/small-subunit-map'
import Select from 'react-select'
import StructHero from './../../../materialui/StructHero'
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import { ListSubheader, useTheme } from "@material-ui/core";

interface OwnProps {}
interface ReduxProps {
  __rx_structures: redux.NeoStructResp[]
  globalFilter   : string;
  loading        : boolean;

}
interface DispatchProps {
  __rx_requestStructures: () => void,
}
type WorkspaceCatalogueProps = DispatchProps & OwnProps & ReduxProps;

export const transformToShortTax = (taxname:string) =>{
  if (typeof taxname === 'string'){
    var words = taxname.split(' ') 
    if ( words.length>1 ){
    var fl =words[0].slice(0,1)
    var full = fl.toLocaleUpperCase() + '. ' + words[1]
    return full
    }else{
      return words[0]
    }
  }
  else return taxname
  }



const WorkspaceCatalogue: React.FC<WorkspaceCatalogueProps> = (prop: WorkspaceCatalogueProps) => {

  useEffect(() => {
    prop.__rx_requestStructures()
  }, [])

  // This has to be all moved to the reducer
  const [structures, setstructures] = useState<redux.NeoStructResp[]>([])
  useEffect(()=>{
    setstructures(prop.__rx_structures)
  },[prop.__rx_structures])

  const [organismsAvailable, setorganismsAvailable] = useState({})
  useEffect(() => {
    var organisms = structures.map(str => {
      return {
        name: str.struct._organismName.map(x => x.toLowerCase()),
        id: str.struct._organismId,
      };
    });
    const orgsdict: { [id: string]: { names:string[], count:number } } = {};
    organisms.map(org => {
      org.id.forEach((id, index) => {
        if (!Object.keys(orgsdict).includes(id.toString())) {
          orgsdict[id] = {
            names:[],
            count:1
          }
          orgsdict[id].names.push(org.name[index])
        }else{
          orgsdict[id].names.push(org.name[index])
          orgsdict[id].count+=1
        }
      });
    });
    setorganismsAvailable(orgsdict)
  }, [structures]);


  const filterByProteinPresence=(structs: redux.NeoStructResp[], filter: string[])=>{
    if (filter.length ==0){
      return structs
    }
    return structs.filter(str=>filter.includes(str.struct.rcsb_id) )
  }

  const [methodFilter, setmethodFilter] = useState<string[]>([])
  useEffect(() => {
  if (methodFilter.length ===0){
    setstructures(prop.__rx_structures)
    return
  }

  var filtered = structures.filter(struct => methodFilter.includes(struct.struct.expMethod));
    setstructures(filtered)
  }, [methodFilter]);

  const [organismFilter, setorganismFilter] = useState<string[]>([]);
  const filterByOrganism = (struct: redux.NeoStructResp) => {
    if (organismFilter.length <1 ) return true
    for (var id of struct.struct._organismId) {
      if (organismFilter.includes(id.toString())) {
        return true;
      }
    }
    return false;
  };
  useEffect(() => {
    console.log(organismFilter)
  }, [organismFilter])

const truncate = (str:string) =>{
  if (typeof str === 'undefined'){
    return str
  }
    return str.length > 20 ? str.substring(0, 15) + "..." : str;
}

  const filterByPdbId = (structs: redux.NeoStructResp[], filter: string) => {
    return structs.filter(x => {
      var concated =
        x.struct.rcsb_id.toLowerCase() +
        x.struct.citation_title.toLocaleLowerCase() +
        x.struct._organismName.reduce((acc:string, curr:string)=> acc.concat(curr.toLocaleLowerCase()), '' )
      return concated.includes(filter);
    });
  };


  const [pdbidFilter, setPbidFilter]                  = useState<string>("");
  const [structsWithProteins, setstructsWithProteins] = useState<string[]>([])

  const requestByProtein = ()=>{
  getNeo4jData("neo4j", {
    endpoint: "match_structs",
    params  : { proteins: selectedProteins.join(",") },
  }).then(r => {
    setstructsWithProteins(r.data)
    console.log(r.data);
  });
}

  var protopts: {
    value: string;
    label: string;
  }[] = [
    ...Object.keys(large_subunit_map),
    ...Object.keys(small_subunit_map),
  ].map(name => {
    return { value: name, label: name };
  });

  const [selectedProteins, setselectedProteins] = useState<string[]>([]);
  const handleChange                            = (e: any) => {setselectedProteins(Array.isArray(e) ? e.map(x => x.value) : []);};
 
  useEffect(() => {
    requestByProtein()
  }, [selectedProteins])

  return !prop.loading ? (

      <div className="workspace-catalogue-grid">
        <div className="wspace-catalogue-filters-tools">



                    {Object.entries(organismsAvailable).map((tpl: any) => {console.log(tpl)})}


<StructureFilters 


/>


          {/* <div className="wspace-search">
            <input
              value={pdbidFilter}
              onChange={e => {
                var value = e.target.value;
                setPbidFilter(value);
              }}
            />
          </div>
          <br />
          <div className="match-structs">
             Find by proteins:
            <Select
              options={protopts}
              value={protopts.filter(( obj ) => selectedProteins.includes(obj.value))}
              onChange={handleChange} 
              isMulti
              isClearable
            />

          <Button onClick={()=>{requestByProtein()}}>
          Find
          </Button>


          </div>

          <div className="wspace-method-filter">
            <div className="method-instance">
              <span>ELECTRON MICROSCOPY</span>
              <input
                id="ELECTRON MICROSCOPY"
                onChange={e => {
                  var id = e.target.id;
                  console.log(e.target.checked);
                  if (e.target.checked) {
                    setmethodFilter([...methodFilter, id]);
                  } else {
                    setmethodFilter(methodFilter.filter(str => str !== id));
                  }
                }}
                type="checkbox"
              />
            </div>
            <div className="method-instance">
              <span>X-RAY DIFFRACTION</span>
              <input
                id="X-RAY DIFFRACTION"
                type="checkbox"
                onChange={e => {
                  var id = e.target.id;
                  if (e.target.checked) {
                    setmethodFilter([...methodFilter, id]);
                  } else {
                    setmethodFilter(methodFilter.filter(str => str !== id));
                  }
                }}
              />
            </div>
          </div>
          <br />

          <Accordion defaultActiveKey="0">
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                  Species
                </Accordion.Toggle>
              </Card.Header>

              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <div className="wspace-species">
                    <li>
                      <div className="species-filter">
                        <div></div>
                        <div>Tax</div>
                        <div>Total</div>
                      </div>
                    </li>
                    {Object.entries(organismsAvailable).map((tpl: any) => {
                      transformToShortTax(tpl[1].names[0]);
                      return (
                        <li>
                          <div className="species-filter">
                            <input
                              onChange={e => {
                                var checked = e.target.checked;
                                var id = e.target.id;
                                if (!checked) {
                                  setorganismFilter(
                                    organismFilter.filter(
                                      str => !(str.toString() === id)
                                    )
                                  );
                                } else {
                                  setorganismFilter([
                                    ...organismFilter,
                                    id.toString(),
                                  ]);
                                }
                              }}
                              type="checkbox"
                              id={tpl[0]}
                            />
                            <div>
                              {truncate(transformToShortTax(tpl[1].names[0]))}{" "}
                              (id:{tpl[0]})
                            </div>
                            <div>{tpl[1].count}</div>
                          </div>
                        </li>
                      );
                    })}
                  </div>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion> */}


        </div>

        <Grid container item xs={12} spacing={3}>
 
{ 
  filterByPdbId(filterByProteinPresence( structures, structsWithProteins ).filter(filterByOrganism), pdbidFilter).map(
             (x, i) => (
           <Grid item>
             <StructHero {...x} key={i}/>
           </Grid>
             )
           )
 }
        </Grid>

      </div>
  ) : (
    <LoadingSpinner annotation="Fetching data..." />
  );
};

const mapstate = (state: AppState, ownprops: OwnProps): ReduxProps => ({
  __rx_structures: state.Data.RibosomeStructures.StructuresResponse,
  loading        : state.Data.RibosomeStructures.Loading,
  globalFilter   : state.UI.state_Filter.filterValue,
});

const mapdispatch = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  ownprops: OwnProps
): DispatchProps => ({
  __rx_requestStructures: ()=> dispatch(redux.requestAllStructuresDjango())
});

export default connect(mapstate, mapdispatch)(WorkspaceCatalogue);


// Date Slider

const ValueSlider=({name,max,min,step}:{name:string, max:number,min:number,step:number})=> {
const useSliderStyles = makeStyles({
  root: {
    width: 300,
  },
});
  const classes = useSliderStyles();
  const [value, setValue] = React.useState<number[]>([min, max]);

  const handleChange = (event: any, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };

  return (
    <div className={classes.root}>
      <Typography id="range-slider" gutterBottom>
        {name}
      </Typography>

      <Slider
        min={min}
        max={max}
        marks
        step={step}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
      />
    </div>
  );
}



// Proteins



// Search
function SearchField() {
  const [name, setName] = React.useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    console.log(event.target.value)
  };

  return (
    <form  noValidate autoComplete="off">
      <FormControl>
        <InputLabel htmlFor="component-simple">Search</InputLabel>
        <Input id="component-simple" value={name} onChange={handleChange} />
      </FormControl>
    </form>
  );
}


// Filters component
const StructureFilters = () => {
  const drawerWidth = 240;
  const useFiltersStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        display: "flex",
        zIndex: -1,
      },
      appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
      drawer: {
        width: drawerWidth,
        flexShrink: 0,
      },
      drawerPaper: {
        width: drawerWidth,
      },
      // necessary for content to be below app bar
      toolbar: theme.mixins.toolbar,
      content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
      },
    })
  );

  const filterClasses = useFiltersStyles();

  return (
    <Drawer
      style={{ zIndex: -20 }}
      className={filterClasses.drawer}
      variant="permanent"
      classes={{
        paper: filterClasses.drawerPaper,
      }}
      anchor="left"
    >
      <div className={filterClasses.toolbar} />
      <List>
        <ListSubheader>Search and Filter</ListSubheader>
        <ListItem key={"year"}>
          <ValueSlider max={2021} min={2015} name={"Deposition Date"} step={1}/> 
        </ListItem>
        <ListItem key={"number-of-proteins"}>
          <ValueSlider max={150} min={25} name={"Protein Count"} step={1}/> 
        </ListItem>
        <ListItem key={"resolution"}>
          <ValueSlider max={6} min={1} name={"Resolution(A)"} step={0.1}/> 
        </ListItem>
      <Divider />
        <ListItem key={"search"}>
          <SearchField />
        </ListItem>

      <Divider />
        <ListItem key={"select-proteins"}>
          <Typography id="range-slider">Proteins Present</Typography>
        </ListItem>
        <ListItem key={"select-proteins"}>
          <SelectProteins />
        </ListItem>

      </List>

      <Divider />
      <List>
        <ListSubheader> Species</ListSubheader>
        <SpeciesFilter species={['Kluyveromyces Lactis','Escherichia Coli','Homo Sapiens','Tetrahymena Thermophila','Deinococcus Radiodurans'
        
        ]}/>

      </List>
    </Drawer>
  );
};



