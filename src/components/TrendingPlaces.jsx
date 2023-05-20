import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./TrendingPlaces.css";
import axios from "axios";

function TrendingPlaces(props) {
  return (
    <div className="trending--places">
      <div className="trending--card">
        <Link to="/placeinfo">
          <img className="trending--image" src={props.Img} alt="place" />
        </Link>
        <div className="trending--details">
          <span className="trending--name">{props.name}</span>
          <span className="trending--location">{props.location}</span>
        </div>
      </div>
    </div>
  );
}
export default TrendingPlaces;
