import React from "react";
import { Link } from "react-router-dom";
import khaltiLogo from "../assets/khaltiLogo.png";
import '../../node_modules/font-awesome/css/font-awesome.min.css';
import "./Navbar.css";
function Navbar() {
  return (
    <div className="nav--container">
      <Link to="/"><img className="nav--logo" src={khaltiLogo} alt="Logo"/></Link>
      <input className="nav--search" type="text" placeholder="&#xF002; Search for places/destinations"/>
      <Link className="nav--links" to="/agencies">Agencies</Link>
      <Link className="nav--links" to="/hotels">Hotels</Link>
      <Link className="nav--links" to="/contribute">Contribute</Link>
      <div className="nav--signup_login">
        <Link className="nav--links" to="/login">Login</Link> | <Link className="nav--links" to="/signup">Signup</Link>
      </div>
    </div>
  );
}
export default Navbar;
