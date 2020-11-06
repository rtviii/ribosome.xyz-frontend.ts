import React from "react";
import "./Display.css";
import { withRouter, Switch, Route, Redirect } from "react-router";
import WorkspaceCatalogue from "./WorkspaceCatalogue";
import StructurePage from "./../StructurePage/StructurePage";
import RPPage from "./../RibosomalProteins/RPPage";
import RPsCatalogue from "./../RibosomalProteins/RPsCatalogue";
import LigandCatalogue from "./../Ligand/LigandCatalogue";
import RNACatalogue from './../RNA/RNACatalogue'
import Interfaces from './../Analytics/Interfaces'
import Home from './../../Home'

const Display = () => {
  return (
    <div className="display">
      <Route exact path="/">
        <Redirect to="/home" />
      </Route>
      <Switch>
        <Route exact path = "/home" component                         = {Home} />
        <Route exact path = "/catalogue" component                    = {WorkspaceCatalogue} />
        <Route exact path = "/catalogue/:pdbid" component             = {StructurePage} />
        <Route exact path = "/rps" component                          = {RPsCatalogue} />
        <Route exact path = "/rps/:nom" component                     = {RPPage} />
        <Route exact path = "/ligands" component                      = {LigandCatalogue} />
        <Route exact path = "/rnas" component                         = {RNACatalogue} />
        <Route exact path = "/interfaces" component                   = {Interfaces} />
        <Route exact path = "/interfaces/:struct/:type/:id" component = {Interfaces} />
      </Switch>
    </div>
  );
};

export default withRouter(Display);
