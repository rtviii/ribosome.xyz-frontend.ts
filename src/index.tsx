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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';



const origin_blue       = '#aad5ff'
const prediction_yellow = 'fff8bd'

let theme = createTheme({

  palette: {
    primary: {
      main: '#0052cc',
    },
    secondary: {
      main: '#edf2ff',
    },
  },

  typography: {
    fontFamily: "'Montserrat', sans-serif",
      button:{
    fontSize:'4rem'
  }
  },

});

export const DefaultTheme = createTheme(theme,{
 palette: {
    info: {
      main: theme.palette.secondary.main,
    },
  },
});



ReactDOM.render(
  <Provider store={store}>
    <Router>
      <React.StrictMode>
          <ThemeProvider theme={DefaultTheme}>
          <Main/>
          </ThemeProvider>
      </React.StrictMode>
    </Router>
  </Provider>,
  document.getElementById("root")
);
