import React, { useState, useEffect } from "react";
import _, { flattenDeep, uniq } from "lodash";
import { Link } from "react-router-dom";
import { getNeo4jData } from "./../../../redux/Actions/getNeo4jData";
import "./RPsCatalogue.css";

const BanClass = ({ props }: { props: string }) => {
  return <div className='ban-class-hero'>{props}</div>;
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

  // <Link to={`/rps/${x}`}>
  //   <div>{x}</div>
  // </Link>
  return (
    <div className="rps-catalogue">
      <ul className="ssu">
        <h2>SSU</h2>
        {available
          .filter(x => {
            return x.includes("L") && !x.includes("S");
          })
          .map(x => {
            return <BanClass props={x} />;
          })}
      </ul>
      <ul className="lsu">
        <h2>LSU</h2>
        {available
          .filter(x => {
            return x.includes("S") && !x.includes("L");
          })
          .map(x => {
            return <BanClass props={x} />;
          })}
      </ul>
      <ul className="other">
        <h2>Other</h2>
        {available
          .filter(x => {
            return ["RACK1", "bTHX"].includes(x);
          })
          .map(x => {
            return <BanClass props={x} />;
          })}
      </ul>
    </div>
  );
};

export default RPsCatalogue;
