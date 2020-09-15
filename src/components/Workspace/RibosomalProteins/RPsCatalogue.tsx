import React, { useState, useEffect } from "react";
import _, { flattenDeep, uniq } from "lodash";
import { Link } from "react-router-dom";
import { getNeo4jData } from "./../../../redux/Actions/getNeo4jData";
import "./RPsCatalogue.css";
import infoicon from "./../../../static/info.svg";
import { BanClass } from "../../../redux/RibosomeTypes";

interface endpointResponseShape {
  BanClass: BanClass;
  presentIn: Array<string>;
  spans: Array<number>;
}
const BanClassHero = (prop: endpointResponseShape) => {
  return (
    <Link className="ban-class-hero" to={`/rps/${prop.BanClass}`}>
      <h1 className="banClassName">{prop.BanClass}</h1>
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

const RPsCatalogue = () => {
  const [available, setavailable] = useState<Array<endpointResponseShape>>([]);
  useEffect(() => {
    getNeo4jData("neo4j", {
      endpoint: "list_available_rps",
      params: null,
    }).then(r => {
      var uniquerps: Array<endpointResponseShape> = uniq(flattenDeep(r.data));
      console.log(uniquerps);

      setavailable(uniquerps);
    });
    return () => {};
  }, []);

  return (
    <div className="rps-catalogue">
      <ul className="ssu">
        <h2 className="title">SSU</h2>
        {available
          .filter(x => {
            return x.BanClass.includes("L") && !x.BanClass.includes("S");
          })
          .sort()
          .map(x => {
            return <BanClassHero {...x} />;
          })}
      </ul>
      <ul className="lsu">
        <h2 className="title">LSU</h2>
        {available
          .filter(x => {
            return x.BanClass.includes("S") && !x.BanClass.includes("L");
          })
          .sort()
          .map(x => {
            return <BanClassHero {...x} />;
          })}
      </ul>
      <ul className="other">
        <h2 className="title">Other</h2>
        {available
          .filter(x => {
            return ["RACK1", "bTHX"].includes(x.BanClass);
          })
          .sort()
          .map(x => {
            return <BanClassHero {...x} />;
          })}
      </ul>
    </div>
  );
};

export default RPsCatalogue;
