import React from "react";
import VisualDisplay from "./VisualDisplay";
import DataDisplay from "./DataDisplay";
import "./../../styles/Display.css";
import { withRouter, Switch, Route } from "react-router";


const Display = (props: any) => {
  return (
    <Switch>
      <Route  path="/display"component={VisualDisplay} />
      <Route path="/data" component={DataDisplay} />
    </Switch>
  );
};

export default withRouter(Display);


