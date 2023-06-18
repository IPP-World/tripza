import React, { useState,useEffect } from "react";
import { CiShare1 } from "react-icons/ci";
import { BsBookmarkPlus } from "react-icons/Bs";
import { AiFillStar,AiOutlineClose } from "react-icons/Ai";
import ServiceReviews from "./ServiceReviews";
import Book from "./Book";
import "./Serviceinfo.css";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { useParams,useNavigate } from 'react-router-dom'; 
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMap,LayersControl} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

import currentLocationIcon from '../assets/current-location-icon.png'
import serviceicon from '../assets/service-icon.png';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';


function RoutingControl({ mapCenter, curlat, curlon }) {
  const currentIcon = L.icon({
    iconUrl: currentLocationIcon,
    iconSize: [32, 32],
  });

  const goalIcon = L.icon({
    iconUrl: serviceicon,
    iconSize: [32, 32],
  });

  const map = useMap();
  const current = L.latLng(curlat, curlon);
  const goal = L.latLng(mapCenter[0], mapCenter[1]);

  useEffect(() => {
    if (curlat && curlon) {
      L.Routing.control({
        waypoints: [current, goal],
        createMarker: function (i, waypoint, n) {
          var marker_icon = null;
          if (i === 0) {
            marker_icon = currentIcon;
          } else if (i === n - 1) {
            marker_icon = goalIcon;
          }

          var marker = L.marker(waypoint.latLng, {
            draggable: false,
            bounceOnAdd: true,
            bounceOnAddOptions: {
              duration: 1000,
              height: 800,
            },
            icon: marker_icon,
          });

          return marker;
        },
      }).addTo(map);
    }
   else{
    return ;
   }
  }, [map, mapCenter, curlat, curlon]);

  return null;
}



function Serviceinfo(props) {
  const [serviceData, setServiceData] = useState({});
  const [mapCenter, setMapCenter] = useState([28.390591999999998, 83.93487197222223]);
  const [images, setImages] = useState([])
  const [map, setMap] = useState(null)
  const [curlat,setCurlat]=useState(null);
  const [curlon,setCurlon]=useState(null);
  const [showMap, setShowMap] = useState(false);
  const {slug} = useParams();
  const navigate=useNavigate();
  const [myserviceflag,setMyserviceFlag] = useState(false);
  const [ownername,setOwnerName] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/hotel/my-hotels/",
          {
            headers: {
              "Content-Type": "application/form-data",
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );
        const Mydata = response.data;
        console.log("mydata:", Mydata);
        const myslug = Mydata.map((item) => item.slug);
        console.log("myslug", myslug);
        let flag = false;
        for (let i = 0; i < myslug.length; i++) {
          if (myslug[i] === slug) {
            flag = true;
            break;
          }
        }
        console.log(flag);
        setMyserviceFlag(flag);
        console.log("serviceownerflag:", myserviceflag);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData().catch((error) => console.error(error));
  }, []);



  
  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const position = await getCurrentPosition();
        const { latitude, longitude } = position.coords;
        setCurlat(latitude);
        console.log('curlat:',curlat);
  
        setCurlon(longitude);
      } catch (error) {
        console.error(error);
      }
    };
  
    getUserLocation()
  }, []);
  
  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 100000,
        maximumAge: 0
      });
    });
  };
  

  useEffect(()=>{
    map?.flyTo(mapCenter, 15)
  }, [mapCenter])
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

      const extractedData = data;
      setOwnerName(extractedData.owner_name);
      const lat=Number(data.latitude);
      const lon=Number(data.longitude);
      console.log('datalatlon:',lat);
      console.log('datalatlon:',lon);

      setMapCenter([lat,lon]);

      console.log('data:',extractedData);
      setServiceData(extractedData);
      console.log(serviceData);
      setImages([...images, data.images.map(i=><img src={`http://localhost:8000${i.image}`}/>)])
    
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
     BOOK: <Book slug={slug} closeModal={() => setCurrentState(states.NONE)} />,
   
    NONE: <></>,
  });

  const [currentState, setCurrentState] = useState(states.NONE);

  const handlemapclick=()=>{
    console.log('map clicked');
    setShowMap(true);
  }

  const Popup = () => (
    <>
      <div className="map-wrapper"  onClick={() => setShowMap(false)}></div>
      <div className="map-container">
        <div
          className="map--close-btnn"
          onClick={() => setShowMap(false)}
        >
          <AiOutlineClose />
        </div>
        <MapContainer
            center={mapCenter}
            zoom={13}
            scrollWheelZoom={true}
            style={{ width: "100%", height: "100%", maxWidth: "1000px", maxHeight: "1000px" }}
           
            // ref={setMap}  
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
        <RoutingControl mapCenter={mapCenter} curlat={curlat} curlon={curlon} />
      </MapContainer>     
      </div>
    </>
  );
  const handleEditClick = () => {
    navigate(`/editservice/${slug}`);
  };

  return (
    <div className="service--info">
       {currentState}
      <div className="service--header">
        <div className="service--details">
          <h1 className="service--name">{serviceData.name}</h1>
          <h4 className="service--location">{serviceData.location}</h4>
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
            <div className="view-map">
          <button className="map--button" onClick={handlemapclick}>View full map</button>
          {showMap && <Popup/>}
        </div>
        </div>
        <div className="place--desc-reviews">
          <div className="place-desc">
            <p className="place-desc-p">
            {/* <p className="service--category-tag">Service category</p> */}
            {/* <p className="service--category-tag">{}</p> */}
            
            {/* {placeData.description} */}
            {serviceData.description}</p>
            <div className="book--service-price">
              <button
                className="book-service"
                type="submit"
                onClick={() => setCurrentState(states.BOOK)}
              >
               Book service
              </button>
              <span>/Service price</span>
              <span>{serviceData.price}</span>
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
                  <h6 className="place-outoffive">{serviceData.rating}</h6>
                </div>
                <div className="place--userreview">{serviceData.c_review}</div>
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
          <div className="contributor-name">
                  Added by <span></span>
                  {ownername}
                </div>
                {myserviceflag && (
                  <div className="edit-place">
                    <button className="editPlace--btn" onClick={handleEditClick}>Edit Service Info</button>
                  </div>
                )}
        </div>
      </div>
    </div>
  );
}

export default Serviceinfo;
