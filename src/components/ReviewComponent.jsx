import React from 'react'
import "./ReviewComponentko.css";
function ReviewComponent(props) {
        return (
          <>
          <div className="reviews-section">
              <div className="review-card">
                  <div className="review--profile">
                      <img className='review--image' src={props.Img} alt='img' />
                      <span className="reviewer--name">{props.name}</span><br/>
                      <span className='ratings'>{props.ratings}</span>
                  </div>
                      <div className="review--text">{props.review}</div>
                      <div className="like-section">
                          {props.likes}<span>{props.likesCount}</span>
                          {props.dislikes}<span>{props.dislikesCount}</span>
                      </div>
              </div>
          </div>
            </>
        );
}

export default ReviewComponent