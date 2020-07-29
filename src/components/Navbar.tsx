import React, { useState } from "react";
import "./../styles/Navbar.css";
import { Link, withRouter } from "react-router-dom";
import riblogo from "./../static/3j9m.svg";
import Select from "react-dropdown-select";
import Docs from "./DocumentationPages/Docs";

export const NavbarLogo = () => {
  return (
    <div className="navbar-logo">
      <img src={riblogo} alt="logo" />A Better Logo
    </div>
  );
};

const DocsOptions = [{ id: "doc1" }, { id: "doc1" }];
const Navbar = () => {
  return (
    <div className="navbar">
      <NavbarLogo />
      <div className="navbar-controls">
        <button>API</button>
        <Link to="./docs">
          <button>Docs</button>
        </Link>
        <button>Database</button>
        <button>Resources</button>
      </div>
    </div>
  );
};

export default Navbar;
