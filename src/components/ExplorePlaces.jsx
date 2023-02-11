import React,{useState} from "react";
import "./ExplorePlaces.css";
function ExplorePlaces(otherplaces){
        return (
                <div className="explore--places">
                  <div className="explore--card">
                    <img className="explore--image" src={otherplaces.Img} alt="place" />
                    <div className="explore--details">
                      <span className="explore--name">{otherplaces.name}</span>
                      <span className="explore--location">{otherplaces.location}</span>
                    </div>
                  </div>
                 </div>
            )
}
export default ExplorePlaces