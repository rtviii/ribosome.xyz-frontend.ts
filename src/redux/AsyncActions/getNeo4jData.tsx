import axios from "axios";
import Axios from "axios";
import qs from 'qs'
import { RnaClass } from "../reducers/RNA/RNAReducer";
import { BanClass } from "../RibosomeTypes";

const BACKEND: any = process.env.REACT_APP_DJANGO_URL;
type DjangoAPIs = "neo4j" | "static_files"


type StaticFilesEndpoints =
  | downloadCifChain
  | download_ligand_nbhd
  | get_tunnel
  | pairwise_align
  | get_static_catalogue
  // | downloadArchive
  | cif_chain_by_class
  | download_structure
  | ligand_prediction

  interface ligand_prediction{
    endpoint:"ligand_prediction",
    params:{
      src_struct: string,
      // src_tax_id: number,
      tgt_struct: string,
      // tgt_tax_id: number,
      chemid    : string,
    }

  }

interface download_structure {
  endpoint: "download_structure",
  params: {
    struct_id: string
  }
}

interface cif_chain_by_class {
  endpoint: "cif_chain_by_class",
  params: {
    classid: string,
    struct: string
  }
}
interface downloadCifChain {
  endpoint: "cif_chain",
  params: {
    structid: string,
    chainid: string
  }
}
interface download_ligand_nbhd {
  endpoint: "download_ligand_nbhd",
  params: {
    structid: string,
    chemid: string;
  }
}
interface get_tunnel {
  endpoint: "tunnel",
  params: {
    struct: string;
    filetype: "report" | "centerline";
  }
}
interface pairwise_align {
  endpoint: "pairwise_align",
  params: {
    struct1: string,
    struct2: string,
    strand1: string,
    strand2: string
  }
}
interface get_static_catalogue {
  endpoint: 'get_static_catalogue',
  params: null
}
// interface downloadArchive {
//   endpoint: 'downloadArchive',
//   params  : { 
//     rna:string[],
//     structs: string[],
//     rps    : string[],
//    }
// }
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
type DjangoEndpoinds = Neo4jEndpoints | StaticFilesEndpoints;


interface proteins_number {
  endpoint: "proteins_number",
  params: null
}
interface banclass_annotation {
  endpoint: "banclass_annotation",
  params: {
    banclass: BanClass
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
interface get_ligand_nbhd {
  endpoint: "get_ligand_nbhd";
  params: {
    struct: string;
    chemid: string;
  };
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
    rna_class: RnaClass
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
interface getAllLigands {
  endpoint: 'get_all_ligands',
  params: null
}

export const getNeo4jData = (api: DjangoAPIs, ep: DjangoEndpoinds) => {

  const URI = encodeURI(`${BACKEND}/${api}/${ep.endpoint}/`);

  return ep.params != null ? Axios.get(URI, {
    params: ep.params, paramsSerializer: params => qs.stringify(params,
      {
        arrayFormat: "repeat"
      }
    )
  }) : Axios.get(URI);

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