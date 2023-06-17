import { useState } from "react";
import { FaSearch } from "react-icons/Fa";

import "./SearchBar.css";

export const SearchBar = ({ setPlaceResult,setServiceResult }) => {
  const [placeinput, setPlaceInput] = useState("");
  const [serviceinput, setServiceInput] = useState("");


  const fetchPlaceData = (value) => {
    fetch("http://127.0.0.1:8000/api/place/show/")
      .then((response) => response.json())
      .then((json) => {
        const results = json.filter((place) => {
          return (
            value &&
            place &&
            place.name &&
            place.name.toLowerCase().includes(value.toLowerCase())
          );
        });
        setPlaceResult(results);
      });
  };
  const fetchServiceData = (value) => {
    fetch("http://127.0.0.1:8000/api/hotel/show/")
      .then((response) => response.json())
      .then((json) => {
        const results = json.filter((service) => {
          return (
            value &&
            service &&
            service.name &&
            service.name.toLowerCase().includes(value.toLowerCase())
          );
        });
        setServiceResult(results);
      });
  };


  const handlePlaceChange = (value) => {
    setPlaceInput(value);
    fetchPlaceData(value);
  };
  const handleServiceChange = (value) => {
    setServiceInput(value);
    fetchServiceData(value);
  };


  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input
        placeholder="Type to search place..."
        value={placeinput}
        onChange={(e) => handlePlaceChange(e.target.value)}
      />
      <input
        placeholder="Type to search services..."
        value={serviceinput}
        onChange={(e) => handleServiceChange(e.target.value)}
      />
    </div>
  );
};