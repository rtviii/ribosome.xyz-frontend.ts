import React, { useState, useEffect } from "react";
import "./RPsCatalogue.css";
import Axios from "axios";
import _, { flattenDeep, uniq } from "lodash";
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
            <div style={{ color: "white", margin: "5px", cursor: "pointer"}}>
              {x}
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default RPsCatalogue;
