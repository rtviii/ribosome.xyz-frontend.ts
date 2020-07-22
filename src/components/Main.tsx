import React, { useEffect } from "react";
import "./../styles/Main.css";
import Toolbar from "./Toolbar";
import Navbar from "./Navbar";
import Display from "./Display";
import {
  withRouter,
  BrowserRouter as Router,
  useHistory,
} from "react-router-dom";

const Main = () => {
  const history = useHistory();
  useEffect(() => {
    history.push("/display");
    return () => {};
  }, [history]);

  return (
    <div className="main">
      <Navbar />
      <Toolbar />
      <Display />
    </div>
  );
};

export default withRouter(Main);
