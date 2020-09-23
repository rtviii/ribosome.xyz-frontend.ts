import React from "react";
import * as rts from "./../../../redux/RibosomeTypes";
import "./RNAHero.css";

const RNAHero = (data: rts.rRNA) => {
  return (
    <div className="RNAHero">
      Chain: {data._PDBChainId}
      <div className='rna-description'>
        Description: {data.description}
      </div>
    </div>
  );
};

export default RNAHero;
