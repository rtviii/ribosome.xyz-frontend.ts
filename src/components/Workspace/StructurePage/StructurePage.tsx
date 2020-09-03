import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  RibosomalProtein,
  RibosomeStructure,
  rRNA,
} from "../../../redux/RibosomeTypes";
import "./StructurePage.css";
import RibosomalProteinHero from "./RibosomalProteinHero";
import RNAHero from "./RNAHero";
import { getNeo4jData } from "./../../../redux/Actions/getNeo4jData";
import { flattenDeep } from "lodash";

interface NEO__GET_STRUCT {
  RibosomeStructure: RibosomeStructure;
  rRNAs: rRNA[];
  ribosomalProteins: RibosomalProtein[];
}

const StructurePage = () => {
  const { pdbid } = useParams();
  const [structdata, setstruct] = useState<RibosomeStructure>();
  const [protdata, setprots] = useState<RibosomalProtein[]>([]);
  const [rrnas, setrrnas] = useState<rRNA[]>([]);
  const [rnaprottoggle, togglernaprot] = useState("rRNA");
  useEffect(() => {
    interface response {}
    getNeo4jData("neo4j", {
      endpoint: "get_struct",
      params: { pdbid: pdbid },
    }).then(
      resp => {
        var respObj: {
          RibosomeStructure: RibosomeStructure;
          rRNAs            : rRNA[];
          ribosomalProteins: RibosomalProtein[];
        } = flattenDeep(resp.data)[0] as any;
        setprots(respObj.ribosomalProteins);
        setrrnas(respObj.rRNAs);
        setstruct(respObj.RibosomeStructure);

        // setstruct(respObj)
      },
      err => {
        console.log("Got error on /neo request", err);
      }
    );
    return () => {};
  }, []);

  return structdata ? (
    <div className="structure-page">
      {/* struct */}
      <div>{pdbid}</div>
      <div className="structure-info">
        {structdata._species} at {structdata.resolution} Å |{" "}
        {structdata.publication}
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
        Toggle {rnaprottoggle}
      </div>
      <ul>
        {rnaprottoggle === "rRNA"
          ? protdata.map(prot => (
              <RibosomalProteinHero {...prot} {...{ pdbid }} />
            ))
          : rrnas!.map(rna => <RNAHero {...rna} />)}
      </ul>
    </div>
  ) : (
    <div>"spinner"</div>
  );
};

export default StructurePage;
