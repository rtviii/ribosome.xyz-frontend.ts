import React from "react";
import tegunov from "./../static/tegunovM.gif";
import seqalign from "./../static/imseqalign.png";
import secondary from "./../static/secondary.jpg";
import './../styles/Display.css'

const Display = () => {
  return (
    <div className="display">

      <div className="primary">
        <img src={seqalign} alt="meaningful text" />
      </div>

      <div className="tertiary">
        <img src={tegunov} alt="meaningful text" />
      </div>

      <div className="secondary">
        <img src={secondary} alt="meaningful text" />
      </div>
    </div>
  );
};

export default Display;
