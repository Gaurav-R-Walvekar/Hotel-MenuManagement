const mongoose = require('mongoose');
require('dotenv').config();

const Hotel = require('../models/Hotel');

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('Database: HotelManagement');
    console.log('Collection: menu');
    
    // Use MONGO_URI to match the user's preferred format
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('MONGO_URI:', mongoUri);
    }
    
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable is not set');
    }
    
    await mongoose.connect(mongoUri, {
      dbName: 'HotelManagement' // Explicitly specify the database name
    });
    console.log('✅ Connection successful to HotelManagement database!');
    
    // Test basic database operations
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Available collections:', collections.map(c => c.name));
    
    // Test if we can access the menu collection
    const count = await Hotel.countDocuments();
    console.log(`📊 Hotels in menu collection: ${count}`);
    
    if (count > 0) {
      const sampleHotel = await Hotel.findOne();
      console.log('🏨 Sample hotel:', sampleHotel.name);
    }
    
    console.log('🎉 All tests passed! Your MongoDB connection is working correctly.');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    
    if (error.code === 8000) {
      console.log('\n🔧 Troubleshooting steps:');
      console.log('1. Check your .env file has the correct MONGO_URI');
      console.log('2. Verify your MongoDB password is correct');
      console.log('3. Ensure your IP address is whitelisted in MongoDB Atlas');
      console.log('4. Check that your MongoDB Atlas cluster is running');
    }
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  }
}

// Run test if this script is executed directly
if (require.main === module) {
  testConnection();
}

module.exports = { testConnection }; 