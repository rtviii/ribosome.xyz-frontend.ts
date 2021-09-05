import json
from ete3 import NCBITaxa
from pprint import pprint
unique_taxa =[
9606,562,300852,4932,36329,9823,83333,1280,28985,4932,9986,9606,224308,562,1351,9986,83333,5661,559292,300852,32630,83333,300852,32630,83333,32630,300852,83333,300852,243230,28985,262724,300852,274,300852,585,93061,93061,367830,83333,544404,300852,300852,1931,300852,274,262724,300852,83333,300852,7536,1299,300852,9913,300852,83333,55431,300852,83333,37000,562,83333,3562,300852,55431,300852,37000,28985,559292,1177187,300852,585035,300852,331111,262724,300852,83333,83333,331111,83333,562,83333,1351,83333,562,83334,93061,93062,559292,285006,1280,10665,83333,663,83333,83333,7460,246196,759272,5693,559292,4932,1773,300852,574,562,331111,1247190,5811,5722,300852,287,262724,562,274,246196,1772,300852,9739,83333,284590,559292,284590,4932,9823,9606,9606,9823,562,7460,9986,194966,679895,5702,562,9606,262724,274,1351,300852,562,300852,562,262724,9986,9606,9615,6039,209285,311400,287,272844,273057,83333,224308,69014,1293037,2287,562,1223565,1144670,1217649,1977881,480119,1217710,1310637,421052,470,1310678,52133,1144663,1960940,1144670,1217649,1977881,480119,1217710,470,1310637,421052,1144663,1960940,1310678,52133,1217649,1977881,480119,1310637,421052,470,1310678,1144670,1217710,1144663,1960940,52133,1144670,480119,1217710,1217649,470,1310637,421052,1144663,1977881,474186,3702,575584
]
ncbi = NCBITaxa()
unique_taxa = list(set(unique_taxa))

# ? These tax ids are a unique scan over all structures in the current instance of neo4j.
"""This script is used to generate taxonomy files that contain the structure's species present in the database:

viruses   .json
bacteria  .json
eukaryota .json
archaea   .json

Most filters on the site rely on these files for situating individual tax ids. 
Hence, these files should be generated anew when new structures are added to the database or extended with tax ids of the new structures.
"""


with open('unique_taxa.txt','w') as infile:
    for i in unique_taxa:
        infile.write(str(i)+"\n")

    infile.close()




taxid2name = ncbi.get_taxid_translator(unique_taxa  )
b          = ncbi.get_name_translator (['Bacteria'] )['Bacteria'][0]
a          = ncbi.get_name_translator (['Archaea']  )['Archaea'][0]
e          = ncbi.get_name_translator (['Eukaryota'])['Eukaryota'][0]
v          = ncbi.get_name_translator (['Viruses']  )['Viruses'][0]


e_arr =[]
b_arr =[]
a_arr =[]
v_arr =[]
for i in unique_taxa:
    lin = ncbi.get_lineage(i)
    sortedd = False
    if b in lin:
        b_arr.append(i)
        sortedd=True
    if a in lin:
        assert(sortedd==False)
        a_arr.append(i)
        sortedd=True
    if e in lin:
        assert(sortedd==False)
        e_arr.append(i)
        sortedd=True
    if v in lin:
        assert(sortedd==False)
        v_arr.append(i)
        sortedd=True
# pprint(taxid2name)


e_dict=[]
b_dict=[]
a_dict=[]
v_dict=[]


for t in e_arr:
    id  = [* ncbi.get_taxid_translator( [str(t)] ).keys() ][0]
    tax = [*ncbi.get_taxid_translator( [str(t)] ).values()][0]
    e_dict.append({
        "label":tax,
        "value":[ id ],
        "checked":False
    })

for f in a_arr:
    id  = [*ncbi.get_taxid_translator( [str(f)] ).keys() ][0]
    tax = [*ncbi.get_taxid_translator( [str(f)] ).values()][0]
    a_dict.append({
    "label":tax,
    "value":[ id ],
    "checked":False
    })

for c in b_arr:
    id  = [* ncbi.get_taxid_translator( [str(c)] ).keys() ][0]
    tax = [*ncbi.get_taxid_translator( [str(c)] ).values()][0]
    b_dict.append({
        "label":tax,
        "value":[ id ],
        "checked":False
    })
for g in v_arr:
    id  = [* ncbi.get_taxid_translator( [str(g)] ).keys  () ][0]
    tax = [* ncbi.get_taxid_translator( [str(g)] ).values() ][0]
    v_dict.append({
        "label":tax,
        "value":[ id ],
        "checked":False
    })

v_dict= {
    "label":"Viruses",
    "value":v_arr,
    "checked":False,
    "children":v_dict
}
b_dict= {
    "label":"Bacteria",
    "value":b_arr,
    "checked":False,
    "children":b_dict
}
a_dict= {
    "label":"Archaea",
    "value":a_arr,
    "checked":False,
    "children":a_dict
}
e_dict= {
    "label":"Eukaryota",
    "value":e_arr,
    "checked":False,
    "children":e_dict
}


with open('viruses.json','w') as infile:
    json.dump(v_dict,infile)
with open('bacteria.json','w') as infile:
    json.dump(b_dict,infile)
with open('eukaryota.json','w') as infile:
    json.dump(e_dict,infile)
with open('archaea.json','w') as infile:
    json.dump(a_dict,infile)

pprint(ncbi.get_name_translator(['Eukaryota']))
pprint(ncbi.get_name_translator(['Archaea']))
pprint(ncbi.get_name_translator(['Viruses']))