import { BanClass, RibosomeStructure,  RibosomalProtein} from "./RibosomeTypes";

// Preload for strucutrescatalogue
export interface NeoStruct{
  struct   :  RibosomeStructure;
  ligands  :  string[];
  rps      :  Array<{ noms: string[]; surface_ratio:number|null,strands: string }>;
  rnas     :  string[];
}

// -------- Proteins

export interface NeoHomolog {
  parent : string;
  orgname: string[]
  orgid  : number[]
  protein: RibosomalProtein;
  title  : string
}



// export interface ERS {
//   nom_class  :  BanClass;
//   presentIn  :  Array<string>;
//   rps              : Array<{        
//     organism_desc: string
//     organism_id  : number
//     uniprot      : string
//     parent       : string
//     parent_reso  : number
//     strand_id    : string
//   }>
// }



export type RXZDataTypes = NeoStruct;
