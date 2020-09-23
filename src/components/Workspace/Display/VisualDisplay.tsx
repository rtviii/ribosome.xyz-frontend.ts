import React, { useEffect, useState } from "react";

type ScriptParameters = {
  src     : string;
  async?  : boolean;
  charset?: string;
  type?   : string;
  defer?  : boolean;
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
  }, [src,scriptParams, async,defer, charset]);
};

const VisualDisplay = () => {
  //molstar
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
  });
  useImportScript({
    src: "https://cdn.jsdelivr.net/npm/d3@5.9.2",
  });
  useImportScript({
    src:
      "https://www.ebi.ac.uk/pdbe/pdb-component-library/js/pdb-topology-viewer-component-2.0.0.js",
    type: "text/javascript",
  });

  const addNewMolecule = (pdbid: string) => {
    var pdbeMolstarComponent = document.getElementById(
      "pdbeMolstarComponent"
    ) as any;
    var viewerInstance = pdbeMolstarComponent.viewerInstance;
    viewerInstance.visual.update({ moleculeId: pdbid });

    var topviewer = document.getElementById("pdbTopologyViewer") as any;
    const pluginInstance = topviewer!.pluginInstance;
    pluginInstance.render(topviewer, { entryId: pdbid, entityId: "1" });
  };

  useEffect(() => {
    var pdbeMolstarComponent = document.getElementById(
      "pdbeMolstarComponent"
    ) as any;
    var viewerInstance = pdbeMolstarComponent!.viewerInstance;
    viewerInstance.visual.update({
      moleculeId        : "3j9m",
      struct_asym_id    : "",
      hideCanvasControls: ["expand", "selection", " animation"],
      hideControls      : true,
      subscribEvents    : true,
    });

    interface PDBEvent extends Event {
      eventData: {
        chainId: string;
        entityId: string;
        entryId: string;
        residueNumber: number;
        type: string;
      };
    }
    document.addEventListener("PDB.topologyViewer.mouseover", e => {
      var {
        entityId,
        residueNumber,
      } = (e as PDBEvent).eventData;

      viewerInstance.visual.highlight({
        data: [
          {
            start_residue_number: residueNumber,
            end_residue_number: residueNumber,
            entity_id: entityId,
          },
        ],
      });
    });

    document.addEventListener("PDB.topologyViewer.click", e => {
      var {
        entityId,
        residueNumber,
      } = (e as PDBEvent).eventData;

      // viewerInstance.visual.focus([
      //   {
      //     start_residue_number: residueNumber,
      //     end_residue_number: residueNumber,
      //     entity_id: entityId,
      //   },
      // ]);

      viewerInstance.visual.select({
        data: [
          {
            entity_id: entityId,
            start_residue_number: residueNumber,
            end_residue_number: residueNumber,
            color: { r:20 , g: 100, b: 200 },
            focus: true,
          },
        ],
        // nonSelectedColor: { r: 255, g: 255, b: 255 },
      });
    });

    return () => {};
  }, []);

  const [viewerpdbid, setviewpdbid] = useState("");
  return (
    <div>

      {/* <button id="resetThemeBtn">Reset View</button> */}

      {/* <button
        onClick={() => {
          addNewMolecule(viewerpdbid);
        }}
      >
        Struct.Load
      </button> */}
      {/* <input
        type="text"
        value={viewerpdbid}
        onChange={e => setviewpdbid(e.target.value)}
      /> */}
      <div className="display">
        <pdbe-molstar
          id="pdbeMolstarComponent"
          hide-controls="true"
          sub
          molecule-id="null"
        />

        <div id="pdbtop-viewer-frame">
          <pdb-topology-viewer
            id="pdbTopologyViewer"
            entry-id="1cbs"
            entity-id="1"
            subscribe-events="true"
          />
        </div>
      </div>
    </div>
  );
};

export default VisualDisplay;
