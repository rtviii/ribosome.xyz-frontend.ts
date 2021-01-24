import { flattenDeep } from "lodash";
import React, { useEffect, useState } from "react";
import { getNeo4jData } from "../../../redux/Actions/getNeo4jData";
import LoadingSpinner from "../../Other/LoadingSpinner";
import RNAHero from './RNAHero'
import './RNACatalogue.css'
import { Accordion, Card } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { transformToShortTax } from "./../../Main";
import {ReactMarkdownElement, md_files} from './../../Other/ReactMarkdownElement'

export interface RNAProfile {
  description: string;
  length     : number;
  parent     : string;
  strand     : string;
  orgname    : string[];
  orgid      : number[];
}


const truncate = (str:string) =>{
    if (typeof str ==='undefined'){
      return " "
    }
    return str.length > 20 ? str.substring(0, 15) + "..." : str;
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

  const [organismFilter, setorganismFilter] = useState<Array<number>>([])
  useEffect(()=>{
    getNeo4jData("neo4j", { endpoint: "get_all_rnas", params: null }).then(
      response => {
        var flattened: RNAProfile[] = flattenDeep(response.data);
        setrnas(flattened)})
  }, [])

  useEffect(() => {
        var mrna       = filterByClass(rnas, /m-rna|messenger|mrna/);
        var trna       = filterByClass(rnas, /t-rna|transfer|trna/);
        var class_23s  = filterByClass(rnas, /23 s|23s|23-s|28s|28 s|28-s/);
        var class_16s  = filterByClass(rnas, /16 s|16s|16-s|18s|18 s|18-s/);
        var class_5s   = filterByClass(rnas,/(?<!2)5 s|(?<!2)5s|(?<!2)5-s|5.8s|5.8 s/);

        var other = rnas.filter(
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
     
  }, [rnas, organismFilter]);

  const [organismsAvailable, setorganismsAvailable] = useState({})
  useEffect(() => {
    var organisms = rnas.map(str => {
      return {
        name: str.orgname.map(x => x.toLowerCase()),
        id  : str.orgid
      };
    });

    const orgsdict: { [id: string]: { names:string[], count:number } } = {};
    organisms.map(org => {
      org.id.forEach((id:number, index:number) => {
        if (!Object.keys(orgsdict).includes(id.toString())) {
          orgsdict[id] = {
            names:[],
            count:1
          }
          orgsdict[id].names.push(org.name[index])
        }else{
          orgsdict[id].names.push(org.name[index])
          orgsdict[id].count+=1
        }
      });
    });
    console.log(orgsdict)
    setorganismsAvailable(orgsdict)
  }, [rnas]);

  const filterByOrganims = (
    elems: RNAProfile[],
    filter: number[]
  ): RNAProfile[] => {
    if (filter.length === 0) {
      console.log("yep its empty, returning all", elems.length);
      return elems;
    }

    if (filter.length > 0) {
      var ftrd = elems.filter(elem => {
        for (var n of elem.orgid) {
          if (filter.includes(n)) return true;
        }
        return false;
      });
      return ftrd;
    }
    return elems;
  };

  useEffect(() => {

    console.log(organismFilter);
    
  }, [organismFilter])

  return other.length < 1 ? (
    <LoadingSpinner annotation='Loading RNA...' />
  ) : (
    <div className="rnas-catalogue">
      <div className="rnas-catalogue-grid">

        <div className="filters-tools">
          <Accordion defaultActiveKey="0">
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                  Species
                </Accordion.Toggle>
              </Card.Header>

              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <div className="wspace-species">
                    <li>
                      <div className="species-filter">
                        <div></div>
                        <div>Tax</div>
                        <div>Total</div>
                      </div>
                    </li>
                    {Object.entries(organismsAvailable).map((tpl: any) => {
                      transformToShortTax(tpl[1].names[0]);
                      return (
                        <li>
                          <div className="species-filter">
                            <input
                              onChange={e => {
                                var checked = e.target.checked;
                                var id = e.target.id;

                                if (!checked) {
                                  console.log("id popped", tpl[0]);
                                  setorganismFilter(
                                    organismFilter.filter(id => id !== parseInt(tpl[0]))
                                  );
                                } else {
                                  console.log("id pushed", tpl[0]);
                                  setorganismFilter([
                                    ...organismFilter,
                                    parseInt(tpl[0]),
                                  ]);
                                }
                              }}
                              type="checkbox"
                              id={tpl[0]}
                            />
                            <div>
                              {truncate(transformToShortTax(tpl[1].names[0]))}{" "}
                              (id:{tpl[0]})
                            </div>
                            <div>{tpl[1].count}</div>
                          </div>
                        </li>
                      );
                    })}
                  </div>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </div>

        <div className="rnas-catalogue-content">
        <ReactMarkdownElement    md={md_files.all.rnas.rnas_page}   />
          <div className="rnaclass rna-class-23s">
            <p className="rna-class-title">23S-like RNA</p>
            {
            
            filterByOrganims(class_23s, organismFilter).map((r, i) => (
              <RNAHero rna={r} key={i} />))
              
              }
          </div>

          <div className="rnaclass rna-class-16s">
            <p className="rna-class-title">16S-like RNA</p>
            {filterByOrganims( class_16s, organismFilter ).map((r, i) => (
              <RNAHero rna={r} key={i} />
            ))}
          </div>
          <div className="rnaclass rna-class-5s">
            <p className="rna-class-title">5S-like RNA</p>
            {filterByOrganims( class_5s, organismFilter ).map((r, i) => (
              <RNAHero rna={r} key={i} />
            ))}
          </div>

          <div className="rnaclass rna-class-mrna">
            <p className="rna-class-title">mRNA</p>

            {filterByOrganims( mrnas, organismFilter ).map((r, i) => (
              <RNAHero rna={r} key={i} />
            ))}
          </div>

          <div className="rnaclass rna-class-trna">
            <p className="rna-class-title">tRNA</p>
            {filterByOrganims( trnas, organismFilter ).map((r, i) => (
              <RNAHero rna={r} key={i} />
            ))}
          </div>
          <div className="rnaclass rna-class-other">
            <p className="rna-class-title">Other/Unclassified</p>
            {filterByOrganims( other, organismFilter ).map((r, i) => (
              <RNAHero rna={r} key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RNACatalogue;
