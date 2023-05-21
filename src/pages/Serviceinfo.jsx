import React, { useState,useEffect } from "react";
import { CiShare1 } from "react-icons/ci";
import { BsBookmarkPlus } from "react-icons/Bs";
import { AiFillStar } from "react-icons/Ai";
import place from "../assets/place.jpg";
import place2 from "../assets/Khumai2.jpg";
import place1 from "../assets/Khumai1.jpg";
// import Reviews from "./Reviews";
import ServiceReviews from "./ServiceReviews";
import HotelsNearby from "./HotelsNearby";
import AgenciesNearby from "./AgenciesNearby";
import Book from "./Book";
import "./Serviceinfo.css";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { useNavigate, useParams } from 'react-router-dom'; 
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMap,  LayersControl} from 'react-leaflet';




function Serviceinfo(props) {
  const [serviceData, setServiceData] = useState({});
  const [mapCenter, setMapCenter] = useState([28.390591999999998, 83.93487197222223]);

  const {slug} = useParams()


  async function getServiceData() {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
  
    try {
      console.log(slug);
      const response = await axios.get(`http://127.0.0.1:8000/api/hotel/${slug}`, config);
      const data = await response.data;
      console.log(data);
  
      // Extract name and description
      const extractedData = data;
      const lat=Number(data.latitude);
      const lon=Number(data.longitude);
      console.log('datalatlon:',lat);
      console.log('datalatlon:',lon);

      setMapCenter([lat,lon]);

      console.log('data:',extractedData);
     setServiceData(extractedData);
   
    
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  useEffect(() => {
    getServiceData();
    
 
    //getReviews();
  }, []);

  const states = Object.freeze({
    REVIEWS: <ServiceReviews slug={slug} closeModal={() => setCurrentState(states.NONE)} />,
    BOOK: <Book closeModal={() => setCurrentState(states.NONE)} />,
   
    NONE: <></>,
  });

 const navigate=useNavigate();

  const carouselItems = [
    <img src={place}/>,
    <img src={place1}/>,
    <img src={place2}/>,
  ];

  const [currentState, setCurrentState] = useState(states.NONE);
  return (
    <div className="service--info">
      {/* {currentState} */}
      <div className="service--header">
        <div className="service--details">
          {/* <h1 className="place--name">{placeData.name}</h1>
          <h4 className="place--location">{placeData.location}</h4> */}
          <h1 className="service--name"></h1>
          <h4 className="service--location">Service provider's  location</h4>
        </div>
        <div className="service--sharesave">
        
          <a href="#" className="service-share">
            <CiShare1 className="service-sharelogo" />
            Share
          </a>
          <a href="#" className="service-save">
            <BsBookmarkPlus className="service-savelogo" />
            Save
          </a>
        </div>
      </div>
      <div className="place--body">
        <div className="place--pic-map">
          <div className="place-pic">
            <AliceCarousel
              items={carouselItems}
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
            {/* <p className="service--category-tag">Service category</p> */}
            {/* <p className="service--category-tag">{}</p> */}
            
            {/* {placeData.description} */}
            Service DescriptionService DescriptionService DescriptionService DescriptionService DescriptionService DescriptionService Description
            </p>
             <div className="offers--container">
              <h1 className="place--offers">Services provided</h1>
              <div className="place--offerlistbox">
                <span className="place--offerlist">Typical villages</span>
                <span className="place--offerlist">Mountain View</span>
                <span className="place--offerlist">Sunset and sunrise</span>
                <span className="place--offerlist">Snow</span>
                <span className="place--offerlist">Trekking trail</span>
                <span className="place--offerlist">Campfire</span>
              </div>
            </div>
            <div className="book--service-price">
              <button
                className="book-service"
                type="submit"
                onClick={() => setCurrentState(states.BOOK)}
              >
               Book service
              </button>
              <span>/Service price</span>
              {/* <span>{/Service price}</span> */}
            </div>
          </div>
          <div className="descreview-divider"></div>
          <div className="place-reviews">
            <div className="place--reviews-header">
              <span className="place--reviewhead">Reviews</span>
              <div className="place--ratings">
                <div className="place--ratings-stars">
                  <AiFillStar className="place-starlogo" />
                  {/* <h6 className="place-outoffive">{placeData.rating}</h6> */}
                  <h6 className="place-outoffive">Rating</h6>
                </div>
                <div className="place--userreview"></div>
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

export default Serviceinfo;
