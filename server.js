const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const Hotel = require('./models/Hotel');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for Vercel deployment
const corsOptions = {
  origin: [
    'http://localhost:3000', // Local development
    'https://hotel-menu-management.vercel.app', // Replace with your Vercel domain
    process.env.FRONTEND_URL // Environment variable for frontend URL
  ].filter(Boolean), // Remove undefined values
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB - HotelManagement database
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('❌ MongoDB connection string not found!');
  console.error('Please set either MONGO_URI or MONGODB_URI environment variable.');
  console.error('You can create a .env file with your MongoDB connection string.');
  process.exit(1);
}

if (process.env.NODE_ENV !== 'production') {
  console.log('MONGO_URI:', mongoUri);
  console.log('Database: HotelManagement');
  console.log('Collection: menu');
  mongoose.set('debug', true);
} else {
  mongoose.set('debug', false);
}

mongoose.connect(mongoUri, {
  dbName: 'HotelManagement' // Explicitly specify the database name
})
  .then(() => {
    console.log('✅ MongoDB connected to HotelManagement database');
    console.log('📊 Using menu collection');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// API Routes
app.get('/api/menu', async (req, res) => {
  try {
    const hotels = await Hotel.find({});
    
    const hotelsData = {};
    hotels.forEach(hotel => {
      hotelsData[hotel.name] = {
        location: hotel.location,
        menu: hotel.menu
      };
    });
    
    res.json(hotelsData);
  } catch (error) {
    console.error('Error fetching menu data:', error);
    res.status(500).json({ error: 'Failed to fetch menu data' });
  }
});

app.get('/api/menu/:hotelName', async (req, res) => {
  try {
    const hotelName = req.params.hotelName;
    const hotel = await Hotel.findOne({ name: hotelName });
    console.log('Fetching menu for hotel:', hotelName);
    if (hotel) {
      res.json(hotel.menu);
    } else {
      res.status(404).json({ error: 'Hotel not found' });
    }
  } catch (error) {
    console.error('Error fetching hotel menu:', error);
    res.status(500).json({ error: 'Failed to fetch hotel menu' });
  }
});

app.get('/api/hotels', async (req, res) => {
  try {
    const hotels = await Hotel.find({}, 'name');
    const hotelNames = hotels.map(hotel => hotel.name);
    res.json(hotelNames);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
});

app.get('/api/hotel-info/:hotelName', async (req, res) => {
  try {
    const hotelName = req.params.hotelName;
    const hotel = await Hotel.findOne({ name: hotelName });
    
    if (hotel) {
      const hotelInfo = {
        name: hotel.name,
        location: hotel.location,
        menu: hotel.menu
      };
      res.json(hotelInfo);
    } else {
      res.status(404).json({ error: 'Hotel not found' });
    }
  } catch (error) {
    console.error('Error fetching hotel info:', error);
    res.status(500).json({ error: 'Failed to fetch hotel info' });
  }
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Remove static file serving since frontend will be on Vercel
// The server now only serves API endpoints 