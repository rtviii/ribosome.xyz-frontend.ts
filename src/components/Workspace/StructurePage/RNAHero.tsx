import React from "react";
import * as rts from "./../../../redux/RibosomeTypes";
import "./RNAHero.css";

const RNAHero = (data: rts.rRNA) => {
  return (
    <div className="RNAHero">
      Chain: {data.entity_poly_strand_id}
      <div className='rna-description'>
        Description: {data.rcsb_pdbx_description}
      </div>
    </div>
  );
};

export default RNAHero;
