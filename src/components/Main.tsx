import React, { useEffect } from "react";
import "./../styles/Main.css";
import Toolbar from "./Toolbar";
import Navbar from "./Navbar";
import Display from "./Display";
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

  /* <button
        onClick={() => {
          console.log(baseapi);

          axios.get(`${baseapi}/neo4j/test/`).then(r => {
            console.log(r.data);
          });
        }}
      ></button> */