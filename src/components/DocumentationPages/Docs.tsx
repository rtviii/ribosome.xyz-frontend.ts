import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import marked from "marked";
import "./Docs.css";

const Docs = (props: any) => {
  const [document, setdocument] = useState("Fetching document.");
  useEffect(() => {
    var { match } = props;
    var docurl: string = match!.path;
    var template = require(`./${docurl.substr(1)}.md`)

    fetch(template)
      .then(template => template.text())
      .then(text => { 
        
        console.log(text)
        
        setdocument(marked(text)) });
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

export default withRouter(Docs);
