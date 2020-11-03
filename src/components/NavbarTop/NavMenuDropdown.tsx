import React from "react";
import { Link } from "react-router-dom";
import "./NavMenuDropdown.css";



export interface NavDropdownParams{
  dropdownTitle: string;
  itemLinks:Array<{
    itemtext: string
    linkto  : string
  }>

}

const NavMenuDropdown:React.FC<NavDropdownParams> = (props) => {
  return (
    <div className="dropdown">
      <button className="dropbtn" >
        {props.dropdownTitle}
        <i className="fa fa-caret-down"></i>
      </button>
      <div className="dropdown-content">
        {props.itemLinks.map((item,i )=><Link key={i} to={item.linkto}>{item.itemtext}</Link>)}
      </div>
    </div>
  );
};

export default NavMenuDropdown;
