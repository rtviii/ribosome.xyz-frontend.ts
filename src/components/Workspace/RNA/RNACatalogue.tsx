import { flattenDeep, uniq } from "lodash";
import React, { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getNeo4jData } from "../../../redux/Actions/getNeo4jData";
import LoadingSpinner from "../../Other/LoadingSpinner";
import RNAHero from './RNAHero'
import './RNACatalogue.css'

export interface RNAProfile {
  description: string;
  length     : number;
  parent     : string;
  strand     : string;
}


const RNACatalogue = () => {
  const [rnas, setrnas]           = useState<RNAProfile[]>([]);
  const [trnas, settrna]          = useState<RNAProfile[]>([]);
  const [mrnas, setmrna]          = useState<RNAProfile[]>([]);
  const [class_16s, setclass_16s] = useState<RNAProfile[]>([]);
  const [class_23s, setclass_23s] = useState<RNAProfile[]>([]);
  const [class_5s, setclass_5s]   = useState<RNAProfile[]>([]);
  const [other, setother]         = useState<RNAProfile[]>([]);

  const filterByClass = (rnas: RNAProfile[], kwords: RegExp) => {
    return rnas.filter(r => {
      const desc = r.description.toLowerCase();
      if (kwords.test(desc)) {
        return true;
      } else return false;
    });
  };

  useEffect(() => {
    getNeo4jData("neo4j", { endpoint: "get_all_rnas", params: null }).then(
      response => {
        var flattened: RNAProfile[] = flattenDeep(response.data);
        setrnas(flattened);
        var mrna      = filterByClass(flattened, /m-rna|messenger|mrna/);
        var trna      = filterByClass(flattened, /t-rna|transfer|trna/);
        var class_23s = filterByClass(flattened, /23 s|23s|23-s|28s|28 s|28-s/);
        var class_16s = filterByClass(flattened, /16 s|16s|16-s|18s|18 s|18-s/);
        var class_5s  = filterByClass(
          flattened,
          /(?<!2)5 s|(?<!2)5s|(?<!2)5-s|5.8s|5.8 s/
        );
        var other = flattened.filter(
          el =>
            ![
              ...mrna,
              ...trna,
              ...class_16s,
              ...class_23s,
              ...class_5s,
            ].includes(el)
        );

        setmrna(mrna);
        settrna(trna);
        setclass_16s(class_16s);
        setclass_23s(class_23s);
        setclass_5s(class_5s);
        setother(other);
      }
    );
  }, []);
  return other.length < 1 ? <LoadingSpinner/>:  (

    <div className="rnas-catalogue">
      <div className="rnas-catalogue-grid">
        <div className="filters-tools">Filters and search</div>
        <div className="rnas-catalogue-content">
          <div className="rnaclass rna-class-23s">
            <p className="rna-class-title">23S-like RNA</p>
            {class_23s.map((r, i) => (
              <RNAHero {...r} key={i} />
            ))}
          </div>

          <div className="rnaclass rna-class-16s">
            <p className="rna-class-title">16S-like RNA</p>
            {class_16s.map((r, i) => (
              <RNAHero {...r} key={i} />
            ))}
          </div>
          <div className="rnaclass rna-class-5s">
            <p className="rna-class-title">5S-like RNA</p>
            {class_5s.map((r, i) => (
              <RNAHero {...r} key={i} />
            ))}
          </div>

          <div className="rnaclass rna-class-mrna">
            <p className="rna-class-title">mRNA</p>
            {mrnas.map((r, i) => (
              <RNAHero {...r} key={i} />
            ))}
          </div>

          <div className="rnaclass rna-class-trna">
            <p className="rna-class-title">tRNA</p>
            {trnas.map((r, i) => (
              <RNAHero {...r} key={i} />
            ))}
          </div>
          <div className="rnaclass rna-class-other">
            <p className="rna-class-title">Other/Unclassified</p>
            {other.map((r, i) => (
              <RNAHero {...r} key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RNACatalogue;
