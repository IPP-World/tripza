import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RatingStars from "../components/ratings";
import { AiOutlineClose } from 'react-icons/Ai';
import { CgProfile } from 'react-icons/Cg';
import ReviewComponent from '../components/ReviewComponent';
import './Reviews.css';

function Reviews({ closeModal, slug }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRatingValue] = useState(0);

  useEffect(() => {
    getReviews();
  }, []);

  const getReviews = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/place/${slug}/reviews/`, config);
      const data = response.data;
      setReviews(data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const handleRating = (rating) => {
    setRatingValue(rating);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const desc = formData.get('review');
    const body = JSON.stringify({
      description: desc,
      rating: rating,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    };

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/place/${slug}/reviews/`, body, config);
      await getReviews(); 
      event.target.reset(); 
      setRatingValue(0);
    } catch (e) {
      console.error(e);
      alert("Error sending details");
    }
  };

  const reviewSection = reviews.map((rev) => (
    <ReviewComponent
      key={rev.id}
      name={rev.reviewer}
      review={rev.description}
      rating={rev.rating}
    />
  ));

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
            <div className="review-stars">
              <RatingStars sendRating={handleRating} />
            </div>
            <input type='text' name='review' placeholder='Give your review here' />
            <button type='submit'>Submit</button>
          </form>
        </div>
        {reviewSection}
      </div>
    </>
  );
}

export default Reviews;
