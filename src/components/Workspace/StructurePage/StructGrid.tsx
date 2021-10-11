import { flattenDeep } from "lodash";
import "./StructGrid.css";
import React, { useEffect, useState } from "react";
import RibosomalProteinHero from "../RibosomalProteins/RibosomalProteinHero";
import {
  Ligand,
  Protein,
  RNA,
} from "./../../../redux/RibosomeTypes";
import { Grid } from "@material-ui/core";

const StructGrid = ({
  pdbid,
  protdata,
  rrnas,
  ligands,
}: {
  pdbid   : string;
  protdata: Protein[];
  rrnas   : RNA[];
  ligands : Ligand[];
}) => {

  const [lsu, setlsu]     = useState<Protein[]>([])
  const [ssu, setssu]     = useState<Protein[]>([])
  const [other, setother] = useState<Protein[]>([])



  useEffect(() => {
    var lsu   = protdata.filter(x=> x.nomenclature.length === 1 && flattenDeep(x.nomenclature.map(name => { return name.match(/L/)})).includes('L') )
    var ssu   = protdata.filter(x=> x.nomenclature.length === 1 && flattenDeep(x.nomenclature.map(name => { return name.match(/S/)})).includes('S'))
    var other = protdata.filter(x=> ![...lsu,...ssu].includes(x))
    setlsu(lsu)
    setssu(ssu)
    setother(other)
  }, [protdata])
  return (
    <Grid xs={10} container item>
      <Grid container item xs={4}>
        <h4>Large Subunit Proteins</h4>
        {lsu.map((x, j) => (
          <RibosomalProteinHero key={j} data={x} pdbid={pdbid} />
        ))}
      </Grid>
      <Grid container item xs={4}>
        <h4>Small Subunit Proteins</h4>
        {ssu.map((x, j) => (
          <RibosomalProteinHero key={j} data={x} pdbid={pdbid} />
        ))}
      </Grid>
      <Grid container item xs={4}>
        <h4>Other/Undetermined</h4>
        {other.map((x, j) => (
          <RibosomalProteinHero key={j} data={x} pdbid={pdbid} />
        ))}
      </Grid>
    </Grid>
  );
};

export default StructGrid;
