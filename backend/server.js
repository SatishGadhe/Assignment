require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const Location = require('./models/Location');

// Setup
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));


io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('send-location', (data) => {
      console.log('Sending location:', data); // Log the data being sent
      io.emit('receive-location', data);
    });
  });

// API Routes
app.post('/api/location', async (req, res) => {
  const { vehicleId, latitude, longitude, timestamp } = req.body;
  try {
    const location = new Location({ vehicleId, latitude, longitude, timestamp });
    await location.save();
    res.status(201).json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/routes/:vehicleId', async (req, res) => {
  try {
    const locations = await Location.find({ vehicleId: req.params.vehicleId });
    res.status(200).json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));