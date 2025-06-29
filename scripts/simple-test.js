const { MongoClient } = require('mongodb');
require('dotenv').config();

async function simpleTest() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in environment variables');
    console.log('Make sure your .env file exists and contains MONGODB_URI');
    return;
  }
  
  console.log('Testing connection with URI:', uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
  
  try {
    // Try different connection options
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    
    console.log('Attempting to connect...');
    await client.connect();
    console.log('✅ Connection successful!');
    
    const db = client.db('hotelmanagement');
    console.log('Database accessed successfully');
    
    // Test a simple operation
    const collections = await db.listCollections().toArray();
    console.log('Collections found:', collections.map(c => c.name));
    
    await client.close();
    console.log('Connection closed');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error code:', error.code);
    console.error('Error name:', error.name);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n🔧 Authentication troubleshooting:');
      console.log('1. Check if the password is correct');
      console.log('2. Check if the username is correct');
      console.log('3. Check if your IP (103.187.81.93) is whitelisted');
      console.log('4. Try creating a new database user in MongoDB Atlas');
    }
  }
}

simpleTest(); 