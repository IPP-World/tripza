import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import Geocode from "react-geocode";
import React, { useState, useEffect } from "react";
import axios from 'axios';

const MapSection = () => {
  const [mapCenter, setMapCenter] = useState([28.255673, 83.978599]);
  const [position, setPosition] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setMapCenter([latitude, longitude]);
      },
      error => console.error(error),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }, []);

  const handleMapClick = (e) => {
    setPosition(e.latlng);
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: handleMapClick
    });
    return null;
  };

  const {
    ready,
    suggestions: { status, data },
    setValue,
    clearSuggestions
  } = usePlacesAutocomplete({
    requestOptions: {},
    debounce: 300
  });

  const handleInput = (e) => {
    setValue(e.target.value);
    setSearchValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setSearchValue(address);
    setValue(address);
    clearSuggestions();
    const options = {
      method: 'GET',
      url: 'https://geolocation-api1.p.rapidapi.com/address',
      params: { address },
      headers: {
        'X-RapidAPI-Key': '6e342db96amsh940a115272eaa0bp15689cjsn8e6a4e47bf5e',
        'X-RapidAPI-Host': 'geolocation-api1.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      const { latitude, longitude } = response.data.results[0].geometry.location;
      setPosition({ lat: latitude, lng: longitude });
      setMapCenter({ lat: latitude, lng: longitude });
      // Move the map to the new location
      const map = useMap();
      map.setView({ lat: latitude, lng: longitude }, 13);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    Geocode.fromAddress(searchValue).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setPosition({ lat, lng });
        setMapCenter({ lat, lng });
        // Move the map to the new location
        const map = useMap();
        map.setView({ lat, lng }, 13);
      },
      (error) => {
        console.error(error);
      }
    );
  };

  const handleLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
            setMapCenter([latitude, longitude]);
            setPosition({ lat: latitude, lng: longitude });
          },
          (error) => {
            console.error(error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };
  
    // const handleSearch = async (e) => {
    //   e.preventDefault();
    //   try {
    //     const response = await axios.request(options);
    //     const { lat, lng } = response.data.features[0].geometry;
    //     setUserLocation({ lat, lng });
    //     setMapCenter([lat, lng]);
    //     setPosition({ lat, lng });
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };
  
    return (
      <>
        <button onClick={handleLocation}>Get My Location</button>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for a location"
            value={searchValue}
            onChange={handleInput}
          />
          <button type="submit">Search</button>
        </form>
        <MapContainer
          center={mapCenter}
          zoom={13}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "100%", maxWidth: "600px", maxHeight: "500px" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {userLocation && <Marker position={userLocation} />}
          <MapClickHandler />
          {position && <Marker position={position} />}
        </MapContainer>
      </>
    );
  };
 
  export default MapSection;
     
