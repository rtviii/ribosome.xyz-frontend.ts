import React, { useEffect, useRef, useState } from "react";
import { Ligand, rRNA } from "../../../redux/RibosomeTypes";
import { getNeo4jData } from "../../../redux/Actions/getNeo4jData";
import { Button, Col, Form } from "react-bootstrap";
import "./Interfaces.css"
// import { useParams } from "react-router-dom";
import { flattenDeep, isEmpty, uniq } from "lodash";
import LoadingSpinner from "../../Other/LoadingSpinner";

interface InterfacesProp {
  type  : "ligand" | "rna";
  target: Ligand | rRNA;
}
interface URLParams{
  structure: string | 'all';
  type     : 'rna' | 'ligand'
  id       : string
}
interface Response{
  struct : string,
  ligands: string[]
}
interface LigandNeighborhood{  
  center_target  : string
  residue_id     : number,
  resname        : string
  strand_banClass: string | null
  strand_id      : string
}
const Interfaces: React.FC<InterfacesProp> = pps => {


const [ligandNeighborhood, setLigandNeighborhood] = useState<LigandNeighborhood[]>([])
const [loadingInterfaces, setLoading]             = useState<boolean>(false)
// var   params: URLParams                           = useParams();

const [ligands, setLigands] = useState<Response[]>([])
useEffect(() => {
  getNeo4jData("neo4j", {
    endpoint: "get_ligands_by_struct",
    params: null,
  }).then(r => {
    var ligs =flattenDeep( r.data ) as Response[];
    setLigands(ligs)
})
} ,[])

const inallfilter = (ligs:Response[]) =>{
  return uniq(ligs.reduce((chemids:string[],m:Response )=>{
    for (var chmd of m.ligands  ){
      chemids.push(chmd)
    }
    return chemids
  },[]))
}
const filterStruct = (structure:string, ligs:Response[])=>{

  if (isEmpty(structure)){
    return []
  }
  var filtered =  flattenDeep(ligs.filter(r=>r.struct === structure) )[0]
  return filtered.ligands
}

const requestLigandInterfaces = (struct: string, ligands: string[]) => {
  console.log("Request got params:");
  console.log(struct);
  console.log(ligands);

  setLoading(true)
  for (var ligand of ligands) {
    getNeo4jData("neo4j", {
      endpoint: "ligand_neighborhood",
      params: {
        chemical_id: ligand,
        structure: struct,
      },
    }).then(r => {
      console.log(r.data);
      setLigandNeighborhood(r.data)
      setLoading(false)
    });
  }
};

const [structure, setstructure] = useState<string>("All");
const[chosenLig, setChosenLig] = useState<string>('')
useEffect(() => {
  console.log(structure);
}, [structure])
const ligref = useRef<HTMLSelectElement>(null)
return (
  <div className="interfaces">

  <div className="interface-form">
    <Form>
      <Form.Row>
        <Form.Group as={Col} controlId="formGridPassword">
          <Form.Label>Structure</Form.Label>
          <Form.Control
            as="select"
            defaultValue={structure}
            onChange={e => {
              setstructure(e.target.value);
            }}
          >
            <option>All</option>
            {ligands.map(l => (
              <option>{l.struct}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group as={Col} controlId="formGridPassword">
          <Form.Label>Ligand</Form.Label>
          <Form.Control
            ref={ligref}
            as="select"
            value={chosenLig}
            onChange={e => {
              setChosenLig(e.target.value);
            }}
          >
            {structure === "All"
              ? inallfilter(ligands).map(lig => <option>{lig}</option>)
              : filterStruct(structure, ligands).map(lig => (
                  <option>{lig}</option>
                ))}
          </Form.Control>
        </Form.Group>
      </Form.Row>

      <Button
        variant="primary"
        type="submit"
        onClick={e => {
          e.preventDefault();

          var ligand;
          if (ligref != null) {
            ligand = ligref.current!.value;
          } else {
            ligand = "";
          }
          requestLigandInterfaces(structure, [ligand]);
        }}
      >
        Get Interface
      </Button>
    </Form>

    <div className="interfaces-display">
      {loadingInterfaces ? (
        <LoadingSpinner />
      ) : (
        ligandNeighborhood.map(r => {
          return (
            <div>
              <li>
                Residue {r.residue_id} of chain {r.strand_id}(class: {r.strand_banClass})
              </li>
            </div>
          );
        })
      )}
    </div>
  </div>
  </div>
);
};

export default Interfaces;
