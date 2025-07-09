import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HotelMenu from './HotelMenu';
import HomePage from './HomePage';
import AdminPage from './AdminPage';
import Footer from './Footer';
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
      <Footer />
    </Router>
  );
}

export default App; 