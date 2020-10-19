import { flattenDeep } from "lodash";
import React, { useEffect, useState } from "react";
import { getNeo4jData } from './../../../redux/Actions/getNeo4jData';
import "./LigandCatalogue.css";
import { Ligand } from "./../../../redux/RibosomeTypes";
import { Link } from "react-router-dom";
import {OverlayTrigger, Popover} from 'react-bootstrap'
import LoadingSpinner from "../../Other/LoadingSpinner";

const popoverstructs= (data:Response ) =>{

  return <Popover id='popover-structs' contentEditable={ 'true' } >
   <Popover.Title as="h3">Structures</Popover.Title>
    <Popover.Content>
      <ul>
             {data.presentIn.map(( pdbid:string ) => (
               <Link to={`/catalogue/${pdbid}`}>
                 <li><a>{pdbid}</a></li>
               </Link>
             ))}
      </ul>
    </Popover.Content>

  </Popover>
}
const LigandHero = (data: Response) => {


  const truncate = (str:string) =>{
      return str.length > 15 ? str.substring(0, 7) + "..." : str;
  }

  const l = data.ligand;
  return (
    <div className="ligand-hero">
      <div className="ligand-hero-title">
        <Link to={`/ligands/${l.chemicalId}`}>{l.chemicalId}</Link> (<span style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>{truncate(l.chemicalName)}</span>)
      </div>
      <p>Weight: {l.formula_weight} ug</p>
       <OverlayTrigger 
        rootClose trigger={'click'}
        placement='right'
        overlay={popoverstructs(data)}><div id='lig-str-present'>Associated structures</div></OverlayTrigger>
        
    </div>
  );
};

type Response = {
  ligand: Ligand;
  presentIn: string[];
};
const LigandCatalogue = () => {
  const [ligs, setligs]     = useState<Response[]>([]);
  const [ionsOn, setionsOn] = useState(true);
  useEffect(() => {
    getNeo4jData("neo4j", { endpoint: "get_all_ligands", params: null }).then(
      r => {
        var ligs = flattenDeep(r.data) as Response[];
        console.log(ligs);
        setligs(ligs);
      }
    );
    return () => {};
  }, []);
  return (
    <div className="ligand-catalogue">
      <div className="filters-tools">
        Hide Ions: <input type="checkbox" onChange={e => setionsOn(!ionsOn)} />
      </div>

      <div className="ligand-catalogue-grid">
        {ligs.length > 0 ? (
          ionsOn ? (
            ligs.map((l: Response) => <LigandHero {...l} />)
          ) : (
            ligs
              .filter(
                l => !l.ligand.chemicalName.toLocaleLowerCase().includes("ion")
              )
              .map((l: Response) => <LigandHero {...l} />)
          )
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </div>
  );
};

export default LigandCatalogue;
