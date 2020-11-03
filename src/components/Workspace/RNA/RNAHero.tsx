
import { RNAProfile } from './RNACatalogue'
import React from 'react'
import { Link } from 'react-router-dom';

const RNAHero = (rna:RNAProfile) => {
  const truncate = (str:string) =>{
      return str.length > 15 ? str.substring(0, 15) + "..." : str;
  }

  return <div className="rna-hero">
      <p>Description: <span style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>{truncate(rna.description)}</span></p>
      <p>Parent structure: <Link to={`/catalogue/${rna.parent}`}>{rna.parent}</Link></p>
      <p>RCSB strand id: {rna.strand}</p>
      <p>AA Length: {rna.length}</p>
  </div>;
}

export default RNAHero
