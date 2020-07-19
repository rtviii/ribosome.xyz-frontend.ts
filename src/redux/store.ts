import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk, { ThunkMiddleware } from "redux-thunk";
import { homologsReducer } from "./reducers/homologsReducer";
import {leverReducer} from './reducers/leverReducer'
import logger, { createLogger } from 'redux-logger'
const custom_logger = createLogger({
    // 
})


export const rootReducer = combineReducers({
  homologs: homologsReducer,
  leverstate: leverReducer
});

export type AppState = ReturnType<typeof rootReducer>;

export const store = createStore(
  rootReducer,
  applyMiddleware(thunk as ThunkMiddleware, logger)
);
