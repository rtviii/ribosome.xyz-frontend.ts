import React, { useState, useRef} from "react";
import "./RibosomalProteinHero.css";
import { Link } from "react-router-dom";
import downicon from "./../../../static/download.png"
import fileDownload from "js-file-download";
import { getNeo4jData } from "../../../redux/AsyncActions/getNeo4jData";
import { RibosomalProtein } from "../../../redux/RibosomeTypes";
import Accordion from "react-bootstrap/esm/Accordion";
import { Button, Card, ListGroup } from "react-bootstrap";


const RibosomalProteinHero = ({
  pdbid,
  data,
}: {
  pdbid: string;
  data: RibosomalProtein;
}) => {
  const [isFetching, setisFetching] = useState<boolean>(false);
  const parseAndDownloadChain = (pdbid: string, cid: string) => {

    setisFetching(true);

    var duplicates = cid.split(",");

    if (duplicates.length > 1) {

      var cid = duplicates[0];

    }

    getNeo4jData("static_files", {

      endpoint  :  "cif_chain",
      params    :  { structid: pdbid, chainid: cid },

    })
    .then(
      resp => {
        setisFetching(false);
        fileDownload(resp.data, `${pdbid}_${cid}.cif`);
      },
      error => {
        alert(
          "This chain is unavailable. This is likely an issue with parsing the given struct.\nTry another struct!" + error
        );
        setisFetching(false);
      }
    );
  };


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
          <Card.Header
            style={{
              fontSize: "12px",
              margin: 0,
              padding: "0px 20px 0px 0px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Accordion.Toggle as={Button} variant="link" eventKey="0">
              Description
            </Accordion.Toggle>
            <div
              className="down-banner"
              onClick={() =>
                parseAndDownloadChain(pdbid, data.entity_poly_strand_id)
              }
            >
              {isFetching ? (
                "loading"
              ) : (
                <button className='down-prot-button'>
                  <img
                    id="download-protein"
                    src={downicon}
                    alt="download protein"
                  />
                </button>
              )}
            </div>
          </Card.Header>

          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <ListGroup>
                <ListGroup.Item>
                  <div>

                  <p>Source organism:</p>{" "}
                  {data.rcsb_source_organism_description} (
                  {data.rcsb_source_organism_id})
                  <p>RCSB Profile:</p> {data.rcsb_pdbx_description}
                  <p>PFAM Description:</p>
                  <div className='pfamdescription-aa'>
                  {data.pfam_comments}
                  </div>
                  <p>One-letter seq({data.entity_poly_seq_length} AA):</p>
                  <div className='pfamdescription-aa'>
                  {data.entity_poly_seq_one_letter_code}

                  </div>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
};


// const mapDispatch = (dispatch:Dispatch<AppActions>, ownprops:any):{add_to_cart: (item:CartItem)=>void}=>({
//   add_to_cart         :  (item)=>dispatch(cart_add_item(item))
// })

export default  RibosomalProteinHero;
