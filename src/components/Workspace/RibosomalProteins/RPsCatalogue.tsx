import React, { useState, useEffect } from "react";
import _, {  flattenDeep} from "lodash";
import { Link } from "react-router-dom";
import { getNeo4jData } from "./../../../redux/Actions/getNeo4jData";
import "./RPsCatalogue.css";
import infoicon from "./../../../static/info.svg";
import { BanClass } from "../../../redux/RibosomeTypes";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../../../redux/AppActions";
import { AppState } from "../../../redux/store";
import { connect } from "react-redux";
import "./BanClassHero.css";

interface endpointResponseShape {
  NomenclatureClass: BanClass;
  presentIn: Array<string>;
  spans: Array<number>;
}

const BanClassHero = (prop: endpointResponseShape) => {
  return (
    <div className="ban-class-hero">

    <Link  to={`/rps/${prop.NomenclatureClass}`}>
      <h2>{prop.NomenclatureClass}</h2>
    </Link>
      <div className="stats">
        <p>
          {" "}
          Average Surface Ratio:
          {prop.presentIn
            ? (
                prop.spans.reduce((accumulator, curr) => {
                  return accumulator + curr;
                }, 0) / prop.spans.length
              ).toFixed(2)
            : "not computed"}
        </p>
        <p>Spans {prop.presentIn.length} Structures</p>
        <a className="tooltip-rp-hero">
          Present in: <img src={infoicon} className="tt_icon-rp-hero" />

          <div className="tt_content-rp-hero">
            <div>
              {prop.presentIn.map(x => (
                <Link to={ `/catalogue/${x}` }> <p>{x}</p></Link>
              ))}
            </div>
          </div>
        </a>
      </div>
    </div>
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
  const [ssu, setssu]             = useState<Array<endpointResponseShape>>([]);
  const [lsu, setlsu]             = useState<Array<endpointResponseShape>>([]);
  const [other, setother]         = useState<Array<endpointResponseShape>>([]);
  const [activecat, setactivecat] = useState("lsu");

  const renderSwitchSubunit = (category: string) => {
    switch (category) {
      case "lsu":
        return (
          <div className="rps-subunit-tray">
            <h2 className="title">LSU</h2>
            {lsu
              .filter(x =>
                x.NomenclatureClass.toLowerCase().includes(prop.globalFilter)
              )
              .sort()
              .map(x => {
                return <BanClassHero {...x} />;
              })}
          </div>
        );
      case "ssu":
        return (
          <div className="rps-subunit-tray">
            <h2 className="title">SSU</h2>
            {ssu.sort().map(x => {
              return <BanClassHero {...x} />;
            })}
          </div>
        );
      case "other":
        return (
          <div className="rps-subunit-tray">
            <h2 className="title">Other</h2>
            {other
              .filter(x =>
                x.NomenclatureClass.toLowerCase().includes(prop.globalFilter)
              )
              .sort()
              .map(x => {
                return <BanClassHero {...x} />;
              })}
          </div>
        );
      default:
        return "Something went wrong in the render switch.";
    }
  };
  useEffect(() => {
    getNeo4jData("neo4j", {
      endpoint: "list_nom_classes",
      params: null,
    }).then(response => {
      var uniquerps: Array<endpointResponseShape> = flattenDeep(response.data);
      setavailable(uniquerps);
      setlsu(
        uniquerps.filter(x => {
          return (
            x.NomenclatureClass.includes("L") &&
            !x.NomenclatureClass.includes("S")
          );
        })
      );
      setssu(
        uniquerps.filter(x => {
          return (
            x.NomenclatureClass.includes("S") &&
            !x.NomenclatureClass.includes("L")
          );
        })
      );
      setother(
        uniquerps.filter(x => {
          return ["RACK1", "bTHX"].includes(x.NomenclatureClass);
        })
      );
    });
    return () => {};
  }, []);
  return (
    <div className="rps-catalogue">
      <div className="filters-tools-rps">
        <div className="component-category">
          <div
            onClick={() => setactivecat("lsu")}
            className={activecat === "lsu" ? "activecat" : "cat"}
          >
            Large Subunit
          </div>
          <div
            onClick={() => setactivecat("ssu")}
            className={activecat === "ssu" ? "activecat" : "cat"}
          >
            Small Subunit
          </div>
          <div
            onClick={() => setactivecat("other")}
            className={activecat === "other" ? "activecat" : "cat"}
          >
            Other/Poorly Unclassified
          </div>
        </div>
      </div>
      <div className="rps-catalogue-classes">
        {renderSwitchSubunit(activecat)}
      </div>
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
