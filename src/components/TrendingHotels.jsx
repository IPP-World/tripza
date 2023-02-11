import React, { useState } from "react";
import "./TrendingPlaces.css";
function TrendingHotels(props) {
        return (
                  <div className="trending--places">
                    <div className="trending--card">
                      <img className="trending--image" src={props.Img} alt="place" />
                      <div className="trending--details">
                        <span className="trending--name">{props.name}</span>
                        <span className="trending--location">{props.location}</span>
                      </div>
                    </div>
                   </div>
              )
      }
export default TrendingHotels