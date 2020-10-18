import { flattenDeep, uniq } from "lodash";
import React, { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { getNeo4jData } from "../../../redux/Actions/getNeo4jData";
import './RNACatalogue.css'

interface RNAProfile {
  description: string;
  length: number;
  parent: string;
  strand: string;
}

const RNAHero = (rna:RNAProfile) => {
  return <div className="rna-hero">
      
      <p>Description: {rna.description}</p>
      <p>Parent structure: {rna.parent}</p>
      <p>RCSB strand id: {rna.strand}</p>
      <p>AA Length: {rna.length}</p>


  </div>;
};
const RNACatalogue = () => {
  const [rnas, setrnas] = useState<RNAProfile[]>([]);
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
        var class_23s = filterByClass(flattened, /23 s|23s|23-s/);
        var class_16s = filterByClass(flattened, /16 s|16s|16-s/);
        var class_5s  = filterByClass(flattened,/(?<!2)5 s|(?<!2)5s|(?<!2)5-s|5.8s|5.8 s/);
        var other     = flattened.filter(el => ! [...mrna,...trna,...class_16s, ...class_23s,...class_5s].includes(el))
        
        setmrna(mrna)
        settrna(trna)
        setclass_16s(class_16s)
        setclass_23s(class_23s)
        setclass_5s(class_5s)
        setother(other)

      }
    );
  }, []);
  return (
    <div className="rnas-catalogue">
      <div className="rnas-catalogue-grid">
        <div className="filters-tools">Filters and search</div>
        <div className="rnas-catalogue-content">
          <div className="rnaclass rna-class-23s">
            <p className="rna-class-title">23S RNA</p>
            {class_23s.map((r, i) => (
              <RNAHero {...r} key={i} />
            ))}
          </div>

          <div className="rnaclass rna-class-16s">



          </div>
          <div className="rnaclass rna-class-5s"> 
          
          </div>
          <div className="rnaclass rna-class-mrna">

          </div>
          <div className="rnaclass rna-class-trna"></div>
          <div className="rnaclass rna-class-other"></div>
        </div>
      </div>
    </div>
  );
};

export default RNACatalogue;
