import { MapContainer, TileLayer, Marker,useMapEvents} from 'react-leaflet';
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import Geocode from "react-geocode";
import React, { useState,useEffect } from "react";

const MapSection = () =>{
    const [mapCenter, setMapCenter] = useState([28.255673, 83.978599]);
    const [position, setPosition] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        // Get user's current location and set the map center to that location
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
        requestOptions: {
        },
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
    
        try {
          const results = await getGeocode({ address });
          const { lat, lng } = await getLatLng(results[0]);
          setPosition({ lat, lng });
          setMapCenter({ lat, lng });
        } catch (error) {
          console.log("Error: ", error);
        }
      };
       
      const handleSearch = (e) => {
        e.preventDefault();
        Geocode.fromAddress(searchValue).then(
          (response) => {
            const { lat, lng } = response.results[0].geometry.location;
            setPosition({ lat, lng });
            setMapCenter({ lat, lng });
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
          setMapCenter({ lat: latitude, lng: longitude });
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
      return(
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
}
export default MapSection;