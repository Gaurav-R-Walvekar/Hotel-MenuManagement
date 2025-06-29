import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HotelMenu from './HotelMenu';
import HomePage from './HomePage';
import AdminPage from './AdminPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/AdmineUsersOnly" element={<AdminPage />} />
          <Route path="/:hotelName" element={<HotelMenu />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 