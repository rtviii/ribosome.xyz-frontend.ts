import React from "react";
import VisualDisplay from "./VisualDisplay";
import DataDisplay from "./DataDisplay";
import "./../styles/Display.css";
import { withRouter, Switch, Route } from "react-router";
import Docs from "./DocumentationPages/Docs";


const Display = (props: any) => {
  return (
    <Switch>
      <Route  path="/display"component={VisualDisplay} />
      <Route path="/data" component={DataDisplay} />
      <Route path="/docs" component={Docs}/>
      <Route path="/api-shape" component={Docs}/>
    </Switch>
  );
};

export default withRouter(Display);
