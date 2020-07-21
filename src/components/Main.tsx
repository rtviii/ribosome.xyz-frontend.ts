import React from "react";
import "./../styles/Main.css";
import Toolbar from "./Toolbar";
import Navbar from "./Navbar";
import Display from "./Display";

const Main = () => {
  return (
    <div className="main">
      <Navbar />
      <Toolbar />
      <Display />
    </div>
  );
};

export default Main;
