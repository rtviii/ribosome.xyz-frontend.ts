import React, { useEffect, createContext } from "react";
import "./../styles/Main.css";
// import Toolbar from "./ToolbarLeft/Toolbar";
import Navbar from "./NavbarTop/Navbar";
import Display from "./Workspace/Display/Display";

export type PageContexts =
  | "RibosomalProteinPage"
  | "ProteinCatalogue"
  | "StructurePage"
  | "Main"
  | "WorkspaceCatalogue";
export const PageContext = createContext<PageContexts>("Main");

const Main: React.FC = () => {
  return (
    <div className="main">
      <Navbar />
      {/* <Toolbar /> */}
      <Display />
    </div>
  );
};

export default Main;
