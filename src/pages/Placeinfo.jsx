import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { CiShare1 } from "react-icons/ci";
import { BsBookmarkPlus } from "react-icons/Bs";
import { AiFillStar, AiOutlineClose } from "react-icons/Ai";
import { GoVerified } from "react-icons/Go";
import { CgProfile } from "react-icons/Cg";
import Reviews from "./Reviews";
import HotelsNearby from "./HotelsNearby";
import "./PlaceInfo.css";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  LayersControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

import currentLocationIcon from "../assets/current-location-icon.png";
import placeicon from "../assets/place-icon.png";

function RoutingControl({ mapCenter, curlat, curlon }) {
  const currentIcon = L.icon({
    iconUrl: currentLocationIcon,
    iconSize: [32, 32],
  });

  const goalIcon = L.icon({
    iconUrl: placeicon,
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
    } else {
      return;
    }
  }, [map, mapCenter, curlat, curlon]);

  return null;
}

function PlaceInfo() {
  const [placeData, setPlaceData] = useState({});
  const [mapCenter, setMapCenter] = useState([0, 0]);
  const [images, setImages] = useState([]);
  const [map, setMap] = useState(null);
  const [isVerified, setIsverified] = useState(false);
  const [curlat, setCurlat] = useState(null);
  const [curlon, setCurlon] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [contributorname, setContributorName] = useState(false);
  const [contributorflag, setContributorFlag] = useState(false);

  const { slug } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/place/my-contributions/",
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
        setContributorFlag(flag);
        console.log("contributorflag:", contributorflag);
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
        console.log("curlat:", curlat);

        setCurlon(longitude);
      } catch (error) {
        console.error(error);
      }
    };

    getUserLocation();
  }, []);

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 100000,
        maximumAge: 0,
      });
    });
  };

  useEffect(() => {
    map?.setView(mapCenter, 15);
  }, [mapCenter]);

  async function getPlaceData() {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/place/${slug}`,
        config
      );
      const data = await response.data;
      const extractedData = data;

      const lat = Number(data.latitude);
      const lon = Number(data.longitude);
      const is = data.is_verified;
      setIsverified(is);
      setMapCenter([lat, lon]);
      setImages([
        ...images,
        data.images.map((i) => <img src={`http://localhost:8000${i.image}`} />),
      ]);
      setPlaceData(extractedData);
      setContributorName(extractedData.contributor_name);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  useEffect(() => {
    getPlaceData();
  }, []);

  const states = Object.freeze({
    REVIEWS: (
      <Reviews slug={slug} closeModal={() => setCurrentState(states.NONE)} />
    ),
    HOTELS: (
      <HotelsNearby
        slug={slug}
        closeModal={() => setCurrentState(states.NONE)}
      />
    ),
    NONE: <></>,
  });

  const navigate = useNavigate();
  const handleAddService = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    };

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/user/profile`,
        config
      );
      const data = response.data;

      // Extract name and description
      const subscribedata = data;
      console.log("data", subscribedata);
      if (subscribedata.is_subscribed == false) {
        alert("you are not subscribed");
      } else {
        navigate("/addservices");
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const [currentState, setCurrentState] = useState(states.NONE);

  const handlemapclick = () => {
    console.log("map clicked");
    setShowMap(true);
  };

  const Popup = () => (
    <>
      <div className="map-wrapper" onClick={() => setShowMap(false)}></div>
      <div className="map-container">
        <div className="map--close-btnn" onClick={() => setShowMap(false)}>
          <AiOutlineClose />
        </div>
        <MapContainer
          center={mapCenter}
          zoom={13}
          scrollWheelZoom={true}
          style={{
            width: "100%",
            height: "100%",
            maxWidth: "1000px",
            maxHeight: "1000px",
          }}

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
                subdomains={["mt0", "mt1", "mt2", "mt3"]}
              />
            </LayersControl.BaseLayer>
          </LayersControl>
          <RoutingControl
            mapCenter={mapCenter}
            curlat={curlat}
            curlon={curlon}
          />
        </MapContainer>
      </div>
    </>
  );

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
      <span className="place--verification">
        {!isVerified ? (
          ""
        ) : (
          <span>
            <GoVerified /> Verified
          </span>
        )}
      </span>
      <div className="place--body">
        <div className="place--pic-map">
          <div className="place-pic">
            <AliceCarousel
              items={images[0]}
              mouseTracking={true}
              animationDuration={1000}
              autoPlay={true}
              autoPlayInterval={3000}
              infinite={true}
            ></AliceCarousel>
          </div>
          <div className="place-map">
            <MapContainer
              center={mapCenter}
              zoom={13}
              scrollWheelZoom={true}
              style={{
                width: "100%",
                height: "100%",
                maxWidth: "600px",
                maxHeight: "500px",
              }}
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
                    subdomains={["mt0", "mt1", "mt2", "mt3"]}
                  />
                </LayersControl.BaseLayer>
              </LayersControl>
              <Marker position={mapCenter} />
            </MapContainer>
          </div>
          <div className="view-map">
            <button className="map--button" onClick={handlemapclick}>
              View Route
            </button>
            {showMap && <Popup />}
          </div>
        </div>

        <div className="place--desc-reviews">
          <div className="place-desc">
            <p className="place-desc-p">{placeData.description}</p>
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
              <button className="service--add-btn" onClick={handleAddService}>
                Add service
              </button>
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
                  <div className="review--profile">
                    <CgProfile />
                  </div>
                  <div>{placeData.c_review}</div>
                </div>
                <button
                  className="placeinfo--place--reviewbutton"
                  type="submit"
                  onClick={() => setCurrentState(states.REVIEWS)}
                >
                  More
                </button>
                <div className="contributor-name">
                  Contributed by <span></span>
                  {contributorname}
                </div>
                {contributorflag && (
                  <div className="edit-place">
                    <button>Edit Place Info</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceInfo;
