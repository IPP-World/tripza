import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl } from 'react-leaflet';
import React, { useState, useEffect, useCallback } from "react";
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import '../../node_modules/leaflet-geosearch/dist/geosearch.css';
import '../../node_modules/leaflet/dist/leaflet.css';
import '../pages/EntireMap.css';

const provider = new OpenStreetMapProvider();
const searchControl = new GeoSearchControl({
  provider: provider,
  showMarker: false,
});

const Search = () => {
  const map = useMap();

  useEffect(() => {
    map.addControl(searchControl);
  }, [map]);

  return null;
};

const Recenter = ({ lat, lng }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo([lat, lng], 15);
  }, [map, lat, lng]);

  return null;
};

function EntireMap() {
  const [mapCenter, setMapCenter] = useState([28.003616948550523, 84.55737294629218]);
  const [recenterFlag, setRecenterFlag] = useState(false);

  const handleClick = useCallback(async () => {
    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      setMapCenter([latitude, longitude]);
      setRecenterFlag(true);
    } catch (error) {
      console.error(error);
    }
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

  useEffect(() => {
    if (recenterFlag) {
      setRecenterFlag(false);
    }
  }, [recenterFlag]);

  return (
    <div className='entiremap'>
      <MapContainer
        center={mapCenter}
        zoom={7}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%" }}
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
        <Search />
        {recenterFlag && <Recenter lat={mapCenter[0]} lng={mapCenter[1]} />}
        <Marker position={mapCenter}>
          <Popup>
            A popup!
          </Popup>
        </Marker>
        <button className='location-button' onClick={handleClick}>My location</button>
      </MapContainer>
    </div>
  );
}

export default EntireMap;
