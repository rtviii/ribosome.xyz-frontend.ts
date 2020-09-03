import React from "react";
import infoicon from "./info.svg";
import "./StructHero.css";
import { RibosomeStructure } from "../../../redux/RibosomeTypes";
import { useSelector } from "react-redux";
import { AppState } from "../../../redux/store";
import { Link } from "react-router-dom";

interface OwnProps {
  pdbid: string;
}

interface ActionProps {}
// type StructHeroProps = OwnProps | RibosomeStructure | ActionProps;

const StructHero = ({ pdbid }: { pdbid: string }) => {
  var structdata: any = useSelector((S: AppState) => {
    return S.Data.RibosomeStructures;
  });

  interface strdata {
    pub: string;
    res: string;
    spec: string;
    kingdom: "a" | "b" | "e";
  }
  // const str: strdata = structdata;
  var kingdoms = {
    a: ["Archea", "lightblue"],
    b: ["Bacteria", "green"],
    e: ["Eukarya", "orange"],
  };

  return (
    <>
      <div
        // className={`struct-hero ${pdbid} ${str.kingdom}`}
        id={`_struct_${pdbid}`}
      >
        <a className="tooltip">
          <img src={infoicon} className="tt_icon" alt="tooltip" />
          <div className="tt_content">
            {/* <p>Nomenclature Coverage : {nomenclatureCoverage}</p>
            <p>Protein Chains : {proteincount}</p>
            <p>RNA Chains : {rnacount}</p>
            <p>Deposition: {str.pub}</p> */}
          </div>
        </a>

        <Link to={`/catalogue/${pdbid}`}>
          <div className="pdbid_title">{pdbid}</div>
          <div className="hero_annotations">
            {/* <p className="p_annot resolution">Resolution: {str.res}</p> */}
            {/* <p className="p_annot species">
              {str.spec} |{" "}
              <span style={{ color: kingdoms[str.kingdom][1] }}>
                {kingdoms[str.kingdom][0]}
              </span>
            </p> */}
          </div>
        </Link>
      </div>
    </>
  );
};

export default StructHero;
