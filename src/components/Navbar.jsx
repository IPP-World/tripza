import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
function Navbar() {
  return (
    <div className="nav-container">
      <Link to="/">Tripza</Link>
      <input  className="logo" type="text" onSubmit={()=>{console.log("Submitting")}} placeholder="Search for places/destinations"/>
      <Link to="/agencies">Agencies</Link>
      <Link to="/hotels">Hotels</Link>
      <Link to="/contribute">Contribute</Link>
      <div>
        <Link to="/login">Login</Link> / <Link to="/signup">Signup</Link>
      </div>
    </div>
  );
}
export default Navbar;
