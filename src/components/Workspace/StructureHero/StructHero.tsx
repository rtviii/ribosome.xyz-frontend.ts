import React from "react";
import infoicon from "./../../../static/info.svg";
import "./StructHero.css";
import { RibosomeStructure } from "../../../redux/RibosomeTypes";
import { useSelector } from "react-redux";
import { AppState, store } from "../../../redux/store";
import { parseKingdomOut } from "./../Display/WorkspaceCatalogue";
import { Link } from "react-router-dom";
import RibosomalProteinHero from "../RibosomalProteins/RibosomalProteinHero";
import { fromPairs } from "lodash";


const StructHero: React.FC<{
  struct: RibosomeStructure;
  protCount: number;
  rnaCount: number;
  ligs: string[];
}> = props => {
  console.log(props.struct._PDBId, props.ligs);
  
  const struct: RibosomeStructure = props.struct;
  return (
      <div
        className={`struct-hero ${struct._PDBId} `}
        id={`_struc_${struct._PDBId}`}
      >


        <Link to={`/catalogue/${struct._PDBId}`}>
          <div className="pdbid_title">{struct._PDBId}</div>
        </Link>
        <div className="hero_annotations">
          <p className="p_annot resolution">Resolution: {struct.resolution} Å</p>
          <p className="p_annot expMethod">Method: {struct.expMethod}</p>
          <p className="p_annot resolution">Publication: {struct.pdbx_database_id_DOI}</p>
          <p className="p_annot resolution">Site: {struct.site}</p>
          <p className="p_annot protCount">Number of proteins: {props.protCount}</p>
          <p className="p_annot rnaCount">Number of rRNAs: {props.rnaCount}</p>
          <p className="p_annot ligands"> Ligands: {props.ligs} </p>

          <p className="p_annot species">Organism: {struct._organismName}</p>
        </div>
        <a className="tooltip">
          <img src={infoicon} className="tt_icon" alt="tooltip" />
          <div className="tt_content">
            <p>Deposition: {struct.authors}</p>
          </div>
        </a>
      </div>
  );
};
export default StructHero;
