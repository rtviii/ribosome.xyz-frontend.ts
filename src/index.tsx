import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Main from "./components/Main";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { BrowserRouter as Router,  } from "react-router-dom";

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <React.StrictMode>
        <Main />
      </React.StrictMode>
    </Router>
  </Provider>,
  document.getElementById("root")
);
