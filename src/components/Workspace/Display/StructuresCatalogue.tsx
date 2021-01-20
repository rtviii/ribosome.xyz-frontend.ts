import React, { useEffect, useState } from "react";import "./StructuresCatalogue.css";
import { connect  } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AppState } from "../../../redux/store";
// import StructHero from "../StructureHero/StructHero";
import { PageContext } from "../../Main";
import { AppActions } from "../../../redux/AppActions";
import LoadingSpinner  from '../../Other/LoadingSpinner'
import * as redux from '../../../redux/reducers/Data/StructuresReducer/StructuresReducer'
import { Accordion, Card } from "react-bootstrap";
import { Button } from "react-bootstrap";
import {md_files, ReactMarkdownElement } from './../../Other/ReactMarkdownElement'
import { getNeo4jData } from "../../../redux/Actions/getNeo4jData";
import {large_subunit_map} from './../../../static/large-subunit-map'
import {small_subunit_map} from './../../../static/small-subunit-map'
import Select from 'react-select'
import StructHero from './../../../materialui/StructHero'

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';


export function NestedGrid() {
  // const classes = useStyles();

  // function FormRow() {
  //   return (
  //     <React.Fragment>
  //       {[
  //         "",
  //         "",
  //         "",
  //         "",
  //         "",
  //         "",
  //         "",
  //         "",
  //         "",
  //         "",
  //         "",
  //         "",
  //         "",
  //         "",
  //         "",
  //         "",
  //         "",
  //         "",
  //         "",
  //         "",
  //         "",
  //         "",
  //         "",
  //         "",
  //         "",
  //         "",
  //         "",
  //         "",
  //       ].map((_: any) => (
  //         <Grid item xs={2}>
  //           <StructHero />
  //         </Grid>
  //       ))}
  //     </React.Fragment>
  //   );
  // }

  // return (
  //   <div className={classes.root}>
  //       <Grid container item xs={12} spacing={2}>
  //         <FormRow />
  //       </Grid>
  //   </div>
  // );
}




const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }),
);



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

// Want to find structure by presence of multiple proteins


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

  const FormRow= ()=> {
    return (
      <React.Fragment>
        {[
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ].map((_: any) => (
          <Grid item xs={2}>
            <StructHero />
          </Grid>
        ))}
      </React.Fragment>
    );
  }
  const classes = useStyles();
  return !prop.loading ? (

      <div className="workspace-catalogue-grid">
        <div className="wspace-catalogue-filters-tools">
          <div className="wspace-search">
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
          </Accordion>
        </div>

    <div className={classes.root}>
        <Grid container item xs={12} spacing={2}>
          <FormRow />
        </Grid>
    </div>
        {/* <div className="workspace-catalogue-structs"> */}
          {/* <ReactMarkdownElement md={md_files.all.structs.structures} /> */}


          {/* {filterByPdbId(filterByProteinPresence( structures, structsWithProteins ).filter(filterByOrganism), pdbidFilter).map(
            (x, i) => (
              <StructHero {...x} key={i} />
            )
          )} */}

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
