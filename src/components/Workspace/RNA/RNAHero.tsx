import { RNAProfile } from './RNACatalogue'
import React from 'react'
import { Link } from 'react-router-dom';
import './RNAHero.css'

const RNAHero = ({rna}:{rna:RNAProfile}) => {
  const truncate = (str:string) =>{
      return str.length > 40 ? str.substring(0, 15) + "..." : str;
  }

  return <div className="rna-hero">
      <p><span className='rna-hero-title' style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>{truncate(rna.description)}</span></p>
      <p>Parent structure: <Link to={`/catalogue/${rna.parent}`}>{rna.parent}</Link></p>
      <p>RCSB strand id: {rna.strand}</p>
      <p>AA Length: {rna.length}</p>
      <p>Tax Id:{rna.orgid[0]} </p>
<p>Name: {rna.orgname[0]}</p>

  </div>;
}

export default RNAHero
