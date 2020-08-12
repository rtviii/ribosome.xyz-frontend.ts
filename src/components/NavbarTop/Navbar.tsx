import React from "react";
import { Link } from "react-router-dom";
import "./../../styles/Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar">
      <Link to="/">
        <div className="logo">
          <p className="logotext">Home</p>
        </div>
      </Link>

      <div className="navbar-controls">
        <form action="https://rtviii.github.io/ribosome.xyz-backend/APISHAPE.html">
          <button>API</button>
        </form>

        <form action="https://rtviii.github.io/ribosome.xyz-backend/">
          <button>Docs</button>
        </form>
        <button>Database</button>
        <button>Resources</button>
      </div>
    </div>
  );
};

export default Navbar;
