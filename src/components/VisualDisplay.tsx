import React, { useEffect, useState } from "react";
import tegunov from "./../static/tegunovM.gif";
import seqalign from "./../static/imseqalign.png";
import secondary from "./../static/secondary.jpg";
import "./../styles/VisualDisplay.css";
// import * from './../../node_modules/pdb-topology-viewer/src/app/index'


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
  //molstar
  useImportScript({
    // defer:true,
    src:
      "https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs/webcomponents-lite.js",
    charset: "utf-8",
  });
  useImportScript({
    // defer:true,
    src:
      "https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js",

    charset: "utf-8",
  });
  useImportScript({
    // defer:true,
    src:
      "https://www.ebi.ac.uk/pdbe/pdb-component-library/js/pdbe-molstar-component-1.1.0-dev.4.js",
    type: "text/javascript",
    charset: "utf-8",
  });

  // top viewer
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
    // defer: true,
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

    var topviewer = document.getElementById("pdbTopologyViewer") as any;
    const pluginInstance = topviewer!.pluginInstance;
    pluginInstance.render(topviewer, {entryId:pdbid, entityId:'1'})
  };

  useEffect(() => {
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
    



    return () => {};
  }, []);

  const [viewerpdbid, setviewpdbid] = useState("");
  return (
    <div>

<button id="highLightBtn">highlight</button>

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
        <pdbe-molstar id="pdbeMolstarComponent"  hide-controls="true" sub molecule-id="null" />

        <div id="pdbtop-viewer-frame">
          <pdb-topology-viewer id="pdbTopologyViewer" entry-id="1cbs" entity-id="1" subscribe-events="true" />
        </div>
      </div>
    </div>
  );
};

export default VisualDisplay;