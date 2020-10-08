import { flattenDeep } from "lodash";
import React, { useEffect, useState } from "react";
import { getNeo4jData } from "./../../redux/Actions/getNeo4jData";
import "./LigandCatalogue.css";
import { Ligand } from "./../../redux/RibosomeTypes";
import { Link } from "react-router-dom";

const LigandHero = (data: Response) => {
  const l = data.ligand;
  return (
    <div className="ligand-hero">
      <h4>{l.chemicalId}</h4>
      <p>Chemical Name : {l.chemicalName}</p>
      <p>Formula Weight: {l.formula_weight}</p>
      <p>Present in : <a className='tooltip'>

Structures
<div className="tooltip-content-ligand-catalogue">
  {data.presentIn.map(pdbid=> <Link to={ `/catalogue/${pdbid}` } ><p>{pdbid}</p></Link>)}

</div>

        </a></p>
    </div>
  );
};

type Response = {
  ligand: Ligand;
  presentIn: string[];
};
const LigandCatalogue = () => {
  const [ligs, setligs] = useState<Response[]>([]);
  const [ionsOn, setionsOn] = useState(true);
  useEffect(() => {
    getNeo4jData("neo4j", { endpoint: "get_all_ligands", params: null }).then(
      r => {
        var ligs = flattenDeep(r.data) as Response[];
        setligs(ligs);
        console.log(ligs);
      }
    );
    return () => {};
  }, []);
  return (
    <div className="ligand-catalogue">
      <div className="filters-tools">
        Hide Ions: <input type="checkbox" onChange={e => setionsOn(!ionsOn)} />
      </div>

      <div className="ligands-catalogue-structs">
        <h3>Ligands and Smaller Molecules</h3>

        <ul>
          {ionsOn
            ? ligs.map((l: Response) => <LigandHero {...l} />)
            : ligs
                .filter(
                  l =>
                    !l.ligand.chemicalName.toLocaleLowerCase().includes("ion")
                )
                .map((l: Response) => <LigandHero {...l} />)}
        </ul>
      </div>
    </div>
  );
};

export default LigandCatalogue;
