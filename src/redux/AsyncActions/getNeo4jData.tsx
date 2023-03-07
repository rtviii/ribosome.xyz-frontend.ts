import axios from "axios";
import Axios from "axios";
import qs from 'qs'
import { ProteinClass, RNAClass } from "../RibosomeTypes";

const BACKEND: any   = process.env.REACT_APP_DJANGO_URL;
type  DjangoAPIs     = "neo4j" | "static_files" | "utils"
type  UtilsEndpoints = number_of_structures;

interface number_of_structures{
  endpoint: "number_of_structures",
  params  : null
};

type StaticFilesEndpoints =
  | ranged_align
  | cif_chain_by_class
  | ligand_prediction
  | downloadCifChain
  | download_ligand_nbhd 
  | download_structure

interface ligand_prediction{
    endpoint:"ligand_prediction",
    params:{
      src_struct   : string,
      tgt_struct   : string,
      ligandlike_id: string,
      is_polymer   : boolean,
    }
}

interface ranged_align {
  endpoint: "ranged_align",
  params: {
    r1start       : number,
    r1end         : number,
    r2start       : number,
    r2end         : number,
    struct1       : string,
    struct2       : string,
    auth_asym_id1 : string,
    auth_asym_id2 : string
  }
}

interface download_structure {
  endpoint: "download_structure",
  params: {
    struct_id: string
  }
}

interface get_full_structure{
  endpoint:"get_full_struct",
  params:{
    pdbid:string
  }
}

interface get_RibosomeStructure{
  endpoint:"get_RibosomeStructure",
  params:{
    pdbid:string
  }
}

interface cif_chain_by_class {
  endpoint: "cif_chain_by_class",
  params: {
    classid: string,
    struct : string
  }
}

interface downloadCifChain {
  endpoint: "cif_chain",
  params: {
    structid: string,
    chainid : string
  }
}
interface download_ligand_nbhd {
  endpoint: "download_ligand_nbhd",
  params: {
    structid: string,
    chemid  : string;
  }
}



type Neo4jEndpoints =
  nomclass_visualize
  | getStructure
  | getAllStructures
  | getHomologs
  | get_banclasses_metadata
  | listAvailableRPs
  | customCypher
  | gmoNomClass
  | getAllLigands
  | get_rna_class
  | get_uncategorized_rna
  | getRnasByStruct
  | getLigandsByStruct
  | get_surface_ratios
  | TEMP_classification_sample
  | get_ligand_nbhd
  | get_individual_ligand
  | match_structs_by_proteins
  | get_surface_ratios
  | TEMP_classification_sample
  | banclass_annotation
  | proteins_number
  | get_all_ligandlike
  | get_full_structure
  | get_RibosomeStructure

type DjangoEndpoinds = Neo4jEndpoints | StaticFilesEndpoints | UtilsEndpoints;


interface proteins_number {
  endpoint: "proteins_number",
  params: null
}

interface banclass_annotation {
  endpoint: "banclass_annotation",
  params: {
    banclass: ProteinClass
  }
}

interface nomclass_visualize {
  endpoint: "nomclass_visualize",
  params: {
    ban: string
  }
}

interface get_banclasses_metadata {
  endpoint: 'get_banclasses_metadata',
  params: {
    family: string, subunit: string
  }
}

interface get_individual_ligand {
  endpoint: 'get_individual_ligand',
  params: {
    chemId: string
  }
}

interface TEMP_classification_sample {
  endpoint: "TEMP_classification_sample",
  params: null
}

interface get_surface_ratios {
  endpoint: 'get_surface_ratios',
  params: {
    pdbid: string
  }
}

interface match_structs_by_proteins {
  endpoint: "match_structs",
  params: {
    proteins: string
  }
}
interface getRnasByStruct {
  endpoint: "get_rnas_by_struct",
  params: null
}
interface getLigandsByStruct {
  endpoint: "get_ligands_by_struct",
  params: null
}
interface get_uncategorized_rna {
  endpoint: "get_rna_class";
  params: null
}
interface get_rna_class {
  endpoint: "get_rna_class";
  params: {
    rna_class: RNAClass
  }
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
  params: null;
}
interface gmoNomClass {
  endpoint: "gmo_nom_class"
  params: {
    banName: string;
  };
}


interface get_all_ligandlike {
  endpoint: "get_all_ligandlike",
  params: null
}
interface getAllLigands {
  endpoint: 'get_all_ligands',
  params  : null
}

interface get_ligand_nbhd {
  endpoint: "get_ligand_nbhd";
  params: {
    src_struct   : string;
    ligandlike_id: string;
    is_polymer   : boolean,
  };
}

export const getNeo4jData = (api: DjangoAPIs, ep: DjangoEndpoinds) => {
  const URI = encodeURI(`${BACKEND}/${api}/${ep.endpoint}/`);
  console.log("geneo4jdata: ",URI);
  let intercept = ep.params != null ? Axios.get(URI, {
    params: ep.params, paramsSerializer: params => qs.stringify(params,
      {
        arrayFormat: "repeat"
      }
    )
  }) : Axios.get(URI);

  // console.log("intercept: ",intercept);
  return intercept
};



export const download_zip = (params: {
  structs: string[],
  rna: string[],
  rps: string[],
},
  download_filename: string
) => {


  axios.request({
    url: `${BACKEND}/static_files/downloadArchive/`,
    method: 'GET', responseType: 'arraybuffer',
    params,
    paramsSerializer: params => qs.stringify(params,
      {
        arrayFormat: "repeat"
      }),

    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
    .then(

      r => {
        let blob = new Blob([r.data], { type: 'application/zip' })
        const downloadUrl = URL.createObjectURL(blob)
        let a = document.createElement("a");
        a.href = downloadUrl;
        a.download = download_filename;
        document.body.appendChild(a);
        a.click();


      }
    )
}