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

  useEffect(() => {
    console.log("Ribosomal Prot Context", context);
    return () => {};
  }, [context]);

  return (
    <div className="ribosomal-protein-hero">
      <Link
        className="link"
        to={
          data.nomenclature.length > 0 ? `/rps/${data.nomenclature[0]}` : `/rps`
        }
      >
      </Link>

      <div className="chain-properties">
        <div className="ban-nom">{data.nomenclature}</div>
        <div className="chain">
          Chain
          <p className="chainname"> {data._PDBChainId}</p>
        </div>

        <div className="main-properties">
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
