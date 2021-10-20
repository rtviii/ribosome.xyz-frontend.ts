import {  RibosomeStructure,  Protein, RNA, Ligand, ProteinClass, RNAClass} from "./RibosomeTypes";

// DataInterfaces contains declarations for most datatypes that the application
// uses. Some(non-composite) are imported from RibosomeTypes  non-composite types that also resemble neo4j-schema.
// Preload for strucutrescatalogue.

export interface PolymerMinimal{
  nomenclature: string[];
  auth_asym_id: string; 
}

  export interface NeoStruct{
  struct  : RibosomeStructure;
  ligands : string[];
  rps     : Array<PolymerMinimal>;
  rnas    : Array<PolymerMinimal>
  }


export interface Residue{
				residue_name       : string
				residue_id         : number
				parent_auth_asym_id: string
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
  source   : {src    :string, auth_asym_id :string, src_ids:number[]},
  target   : {tgt    :string, auth_asym_id :string, tgt_ids:number[]},
  alignment: {src_aln:string, tgt_aln:string, aln_ids:number[]},
  }
}


export type LigandClass = {
  [ligand_description:string]: MixedLigand[]
}

export type StructureBindingSites  =  {
  [rcsb_id:string]: BindingSite[]
}

export type BindingSite  =  {
                                 src_organism_ids   : number[],
                                 description        : string,
                                 citation_title     : string,
                                 auth_asym_id     ? : string;
                                 expMethod          : string,
                                 rcsb_id            : string,
                                 resolution         : number,
}

export interface MixedLigand{
    category     ?: string,
    polymer       : boolean,
    description   : string;
    chemicalId   ?: string
    present_in: BindingSite

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