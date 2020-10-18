import React from "react";
import "./StructHero.css";
import { RibosomeStructure } from "../../../redux/RibosomeTypes";
import { Link } from "react-router-dom";
import { OverlayTrigger } from "react-bootstrap";
import { Tooltip } from "react-bootstrap";

const MethodSwitch = (r: RibosomeStructure) => {
  var record;
  if (r.expMethod.toUpperCase() == "X-RAY DIFFRACTION") {
    record = {
      diffrn_source_details: r.diffrn_source_details,
      diffrn_source_pdbx_synchrotron_beamline:
        r.diffrn_source_pdbx_synchrotron_beamline,
      diffrn_source_pdbx_synchrotron_site:
        r.diffrn_source_pdbx_synchrotron_site,
      diffrn_source_pdbx_wavelength: r.diffrn_source_pdbx_wavelength,
      diffrn_source_pdbx_wavelength_list: r.diffrn_source_pdbx_wavelength_list,
      diffrn_source_source: r.diffrn_source_source,
      diffrn_source_type: r.diffrn_source_type,
    };
  } else if (r.expMethod.toUpperCase() == "ELECTRON MICROSCOPY") {
    record = {
      cryoem_exp_detail: r.cryoem_exp_detail,
      cryoem_exp_algorithm: r.cryoem_exp_algorithm,
      cryoem_exp_resolution_method: r.cryoem_exp_resolution_method,
      cryoem_exp_resolution: r.cryoem_exp_resolution,
      cryoem_exp_num_particles: r.cryoem_exp_num_particles,
      cryoem_exp_magnification_calibration:
        r.cryoem_exp_magnification_calibration,
    };
  } else {
    record = {};
  }
  return (
    <table className="methods-table">
      <tr>
        <th>Record</th>
        <th>Value</th>
      </tr>
      {Object.entries(record).map(r => (
        <tr>
          <td>{r[0]}</td>
          <td>
            {["", null, undefined].includes(r[1] as any)
              ? "Not recorded"
              : r[1]}
          </td>
        </tr>
      ))}
    </table>
  );
};

const StructHero: React.FC<{
  struct : RibosomeStructure;

  ligands: string[],
  rps    : Array<{noms:string[], strands:string}>,
  rnas   : string[]
}> = props => {
  const struct: RibosomeStructure = props.struct;
  return (
    <div
      className={`struct-hero ${struct.rcsb_id} `}
      id={`_struc_${struct.rcsb_id}`}
    >
      <Link to={`/catalogue/${struct.rcsb_id}`}>
        <div className="pdbid_title">{struct.rcsb_id}</div>
      </Link>

      <div className="hero_annotations">
        <p className="p_annot">Resolution: {struct.resolution} Å</p>
        <div className="experimental_method">
          <p>Method: </p>
          <OverlayTrigger
            key="bottom-overlaytrigger"
            placement="bottom"
            overlay={
              <Tooltip id="tooltip">
                <MethodSwitch {...struct} />
              </Tooltip>
            }
          >
            <p className="experimental_method_value">{struct.expMethod}</p>
          </OverlayTrigger>
        </div>
      </div>

      <div className="p_annot">
        <p> Publication:</p>
        <p>
          <a href={`https://www.doi.org/${struct.citation_pdbx_doi}`}>
            {struct.citation_pdbx_doi}
          </a>
        </p>
      </div>

      <div className="p_annot">Number of proteins: {props.rps.length}</div>
      <div className="p_annot">Number of rRNAs: {props.rnas.length}</div>
      <div className="p_annot"> Ligands: {props.ligands} </div>
      <div className="p_annot">Organism: {struct._organismName}</div>
    </div>
  );
};
export default StructHero;
