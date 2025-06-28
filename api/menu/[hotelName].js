const fs = require('fs');
const path = require('path');

// Read menu data
const getMenuData = () => {
  const possiblePaths = [
    path.join(process.cwd(), 'menu.json'),
    path.join(process.cwd(), '..', 'menu.json'),
    path.join(__dirname, '..', '..', 'menu.json'),
    '/var/task/menu.json',
    './menu.json'
  ];

  for (const filePath of possiblePaths) {
    try {
      console.log('Trying to read menu.json from:', filePath);
      
      if (fs.existsSync(filePath)) {
        console.log('File exists at:', filePath);
        const menuData = fs.readFileSync(filePath, 'utf8');
        console.log('Successfully read menu.json');
        
        const parsedData = JSON.parse(menuData);
        console.log('Available hotels:', Object.keys(parsedData.hotels || {}));
        
        return parsedData;
      } else {
        console.log('File does not exist at:', filePath);
      }
    } catch (error) {
      console.error('Error reading menu.json from', filePath, ':', error);
    }
  }
  
  console.error('Could not find menu.json in any of the attempted paths');
  return { hotels: {} };
};

module.exports = (req, res) => {
  console.log('API function called with params:', req.params);
  console.log('API function called with query:', req.query);
  
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
    
    console.log('Looking for hotel:', hotelName);
    console.log('Available hotels:', Object.keys(menuData.hotels || {}));
    
    if (menuData.hotels && menuData.hotels[hotelName]) {
      console.log('Hotel found, returning menu data');
      res.status(200).json(menuData.hotels[hotelName].menu);
    } else {
      console.log('Hotel not found:', hotelName);
      res.status(404).json({ 
        error: 'Hotel not found',
        requestedHotel: hotelName,
        availableHotels: Object.keys(menuData.hotels || {})
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}; 