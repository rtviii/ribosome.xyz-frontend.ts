import React from "react";
import "./../styles/Main.css";
import Toolbar from "./Toolbar";
import Navbar from "./Navbar";
import Display from "./Display";
import {
  BrowserRouter as Router
,
} from "react-router-dom";



const Main = () => {
  return (
    <Router>
      <div className="main">
        <Navbar />
        <Toolbar />
        <Display/>
      </div>
    </Router>
  );
};

export default Main;

// <div>
//   <nav>
//     <ul>
//       <li>
//         <Link to="/">Home</Link>
//       </li>
//       <li>
//         <Link to="/products/1">First Product</Link>
//       </li>
//       <li>
//         <Link to="/products/2">Second Product</Link>
//       </li>
//     </ul>
//   </nav>
//   <Route path="/" exact component={Index} />
//   <Route path="/products/:id" component={Product} />
// </div>
