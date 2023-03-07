import React from 'react'
function NearbyComponent(props) {
        return (
          <>
          <div className="nearbyhotels-section">
              <div className="nearbyhotels-card">
                <img src={props.Img} alt="hotel" className="hotels--image" /><br />
                <span className='nearbyhotels--name'>{props.name}</span>
                 <span className="hotelsnearby--address">{props.location}</span>
              </div>
              </div>
            </>
        );
}

export default NearbyComponent