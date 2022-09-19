import React from "react";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Typography } from "@material-ui/core";
import { DashboardButton } from '../../../materialui/Dashboard/Dashboard';
import { Button } from '@material-ui/core';

const python_script = String.raw`
#!/usr/bin/env python3
# kdd@math.ubc.ca
# rtkushner@gmail.com
# This script is courtesy of the ribosome.xyz and its authors.
# This relies on the following packages to run
# - gemmi   : https://gemmi.readthedocs.io/en/latest/install.html
# - bipython: https://biopython.org/
# And additionally "requests" to download missing structures: https://pypi.org/project/requests/

# Distribute freely. 

try: from Bio import pairwise2
except ImportError: print("Please install Biopython to use this script: pip install biopython"); exit(1)
try: import gemmi
except:  print("Please install gemmi to use this script: pip install gemmi"); exit(1)
import pathlib
import argparse

# Change these two parameters to have a different "source" sequence to align *against*  ----|
#                                                                                           |
# Some of the PTC residues in bacterial 23SrRNA                                             |
PTC_SEQ_IDS      = [2445,2446,2447,2448,2449,2450,2451,2452]#                               |
# As per PDB 3J7Z ( https://www.rcsb.org/structure/3j7z )                                   |
ECOLI23SRRNA = "GGUUAAGCGACUAAGCGUACACGGUGGAUGCCCUGGCAGUCAGAGGCGAUGAAGGACGUGCUAAUCUGCGAUAAGCGUCGGUAAGGUGAUAUGAACCGUUAUAACCGGCGAUUUCCGAAUGGGGAAACCCAGUGUGUUUCGACACACUAUCAUUAACUGAAUCCAUAGGUUAAUGAGGCGAACCGGGGGAACUGAAACAUCUAAGUACCCCGAGGAAAAGAAAUCAACCGAGAUUCCCCCAGUAGCGGCGAGCGAACGGGGAGCAGCCCAGAGCCUGAAUCAGUGUGUGUGUUAGUGGAAGCGUCUGGAAAGGCGCGCGAUACAGGGUGACAGCCCCGUACACAAAAAUGCACAUGCUGUGAGCUCGAUGAGUAGGGCGGGACACGUGGUAUCCUGUCUGAAUAUGGGGGGACCAUCCUCCAAGGCUAAAUACUCCUGACUGACCGAUAGUGAACCAGUACCGUGAGGGAAAGGCGAAAAGAACCCCGGCGAGGGGAGUGAAAAAGAACCUGAAACCGUGUACGUACAAGCAGUGGGAGCACGCUUAGGCGUGUGACUGCGUACCUUUUGUAUAAUGGGUCAGCGACUUAUAUUCUGUAGCAAGGUUAACCGAAUAGGGGAGCCGAAGGGAAACCGAGUCUUAACUGGGCGUUAAGUUGCAGGGUAUAGACCCGAAACCCGGUGAUCUAGCCAUGGGCAGGUUGAAGGUUGGGUAACACUAACUGGAGGACCGAACCGACUAAUGUUGAAAAAUUAGCGGAUGACUUGUGGCUGGGGGUGAAAGGCCAAUCAAACCGGGAGAUAGCUGGUUCUCCCCGAAAGCUAUUUAGGUAGCGCCUCGUGAAUUCAUCUCCGGGGGUAGAGCACUGUUUCGGCAAGGGGGUCAUCCCGACUUACCAACCCGAUGCAAACUGCGAAUACCGGAGAAUGUUAUCACGGGAGACACACGGCGGGUGCUAACGUCCGUCGUGAAGAGGGAAACAACCCAGACCGCCAGCUAAGGUCCCAAAGUCAUGGUUAAGUGGGAAACGAUGUGGGAAGGCCCAGACAGCCAGGAUGUUGGCUUAGAAGCAGCCAUCAUUUAAAGAAAGCGUAAUAGCUCACUGGUCGAGUCGGCCUGCGCGGAAGAUGUAACGGGGCUAAACCAUGCACCGAAGCUGCGGCAGCGACGCUUAUGCGUUGUUGGGUAGGGGAGCGUUCUGUAAGCCUGCGAAGGUGUGCUGUGAGGCAUGCUGGAGGUAUCAGAAGUGCGAAUGCUGACAUAAGUAACGAUAAAGCGGGUGAAAAGCCCGCUCGCCGGAAGACCAAGGGUUCCUGUCCAACGUUAAUCGGGGCAGGGUGAGUCGACCCCUAAGGCGAGGCCGAAAGGCGUAGUCGAUGGGAAACAGGUUAAUAUUCCUGUACUUGGUGUUACUGCGAAGGGGGGACGGAGAAGGCUAUGUUGGCCGGGCGACGGUUGUCCCGGUUUAAGCGUGUAGGCUGGUUUUCCAGGCAAAUCCGGAAAAUCAAGGCUGAGGCGUGAUGACGAGGCACUACGGUGCUGAAGCAACAAAUGCCCUGCUUCCAGGAAAAGCCUCUAAGCAUCAGGUAACAUCAAAUCGUACCCCAAACCGACACAGGUGGUCAGGUAGAGAAUACCAAGGCGCUUGAGAGAACUCGGGUGAAGGAACUAGGCAAAAUGGUGCCGUAACUUCGGGAGAAGGCACGCUGAUAUGUAGGUGAGGUCCCUCGCGGAUGGAGCUGAAAUCAGUCGAAGAUACCAGCUGGCUGCAACUGUUUAUUAAAAACACAGCACUGUGCAAACACGAAAGUGGACGUAUACGGUGUGACGCCUGCCCGGUGCCGGAAGGUUAAUUGAUGGGGUUAGCGCAAGCGAAGCUCUUGAUCGAAGCCCCGGUAAACGGCGGCCGUAACUAUAACGGUCCUAAGGUAGCGAAAUUCCUUGUCGGGUAAGUUCCGACCUGCACGAAUGGCGUAAUGAUGGCCAGGCUGUCUCCACCCGAGACUCAGUGAAAUUGAACUCGCUGUGAAGAUGCAGUGUACCCGCGGCAAGACGGAAAGACCCCGUGAACCUUUACUAUAGCUUGACACUGAACAUUGAGCCUUGAUGUGUAGGAUAGGUGGGAGGCUUUGAAGUGUGGACGCCAGUCUGCAUGGAGCCGACCUUGAAAUACCACCCUUUAAUGUUUGAUGUUCUAACGUUGACCCGUAAUCCGGGUUGCGGACAGUGUCUGGUGGGUAGUUUGACUGGGGCGGUCUCCUCCUAAAGAGUAACGGAGGAGCACGAAGGUUGGCUAAUCCUGGUCGGACAUCAGGAGGUUAGUGCAAUGGCAUAAGCCAGCUUGACUGCGAGCGUGACGGCGCGAGCAGGUGCGAAAGCAGGUCAUAGUGAUCCGGUGGUUCUGAAUGGAAGGGCCAUCGCUCAACGGAUAAAAGGUACUCCGGGGAUAACAGGCUGAUACCGCCCAAGAGUUCAUAUCGACGGCGGUGUUUGGCACCUCGAUGUCGGCUCAUCACAUCCUGGGGCUGAAGUAGGUCCCAAGGGUAUGGCUGUUCGCCAUUUAAAGUGGUACGCGAGCUGGGUUUAGAACGUCGUGAGACAGUUCGGUCCCUAUCUGCCGUGGGCGCUGGAGAACUGAGGGGGGCUGCUCCUAGUACGAGAGGACCGGAGUGGACGCAUCACUGGUGUUCGGGUUGUCAUGCCAAUGGCACUGCCCGGUAGCUAAAUGCGGAAGAGAUAAGUGCUGAAAGCAUCUAAGCACGAAACUUGCCCCGAGAUGAGUUCUCCCUGACCCUUUAAGGGUCCUGAAGGAACGUUGAAGACGACGACGUUGAUAGGCCGGGUGUGUAAGCGCAGCGAUGCGUUGAGCUAACCGGUACUAAUGAACCGUGAGGCUUAACCU"
#-------------------------------------------------------------------------------------------|

parser = argparse.ArgumentParser(description= 'CLI for locating PTC residues of 23SrRNA in a given prokaryotic PDB file')
parser.add_argument ("-t", "--targets", type= str, required=True)
parser.add_argument ("--display_all", action='store_true')
args    = parser .parse_args()
argdict = vars(parser.parse_args())

if "targets" in argdict.keys():
    argdict["targets"] = [s.strip().upper() for s in argdict["targets"].split(",")]
    if len(argdict) > 50: 
        print("Please don't overload our servers. Paid out of pocket!:) \nInstead, get in touch for collaboration: rtkushner@gmail.com!")
        exit(1)

def backwards_match(alntgt:str, resid:int):
    """Returns the target-sequence index of a residue in the (aligned) target sequence"""
    if resid > len(alntgt):
        exit(IndexError(f"Passed residue with invalid index ({resid}) to back-match to target.Seqlen:{len(alntgt)}"))
    counter_proper = 0
    for i,char in enumerate(alntgt):
        if i == resid:
            return counter_proper
        if char =='-':
            continue
        else: 
            counter_proper  +=1

def forwards_match(alnsrc:str, resid:int):
    """Returns the index of a source-sequence residue in the (aligned) source sequence."""
    count_proper = 0
    for alignment_indx,char in enumerate( alnsrc ):
        if count_proper == resid:
            return alignment_indx
        if char =='-':
            continue
        else: 
            count_proper  +=1

def process_target(rcsb_id: str):
    default_path = f"{rcsb_id.upper()}.cif"
    if  not pathlib.Path(default_path).is_file():
        print(f"Could not locate file {default_path} in the current directory. Downloading via {f'https://api.ribosome.xyz/static_files/download_structure?struct_id={rcsb_id}'}.")
        import requests
        with open(default_path, 'wb') as outfile:
            outfile.write(requests.get(f'https://api.ribosome.xyz/static_files/download_structure?struct_id={rcsb_id}').content)

    target       = gemmi.cif.read_file(default_path)
    block        = target.sole_block()
    model        = gemmi.read_structure(default_path)[0]

    

    STRAND       = None
    SEQ          = None


    # Locate the chain of 23SrRNA class
    for (strand, nomclass) in zip(
        block.find_loop('_ribosome_nomenclature.entity_poly.pdbx_strand_id'),
        block.find_loop('_ribosome_nomenclature.polymer_class')
    ):
        if nomclass == '23SrRNA':
            STRAND = strand
            break

    # Now find sequence of this 23SrRNA
    for (chain_id, one_letter_code) in zip(
        block.find_loop('_entity_poly.pdbx_strand_id'),
        block.find_loop('_entity_poly.pdbx_seq_one_letter_code')
    ):
        if STRAND in chain_id.split(','):                      # X-RAY structures have 'dual' chains. Split on comma to check both.
            SEQ = str(one_letter_code).strip(";").strip("\n")

    if SEQ == None:
        print("Could not locate 23SrRNA sequence in {} CIF file".format(rcsb_id))

    alignment = pairwise2.align.globalxx(ECOLI23SRRNA,SEQ, one_alignment_only=True)
    src_aln      = alignment[0].seqA
    tgt_aln      = alignment[0].seqB
    
    aln_ids = []
    tgt_ids = []

    for src_resid in PTC_SEQ_IDS:
        aln_ids.append(forwards_match(src_aln,src_resid))
    aln_ids = list(filter(lambda x: x != None, aln_ids ))

    for aln_resid in aln_ids:
        if tgt_aln[aln_resid] == '-':
            continue
        tgt_ids.append(backwards_match(tgt_aln,aln_resid))

    
    return [list(model[STRAND][ix][0].pos) for ix in tgt_ids]
    

for target in argdict["targets"]:
    if not args.display_all:
        target_ptc = process_target(target)
        print("[\033[94m{}\033[0m] Approximate PTC position(1 of {} residues): \033[91m{}\033[0m".format(target,len( target_ptc ),target_ptc[0]))
    else:
        print("[\033[94m{}\033[0m] PTC atom positions: ".format(target))
        for residue in process_target(target):
            print(f"\t\033[91m{residue}\033[0m")
if not args.display_all:
    print("\nTo display more residues per target structure, use additional --display_all flag.")

`


