import {  RibosomeStructure,  RibosomalProtein, rRNA, Ligand, BanClass, RNAClass} from "./RibosomeTypes";

// DataInterfaces contains declarations for most datatypes that the application
// uses. Some(non-composite) are imported from RibosomeTypes  non-composite types that also resemble neo4j-schema.
// Preload for strucutrescatalogue.

export interface NeoStruct{
  struct   :  RibosomeStructure;
  ligands  :  string[];
  rps      :  Array<{ noms: string[]; strands: string }>;
  rnas     :  Array<{noms:string[], strands:string}>
}


export interface Residue{
				residue_name    : string
				residue_id      : number
				parent_strand_id: string
}
export type LigandBindingSite = {
  [ chainname    :string ] :
  { sequence     : string
    nomenclature : string[ ]
    asym_ids     : string[ ]
    residues     : Residue[]
  }}


export type LigandPrediction = {
  [ polypeptide_class :string ] :
  {
  source    : {src    :string, strand :string, src_ids:number[]},
  target    : {tgt    :string, strand :string, tgt_ids:number[]},
  alignment : {src_aln:string, tgt_aln:string, aln_ids:number[]},
  }

}



export interface BindingInterface {
  constituents: Array<{
    banClass : null | string,
    resid    : number
    resn     : string
    strand_id: string
    struct   : string
    }>,
    nbrs: Array<{
    banClass : null | string,
    resid    : number
    resn     : string
    strand_id: string
    struct   : string
    }>
}


// Binding Site is the residue-wise account of 
export type BindingSite  =  {
    chemicalId       : string;
    chemicalName     : string;
    formula_weight   : number;
    pdbx_description : string;
    _organismId      : number[],
    citation_title   : string ,
    expMethod        : string ,
    rcsb_id          : string,
    resolution       : number
		}

export interface LigandClass {
  ligand: Ligand, presentIn: {
    _organismId   : number[],
    citation_title: string,
    expMethod     : string,
    rcsb_id       : string,
    resolution    : number,
  }[]
}

export interface NeoHomolog {

  parent : string;
  orgname: string[]
  orgid  : number[]
  protein: RibosomalProtein;
  title  : string

}

export type ProteinProfile = RibosomalProtein & {

  parent_resolution: number
  parent_year      : number
  parent_method    : string

};

export interface RNAProfile {

  struct           : string,
  orgid            : number[]
  description      : string
  seq              : string
  strand           : string
  parent_year      : number
  parent_resolution: number
  parent_method    : string
  parent_citation  : string
  nomenclature     : RNAClass[]

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


export type RXZDataTypes= NeoStruct | RibosomalProtein | RNAProfile | LigandResponseShape | BanClassMetadata;