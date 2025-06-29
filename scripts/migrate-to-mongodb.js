const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const Hotel = require('../models/Hotel');

async function migrateData() {
  try {
    console.log('Starting data migration to MongoDB...');
    console.log('Database: HotelManagement');
    console.log('Collection: menu');
    
    // Read the JSON file
    const menuDataPath = path.join(__dirname, '../menu.json');
    const menuData = JSON.parse(fs.readFileSync(menuDataPath, 'utf8'));
    
    // Connect to MongoDB using Mongoose
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('MONGO_URI:', mongoUri);
    }
    
    await mongoose.connect(mongoUri, {
      dbName: 'HotelManagement' // Explicitly specify the database name
    });
    console.log('Connected to HotelManagement database successfully');
    
    // Clear existing data from menu collection
    await Hotel.deleteMany({});
    console.log('Cleared existing data from menu collection');
    
    // Prepare data for MongoDB
    const hotelsToInsert = Object.entries(menuData.hotels).map(([name, data]) => ({
      name: name,
      location: data.location,
      menu: data.menu
    }));
    
    // Insert data into menu collection
    if (hotelsToInsert.length > 0) {
      const result = await Hotel.insertMany(hotelsToInsert);
      console.log(`Successfully migrated ${result.length} hotels to menu collection`);
      
      // Display migrated hotels
      hotelsToInsert.forEach(hotel => {
        console.log(`- ${hotel.name} (${hotel.location})`);
      });
    } else {
      console.log('No hotels found in menu.json');
    }
    
    console.log('Data migration completed successfully!');
    
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateData();
}

module.exports = { migrateData }; 