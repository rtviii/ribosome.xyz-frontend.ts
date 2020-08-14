import React from "react";

const StructHero = ({
  pdbid,
  select,
}: {
  pdbid: string;
  select: (pdbid: string) => void;
}) => {
  return (
    <div
      key={`_struct_key_${pdbid}`}
      onClick={() => select(pdbid)}
      className="struct-modal"
      id={`_struct_${pdbid}`}
    >
      {pdbid}
    </div>
  );
};

export default StructHero;
