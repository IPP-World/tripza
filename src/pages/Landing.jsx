import { useState, useEffect } from "react";
import axios from "axios";
import TrendingPlaces from "../components/TrendingPlaces";
// import data from "../components/TrendingPlacesData";
import ExplorePlaces from "../components/ExplorePlaces";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import "./Landing.css";

export default function Landing() {

  const [places, setPlaces] = useState([])
  const [trendingplaces,setTrendingplaces]= useState([])

  async function getPlaceData() {
    const config = {
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    };
  
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/place/show', config);
      const data = response.data;
      console.log(data);
  
      // Extract name and description
      const extractedData = data;
  
     setPlaces(extractedData);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async function getTrendingData() {
    const config = {
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    };
  
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/hotel/trending-places', config);
      const data = response.data;
      // console.log(data);
  
      // Extract name and description
      const trendingData = data;
    console.log('trending data',trendingData);
     setTrendingplaces(trendingData);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  useEffect (() => {
    getPlaceData();
    getTrendingData();
  }, [])
  
  // const slicedData = data.slice(0, 8);
 
  const trendingPlaces = trendingplaces.map(place => {
    return (
      <TrendingPlaces key={place.id} Img={place.images[0]} name={place.name} location={place.location} slug={place.slug} latitude={place.latitude} longitude={place.longitude}/>
    )
  })
  // const explorePlaces = exdata.map((other) => {
  //   return (
  //     <ExplorePlaces
  //       key={other.id}
  //       Img={other.Img}
  //       name={other.name}
  //       location={other.location}
  //     />
  //   );
  // });

  const explorePlaces = places.map(place => {
    return (
      <ExplorePlaces key={place.id} Img={place.images[0]} name={place.name} location={place.location} slug={place.slug} latitude={place.latitude} longitude={place.longitude}/>
    )
  })
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
