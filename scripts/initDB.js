const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: './config.env' });

const Hotel = require('../models/Hotel');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

const initializeDatabase = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Read menu.json file
    const menuDataPath = path.join(__dirname, '../menu.json');
    const menuData = JSON.parse(fs.readFileSync(menuDataPath, 'utf8'));

    // Clear existing data
    await Hotel.deleteMany({});
    console.log('Cleared existing hotel data');

    // Insert hotels from menu.json
    const hotels = [];
    for (const [hotelName, hotelData] of Object.entries(menuData.hotels)) {
      const hotel = new Hotel({
        name: hotelName,
        location: hotelData.location || 'Location not specified',
        description: hotelData.description || '',
        menu: hotelData.menu || []
      });
      hotels.push(hotel);
    }

    // Save all hotels
    await Hotel.insertMany(hotels);
    console.log(`Successfully initialized database with ${hotels.length} hotels`);

    // Display summary
    const savedHotels = await Hotel.find({});
    console.log('\n=== Database Summary ===');
    savedHotels.forEach(hotel => {
      console.log(`Hotel: ${hotel.name}`);
      console.log(`Location: ${hotel.location}`);
      console.log(`Categories: ${hotel.menu.length}`);
      const totalItems = hotel.menu.reduce((sum, category) => sum + category.items.length, 0);
      console.log(`Total Items: ${totalItems}`);
      console.log('---');
    });

    console.log('\nDatabase initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

// Run the initialization
initializeDatabase(); 