import {  RibosomeStructure,  RibosomalProtein, rRNA, Ligand, BanClass} from "./RibosomeTypes";
// DataInterfaces contains declarations for most datatypes that the application
// uses. Some are imported from RibosomeTypes and constitute non-composite types that also resemble neo4j-schema

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

        struct     : string,
        orgid      : number[]
        description: string
        seq        : string
        strand     : string
        parent_year      : number
        parent_resolution: number
        parent_method    : string
        parent_title     : string
        


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
export interface BanClassMetadata{
      banClass : BanClass,
      organisms: number[],
      comments : string[][],
      structs  : RibosomeStructure[]

    }

// export interface BanClassMetadata{

//       nom_class       : BanClass,
//       unique_organisms: number[],
//       inStructs       : string[],
//     }


export type RXZDataTypes= NeoStruct | RibosomalProtein | RNAProfile | LigandResponseShape | BanClassMetadata;