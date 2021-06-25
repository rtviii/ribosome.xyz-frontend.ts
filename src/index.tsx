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
import { createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: green[500],
    },
  },

  transitions:{
  }

});



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
