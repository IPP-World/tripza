import React, { useState } from "react";
import { Link,useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import khaltiLogo from "../assets/khaltiLogo.png";
import "../../node_modules/font-awesome/css/font-awesome.min.css";
import "./Navbar.css";

function Navbar() {
  const [searchValue, setSearchValue] = useState("");
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location=useLocation();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/signup';

  if (hideNavbar) {
    return null; // Don't render the navbar
  }
  
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const clearSearch = () => {
    setSearchValue("");
  };

  const search = () => {
    console.log(`Searching for: ${searchValue}`);
  };

  const renderAuthLinks = () => {
    if (isAuthenticated) {
      return (
        <Link className="nav--links" to="/profile">
          Profile
        </Link>
      );
    } else {
      return (
        <div className="nav--signup-login">
          <Link className="nav--links" to="/login">
            Login
          </Link>{" "}
          |{" "}
          <Link className="nav--links" to="/signup">
            Signup
          </Link>
        </div>
      );
    }
  };

  return (
    <div className="nav--container">
      <Link to="/">
        <img className="nav--logo" src={khaltiLogo} alt="Logo" />
      </Link>
      <div className="nav--search-container">
        <input
          className="nav--search"
          type="text"
          placeholder="&#xf002; Search for places/destinations"
          value={searchValue}
          onChange={handleSearchChange}
        />
        {searchValue && (
          <button className="nav--search-clear" onClick={clearSearch}>
            &#xD7;
          </button>
        )}
      </div>
      <Link className="nav--links" to="/agencies">
        Agencies
      </Link>
      <Link className="nav--links" to="/hotels">
        Hotels
      </Link>
      <Link className="nav--links" to="/contribute">
        Contribute
      </Link>
      {renderAuthLinks()}
    </div>
  );
}

export default Navbar;
