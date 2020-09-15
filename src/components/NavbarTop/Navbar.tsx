import React from "react";
import { Link } from "react-router-dom";
import "./../../styles/Navbar.css";
import SearchBox from './SearchBox'

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="categories">
        <div>
          <Link to="/catalogue">Structures</Link>
        </div>
        <div>
          <Link to="/rps">Proteins</Link>
        </div>
      </div>
      <SearchBox/>
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
