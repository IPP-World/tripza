import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/Ai';
import { CgProfile } from 'react-icons/Cg';
import reviewData from '../components/ReviewData';
import ReviewComponent from '../components/ReviewComponent';
import './Reviews.css';

function Reviews({ closeModal }) {
  const reviewSection = reviewData.map((rev) => {
    return (
      <ReviewComponent
        key={rev.id}
        Img={rev.img}
        name={rev.name}
        ratings={rev.ratings}
        review={rev.review}
        likes={rev.likes}
        dislikes={rev.dislikes}
        likesCount={rev.likesCount}
        dislikesCount={rev.dislikesCount}
      />
    );
  });
  
  function handleSubmit(event) {
    event.preventDefault(); 
    const formData = new FormData(event.target);
    console.log(formData.get('review'));
  }

  return (
    <>
      <div className='reviews-wrapper' onClick={closeModal}></div>
      <div className='reviews-container'>
        <button className='review-close-btn' onClick={closeModal}>
          <AiOutlineClose />
        </button>
        <p className='reviews-text'>Reviews</p>
        <div className='review-input'>
          <label>
            <CgProfile />
          </label>
          <form onSubmit={handleSubmit}>
            <input type='text' name='review' placeholder='Give your review here'></input><button type='submit'>Submit</button>
          </form>
        </div>
        {reviewSection}
      </div>
    </>
  );
}

export default Reviews;
