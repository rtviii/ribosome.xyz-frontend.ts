import React from "react";
import infoicon from "./info.svg";
import "./StructHero.css";
import { RibosomeStructure } from "../../../redux/RibosomeTypes";
import { useSelector } from "react-redux";
import { AppState, store } from "../../../redux/store";
import { parseKingdomOut } from "./../Display/WorkspaceCatalogue";
import { Link } from "react-router-dom";
import RibosomalProteinHero from "../RibosomalProteins/RibosomalProteinHero";
import { fromPairs } from "lodash";

// type StructHeroProps = OwnProps & RibosomeStructure & ActionProps;

const StructHero: React.FC<RibosomeStructure> = prop => {
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
        className={`struct-hero ${prop._PDBId} `}
        
        id={`_struct_${prop._PDBId}`}
      >
        <a className="tooltip">
          <img src={infoicon} className="tt_icon" alt="tooltip" />
          <div className="tt_content">
            <p>Protein Chains : {prop.proteinNumber}</p>
            <p>RNA Chains : {prop.rRNANumber}</p>
            <p>Deposition: {prop.publication}</p>
          </div>
        </a>

        <Link to={`/catalogue/${prop._PDBId}`}>
          <div className="pdbid_title">{prop._PDBId}</div>
          <div className="hero_annotations">
            <p className="p_annot resolution">Resolution: {prop.resolution}</p>
            <p className="p_annot species">
              {prop._species} | {parseKingdomOut(prop._species)}
            </p>
          </div>
        </Link>
      </div>
    </>
  );
};

// const msp = (state:AppState, OwnProps:OwnProps):RibosomeStructure =>({
//   StructureData:  state.Data.RibosomeStructures.Structures.filter(x => x._PDBId === OwnProps.pdbid)[0]
// })
export default StructHero;
