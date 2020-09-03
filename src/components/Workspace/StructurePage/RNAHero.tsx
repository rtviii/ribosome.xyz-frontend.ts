import React from "react";
import * as rts from './../../../redux/RibosomeTypes'
import './RNAHero.css'

const RNAHero = (data: rts.rRNA) => {
  return (
    <div className='RNAHero'>
      <div>{data._PDBChainId}</div>
      <p>{data.description}</p>
    </div>
  );
};

export default RNAHero;
