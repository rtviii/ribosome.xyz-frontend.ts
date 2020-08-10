import React, { useEffect } from "react";
import "./../styles/Main.css";
import Toolbar from "./ToolbarLeft/Toolbar";
import Navbar from "./NavbarTop/Navbar";
import Display from "./Workspace/Display";
import { withRouter, useHistory } from "react-router-dom";
// import axios from "axios";

const Main = () => {
  const history = useHistory();
  useEffect(() => {
    // history.push("");
    return () => {};
  }, [history]);

  // const baseapi = process.env.REACT_APP_DJANGO_URL;
  return (
    <div className="main">
      <Navbar />
      <Toolbar />
      <Display />
    </div>
  );
};

export default withRouter(Main);

