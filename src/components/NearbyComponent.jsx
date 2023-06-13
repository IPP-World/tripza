import React from 'react';
import './NearbyComponent.css';
import { useNavigate } from 'react-router-dom';

function NearbyComponent(props) {
  const navigate = useNavigate();
  
  const handlenearby = (slug) => {
    navigate(`/hotels/serviceinfo/${slug}`);
  };

  return (
    <div className="nearbyhotels-section" onClick={() => handlenearby(props.slug)}>
      <div className="nearbyhotels-card">
        <span className="nearbyhotels--name">{props.name}</span>
        <span className="hotelsnearby--address">{props.location}</span>
        <div className="hotelsnearby--image">
          {props.Img &&
            props.Img.map((img, index) => (
              <img key={index} src={`http://localhost:8000${img.image}`} alt="hotel" className="hotels--image" />
            ))}
        </div>
      </div>
    </div>
  );
}

export default NearbyComponent;
