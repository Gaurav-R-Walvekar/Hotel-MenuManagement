# MongoDB Setup Guide

## Option 1: Local MongoDB (Development)

### Install MongoDB Community Edition
1. Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Install and start MongoDB service
3. Update `config.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/hotel_menu_db
   ```

## Option 2: MongoDB Atlas (Production/Cloud)

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new project

### 2. Create Database Cluster
1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select cloud provider and region
4. Click "Create"

### 3. Set Up Database Access
1. Go to "Database Access"
2. Click "Add New Database User"
3. Create username and password
4. Select "Read and write to any database"
5. Click "Add User"

### 4. Set Up Network Access
1. Go to "Network Access"
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add specific IP addresses
5. Click "Confirm"

### 5. Get Connection String
1. Go to "Database" → "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Update `config.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hotel_menu_db?retryWrites=true&w=majority
   ```

## Initialize Database

### Run the initialization script:
```bash
npm run init-db
```

This will:
- Connect to MongoDB
- Clear existing data
- Import all hotels from `menu.json`
- Display a summary of imported data

## Environment Variables

Create `config.env` file:
```
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
PORT=5000
```

## API Endpoints

### Read Operations
- `GET /api/menu` - Get all hotels
- `GET /api/menu/:hotelName` - Get specific hotel menu
- `GET /api/hotels` - Get list of hotels
- `GET /api/hotel-info/:hotelName` - Get hotel information

### Admin Operations (New)
- `POST /api/hotels` - Create new hotel
- `PUT /api/hotels/:hotelName` - Update hotel
- `DELETE /api/hotels/:hotelName` - Delete hotel

## Database Schema

### Hotel Document
```javascript
{
  name: String (required, unique),
  location: String (required),
  description: String,
  menu: [Category],
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Category Document
```javascript
{
  name: String (required),
  items: [MenuItem]
}
```

### MenuItem Document
```javascript
{
  name: String (required),
  price: Number (required),
  description: String,
  isVeg: Boolean (default: true),
  isAvailable: Boolean (default: true)
}
```

## Troubleshooting

### Connection Issues
- Check if MongoDB service is running
- Verify connection string format
- Ensure network access is configured (for Atlas)
- Check username/password (for Atlas)

### Data Import Issues
- Ensure `menu.json` exists and is valid JSON
- Check file permissions
- Verify database user has write permissions

### Performance Tips
- Use indexes for frequently queried fields
- Consider pagination for large datasets
- Use projection to limit returned fields 