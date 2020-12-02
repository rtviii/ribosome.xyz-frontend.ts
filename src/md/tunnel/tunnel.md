# Exit Tunnel

The constitution of the exit tunnel is of interest for evolutionary, physio-chemical and pharmacological reasons. We provide a mechanism to export some preliminary data about the walls of the exit tunnel as well cylinder-centerline of the tunnel as is caputured in a given model.
Three main features are provided at the moment that characterize tunnel walls:

Residue profile of the ribosomal proteins that interface with the tunnel.(Each protein is identified by its new nomenclature (ex. uL4) where is possible and can thus be compared against homologous chains in other structures. The in-chain IDs of the tunnel-interfacing residues are provided for each protein.) Nucleotides of the RNA that interface with the tunnel. Ligands, ions or small molecules if any are found  embedded in the walls of the tunnel.


![Tunnel](/Tunnel/tunneldemo.gif)


#### Method:

The tunnel shape is extracted via the MOLE software.
We search for residues-neighbors inside the structure that are within 10 Angstrom of each coordinate-step of the resulting tunnel-replica.
Each unique residue is then matched to its parent chain, which in turn are matched against the graph to obtain the standard nomenclature.


####  In development:

We plan to augment these data with conservation scores and phys/chem profiles kindly provided by Loren William's group at Gatech in the course of further development of both databases.