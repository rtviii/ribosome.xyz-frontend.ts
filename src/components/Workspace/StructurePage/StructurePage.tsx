import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Ligand,
  RibosomalProtein,
  RibosomeStructure,
  rRNA,
} from "../../../redux/RibosomeTypes";
import "./StructurePage.css";
import RibosomalProteinHero from "../RibosomalProteins/RibosomalProteinHero";
import RNAHero from "./RNAHero";
import { getNeo4jData } from "./../../../redux/Actions/getNeo4jData";
import { filter, flattenDeep } from "lodash";
import { PageContext } from "../../Main";
import { connect } from "react-redux";
import { AppState } from "../../../redux/store";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../../../redux/AppActions";
import StructGrid from "./StructGrid";
import { render } from "@testing-library/react";

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
  const [structdata, setstruct] = useState<RibosomeStructure>();
  const [protdata, setprots] = useState<RibosomalProtein[]>([]);
  const [rrnas, setrrnas] = useState<rRNA[]>([]);
  const [ligands, setligands] = useState<Ligand[]>([]);

  const [activecat, setactivecat] = useState("proteins");
  const [rnaprottoggle, togglernaprot] = useState("rRNA");

  useEffect(() => {
    getNeo4jData("neo4j", {
      endpoint: "get_struct",
      params: { pdbid: pdbid },
    }).then(
      resp => {
        var respObj: {
          RibosomeStructure: RibosomeStructure;
          rRNAs: rRNA[];
          ribosomalProteins: RibosomalProtein[];
          lls: Ligand[];
        } = flattenDeep(resp.data)[0] as any;
        console.log(respObj);

        setprots(respObj.ribosomalProteins);
        setrrnas(respObj.rRNAs);
        setstruct(respObj.RibosomeStructure);
        setligands(respObj.lls);
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
        return "rna";
      case "ligands":
        return "ligands";
      default:
        return "Something went wrong";
    }
  };
  return structdata ? (
    <PageContext.Provider value="StructurePage">
      <div className="structure-page">
        <div className="structure-page--main">
          {/* <a href={`https://www.rcsb.org/structure/${pdbid}`}> */}
          <h2 className="title">{pdbid}</h2>
          {/* </a> */}
          Toggle: RNA/Protein/Ligands
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

            <div
              className="rnaprottoggle"
              onClick={() => {
                return rnaprottoggle === "Proteins"
                  ? togglernaprot("rRNA")
                  : togglernaprot("Proteins");
              }}
            >
              Toggle: {rnaprottoggle}
            </div>
          </div>
          <div className="structure-info">
            <div className="annotation">Species: {structdata._species} </div>
            <div className="annotation">
              Resolution: {structdata.resolution}Å
            </div>
            <div className="annotation">
              Experimental Method: {structdata.expMethod}
            </div>
            <div className="annotation">
              Publication: {structdata.publication}
            </div>
            <div className="annotation">
              Orgnaism Id: {structdata._organismId}
            </div>
          </div>
          <div className="tooling">Tooling filters</div>
        </div>

        <div className="structure-page--components">
          {renderSwitch(activecat)}
        </div>
      </div>
    </PageContext.Provider>
  ) : (
    <div>"spinner"</div>
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

// <ul className="ssu">
//   <div className="subunit-title">SSU</div>
//   {protdata
//     .filter(x => {
//       var Subunits = flattenDeep(
//         x.nomenclature.map(name => {
//           return name.match(/S|L/g);
//         })
//       );
//       return Subunits.includes("L") && !Subunits.includes("S");
//     })
//     .filter(x => {
//       if (x.nomenclature.length > 0) {
//         return x.nomenclature[0]
//           .toLowerCase()
//           .includes(props.globalFilter);
//       } else {
//         return false;
//       }
//     })
//     .map((x, i) => (
//       <RibosomalProteinHero key={i} {...{ pdbid }} {...x} />
//     ))}
// </ul>
// <ul className="lsu">
//   <div className="subunit-title">LSU</div>
//   {protdata
//     .filter(x => {
//       var Subunits = flattenDeep(
//         x.nomenclature.map(name => {
//           return name.match(/S|L/g);
//         })
//       );
//       return Subunits.includes("S") && !Subunits.includes("L");
//     })
//     .filter(x => {
//       if (x.nomenclature.length > 0) {
//         return x.nomenclature[0]
//           .toLowerCase()
//           .includes(props.globalFilter);
//       } else {
//         return false;
//       }
//     })
//     .map((x, j) => (
//       <RibosomalProteinHero key={j} {...{ pdbid }} {...x} />
//     ))}
// </ul>
// <ul className="other">
//   <div className="subunit-title">Other</div>
//   {protdata
//     .filter(x => {
//       var Subunits = flattenDeep(
//         x.nomenclature.map(name => {
//           return name.match(/S|L/g);
//         })
//       );

//       return (
//         (Subunits.includes("S") && Subunits.includes("L")) ||
//         Subunits.length === 0 ||
//         Subunits.includes(null)
//       );
//     })
//     .filter(x => {
//       if (x.nomenclature.length > 0) {
//         return x.nomenclature[0]
//           .toLowerCase()
//           .includes(props.globalFilter);
//       } else {
//         return false;
//       }
//     })
//     .map((x, k) => (
//       <RibosomalProteinHero key={k} {...{ pdbid }} {...x} />
//     ))}
// </ul>
