import React, { useState } from "react";
import { CiShare1 } from "react-icons/ci";
import { BsBookmarkPlus } from "react-icons/Bs";
import { AiFillStar } from "react-icons/Ai";
import place from "../assets/place.jpg";
import Screenshot from "../assets/Screenshot (40).png";
import Logo from "../assets/khaltiLogo.png";
import Reviews from "./Reviews";
import HotelsNearby from "./HotelsNearby";
import AgenciesNearby from "./AgenciesNearby";
import "./PlaceInfo.css";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

function PlaceInfo() {
  const states = Object.freeze({
    REVIEWS: <Reviews closeModal={() => setCurrentState(states.NONE)} />,
    HOTELS: <HotelsNearby closeModal={() => setCurrentState(states.NONE)} />,
    AGENCIES: (
      <AgenciesNearby closeModal={() => setCurrentState(states.NONE)} />
    ),
    NONE: <></>,
  });

  const carouselItems = [
    <img src={place}/>,
    <img src={Screenshot}/>,
    <img src={Logo}/>,
  ];

  const [currentState, setCurrentState] = useState(states.NONE);
  return (
    <div className="PlaceInfo">
      {currentState}
      <div className="place--header">
        <div className="place--details">
          <h1 className="place--name">Veluvana Bali - Owl Bamboo House</h1>
          <h4 className="place--location">Sidemen, Bali, Indonesia</h4>
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
              Veluvana is a unique bamboo house with a wonderful view of Sidemen
              Valley, a genuine tropical landscape with Mount Agung peak on its
              back. This getaway spot is a great place to bring into reality the
              dream adventure of the true wanderer. We invite you to feel the
              magnificent vibes of the entire house to escape the life that is
              full of drama into a journey with ultimate joy.
            </p>
            <div className="offers--container">
              <h1 className="place--offers">What this place offers</h1>
              <div className="place--offerlistbox">
                <span className="place--offerlist">Garden View</span>
                <span className="place--offerlist">Mountain View</span>
                <span className="place--offerlist">Wifi</span>
                <span className="place--offerlist">Pets allowed</span>
                <span className="place--offerlist">Tiger statue</span>
                <span className="place--offerlist">Tiktok zone</span>
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
                  className="place--reviewbutton"
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
