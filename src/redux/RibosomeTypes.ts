export interface RibosomeStructure {
  proteinNumber: number,
  rRNANumber   : number,
  _PDBId       : string;
  _species     : string;
  _organismId  : string;
  resolution   : number;
  publication  : string;
  expMethod    : string;
  title        : string;
  proteins     : Array<RibosomalProtein>;
  rnas         : Array<rRNA>;
  ligands      : Array<Ligand>
  site         : "cytosolic" | "mitochondrial" | "chloroplastic";
}
export interface rRNA {
  description: string;
  _PDBChainId: string;
}

export interface RibosomalProtein {
  _PDBChainId      : string;
  _UniprotAccession: string;
  _PDBName         : string;
  surface_ratio    : number | null;
  description      : string;
  nomenclature     : Array<string>;
  _PFAMFamilies    : Array<string>;
}

export interface InterProFamily{
  family_id  : string;
  type       : string;
  description: string;
}

export interface GOClass{
  class_id  : string;
  annotation: string;
}

export interface PFAMFamily{
  family_id  : string;
  annotation : string;
  family_type: string;
}

export interface Ligand {
  chemicalId   : string;
  chemicalName : string;
  formula      : string;
  SMILES       : string;
  cif_residueId: number | 'none';
}

export interface NomenclatureClass{
  class_id:BanClass
}

export type BanClass=
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

