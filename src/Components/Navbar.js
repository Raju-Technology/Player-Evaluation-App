import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../Images/logo.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const closeNavbar = () => {
    setIsOpen(false);
  };

  return (
    <nav className={`navbar ${isOpen ? "open" : ""}`}>
      <div className="navbar__logo">
        <img src={logo} alt="technology garage logo" />
      </div>
      <button className="navbar__toggle" onClick={toggleNavbar}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </button>
      <ul className={`navbar__links ${isOpen ? "open" : ""}`}>
        <li className="navbar__item" onClick={closeNavbar}>
          <Link to="/" className="navbar__link">
            Home
          </Link>
        </li>
        <li className="navbar__item" onClick={closeNavbar}>
          <Link to="/learningpathway" className="navbar__link">
            Learning Pathways
          </Link>
        </li>
        <li className="navbar__item" onClick={closeNavbar}>
          <Link to="/studio" className="navbar__link">
            Our Studio
          </Link>
        </li>
        <li className="navbar__item" onClick={closeNavbar}>
          <Link to="/form" className="navbar__link">
            Form
          </Link>
        </li>
        <li className="navbar__item" onClick={closeNavbar}>
          <Link to="/dashboard" className="navbar__link">
            Dashboard
          </Link>
        </li>
        <li className="navbar__item" onClick={closeNavbar}>
          <Link to="/registration" className="navbar__link">
            Registration
          </Link>
        </li>
        <li className="navbar__item" onClick={closeNavbar}>
          <Link to="/login" className="navbar__link">
            Login
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
