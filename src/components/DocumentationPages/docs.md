# Internal

The main repository for the backend is [available on github ](https://github.com/rtviii/ribosome.xyz-backend).
To add a Python module to the database, you can fork the repository and create a self-contained Django application:

        python3 manage.py startapp <your_module>

This document summarizes the functionality that is already implemnted and how to interact with it.
Refer to the [ API Documetation ](https://ribosome.xyz/../../api-shape.md) for means of getting the data.

## Template Package: ExitTunnelResnConservation


__driver__(*args, **kwargs)

A utility for collecting the conservation scores around a ribosome's exit tunnel.
This aims to illustrate the possible interactions between the present data sources and existing module. 

1. Queries Neo4j database to establish nomenclature for the chains of intersest and the converse.
2. Parses the given .pdb/.cif files to establish residue adjacency.
3. Queries Ribovision to collect convservation scores for each residue.


Can be used as a standalone CLI interface.

|||
|:---|:---|
|__@flag__ --verbose|Enable logging.|
|__@flag__-p --path|Path to the .cif/.pdb file containing the exit tunnel |
|__@flag__-t --target-protein| Single or multiple protein names(Ban) to collect tunnel-adjacent residues from|
|__@flag__-r --radius| Threshold radius of neighbourhood(default=20)|


__get_adjacent_residues__(chain:Chain,hull, radius:int): 

|||
|:---|:---|
|*@param* chain| A Biopython Chain object |
|*@param* hull| A list or an ndarray(3,0) array with the coordinates of the tunnel hull|
|*@param* raidus| the cutoff radius for considering a residue's adjacency to the tunnel hull |
|*@return* | An array of residue objects within the specified distance off a tunnel |

                get_adjacent_residues(uL22, [[ 123.21 213.42 166.40 ],[...],...], 20)


__getAlphaCarbonResidue__(res:Residue): 

|||
|:---|:---|
|*@param* res| A Biopython Residue object|
|*@return* |A Biopython Atom object for the alpha carbon of the residue, or the first atom in the residue if the alpha-carbon is not present|

                getAlphaCarbonResidue(residue)



## Package: PymolScripts

A suite of python Pymol.cmd scripts that might have utility in dealing with ribosomal data.

|SIGNATURE|EFFECT|
|:---|:---|
|chain_align_save [[pdbid chainid, ...]]| extracts and aligns proteins according to the specified tuples|
|get_nbrs [chain_identifier],[radius] | returns array of neighbor-chain identifiers  |
|see               [chain_identifier] | colorcode chain by identifier       |
|save_coords            [object_name] | saves coordinates as .npy into /Coordinates|
|nbrmenu                              | see options again(for in-Pymol use)                       |

__align_export__
Module can be used as a standalone CLI interface.
|FLAG| EFFECT|
|:---|:---|
|__@flag__ --model-chain-tuples|One or more comma-separated pairs of the form <pdbid> <protein> to extract and algin on |
|__@flag__ --pmlxtnd| Specify whether to extend Pymol.cmd |


                align_export --pmlxtnd 3j9m D, 5jvg 8, 5jvg K, ... 


__chain_align_save__(*args, **kwargs) 
Creates separate chain objects for each of the tuple, aligns them in space and exports alignment
|||
|:---|:---|
|*@param*[]  pdbid chainid,| A comma-separated list of chains belonging to export|

                chain_align_save([ ( 3j9m D ), ( 5jvg 8 ),  ... ])




__get_nbrs__(chainid, radius):
|||
|:---|:---|
|*@arg* chainid| An pdb chain identifier accroding to PDB. |
|*@arg* radius | A float value for to base adjacency calculations on.|

                get_nbrs("F", 2.75)


## Package: PDBParse

![](Bio.PDB.schema.png)

- Biopython examples and implemented functions...
- Parsing
- Coordinates
- Chains/Resn/Atom manipulation
- Primitive clustering examples


## Package: Neo4jConnector

See [ API Documetation ](https://ribosome.xyz/../../api-shape.md)





---

# Other

## Extracting a tunnel

- MOLE : mono environment.


