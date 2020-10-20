import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Ligand,
  RibosomalProtein,
  RibosomeStructure,
  rRNA,
} from "../../../redux/RibosomeTypes";
import "./StructurePage.css";
import RNAHero from "./RNAHero";
import { getNeo4jData } from "./../../../redux/Actions/getNeo4jData";
import { flattenDeep } from "lodash";
import { PageContext } from "../../Main";
import { connect } from "react-redux";
import { AppState } from "../../../redux/store";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../../../redux/AppActions";
import StructGrid from "./StructGrid";
import LoadingSpinner from './../../Other/LoadingSpinner'

interface OwnProps {}
interface ReduxProps {
  globalFilter: string;
}
interface DispatchProps {}

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
        const respdat:ResponseShape = flattenDeep(resp.data)[0] as ResponseShape;
        
       console.log(respdat);
       
        type ResponseShape = {
          structure: RibosomeStructure,
          ligands          : Ligand[],
          rnas            : rRNA[],
          rps: RibosomalProtein[]
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
  }, []);

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
        return rrnas.map(obj => <RNAHero {...obj} />);
      case "ligands":
        return ligands
          .filter(lig => {
            return ions ? true : !lig.chemicalName.includes("ION");
          })
          .map(lig => (
            <div className="ligand-hero">
              <h3>
                <Link to={`/ligands/${lig.chemicalId}`}>{lig.chemicalId}</Link>
              </h3>
              <div>Name: {lig.chemicalName}</div>
              <div>
                <code>cif</code> residue:{" "}
                {lig.cif_residueId ? lig.cif_residueId : "not calculated"}
              </div>
            </div>
          ));
      default:
        return "Something went wrong";
    }
  };

  return structdata ? (
    <PageContext.Provider value="StructurePage">
      <div className="structure-page">
        <div className="structure-page--main">
          <h2 className="title">{pdbid}</h2>
          <div className="controls">
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
            <input
              type="checkbox"
              id="ionscheck"
              onChange={() => {
                setions(!ions);
              }}
            />
          </div>
          <div className="structure-info">
            <div className="annotation">Species: {structdata._organismName} </div>
            <div className="annotation">
              Resolution: {structdata.resolution}Å
            </div>
            <div className="annotation">
              Experimental Method: {structdata.expMethod}
            </div>
            <div className="annotation">
              Publication: {structdata.citation_pdbx_doi}
            </div>
            <div className="annotation">
              Orgnaism Id: {structdata._organismId}
            </div>
          </div>
        </div>

        <div className="structure-page--components">
          {renderSwitch(activecat)}
        </div>
      </div>
    </PageContext.Provider>
  ) : (
    <LoadingSpinner/>
  );
};

const mapstate = (state: AppState, ownprops: OwnProps): ReduxProps => ({
  globalFilter: state.UI.state_Filter.filterValue.toLowerCase(),
});
const mapdispatch = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  ownprops: OwnProps
): DispatchProps => ({});

export default connect(mapstate, mapdispatch)(StructurePage);
