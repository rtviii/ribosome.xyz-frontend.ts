import {  RibosomeStructure,  RibosomalProtein, rRNA} from "./RibosomeTypes";

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




export type RXZDataTypes                 = NeoStruct | NeoHomolog;