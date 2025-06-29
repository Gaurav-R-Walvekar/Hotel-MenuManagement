// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://hotel-menumanagement.onrender.com' // Replace with your Render URL
    : 'http://localhost:5000'
  );

export const config = {
  API_BASE_URL,
  // Add other configuration options here
};

export default config; 