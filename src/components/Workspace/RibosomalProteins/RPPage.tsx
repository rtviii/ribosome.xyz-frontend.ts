import React, { useEffect, useState, createContext, Children } from "react";
import "./RPPage.css";
import { useParams, Link } from "react-router-dom";
import {flattenDeep} from "lodash";
import { RibosomalProtein } from "../../../redux/RibosomeTypes";
import RibosomalProteinHero from "./RibosomalProteinHero";
import { getNeo4jData } from "../../../redux/Actions/getNeo4jData";
import { PageContext } from "../../Main";

interface NeoHomolog {
  subchain_of: string;
  protein: RibosomalProtein;
}

const RPPage = () => {
  var params: any = useParams();
  const [homologs, sethomologs] = useState<NeoHomolog[]>([]);

  useEffect(() => {
    var banName = params.nom;

    getNeo4jData("neo4j", {
      endpoint: "get_homologs",
      params: {
        banName: banName,
      },
    }).then(
      r => {
        var flattened: NeoHomolog[] = flattenDeep(r.data);
        sethomologs(flattened);
      },
      e => {
        console.log("Got error on /neo request", e);
      }
    );

    return () => {};
  }, [params]);

  return params!.nom ? (
    <PageContext.Provider value="RibosomalProteinPage">
      <div className="rp-page">
        <h1>{params.nom}</h1>
        <h4>Homologs</h4>
        <ul className="rp-homologs">
          {homologs.map((e: NeoHomolog) => {
            return (
              <div style={{ display: "flex" }}>
                <RibosomalProteinHero {...e.protein} pdbid={e.subchain_of} />{" "}
                <Link
                  style={{ width: "min-content" }}
                  to={`/catalogue/${e.subchain_of}`}
                >
                  <div>{e.subchain_of}</div>
                </Link>
              </div>
            );
          })}
        </ul>
      </div>
    </PageContext.Provider>
  ) : (
    <div>"nohting"</div>
  );
};

export default RPPage;
