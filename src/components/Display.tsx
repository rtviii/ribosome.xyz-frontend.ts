import React from "react";
import tegunov from "./../static/tegunovM.gif";
import seqalign from "./../static/imseqalign.png";

const Display = () => {
  return (
    <div className="display">
      <div className="3d">
        <img src={tegunov} alt="meaningful text" />
      </div>
      <div className="2d"></div>
      <div className="1d">
        <img src={seqalign} alt="meaningful text" />
      </div>
    </div>
  );
};

export default Display;
