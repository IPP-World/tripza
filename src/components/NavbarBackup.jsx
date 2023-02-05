import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
function Navbar() {
  return (
    <div id="nav-container">
      <div className="navbar">
        <Link to="/" className="navbar-logo">
          Tripza<i className="fa-solid fa-plane-departure"></i>
        </Link>
      </div>
      <div className="search-bar">
        <div className="search-bar-text">
          Search for places, hotels and agencies
        </div>
        <button className="search-button">
          <i className="fa fa-magnifying-glass"></i>
        </button>
      </div>
      <div className="nav-access">
        <Link to="/agencies" className="agencies">
          Agencies
        </Link>
        <Link to="/hotels" className="hotels">
          Hotels
        </Link>
        <Link to="/contribute" className="contribute">
          Contribute
        </Link>
      </div>
      <div className="nav-profile">
        <Link to="/login">Login</Link> / <Link to="/signup">Signup</Link>
      </div>
    </div>
  );
}
export default Navbar;
