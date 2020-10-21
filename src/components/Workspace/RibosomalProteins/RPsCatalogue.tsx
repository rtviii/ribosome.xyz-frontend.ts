import React, { useState, useEffect } from "react";
import _, {  flattenDeep} from "lodash";
import { Link } from "react-router-dom";
import { getNeo4jData } from "./../../../redux/Actions/getNeo4jData";
import "./RPsCatalogue.css";
import { BanClass, RibosomalProtein } from "../../../redux/RibosomeTypes";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../../../redux/AppActions";
import { AppState } from "../../../redux/store";
import { connect } from "react-redux";
import RibosomalProteinHero from "./RibosomalProteinHero";
import BanClassHero from './BanClassHero'
import LoadingSpinner from "../../Other/LoadingSpinner";

export interface endpointResponseShape {
  nom_class: BanClass;
  presentIn        : Array<string>;
  rps              : Array<{        
    organism_desc: string
    organism_id  : number
    uniprot      : string
    parent       : string
    parent_reso  : number
    strand_id    : string
  }>
}



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
            <h2 className="title">Large Subunit Proteins</h2>
            <div className='subunit-members'>
            {lsu
              .filter(x =>
                x.nom_class.toLowerCase().includes(prop.globalFilter)
              )
              .sort()
              .map(x => {
                return <BanClassHero {...x} />;
              })}
            </div>
          </div>
        );
      case "ssu":
        return (
          <div className="rps-subunit-tray">
            <h2 className="title">Small Subunit Proteins</h2>
            <div className='subunit-members'>
            {ssu.sort().map(x => {
              return <BanClassHero {...x} />;
            })}
          </div>
          </div>
        );
      case "other":
        return (
          <div className="rps-subunit-tray">
            <h2 className="title">Other</h2>
            <div className='subunit-members'>
            {other
              .filter(x =>
                x.nom_class.toLowerCase().includes(prop.globalFilter)
              )
              .sort()
              .map(x => {
                return <BanClassHero {...x} />;
              })}
              </div>
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
      var uniquerps: Array<any> = flattenDeep(response.data);

      setavailable(uniquerps);
      setlsu(
        uniquerps.filter(x => {
          return (
            x.nom_class.includes("L") &&
            !x.nom_class.includes("S")
          );
        })
      );

      setssu(
        uniquerps.filter(x => {
          return (
            x.nom_class.includes("S") &&
            !x.nom_class.includes("L")
          );
        })
      );

      setother(
        uniquerps.filter(x => {
          return ["RACK1", "bTHX"].includes(x.nom_class);
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

        { available.length > 1 ?  renderSwitchSubunit(activecat):<LoadingSpinner/>}
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
