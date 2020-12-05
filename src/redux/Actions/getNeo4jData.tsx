import Axios from "axios";

const BACKEND: any   = process.env.REACT_APP_DJANGO_URL;
type  DjangoAPIs     = "neo4j" | "static_files" 


type  StaticFilesEndpoints = 
  | downloadCifChain
  | download_ligand_nbhd
  | get_tunnel

type  Neo4jEndpoints = 
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
  | get_ligand_nbhd
  | match_structs_by_proteins


type DjangoEndpoinds = Neo4jEndpoints | StaticFilesEndpoints;


interface match_structs_by_proteins{
  endpoint:"match_structs",
  params:{
    proteins:string
  }
}
interface get_tunnel {
  endpoint: "tunnel",
  params:{
    struct: string;
    filetype: "report" | "centerline";
  }
}

interface get_ligand_nbhd {
  endpoint: "get_ligand_nbhd";
  params: {
    struct: string;
    chemid: string;
  };
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
  endpoint: "gmo_nom_class"
  params: {
    banName: string;
  };
}
interface getAllLigands{
  endpoint: 'get_all_ligands',
  params: null
}

export const getNeo4jData = (api: DjangoAPIs, ep: DjangoEndpoinds) => {
  const URI = encodeURI(`${BACKEND}/${api}/${ep.endpoint}/`);
  return ep.params != null ? Axios.get(URI, { params: ep.params }) : Axios.get(URI);
};
