import React, { useEffect, useState } from "react";
import "./WorkspaceCatalogue.css";
import { connect, useSelector } from "react-redux";
import {
  WorkspaceState,
  toggleWorkspaceSelected,
  loadUpWorkspaceStructures,
} from "./../../../redux/reducers/UI/workspaceCatalogueReducer";
import { ThunkDispatch } from "redux-thunk";
import { AppState } from "./../../../redux/store";
import { getNeo4jData } from "./../../../redux/Actions/getNeo4jData";
import { flattenDeep, uniq } from "lodash";
import { RibosomeStructure } from "./../../../redux/RibosomeTypes";
import StructHero from "./../StructureHero/StructHero";
import { PageContext } from "../../Main";
import { AppActions } from "../../../redux/AppActions";

interface OwnProps {}
interface ReduxProps {
  globalFilter: string;
}
interface DispatchProps {}
type WorkspaceCatalogueProps = DispatchProps & OwnProps & ReduxProps;

export const parseKingdomOut = (speciesstr: string) => {
  return speciesstr.slice(-3).replace(/(\(|\))/g, "");
};

const WorkspaceCatalogue: React.FC<WorkspaceCatalogueProps> = (
  prop: WorkspaceCatalogueProps
) => {
  const [allstructs, setallstructs] = useState<RibosomeStructure[]>([]);
  const [bacteria, setbacteria]     = useState<RibosomeStructure[]>([]);
  const [archea, setarchea]         = useState<RibosomeStructure[]>([]);
  const [eukarya, seteukarya]       = useState<RibosomeStructure[]>([]);

  useEffect(() => {
    var b, a, e: RibosomeStructure[];
    getNeo4jData("neo4j", {
      endpoint: "get_all_structs",
      params: null,
    }).then(response => {
      var structs: RibosomeStructure[] = uniq(flattenDeep(response.data));
      console.log(structs);
      
      setallstructs(structs);
      b = structs.filter(x => parseKingdomOut(x._species) === "b");
      a = structs.filter(x => parseKingdomOut(x._species) === "a");
      e = structs.filter(x => parseKingdomOut(x._species) === "e");
      setarchea(a);
      setbacteria(b);
      seteukarya(e);
    });
  }, []);

  return allstructs.length > 0 ? (
    <PageContext.Provider value="WorkspaceCatalogue">
      <div className="workspace-catalogue">
        <div className="bacteria kingdom-tray">
          <h2 className="tray-title">Bacteria</h2>
          {bacteria
            .filter(x => x._PDBId.includes(prop.globalFilter.toUpperCase()))

            .map((x, i) => (
              <StructHero {...x} key={i + "b"} />
            ))}
        </div>
        <div className="eukarya kingdom-tray">
          <h2 className="tray-title">Eukarya</h2>
          {eukarya
            .filter(x => x._PDBId.includes(prop.globalFilter.toUpperCase()))
            .map((x, i) => (
              <StructHero {...x} key={i + "e"} />
            ))}
        </div>

        <div className="archea kingdom-tray">
          <h2 className="tray-title">Archea</h2>
          {archea
            .filter(x => x._PDBId.includes(prop.globalFilter.toUpperCase()))
            .map((x, i) => (
              <StructHero {...x} key={i + "a"} />
            ))}
        </div>
      </div>
    </PageContext.Provider>
  ) : (
    <p>Loading up... Will replace with a spinner.</p>
  );
};

const mapstate = (state: AppState, ownprops: OwnProps): ReduxProps => ({
  globalFilter: state.UI.state_Filter.filterValue,
});
const mapdispatch = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  ownprops: OwnProps
): DispatchProps => ({});

export default connect(mapstate, mapdispatch)(WorkspaceCatalogue);
