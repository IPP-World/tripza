import React,{useState} from 'react'
import {AiOutlineClose} from 'react-icons/Ai'
import NearbyData from '../components/NearbyData';
import NearbyComponent from '../components/NearbyComponent';
import "./HotelsNearby.css"
function HotelsNearby({closeModal}) {
    const nearbySection = NearbyData.map((near) => {
        return (
          <NearbyComponent
            key={near.id}
            Img={near.Img}
            name={near.name}
            location={near.location}
          />
        );
      });
      return(<>
         <div className="hotelsnearby-wrapper"></div>
         <div className="hotelsnearby-container">
         <button className="nearbyclose--btn" onClick={closeModal}><AiOutlineClose/></button>
         <span className='nearby--name'>Hotels Nearby</span>
         {nearbySection}</div>
       </>);
}

export default HotelsNearby