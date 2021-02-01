import { RecordVoiceOver } from "@material-ui/icons";
import { FilterPredicate, FilterType } from "./reducers/Filters/ActionTypes";
import { BanClass, RibosomeStructure,  RibosomalProtein} from "./RibosomeTypes";

// Preload for strucutrescatalogue
export interface NeoStruct{
  struct   :  RibosomeStructure;
  ligands  :  string[];
  rps      :  Array<{ noms: string[]; surface_ratio:number|null,strands: string }>;
  rnas     :  string[];
}

export type RXZDataTypes                 = NeoStruct | NeoHomolog;
//  const isStruct  = (x:RXZDataTypes): x is NeoHomolog =>{
//   return (x as NeoStruct).struct.rcsb_id !== undefined
// }

// -------- Proteins
export interface NeoHomolog {
  parent : string;
  orgname: string[]
  orgid  : number[]
  protein: RibosomalProtein;
  title  : string
}
//  const isProtein  = (x:RXZDataTypes): x is NeoHomolog =>{
//   return (x as NeoHomolog).protein.entity_poly_strand_id !== undefined
// }

// I want a generic that given a datatype-arg and a filter-type would yield a predicate function
// given that the typesystem is erased at runtime, i guess i've no other choice but to enum my datatypes
// [ something like typeof for user-defined types would've helped tremendously  ]

// export type DataCategory = "STRUCTURE" | "PROTEIN" | "LIGAND" | "RNA" ;