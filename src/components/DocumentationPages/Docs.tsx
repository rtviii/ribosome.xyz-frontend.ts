import React, { useState, useEffect } from "react";
import template from "./APIs-Outline.md";
import marked from "marked";
import './Docs.css'

const Docs = () => {
  const [document, setdocument] = useState("Fetching document.");
  useEffect(() => {
    fetch(template)
      .then(template => template.text())
      .then(text => setdocument(marked(text)));
  });
  return (
    <div>
      <div
        id="doc-container"
        dangerouslySetInnerHTML={{ __html: document }}
      ></div>
    </div>
  );
};

export default Docs;
