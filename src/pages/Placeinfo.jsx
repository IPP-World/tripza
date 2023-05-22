import React, { useState,useEffect } from "react";
import { CiShare1 } from "react-icons/ci";
import { BsBookmarkPlus } from "react-icons/Bs";
import { AiFillStar } from "react-icons/Ai";
import { GoVerified } from "react-icons/Go";
import { CgProfile } from "react-icons/Cg";

// import place from "../assets/place.jpg"
// import place2 from "../assets/Khumai2.jpg";
// import place1 from "../assets/Khumai1.jpg";
import Reviews from "./Reviews";
import HotelsNearby from "./HotelsNearby";
import AgenciesNearby from "./AgenciesNearby";
import "./PlaceInfo.css";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { useNavigate, useParams } from 'react-router-dom'; 
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMap,  LayersControl} from 'react-leaflet';




function PlaceInfo(props) {
  const [placeData, setPlaceData] = useState({});
  const [mapCenter, setMapCenter] = useState([28.390591999999998, 83.93487197222223]);
  const [images, setImages] = useState([])
  const [map, setMap] = useState(null)
  const [isVerified,setIsverified]=useState(false);
  
  // const [reviews, setReviews] = useState([])
  const {slug} = useParams()
    useEffect(()=>{
      map?.flyTo(mapCenter, 15)
    }, [mapCenter])
  async function getPlaceData() {
    const config = {
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    };
  
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/place/${slug}`, config);
      const data = await response.data;
  
      // Extract name and description
      const extractedData = data;
      
      const lat=Number(data.latitude);
      const lon=Number(data.longitude);
      const is= data.is_verified;
      setIsverified(is);
      setMapCenter([lat,lon]);
      setImages([...images, data.images.map(i=><img src={`http://localhost:8000${i.image}`}/>)])
      setPlaceData(extractedData);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // async function getReviews() {
  //   const config = {
  //     headers: {
  //       "Content-Type": "application/json",
  //       // Authorization: `Bearer ${localStorage.getItem("access")}`,
  //     },
  //   };
  
  //   try {
  //     console.log(slug);
  //     const response = await axios.get(`http://127.0.0.1:8000/api/place/${slug}/reviews/`, config);
  //     const data = await response.data;
  
  //     // Extract name and description
  //     const extractedData = data;
  //     console.log(extractedData);
  
  //    setReviews(extractedData);
  //   } catch (error) {
  //     console.log(error);
  //     throw error;
  //   }
  // }

  useEffect(() => {
    getPlaceData();
    
 
    //getReviews();
  }, []);

  const states = Object.freeze({
    REVIEWS: <Reviews slug={slug} closeModal={() => setCurrentState(states.NONE)} />,
    HOTELS: <HotelsNearby closeModal={() => setCurrentState(states.NONE)} />,
    AGENCIES: (
      <AgenciesNearby closeModal={() => setCurrentState(states.NONE)} />
    ),
    NONE: <></>,
  });

 const navigate=useNavigate();
 const handleAddService = async () => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
  };

  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/user/profile`, config);
    const data = response.data;

    // Extract name and description
    const subscribedata = data;
    console.log("data", subscribedata);
    if (subscribedata.is_subscribed==false){
              alert("you are not subscribed");
    }
    else{
    navigate('/addservices');}
  } catch (error) {
    console.log(error);
    throw error;
  }
};


  const [currentState, setCurrentState] = useState(states.NONE);
  return (
    <div className="PlaceInfo">
      {currentState}
      <div className="place--header">
        <div className="place--details">
          <h1 className="place--name">{placeData.name}</h1> 
          <h4 className="place--location">{placeData.location}</h4>
          
        </div>
      
        <div className="place--sharesave">
        
          <a href="#" className="place-share">
            <CiShare1 className="place-sharelogo" />
            Share
          </a>
          <a href="#" className="place-save">
            <BsBookmarkPlus className="place-savelogo" />
            Save
          </a>
        </div>
      </div>
      <span className="place--verification">{!isVerified?'': <span><GoVerified/> Verified</span>}</span>
      <div className="place--body">
        <div className="place--pic-map">
          <div className="place-pic">
            <AliceCarousel
              items={images[0]}
              // responsive={{ 0: { items: 1 }, 1024: { items: 2 } }}
              mouseTracking = {true}
              // touchTracking = {true}
              animationDuration={1000}
              autoPlay= {true}
              autoPlayInterval={3000}
              infinite = {true}
  
            >
            </AliceCarousel>
          </div>
          <div className="place-map">
          <MapContainer
            center={mapCenter}
            zoom={13}
            scrollWheelZoom={true}
            style={{ width: "100%", height: "100%", maxWidth: "600px", maxHeight: "500px" }}
            ref={setMap}
          >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Street View">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite View">
            <TileLayer
              url="http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
              maxZoom={20}
              subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        <Marker position={mapCenter} />
      </MapContainer>
            
            </div>
        </div>
        <div className="place--desc-reviews">
          <div className="place-desc">
            <p className="place-desc-p">
            {placeData.description}
            </p>
            {/* <div className="offers--container">
              <h1 className="place--offers">What this place offers</h1>
              <div className="place--offerlistbox">
                <span className="place--offerlist">Typical villages</span>
                <span className="place--offerlist">Mountain View</span>
                <span className="place--offerlist">Sunset and sunrise</span>
                <span className="place--offerlist">Snow</span>
                <span className="place--offerlist">Trekking trail</span>
                <span className="place--offerlist">Campfire</span>
              </div>
            </div> */}
            <div className="place--nearby">
              <button
                className="hotels--nearby"
                type="submit"
                onClick={() => setCurrentState(states.HOTELS)}
              >
                Hotels nearby
              </button>
              <button className="service--add-btn" onClick={handleAddService}>Add service</button>
            </div>
          </div>
          <div className="descreview-divider"></div>
          <div className="place-reviews">
            <div className="place--reviews-header">
              <span className="place--reviewhead">Reviews</span>
              <div className="place--ratings">
                <div className="place--ratings-stars">
                  <AiFillStar className="place-starlogo" />
                  <h6 className="place-outoffive">{placeData.rating}</h6>
                </div>
                <div className="place--userreview">
                  <div className="review--profile"><CgProfile/></div>
                  <div>
                  {placeData.c_review}
                  </div>
                  </div>
                <button
                  className="placeinfo--place--reviewbutton"
                  type="submit"
                  onClick={() => setCurrentState(states.REVIEWS)}
                >
                  More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceInfo;
