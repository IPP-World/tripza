import TrendingPlaces from "../components/TrendingPlaces";
import data from "../components/TrendingPlacesData";
import exdata from "../components/Exploreplacesdata";
import ExplorePlaces from "../components/ExplorePlaces";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import "./Landing.css";

export default function Landing() {
  
  const slicedData = data.slice(0, 8);
  const trendingPlaces = slicedData.map((place) => { 
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
      <div className="landing--trendingCar">
      <h3 className="trending--text">Trending Places</h3>
      <AliceCarousel
              items={trendingPlaces}
              responsive={{ 0:{ items: 4 }, 768: { items: 4} }}
              disableDotsControls
              autoPlay= {true}
              autoPlayInterval={2500}
              animationDuration={1000}
              infinite = {true}
  
            >
            </AliceCarousel>
            </div>

    
      <div className="explore--box">
        <h3 className="explore--text">Other Places</h3>
        <div className="explore--cardlist">{explorePlaces}</div>
      </div>
    </div>
  );
}
