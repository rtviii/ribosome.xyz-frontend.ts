import React, { useContext, useEffect, createContext } from "react";
import "./RibosomalProteinHero.css";
import { Link } from "react-router-dom";
import downicon from "./download.png";
import fileDownload from "js-file-download";
import { getNeo4jData } from "../../../redux/Actions/getNeo4jData";
import { PageContext, PageContexts } from "../../Main";
import { RibosomalProtein } from "../../../redux/RibosomeTypes";

// interface props {
//   pdbid            : string;
//   _PDBChainId      : string;
//   _UniprotAccession: string;
//   _PDBName         : string;
//   surface_ratio    : number | null;
//   description      : string;
//   nomenclature     : Array<string>;
//   _PFAMFamilies    : Array<string>;
// }

const RibosomalProteinHero = (data: RibosomalProtein, pdbid:string) => {
  const downloadsubchain = (pdbid: string, cid: string) => {
    getNeo4jData("neo4j", {
      endpoint: "get_pdbsubchain",
      params: { chainid: cid, structid: pdbid },
    }).then(resp => {
      fileDownload(resp.data, `${pdbid}_subchain_${cid}`);
    }, error=>{
      alert("This chain is unavailable. This is likely an issue with parsing the given struct.\nTry another struct!")
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
        <p className="header-chain"> Strand Id</p>
        <p className="header-nom">BanClass</p>  
        <p className="header-properties">Properties</p>

        <p className="chain"> {data.strand_id}</p>
        <div className="nom">
          {" "}
          <Link to={`/rps/${data.nomenclature[0]}`}> {data.nomenclature}</Link>
        </div>
        <div className="properties">
          <p>Name: {data.pfam_descriptions}</p>

          <p>
            Uniprot:
            <a
              href={ data.uniprot_accession? `https://www.uniprot.org/uniprot/${data.uniprot_accession}` : ""}
            >
              {data.uniprot_accession}
            </a>
          </p>

           {/* <p>Description: {data.description}</p> */}
          <p>Surface Ratio : {data.surface_ratio? data.surface_ratio.toFixed(2) : "NaN" }</p>
        </div>
      </div>
      <div
        className="chain-download"
        onClick={() => {
          downloadsubchain(pdbid, data.strand_id);
        }}
      >
        <img src={downicon} className="down_icon" />
      </div>
    </div>
  );
};

export default RibosomalProteinHero;
