import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl, useMapEvents } from 'react-leaflet';
import React, { useState, useEffect, useCallback } from "react";
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import axios from 'axios';
import { Icon } from 'leaflet';
import placeicon from '../assets/place-icon.png';
import serviceicon from '../assets/service-icon.png';

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
  const [allPlaceData, setAllPlaceData] = useState([]);
  const [allServiceData, setAllServiceData] = useState([]);
  const [currentZoom, setCurrentZoom] = useState(7);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const zoomLevelToShowMarkers = 9;

  const serviceIcon = new Icon({
    iconUrl: serviceicon,
    iconSize: [32, 32],
  });

  const placeIcon = new Icon({
    iconUrl: placeicon,
    iconSize: [32, 32],
  });

  const handleClick = useCallback(async () => {
    try {
      setFetchingLocation(true);
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      setMapCenter([latitude, longitude]);
      setRecenterFlag(true);
      setFetchingLocation(false);
    } catch (error) {
      console.error(error);
      setFetchingLocation(false);
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

  useEffect(() => {
    getPlaceData();
    getServiceData();
  }, []);

  async function getPlaceData() {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/place/show/');
      const data = response.data;
      setAllPlaceData(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function getServiceData() {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/hotel/show/');
      const data = response.data;
      setAllServiceData(data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleZoomEnd = (map) => {
    setCurrentZoom(map.getZoom());
  };

  const MapEvents = () => {
    useMapEvents({
      zoomend: (e) => handleZoomEnd(e.target),
    });

    return null;
  };

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
        <MapEvents />
        {allPlaceData.map((place) => (
          <Marker
            key={place.id}
            position={[parseFloat(place.latitude), parseFloat(place.longitude)]}
            opacity={currentZoom >= zoomLevelToShowMarkers ? 1 : 0}
            icon={placeIcon}
          >
            <Popup className='place-popup'>
              <a href={`/placeinfo/${place.slug}`} style={{ textDecoration: 'none' }}>
                <div>
                  <h4>{place.name}</h4>
                  <p>{place.description}</p>
                  {place.images.map((image) => (
                    <img className='place-images' key={image.id} src={`http://localhost:8000${image.image}`} alt="Place Image" />
                  ))}
                </div>
              </a>
            </Popup>
          </Marker>
        ))}
        {allServiceData.map((service) => (
          <Marker
            key={service.id}
            position={[parseFloat(service.latitude), parseFloat(service.longitude)]}
            opacity={currentZoom >= zoomLevelToShowMarkers ? 1 : 0}
            icon={serviceIcon}
          >
            <Popup className='service-popup'>
              <a href={`hotels/serviceinfo/${service.slug}`} style={{ textDecoration: 'none' }}>
                <div>
                  <h4>{service.name}</h4>
                  <p>{service.description}</p>
                  {service.images.map((image) => (
                    <img className='service-images' key={image.id} src={`http://localhost:8000${image.image}`} alt="Service Image" />
                  ))}
                </div>
              </a>
            </Popup>
          </Marker>
        ))}
        <button className='location-button' onClick={handleClick}>
          {fetchingLocation ? "Fetching your location..." : "My location"}
        </button>
      </MapContainer>
    </div>
  );
}

export default EntireMap;
