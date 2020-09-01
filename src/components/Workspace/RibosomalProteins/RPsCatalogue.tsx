import React, { useState, useEffect } from "react";
import "./RPsCatalogue.css";
import Axios from "axios";
import _, { flattenDeep, uniq } from "lodash";
import { Link } from "react-router-dom";
const BACKEND = process.env.REACT_APP_DJANGO_URL;

const RPsCatalogue = () => {
  const [avaialable, setavaialable] = useState<Array<string>>([]);
  useEffect(() => {
    Axios.get(`${BACKEND}/neo4j/list_available_rps/`).then(r => {
      var uniquerps: string[] = uniq(flattenDeep(r.data));
      setavaialable(uniquerps);
    });
    return () => {};
  }, []);

  return (
    <div>
      <ul>
        {avaialable.map(x => {
          return (
            <Link to={`/rps/${x}`}>
              <div style={{ color: "white", margin: "5px", cursor: "pointer" }}>
                {x}
              </div>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default RPsCatalogue;
