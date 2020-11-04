import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import NavMenuDropdown from './NavMenuDropdown'
import {NavDropdownParams} from './NavMenuDropdown'


const Navbar = () => {

  const Resources:NavDropdownParams = {

    dropdownTitle: "Resources",
    itemLinks: [
      {itemtext: "Structures", linkto:'/catalogue'},
      {itemtext: "Ribosomal Proteins", linkto:'/rps'},
      {itemtext: "Ligands", linkto:'/ligands'},
      {itemtext: "rRNA", linkto:'/rnas'},
    ]
  }

  const Tools:NavDropdownParams = {
    dropdownTitle: "Analytics",
    itemLinks: [
      {itemtext: "Exit Tunnel", linkto:'/' },
      {itemtext: "Classification", linkto:'/' },
      {itemtext: "Conservation Metrics", linkto:'/'},
      {itemtext: "Binding Interfaces", linkto:'/interfaces'},
      {itemtext: "Conformations", linkto:'/'},
    ]
  }
  return (
    <div className="navbar">
      <div className="navbar-controls">
        <Link to='/home'>       <NavMenuDropdown {...{dropdownTitle:'Home', itemLinks:[]}}/></Link>
        <NavMenuDropdown {...Resources}/>
        <NavMenuDropdown {...Tools}/>
      </div>
    </div>
  );
};

export default Navbar;
