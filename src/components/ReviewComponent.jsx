// import React, { useState, useEffect } from 'react';
import './ReviewComponentko.css';
import { AiFillStar } from "react-icons/Ai";
import { CgProfile } from "react-icons/Cg";

//import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

function ReviewComponent(props) {
return (
    <div className='reviews-section'>
      <div className='review-card'>
        <div className='review--profile'>
        <div className="review--image2"><CgProfile/></div>
      </div>
      <div className='review--three'>
      <div className='review--two'>
          <span className='reviewer--name'>{props.name}</span>
          <br />
          <span className='ratings'><AiFillStar className="place-starlogo" /> {props.ratings}</span>
       
</div>
<div className='review--text'>{props.review}</div>
        </div>
        </div>
      </div>
    );
  }

export default ReviewComponent