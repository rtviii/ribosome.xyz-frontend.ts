# Internal

#### Acquiring semantic data from Neo4j

The database is available at [```https://ribosome.xyz:7473/browser/```](https://ribosome.xyz:7473/browser/) and has a convenient user interface. A development account will be required. Can be accesssed with ```rt```:```rrr``` at this moment.



See [/docs#Neo4jConnector]() for more detail on interacting with the database.
The Django application associated with the database currently has the following endpoints implemented: 

********
__Endpoint__: 
#### ribosome.xyz/neo4j/get_all_struct/

Request All nodes associated with a given struct.

|||
|:---|:---:|
|```@param```:```string``` pdbid| The id of the structure according to PDB|
|||

For example, to receive all data associated with the the [ d.radiodurans LSU ](http://www.rcsb.org/structure/5JVG)(5JVG), query:


        https://ribosome.xyz/neo4j/get_data/q?pdbid=5JVG



********
__Endpoint__: 
#### ribosome.xyz/neo4j/cypher/


Pass custom *Cypher* string to use Django application as a proxy to query the Neo4j database in its native Cypher language. Query language for graph-native data, it is extremely flexible and allows for extensive chaining.


|||
|:---|:---:|
|```@param```:```string``` cypher| The query expressed in the Cypher language|
|||


For example, to receive nodes for structure 5NJT and its subchains, query:

        query_literal:str = "MATCH (p:PDBStructure{pdbid:"5NJT"})-[relationship:IsSubchainOf]-(s:Subchain) RETURN p,s,relantionship LIMIT 25;"
        https://ribosome.xyz/neo4j/cypher/q?cypher=query_literal

![](Screenshot%20from%202020-07-30%2022-59-22.png)


The schema of the database:
![](Screenshot%20from%202020-07-30%2022-51-32.png)


Example of Cypher string :
![](Screenshot%20from%202020-07-30%2023-00-59.png)




# Ribovision

Awaiting development...In principle:


|||
|:---|:---:|
|```@param``` pdbid| The id of the structure |
|||

Ex.

        apollo2.chemistry.gatech.edu/get_data/?q={pdbid,chain,resn,speciesrange}