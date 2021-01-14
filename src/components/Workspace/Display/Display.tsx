import React from "react";
import "./Display.css";
import { withRouter, Switch, Route, Redirect } from "react-router";
import WorkspaceCatalogue from "./StructuresCatalogue";
import StructurePage from "./../StructurePage/StructurePage";
import RPPage from "./../RibosomalProteins/RPPage";
import RPsCatalogue from "./../RibosomalProteins/RPsCatalogue";
import LigandCatalogue from "./../Ligand/LigandCatalogue";
import RNACatalogue from './../RNA/RNACatalogue'
import Interfaces from './../Analytics/Interfaces'
import Home from './../../Home'
import ExitTunnelPage from './../ExitTunnel/ExitTunnelPage'
import WorkInProgress from './../WorkInProgress'
import  ProteinAlignment from './../ProteinAlign/ProteinAlignment'
const Display = () => {
  return (
    <div className="display">
      <Route exact path="/">
        <Redirect to="/home" />
      </Route>

      <Switch>
        {/* <Route exact path = "/mat_structures" component                         = {StructurePage} /> */}
        <Route exact path = "/rpalign" component                         = {ProteinAlignment} />
        <Route exact path = "/home" component                         = {Home} />

        <Route exact path = "/structs" component                      = {WorkspaceCatalogue} />
        <Route exact path = "/structs/:pdbid" component               = {StructurePage} />

        <Route exact path = "/rps" component                          = {RPsCatalogue} />
        <Route exact path = "/rps/:nom" component                     = {RPPage} />

        <Route exact path = "/ligands" component                      = {LigandCatalogue} />
        <Route exact path = "/ligands/:lig" component                 = {LigandCatalogue} />

        <Route exact path = "/rnas" component                         = {RNACatalogue} />

        <Route exact path = "/interfaces" component                   = {Interfaces} />
        <Route exact path = "/interfaces/:struct/:type/:id" component = {Interfaces} />

        <Route exact path = "/tunnel"                      component  = {ExitTunnelPage} />

        <Route exact path = "/classify"                     component= {WorkInProgress} />
        <Route exact path = "/rpnomenclature"               component= {WorkInProgress} />
        <Route exact path = "/conservation"                 component= {WorkInProgress} />
        <Route exact path = "/rxzgraph"                     component= {WorkInProgress} />
      </Switch>
    </div>
  );
};

export default withRouter(Display);
