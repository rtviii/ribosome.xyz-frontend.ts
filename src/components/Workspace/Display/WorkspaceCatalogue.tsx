import React, { useEffect, useState } from "react";import "./WorkspaceCatalogue.css";
import { connect, useSelector } from "react-redux";
import {
  WorkspaceState,
  toggleWorkspaceSelected,
  loadUpWorkspaceStructures,
} from "./../../../redux/reducers/UI/workspaceCatalogueReducer";
import { ThunkDispatch } from "redux-thunk";
import { AppState } from "./../../../redux/store";
import { getNeo4jData } from "./../../../redux/Actions/getNeo4jData";
import { flattenDeep } from "lodash";
import { RibosomeStructure } from "./../../../redux/RibosomeTypes";
import StructHero from "./../StructureHero/StructHero";
import { PageContext } from "../../Main";
import { AppActions } from "../../../redux/AppActions";
import LoadingSpinner  from '../../Other/LoadingSpinner'

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
  const [allstructs, setallstructs] = useState<{
    struct : RibosomeStructure;
    ligands: string[],
    rps    : Array<{noms:string[], strands:string}>,
    rnas   : string[]
      }[]>([]);

  useEffect(() => {

    getNeo4jData("neo4j", {
      endpoint: "get_all_structs",
      params  : null,
    }).then(response => {
      
      var structs:Array<{
    struct : RibosomeStructure;
    ligands: string[],
    rps    : Array<{noms:string[], strands:string}>,
    rnas   : string[]
      }> = flattenDeep(response.data);

      console.log(structs);
      
      setallstructs(structs);
    });
  }, []);


   return allstructs.length > 0 ? (
    <PageContext.Provider value="WorkspaceCatalogue">
       <div className="workspace-catalogue">
         <div className="workspace-catalogue-grid">
           <div className="filters-tools">
            Filters and search
           </div>
          
          <div className="workspace-catalogue-structs">

          {allstructs.map((x,i)=><StructHero {...x} key={i}/>)}
          </div>
         </div>
      </div>
    </PageContext.Provider>
  ) : (
    <LoadingSpinner />
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
