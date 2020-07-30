import React, { useEffect, useState } from "react";
import tegunov from "./../static/tegunovM.gif";
import seqalign from "./../static/imseqalign.png";
import secondary from "./../static/secondary.jpg";
import "./../styles/VisualDisplay.css";



/* Commented copy for Anton */


type ScriptParameters = {
  src: string;
  async?: boolean;
  charset?: string;
  type?: string;
  defer?: boolean;
};
const useImportScript = (scriptParams: ScriptParameters) => {
  var { src, async, charset, defer } = scriptParams;
  useEffect(() => {
    const script = document.createElement("script");
    script.src = src;
    defer && (script.defer = true);
    charset && (script.charset = charset);
    async && (script.async = async);
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [scriptParams]);
};



// Everything above is react-specific syntax which i just use to import the scripts as Masdar does in https://embed.plnkr.co/plunk/h0bDVBKUVLvACcER 

const VisualDisplay = (props: any) => {
  // script tags and links for pdbe-molstar-viewer
  useImportScript({
    src:
      "https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs/webcomponents-lite.js",
    charset: "utf-8",
  });
  useImportScript({
    src:
      "https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js",

    charset: "utf-8",
  });
  useImportScript({
    src:
      "https://www.ebi.ac.uk/pdbe/pdb-component-library/js/pdbe-molstar-component-1.1.0-dev.4.js",
    type: "text/javascript",
    charset: "utf-8",
  });

  // pdbe-top-viewer
  // https://github.com/PDBeurope/pdb-topology-viewer/wiki/2.-PDB-Topology-Viewer-as-Web-component
  useImportScript({
    src:
      "https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs/webcomponents-lite.js",
    charset: "utf-8",
  });
  useImportScript({
    src:
      "https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js",
    charset: "utf-8",
    // defer: true,
  });
  useImportScript({
    src: "https://cdn.jsdelivr.net/npm/d3@5.9.2",
    defer: true,
  });
  useImportScript({
    src:
      "https://www.ebi.ac.uk/pdbe/pdb-component-library/js/pdb-topology-viewer-component-2.0.0.js",
    type: "text/javascript",
    // defer: true,
  });


  interface Residue {}
  const highlightResidueMolstar = (residue: Residue) => {
    var pdbeMolstarComponent = document.getElementById(
      "pdbeMolstarComponent"
    ) as any;
    var viewerInstance = pdbeMolstarComponent.viewerInstance;
    viewerInstance.visual.highlight({
      data: [
        {
          entity_id: "1",
          struct_asym_id: "A",
          start_residue_number: 10,
          end_residue_number: 15,
        },
      ],
    });
  };

  useEffect(() => {



    // https://github.com/PDBeurope/pdbe-molstar/wiki/1.-PDBe-Molstar-as-JS-plugin
    // This is the "important bit".
    // -------------
    // Selecting the <element/> with id="pdbeMolstarComponent" on the pag
    var pdbeMolstarComponent = document.getElementById(
      "pdbeMolstarComponent"
    ) as any; // (leave out the "any" in html -- it's typescript specifc)
    var viewerInstance = pdbeMolstarComponent!.viewerInstance;

    // This should not have a "!" in html_______\/_____________
    // var viewerInstance = pdbeMolstarComponent.viewerInstance;

    viewerInstance.visual.update({
      moleculeId: "1cbs",
      hideCanvasControls: ["expand", "selection", " animation"],
      hideControls: true,
      // I assume this is the part that makes it work, nothing else
      subscribEvents: true,
    });

    return () => {};
  }, []);

  return (
    <div>
      <div className="display">
        <pdbe-molstar id="pdbeMolstarComponent" molecule-id="null" />
        <pdb-topology-viewer
          id="pdb-top-viewer"
          entry-id="1cbs"
          entity-id="1"
        ></pdb-topology-viewer>
      </div>
    </div>
  );
};

export default VisualDisplay;
