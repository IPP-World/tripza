import { MapContainer, TileLayer, Marker, useMap,  LayersControl} from 'react-leaflet';
import React, { useState, useEffect } from "react";

const Recenter = ({ lat, lng }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView([lat, lng]);
  }, [map, lat, lng]);
  
  return null;
};

const MapSection = ({ onLocationSelect }) => {
  const [mapCenter, setMapCenter] = useState([28.390591999999998, 83.93487197222223]);
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
        timeout: 10000,
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
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Street View">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite View">
            <TileLayer
              url="http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
              maxZoom={20}
              subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        <MapClickHandler onMapClick={handleMapClick} />
        {selectedLocation && <Marker position={selectedLocation} />}
        {mapCenter && <Recenter lat={mapCenter[0]} lng={mapCenter[1]} />}
      </MapContainer>
    </>
  );
};

export default MapSection;
 