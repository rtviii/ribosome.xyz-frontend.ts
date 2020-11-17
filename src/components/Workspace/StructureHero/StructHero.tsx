import React from "react";
import "./StructHero.css";
import { RibosomeStructure } from "../../../redux/RibosomeTypes";
import { Link } from "react-router-dom";
import { OverlayTrigger } from "react-bootstrap";
import { Tooltip } from "react-bootstrap";

const MethodSwitch = (r: RibosomeStructure) => {
  var record;
  console.log(
    r.rcsb_external_ref_id,
    r.rcsb_external_ref_link,
    r.rcsb_external_ref_type
  )

  if (r.expMethod.toUpperCase() === "X-RAY DIFFRACTION") {
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
  } else if (r.expMethod.toUpperCase() === "ELECTRON MICROSCOPY") {
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
      {Object.entries(record).map(( r,i ) => (
        <tr key={`0021${i}${r[0]}`}>
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
          <Link to={`/catalogue/${struct.rcsb_id}`}>
            <div className="pdbid_title">{struct.rcsb_id}</div>
          </Link>

          <span id="title-description">{struct.citation_title}</span>
        </div>

        <div id="header-reso-year">
          <div className="experimental_method">
            <span id="struct-reso">{`[${struct.resolution} Å] via `} </span>

            <OverlayTrigger
              key="bottom-overlaytrigger"
              placement="bottom"
              overlay={
                <Tooltip
                  style={{ backgroundColor: "black" }}
                  className="tooltip-bottom"
                  id="tooltip-bottom"
                >
                  <MethodSwitch {...struct} />
                </Tooltip>
              }
            >
              <p className="experimental_method_value">{struct.expMethod}</p>
            </OverlayTrigger>
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
                  <span key={'span1' + l + i}>
                    <Link key={'link1' + l + i}  to={`/ligands`}>
                      {l}
                    </Link>
                  </span>
                ) : (
                  <span key={'span2' + l + i}>
                    <Link key={'link2' +l + i} to={`/ligands`}>
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
                  ? truncate(struct._organismName.reduce((acc, curr) => {return acc.concat(curr, ",");}, ""))
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
