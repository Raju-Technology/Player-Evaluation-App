import React from "react";
import { Link } from "react-router-dom";
import logo from "../Images/logo.png"

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <img src={logo} alt="technology garage logo"/>
      </div>
      <ul className="navbar__links">
        <li className="navbar__item">
          <Link to="/home" className="navbar__link">
            Home
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
