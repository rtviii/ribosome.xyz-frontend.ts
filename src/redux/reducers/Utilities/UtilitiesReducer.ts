import { Dispatch } from 'redux';
import {UtilitiesActions,StaticFilesCatalogue, A_requestStaticFilesCatalogue} from './ActionTypes'
import { getNeo4jData } from './../../AsyncActions/getNeo4jData'


export interface UtilitiesReducerState{
    static_catalogue: StaticFilesCatalogue
    ligand_by_struct: {[struct:string]:string[]}
    struct_by_ligand: {[ligandChemid:string]:string[]}
}

const UtilitiesReducerDefaultState: UtilitiesReducerState ={
    static_catalogue: [],
    ligand_by_struct: {},
    struct_by_ligand: {},
}

const structByLigand = (s: StaticFilesCatalogue) => {
  const ligMap: { [ligand: string]: string[] } = {};
  s.map(struct => {
    // for each ligand check whether it is in the map already?
    struct.LIGAND.map((ligandname: string) =>
      Object.keys(ligMap).includes(ligandname)
        ? ligMap[ligandname].push(struct.struct)
        : (ligMap[ligandname] = [struct.struct])
    );
  });
  return ligMap;
};

const structMap = (s: StaticFilesCatalogue) => {
  const structMap: { [struct: string]: string[] } = {};
  s.map(str => {
    structMap[str.struct] = str.LIGAND;
  });
  return structMap;
};

export const UtilitiesReducer = (
  state: UtilitiesReducerState = UtilitiesReducerDefaultState,
  action: UtilitiesActions
): UtilitiesReducerState => {
  switch (action.type) {
    case "REQUEST_STATIC_CATALOGUE":
      return {
        ...state,
        ligand_by_struct: structByLigand(action.catalogue),
        struct_by_ligand: structMap(action.catalogue),
        static_catalogue: action.catalogue,
      };
    default:
      return state;
  }
};
export const requestStaticCatalogue = () => {
  return async (dispatch: Dispatch<UtilitiesActions>) => {
    getNeo4jData("static_files", {
      endpoint: "get_static_catalogue",
      params: null,
    }).then(
      response => {
        dispatch(A_requestStaticFilesCatalogue(response.data));
      },
      error => {
        console.log("Didn't receive static files catalogue.");
        alert("Didn't receive static files catalogue.");
        dispatch(A_requestStaticFilesCatalogue([]));
      }
    );
  };
};