export interface RibosomeStructure {
  rcsb_id               : string;
  expMethod             : string;
  resolution            : number;

  pdbx_keywords     : string | null;
  pdbx_keywords_text: string |null;

  rcsb_external_ref_id  : string[];
  rcsb_external_ref_type: string[];
  rcsb_external_ref_link: string[];

  // citation
  citation_year        : number;
  citation_rcsb_authors: string[]
  citation_title       : string

  citation_pdbx_doi    : string
  // keywords
  // custom
  src_organism_ids   : number[];
  src_organism_names : string[];

  host_organism_ids   : number[];
  host_organism_names : string[];

  proteins : Protein[]       ;
  rnas     : RNA            [] | null;
  ligands  : Ligand          [] | null;

}






export interface RNA { 


  asym_ids                        : string[],
  auth_asym_ids                   : string[],

  nomenclature                    : RNAClass[]

  parent_rcsb_id                  : string       ;

  src_organism_names : string[],
  host_organism_names: string[],
  src_organism_ids   : number[],
  host_organism_ids  : number[],


  rcsb_pdbx_description           : string | null;
  // entity_polymer
  entity_poly_strand_id              : string;
  entity_poly_seq_one_letter_code    : string;
  entity_poly_seq_one_letter_code_can: string;
  entity_poly_seq_length             : number;
  entity_poly_polymer_type           : string;
  entity_poly_entity_type            : string;

  // whether this is an elongation factor,etc 
  ligand_like:boolean
 }


export interface Protein {
  asym_ids     : string[],
  auth_asym_ids: string[],

  parent_rcsb_id    : string;
  pfam_accessions   : string[]
  pfam_comments     : string[]
  pfam_descriptions : string[]

  src_organism_names : string[],
  host_organism_names: string[],
  src_organism_ids   : number[],
  host_organism_ids  : number[],

  // whether this is an elongation factor, etc.
  ligand_like:boolean

  uniprot_accession                  : string[]

  rcsb_pdbx_description              : string | null;

  entity_poly_strand_id              : string;
  entity_poly_seq_one_letter_code    : string;
  entity_poly_seq_one_letter_code_can: string;
  entity_poly_seq_length             : number;
  entity_poly_polymer_type           : string;
  entity_poly_entity_type            : string;

  nomenclature                       : ProteinClass[];
}

export interface Ligand {
  chemicalId         : string;
  chemicalName       : string;
  formula_weight     : number;
  pdbx_description   : string;
  number_of_instances: number;
}

// This comes from interpro mapping (in cumulative archive)
export interface InterProFamily {
  family_id  : string;
  type       : string;
  description: string;
}

// This comes from interpro mapping (in cumulative archive)
export interface GOClass {
  class_id  : string;
  annotation: string;
}

// This comes from interpro mapping (in cumulative archive)
export interface PFAMFamily {
  family_id  : string;
  annotation : string;
  family_type: string;
}

export interface NomenclatureClass {
  class_id: ProteinClass;
}



export type RNAClass = 
"5SrRNA"|
"5.8SrRNA"|
"12SrRNA"|
"16SrRNA"|
"21SrRNA"|
"23SrRNA"|
"25SrRNA"|
"28SrRNA"|
"35SrRNA"|
"mRNA"|
"tRNA"

export type ProteinClass =
  | "eL39"
  | "eL38"
  | "eL37"
  | "eL36"
  | "eL34"
  | "eL33"
  | "eL32"
  | "eL31"
  | "eL30"
  | "eL6"
  | "uL2"
  | "uL1"
  | "uL4"
  | "uL3"
  | "uL6"
  | "uL5"
  | "bL36"
  | "eL29"
  | "bL35"
  | "eL28"
  | "uL30"
  | "eL27"
  | "bL32"
  | "bL31"
  | "eL24"
  | "bL34"
  | "bL33"
  | "eL22"
  | "eL21"
  | "eL20"
  | "eL19"
  | "bL25"
  | "eL18"
  | "uL22"
  | "bL27"
  | "eL15"
  | "bL21"
  | "eL14"
  | "bL20"
  | "eL13"
  | "uL29"
  | "bL9"
  | "uL23"
  | "uL24"
  | "bL28"
  | "uL10"
  | "uL11"
  | "bL12"
  | "uL18"
  | "eL43"
  | "uL16"
  | "eL42"
  | "eL41"
  | "uL14"
  | "eL40"
  | "uL15"
  | "uL13"
  | "bL17"
  | "bL19"
  | "eS12"
  | "eS10"
  | "bS20"
  | "eS31"
  | "eS30"
  | "uS19"
  | "uS17"
  | "uS15"
  | "uS13"
  | "uS14"
  | "RACK1"
  | "eS19"
  | "eS17"
  | "bS21"
  | "eS24"
  | "eS1"
  | "eS21"
  | "bS6"
  | "eS4"
  | "eS7"
  | "uS11"
  | "eS6"
  | "uS12"
  | "eS8"
  | "uS10"
  | "bTHX"
  | "uS3"
  | "uS2"
  | "bS18"
  | "uS5"
  | "uS4"
  | "uS7"
  | "uS9"
  | "uS8"
  | "bS16"
  | "eS28"
  | "eS27"
  | "eS26"
  | "eS25"
  | "AMBIGUOUS";
