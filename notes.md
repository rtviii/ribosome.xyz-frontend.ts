RCSB identifies a chain in 3 ways:

```auth_asym_ids``` 

```asym_ids``` 

```pdbx_strand_id``` 

# Strand ids is what a cif file uses and what Biopython parses 


## RCSB PDB
 
(As of now at least) when display the chain names rcsb uses the format **{asym_id} [auth {strand_id}]** with the asterisk that if *"the two PDB chain IDs(label_asym_id; assigned by the PDB) and auth_asym_id (selected by the author) do not coincide, the chain ID is displayed as "label_asym_id" [auth auth_asym_id]*

## What does Mol* use??