require('dotenv').config();
const { MongoClient } = require('mongodb');

// MongoDB connection string from environment variable
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://gaurav2851997:YOUR_PASSWORD@hotelmanagement.eork9td.mongodb.net/?retryWrites=true&w=majority&appName=HotelManagement';

// Database name from environment variable
const DB_NAME = process.env.DB_NAME || 'hotelmanagement';

let client = null;
let db = null;

// Connect to MongoDB
async function connectToDatabase() {
  try {
    if (client) {
      return db;
    }

    console.log('Attempting to connect to MongoDB...');
    console.log('Database URI:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials in logs
    
    client = new MongoClient(MONGODB_URI);

    await client.connect();
    console.log('Connected to MongoDB successfully');
    
    db = client.db(DB_NAME);
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    
    // Provide specific error messages for common issues
    if (error.code === 8000) {
      console.error('Authentication failed. Please check:');
      console.error('1. Your MongoDB password is correct');
      console.error('2. Your username is correct');
      console.error('3. Your IP address is whitelisted in MongoDB Atlas');
    } else if (error.code === 'ENOTFOUND') {
      console.error('Could not resolve MongoDB host. Please check:');
      console.error('1. Your internet connection');
      console.error('2. The MongoDB URI is correct');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused. Please check:');
      console.error('1. MongoDB Atlas cluster is running');
      console.error('2. Your IP address is whitelisted');
    }
    
    throw error;
  }
}

// Get database instance
async function getDatabase() {
  if (!db) {
    db = await connectToDatabase();
  }
  return db;
}

// Close database connection
async function closeDatabase() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('MongoDB connection closed');
  }
}

module.exports = {
  connectToDatabase,
  getDatabase,
  closeDatabase
}; 