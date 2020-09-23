import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
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

interface OwnProps {}
interface ReduxProps {
  globalFilter: string;
}
interface DispatchProps {}

type StructurePageProps = OwnProps & ReduxProps & DispatchProps;
const StructurePage: React.FC<StructurePageProps> = (
  props: StructurePageProps
) => {
  const { pdbid } = useParams();
  const [structdata, setstruct] = useState<RibosomeStructure>();
  const [protdata, setprots] = useState<RibosomalProtein[]>([]);
  const [rrnas, setrrnas] = useState<rRNA[]>([]);
  const [rnaprottoggle, togglernaprot] = useState("rRNA");

  useEffect(() => {
    getNeo4jData("neo4j", {
      endpoint: "get_struct",
      params: { pdbid: pdbid },
    }).then(
      resp => {
        var respObj: {
          RibosomeStructure: RibosomeStructure;
          rRNAs            : rRNA[];
          ribosomalProteins: RibosomalProtein[];
        } = flattenDeep(resp.data)[0] as any;

        setprots(respObj.ribosomalProteins);
        setrrnas(respObj.rRNAs);
        setstruct(respObj.RibosomeStructure);
      },
      err => {
        console.log("Got error on /neo request", err);
      }
    );
    return () => {};
  }, []);

  return structdata ? (
    <PageContext.Provider value="StructurePage">
      <div className="structure-page">
        <div className="structure-page--main">
          <a href={`https://www.rcsb.org/structure/${pdbid}`}>
            <h1 className="title">{pdbid}</h1>
          </a>
          <div className="structure-info">
            {structdata._species} at {structdata.resolution} Å |{" "}
            {structdata.publication}
          </div>
          
          <div
            className="rnaprottoggle"
            onClick={() => {
              return rnaprottoggle === "Proteins"
                ? togglernaprot("rRNA")
                : togglernaprot("Proteins");
            }}
          >
          Show  {rnaprottoggle}
          </div>
        </div>

        <div className="structure-page--components">
          {rnaprottoggle === "rRNA" ? (
            <div className="by-subunit">
              <ul className="ssu">
                <div className='subunit-title'>SSU</div>
                {protdata
                  .filter(x => {
                    var Subunits = flattenDeep(
                      x.nomenclature.map(name => {
                        return name.match(/S|L/g);
                      })
                    );
                    return Subunits.includes("L") && !Subunits.includes("S");
                  })
                  .filter(x => {
                    if (x.nomenclature.length > 0) {
                      return x.nomenclature[0]
                        .toLowerCase()
                        .includes(props.globalFilter);
                    } else {
                      return false;
                    }
                  })
                  .map((x, i) => (
                    <RibosomalProteinHero key={i} {...{ pdbid }} {...x} />
                  ))}
              </ul>
              <ul className="lsu">
                <div className='subunit-title'>LSU</div>
                {protdata
                  .filter(x => {
                    var Subunits = flattenDeep(
                      x.nomenclature.map(name => {
                        return name.match(/S|L/g);
                      })
                    );
                    return Subunits.includes("S") && !Subunits.includes("L");
                  })
                  .filter(x => {
                    if (x.nomenclature.length > 0) {
                      return x.nomenclature[0]
                        .toLowerCase()
                        .includes(props.globalFilter);
                    } else {
                      return false;
                    }
                  })
                  .map((x, j) => (
                    <RibosomalProteinHero key={j} {...{ pdbid }} {...x} />
                  ))}
              </ul>
              <ul className="other">
                <div className='subunit-title'>Other</div>
                {protdata
                  .filter(x => {
                    var Subunits = flattenDeep(
                      x.nomenclature.map(name => {
                        return name.match(/S|L/g);
                      })
                    );

                    return (
                      (Subunits.includes("S") && Subunits.includes("L")) ||
                      Subunits.length === 0 ||
                      Subunits.includes(null)
                    );
                  })
                  .filter(x => {
                    if (x.nomenclature.length > 0) {
                      return x.nomenclature[0]
                        .toLowerCase()
                        .includes(props.globalFilter);
                    } else {
                      return false;
                    }
                  })
                  .map((x, k) => (
                    <RibosomalProteinHero key={k} {...{ pdbid }} {...x} />
                  ))}
              </ul>
            </div>
          ) : (
            rrnas!.map((rna, l) => <RNAHero key={l} {...rna} />)
          )}
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
