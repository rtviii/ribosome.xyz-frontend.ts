import React from                                   "react"                                      ;
import                                              "./Display.css"                              ;
import { withRouter, Switch, Route, Redirect } from "react-router"                               ;
import WorkspaceCatalogue from                      "./StructuresCatalogue"                      ;
import StructurePage from                           "./../StructurePage/StructurePage"           ;
import RPPage from                                  "./../RibosomalProteins/RPPage"              ;
import RPsCatalogue from                            "./../RibosomalProteins/RPsCatalogue"        ;
import LigandCatalogue from                         "./../Ligand/LigandCatalogue"                ;
import RNACatalogue from                            './../RNA/RNACatalogue'
// import Home from                                    './../../Home'
import { Home2 } from                                    './../../Home2'
import WorkInProgress from                          './../WorkInProgress'
import ProteinAlignment from                        './../ProteinAlign/ProteinAlignment'
// import RPClassification from                        './../RPClassification/RPClassification'
import VisualizationPage from                       '../../VisualizationPage/VisualizationPage'
import BindingSites from '../BindingSites/BindingSites'
import Nomenclature from "../Nomenclature";

const Display = () => {
  return (

    <div>
      <Route exact path="/">
        <Redirect to="/home" />
      </Route>

      <Switch>
        <Route exact path = "/super" component                        = {ProteinAlignment} />
        <Route exact path = "/home"                           component = {Home2               } />
        <Route exact path = "/structs"                        component = {WorkspaceCatalogue } />
        <Route exact path = "/structs/:pdbid"                 component = {StructurePage      } />
        <Route exact path = "/rps"                            component = {RPsCatalogue       } />
        <Route exact path = "/rps/:nom"                       component = {RPPage             } />
        <Route exact path = "/ligands"                        component = {LigandCatalogue    } />
        <Route exact path = "/ligands/:lig"                   component = {LigandCatalogue    } />
        <Route exact path = "/rnas/:rnaclass"                 component = {RNACatalogue       } />
        <Route exact path = "/rnas"                           component = {RNACatalogue       } />
        <Route exact path = "/bindingsites"                   component = {BindingSites         } />
        <Route exact path = "/vis"                            component = {VisualizationPage  } />
        <Route       path = "/nomenclature/:subcomponent?" component = {Nomenclature } />
        <Route render={() => <Redirect to="/home" />} />
      </Switch>
    </div>

  );
};

export default withRouter(Display);
