import { RNAProfile } from './RNACatalogue'
import React from 'react'
import { Link } from 'react-router-dom';
import downicon from "./../../../static/download.png"
import {getNeo4jData} from './../../../redux/Actions/getNeo4jData'
import './RNAHero.css'
import fileDownload from "js-file-download";

const RNAHero = ({rna}:{rna:RNAProfile}) => {
  const truncate = (str:string) =>{
  return str.length > 40 ? str.substring(0, 15) + "..." : str;}

  const parseAndDownloadChain = (pdbid: string, cid: string) => {
    var duplicates = cid.split(",");
    if (duplicates.length > 1) {
      var cid = duplicates[0];
    }
    getNeo4jData("static_files", {
      endpoint: "cif_chain",
      params: { structid: pdbid, chainid: cid },
    }).then(
      resp => {
        fileDownload(resp.data, `${pdbid}_${cid}.cif`);
      },
      error => {
        alert("This chain is unavailable. This is likely an issue with parsing the given struct.\nTry another struct!" + error);
      }
    );
  };

  return <div className="rna-hero">
      <button id="download-rna"  className='down-rna-button' onClick={()=>{ parseAndDownloadChain(rna.parent,rna.strand) }}>
          
        <img
          id="download-rna"
          src={downicon}
          alt="download-rna"
        />
      </button>
      <p><span className='rna-hero-title' style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>{truncate(rna.description)}</span></p>
      <p>Parent structure: <Link to={`/structs/${rna.parent}`}>{rna.parent}</Link></p>
      <p>RCSB strand id: {rna.strand}</p>
      <p>AA Length: {rna.length}</p>
      <p>Tax Id:{rna.orgid[0]} </p>
    <p>Name: {rna.orgname[0]}</p>

  </div>;
}

export default RNAHero
