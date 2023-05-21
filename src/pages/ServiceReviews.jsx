import React, { useState,useEffect } from 'react';
import axios from 'axios';
import RatingStars from "../components/ratings";
import { AiOutlineClose } from 'react-icons/Ai';
import { CgProfile } from 'react-icons/Cg';
// import reviewData from '../components/ReviewData';
import ReviewComponent from '../components/ReviewComponent';
import './Reviews.css';
// import { BiLike } from "react-icons/Bi";
//import { BiDislike } from "react-icons/Bi";
import { AiFillStar } from "react-icons/Ai";
import { BsPerson } from "react-icons/Bs";



function ServiceReviews({ closeModal,slug }) {
  //console.log(reviews);
  // const reviewData = [
  //   {
  //     id: reviews[0].id,
  //     name: reviews[0].reviewer,
  //     img: <BsPerson />,
  //     ratings:<AiFillStar />,
  //     review:reviews[0].description,
  //   },
  // ];
  
  
  const [reviews, setReviews] = useState([])
  const [rating, setRatingValue] = useState(0)

  async function getReviews() {
    const config = {
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    };
  
    try {
      console.log(slug);
      const response = await axios.get(`http://127.0.0.1:8000/api/hotel/${slug}/reviews/`, config);
      const data = await response.data;
  
      // Extract name and description
      const extractedData = data;
      console.log(extractedData);
      
      setReviews(extractedData);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  
  useEffect(() => {
    getReviews();
  }, [reviews]);
  
  const handleRating = (rating) => {
    console.log("rating:", rating);
    setRatingValue(rating);
  };
  
  const reviewSection = reviews.map((rev) => {
    return (
      <ReviewComponent
        key={rev.id}
        //Img={rev.img}
        name={rev.reviewer}
       // ratings={rev.ratings}
        review={rev.description}
      />
    );
  });
  async function handleSubmit(event) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    };
    event.preventDefault(); 
    const formData = new FormData(event.target);
    const desc = formData.get('review');
    const body = JSON.stringify({
      description: desc,
      rating: rating,
    });
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/hotel/${slug}/reviews/`, body, config)
      .catch((e) => {
        console.error(e);
        alert("Error sending details");
      });
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
          <div className="review">
              <RatingStars sendRating={handleRating} />
            </div>
            <input type='text' name='review' placeholder='Give your review here'></input><button type='submit'>Submit</button>
          </form>
        </div>
        {reviewSection}
      </div>
    </>
  );
}

export default ServiceReviews;
