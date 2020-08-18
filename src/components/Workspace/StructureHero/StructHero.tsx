import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../redux/store";

const StructHero = ({
  pdbid,
  select,
}: {
  pdbid: string;
  select: (pdbid: string) => void;
}) => {

  var structdata:any = useSelector((state: AppState) =>
    state.store_data.state_local.structures.filter(
      (s: any) => s.pdbid === pdbid
    )
  );
  const {nomenclatureCoverage, proteincount, rnacount,} = structdata.metadata
  const {pub, res,spec,kingdom}                                 = structdata

  console.log(nomenclatureCoverage);
  
  return (
    <div
      onClick={() => select(pdbid)}
      className={`struct-hero ${pdbid}`}
      id={`_struct_${pdbid}`}
    >
      {pdbid}
    </div>
  );
};

export default StructHero;
