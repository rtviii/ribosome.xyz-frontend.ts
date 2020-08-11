import React from "react";
import "./../../styles/Navbar.css";
import riblogo from "./../../static/3j9m.svg";
// export const NavbarLogo = () => {
//   return (
//     <div className="navbar-logo">
//       <img src={riblogo} alt="logo" />A Better Logo
//     </div>
//   );
// };

const Navbar = () => {
  return (
    <div className="navbar">
      {/* <NavbarLogo /> */}
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
