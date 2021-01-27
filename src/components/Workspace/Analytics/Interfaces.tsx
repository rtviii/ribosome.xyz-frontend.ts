import React, { useEffect, useRef, useState } from "react";
// import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import { Ligand, rRNA } from "../../../redux/RibosomeTypes";
import { getNeo4jData } from "../../../redux/Actions/getNeo4jData";
import { Button, Card, Col, Form } from "react-bootstrap";
import "./Interfaces.css"
// import { useParams } from "react-router-dom";
import { filter, flattenDeep, isEmpty, uniq } from "lodash";
import LoadingSpinner from "../../Other/LoadingSpinner";
import { stringify } from "querystring";
import { Accordion } from "react-bootstrap";
import fileDownload from "js-file-download";
import downicon from './../../../static/download.png'
import { link } from "fs";
import pic from './../../../static/3j9m_gdp.png'


interface InterfacesProp {
  type  : "ligand" | "rna";
  target: Ligand | rRNA;
}
interface Response {
  struct  : string;
  title   : string;
  taxid   : number[];
  organism: string[];
  ligands : {chemid:string, name:string}[]
}
interface Residue {
  resn     : string;
  strand_id: string;
  banClass : string | null;
  resid    : number;
  struct   : string;
}
interface LigandInterface{
  constituents: Array<Residue>,
  nbrs        : Array<Residue>
}


const Interfaces: React.FC<InterfacesProp> = pps => {


const [allligs, setallligs]             = useState<Response[]>([])
const [reduced, setReduced]             = useState<Record<string,string>>({})
const [structligands, setstructLigands] = useState<Response[]>([])

useEffect(() => {

  getNeo4jData("neo4j", {
    endpoint: "get_ligands_by_struct",
    params: null,
  }).then(r => {
    var ligs = flattenDeep(r.data) as Response[];
    console.log(ligs.length)
    var noion = ligs.filter(bundle => {
      for (var lig of bundle.ligands){
        if (lig.name.toLocaleLowerCase().includes(" ion")){
        }else{
          return true
        }
      }
      return false
    });

    console.log(noion.length)
    setallligs(noion as any)

  var reduced:Record<string, string> = {}
  for (var bundle of ligs){
    for (var lig of bundle.ligands){
      if (Object.keys(reduced).includes( lig.chemid ) ) {
        continue
      }else{
        if (!lig.name.toLowerCase().includes(' ion')){
        reduced[lig.chemid] = lig.name
        }
      }
    }
  }

  setReduced(reduced)

})
} ,[])

const filterStruct = (structure:string, ligs:Response[])=>{
  if (isEmpty(structure) || structure === 'All'){
    return []
  }
  var fltr = ligs.filter(r => r.struct === structure)
  
  var filteredions =  fltr[0].ligands.filter(r => !r.name.toLowerCase().includes(" ion"))
  var ligands = filteredions.map(k=> ( { chemid: k.chemid, name: k.name } ))
  
  return ligands
  
}

const [ligandInterface, setligandInterface] = useState<LigandInterface>({constituents:[],nbrs:[]})

const requestLigandInterface = (struct: string, chemid: string) => {
  getNeo4jData("static_files", {
    endpoint:"get_ligand_nbhd", params:{
    chemid  :  chemid,
    struct  :  struct
  }}).then(
    r=>{
      console.log(r.data)
      if(!( r.data===-1 )){
      setligandInterface(r.data)
      }
      else{
    alert("This chain strucuture has not been parsed.")
      }
    },
    function (error){
      console.log("Errored out:", error)
    }
  )

};

const [structure, setstructure] = useState<string>("All");
const [chosenLig, setChosenLig] = useState<string>('')
useEffect(() => {
}, [])


useEffect(() => {
  if (structure === "All"){

    setChosenLig("PAR")
  }
  else{
   console.log(filterStruct(structure, allligs)[0])
   setChosenLig( filterStruct(structure, allligs)[0].chemid )
  }

}, [structure])

useEffect(() => {
  console.log(chosenLig)
}, [chosenLig])


const searchProfiles = (profiles:Response[], filter:string)=>{
  return profiles.filter(p=>( p.struct +  p.organism[0]  ).toLowerCase().includes(filter.toLowerCase()))
}
const searchLigands = (ligands:Array<[string, string]>, filter:string)=>{
  return ligands.filter(l => (l[0] + l[1]).toLowerCase().includes(filter.toLowerCase()))
}

const [search, setsearch] = useState<string>("")

useEffect(() => {
  
}, [search])

const ligref = useRef<HTMLSelectElement>(null)

const [containingStructs, setcontainingStructs] = useState<Response[]>([])
const getAllAssociatedStructs = (chmd: string) =>{
  var bystruct =  allligs.filter(l=>l.ligands.map(r=>r.chemid).includes(chmd))
  setcontainingStructs(bystruct)

}
return (
  <div className="interfaces">
    <div className="exposition">
      <div id='htw'>
        <h4>How this works</h4>
      <p>
        For a number of ribosomal structures ligands are available(ions are
        filtered out): you can inspect and download a "binding interface" for
        each ligand.
      </p>
      <p>
        A binding interface consists of the residue-wise profile of the ligand
        itself( <b> Constituents</b> ) and the [non-ligand] neighbor-residues(
        <b>Neighbors</b>) that are within the radius of 5 Angstrom of the
        ligand.
      </p>

      </div>
      <div id='search'>

      <h4>Search:</h4>
      <p>By default, search applies to the structure ids and associated species.</p>
      <p>If you wish to search over al ligands present across all structures, please select <b>All</b> in the <b>Structure</b> field. </p>
      <p>
        For each residue its ID is provided along with its parent strand
        as per the source crystallographic file, which is enough to identify a residue uniquely.
        Each strand or subchain can be separately downloaded via the <img id="downicon" src={downicon} /> icon.
        Furthermore, the individual ligand interface can also be downloaded as a{" "}<code>.json</code> report.
      </p>
      </div>
      <div id='results'>

<img id='pic' src={pic} alt="illustration"/>
      </div>

    </div>

    <div className="interface-form">
      <div className="lig-filters">
        <h4>Search</h4>
        <input
          value={search}
          onChange={e => {
            var value = e.target.value;
            setsearch(value);
          }}
        />
        <Button
          variant="primary"
          id="submit"
          onClick={e => {
            e.preventDefault();
            setsearch("");
            setstructure("All");
          }}
        >
          Reset
        </Button>
      </div>
      <div className="lig-selection">
        <div className="row">
          <span>Structure</span>

          <Form.Control
            as="select"
            value={structure}
            onChange={e => {
              setstructure(e.target.value);
            }}
          >
            <option>All</option>
            {searchProfiles(allligs, search).map(l => (
              <option value={l.struct}>{`${l.struct} ${l.organism[0]}`}</option>
            ))}
          </Form.Control>
        </div>

        <div className="row">
          <span>Ligand</span>

          <Form.Control
            ref={ligref}
            as="select"
            value={chosenLig}
            onChange={e => {
              setChosenLig(e.target.value);
            }}
          >
            {structure === "All"
              ? searchLigands(Object.entries(reduced), search).map(lig => (
                  <option value={lig[0]}>{`${lig[0]} ( ${lig[1]} )`}</option>
                ))
              : filterStruct(structure, allligs).map(lig => (
                  <option
                    value={lig.chemid}
                  >{`${lig.chemid} ( ${lig.name} )`}</option>
                ))}
          </Form.Control>
        </div>
        <Button
          variant="primary"
          type="submit"
          id="submit"
          onClick={e => {
            e.preventDefault();

            if (structure !== "All"){

            var ligand;
            if (ligref != null) {
              ligand = ligref.current!.value;
            } else {
              ligand = "";
            }
            requestLigandInterface(structure, chosenLig);
            }
            else{
              getAllAssociatedStructs(chosenLig)
            }
          }}
        >
          Get Interfaces
        </Button>
      </div>

      <div className="lig-result">
        <InterfaceDisplay
          data={ligandInterface}
          chemid={chosenLig}
          struct={structure}
          containingStructs={containingStructs}
        />
      </div>
    </div>
  </div>
);
};

