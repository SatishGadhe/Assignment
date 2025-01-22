


import React, { useState, useEffect } from 'react';
import MapView from './components/MapView';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Backend server URL

function App() {
  const [liveLocation, setLiveLocation] = useState(null);

  useEffect(() => {
    // Listen for real-time location updates
    socket.on('receive-location', (data) => {
      console.log('Received location data:', data); // Log the received data
      setLiveLocation(data);
    });

    // Emit location data every 5 seconds (for testing)
    const interval = setInterval(() => {
      const newLocation = {
        vehicleId: 'vehicle123',
        latitude: 20.5937 + Math.random() * 0.01, // Simulate random latitude
        longitude: 78.9629 + Math.random() * 0.01, // Simulate random longitude
      };
      socket.emit('send-location', newLocation); // Emit the location
    }, 5000);

    // Clean up the socket connection on component unmount
    return () => {
      clearInterval(interval);
      socket.off('receive-location');
    };
  }, []);

  return (
    <div>
      <h1>Vehicle Tracking System</h1>
      {liveLocation ? (
        <MapView liveLocation={liveLocation} />
      ) : (
        <p>Waiting for live location...</p>
      )}
    </div>
  );
}

export default App;