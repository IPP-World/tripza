// import React from "react";
// import "./SearchResult.css";

// export const SearchResult = ({ result, handleClick }) => {
//   const handleResultClick = () => {
//     handleClick(result);
//   };

//   return (
//     <div className="search-result" onClick={handleResultClick}>
//       {result}
//     </div>
//   );
// };
// SearchResult.js
import React from "react";
import "./SearchResult.css";

export const SearchResult = ({ result, slug, handleClick }) => {
  const handleResultClick = () => {
    handleClick(slug);
  };

  return (
    <div className="search-result" onClick={handleResultClick}>
      {result}
    </div>
  );
};