const ResidueProfile = ({ res }: { res: Residue }) => {
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
        fileDownload(resp.data, `${pdbid}_${cid}.cif`, 'chemical/mm-cif');
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
    <div className="residue-profile">
      <span>{res.resn === " " ? "Unnamed" : res.resn}</span>
      <span>{res.resid}</span>
      <span
        onClick={() => {
          parseAndDownloadChain(res.struct, res.strand_id);
        }}
      >
        {res.strand_id}
        <img id='downicon' src={downicon} alt="downloadchain"/>
      </span>
      <span>{res.banClass ? `(${res.banClass})` : ""}</span>
    </div>
  );
};

const InterfaceDisplay = ({data, chemid, struct, containingStructs}:{ data:LigandInterface, struct:string, chemid:string, containingStructs:Response[] }) => {
  return  !( struct ==="All" ) ?(
    <Accordion defaultActiveKey="0" className='interface-display'>
      <Card>
        <Card.Header>
          <Accordion.Toggle as={Button} variant="link" eventKey="0">
            Constituents{" "}
            {data.constituents.length > 0 ? (
              <button
                onClick={() => {
                  getNeo4jData("static_files", {
                    endpoint: "download_ligand_nbhd",
                    params: {
                      chemid    :  chemid,
                      structid  :  struct,
                    },
                  }).then(r =>
                    fileDownload(
                      JSON.stringify(r.data),
                      `${struct}_${chemid}_ligandProfile.json`,
                      "application/json"
                    )
                  );
                }}
              >
                Download
              </button>
            ) : null}
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <div id="nbrs-hdr">
              <span>Residue</span>
              <span>ID</span>
              <span>Strand</span>
              <span>Ban Class</span>
            </div>
            {data.constituents.map(x => (
              <ResidueProfile res={x} />
            ))}
          </Card.Body>
        </Accordion.Collapse>
      </Card>
      <Card>
        <Card.Header>
          <Accordion.Toggle as={Button} variant="link" eventKey="1">
            Neighbors
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="1">
          <Card.Body>
            <div id="nbrs-hdr">
              <span>Residue</span>
              <span>ID</span>
              <span>Strand</span>
              <span>Ban Class</span>
            </div>
            {data.nbrs.map(x => (
              <ResidueProfile res={x} />
            ))}
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  ) : (
    <div>

  {containingStructs.map(r => <li>[ {r.struct} ]  {r.organism}</li>)}


    </div>
  )
}


export default Interfaces;
