import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import L from 'leaflet'; // Import Leaflet for marker icons

// Import marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapView = ({ liveLocation }) => {
  const [pastRoutes, setPastRoutes] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    // Fetch past routes from backend
    axios.get('/api/routes/vehicle123') // Replace 'vehicle123' with the actual vehicle ID
      .then((res) => setPastRoutes(res.data))
      .catch(err => console.error(err));
  }, []);

  const polylinePositions = pastRoutes.map((loc) => [loc.latitude, loc.longitude]);

  return (
    <MapContainer 
      center={[20, 77]} 
      zoom={5} 
      style={{ height: '500px', width: '100%' }} 
      whenCreated={(mapInstance) => {
        mapRef.current = mapInstance; // Set map instance reference
      }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {liveLocation && (
        <Marker position={[liveLocation.latitude, liveLocation.longitude]} />
      )}
      <Polyline positions={polylinePositions} color="blue" />
    </MapContainer>
  );
};

export default MapView;