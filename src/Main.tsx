import React from "react";
import tegunov from "./static/tegunovM.gif";
import Fetcher from "./components/Fetcher";
import "./Main.css";

const Main = () => {
  return (
    <div>
      <div className="main">

        <div className="ctl">
          <Fetcher />
        </div>

        <div className="media">
          <img src={tegunov} alt="M"></img>
        </div>

        <div className="content" />
      </div>
    </div>
  );
};

export default Main;
