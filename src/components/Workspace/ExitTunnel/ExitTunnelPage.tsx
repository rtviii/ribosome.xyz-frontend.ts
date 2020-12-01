import fileDownload from 'js-file-download'
import { chain } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Accordion, Button, Card, ListGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getNeo4jData } from '../../../redux/Actions/getNeo4jData'
import tunneldemo from './../../../static/tunneldemo.gif'
import './ExitTunnelPage.css'
import downicon from './../../../static/download.png'
import { Ligand, RibosomalProtein, RibosomeStructure, rRNA } from '../../../redux/RibosomeTypes'
import Lightbox from 'react-image-lightbox'
import {ReactMarkdownElement,md_files} from './../../Other/ReactMarkdownElement'



const getfile = (pdbid:string,ftype:"report"|"centerline")=>{
  var pdbid = pdbid.toUpperCase()

  getNeo4jData("static_files",{
    endpoint:"tunnel", 
    params:{
      struct    :  pdbid,
      filetype  :  ftype

  }}).then(

      r=>{ 
        if (ftype ==='report'){
        fileDownload(JSON.stringify(r.data), ftype === 'report' ? `${pdbid}_tunnel_report.json`: `${pdbid}_tunnel_centerline.csv`) 
        }
      else{
        fileDownload(r.data,  `${pdbid}_tunnel_centerline.csv`) 
        }
        }
  )
}

interface ResidueProfile{
    isligand  :  boolean
    strand    :  string
    resid     :  number
    resname   :  string
    polytype  :  string
    nom       :  string[] | null;
}

