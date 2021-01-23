import React, { useEffect, useState } from "react";import "./StructuresCatalogue.css";
import Slider from '@material-ui/core/Slider';
import { connect  } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AppState } from "../../../redux/store";
// import StructHero from "../StructureHero/StructHero";
import { AppActions } from "../../../redux/AppActions";
import LoadingSpinner  from '../../Other/LoadingSpinner'
import SpeciesFilter from './../../../materialui/SpeciesFilter'
import SelectProteins from './../../../materialui/SelectProteins'
import { Button } from "react-bootstrap";
import {md_files, ReactMarkdownElement } from './../../Other/ReactMarkdownElement'
import { getNeo4jData } from "../../../redux/Actions/getNeo4jData";
import {large_subunit_map} from './../../../static/large-subunit-map'
import {small_subunit_map} from './../../../static/small-subunit-map'
import StructHero from './../../../materialui/StructHero'
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import * as redux from '../../../redux/reducers/Data/StructuresReducer/StructuresReducer'
import { Dispatch } from 'redux';
import {useDebounce} from 'use-debounce'

interface filterchangeProp {
    handleChange: (newval:string)=>void;
}

export const mapdispatch = (
  dispatch: Dispatch<AppActions>,
  ownprops: {}
): filterchangeProp => ({
  handleChange: (inputval: string) => dispatch(redux.filterOnPdbid(inputval)),
});


// Search
const SearchField:React.FC<filterchangeProp> = (prop:filterchangeProp)=> {


  const [name, setName] = React.useState("");
  const [value] = useDebounce(name, 250)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    var newval = event.target.value
    setName(newval);
  };

  useEffect(() => {
    prop.handleChange(value)
  }, [value])

  return (
    <form  noValidate autoComplete="off">
      <FormControl>
        <InputLabel htmlFor="component-simple">Search</InputLabel>
        <Input id="component-simple" value={name} onChange={handleChange} />
      </FormControl>
    </form>
  );
}

connect(null, mapdispatch)(SearchField);

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import { ListSubheader } from "@material-ui/core";

interface OwnProps {}
interface ReduxProps {
  structures  : redux.NeoStruct[]
  globalFilter: string;
  loading     : boolean;
}

type WorkspaceCatalogueProps = OwnProps & ReduxProps;

export const transformToShortTax = (taxname:string) =>{
  if (typeof taxname === 'string'){
    var words = taxname.split(' ') 
    if ( words.length>1 ){
    var fl =words[0].slice(0,1)
    var full = fl.toLocaleUpperCase() + '. ' + words[1]
    return full
    }
    else
    {
      return words[0]
    }
  }
  else return taxname
}



const WorkspaceCatalogue: React.FC<WorkspaceCatalogueProps> = (prop: WorkspaceCatalogueProps) => {


  useEffect(() => {
  console.log(prop.structures)
    return () => {
    }
  }, [prop.structures])



  return !prop.loading ? (
    <div className="workspace-catalogue-grid">
      <div className="wspace-catalogue-filters-tools">

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
        <StructureFilters />
      </div>

      <Grid container item xs={12} spacing={3}>
        {/* {
        
        structures.map((x, i) => (

          <Grid item>
            <StructHero {...x} key={i} />
          </Grid>

        ))} */}
      </Grid>
    </div>
  ) : (
    <LoadingSpinner annotation="Fetching data..." />
  );
};

const mapstate = (state: AppState, ownprops: OwnProps): ReduxProps => ({
  structures: state.Data.RibosomeStructures.StructuresResponse,
  loading        : state.Data.RibosomeStructures.Loading,
  globalFilter   : state.UI.state_Filter.filterValue,
});

export default connect(mapstate, null)(WorkspaceCatalogue);



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
      <Divider />
        <ListItem key={"search"}>
          <SearchField  />
        </ListItem>
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



