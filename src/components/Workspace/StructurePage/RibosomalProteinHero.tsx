import React from "react";
import * as rts from "./../../../redux/types/ribTypes";
import "./RibosomalProteinHero.css";
import { Link } from "react-router-dom";
import Axios from "axios";
import fileDownload from "js-file-download";
const BACKEND = process.env.REACT_APP_DJANGO_URL;

interface props {
  pdbid: string;
  _PDBChainId: string;
  _UniprotAccession: string;
  _PDBName: string;
  surface_ratio: number | null;
  description: string;
  nomenclature: Array<string>;
  _PFAMFamilies: Array<string>;
}
const RibosomalProteinHero = (data: props) => {
  const downloadsubchain = (pdbid: string, cid: string) => {
    const params = { structid: pdbid, chainid: cid };
    Axios.get(`${BACKEND}/neo4j/get_pdbsubchain/`, { params }).then(r => {
      fileDownload(r.data, "chain.pdb");
    });
  };

  return (
    <div className="ribosomal-protein-hero">
      <Link
        className="link"
        to={
          data.nomenclature.length > 0 ? `/rps/${data.nomenclature[0]}` : `/rps`
        }
      >
        <div className="ban-nom">{data.nomenclature}</div>
      </Link>

      <p className="chainname"> {data._PDBChainId}</p>
      <div className="main-properties">
        <p>Name : {data._PDBName}</p>
        <p>Uniprot Accession : {data._UniprotAccession}</p>
        <p>Description: {data.description}</p>
        <p>Surface Ratio : {data.surface_ratio}</p>
      </div>
      <div
        className="chain-download"
        onClick={() => {
          downloadsubchain(data.pdbid, data._PDBChainId);
        }}
      >
        Download
      </div>
    </div>
  );
};

export default RibosomalProteinHero;
