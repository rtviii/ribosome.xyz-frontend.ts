import        { createStore        , combineReducers, applyMiddleware } from "redux"                                         ;
import thunk, { ThunkMiddleware                                       } from "redux-thunk"                                   ;
import        { createLogger                                          } from "redux-logger"                                  ;
import        { _StructuresReducer                                    } from "./reducers/StructuresReducer/StructuresReducer";
import        { FiltersReducer                                        } from "./reducers/Filters/FiltersReducer"             ;
import        { ProteinsReducer                                       } from "./reducers/Proteins/ProteinsReducer"           ;
import        { RNAReducer                                            } from "./reducers/RNA/RNAReducer"                     ;
import        { LigandsReducer                                        } from "./reducers/Ligands/LigandsReducer"             ;
import        { UtilitiesReducer                                      } from "./reducers/Utilities/UtilitiesReducer"
import        { InterfaceReducer                                      } from "./reducers/Interface/InterfaceReducer"
import        { CartReducer                                           } from "./reducers/Cart/CartReducer"
import        { VisualizationReducer                                           } from "./reducers/Visualization/VisualizationReducer"
import        { BindingSitesReducer                                   } from "./reducers/BindingSites/BindingSitesReducer"
import        { AppActions                                            } from "./AppActions"                                  ;
import { REQUEST_STRUCTS_GO, REQUEST_STRUCTS_SUCCESS, STRUCTS_SORT_CHANGE } from "./reducers/StructuresReducer/ActionTypes";
import { CURRENT_LIGAND_CHANGE, CURRENT_PREDICTION_CHANGE, CURRENT_STRUCTURE_CHANGE, LIGAND_BINDING_SITE_SUCCESS, LIGAND_PREDICTION_SUCCESS, PARTIAL_STATE_CHANGE, REQUEST_ALL_BSITES_GO, REQUEST_ALL_BSITES_SUCCESS, REQUEST_LIGAND_BINDING_SITE, REQUEST_LIGAND_PREDICTION } from "./reducers/BindingSites/ActionTypes";
import { REQUEST_ALL_LIGANDS_GO, REQUEST_ALL_LIGANDS_SUCCESS } from "./reducers/Ligands/ActionTypes";
import { REQUEST_BAN_METADATA_GO, REQUEST_BAN_METADATA_SUCCESS } from "./reducers/Proteins/ActionTypes";
import { REQUEST_STATIC_CATALOGUE } from "./reducers/Utilities/ActionTypes";
import { REQUEST_RNA_CLASS_ERR, REQUEST_RNA_CLASS_GO, REQUEST_RNA_CLASS_SUCCESS } from "./reducers/RNA/ActionTypes";
import { STRUCTURE_CHANGE } from "./reducers/Visualization/ActionTypes";

const collapseFilter = (action: any) => {
  var toFilter  =  ["PARTIAL_STATE_CHANGE"];
  return !toFilter.includes(action!.type);
};

const logger = createLogger({
  predicate: (getState, action:AppActions) =>  ![
  // STRUCTURE_CHANGE,
  // STRUCTURE_CHANGE,
  // CURRENT_STRUCTURE_CHANGE,
  // CURRENT_LIGAND_CHANGE,
  // REQUEST_LIGAND_BINDING_SITE,
  // LIGAND_BINDING_SITE_SUCCESS,
  // CURRENT_PREDICTION_CHANGE,
  // PARTIAL_STATE_CHANGE,
  // REQUEST_LIGAND_PREDICTION,
  // LIGAND_PREDICTION_SUCCESS,
  // REQUEST_STRUCTS_GO           ,,
  // REQUEST_ALL_LIGANDS_GO       ,,
  // REQUEST_BAN_METADATA_GO      ,,
  // REQUEST_ALL_BSITES_GO        ,,
  // REQUEST_RNA_CLASS_GO         ,
  // REQUEST_STATIC_CATALOGUE     ,
  // REQUEST_BAN_METADATA_SUCCESS ,
  // REQUEST_ALL_LIGANDS_SUCCESS  ,
  // REQUEST_BAN_METADATA_SUCCESS ,
  // REQUEST_RNA_CLASS_SUCCESS    ,
  // REQUEST_ALL_BSITES_SUCCESS   ,
  // REQUEST_RNA_CLASS_SUCCESS    ,
  // REQUEST_STRUCTS_SUCCESS      ,
  // STRUCTS_SORT_CHANGE          ,
  // REQUEST_RNA_CLASS_SUCCESS    ,
  // REQUEST_RNA_CLASS_ERR        ,
  "ANY"
].includes( action.type ) ,
   collapsed: collapseFilter });

export const rootReducer = combineReducers({
  visualization: VisualizationReducer,
  filters      : FiltersReducer,
  structures   : _StructuresReducer,
  proteins     : ProteinsReducer,
  rna          : RNAReducer,
  ligands      : LigandsReducer,
  utils        : UtilitiesReducer,
  Interface    : InterfaceReducer,
  cart         : CartReducer,
  binding_sites: BindingSitesReducer
});

export type AppState = ReturnType<typeof rootReducer>;

export const store = 
createStore(
  rootReducer,
  applyMiddleware(thunk as ThunkMiddleware, logger)
);
