import React from "react";
import { AppState } from "../../redux/store";
import { ThunkDispatch } from "redux-thunk";
import { DataActionTypes } from "../../redux/types/action.types";
import { connect } from "react-redux";
import "./../../styles/DataDisplay.css";

interface OwnProps {}
interface StateProps {
  structs: Array<Objshape>;
}
interface ActionProps {}
type DataDisplayProps = ActionProps & OwnProps & StateProps;

interface Subchain {
  element: string;
  chainid: string;
  nom: Array<string | null>;
  surface: number | null;
}
interface PDBStruct {
  pdbid: string;
  element: string;
}
interface StructAndChains {
  subchains: Array<Subchain>;
  pdbid: string;
}

const StructPanel = (struct: Objshape) => {
  return (
    <div className="structhero">
      {struct[0].pdbid}

      {struct[1].map(chain => (
        <div style={{padding:"5px", marginTop:"5px", outline:"1px dashed white"}}>
          <p>Chain ID: {chain.chainid}</p>
          <p> Nomenclature: {chain.nom}</p>
          {/* <p> Surface: {chain.surface}</p> */}
        </div>
      ))}
    </div>
  );
};

export type Objshape = [PDBStruct, Subchain[]];

const DataDisplay: React.FC<DataDisplayProps> = pps => {
  return (
    <div className="data-display">
      {pps.structs.length === 0
        ? "No data"
        : pps.structs.map((sobj: Objshape) => (
            <StructPanel key={sobj[0].pdbid} {...sobj} />
          ))}
    </div>
  );
};

const mapState = (state: AppState, OwnProps: OwnProps): StateProps => ({
  structs: state.store_data.state_Structs.structs,
});
const mapDispatch = (
  dispatch: ThunkDispatch<any, any, DataActionTypes>,
  OwnProps: OwnProps
): ActionProps => ({});

export default connect(mapState, mapDispatch)(DataDisplay);
