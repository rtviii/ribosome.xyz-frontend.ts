import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as rts from "../../../redux/types/ribTypes";
import "./StructurePage.css";
import RibosomalProteinHero from "./RibosomalProteinHero";
import RNAHero from "./RNAHero";
import Axios from "axios";

const django: any = process!.env.REACT_APP_DJANGO_URL;
interface NEO__GET_STRUCT {
  RibosomeStructure: rts.RibosomeStructure;
  rRNAs: Array<rts.rRNA>;
  ribosomalProteins: Array<rts.RibosomalProtein>;
}

const StructurePage = () => {
  const { pdbid } = useParams();
  const [ribdata, setribdata] = useState({} as NEO__GET_STRUCT);
  const [rnaprottoggle, togglernaprot] = useState("rRNA");
  useEffect(() => {
    const djurl = encodeURI(
      `http://localhost:8000/neo4j/get_struct/?pdbid=${pdbid}`
    );
    console.log(`Encoded : \n ${djurl}`);
    Axios.get(djurl).then(
      r => {
        setribdata(r.data[0][0]);
      },
      e => {
        console.log("Got error on /neo request", e);
      }
    );
    return () => {};
  }, []);

  // const trdata = require(`./../../../static/nomenclature/${pdbid.toUpperCase()}.json`);

  return ribdata.RibosomeStructure ? (
    <div className="structure-page">
      {/* struct */}
      <div>{pdbid}</div>
      <div className="structure-info">
        {ribdata.RibosomeStructure._species} at{" "}
        {ribdata.RibosomeStructure.resolution} Å |{" "}
        {ribdata.RibosomeStructure.publication}
      </div>
      {/* proteins */}
      <div
        className="rnaprottoggle"
        onClick={() => {
          return rnaprottoggle === "Proteins"
            ? togglernaprot("rRNA")
            : togglernaprot("Proteins");
        }}
      >
        {rnaprottoggle}
      </div>
      <ul>
        {rnaprottoggle === "rRNA"
          ? ribdata.ribosomalProteins.map(prot => (
              <RibosomalProteinHero {...prot} />
            ))
          : ribdata.rRNAs.map(rna => <RNAHero {...rna} />)}
      </ul>
    </div>
  ) : (
    <div>"spinner"</div>
  );
};

export default StructurePage;
