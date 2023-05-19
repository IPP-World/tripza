import React, { useState } from "react";
import { CiShare1 } from "react-icons/ci";
import { BsBookmarkPlus } from "react-icons/Bs";
import { AiFillStar } from "react-icons/Ai";
import place from "../assets/place.jpg";
import place2 from "../assets/Khumai2.jpg";
import place1 from "../assets/Khumai1.jpg";
import Reviews from "./Reviews";
import HotelsNearby from "./HotelsNearby";
import AgenciesNearby from "./AgenciesNearby";
import "./PlaceInfo.css";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { useNavigate } from 'react-router-dom'; 

function PlaceInfo() {
  const states = Object.freeze({
    REVIEWS: <Reviews closeModal={() => setCurrentState(states.NONE)} />,
    HOTELS: <HotelsNearby closeModal={() => setCurrentState(states.NONE)} />,
    AGENCIES: (
      <AgenciesNearby closeModal={() => setCurrentState(states.NONE)} />
    ),
    NONE: <></>,
  });
 const navigate=useNavigate();
 const handleAddService=()=>{
    navigate('/addservices');
 }
  const carouselItems = [
    <img src={place}/>,
    <img src={place1}/>,
    <img src={place2}/>,
  ];

  const [currentState, setCurrentState] = useState(states.NONE);
  return (
    <div className="PlaceInfo">
      {currentState}
      <div className="place--header">
        <div className="place--details">
          <h1 className="place--name">Khumai Dada - Great Machhapuchare Trail</h1>
          <h4 className="place--location">Machhapuchchhre 33700, Pokhara</h4>
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
          <div className="place-map"></div>
        </div>
        <div className="place--desc-reviews">
          <div className="place-desc">
            <p className="place-desc-p">
            Khumai Danda Trek is a trekking trail with a lot of potential for new demanding trekking routes in Nepal.
            Already some hikers hiked to these beautiful places and got popular among Nepali travelers. Because of the appealing mountain views especially the view of
            Mt. Machhapuchhere. Typical villages and lifestyle of the local people. Mountain views, local villages,
            lush forests, and the culture of the local community is the attraction of this trek. Khumai Danda Trek is also called Machhapuchhere Model Trek. Because this trek goes around Mount Machhapuchare and its surroundings.
            </p>
            <div className="offers--container">
              <h1 className="place--offers">What this place offers</h1>
              <div className="place--offerlistbox">
                <span className="place--offerlist">Typical villages</span>
                <span className="place--offerlist">Mountain View</span>
                <span className="place--offerlist">Sunset and sunrise</span>
                <span className="place--offerlist">Snow</span>
                <span className="place--offerlist">Trekking trail</span>
                <span className="place--offerlist">Campfire</span>
              </div>
            </div>
            <div className="place--nearby">
              <button
                className="hotels--nearby"
                type="submit"
                onClick={() => setCurrentState(states.HOTELS)}
              >
                Hotels nearby
              </button>
              <button
                className="agencies--nearby"
                type="submit"
                onClick={() => setCurrentState(states.AGENCIES)}
              >
                Agencies
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
                  <h6 className="place-outoffive">4.5/5</h6>
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

export default PlaceInfo;
