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

export const parseKingdomOut = (speciesstr: string) => {
  return speciesstr.slice(-3).replace(/(\(|\))/g, "");
};

const WorkspaceCatalogue: React.FC = () => {
  const [allstructs, setallstructs] = useState<RibosomeStructure[]>([]);

  useEffect(() => {
    var bacteria, archea, eukarya: RibosomeStructure[];
    getNeo4jData("neo4j", {
      endpoint: "get_all_structs",
      params: null,
    }).then(response => {
      var structs: RibosomeStructure[] = uniq(flattenDeep(response.data));
      setallstructs(structs);
      bacteria = structs.filter(x => parseKingdomOut(x._species) === "b");
      archea = structs.filter(x => parseKingdomOut(x._species) === "a");
      eukarya = structs.filter(x => parseKingdomOut(x._species) === "e");
    });
  }, []);

  return allstructs.length > 0 ? (
    <PageContext.Provider value="WorkspaceCatalogue">
      <div className="workspace-catalogue">
        <div className="bacteria kingdom-tray">
          <h2>Bacteria</h2>
          {allstructs
            .filter(x => parseKingdomOut(x._species) === "b")
            .map((x, i) => (
              <StructHero {...x} key={i + "b"} />
            ))}
        </div>
        <div className="archea kingdom-tray">
          <h2>Archea</h2>
          {allstructs
            .filter(x => parseKingdomOut(x._species) === "a")
            .map((x, i) => {
              return <StructHero {...x} key={i + "a"} />;
            })}
        </div>
        <div className="eukarya kingdom-tray">
          <h2>Eukarya</h2>
          {allstructs
            .filter(x => parseKingdomOut(x._species) === "e")
            .map((x, i) => (
              <StructHero {...x} key={i + "e"} />
            ))}
        </div>
      </div>
    </PageContext.Provider>
  ) : (
    <p>Loading up... Will replace with some spinner.</p>
  );
};

export default WorkspaceCatalogue;
