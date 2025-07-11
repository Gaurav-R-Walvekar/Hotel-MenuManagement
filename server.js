const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const Hotel = require('./models/Hotel');

const app = express();
const PORT = process.env.PORT || 5000;

// Utility function to format dates
function formatDate(date) {
  if (!date) return null;
  
  // Format as YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

// Middleware
app.use(cors());
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
    app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on http://0.0.0.0:${PORT}`));
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
    const hotel = await Hotel.findOne({ name: { $regex: `^${hotelName}$`, $options: 'i' } });
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
    const hotel = await Hotel.findOne({ name: { $regex: `^${hotelName}$`, $options: 'i' } });
   
    if (hotel) {
      const currentDate = new Date();
      const expirationDate = hotel.expiration_date;
      
      // Check if expiration date exists and is in the past
      if (expirationDate && expirationDate < currentDate) {
        // If auto_update_expiration_date is true, update the expiration date
        if (hotel.auto_update_expiration_date) {
          const newExpirationDate = new Date(expirationDate);
          newExpirationDate.setMonth(newExpirationDate.getMonth() + 1);
          
          // Update the hotel document with new expiration date
          await Hotel.findByIdAndUpdate(hotel._id, {
            expiration_date: newExpirationDate
          });
          
          console.log(`✅ Auto-updated expiration date for ${hotelName} to ${newExpirationDate}`);
        } else {
          // Auto-update is disabled, return maintenance status
          const hotelInfo = {
            name: hotel.name,
            location: hotel.location,
            auto_update_expiration_date: hotel.auto_update_expiration_date,
            created_at: formatDate(hotel.createdAt),
            expiration_date: formatDate(hotel.expiration_date),
            menu: hotel.menu,
            under_maintenance: true,
            maintenance_message: "Site is under maintenance. Please contact the administrator."
          };
          console.log(`⚠️ Hotel ${hotelName} is under maintenance (expiration date: ${expirationDate})`);
          return res.json(hotelInfo);
        }
      }
      
      const hotelInfo = {
        name: hotel.name,
        location: hotel.location,
        auto_update_expiration_date: hotel.auto_update_expiration_date,
        created_at: hotel.created_at,
        expiration_date: formatDate(hotel.expiration_date),
        menu: hotel.menu,
        under_maintenance: false
      };
      console.log('Fetching hotel info for:', hotelInfo);
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
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, 'client/build');
  const indexPath = path.join(buildPath, 'index.html');
  
  // Check if build directory exists
  const fs = require('fs');
  if (fs.existsSync(buildPath)) {
    console.log('✅ React build directory found');
    app.use(express.static(buildPath));
    
    app.get('*', (req, res) => {
      res.sendFile(indexPath);
    });
  } else {
    console.error('❌ React build directory not found at:', buildPath);
    console.error('Make sure to run: npm run build before deploying');
    
    // Fallback: serve a simple message
    app.get('*', (req, res) => {
      res.status(500).json({ 
        error: 'React build not found', 
        message: 'Please ensure the client is built before deployment',
        path: buildPath
      });
    });
  }
} 