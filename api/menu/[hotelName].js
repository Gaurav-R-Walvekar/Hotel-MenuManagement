const fs = require('fs');
const path = require('path');

// Read menu data
const getMenuData = () => {
  try {
    const menuData = fs.readFileSync(path.join(process.cwd(), 'menu.json'), 'utf8');
    return JSON.parse(menuData);
  } catch (error) {
    console.error('Error reading menu.json:', error);
    return { hotels: {} };
  }
};

module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    const menuData = getMenuData();
    const hotelName = req.query.hotelName || req.params.hotelName;
    
    if (menuData.hotels && menuData.hotels[hotelName]) {
      res.status(200).json(menuData.hotels[hotelName].menu);
    } else {
      res.status(404).json({ error: 'Hotel not found' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}; 