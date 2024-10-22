import React, { useState, useEffect } from "react";
import { Link,useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../assets/logo.png";
import "../../node_modules/font-awesome/css/font-awesome.min.css";
import "./Navbar.css";
import { SearchBar } from "./SearchBar";
import { SearchResultsList } from "./SearchResultList";


function Navbar() {
  const [placeResult, setPlaceResult] = useState([]);
  const [serviceResult, setServiceResult] = useState([]);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location=useLocation();
 
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.nav--container');
      if (navbar) {
        if (window.pageYOffset > 0) {
          navbar.classList.add('sticky');
        } else {
          navbar.classList.remove('sticky');
        }
      }
    };
  
    window.addEventListener('scroll', handleScroll);
  
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const hideNavbar = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/reset-password';

  if (hideNavbar) {
    return null; 
  }

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
  
  const handlePlaceResultClick = (slug) => {
    navigateToPlace(slug);
  };

  const handleServiceResultClick = (slug) => {
   navigateToService(slug);
  };

  const navigateToPlace = (slug) => {
    window.location.href = `/placeinfo/${slug}`;
  };

  const navigateToService = (slug) => {
   window.location.href = `/hotels/serviceinfo/${slug}`;
  };

  return (
    <div className="nav--container">
      <Link to="/">
        <img className="nav--logo" src={logo} alt="Logo" />
      </Link>
      <div className="nav--search">
      <SearchBar setPlaceResult={setPlaceResult} setServiceResult={setServiceResult} />
      <SearchResultsList className='search---result' results={placeResult} handleClick={handlePlaceResultClick}/>
      <SearchResultsList className='search---result' results={serviceResult} handleClick={handleServiceResultClick}/>
      </div>
      <Link className="nav--links" to="/hotels">
        Services
      </Link>
      <Link className="nav--links" to="/contribute">
        Contribute
      </Link>
      <Link className="nav--links" to="/map">
        Map
      </Link>
      {renderAuthLinks()}
    </div>
  );
}

export default Navbar;
