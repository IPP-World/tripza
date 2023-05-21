import React,{useState} from "react";
import { Link } from "react-router-dom";
import "./ExplorePlaces.css";
function ExplorePlaces(otherplaces){
        return (
                <div className="explore--places">
                  <div className="explore--card">
                    <Link to={`placeinfo/${otherplaces.slug}`}>
                    <img className="explore--image" src={`http://localhost:8000/${otherplaces.Img?.image}`} alt="place" />
                    </Link>
                    <div className="explore--details">
                      <span className="explore--name">{otherplaces.name}</span>
                      <span className="explore--location">{otherplaces.location}</span>
                    </div>
                  </div>
                 </div>
            )
}
export default ExplorePlaces