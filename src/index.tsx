import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Main from "./components/Main";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { BrowserRouter as Router,  } from "react-router-dom";
import 'react-image-lightbox/style.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';

import 'react-app-polyfill/ie11'  
import 'react-app-polyfill/stable'

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <React.StrictMode>
        <Main/>
      </React.StrictMode>
    </Router>
  </Provider>,
  document.getElementById("root")
);
