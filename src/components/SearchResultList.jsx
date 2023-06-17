// import "./SearchResultList.css";
// import { SearchResult } from "./SearchResult";

// export const SearchResultsList = ({ results }) => {
//   return (
//     <div className="results-list">
//       {results.map((result, id) => {
//         return <SearchResult result={result.name} key={id} />;
//       })}
//     </div>
//   );
// };
import React from "react";
import "./SearchResultList.css";
import { SearchResult } from "./SearchResult";

export const SearchResultsList = ({ results, handleClick }) => {
  return (
    <div className="results-list">
      {results.map((result) => (
        <SearchResult
          key={result.slug}
          result={result.name}
          slug={result.slug}
          handleClick={handleClick}
        />
      ))}
    </div>
  );
};
