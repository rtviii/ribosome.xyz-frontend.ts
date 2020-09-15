import React, { useState, useEffect } from "react";
import _, { filter, flattenDeep, uniq } from "lodash";
import { Link } from "react-router-dom";
import { getNeo4jData } from "./../../../redux/Actions/getNeo4jData";
import "./RPsCatalogue.css";
import infoicon from "./../../../static/info.svg";
import { BanClass } from "../../../redux/RibosomeTypes";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../../../redux/AppActions";
import { AppState } from "../../../redux/store";
import { connect } from "react-redux";
import { SSL_OP_SINGLE_DH_USE } from "constants";

interface endpointResponseShape {
  BanClass: BanClass;
  presentIn: Array<string>;
  spans: Array<number>;
}
const BanClassHero = (prop: endpointResponseShape) => {
  return (
    <Link className="ban-class-hero" to={`/rps/${prop.BanClass}`}>
      <div className="banClassName">{prop.BanClass}</div>
      <div className="stats">
        <ul>
          <li>
            Average Surface Ratio:{" "}
            {(
              prop.spans.reduce((accumulator, curr) => {
                return accumulator + curr;
              }) / prop.spans.length
            ).toFixed(2)}
          </li>
          <li>Spans {prop.presentIn.length} Structures</li>
        </ul>
      </div>
      <a className="tooltip">
        Present in: <img src={infoicon} className="tt_icon" />
        <div className="tt_content">
          <div>
            {prop.presentIn.map(x => (
              <p>{x}</p>
            ))}
          </div>
        </div>
      </a>
    </Link>
  );
};

interface OwnProps {}
interface ReduxProps {
  globalFilter: string;
}
interface DispatchProps {}
type RPsCatalogueProps = DispatchProps & OwnProps & ReduxProps;
const RPsCatalogue: React.FC<RPsCatalogueProps> = (prop: RPsCatalogueProps) => {
  const [available, setavailable] = useState<Array<endpointResponseShape>>([]);
  const [ssu, setssu] = useState<Array<endpointResponseShape>>([]);
  const [lsu, setlsu] = useState<Array<endpointResponseShape>>([]);
  const [other, setother] = useState<Array<endpointResponseShape>>([]);

  useEffect(() => {
    getNeo4jData("neo4j", {
      endpoint: "list_available_rps",
      params: null,
    }).then(r => {
      var uniquerps: Array<endpointResponseShape> = uniq(flattenDeep(r.data));

      setavailable(uniquerps);
      setlsu(
        uniquerps.filter(x => {
          return x.BanClass.includes("L") && !x.BanClass.includes("S");
        })
      );
      setssu(
        uniquerps.filter(x => {
          return x.BanClass.includes("S") && !x.BanClass.includes("L");
        })
      );
      setother(
        uniquerps.filter(x => {
          return ["RACK1", "bTHX"].includes(x.BanClass);
        })
      );
    });
    return () => {};
  }, []);
  return (
    <div className="rps-catalogue">
      <ul className="rps-ssu">
        <h2 className="title">SSU</h2>
        {ssu
          .filter(x => x.BanClass.toLowerCase().includes(prop.globalFilter))
          .sort()
          .map(x => {
            return <BanClassHero {...x} />;
          })}
      </ul>

      <ul className="rps-lsu">
        <h2 className="title">LSU</h2>
        {lsu
          .filter(x => x.BanClass.toLowerCase().includes(prop.globalFilter))
          .sort()
          .map(x => {
            return <BanClassHero {...x} />;
          })}
      </ul>

      <ul className="rps-other">
        <h2 className="title">Other</h2>
        {other
          .filter(x => x.BanClass.toLowerCase().includes(prop.globalFilter))
          .sort()
          .map(x => {
            return <BanClassHero {...x} />;
          })}
      </ul>
    </div>
  );
};

const mapstate = (state: AppState, ownprops: OwnProps): ReduxProps => ({
  globalFilter: state.UI.state_Filter.filterValue.toLowerCase(),
});
const mapdispatch = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  ownprops: OwnProps
): DispatchProps => ({});

export default connect(mapstate, mapdispatch)(RPsCatalogue);
