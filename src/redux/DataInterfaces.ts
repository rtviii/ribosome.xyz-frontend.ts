import {  RibosomeStructure,  RibosomalProtein, rRNA, Ligand} from "./RibosomeTypes";

// Preload for strucutrescatalogue
export interface NeoStruct{
  struct   :  RibosomeStructure;
  ligands  :  string[];
  rps      :  Array<{ noms: string[]; surface_ratio:number|null,strands: string }>;
  rnas     :  string[];
}

export interface NeoHomolog {
  parent : string;
  orgname: string[]
  orgid  : number[]
  protein: RibosomalProtein;
  title  : string
}

export interface RNAProfile {
  rna    : rRNA
  parent : string
  orgname: string[]
  orgid  : number[]
  title  : string
}

export interface StructureWithLigand{
  _organismId          : number[];
  _organismName        : string[];
  rcsb_id              : string;
  expMethod            : string;
  resolution           : number;
  cryoem_exp_resolution: number|null;
  citation_title       : string
  pdbx_keywords_text   : string| null

}
export interface LigandResponseShape  {
  ligand   : Ligand
  presentIn: StructureWithLigand[]
};




export type RXZDataTypes                 = NeoStruct | NeoHomolog | RNAProfile | LigandResponseShape;