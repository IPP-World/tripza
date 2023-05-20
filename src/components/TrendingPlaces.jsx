import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./TrendingPlaces.css";
import axios from "axios";



function TrendingPlaces(props) {
  const [places, setPlaces] = useState([])

  async function getPlaceData() {
    const config = {
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    };
  
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/place/', config);
      const data = response.data;
      console.log(data);
  
      // Extract name and description
      const extractedData = data;
  
     setPlaces(extractedData);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  
        return (
                  <>
                  {places.map(place => {
                    return (
                      <div className="trending--places">
                    <div className="trending--card">
                     <Link to= "/placeinfo"><img className="trending--image" src={place.Img} alt="place" /></Link>
                      <div className="trending--details">
                        <span className="trending--name">{place.name}</span>
                        <span className="trending--location">{place.location}</span>
                      </div>
                    </div>
                   </div>
                    )
                  })}                  
                  </>
              )
      }
export default TrendingPlaces
