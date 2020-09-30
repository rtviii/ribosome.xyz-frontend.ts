import { flattenDeep } from "lodash";
import './StructGrid.css'
import React from "react";
import RibosomalProteinHero from "../RibosomalProteins/RibosomalProteinHero";
import {
  Ligand,
  RibosomalProtein,
  RibosomeStructure,
  rRNA,
} from "./../../../redux/RibosomeTypes";

const StructGrid = ({
  pdbid,
  protdata,
  rrnas,
  ligands,
}: {
  pdbid: string;
  protdata: RibosomalProtein[];
  rrnas: rRNA[];
  ligands: Ligand[];
}) => {
  return (
    <div className="struct-grid">
        <div className='lsu'>
            LSU

        </div>
        <div className='ssu'>
            SSU
        </div>
        {/* <div className='ligands'>
            ligdaNS
        </div> */}


    </div>
  );
};

export default StructGrid;

    //   <ul className="ssu">
    //     <div className="subunit-title">SSU</div>
    //     {protdata
    //       .filter(x => {
    //         var Subunits = flattenDeep(
    //           x.nomenclature.map(name => {
    //             return name.match(/S|L/g);
    //           })
    //         );
    //         return Subunits.includes("L") && !Subunits.includes("S");
    //       })
    //       .map((x, i) => (
    //         <RibosomalProteinHero key={i} {...{ pdbid }} {...x} />
    //       ))}
    //   </ul>
    //   <ul className="lsu">
    //     <div className="subunit-title">LSU</div>
    //     {protdata
    //       .filter(x => {
    //         var Subunits = flattenDeep(
    //           x.nomenclature.map(name => {
    //             return name.match(/S|L/g);
    //           })
    //         );
    //         return Subunits.includes("S") && !Subunits.includes("L");
    //       })
    //       .map((x, j) => (
    //         <RibosomalProteinHero key={j} {...{ pdbid }} {...x} />
    //       ))}
    //   </ul>
    //   <ul className="other">
    //     <div className="subunit-title">Other</div>
    //     {protdata
    //       .filter(x => {
    //         var Subunits = flattenDeep(
    //           x.nomenclature.map(name => {
    //             return name.match(/S|L/g);
    //           })
    //         );

    //         return (
    //           (Subunits.includes("S") && Subunits.includes("L")) ||
    //           Subunits.length === 0 ||
    //           Subunits.includes(null)
    //         );
    //       })
    //       .map((x, k) => (
    //         <RibosomalProteinHero key={k} {...{ pdbid }} {...x} />
    //       ))}
    //   </ul>
    