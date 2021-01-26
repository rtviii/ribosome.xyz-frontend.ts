import React, { useEffect } from 'react'
import {getNeo4jData} from './../../../redux/Actions/getNeo4jData'

const RPClassification = () => {
  getNeo4jData("neo4j", {
    endpoint: "get_surface_ratios",
    params: { pdbid: "3J7Z" },
  }).then(l => console.log(l.data));
  return (
    <div>
      <ul>
        <li>- Surface Ratios per Structure(Rolling =accordion?)</li>

        <li>- Intersubunit Interface</li>
        <li>
          - Assays into distance to{" "}
          <ul>
            <li>PTC</li>
            <li>Intersubunit Interface</li>
            <li>Constriction Site</li>
            <li>Exit Tunnel</li>
          </ul>{" "}
        </li>
      </ul>
    </div>
  );
};

export default RPClassification
