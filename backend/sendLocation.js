const axios = require('axios');

const vehicleId = 'vehicle123'; // Replace with your vehicle ID
let latitude = 20.5937; // Initial latitude
let longitude = 78.9629; // Initial longitude

setInterval(async () => {
  // Simulate moving the vehicle
  latitude += 0.001; // Increment latitude
  longitude += 0.001; // Increment longitude

  try {
    const response = await axios.post('http://localhost:5000/api/location', {
      vehicleId,
      latitude,
      longitude,
    });
    console.log(`Sent location: ${latitude}, ${longitude}`, response.data);
  } catch (error) {
    console.error('Error sending location:', error);
  }
}, 5000); // Send location every 5 seconds