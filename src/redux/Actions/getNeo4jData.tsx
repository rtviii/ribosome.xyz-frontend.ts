import Axios from "axios";
const BACKEND: any = process.env.REACT_APP_DJANGO_URL;
type  DjangoAPIs   = "neo4j" | "admin" | "pdb";

type Neo4jEndpoints =
  | getStructure
  | getAllStructures
  | getHomologs
  | listAvailableRPs
  | customCypher
  | gmoNomClass
  | getAllLigands
  | getAllRnas
  | getRnasByStruct
  | getLigandsByStruct
  | downloadCifChain
  | get_ligand_nbhd
  | download_ligand_nbhd;


interface get_ligand_nbhd {
  endpoint:"get_ligand_nbhd",
  params:{
    struct: string,
    chemid  : string;
  }
}
interface download_ligand_nbhd {
  endpoint:"download_ligand_nbhd",
  params:{
    structid: string,
    chemid  : string;
  }
}

interface downloadCifChain{
  endpoint: "cif_chain",
  params:{
    structid: string,
    chainid : string
  }
}
interface getRnasByStruct{
  endpoint: "get_rnas_by_struct",
  params  : null
}
interface getLigandsByStruct{
  endpoint: "get_ligands_by_struct",
  params  : null
}

interface getAllRnas{
endpoint: "get_all_rnas";
params  : null
}

interface getStructure {
  endpoint: "get_struct";
  params: {
    pdbid: string;
  };
}
interface getHomologs {
  endpoint: "get_homologs";
  params: {
    banName: string;
  };
}
interface customCypher {
  endpoint: "cypher";
  params: {
    cypher: string;
  };
}
interface getAllStructures {
  endpoint: "get_all_structs";
  params: null;
}
interface listAvailableRPs {
  endpoint: "list_nom_classes";
  params  : null;
}
interface gmoNomClass {
  endpoint: "gmo_nom_class";
  params: {
    banName: string;
  };
}
interface getAllLigands{
  endpoint: 'get_all_ligands',
  params: null
}

export const getNeo4jData = (api: DjangoAPIs, ep: Neo4jEndpoints) => {
  const URI = encodeURI(`${BACKEND}/${api}/${ep.endpoint}/`);
  return ep.params != null ? Axios.get(URI, { params: ep.params }) : Axios.get(URI);
};
