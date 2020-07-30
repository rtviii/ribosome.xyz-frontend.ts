import React, {  } from "react";
import "./../styles/Navbar.css";
import { Link,  } from "react-router-dom";
import riblogo from "./../static/3j9m.svg";
export const NavbarLogo = () => {
  return (
    <div className="navbar-logo">
      <img src={riblogo} alt="logo" />A Better Logo
    </div>
  );
};

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
