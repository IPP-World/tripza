import React, { useState } from "react";
import { Link } from "react-router-dom";
import khaltiLogo from "../assets/khaltiLogo.png";
import "../../node_modules/font-awesome/css/font-awesome.min.css";
import "./Navbar.css";
import { useSelector } from "react-redux";

function Navbar() {
  const [searchValue, setSearchValue] = useState("");
  const isAuthenticated = useSelector(state=>state.auth.isAuthenticated)

  function handleSearchChange(event) {
    setSearchValue(event.target.value);
  }

  function clearSearch() {
    setSearchValue("");
  }

  function search() {
    console.log(`Searching for: ${searchValue}`);
  }

  return (
    <div className="nav--container">
      <Link to="/">
        <img className="nav--logo" src={khaltiLogo} alt="Logo" />
      </Link>
      <div className="nav--search-container">
        <input
          className="nav--search"
          type="text"
          placeholder="&#xF002; Search for places/destinations"
          value={searchValue}
          onChange={handleSearchChange}
        />
        {searchValue && (
          <>
            <button className="nav--search-clear" onClick={clearSearch}>
              &#xD7;
            </button>
          </>
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
      {!isAuthenticated &&
      <div className="nav--signup_login">
        <Link className="nav--links" to="/login">
          Login
        </Link>{" "}
        |{" "}
        <Link className="nav--links" to="/signup">
          Signup
        </Link>
      </div>}
      {isAuthenticated && <Link className="nav--links" to="/profile">Profile</Link>}
    </div>
  );
}

export default Navbar;
