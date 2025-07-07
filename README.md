# Hotel Menu Management System

A modern, mobile-first hotel menu management system with a Zomato-inspired design. This application allows users to browse restaurant menus, search for specific dishes, filter by dietary preferences, and provides an admin panel for menu management.

## 🎨 Design Features

### Zomato-Inspired Theme
- **Modern UI/UX**: Clean, intuitive interface inspired by Zomato's design language
- **Mobile-First**: Responsive design optimized for mobile devices
- **Color Scheme**: 
  - Primary: `#cb202d` (Zomato Red)
  - Secondary: `#2f3542` (Dark Gray)
  - Accent: `#ffa502` (Orange)
  - Success: `#2ed573` (Green)
  - Warning: `#ff6348` (Red)

### Key Design Elements
- **Card-based Layout**: Clean, organized presentation of information
- **Smooth Animations**: Subtle hover effects and transitions
- **Typography**: Modern, readable font stack
- **Shadows & Depth**: Layered design with proper visual hierarchy
- **Dark Mode Support**: Automatic dark mode detection and styling

## 📱 Mobile-First Features

### Responsive Design
- **Breakpoints**: 
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- **Touch-Friendly**: Large touch targets and intuitive gestures
- **Optimized Layout**: Single-column layout on mobile, multi-column on larger screens

### Mobile Optimizations
- **Sticky Header**: Navigation stays accessible while scrolling
- **Collapsible Categories**: Space-efficient menu organization
- **Search & Filters**: Easy-to-use mobile search interface
- **Loading States**: Clear feedback during data loading

## 🚀 Features

### User Features
- **Restaurant Discovery**: Browse available restaurants
- **Menu Browsing**: View complete menus with categories
- **Search Functionality**: Find specific dishes quickly
- **Dietary Filters**: Filter by vegetarian/non-vegetarian options
- **Price Display**: Clear pricing information
- **Category Organization**: Well-organized menu categories

### Admin Features
- **Dashboard**: Overview of all restaurants and menu items
- **Statistics**: Key metrics and analytics
- **Hotel Management**: Add, edit, and manage restaurants
- **Menu Management**: Update menu items and categories
- **Quick Actions**: Fast access to common admin tasks

## 🛠️ Technical Stack

### Frontend
- **React**: Modern React with hooks
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **Lucide React**: Modern icon library
- **CSS3**: Custom CSS with CSS variables and modern features

### Backend
- **Node.js**: Server runtime
- **Express**: Web framework
- **MongoDB**: Database (with fallback to JSON)
- **CORS**: Cross-origin resource sharing

## 📁 Project Structure

```
Hotel-MenuManagement/
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.js         # Main app component
│   │   ├── App.css        # Zomato-inspired styles
│   │   ├── index.css      # Base styles
│   │   ├── HomePage.js    # Landing page
│   │   ├── HotelMenu.js   # Menu display component
│   │   ├── AdminPage.js   # Admin dashboard
│   │   └── config.js      # API configuration
├── server.js              # Express server
├── models/                # Database models
├── config/                # Server configuration
└── scripts/               # Utility scripts
```

## 🎯 Key Components

### HomePage
- Restaurant listing with cards
- Search and filter functionality
- Responsive grid layout
- Loading and error states

### HotelMenu
- Category-based menu display
- Collapsible sections
- Search and dietary filters
- Veg/non-veg indicators

### AdminPage
- Dashboard with statistics
- Hotel management interface
- Quick action buttons
- Form handling

## 🎨 CSS Architecture

### CSS Variables
```css
:root {
  --primary-color: #cb202d;
  --primary-dark: #a01722;
  --secondary-color: #2f3542;
  --accent-color: #ffa502;
  --success-color: #2ed573;
  --warning-color: #ff6348;
  --text-primary: #2f3542;
  --text-secondary: #747d8c;
  --bg-primary: #ffffff;
  --bg-secondary: #f1f2f6;
  --border-radius: 12px;
  --shadow-light: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

### Responsive Design
- Mobile-first approach
- Flexible grid system
- Adaptive typography
- Touch-friendly interactions

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (optional, falls back to JSON)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Hotel-MenuManagement
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd client && npm install
   ```

3. **Set up environment**
   ```bash
   cp env.template .env
   # Edit .env with your configuration
   ```

4. **Start the application**
   ```bash
   # Start server
   npm start
   
   # In another terminal, start client
   cd client && npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:3000/AdmineUsersOnly

## 📱 Mobile Experience

### Optimized for Mobile
- **Touch Targets**: Minimum 44px touch targets
- **Gestures**: Swipe-friendly interactions
- **Performance**: Optimized loading and rendering
- **Accessibility**: Screen reader friendly

### Mobile Features
- **Responsive Images**: Optimized for different screen sizes
- **Fast Loading**: Minimal bundle size and efficient loading
- **Offline Support**: Graceful handling of network issues
- **Progressive Enhancement**: Works on all devices

## 🎨 Design Principles

### User Experience
- **Simplicity**: Clean, uncluttered interface
- **Consistency**: Uniform design patterns
- **Accessibility**: Inclusive design for all users
- **Performance**: Fast, responsive interactions

### Visual Design
- **Hierarchy**: Clear information architecture
- **Contrast**: High contrast for readability
- **Spacing**: Generous whitespace for breathing room
- **Typography**: Readable, scalable fonts

## 🔧 Customization

### Theme Customization
The theme can be easily customized by modifying CSS variables in `client/src/App.css`:

```css
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
  /* ... other variables */
}
```

### Adding New Features
- Follow the existing component structure
- Use the established CSS classes and patterns
- Maintain mobile-first responsive design
- Test on multiple screen sizes

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on mobile devices
5. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Built with ❤️ and inspired by Zomato's design excellence**
