import { GrAdd } from "react-icons/Gr";
import { AiFillStar } from "react-icons/Ai";
import { AiOutlineStar } from "react-icons/Ai";
import React, { useState } from "react";
import "./Contribute.css";


export default function Contribute() {
   const [showModal, setShowModal] =useState(false);
   const Popup =() =>{
    return(<>
    <div className="reward-wrapper"> </div>
      <div className="reward-container">
    <button className="reward--close-btnn" onClick={()=>setShowModal(false)}>close</button>
        <p>Congratulations<br/>You contributed a place</p>
        <div className="reward-points">
        </div>
        </div>
    </>
    );
  }
  const submitHandler = (e)=>{
      e.preventDefault();
      setShowModal(true)
  }
 
  return (
    <div className="contribute-container">
      <div className="left-part">
        <p className="contribute-text">Contribute a Place</p>
        <div className="places-container">
          <ul>
            <li>
              <img src="/vite.svg"></img>
            </li>
            <li>
              <span>
                <GrAdd />
              </span>
            </li>
          </ul>
        </div>
        <div className="maps-container"></div>
      </div>
      <div className="right-part">
        <div className="place-info">
          <form method="#">
            <input className="place-name" type="text" placeholder="Name of the place" />
            <input className="place-name" type="text" placeholder="Description of the place" />
            <p>What this place offers</p>
            <div className="place-offers"></div>
            <p>Your review of the place</p>
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
              <input type="text" placeholder="Review Here" />
              <label>
                <input type="checkbox" />
                The information I submitted here is legit.
              </label>
              <br />
           

            <button onClick={submitHandler}>Submit </button>
            {showModal && <Popup/>}
          </form>
        </div>
      </div>
    </div>
  );
}

