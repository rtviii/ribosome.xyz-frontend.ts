import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Ligand,
  RibosomalProtein,
  RibosomeStructure,
  rRNA,
} from "../../../redux/RibosomeTypes";
import "./StructurePage.css";
import RNAHero from "./../RNA/RNAHero";
import { getNeo4jData } from "../../../redux/AsyncActions/getNeo4jData";
import { flattenDeep } from "lodash";
import { connect } from "react-redux";
import { AppState } from "../../../redux/store";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../../../redux/AppActions";
import StructGrid from "./StructGrid";
import LoadingSpinner from './../../Other/LoadingSpinner'
import { Tooltip } from "react-bootstrap";
import { OverlayTrigger } from "react-bootstrap";

import rayimg from '../../../../public/ray_templates/_ray_1VY4.png'

interface OwnProps {}
interface ReduxProps {
  globalFilter: string;
}
interface DispatchProps {}
const MethodSwitch = (r: RibosomeStructure) => {
  var record;
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
      cryoem_exp_detail                   : r.cryoem_exp_detail,
      cryoem_exp_algorithm                : r.cryoem_exp_algorithm,
      cryoem_exp_resolution_method        : r.cryoem_exp_resolution_method,
      cryoem_exp_resolution               : r.cryoem_exp_resolution,
      cryoem_exp_num_particles            : r.cryoem_exp_num_particles,
      cryoem_exp_magnification_calibration: 
        r.cryoem_exp_magnification_calibration,
    };
  } else {
    record = {};
 } 

            return (
              <table className='methods-table'>
                Experimental Method Data
                {Object.entries(record).map(entry => (
                  <tr>
                    <td>{entry[0]}</td>
                    <td>{entry[1]}</td>
                  </tr>
                ))}
              </table>
            );
}

type StructurePageProps = OwnProps & ReduxProps & DispatchProps;
const StructurePage: React.FC<StructurePageProps> = (
  props: StructurePageProps
) => {

  const { pdbid }: { pdbid: string } = useParams();
  const [structdata, setstruct]      = useState<RibosomeStructure>();
  const [protdata, setprots]         = useState<RibosomalProtein[]>([]);
  const [rrnas, setrrnas]            = useState<rRNA[]>([]);
  const [ligands, setligands]        = useState<Ligand[]>([]);
  const [ions, setions]              = useState(true);
  const [activecat, setactivecat]    = useState("proteins");

  useEffect(() => {
    getNeo4jData("neo4j", {
      endpoint: "get_struct",
      params: { pdbid: pdbid },
    }).then(
      resp => {
        console.log("got resposne", resp.data)
        const respdat:ResponseShape = flattenDeep(resp.data)[0] as ResponseShape;
       
        type ResponseShape = {
          structure: RibosomeStructure,
          ligands  : Ligand[],
          rnas     : rRNA[],
          rps      : RibosomalProtein[]
        }
        
        setstruct(respdat.structure)
        setprots(respdat.rps)
        setrrnas(respdat.rnas)
        setligands(respdat.ligands)
      },
      err => {
        console.log("Got error on /neo request", err);
      }
    );

    return () => {};
  }, [pdbid]);

  const renderSwitch = (activecategory: string) => {
    switch (activecategory) {
      case "proteins":
        return (
          <StructGrid
            {...{
              pdbid: pdbid,
              ligands: ligands,
              protdata: protdata,
              rrnas: rrnas,
            }}
          />
        );
      case "rrna":
        return rrnas.map(obj => (
          <RNAHero
            rna ={{
              description: obj.rcsb_pdbx_description
                ? obj.rcsb_pdbx_description
                       :  "Null",
                length : obj.entity_poly_seq_length,
                parent : pdbid,
                strand : obj.entity_poly_strand_id,
                orgid  : obj.rcsb_source_organism_id,
                orgname: obj.rcsb_source_organism_description
            }}
          />
        ));
      case "ligands":
        return <div className='struct-page-ligands'>
            
            <div>


            Hide Ions:{" "}
            <input
              type="checkbox"
              id="ionscheck"
              onChange={() => {
                setions(!ions);
              }}
            />
            </div>
      { 
        ligands
          .filter(lig => {
            return ions ? true : !lig.chemicalName.includes("ION");
          })
          .map(lig => (
            <div className="ligand-hero">
              <h3>
                <Link to={`/interfaces`}>{lig.chemicalId}</Link>
              </h3>
              <div>Name: {lig.chemicalName}</div>
              <div>
                <code>cif</code> residue:{" "}
                {lig.cif_residueId ? lig.cif_residueId : "not calculated"}
              </div>
            </div>
          ))
        }
        </div>
      default:
        return "Something went wrong";
    }
  };

  return structdata ? (
      <div className="structure-page">
        <div className="structure-page--main">
          <h2 className="title">{pdbid}</h2>

<img  
src={process.env.PUBLIC_URL + `/ray_templates/_ray_${pdbid.toUpperCase()}.png`}/>
          <div className="component-category">

            <div
              onClick={() => setactivecat("rrna")}
              className={activecat === "rrna" ? "activecat" : "cat"}
            >
              rRNA
            </div>

            <div
              onClick={() => setactivecat("proteins")}
              className={activecat === "proteins" ? "activecat" : "cat"}
            >
              Proteins
            </div>

            <div
              onClick={() => setactivecat("ligands")}
              className={activecat === "ligands" ? "activecat" : "cat"}
            >
              Ligands
            </div>
          </div>
          <div className="structure-info">
            <div className="annotation">
              Species: {structdata._organismName}{" "}
            </div>
            <div className="annotation">
              Resolution: {structdata.resolution}Å
            </div>
            <div className="annotation">
              Experimental Method:{" "}
              <OverlayTrigger
                key="bottom-overlaytrigger"
                placement="bottom"
                overlay={
                  <Tooltip
                    style={{ backgroundColor: "black" }}
                    className="tooltip-bottom"
                    id="tooltip-bottom"
                  >
                    <MethodSwitch {...structdata} />
                  </Tooltip>
                }
              >
                <p className="experimental_method_value">
                  {" "}
                  {structdata.expMethod}
                </p>
              </OverlayTrigger>
              {/*  */}
              <div className="annotation">
                Title: {structdata.citation_title}
              </div>
            </div>
            <div className="annotation">
              <p>
                {" "}
                Publication:{" "}
                <a href={`https://www.doi.org/${structdata.citation_pdbx_doi}`}>
                  {structdata.citation_pdbx_doi}
                </a>
              </p>
            </div>
            <div className="annotation">
              Orgnaism Id: {structdata._organismId}
            </div>
            <div className="annotation">
              Authors:{" "}
              {structdata.citation_rcsb_authors.length > 1
                ? structdata.citation_rcsb_authors.reduce((acc, curr) => {
                    return acc.concat(curr, ",");
                  }, "")
                : structdata.citation_rcsb_authors[0]}
            </div>
            <div className="annotation">Year: {structdata.citation_year}</div>
          </div>
        </div>

        <div className="structure-page--components">
          {renderSwitch(activecat)}
        </div>
      </div>
  ) : (
    <LoadingSpinner annotation='Loading structure...' />
  );
};

const mapstate = (state: AppState, ownprops: OwnProps): ReduxProps => ({
  globalFilter: ""
});
const mapdispatch = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  ownprops: OwnProps
): DispatchProps => ({});

export default connect(mapstate, mapdispatch)(StructurePage);
