import React, { useEffect } from "react";
import "./../styles/Main.css";
// import Toolbar from "./ToolbarLeft/Toolbar";
import Navbar from "./NavbarTop/Navbar";
import Display from "./Workspace/Display/Display";


const Main: React.FC = () => {

  return (
    <div className="main">
      <Navbar />
      {/* <Toolbar /> */}
      <Display />
    </div>
  );
};


export default (Main);
