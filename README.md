# Hotel Menu Management System

A modern, attractive hotel menu management application built with Node.js and React. This application displays hotel menus with total items count, categories, and average pricing information.

## Features

- 🏨 **Multi-Hotel Support**: View menus from multiple hotels
- 📊 **Statistics Dashboard**: Total items, categories, and average price calculations
- 🎨 **Modern UI**: Beautiful, responsive design with gradient backgrounds
- 📱 **Mobile Responsive**: Works perfectly on all device sizes
- ⚡ **Real-time Data**: Dynamic menu loading from JSON file
- 🔄 **Interactive Elements**: Hover effects and smooth transitions

## Project Structure

```
Hotel-MenuManagement/
├── server.js              # Node.js Express server
├── menu.json              # Menu data in JSON format
├── package.json           # Backend dependencies
├── client/                # React frontend
│   ├── public/
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # Component styles
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   └── package.json       # Frontend dependencies
└── README.md
```

## Menu Data Format

The `menu.json` file follows this structure:
```json
{
  "Hotel Name": {
    "Category": {
      "Item Name": price,
      "Another Item": price
    }
  }
}
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Backend Setup
1. Install backend dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```
   or for development with auto-restart:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

### Quick Start (All-in-one)
Run this command from the root directory to install all dependencies and start both servers:
```bash
npm install && npm run install-client && npm run dev
```

## Usage

1. **Access the Application**: Open your browser and go to `http://localhost:3000`
2. **Select Hotel**: Use the dropdown to choose from available hotels
3. **View Statistics**: See total items, categories, and average price
4. **Browse Menu**: Explore menu items organized by categories

## API Endpoints

- `GET /api/menu` - Get all menu data
- `GET /api/menu/:hotelName` - Get menu for specific hotel
- `GET /api/hotels` - Get list of all hotels

## Technologies Used

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **CORS**: Cross-origin resource sharing
- **File System**: JSON data reading

### Frontend
- **React**: UI library
- **Axios**: HTTP client
- **Lucide React**: Icon library
- **CSS3**: Modern styling with gradients and animations

## Customization

### Adding New Hotels
Edit the `menu.json` file to add new hotels:
```json
{
  "New Hotel Name": {
    "Category Name": {
      "Item Name": 25.99
    }
  }
}
```

### Styling
- Modify `client/src/App.css` for component-specific styles
- Modify `client/src/index.css` for global styles
- The app uses a purple gradient theme that can be customized

## Development

### Available Scripts

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

**Frontend:**
- `npm start` - Start React development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Deployment

1. Build the React app:
   ```bash
   cd client
   npm run build
   ```

2. The built files will be served by the Express server at `http://localhost:5000`

## License

MIT License - feel free to use this project for your own hotel menu management needs!
