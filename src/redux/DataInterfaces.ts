import {  RibosomeStructure,  Protein, RNA, Ligand, ProteinClass, RNAClass} from "./RibosomeTypes";

// DataInterfaces contains declarations for most datatypes that the application
// uses. Some(non-composite) are imported from RibosomeTypes  non-composite types that also resemble neo4j-schema.
// Preload for strucutrescatalogue.

export interface NeoStruct{
  struct   :  RibosomeStructure;
  ligands  :  string[];
  rps      :  Array<{noms:string[]; strands: string }>;
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


export type BindingSite  =  {
      src_organism_ids      : number[],
      citation_title        : string,
      expMethod             : string,
      rcsb_id               : string,
      // number_of_instances?  : number,
      // entity_poly_strand_id?: string,
      resolution            : number,
		}

// Union of Ligand and Polymer(Protein&RNA ligand-likes)
export interface MixedLigand{
    category?:string,
    molecule:{
      polymer    : boolean,
      description: string;
      // polymer-specific features
      entity_poly_strand_id?: string;
      // non-polymer-specifc features
      chemicalId         ?: string
      chemicalName       ?: string;
  },
  present_in: BindingSite[]
}


export interface LigandClass {
  ligand: Ligand, 
  presentIn: {
    src_organism_ids   : number[],
    citation_title     : string,
    expMethod          : string,
    rcsb_id            : string,
    number_of_instances: number,
    resolution         : number,
  }[]
}

export interface NeoHomolog {
  parent : string;
  orgname: string[]
  orgid  : number[]
  protein: Protein;
  title  : string
}

export type ProteinProfile = Protein & {

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
  src_organism_ids     : number[];
  src_organism_names   : string[];
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
      banClass : ProteinClass,
      organisms: number[],
      comments : string[][],
      structs  : RibosomeStructure[]
}


export type ApplicationDataTypes = NeoStruct | Protein | RNAProfile | LigandResponseShape | BanClassMetadata;