interface TunnelWall{
    pdbid        :  string,
    probeRadius  :  number,
    proteins     :  { [ chain:string ]:ResidueProfile[] }
    rna          :  { [ chain:string ]:ResidueProfile[] }
    ligands      :  ResidueProfile[]
    nomMap       :  {
      [chain:string]: string[]
    }
}

        
const TunnelWallProfile:React.FC = ({children})=>{

    type StructResponseShape = {
      structure: RibosomeStructure,
      ligands  : Ligand[],
      rnas     : rRNA[],
      rps      : RibosomalProtein[]
    }
    const [wall, setwall] = useState<TunnelWall>({
        pdbid        :  "null",
        probeRadius  :  0,
        proteins     :  {},
        rna          :  {},
        ligands      :  [],
        nomMap       :  {}
    })
    const [structState, setstruct] = useState<StructResponseShape[]>([] as StructResponseShape[])


    
    useEffect(() => {
      getNeo4jData("neo4j",{endpoint:"get_struct", params:{
        pdbid:wall.pdbid
      }}).then(re=>{ 
        setstruct(re.data[0]) 
      }
        
      )
    }, [wall])

    useEffect(() => {

        getNeo4jData("static_files",{endpoint:"tunnel", params:{
            struct:'4UG0',
            filetype:'report',
        }}).then(
            r=> { 
                setwall(r.data)
                console.log(r.data) },
                e=>console.log("error", e)
        )}, [])

    return (
      <div>
        <div className="tunnel-head">
          <span className="head-id">
            <strong>{wall.pdbid}</strong>
          </span>
          <span className="head-title">
            {structState && structState.length > 0
              ? structState[0].structure.citation_title
              : null}
          </span>
          <span className="head-species">
            {structState && structState.length > 0
              ? structState[0].structure._organismName
              : null}
          </span>
        </div>
        <Button
          variant="secondary"
          style={{ marginRight: "10px" }}
          onClick={() => getfile(wall.pdbid, "report")}
        >
          {" "}
          <code>.json</code> report
          <img id="down-wall-prot" src={downicon} alt="download protein" />
        </Button>
        <Button
          variant="secondary"
          onClick={() => getfile(wall.pdbid, "centerline")}
        >
          {" "}
          <code>.csv</code> centerline
          <img id="down-wall-prot" src={downicon} alt="download protein" />
        </Button>

        <div className="tunnel-wall-profile">
          <div id="prot-top">
            <h4>Adjacent Proteins</h4>
            <div className="protein-container">
              {Object.entries(wall.proteins).map(r => {
                return (
                  <WallChain
                    pdbid={wall.pdbid}
                    chain={r[0]}
                    banid={wall.nomMap[r[0]] ? wall.nomMap[r[0]][0] : null}
                    resids={r[1]}
                  />
                );
              })}
            </div>
          </div>

          <div id="rna-top">
            <h4>Adjacent RNA</h4>
            <div className="rna-container">
              {Object.entries(wall.rna).map(r => {
                return (
                  <WallChain
                    pdbid={wall.pdbid}
                    chain={r[0]}
                    banid={wall.nomMap[r[0]] ? wall.nomMap[r[0]][0] : null}
                    resids={r[1]}
                  />
                );
              })}
            </div>
          </div>

          <div id="lig-top">
            <h4>Ligands & Small Molecules</h4>
            <div className="ligand-container">
              {wall.ligands.map(l => {
                return (
                  <div className="wall-ligand">
                    <span>
                      <Link to={`/ligands/${l.resname}`}>{l.resname}</Link>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
}


const WallChain:React.FC<{banid:string|null, chain:string, resids:ResidueProfile[], pdbid:string}> = ({chain, resids, banid, pdbid}) =>{

  const parseAndDownloadChain = (pdbid: string, cid: string) => {
    var duplicates = cid.split(",");
    if (duplicates.length > 1) {
      var cid = duplicates[0];
    }

    getNeo4jData("static_files", {
      endpoint: "cif_chain",
      params: { structid: pdbid, chainid: cid },
    }).then(
      resp => {
        fileDownload(resp.data, `${pdbid}_${cid}.cif`);
      },
      error => {
        alert(
          "This chain is unavailable. This is likely an issue with parsing the given struct.\nTry another struct!" +
            error
        );
      }
    );
  };
  return (
    <div>
      <Card style={{ width: "8rem" }} className="wallchain">
        <Card.Header className="wc-header">
          {banid?  <Link to={`/rps/${banid}`}>{banid}</Link> : chain}

            <div
              className="down-banner"
              onClick={() =>
                parseAndDownloadChain(pdbid, chain)
              }
            >
                <button className='down-prot-button'>
                  <img
                    id="down-wall-prot"
                    src={downicon}
                    alt="download protein"
                  />
                </button>
            </div>
        </Card.Header>

        <ListGroup variant="flush" id='list-group'>
          {resids.map(self => (
            <ListGroup.Item
            style={
              {margin:"0px", padding:"5px"}
            }>
              <div className={ `lig ${self.isligand ? "isligand" : null} ` }><span><strong>{self.resname}</strong></span><span>{self.resid}</span></div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    </div>
  );

}



const ExitTunnelPage = () => {
const [setOpen, setsetOpen] = useState<boolean>(false)
    return (
      <div className="exit-tunnel-page">
        <div className="tip-and-filters">
          <Accordion defaultActiveKey="0" className="expose">
            <Card>
              <Card.Header>
                <Accordion.Toggle
                  id="card-head"
                  as={Button}
                  variant="link"
                  eventKey="1"
                >
                  + Filters & Search
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="1">
                <Card.Body>
                  <div className="tools">
                    <p>
                      {" "}
                      These things are being implemented at the moment. Thanks
                      for checking back in later!
                    </p>
                    <div className="filler">
                      <span>Filter by species:</span>
                      <input type="text" />
                    </div>
                    <div className="filler">
                      <span>Filter by translation cycle state:</span>
                      <input type="text" />
                    </div>
                    <div className="filler">
                      <span>Filter by RP:</span>
                      <input type="text" />
                    </div>
                    <input type="checkbox" name="" id="" />
                    <input type="checkbox" name="" id="" />
                    <input type="checkbox" name="" id="" />
                    <input type="checkbox" name="" id="" />
                  </div>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>

          <Accordion defaultActiveKey="1" className="expose">
            <Card>
              <Card.Header>
                <Accordion.Toggle
                  id="card-head"
                  as={Button}
                  variant="link"
                  eventKey="1"
                >
                  + How does this work?
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="1">
                <Card.Body>
                  
                  <ReactMarkdownElement
                  md={md_files.all.tunnel.tunnel_page}
                  
                  />
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>

        </div>

        <TunnelWallProfile />
      </div>
    );
}

export default ExitTunnelPage
