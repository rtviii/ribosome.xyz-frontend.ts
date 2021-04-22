export interface RibosomeStructure {
  rcsb_id   : string;
  expMethod : string;
  resolution: number;

  rcsb_external_ref_id  : string[];
  rcsb_external_ref_type: string[];
  rcsb_external_ref_link: string[];

  // em_3d_reconstruction
  cryoem_exp_detail                      : string|null;
  cryoem_exp_algorithm                   : string|null;
  cryoem_exp_resolution_method           : string|null;
  cryoem_exp_resolution                  : number|null;
  cryoem_exp_num_particles               : number|null;
  cryoem_exp_magnification_calibration   : string|null;
  // diffn
  diffrn_source_details                  : string|null
  diffrn_source_pdbx_synchrotron_beamline: string|null
  diffrn_source_pdbx_synchrotron_site    : string|null
  diffrn_source_pdbx_wavelength          : string|null
  diffrn_source_pdbx_wavelength_list     : string|null
  diffrn_source_source                   : string|null
  diffrn_source_type                     : string|null
  // citation
  citation_year        : number;
  citation_rcsb_authors: string[]
  citation_title       : string
  citation_pdbx_doi    : string

  // keywords
  pdbx_keywords_text: string| null
  // custom
  _organismId         : number[];
  _organismName       : string[];


  proteins: Array<RibosomalProtein>;
  rnas    : Array<rRNA> | null;
  ligands : Array<Ligand> | null;
}
export interface rRNA {

  parent_rcsb_id                  : string;
  rcsb_source_organism_id         : number[];
  rcsb_source_organism_description: string[];
  rcsb_pdbx_description           : string | null;

  // entity_polymer
  entity_poly_strand_id              : string;
  entity_poly_seq_one_letter_code    : string;
  entity_poly_seq_one_letter_code_can: string;
  entity_poly_seq_length             : number;
  entity_poly_polymer_type           : string;
  entity_poly_entity_type            : string;
}

export interface RibosomalProtein {
  parent_rcsb_id                    :  string;

  pfam_accessions                   :  string[]
  pfam_comments                     :  string[]
  pfam_descriptions                 :  string[]

  rcsb_source_organism_id           :  number[];
  rcsb_source_organism_description  :  string[];
  uniprot_accession                 :  string[]
  rcsb_pdbx_description             :  string | null;
  // entity_polymer
  entity_poly_strand_id                :  string;
  entity_poly_seq_one_letter_code      :  string;
  entity_poly_seq_one_letter_code_can  :  string;
  entity_poly_seq_length               :  number;
  entity_poly_polymer_type             :  string;
  entity_poly_entity_type              :  string;
  surface_ratio                        :  number | null;
  nomenclature                         :  Array<BanClass>;


}

export interface Ligand {
  chemicalId      : string;
  chemicalName    : string;
  cif_residueId   : number | "none";
  formula_weight  : number;
  pdbx_description: string;
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
  class_id: BanClass;
}

export type BanClass =
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
