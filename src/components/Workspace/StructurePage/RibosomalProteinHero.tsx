import React from "react";
import * as rts from "./../../../redux/types/ribTypes";
import './RibosomalProteinHero.css'

const RibosomalProteinHero = (data: rts.RibosomalProtein) => {
  return (
    <div className="ribosomal-protein-hero">

      <div className="ban-nom">{data.nomenclature}</div>
      <div className="pdb-name">{data._PDBName}</div>
      {/* <h5>{data.nomenclature}</h5>
      <h4>Chain {data._PDBChainId}</h4>
      <div className="main-properties">
                Name       : {data._PDBName}
        Uniprot Accession  : {data._UniprotAccession}
                Description: {data.description}
        Surface Ratio      : {data.surface_ratio}
      </div> */}
    </div>
  );
};

export default RibosomalProteinHero;
