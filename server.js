const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// Read menu data
const getMenuData = () => {
  try {
    const menuData = fs.readFileSync(path.join(__dirname, 'menu.json'), 'utf8');
    return JSON.parse(menuData);
  } catch (error) {
    console.error('Error reading menu.json:', error);
    return { hotels: {} };
  }
};

// API Routes
app.get('/api/menu', (req, res) => {
  const menuData = getMenuData();
  res.json(menuData.hotels);
});

app.get('/api/menu/:hotelName', (req, res) => {
  const menuData = getMenuData();
  const hotelName = req.params.hotelName;
  
  if (menuData.hotels && menuData.hotels[hotelName]) {
    res.json(menuData.hotels[hotelName].menu);
  } else {
    res.status(404).json({ error: 'Hotel not found' });
  }
});

app.get('/api/hotels', (req, res) => {
  const menuData = getMenuData();
  const hotels = menuData.hotels ? Object.keys(menuData.hotels) : [];
  res.json(hotels);
});

app.get('/api/hotel-info/:hotelName', (req, res) => {
  const menuData = getMenuData();
  const hotelName = req.params.hotelName;
  
  if (menuData.hotels && menuData.hotels[hotelName]) {
    const hotelInfo = {
      name: hotelName,
      location: menuData.hotels[hotelName].location,
      menu: menuData.hotels[hotelName].menu
    };
    res.json(hotelInfo);
  } else {
    res.status(404).json({ error: 'Hotel not found' });
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