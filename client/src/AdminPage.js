import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Hotel, Utensils, DollarSign, Settings, Users, BarChart3, Plus, Edit, Trash2 } from 'lucide-react';
import config from './config';

function AdminPage() {
  const [menuData, setMenuData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      console.log('Fetching menu data from:', `${config.API_BASE_URL}/api/menu`);
      const response = await axios.get(`${config.API_BASE_URL}/api/menu`);
      console.log('Admin API Response:', response);
      console.log('Admin Response data:', response.data);
      setMenuData(response.data);
    } catch (err) {
      console.error('Admin Error details:', err);
      setError('Failed to fetch menu data');
      console.error('Error fetching menu data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalItems = (hotelData) => {
    if (!hotelData || !hotelData.menu) return 0;
    return Object.values(hotelData.menu).reduce((total, category) => {
      return total + Object.keys(category).length;
    }, 0);
  };

  const calculateTotalCategories = (hotelData) => {
    if (!hotelData || !hotelData.menu) return 0;
    return Object.keys(hotelData.menu).length;
  };

  const calculateAveragePrice = (hotelData) => {
    if (!hotelData || !hotelData.menu) return 0;
    let totalPrice = 0;
    let totalItems = 0;
    
    Object.values(hotelData.menu).forEach(category => {
      Object.values(category).forEach(price => {
        totalPrice += price;
        totalItems += 1;
      });
    });
    
    return totalItems > 0 ? (totalPrice / totalItems).toFixed(2) : 0;
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchMenuData}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const hotels = Object.keys(menuData);

  return (
    <div className="App">
      <header className="header admin-header">
        <div className="container">
          <div className="admin-header-content">
            <div className="admin-title">
              <h1>
                <Settings className="header-icon" />
                Admin Dashboard
              </h1>
              <p>Hotel Menu Management System - Admin Panel</p>
            </div>
            <div className="admin-actions">
              <Link to="/" className="btn btn-secondary">
                <Hotel />
                View Public Site
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container">
        {/* Admin Statistics */}
        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <Hotel />
            </div>
            <div className="admin-stat-content">
              <h3>{hotels.length}</h3>
              <p>Total Hotels</p>
            </div>
          </div>
          
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <Utensils />
            </div>
            <div className="admin-stat-content">
              <h3>{Object.values(menuData).reduce((total, hotel) => total + calculateTotalItems(hotel), 0)}</h3>
              <p>Total Menu Items</p>
            </div>
          </div>
          
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <DollarSign />
            </div>
            <div className="admin-stat-content">
              <h3>Rs {(Object.values(menuData).reduce((total, hotel) => total + parseFloat(calculateAveragePrice(hotel)), 0) / hotels.length).toFixed(2)}</h3>
              <p>Average Price Across Hotels</p>
            </div>
          </div>
        </div>

        {/* Hotel Management Section */}
        <div className="admin-section">
          <div className="section-header">
            <h2>
              <BarChart3 />
              Hotel Management
            </h2>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <Plus />
              Add New Hotel
            </button>
          </div>

          {/* Add Hotel Form */}
          {showAddForm && (
            <div className="add-hotel-form">
              <h3>Add New Hotel</h3>
              <div className="form-group">
                <label>Hotel Name:</label>
                <input 
                  type="text" 
                  placeholder="Enter hotel name"
                  className="form-input"
                />
              </div>
              <div className="form-actions">
                <button className="btn btn-primary">Add Hotel</button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Hotels List */}
          <div className="admin-hotels-grid">
            {hotels.map(hotelName => {
              const hotelData = menuData[hotelName];
              return (
                <div key={hotelName} className="admin-hotel-card">
                  <div className="admin-hotel-header">
                    <h3>{hotelName}</h3>
                    <div className="admin-hotel-actions">
                      <button className="action-btn edit-btn">
                        <Edit />
                      </button>
                      <button className="action-btn delete-btn">
                        <Trash2 />
                      </button>
                    </div>
                  </div>
                  
                  {hotelData.location && (
                    <div className="admin-hotel-location">
                      <span>📍 {hotelData.location}</span>
                    </div>
                  )}
                  
                  <div className="admin-hotel-stats">
                    <div className="admin-hotel-stat">
                      <Utensils className="stat-icon-small" />
                      <span>{calculateTotalItems(hotelData)} items</span>
                    </div>
                    <div className="admin-hotel-stat">
                      <Hotel className="stat-icon-small" />
                      <span>{calculateTotalCategories(hotelData)} categories</span>
                    </div>
                    <div className="admin-hotel-stat">
                      <DollarSign className="stat-icon-small" />
                      <span>Rs {calculateAveragePrice(hotelData)} avg</span>
                    </div>
                  </div>

                  <div className="admin-hotel-categories">
                    <h4>Categories:</h4>
                    <div className="category-tags">
                      {hotelData.menu && Object.keys(hotelData.menu).map(category => (
                        <span key={category} className="category-tag">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="admin-hotel-footer">
                    <Link 
                      to={`/${encodeURIComponent(hotelName)}`}
                      className="btn btn-secondary"
                    >
                      View Menu
                    </Link>
                    <button className="btn btn-primary">
                      <Edit />
                      Edit Menu
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="admin-section">
          <h2>
            <Settings />
            Quick Actions
          </h2>
          <div className="quick-actions">
            <button className="quick-action-btn">
              <Plus />
              Add Menu Item
            </button>
            <button className="quick-action-btn">
              <Edit />
              Edit Categories
            </button>
            <button className="quick-action-btn">
              <BarChart3 />
              View Analytics
            </button>
            <button className="quick-action-btn">
              <Users />
              Manage Users
            </button>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Hotel Menu Management - Admin Panel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default AdminPage; 