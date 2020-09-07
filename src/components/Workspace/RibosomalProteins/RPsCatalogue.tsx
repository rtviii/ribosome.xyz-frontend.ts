import React, { useState, useEffect } from "react";
import "./RPsCatalogue.css";
import _, { flattenDeep, uniq } from "lodash";
import { Link } from "react-router-dom";
import { getNeo4jData } from "./../../../redux/Actions/getNeo4jData";

const RPsCatalogue = () => {
  const [avaialable, setavaialable] = useState<Array<string>>([]);
  useEffect(() => {
    getNeo4jData("neo4j", {
      endpoint: "list_available_rps",
      params: null,
    }).then(r => {
      var uniquerps: string[] = uniq(flattenDeep(r.data));
      setavaialable(uniquerps);
    });
    return () => {};
  }, []);

  return (
    <div className="rps-catalogue">
      <ul>
        {avaialable.map(x => {
          return (
            <Link to={`/rps/${x}`}>
              <div>{x}</div>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default RPsCatalogue;
