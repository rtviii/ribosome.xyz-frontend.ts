Here we present RiboXYZ, a database that provides
a simplified and curated access to ribosome structures
with several visualisation tools. The database provides a
unified nomenclature of all ribosomal components across all
structures available in PDB. While the RCSB PDB server
has recently integrated more tools for visualization and
comparison (24), the interface of RiboXYZ was designed
to be light and intuitive enough to allow non-specialists in
structural biology who are unfamiliar with the more dense
PDB interface, to easily get access to structures and visualize
any result that can relate with some aspect of the ribosome
structure, as illustrated in our examples and applications
(14, 16, 21). In this regard, a fundamental contribution of
our database is that our data structure disambiguates the
identification of the ribosomal components, that was so far
hindered by the use of arbitrary ID’s in deposited structures
and other naming convention outside from the field of
structural biology (6, 7). 

<---- Our "fundamental contributions" are (1) disambiguation and (2) introducing a biomolecule-centric view on the PDB data.

 Previous efforts to integrate ribosome
structural data were made to build databases and interfaces
for 3D alignment (25), or jointly visualize 1D, 2D and 3D
structures of the ribosome (26). While these databases are not
available anymore and/or do not scale up to the current amount
of available structures (4), the past year has interestingly
seen the release of new applications with dedicated online
server and database, that perform some advanced analysis
of ribosome structures and proteins using a large dataset
of structures available (23, 27). For instance, Radtool (27)
evaluates the relative rotation of the two ribosomal subunits
across all structures available from the PDB. Proteovision,
which was earlier mentioned as it uses RiboXYZ’s API
allows to perform an evolutionary analysis and visualization of
ribosomal proteins over a large number of species in the tree of
life. Interestingly, ProteoVision jointly integrates a 3D viewer
(9) using structures from the PDB like RiboXYZ, which
demonstrates how structure visualization can help interpret
results derived from sequence analysis.

The database is also built to be augmented and maintained
over time, with the release of new structures, and the potential
integration or crosslinking with other databases to improve its
coverage and annotations (12). 

As RiboXYZ applies a generic
framework to process and describe all the structures, some
more effort can be done in the future to provide more specific
annotations and tools to cover some fundamental aspects of
the ribosome that were recently adressed in structural studies,
including the conformational heterogeneity (4), assembly
pathways (28), and other functions of the ribosome (e.g.
antibiotic resistance (20), nascent chain interactions (17)).
While the tools produce satisfactory results in our examples,
we also plan for further improvement and alternative options.
For instance, an alternative to the sequence alignment 
performed in the superimposition and binding site tools can
be brought using pairwise structural alignment methods (29),
or by leveraging curated seed-sequences for multiple sequence
alignment (23). 

Overall, these potential modifications can be
easily implemented, given the modular architecture of the
database. 

More generally, while the current tools mostly apply
to single structure for visualization, or pairs of structures
for superimposition and binding sites prediction, it would be
interesting to fully leverage the diversity of structures in our
database by designing tools that perform multiple and high
throughput analysis across the database.

<--- We'd also like to humbly note that with the proliferation of heterogenous data in the PDB the work of categorizing it becomes increasingly necessary to maintain uniformity of access. RibosomeXYZ in this sense is a proof of concept for a subset of PDB data picked on the basis of its belonging to a class of biomolecule and augmented with domain knowledge specific to that biomolecule's field. We find that a subset of PDB data refined this way lends itself well to "data-oriented" programming whereby computations are brought to the data-resident cluster as opposed to the data being moved to the executor. This way, the domain knowledge is codified inside the repository of data it illuminates. We believe this is not particular to the ribosome.
