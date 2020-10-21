import React, { useContext, useEffect, createContext } from "react";
import "./RibosomalProteinHero.css";
import { Link } from "react-router-dom";
import downicon from "./download.png";
import fileDownload from "js-file-download";
import { getNeo4jData } from "../../../redux/Actions/getNeo4jData";
import { PageContext, PageContexts } from "../../Main";
import { RibosomalProtein } from "../../../redux/RibosomeTypes";
import Accordion from "react-bootstrap/esm/Accordion";
import { Button, Card, ListGroup } from "react-bootstrap";



const RibosomalProteinHero = (data: RibosomalProtein, pdbid:string) => {
  const downloadsubchain = (pdbid: string, cid: string) => {
    getNeo4jData("neo4j", {
      endpoint: "get_pdbsubchain",
      params: { chainid: cid, structid: pdbid },
    }).then(resp => {
      fileDownload(resp.data, `${pdbid}_subchain_${cid}`);
    }, error=>{
      alert("This chain is unavailable. This is likely an issue with parsing the given struct.\nTry another struct!")
    });
  };
  

  const context: PageContexts = useContext(PageContext);
  return (
    <div className="ribosomal-protein-hero">
      <table id="rp-table">
        <tr>
          <th>RP Class</th>
          <th>Strand Id</th>
          <th>PFAM Accession</th>
          <th>Uniprot Accession</th>
        </tr>
        <tr>
          <td>
            <Link to={`/rps/${data.nomenclature[0]}`}>
              {" "}
              {data.nomenclature}
            </Link>
          </td>
          <td>{data.entity_poly_strand_id}</td>

          <td>
            <ul>
              {data.pfam_accessions.map(r => (
                <li>
                  <a href={`https://pfam.xfam.org/family/${r}`}>{r}</a>
                </li>
              ))}
            </ul>
          </td>
          <td>
            <a
              href={
                data.uniprot_accession
                  ? `https://www.uniprot.org/uniprot/${data.uniprot_accession}`
                  : ""
              }
            >
              {data.uniprot_accession}
            </a>
          </td>
        </tr>
      </table>
      <Accordion defaultActiveKey="1" style={{ fontSize: "12px" }}>
        <Card>
          <Card.Header style={{ fontSize: "12px", margin: 0, padding: 0 }}>
            <Accordion.Toggle as={Button} variant="link" eventKey="0">
              Description
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <ListGroup>
                <ListGroup.Item>
                  <p>Source organism:</p>{" "}
                  {data.rcsb_source_organism_description} (
                  {data.rcsb_source_organism_id})
                </ListGroup.Item>
                <ListGroup.Item>
                  <p>RCSB Profile:</p> {data.rcsb_pdbx_description}
                </ListGroup.Item>
                <ListGroup.Item>
                  <p>PFAM Description:</p>
                  {data.pfam_comments}
                </ListGroup.Item>
                <ListGroup.Item style={{wordBreak:"break-word"}}>
                  <p>One-letter seq({data.entity_poly_seq_length} AA):</p>
                  {data.entity_poly_seq_one_letter_code}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
};

export default RibosomalProteinHero;
      // <div
      //   className="chain-download"
      //   onClick={() => {
      //     downloadsubchain(pdbid, data.entity_poly_strand_id);
      //   }}
      // >
      //   <img src={downicon} className="down_icon" />
      // </div>
