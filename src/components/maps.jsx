import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import React, { useState, useEffect } from "react";

const MapSection = ({ onLocationSelect }) => {
  const [mapCenter, setMapCenter] = useState([25.255673, 83.978599]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const position = await getCurrentPosition();
        const { latitude, longitude } = position.coords;
        setMapCenter([latitude, longitude]);
        setSelectedLocation([latitude, longitude]);
        onLocationSelect({ latitude, longitude });
      } catch (error) {
        console.error(error);
      }
    };

    getUserLocation()
  }, []);

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    });
  };

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setSelectedLocation([lat, lng]);
    onLocationSelect({ latitude: lat, longitude: lng });
  };
  const MapClickHandler = ({ onMapClick }) => {
    const map = useMap();
  
    useEffect(() => {
      map.on('click', onMapClick);
  
      return () => {
        map.off('click', onMapClick);
      };
    }, [map, onMapClick]);
  
    return null;
  };
  

  return (
    <>
      <MapContainer
        center={mapCenter}
        zoom={13}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%", maxWidth: "600px", maxHeight: "500px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler onMapClick={handleMapClick} />
        {selectedLocation && <Marker position={selectedLocation} />}
      </MapContainer>
    </>
  );
};

export default MapSection;