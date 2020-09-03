import React, { useEffect, useState } from "react";
import "./RPPage.css";
import { useParams, Link } from "react-router-dom";
import _, { flatten } from "lodash";
import Axios from "axios";
import { RibosomalProtein } from "../../../redux/RibosomeTypes";
import RibosomalProteinHero from "../StructurePage/RibosomalProteinHero";

const BACKEND = process.env.REACT_APP_DJANGO_URL;

interface NeoHomolog {
  subchain_of: string;
  protein: RibosomalProtein;
}
const RPPage = () => {
  var params: any = useParams();
  const [homologs, sethomologs] = useState<NeoHomolog[]>([]);

  useEffect(() => {
    console.log("Got PArams :", params);
    var banName = params.nom;
    const djurl = encodeURI(
      `${BACKEND}/neo4j/get_homologs/?banName=${banName}`
    );
    
    Axios.get(djurl).then(
      r => {
        var flattened: NeoHomolog[] = _.flattenDeep(r.data);
        sethomologs(flattened);
      },
      e => {
        console.log("Got error on /neo request", e);
      }
    );

    return () => {};
  }, [params]);

  return params!.nom ? (
    <div className="rp-page">
      <h1>{params.nom}</h1>
      <h4>Homologs</h4>
      <ul className="rp-homologs">
        {homologs.map((e: NeoHomolog) => {
          return (
            <div style={{ display: "flex" }}>
              <RibosomalProteinHero {...e.protein} pdbid={e.subchain_of} />{" "}
              <Link style={{width:'min-content'}} to={`/catalogue/${e.subchain_of}`}>
                <div>{e.subchain_of}</div>
              </Link>
            </div>
          );
        })}
      </ul>
    </div>
  ) : (
    <div>"nohting"</div>
  );
};

export default RPPage;
