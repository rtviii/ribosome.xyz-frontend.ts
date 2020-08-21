import React from "react";
import { useParams } from "react-router-dom";

const StructurePage = () => {
  const { pdbid } = useParams();

  const strdata = require(`./../../../static/nomenclature/${pdbid.toUpperCase()}.json`);
  console.log(strdata);
  return (
    <div style={{ color: "white" }}>
      <h3>Structure Page for {pdbid}</h3>
      <p> Further cataloguing of subchains into proteins and RNAs.</p>
      <br />
      <p> Profiles on both and access to the Neo4j semantic connections.</p>
      --------------------------------------------------------------
      <p> Classification and clustering, nomenclature.</p>
    </div>
  );
};

export default StructurePage;
