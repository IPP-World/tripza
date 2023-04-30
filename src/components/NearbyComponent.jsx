import React from 'react'
import"./NearbyComponent.css";
function NearbyComponent(props) {
        return (
          <>
          <div className="nearbyhotels-section">
              <div className="nearbyhotels-card">
                
                <span className='nearbyhotels--name'>{props.name}</span>
                 <span className="hotelsnearby--address">{props.location}</span>
                 <img src={props.Img} alt="hotel" className="hotels--image" /><br />
              </div>
              </div>
            </>
        );
}

export default NearbyComponent