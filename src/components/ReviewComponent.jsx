import React from 'react';
import './ReviewComponentko.css';
import { AiFillStar, AiOutlineStar } from "react-icons/Ai";
import { CgProfile } from "react-icons/Cg";

function ReviewComponent(props) {
  const renderRatingStars = () => {
    
    const ratingStars = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= props.rating) {
        ratingStars.push(<AiFillStar key={i} className="place-starlogo" />);
      } else {
        ratingStars.push(<AiOutlineStar key={i} className="place-starlogo" />);
      }
    }

    return ratingStars;
  };

  return (
    <div className='reviews-section'>
      <div className='review-card'>
        <div className='review--profile'>
          <div className="review--image2">
            <CgProfile />
          </div>
        </div>
        <div className='review--three'>
          <div className='review--two'>
            <span className='reviewer--name'>{props.name}</span>
            <br />
            <span className='ratings'>{renderRatingStars()}</span>
          </div>
          <div className='review--text'>{props.review}</div>
        </div>
      </div>
    </div>
  );
}

export default ReviewComponent;

