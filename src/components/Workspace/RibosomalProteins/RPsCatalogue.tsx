import React from "react";
import fileDownload from 'js-file-download'
import "./RPsCatalogue.css";
import Axios from "axios";

const BACKEND = process.env.REACT_APP_DJANGO_URL
const RPsCatalogue = () => {
  const getfile = () => {
    Axios.get(`${BACKEND}/neo4j/get_pdbsubchain/`).then(r => {
        fileDownload(r.data, 'yourchain.pdb')
    });
  };
  return (
    <div>
      <button onClick={()=>getfile()}>Dowload protein</button>
      "Ribosomal Proteins Catalogue"    
    </div>
  );
};

export default RPsCatalogue;
