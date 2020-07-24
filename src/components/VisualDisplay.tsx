import React, { useEffect, useState } from "react";
import tegunov from "./../static/tegunovM.gif";
import seqalign from "./../static/imseqalign.png";
import secondary from "./../static/secondary.jpg";
import "./../styles/VisualDisplay.css";

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

const VisualDisplay = (props: any) => {
  // pdbe-molstar-viewer
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

  const addNewMolecule = (pdbid: string) => {
    var pdbeMolstarComponent = document.getElementById(
      "pdbeMolstarComponent"
    ) as any;
    var viewerInstance = pdbeMolstarComponent.viewerInstance;
    viewerInstance.visual.update({ moleculeId: pdbid });
  };

  useEffect(() => {
    // https://github.com/PDBeurope/pdbe-molstar/wiki/1.-PDBe-Molstar-as-JS-plugin
    var pdbeMolstarComponent = document.getElementById(
      "pdbeMolstarComponent"
    ) as any;
    var viewerInstance = pdbeMolstarComponent!.viewerInstance;
    viewerInstance.visual.update({
      moleculeId: "1bs5",
      hideCanvasControls: ["expand", "selection", " animation"],
      hideControls: true,
      subscribEvents: true,
    });


    var topviewer = document.getElementById('pdbTopologyViewer')

    return () => {};
  }, []);

  const [viewerpdbid, setviewpdbid] = useState("");
  return (
    <div>
      <button
        onClick={() => {
          addNewMolecule(viewerpdbid);
        }}
      >
        ID
      </button>
      <input
        type="text"
        value={viewerpdbid}
        onChange={e => setviewpdbid(e.target.value)}
      />
      <div className="display">
          <pdbe-molstar id="pdbeMolstarComponent" molecule-id="null" />
          <pdb-topology-viewer id="pdbTopologyViewer" pdb-id="1cbs" entity-id="1"></pdb-topology-viewer>
        {/* <div className="primary">
          <img src={seqalign} alt="meaningful text" hide-controls={true} />
        </div>
        <div className="tertiary">
        </div>
        <div className="secondary">
        </div> */}
      </div>
    </div>
  );
};

export default VisualDisplay;
