import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";

const django: any = process!.env.REACT_APP_DJANGO_URL;
const StructurePage = () => {
  const { pdbid } = useParams();

  useEffect(() => {
    const djurl = encodeURI('http://localhost:8000/neo4j/get_struct/?pdbid=3j9m')
    console.log(`Encoded : \n ${djurl}`);
    
    Axios.get(djurl).then(resp => console.log(resp));
    return () => {};
  }, []);

  const trdata = require(`./../../../static/nomenclature/${pdbid.toUpperCase()}.json`);
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
