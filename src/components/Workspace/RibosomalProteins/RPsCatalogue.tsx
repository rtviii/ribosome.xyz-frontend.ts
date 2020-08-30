import React from "react";
import fileDownload from 'js-file-download'
import "./RPsCatalogue.css";
import Axios from "axios";

const RPsCatalogue = () => {
  const getfile = () => {
    Axios.get("http://127.0.0.1:8000/neo4j/get_pdbsubchain/").then(r => {
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
