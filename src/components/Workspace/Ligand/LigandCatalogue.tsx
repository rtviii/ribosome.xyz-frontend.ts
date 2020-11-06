import { flattenDeep } from "lodash";
import React, { useEffect, useState } from "react";
import { getNeo4jData } from './../../../redux/Actions/getNeo4jData';
import "./LigandCatalogue.css";
import { Ligand } from "./../../../redux/RibosomeTypes";
import { Link } from "react-router-dom";
import {Card, OverlayTrigger, Popover} from 'react-bootstrap'
import LoadingSpinner from "../../Other/LoadingSpinner";
import { Accordion } from "react-bootstrap";
import { Button } from "react-bootstrap";

type LigandAssocStruct ={
    struct : string;
    orgname: string[];
    orgid  : number[];
}
type LigandResponseShape = {
  ligand   : Ligand;
  presentIn: Array<LigandAssocStruct>;
};

const truncate = (str:string) =>{
    return str.length > 45 ? str.substring(0, 40) + "..." : str;
}
  const filterByorg = (

    structs: LigandAssocStruct[],
    specFilter: number[]
  ): LigandAssocStruct[] => {
    if (specFilter.length===0){
      return structs
    }
    var filt = structs.filter(struct => {
      for (var orgid of struct.orgid) {
        if (specFilter.includes(orgid)) {
          return true;
        }
      }
      return false;
    });
    return filt;
  };

const popoverstructs= (data:LigandResponseShape, specFilter: number[]) =>{


  return (
    <Popover id="popover-structs">
      <Popover.Title as="h3">Structures</Popover.Title>
      <Popover.Content>
        <div className="ligand-structs-popover">
          {filterByorg(data.presentIn, specFilter).map(
            (struct: LigandAssocStruct) => (
              <li>
                <div className='assoc-struct-span'>

                  <Link to={`/catalogue/${struct.struct}`}>
                    <span>{struct.struct}</span>
                  </Link>
                  <span>{truncate( struct.orgname[0] )}</span>
                </div>
              </li>
            )
          )}
        </div>
      </Popover.Content>
    </Popover>
  );
}
const LigandHero = ({data, speciesFilter}:{ data: LigandResponseShape, speciesFilter: number[] }) => {
  const truncate = (str:string) =>{
      return str.length > 15 ? str.substring(0, 7) + "..." : str;
  }
  const l = data.ligand;
  return (
    <div className="ligand-hero">
      <div className="ligand-hero-title">
        <Link to={`/interfaces/${null}/ligand/${l.chemicalId}`}>{l.chemicalId}</Link> (<span style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>{truncate(l.chemicalName)}</span>)
      </div>
      <p>Weight: {l.formula_weight} ug</p>
       <OverlayTrigger 
        rootClose trigger={'click'}
        placement='bottom'
        overlay={popoverstructs(data, speciesFilter)}><div id='lig-str-present'>Associated structures({filterByorg( data.presentIn, speciesFilter ).length})</div></OverlayTrigger>
    </div>
  );
};

const LigandCatalogue = () => {
  const [ligs, setligs]     = useState<LigandResponseShape[]>([]);
  const [ionsOn, setionsOn] = useState(true);

  const [organismsAvailable, setorganismsAvailable] = useState({})

  useEffect(() => {
    const orgsdict: { [id: string]: { names:string[], count:number } } = {};

    ligs.map(ligclass =>{
      var structs:LigandAssocStruct[] = ligclass.presentIn

      structs.map(str=>{
        var ids:number[]   = str.orgid
        var names:string[] = str.orgname

        ids.forEach((id,index)=>{
          if (!Object.keys(orgsdict).includes(id.toString())){
            orgsdict[id] ={
              names:[],
              count: 1
            }
            orgsdict[id].names = [...orgsdict[id].names, ...names]
          }else{
            orgsdict[id].names = [...orgsdict[id].names, ...names]
            orgsdict[id].count+=1
          }

      })
    })})

    setorganismsAvailable(orgsdict)
  }, [ligs]);
  useEffect(() => {
    getNeo4jData("neo4j", { endpoint: "get_all_ligands", params: null }).then(
      r => {
        var ligs = flattenDeep(r.data) as LigandResponseShape[];
        console.log(ligs);
        setligs(ligs);
      }
    );
    return () => {};
  }, []);

   const transformToShortTax = (taxname:string) =>{
    var words = taxname.split(' ') 
    if ( words.length>1 ){
    var fl =words[0].slice(0,1)
    var full = fl.toLocaleUpperCase() + '. ' + words[1]
    return full
    }else{
      return words[0]
    }
  }

  const filterByOrg = (
    ligs: LigandResponseShape[],
    filters: number[]
  ): LigandResponseShape[] => {
    if (filters.length ===0){
      return ligs
    }
    var ligs = ligs.filter(l => {
      var ligandstructs = l.presentIn.reduce(
        (accumulator: number, curr: LigandAssocStruct) => {
          for (var id of curr.orgid) {
            if (filters.includes(id)) {
              return accumulator + 1;
            }
          }
          return accumulator;
        },
        0
      );
      return ligandstructs;
    });
    return ligs;
  };

  const truncate = (str: string) => {
    return str.length > 20 ? str.substring(0, 15) + "..." : str;
  };

  const [ligfilter, setligfilter] = useState<string>("")
  const [organismFilter, setorganismFilter] = useState<Array<number>>([])
  const searchByName = (l:LigandResponseShape[], search:string)=>{
    return l.filter(l =>
      (l.ligand.chemicalId + l.ligand.chemicalName + l.ligand.pdbx_description)
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase())
    );
  }

  return (
    <div className="ligand-catalogue">
      <div className="filters-tools">
        Hide Ions: <input type="checkbox" onChange={e => setionsOn(!ionsOn)} />

          <div className="ligands-search">

Search:
            <input
              value={ligfilter}
              onChange={e => {
                var value = e.target.value;
                setligfilter(value);
              }}
            />
          </div>
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
                                var id      = e.target.id;
                                if (!checked) {
                                  setorganismFilter(
                                    organismFilter.filter(
                                      str => !(str.toString() === id)
                                    )
                                  );
                                } else {
                                  setorganismFilter([
                                    ...organismFilter,
                                    parseInt(id)
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

      <div className="ligand-catalogue-grid">
        {ligs.length > 0 ? (
          ionsOn ? (
            searchByName( filterByOrg(ligs, organismFilter), ligfilter).map((l: LigandResponseShape) => <LigandHero data={l} speciesFilter={organismFilter} />)
          ) : (
            searchByName(filterByOrg(ligs, organismFilter), ligfilter).filter(l => !l.ligand.chemicalName.toLocaleLowerCase().includes("ion"))
                .map((l: LigandResponseShape) => <LigandHero data={l} speciesFilter={organismFilter} />)
              )
          ) : (
          <LoadingSpinner annotation='Fetching data...' />
        )}
      </div>
    </div>
  );
};

export default LigandCatalogue;
