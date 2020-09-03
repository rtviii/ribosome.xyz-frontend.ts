import React from "react";
import "./RibosomalProteinHero.css";
import { Link } from "react-router-dom";
import Axios from "axios";
import fileDownload from "js-file-download";
import { getNeo4jData } from "./../../../redux/Actions/getNeo4jData";

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
    getNeo4jData("neo4j", {
      endpoint: "get_pdbsubchain",
      params: { chainid: cid, structid: pdbid },
    }).then(resp => {
      fileDownload(resp.data, `${pdbid}_subchain_${cid}`);
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
