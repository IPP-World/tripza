import { GrAdd } from "react-icons/Gr";
import { AiFillStar } from "react-icons/Ai";
import { AiOutlineStar } from "react-icons/Ai";
import React, { useState } from "react";
import screenshot from "../assets/Screenshot (40).png"
import "./Contribute.css";

export default function Contribute() {
  const [showModal, setShowModal] = useState(false);
  const Popup = () => {
    return (
      <>
        <div className="reward-wrapper"> </div>
        <div className="reward-container">
          <button
            className="reward--close-btnn"
            onClick={() => setShowModal(false)}
          >
            close
          </button>
          <p>
            Congratulations
            <br />
            You contributed a place
          </p>
          <div className="reward-points"></div>
        </div>
      </>
    );
  };
  const submitHandler = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  return (
    <div className="contribute-container">
      <div className="left-part">
        <div className="contribute-text">Contribute a Place</div>
        <div className="places-container">
          <ul>
            <li>
              <img src={screenshot}></img>
            </li>
            <li>
              <span className="add-box">
                <GrAdd className="add"/>
              </span>
            </li>
          </ul>
        </div>
        <div className="maps-container">
        <img className="map" src={screenshot}></img>
        </div>
      </div>
      <div className="right-part">
        <div className="place-info">
          <form method="#">
            <input
              className="place-name1"
              type="text"
              placeholder="Name of the place"
            />
            <input
              className="place-name2"
              type="textbox"
              placeholder="Description of the place"
            />
            <div className="place-offers-text">What this place offers</div>
            <div className="place-offers">
            <div className="place--offerlistbox">
            <span className="place--offerlist"><GrAdd className="add-offer"/></span>
            <span className="place--offerlist">Mountain View</span>
            <span className="place--offerlist">Wifi</span>
            <span className="place--offerlist">Pets allowed</span>
            <span className="place--offerlist">Tiger statue</span>
            <span className="place--offerlist">Tiktok zone</span>
            </div>
            </div>
            <div className="review-text">Your review of the place</div>
            <div className="review">
              <span>
                <AiFillStar />
              </span>
              <span>
                <AiFillStar />
              </span>
              <span>
                <AiFillStar />
              </span>
              <span>
                <AiOutlineStar />
              </span>
              <span>
                <AiOutlineStar />
              </span>
            </div>
            <div className="review-box">
              <input type="text" placeholder="Review Here" />
            </div>
            <div className="checkbox">
            <label required>
              <input type="checkbox" />
              The information I submitted here is legit.
            </label></div>
            <br />
          <button className="submit" onClick={submitHandler}>
              Submit
            </button>
            {showModal && <Popup />}
          </form>
        </div>
      </div>
    </div>
  );
}