export const HowTo = () => {

  const downloadTxtFile = () => {
    const element = document.createElement("a");
    const file = new Blob([python_script], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "ptc_positions.py";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }


  return (


    <Grid container spacing={2} xs={12} style={{ "padding": "10px" }}>
      <Grid item xs={1}>
        <DashboardButton />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h3">User Manual</Typography>
        For an in-depth overview of tools and sections of the website, please refer to the User Manual downloadable <a style={{ color: "blue" }} href={process.env.PUBLIC_URL + '/RiboXYZ_usermanual.pdf'}>pdf</a>.
      </Grid>


      <Grid item xs={12}>
        <Typography variant="h3">Tutorials</Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h4">PTC Nucleotides Extraction</Typography>
        We provide a <span onClick={downloadTxtFile} style={{ cursor:"pointer", color: "blue" }} >Python3 script file</span> for extracting the positions of the residues associated with the Peptidyl-Transfer-Center (PTC)
      </Grid>


      <Grid item xs={12}>
        <Typography variant="h4">PTC Visualisation</Typography>
        <Typography variant="body1">
          In this tutorial we visualize the Peptidyl-Transfer-Center (PTC)
          region of the ribosome  by highlighting the sites 2445-2452 from the E. coli 23S rRNA.
          Note that as the PTC is a well-conserved rRNA region, the identification of the rRNA site can be done for any species upon aligning its 23S/25S/28S rRNA
          sequence with that of another well known organism, e.g. human in eukaryote or E. coli in bacteria.
        </Typography>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/IkgVysgzltY" title="PTC" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h4">Superimposition</Typography>
        <Typography variant="body1">
          The 3D superimposition tool of RiboXYZ can be used to compare and visualize structural differ-
          ences of the ribosomal components across different species or conformations or the ribosome.
          Here we apply this tool to focus on two ribosomal proteins uL4 and uL23. These two proteins are also part of the ribosome exit tunnel, a
          sub-compartment of the ribosome that contains the nascent polypeptide chain. In particular,
          comparing and visualizing these two proteins allow to explain and interpret the main differences
          found in the geometry of the tunnel between eukaryotes and prokaryotes, that also impact
          the nascent chain folding and its escape from the tunnel.


        </Typography>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/nsFLE956HM4" title="Superimposition" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h4"> Ligand Prediction</Typography>
        <Typography variant="body1">
          The Ligands/Binding Sites tool allows to compare and use structures that include ligands.
          The following example shows how to use the tool to first visualize the binding site of streptomycin,
          in the ribosomal structure of the human
          mitochondrion (PDB 6RW5), and subsequently visualize it in the ribosome of M. smegmatis using
          PDB 5ZEP. To do so, our tool first locates the binding site in 6RW5 at the vicinity
          of several residues of uS12 (see Visualization Tools section), and then produces a list of homologous
          sites in M. tuberculosis from doing pairwise sequence alignment (as described in the Visualization
          tools section), with the result of the alignment shown when clicking on the “Inspect Prediction”
          button.</Typography>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/Ri-T4hUw0NE" title="Ligand Prediction" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      </Grid>

    </Grid>

  );
};