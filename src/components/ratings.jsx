import { useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/Ai';

const RatingStars = ({ sendRating }) => {
  const [rating, setRating] = useState(0);

  const handleClick = (event, newRating) => {
    event.preventDefault();
    setRating(newRating);
    sendRating(newRating);
  };

  return (
    <div className="rating">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <span key={ratingValue}>
            {ratingValue <= rating ? (
              <AiFillStar onClick={(event) => handleClick(event, ratingValue)} />
            ) : (
              <AiOutlineStar onClick={(event) => handleClick(event, ratingValue)} />
            )}
          </span>
        );
      })}
    </div>
  );
};

export default RatingStars;

