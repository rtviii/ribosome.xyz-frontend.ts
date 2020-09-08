import React, { useState, useEffect } from "react";
import _, { flattenDeep, uniq } from "lodash";
import { Link } from "react-router-dom";
import { getNeo4jData } from "./../../../redux/Actions/getNeo4jData";
import "./RPsCatalogue.css";

const BanClass = ({ banclass }: { banclass: string }) => {
  return (
    <Link to={`/rps/${banclass}`}>
      <div className="ban-class-hero">
        <div className="name">{banclass}</div>
      </div>
    </Link>
  );
};

const RPsCatalogue = () => {
  const [available, setavailable] = useState<Array<string>>([]);
  useEffect(() => {
    getNeo4jData("neo4j", {
      endpoint: "list_available_rps",
      params: null,
    }).then(r => {
      var uniquerps: string[] = uniq(flattenDeep(r.data));
      setavailable(uniquerps);
    });
    return () => {};
  }, []);

  return (
    <div className="rps-catalogue">
      Perhaps on each protein tab, hint at which structures it belongs to,
      for example a pie chart of what domain it mostly figures in. Structures on hover.
      Basic statistics about the protein class.

      <ul className="ssu">
        <h2 className="title">SSU</h2>
        {available
          .filter(x => {
            return x.includes("L") && !x.includes("S");
          })
          .sort()
          .map(x => {
            return <BanClass banclass={x} />;
          })}
      </ul>
      <ul className="lsu">
        <h2 className="title">LSU</h2>
        {available
          .filter(x => {
            return x.includes("S") && !x.includes("L");
          })
          .sort()
          .map(x => {
            return <BanClass banclass={x} />;
          })}
      </ul>
      <ul className="other">
        <h2 className="title">Other</h2>
        {available
          .filter(x => {
            return ["RACK1", "bTHX"].includes(x);
          })
          .sort()
          .map(x => {
            return <BanClass banclass={x} />;
          })}
      </ul>
    </div>
  );
};

export default RPsCatalogue;
