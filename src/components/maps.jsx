import { MapContainer, TileLayer, Marker, useMap,  LayersControl} from 'react-leaflet';
// import L from 'leaflet';
import React, { useState, useEffect } from "react";
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import '../../node_modules/leaflet-geosearch/dist/geosearch.css';
import "../components/maps.css"

const Recenter = ({ lat, lng }) => {
  const map = useMap();
  
  useEffect(() => {
    // map.setView([lat, lng]);
    map?.flyTo([lat,lng],15)
  }, [map, lat, lng]);
  return null;
};
// const Popup = ({ lat, lng }) => {
//   const map = useMap();
  
//   useEffect(() => {
//     // map.setView([lat, lng]);
//     L.marker([lat, lng]).addTo(map)
//     .bindPopup('latitude and longitude')
//     .openPopup();
//   }, []);
//   return null;
// };

const provider= new OpenStreetMapProvider();
const searchControl = new GeoSearchControl({
  provider: provider,
  // style: 'bar',
  showMarker: false,
});
const Search = () =>{
  const map=useMap();
  useEffect(()=>{
    map.addControl(searchControl);
  })
}


const MapSection = ({ onLocationSelect }) => {
  const [mapCenter, setMapCenter] = useState([28.256218726304628,83.97951900959016]);
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
        <Search/>
        <MapClickHandler onMapClick={handleMapClick} />
        {selectedLocation && <Marker position={selectedLocation} />}
        {/* {<Popup lat={mapCenter[0]} lng={mapCenter[1]} />} */}
        {mapCenter && <Recenter lat={mapCenter[0]} lng={mapCenter[1]} />}
      </MapContainer>
    </>
  );
};

export default MapSection;
 