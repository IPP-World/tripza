import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./TrendingPlaces.css";

function TrendingPlaces(trendingplaces) {
  return (
    <div className="trending--places">
      <div className="trending--card">
      <Link to={`placeinfo/${trendingplaces.slug}`}>
          <img className="trending--image" src={`http://localhost:8000/${trendingplaces.Img?.image}`} alt="place" />
        </Link>
        <div className="trending--details">
          <span className="trending--name">{trendingplaces.name}</span>
          <span className="trending--location">{trendingplaces.location}</span>
        </div>
      </div>
    </div>
  );
}
export default TrendingPlaces;
