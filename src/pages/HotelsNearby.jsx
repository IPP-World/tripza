import React,{useEffect, useState} from 'react'
import {AiOutlineClose} from 'react-icons/Ai'
import NearbyComponent from '../components/NearbyComponent';
import "./HotelsNearbynew.css"
import axios from 'axios';

function HotelsNearby({slug,closeModal}) {
  const [nearbyData,setNearbyData]=useState([]);

  async function getNearbyData(){
     const Slug=slug;
     const config = {
      headers: {
        "Content-Type": "application/json"
      },
    };
         try{
          const response= await axios.get(`http://127.0.0.1:8000/api/place/${Slug}/nearby-hotels/`,config);
          const data=response.data;
          setNearbyData(data);
          console.log('nearby data:',nearbyData);
         }
         catch(error){
          console.log(error);
         }
    }
    useEffect(() => {
      getNearbyData();
    }, []);

    const nearbySection = nearbyData.map((near) => {
        return (
          <NearbyComponent
            key={near.id}
            Img={near.images}
            name={near.name}
            location={near.location}
            slug={near.slug}
          />
        );
      });
      return(<>
         <div className="hotelsnearby-wrapper" onClick={closeModal}></div>
         <div className="hotelsnearby-container">
         <button className="nearbyclose--btn" onClick={closeModal}><AiOutlineClose/></button>
         <span className='nearby--name'>Hotels Nearby</span>
         {nearbySection}</div>
       </>);
}

export default HotelsNearby