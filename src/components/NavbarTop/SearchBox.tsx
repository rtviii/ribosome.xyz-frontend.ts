import { stat } from "fs";
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../../redux/AppActions";
import { AppState } from "../../redux/store";

interface OwnProps {}

interface ReduxProps {
  PagewideFilter: string;
}
interface DispatchProps {
  inputSearch: (value: string) => void;
}

type SearchBoxProps = OwnProps & ReduxProps & DispatchProps;
const SearchBox: React.FC<SearchBoxProps> = (props: SearchBoxProps) => {
  const [value, setvalue]     = useState("");

  return (
    <div
      style={{
        display: "flex",
      }}
      className="sitewide-filter"
    >
      <p style={{ fontSize: "large", color: "black" }}>Filter </p>
      <input
        style={{ height: "40px", width: "100px" }}
        value={props.PagewideFilter}
        onChange={e => props.inputSearch(e.target.value)}
      ></input>
    </div>
  );
};

const mapstate = (state: AppState, ownState: OwnProps): ReduxProps => ({
  PagewideFilter: ""
});
const mapdispatch = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  ownProps: OwnProps
): DispatchProps => ({
  inputSearch: q => dispatch({ type: "INPUT_FILTER_VALUE", payload: q }),
});

export default connect(mapstate, mapdispatch)(SearchBox);
