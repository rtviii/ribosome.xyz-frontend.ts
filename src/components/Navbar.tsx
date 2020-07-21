import React from "react";
import "./../styles/Navbar.css";
import riblogo from "./../static/3j9m.svg";

export const NavbarLogo = () => {
  return (
    <div className="navbar-logo">
      <img src={riblogo} alt="logo" />
    Some name
    </div>
  );
};

const Navbar = () => {
  return (
    <div className="navbar">
      <NavbarLogo />
      <div className="navbar-controls">
        <button>API</button>
        <button>Docs</button>
        <button>Database</button>
        <button>Resources</button>
      </div>
    </div>
  );
};

export default Navbar;
