import React from "react";
import "./StructHero.css";
import { RibosomeStructure } from "../../../redux/RibosomeTypes";
import { Link } from "react-router-dom";
import { OverlayTrigger } from "react-bootstrap";
import { Tooltip } from "react-bootstrap";
import linkicon from './../../../static/linkicon.png'



const truncate = (str:string) =>{
    return str.length > 25 ? str.substring(0, 23) + "..." : str;
}

const StructHero: React.FC<{
  struct : RibosomeStructure;
  ligands: string[];
  rps    : Array<{ noms: string[]; strands: string }>;
  rnas   : string[];
}> = props => {
  const struct: RibosomeStructure = props.struct;
  return (
    <div
      className={`struct-hero ${struct.rcsb_id} `}
      id={`_struc_${struct.rcsb_id}`}
    >
      <div className="struct-hero-header">
        <div id="header-description">
          <div className="pdbid_title">
            <Link id="pdb-title-a" to={`/structs/${struct.rcsb_id}`}>
              <div>{struct.rcsb_id}</div>
            </Link>
          </div>

          <div id="citation-doi">
            <div id="title-description">{struct.citation_title}</div>
            <div className="doi-pdb">
              <a href={`https://doi.org/${struct.citation_pdbx_doi}`}>
                {struct.citation_pdbx_doi}
              </a>

              <div className="pdblink">
                <a href={`https://www.rcsb.org/structure/${struct.rcsb_id}`}>
                  PDB
                  <img id="linkicon" alt="linkicon" src={linkicon} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div id="header-reso-year">
          <div className="experimental_method">
            <span id="struct-reso">{`[${struct.resolution} Å] via `} </span>
              <p className="experimental_method_value">{struct.expMethod}</p>
          </div>
          <span id="struct-year">{struct.citation_year}</span>
        </div>
      </div>

      <table id="struct-hero-table">
        <thead>
          <tr>
            <th># Proteins</th>
            <th># rRNA</th>
            <th>Ligands</th>
            <th>Organisms</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{props.rps.length}</td>
            <td>{props.rnas.length}</td>
            <td>
              {props.ligands.map((l, i) => {
                return i === props.ligands.length - 1 ? (
                  <span key={"span1" + l + i}>
                    <Link key={"link1" + l + i} to={`/ligands`}>
                      {l}
                    </Link>
                  </span>
                ) : (
                  <span key={"span2" + l + i}>
                    <Link key={"link2" + l + i} to={`/ligands`}>
                      {l}
                    </Link>
                    ,
                  </span>
                );
              })}{" "}
            </td>

            <td>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                {struct._organismName.length > 1
                  ? truncate(
                      struct._organismName.reduce((acc, curr) => {
                        return acc.concat(curr, ",");
                      }, "")
                    )
                  : truncate(struct._organismName[0])}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default StructHero;
