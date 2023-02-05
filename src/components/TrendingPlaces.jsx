import React,{useState} from "react";
import "./TrendingPlaces.css";
function TrendingPlaces(){
return(
<>
<div className="trending-bar">
<div className="trending-name">Trending Places</div>
<div className="trending-images">
        <ul>
                <li><img src='favicon.ico'alt=''/>
                <img src='favicon.ico' alt=''/>
                <img src='favicon.ico' alt=''/>
                <img src='favicon.ico' alt=''/></li>
              
        </ul>
</div>
</div>
  
</>);
}
export default TrendingPlaces;