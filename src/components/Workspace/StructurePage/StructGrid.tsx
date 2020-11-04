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
        
        <h4>Large Subunit Proteins</h4>
        {lsu
          .map((x, j) => (
            <RibosomalProteinHero key={j} data={x} pdbid={pdbid} />
          ))}
      </div>

      <div className="struct-grid-ssu">
        <h4>Small Subunit Proteins</h4>
      {ssu
        .map((x, j) => (
          <RibosomalProteinHero key={j} data={x} pdbid={pdbid}  />
        ))}
      </div>
      <div className="struct-grid-other">
        <h4>Other/Undetermined</h4>
      {other
        .map((x, j) => (
          <RibosomalProteinHero key={j} data={x} pdbid={pdbid} />
        ))}
      </div>
    </div>
  );
};

export default StructGrid;
