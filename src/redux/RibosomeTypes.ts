export interface RibosomeStructure {
  proteinNumber: number,
  rRNANumber   : number,
  _PDBId       : string;
  _species     : string;
  _organismId  : string;
  resolution   : number;
  publication  : string;
  proteins     : Array<RibosomalProtein>;
  rnas         : Array<rRNA>;
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