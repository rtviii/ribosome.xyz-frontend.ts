import React from "react";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Typography } from "@material-ui/core";


export const HowTo = () => {
  return (


    <Grid container spacing={2} xs={12} style={{"padding":"10px"}}>
      
      <Grid item xs={12}>
        <Typography variant="h3">User Manual</Typography>
        For an in-depth overview of tools and sections of the website, please refer to the <a href={process.env.PUBLIC_URL + '/RiboXYZ_usermanual.pdf'}>User Manual</a> (downloadable pdf).
      </Grid>

      <Grid item xs={12}>
        <Typography  variant="h4">PTC</Typography>
        <Typography  variant="body1">
          In this tutorial we visualize the Peptidyl-Transfer-Center (PTC)
region of the ribosome  by highlighting the sites 2445-2452 from the E. coli 23S rRNA. 
Note that as the PTC is a well-conserved rRNA region, the identification of the rRNA site can be done for any species upon aligning its 23S/25S/28S rRNA
sequence with that of another well known organism, e.g. human in eukaryote or E. coli in bacteria.
        </Typography>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/IkgVysgzltY" title="PTC"  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      </Grid>

      <Grid item xs={12}>
        <Typography  variant="h4">Superimposition</Typography>
        <Typography  variant="body1">
          The 3D superimposition tool of RiboXYZ can be used to compare and visualize structural differ-
ences of the ribosomal components across different species or conformations or the ribosome.
 Here we apply this tool to focus on two ribosomal proteins uL4 and uL23. These two proteins are also part of the ribosome exit tunnel, a
sub-compartment of the ribosome that contains the nascent polypeptide chain. In particular,
comparing and visualizing these two proteins allow to explain and interpret the main differences
found in the geometry of the tunnel between eukaryotes and prokaryotes, that also impact
the nascent chain folding and its escape from the tunnel.


        </Typography>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/nsFLE956HM4" title="Superimposition"  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
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
        <iframe width="560" height="315" src="https://www.youtube.com/embed/Ri-T4hUw0NE" title="Ligand Prediction"  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      </Grid>

    </Grid>

  );
};