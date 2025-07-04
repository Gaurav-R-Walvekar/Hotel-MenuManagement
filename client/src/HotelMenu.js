import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Hotel, ChevronDown, ChevronUp, Search, Filter, Menu } from 'lucide-react';
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
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const categoryRefs = useRef({});
  const [hotelInfo, setHotelInfo] = useState(null);
  const [language, setLanguage] = useState('english');

  useEffect(() => {
    fetchHotelInfo();
  }, [hotelName]);

  useEffect(() => {
    if (hotelData && hotelData[language]) {
      applyFilters();
    }
  }, [hotelData, language]);

  useEffect(() => {
    if (hotelData && hotelData[language]) {
      applyFilters();
    }
  }, [searchTerm, vegFilter, language]);

  const fetchHotelInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${config.API_BASE_URL}/api/hotel-info/${encodeURIComponent(hotelName)}`);
      if (!response.data || !response.data.menu) {
        throw new Error('No data received from API');
      }
      setHotelInfo(response.data);
      setHotelData(response.data.menu);
      // Initialize all categories as expanded for the default language
      const initialCollapsedState = {};
      const defaultLangMenu = response.data.menu['english'] || Object.values(response.data.menu)[0];
      if (defaultLangMenu && typeof defaultLangMenu === 'object') {
        Object.keys(defaultLangMenu).forEach(category => {
          initialCollapsedState[category] = false;
        });
      }
      setCollapsedCategories(initialCollapsedState);
    } catch (err) {
      setError(`Hotel not found or failed to load menu: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (!hotelData || !hotelData[language]) return;
    const langMenu = hotelData[language];
    let filtered = { ...langMenu };
    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = {};
      Object.entries(langMenu).forEach(([category, items]) => {
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
    setFilteredData(filtered);
  };

  const isVegItem = (itemName, category) => {
    const itemLower = itemName.toLowerCase();
    const categoryLower = category.toLowerCase();
    
    // Common non-veg indicators
    const nonVegKeywords = [
      'chicken', 'mutton', 'beef', 'pork', 'fish', 'shrimp', 'prawn', 'crab', 'lobster',
      'egg', 'meat', 'lamb', 'duck', 'turkey', 'bacon', 'sausage', 'ham', 'salmon',
      'tuna', 'cod', 'tilapia', 'shark', 'squid', 'octopus', 'clam', 'oyster', 'mussel',
      'चिकन', 'मटन', 'बीफ', 'सुअर का मांस', 'मछली', 'झींगा', 'झींगा', 'केकड़ा', 'झींगा लॉब्स्टर',
      'अंडा', 'मांस', 'मेमने का मांस', 'बत्तख', 'टर्की', 'बेकन', 'सॉसेज', 'हैम', 'सालमन मछली', 'टूना मछली',
      'कॉड मछली', 'तिलापिया मछली', 'शार्क मछली', 'स्क्विड', 'ऑक्टोपस', 'क्लैम', 'ऑइस्टर', 'मसल',
      'चिकन', 'मटण', 'बीफ', 'डुकराचे मांस', 'मासे', 'झिंगा', 'कोळंबी', 'खेकडा', 'लॉब्स्टर', 'अंडे'
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

  // Scroll to category
  const scrollToCategory = (category) => {
    setShowCategorySelector(false);
    const ref = categoryRefs.current[category];
    if (ref && ref.scrollIntoView) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // When language changes, reset collapsed categories for new language
  useEffect(() => {
    if (hotelData && hotelData[language]) {
      const newCollapsed = {};
      Object.keys(hotelData[language]).forEach(category => {
        newCollapsed[category] = false;
      });
      setCollapsedCategories(newCollapsed);
    }
  }, [language, hotelData]);

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

  const displayData = filteredData || (hotelData && hotelData[language]);
  const hasActiveFilters = searchTerm.trim() || vegFilter !== 'all';

  console.log('Display data:', displayData);
  console.log('Display data keys:', Object.keys(displayData || {}));
  console.log('Has active filters:', hasActiveFilters);

  return (
    <div className="App">
      {/* Floating Category Button */}
      <button
        className="floating-category-btn"
        onClick={() => setShowCategorySelector((v) => !v)}
        aria-label="Select Category"
      >
        <Menu size={32} />
      </button>
      {showCategorySelector && (
        <div className="floating-category-list">
          {Object.keys(displayData || {}).map((category) => (
            <button
              key={category}
              className="category-list-btn"
              onClick={() => scrollToCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="hotel-info">
              <h1>
                <Hotel className="header-icon" />
                {hotelName}
              </h1>
              <p>{hotelInfo && hotelInfo.location ? hotelInfo.location : ''}</p>
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
            {/* Language Dropdown in filter section */}
            <div className="language-dropdown-container">
              <select
                className="language-dropdown"
                value={language}
                onChange={e => setLanguage(e.target.value)}
              >
                <option value="english">English</option>
                <option value="hindi">हिंदी</option>
                <option value="marathi">मराठी</option>
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
                <div
                  key={category}
                  className="category-card"
                  ref={el => (categoryRefs.current[category] = el)}
                >
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
                    {Object.entries(items).map(([itemName, price]) => {
                      let displayName = itemName;
                      let itemCategoryValue = category;
                      if (itemName.includes('!')) {
                        const [before, after] = itemName.split('!');
                        displayName = before;
                        itemCategoryValue = after;
                      }
                      return (
                        <div key={itemName} className="menu-item">
                          <div className="item-info">
                            {getVegIcon(itemName, category)}
                            <div className="item-details">
                              <h4 className="item-name">{displayName}</h4>
                              <span className="item-category" style={{ display: 'inline-block', width: '185px', wordBreak: 'break-word', whiteSpace: 'normal', verticalAlign: 'top' }}>{itemCategoryValue}</span>
                            </div>
                          </div>
                          <div className="item-price">₹{price}</div>
                        </div>
                      );
                    })}
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