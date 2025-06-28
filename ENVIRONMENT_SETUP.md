# Environment Setup Instructions

## MongoDB Atlas Configuration

Your MongoDB Atlas connection string is:
```
mongodb+srv://kishanx08:<db_password>@paletocluster.siendi6.mongodb.net/hotel_menu_db?retryWrites=true&w=majority&appName=paletoCluster
```

## Setup Steps:

### 1. Replace `<db_password>` with your actual password
Edit `config.env` and replace `<db_password>` with your MongoDB Atlas database password.

### 2. For Local Development
Your `config.env` should look like:
```
MONGODB_URI=mongodb+srv://kishanx08:your_actual_password@paletocluster.siendi6.mongodb.net/hotel_menu_db?retryWrites=true&w=majority&appName=paletoCluster
NODE_ENV=development
PORT=5000
```

### 3. For Render Deployment
Add these environment variables in your Render dashboard:
- `MONGODB_URI`: Your complete connection string with password
- `NODE_ENV`: `production`
- `PORT`: Render will set this automatically

### 4. Initialize Database
After setting up the environment, run:
```bash
npm run init-db
```

## Security Notes:
- Never commit your actual password to Git
- Use environment variables for sensitive data
- The `config.env` file is already in `.gitignore`

## Testing Connection
To test if your MongoDB connection works:
```bash
npm start
```

You should see: "MongoDB Connected: paletocluster.siendi6.mongodb.net" 