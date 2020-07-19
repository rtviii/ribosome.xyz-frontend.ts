import React from "react";
import tegunov from "./../static/tegunovM.gif";
import ControlPanel from "./ControlPanel";
import "./Main.css";

const Main = () => {
  return (
    <div>
      <div className="main">

        <div className="ctl">
          <ControlPanel />
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
