# MongoDB Setup Guide

This guide will help you connect your Hotel Menu Management system to MongoDB.

## Prerequisites

1. MongoDB Atlas account
2. A MongoDB cluster set up
3. Your database password

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory with the following content:

```env
MONGODB_URI=mongodb+srv://gaurav2851997:YOUR_ACTUAL_PASSWORD@hotelmanagement.eork9td.mongodb.net/?retryWrites=true&w=majority&appName=HotelManagement
DB_NAME=hotelmanagement
PORT=5000
```

**Important:** Replace `YOUR_ACTUAL_PASSWORD` with your actual MongoDB password.

### 2. Install Dependencies

The required dependencies have already been installed:
- `mongodb` - MongoDB driver for Node.js
- `dotenv` - Environment variable management

### 3. Migrate Data

Run the migration script to transfer your existing menu data from `menu.json` to MongoDB:

```bash
npm run migrate
```

This will:
- Connect to your MongoDB database
- Clear any existing data in the `hotels` collection
- Import all hotels from your `menu.json` file
- Display the migrated hotels

### 4. Start the Server

Start your server with MongoDB connection:

```bash
npm start
```

Or for development with auto-restart:

```bash
npm run dev
```

## Database Structure

The data will be stored in MongoDB with the following structure:

```javascript
{
  name: "Hotel_Name",
  location: "Hotel_Location",
  menu: {
    "Category_Name": {
      "Item_Name": price
    }
  }
}
```

## API Endpoints

All existing API endpoints remain the same but now fetch data from MongoDB:

- `GET /api/menu` - Get all hotels and their menus
- `GET /api/menu/:hotelName` - Get menu for a specific hotel
- `GET /api/hotels` - Get list of all hotel names
- `GET /api/hotel-info/:hotelName` - Get complete hotel information

## Troubleshooting

### Connection Issues

1. **Authentication Error**: Make sure your password is correct in the connection string
2. **Network Error**: Ensure your IP address is whitelisted in MongoDB Atlas
3. **Database Not Found**: The database will be created automatically if it doesn't exist

### Migration Issues

1. **File Not Found**: Ensure `menu.json` exists in the root directory
2. **Permission Error**: Make sure you have write permissions to the database

## Security Notes

- Never commit your `.env` file to version control
- Use strong passwords for your MongoDB user
- Consider using MongoDB Atlas IP whitelist for additional security
- The `.env` file is already in `.gitignore` to prevent accidental commits 