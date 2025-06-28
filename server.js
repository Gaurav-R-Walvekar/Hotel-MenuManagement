const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: './config.env' });

// Import database connection and models
const connectDB = require('./config/database');
const Hotel = require('./models/Hotel');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// API Routes
app.get('/api/menu', async (req, res) => {
  try {
    const hotels = await Hotel.find({ isActive: true });
    const hotelsData = {};
    
    hotels.forEach(hotel => {
      hotelsData[hotel.name] = {
        location: hotel.location,
        description: hotel.description,
        menu: hotel.menu
      };
    });
    
    res.json({ hotels: hotelsData });
  } catch (error) {
    console.error('Error fetching menu data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/menu/:hotelName', async (req, res) => {
  try {
    const hotelName = req.params.hotelName;
    const hotel = await Hotel.findOne({ name: hotelName, isActive: true });
    
    if (hotel) {
      res.json(hotel.menu);
    } else {
      res.status(404).json({ error: 'Hotel not found' });
    }
  } catch (error) {
    console.error('Error fetching hotel menu:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/hotels', async (req, res) => {
  try {
    const hotels = await Hotel.find({ isActive: true }).select('name');
    const hotelNames = hotels.map(hotel => hotel.name);
    res.json(hotelNames);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/hotel-info/:hotelName', async (req, res) => {
  try {
    const hotelName = req.params.hotelName;
    const hotel = await Hotel.findOne({ name: hotelName, isActive: true });
    
    if (hotel) {
      const hotelInfo = {
        name: hotel.name,
        location: hotel.location,
        description: hotel.description,
        menu: hotel.menu
      };
      res.json(hotelInfo);
    } else {
      res.status(404).json({ error: 'Hotel not found' });
    }
  } catch (error) {
    console.error('Error fetching hotel info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin API Routes for managing hotels
app.post('/api/hotels', async (req, res) => {
  try {
    const { name, location, description, menu } = req.body;
    const hotel = new Hotel({
      name,
      location,
      description,
      menu
    });
    
    const savedHotel = await hotel.save();
    res.status(201).json(savedHotel);
  } catch (error) {
    console.error('Error creating hotel:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/hotels/:hotelName', async (req, res) => {
  try {
    const hotelName = req.params.hotelName;
    const updateData = req.body;
    
    const hotel = await Hotel.findOneAndUpdate(
      { name: hotelName },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (hotel) {
      res.json(hotel);
    } else {
      res.status(404).json({ error: 'Hotel not found' });
    }
  } catch (error) {
    console.error('Error updating hotel:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/hotels/:hotelName', async (req, res) => {
  try {
    const hotelName = req.params.hotelName;
    const hotel = await Hotel.findOneAndDelete({ name: hotelName });
    
    if (hotel) {
      res.json({ message: 'Hotel deleted successfully' });
    } else {
      res.status(404).json({ error: 'Hotel not found' });
    }
  } catch (error) {
    console.error('Error deleting hotel:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/menu`);
}); 