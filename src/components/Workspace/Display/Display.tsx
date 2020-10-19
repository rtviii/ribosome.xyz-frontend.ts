import React from "react";
import VisualDisplay from "./VisualDisplay";
import "./Display.css";
import { withRouter, Switch, Route, Redirect } from "react-router";
import WorkspaceCatalogue from "./WorkspaceCatalogue";
import StructurePage from "./../StructurePage/StructurePage";
import RPPage from "./../RibosomalProteins/RPPage";
import RPsCatalogue from "./../RibosomalProteins/RPsCatalogue";
import LigandCatalogue from "./../Ligand/LigandCatalogue";
import RNACatalogue from './../RNA/RNACatalogue'

const Display = () => {
  return (
    <div className="display">
      <Route exact path="/">
        <Redirect to="/catalogue" />
      </Route>
      <Switch>
        <Route exact path = "/display" component          = {VisualDisplay} />
        <Route exact path = "/catalogue" component        = {WorkspaceCatalogue} />
        <Route exact path = "/catalogue/:pdbid" component = {StructurePage} />
        <Route exact path = "/rps" component              = {RPsCatalogue} />
        <Route exact path = "/rps/:nom" component         = {RPPage} />
        <Route exact path = "/ligands" component          = {LigandCatalogue} />
        <Route exact path = "/rnas" component             = {RNACatalogue} />
      </Switch>
    </div>
  );
};

export default withRouter(Display);
