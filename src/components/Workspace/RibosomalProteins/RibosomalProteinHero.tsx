import React, { useContext, useEffect, createContext } from "react";
import "./RibosomalProteinHero.css";
import { Link } from "react-router-dom";
import downicon from "./download.png";
import fileDownload from "js-file-download";
import { getNeo4jData } from "../../../redux/Actions/getNeo4jData";
import { PageContext, PageContexts } from "../../Main";

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
  const context: PageContexts = useContext(PageContext);
  return (
    <div className="ribosomal-protein-hero">
      <Link
        className="link"
        to={
          data.nomenclature.length > 0 ? `/rps/${data.nomenclature[0]}` : `/rps`
        }
      ></Link>

      <div className="chain-properties">
        <p className="header-chain"> Chain</p>
        <p className="header-nom">BanClass</p>
        <p className="header-properties">Properties</p>

        <p className="chain"> {data._PDBChainId}</p>
        <div className="nom">{data.nomenclature}</div>
        <div className="properties">
          <p>Name : {data._PDBName}</p>
          <p>Uniprot Accession : {data._UniprotAccession}</p>
          <p>Description: {data.description}</p>
          <p>Surface Ratio : {data.surface_ratio}</p>
        </div>
      </div>
      <div
        className="chain-download"
        onClick={() => {
          downloadsubchain(data.pdbid, data._PDBChainId);
        }}
      >
        <img src={downicon} className="down_icon" />
      </div>
    </div>
  );
};

export default RibosomalProteinHero;
