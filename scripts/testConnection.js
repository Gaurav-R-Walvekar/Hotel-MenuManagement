const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔗 Connection URL: ${process.env.MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);
    
    // Test a simple query
    const Hotel = require('../models/Hotel');
    const hotelCount = await Hotel.countDocuments();
    console.log(`🏨 Hotels in database: ${hotelCount}`);
    
    return conn;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check if your password is correct in config.env');
    console.log('2. Ensure your IP is whitelisted in MongoDB Atlas');
    console.log('3. Verify the connection string format');
    process.exit(1);
  }
};

const testConnection = async () => {
  try {
    await connectDB();
    console.log('\n🎉 Connection test successful!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    process.exit(1);
  }
};

// Run the test
testConnection(); 