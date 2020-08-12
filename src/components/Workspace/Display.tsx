import React from "react";
import VisualDisplay from "./VisualDisplay";
import DataDisplay from "./DataDisplay";
import "./Display.css";
import { withRouter, Switch, Route } from "react-router";
import WorkspaceCatalogue from "./WorkspaceCatalogue";


const Display = (props: any) => {
  return (
    <div className="display">


    <Switch>
      <Route path="/display"component={VisualDisplay} />
      <Route path="/data" component={DataDisplay} />
      <Route path="/" component={WorkspaceCatalogue}/>
    </Switch>
    </div>
  );
};

export default withRouter(Display);


