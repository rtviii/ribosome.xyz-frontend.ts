export interface RibosomeStructure {
  _PDBId             : string;
  expMethod          : string;
  resolution         : number;
  // had to comment out for the time being given cypher's inability to assign maps as property-values
  // em_3d_reconstuction: {
  //   details                  : string;
  //   algorithm                : string | null;
  //   resolution_method        : string;
  //   actual_pixel_size        : number;
  //   id                       : string | number;
  //   resolution               : number;
  //   refinement_type          : null | string;
  //   num_particles            : number;
  //   magnification_calibration: null | string;
  // } | null;

  // diffrn_source: {
  //   details                  : string | null;
  //   pdbx_synchrotron_beamline: string;
  //   pdbx_synchrotron_site    : string;
  //   pdbx_wavelength          : string | number | null;
  //   pdbx_wavelength_list     : string | null;
  //   source                   : string | null;
  //   type                     : string | null;
  // } | null;
  // publication: {
  //   rcsb_authors        : Array<string>;
  //   year                : number;
  //   title               : string;
  //   pdbx_database_id_DOI: string;
  // } | null;

  // struct_keywords: {
  //   pdbx_keywords: string;
  //   text         : string;
  // } | null;

  _organismId         : number;
  _organismName       : string;
  site                : "unreviewed" | "cytosolic" | "mitochondrial" | "chloroplastic";
  authors             : string[] | null,
  year                : number | null;
  pdbx_database_id_DOI: string | null;
  struct_keywords     : string | null;

  proteins: Array<RibosomalProtein>;
  rnas    : Array<rRNA> | null;
  ligands : Array<Ligand> | null;
}
export interface rRNA {
  strand_id        : string;
  description      : string | null;
  type             : string | null;
  sample_seq_length: number | null;
}

export interface RibosomalProtein {
  rcsb_pdbx_description: string| null;
  strand_id            : string;
  uniprot_accession    : string[] | null;
  surface_ratio        : number | null;
  nomenclature         : Array<BanClass> | [];
  type                 : string | null;
  sample_seq_length    : number | null;
  PFAM_Families        : Array<string> | null;
  pfam_comments        : Array<string>;
  pfam_descriptions    : Array<string>;
}
export interface Ligand {
  chemicalId      : string;
  chemicalName    : string;
  cif_residueId   : number | "none";
  formula_weight  : number;
  pdbx_description: string;
}

export interface InterProFamily {
  family_id  : string;
  type       : string;
  description: string;
}

export interface GOClass {
  class_id  : string;
  annotation: string;
}

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
  | "es24"
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
