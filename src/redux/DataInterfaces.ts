import { RibosomeStructure } from "./RibosomeTypes";

export interface NeoStruct{

  struct   :  RibosomeStructure;
  ligands  :  string[];
  rps      :  Array<{ noms: string[]; surface_ratio:number|null,strands: string }>;
  rnas     :  string[];
}



export type RXZDataTypes = NeoStruct;
