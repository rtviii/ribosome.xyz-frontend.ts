import React from "react";
import VisualDisplay from "./VisualDisplay";
import DataDisplay from "./DataDisplay";
import "./Display.css";
import { withRouter, Switch, Route, Redirect } from "react-router";
import WorkspaceCatalogue from "./WorkspaceCatalogue";
import StructurePage from "./Structure/StructurePage";

const Display = () => {
  return (
    <div className="display">
      <Switch>
        <Route exact path="/">
          <Redirect to="/catalogue" />
        </Route>
        <Route exact path="/display" component={VisualDisplay} />
        <Route exact path="/data" component={DataDisplay} />
        <Route exact path="/catalogue" component={WorkspaceCatalogue} />
        <Route exact path="/catalogue/:pdbid" component={StructurePage} />
      </Switch>
    </div>
  );
};

export default withRouter(Display);
