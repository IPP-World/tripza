import React,{useState} from 'react'
import {AiOutlineClose} from 'react-icons/Ai'
import NearbyData from '../components/NearbyData';
import NearbyComponent from '../components/NearbyComponent';
import "./agenciesnearby.css"
function AgenciesNearby({closeModal}) {
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
         <div className="agenciesnearby-wrapper"></div>
         <div className="agenciesnearby-container">
         <button className="nearbyclose--btn" onClick={closeModal}><AiOutlineClose/></button>
         <span className='nearby--name'>Agencies Nearby</span>
         {nearbySection}</div>
       </>);
}

export default AgenciesNearby