import React from "react";
import tegunov from "./../static/tegunovM.gif";
import seqalign from "./../static/imseqalign.png";
import secondary from "./../static/secondary.jpg";
import "./../styles/Display.css";
import { withRouter, Switch, Route } from "react-router";

const Display = (props: any) => {
  console.log(props);

  return (
    <Switch>
      <Route component={VisualDisplay} path="/display" />
      <Route path="/data" component={DataDisplay} />
    </Switch>
  );
};
const VisualDisplay = (props: any) => {
  return (
    <div className="display">
      <div className="primary">
        <img src={seqalign} alt="meaningful text" />
      </div>
      <div className="tertiary">
        <img src={tegunov} alt="meaningful text" />
      </div>
      <div className="secondary">
        <img src={secondary} alt="meaningful text" />
      </div>
    </div>
  );
};

const DataDisplay = (props: any) => {
  return <div className="display">' "Data display"</div>;
};

export default withRouter(Display);
