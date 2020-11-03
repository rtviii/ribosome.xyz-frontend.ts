import { flattenDeep } from "lodash";
import "./StructGrid.css";
import React, { useEffect, useState } from "react";
import RibosomalProteinHero from "../RibosomalProteins/RibosomalProteinHero";
import {
  Ligand,
  RibosomalProtein,
  rRNA,
} from "./../../../redux/RibosomeTypes";

const StructGrid = ({
  pdbid,
  protdata,
  rrnas,
  ligands,
}: {
  pdbid   : string;
  protdata: RibosomalProtein[];
  rrnas   : rRNA[];
  ligands : Ligand[];
}) => {

  const [lsu, setlsu]     = useState<RibosomalProtein[]>([])
  const [ssu, setssu]     = useState<RibosomalProtein[]>([])
  const [other, setother] = useState<RibosomalProtein[]>([])



  useEffect(() => {
    var lsu   = protdata.filter(x=> x.nomenclature.length === 1 && flattenDeep(x.nomenclature.map(name => { return name.match(/L/)})).includes('L') )
    var ssu   = protdata.filter(x=> x.nomenclature.length === 1 && flattenDeep(x.nomenclature.map(name => { return name.match(/S/)})).includes('S'))
    var other = protdata.filter(x=> ![...lsu,...ssu].includes(x))
    setlsu(lsu)
    setssu(ssu)
    setother(other)
  }, [protdata])
  return (
    <div className="struct-grid">
      <div className="struct-grid-lsu">
        
        <h3>Large Subunit</h3>
        {lsu
          .map((x, j) => (
            <RibosomalProteinHero key={j} data={x} pdbid={pdbid} />
          ))}
      </div>

      <div className="struct-grid-ssu">
        <h3>Small Subunit</h3>
      {ssu
        .map((x, j) => (
          <RibosomalProteinHero key={j} data={x} pdbid={pdbid}  />
        ))}
      </div>
      <div className="struct-grid-other">
        <h3>Other/Undetermined</h3>
      {other
        .map((x, j) => (
          <RibosomalProteinHero key={j} data={x} pdbid={pdbid} />
        ))}
      </div>
    </div>
  );
};

export default StructGrid;
