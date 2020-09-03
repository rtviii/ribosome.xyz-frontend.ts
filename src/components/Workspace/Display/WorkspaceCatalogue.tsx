import React, { useEffect, useState } from "react";
import "./WorkspaceCatalogue.css";
import { connect, useSelector } from "react-redux";
import {
  WorkspaceState,
  toggleWorkspaceSelected,
  loadUpWorkspaceStructures,
} from "./../../../redux/reducers/UI/workspaceCatalogueReducer"
import { ThunkDispatch } from "redux-thunk";
import { AppState } from './../../../redux/store'
import {getNeo4jData} from './../../../redux/Actions/getNeo4jData'
import { flattenDeep, uniq } from "lodash";
import { RibosomeStructure } from './../../../redux/RibosomeTypes'
import StructHero from "./../StructureHero/StructHero"

const parseKingdomOut = (speciesstr: string) => {
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
      archea   = structs.filter(x => parseKingdomOut(x._species) === "a");
      eukarya  = structs.filter(x => parseKingdomOut(x._species) === "e");
    });
  }, []);

  return allstructs.length > 0 ? (
    <div className="workspace-catalogue">
      <h3> bacteria</h3>
      <div className="bacteria">
        {allstructs
          .filter(x => parseKingdomOut(x._species) === "b")
          .map((x, i) => (
            <StructHero pdbid={x._PDBId} key={i+"b"} />
          ))}
      </div>
      <h3> Arch</h3>
      <div className="archea">
        {allstructs
          .filter(x => parseKingdomOut(x._species) === "a")
          .map((x, i) => <StructHero  pdbid={x._species} key={i+"a"} />
          )}
      </div>
      <h3> Euk</h3>
      <div className="eukarya">

        {allstructs
          .filter(x => parseKingdomOut(x._species) === "e")
          .map((x, i) => (
            <StructHero pdbid={x._PDBId} key={i+"e"}  />
          ))}
      
      </div>
    </div>
  ) : (
    <p>"nothing at all"</p>
  );
};



export default WorkspaceCatalogue
