import React, { useEffect } from "react";
import "./RPPage.css";
import { useParams } from "react-router-dom";
import _ from "lodash";
import Axios from "axios";


const BACKEND = process.env.REACT_APP_DJANGO_URL


const RPPage = () => {
  var params: any = useParams();


  useEffect(() => {
    console.log("Got PArams :", params);
    var banName = params.nom;
    const djurl = encodeURI(
      `${BACKEND}/neo4j/get_homologs/?banName=${banName}`
    );
    Axios.get(djurl).then(
      r => {

        console.log(_.flattenDeep(r.data));
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
      <ul className="rp-homologs">
          

      </ul>
    </div>
  ) : (
    <div>"nohting"</div>
  );
};

export default RPPage;
