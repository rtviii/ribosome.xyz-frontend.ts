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

const StructurePage = () => {
  const { pdbid } = useParams();
  const [structdata, setstruct] = useState<RibosomeStructure>();
  const [protdata, setprots] = useState<RibosomalProtein[]>([]);
  const [rrnas, setrrnas] = useState<rRNA[]>([]);
  const [rnaprottoggle, togglernaprot] = useState("rRNA");

  useEffect(() => {
    getNeo4jData("neo4j", {
      endpoint: "get_struct",
      params: { pdbid: pdbid },
    }).then(
      resp => {
        var respObj: {
          RibosomeStructure: RibosomeStructure;
          rRNAs: rRNA[];
          ribosomalProteins: RibosomalProtein[];
        } = flattenDeep(resp.data)[0] as any;
        setprots(respObj.ribosomalProteins);
        setrrnas(respObj.rRNAs);
        setstruct(respObj.RibosomeStructure);
      },
      err => {
        console.log("Got error on /neo request", err);
      }
    );
    return () => {};
  }, []);

  useEffect(() => {
    var y = protdata.filter(x => {
      var Subunits = flattenDeep(
        x.nomenclature.map(name => {
          return name.match(/S|L/g);
        })
      );
      return Subunits.includes("S") && !Subunits.includes("L");
    });
    console.log(y.map(x => x.nomenclature));
  }, [protdata]);

  return structdata ? (
    <div className="structure-page">
      {/* struct */}
      <h1>{pdbid}</h1>
      <div className="structure-info">
        {structdata._species} at {structdata.resolution} Å |{" "}
        {structdata.publication}
      </div>
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
      {rnaprottoggle === "rRNA" ? (
        <div className="by-subunit">
          <ul className="ssu">
            <h2>SSU</h2>
            {protdata
              .filter(x => {
                var Subunits = flattenDeep(
                  x.nomenclature.map(name => {
                    return name.match(/S|L/g);
                  })
                );
                return Subunits.includes("L") && !Subunits.includes("S");
              })
              .map(x => (
                <RibosomalProteinHero {...{ pdbid }} {...x} />
              ))}
          </ul>
          <ul className="lsu">
            <h2>LSU</h2>
            {protdata
              .filter(x => {
                var Subunits = flattenDeep(
                  x.nomenclature.map(name => {
                    return name.match(/S|L/g);
                  })
                );
                return Subunits.includes("S") && !Subunits.includes("L");
              })
              .map(x => (
                <RibosomalProteinHero {...{ pdbid }} {...x} />
              ))}
          </ul>
          <ul className="uncharacterized">
            <h2>Uncharacterized</h2>
            {protdata
              .filter(x => {
                var Subunits = flattenDeep(
                  x.nomenclature.map(name => {
                    return name.match(/S|L/g);
                  })
                );
                return (
                  (Subunits.includes("S") && Subunits.includes("L")) ||
                  Subunits.length === 0 ||
                  Subunits.includes(null)
                );
              })
              .map(x => (
                <RibosomalProteinHero {...{ pdbid }} {...x} />
              ))}
          </ul>
        </div>
      ) : (
        rrnas!.map(rna => <RNAHero {...rna} />)
      )}
    </div>
  ) : (
    <div>"spinner"</div>
  );
};

export default StructurePage;
