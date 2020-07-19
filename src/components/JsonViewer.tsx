import React from "react";
import ReactJson from "react-json-view";

export type jsonViewerSrc = {} | {}[];


const JsonViewer = ({
  src_data,
  name,
}: {
  src_data: jsonViewerSrc;
  name: string;
}) => {
  const custom_theme = {
    base00: "white",
    base01: "#ddd",
    base02: "#ddd",
    base03: "#444",
    base04: "purple",
    base05: "#444",
    base06: "#444",
    base07: "#444",
    base08: "#444",
    base09: "rgba(70, 70, 230, 1)",
    base0A: "rgba(70, 70, 230, 1)",
    base0B: "rgba(70, 70, 230, 1)",
    base0C: "rgba(70, 70, 230, 1)",
    base0D: "rgba(70, 70, 230, 1)",
    base0E: "rgba(70, 70, 230, 1)",
    base0F: "rgba(70, 70, 230, 1)",
  };
  const custom_style = {
    fontSize: "14px",
  };
  return (
    <ReactJson
      name={name}
      style={custom_style}
      theme={"ocean"}
      src={src_data}
      iconStyle="triangle"
      indentWidth={5}
      collapsed={false}
      enableClipboard={false}
      displayDataTypes={false}
      displayObjectSize={false}
    />
  );
};

export default JsonViewer;
