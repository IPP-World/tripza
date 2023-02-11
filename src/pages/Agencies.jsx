import TrendingPlaces from "../components/TrendingPlaces";
import data from "../components/TrendingPlacesData";
import exdata from "../components/Exploreplacesdata";
import ExplorePlaces from "../components/ExplorePlaces";
import "./Landing.css";

export default function Landing() {
  const trendingPlaces = data.map((place) => {
    return (
      <TrendingPlaces
        key={place.id}
        Img={place.Img}
        name={place.name}
        location={place.location}
      />
    );
  });
  const explorePlaces = exdata.map((other) => {
    return (
      <ExplorePlaces
        key={other.id}
        Img={other.Img}
        name={other.name}
        location={other.location}
      />
    );
  });
  return (
    <div className="landing-page">

      <div className="trending--box">
        <h3 className="trending--text">Trending Agencies</h3>
        <div className="trending--cardlist">{trendingPlaces}</div>
      </div>
      <div className="explore--box">
        <h3 className="explore--text">Other Agencies</h3>
        <div className="explore--cardlist">{explorePlaces}</div>
      </div>
    </div>
  );
}
