import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Hotel, ChevronDown, ChevronUp, Search, Filter } from 'lucide-react';
import config from './config';

function HotelMenu() {
  const { hotelName } = useParams();
  const navigate = useNavigate();
  const [hotelData, setHotelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [vegFilter, setVegFilter] = useState('all'); // 'all', 'veg', 'non-veg'
  const [filteredData, setFilteredData] = useState(null);

  useEffect(() => {
    fetchHotelMenu();
  }, [hotelName]);

  useEffect(() => {
    if (hotelData) {
      applyFilters();
    }
  }, [hotelData]);

  useEffect(() => {
    if (hotelData) {
      applyFilters();
    }
  }, [searchTerm, vegFilter]);

  const fetchHotelMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching menu for hotel:', hotelName);
      const response = await axios.get(`${config.API_BASE_URL}/api/menu/${encodeURIComponent(hotelName)}`);
      console.log('API Response:', response);
      console.log('Response data:', response.data);
      console.log('Response data type:', typeof response.data);
      console.log('Response data keys:', Object.keys(response.data || {}));
      
      if (!response.data) {
        throw new Error('No data received from API');
      }
      
      setHotelData(response.data);
      // Initialize all categories as expanded
      const initialCollapsedState = {};
      if (response.data && typeof response.data === 'object') {
        Object.keys(response.data).forEach(category => {
          initialCollapsedState[category] = false;
        });
      }
      setCollapsedCategories(initialCollapsedState);
    } catch (err) {
      console.error('Error details:', err);
      console.error('Error response:', err.response);
      setError(`Hotel not found or failed to load menu: ${err.message}`);
      console.error('Error fetching hotel menu:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (!hotelData) return;

    console.log('Applying filters with hotelData:', hotelData);
    console.log('Search term:', searchTerm);
    console.log('Veg filter:', vegFilter);

    let filtered = { ...hotelData };

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = {};
      
      Object.entries(hotelData).forEach(([category, items]) => {
        const filteredItems = {};
        Object.entries(items).forEach(([itemName, price]) => {
          if (itemName.toLowerCase().includes(searchLower)) {
            filteredItems[itemName] = price;
          }
        });
        if (Object.keys(filteredItems).length > 0) {
          filtered[category] = filteredItems;
        }
      });
    }

    // Apply veg/non-veg filter
    if (vegFilter !== 'all') {
      const vegFiltered = {};
      
      Object.entries(filtered).forEach(([category, items]) => {
        const filteredItems = {};
        Object.entries(items).forEach(([itemName, price]) => {
          const isVeg = isVegItem(itemName, category);
          if ((vegFilter === 'veg' && isVeg) || (vegFilter === 'non-veg' && !isVeg)) {
            filteredItems[itemName] = price;
          }
        });
        if (Object.keys(filteredItems).length > 0) {
          vegFiltered[category] = filteredItems;
        }
      });
      
      filtered = vegFiltered;
    }

    console.log('Final filtered data:', filtered);
    setFilteredData(filtered);
  };

  const isVegItem = (itemName, category) => {
    const itemLower = itemName.toLowerCase();
    const categoryLower = category.toLowerCase();
    
    // Common non-veg indicators
    const nonVegKeywords = [
      'chicken', 'mutton', 'beef', 'pork', 'fish', 'shrimp', 'prawn', 'crab', 'lobster',
      'egg', 'meat', 'lamb', 'duck', 'turkey', 'bacon', 'sausage', 'ham', 'salmon',
      'tuna', 'cod', 'tilapia', 'shark', 'squid', 'octopus', 'clam', 'oyster', 'mussel'
    ];
    
    // Check if item name contains non-veg keywords
    const hasNonVegKeyword = nonVegKeywords.some(keyword => 
      itemLower.includes(keyword)
    );
    
    // Check if category name indicates non-veg
    const isNonVegCategory = categoryLower.includes('non-veg') || 
                           categoryLower.includes('chicken') || 
                           categoryLower.includes('mutton') || 
                           categoryLower.includes('seafood') ||
                           categoryLower.includes('meat');
    
    return !hasNonVegKeyword && !isNonVegCategory;
  };

  const toggleCategory = (category) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setVegFilter('all');
  };

  const getVegIcon = (itemName, category) => {
    const isVeg = isVegItem(itemName, category);
    return (
      <span className={`veg-indicator ${isVeg ? 'veg' : 'non-veg'}`}>
        {isVeg ? '🟢' : '🔴'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading menu data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const displayData = filteredData || hotelData;
  const hasActiveFilters = searchTerm.trim() || vegFilter !== 'all';

  console.log('Display data:', displayData);
  console.log('Display data keys:', Object.keys(displayData || {}));
  console.log('Has active filters:', hasActiveFilters);

  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="hotel-info">
              <h1>
                <Hotel className="header-icon" />
                {hotelName}
              </h1>
              <p>Delicious menu offerings</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container">
        {/* Search and Filter Controls */}
        <div className="filter-section">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-controls">
            <div className="veg-filter">
              <Filter className="filter-icon" />
              <select
                value={vegFilter}
                onChange={(e) => setVegFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Items</option>
                <option value="veg">🟢 Vegetarian Only</option>
                <option value="non-veg">🔴 Non-Vegetarian Only</option>
              </select>
            </div>
            
            {hasActiveFilters && (
              <button 
                className="btn btn-secondary clear-filters"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Menu Display */}
        <div className="menu-container">
          <h2 className="menu-title">Menu</h2>
          
          {Object.keys(displayData || {}).length === 0 ? (
            <div className="no-results">
              <p>No items found matching your filters.</p>
              <button 
                className="btn btn-primary"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="menu-grid">
              {Object.entries(displayData).map(([category, items]) => (
                <div key={category} className="category-card">
                  <div 
                    className="category-header"
                    onClick={() => toggleCategory(category)}
                  >
                    <div className="category-info">
                      <h3 className="category-title">{category}</h3>
                      <span className="category-count">{Object.keys(items).length} items</span>
                    </div>
                    <div className="category-toggle">
                      {collapsedCategories[category] ? (
                        <ChevronDown className="toggle-icon" />
                      ) : (
                        <ChevronUp className="toggle-icon" />
                      )}
                    </div>
                  </div>
                  <div className={`items-list ${collapsedCategories[category] ? 'collapsed' : ''}`}>
                    {Object.entries(items).map(([itemName, price]) => (
                      <div key={itemName} className="menu-item">
                        <div className="item-info">
                          {getVegIcon(itemName, category)}
                          <div className="item-details">
                            <h4 className="item-name">{itemName}</h4>
                            <span className="item-category">{category}</span>
                          </div>
                        </div>
                        <div className="item-price">₹{price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Hotel Menu Management. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default HotelMenu; 