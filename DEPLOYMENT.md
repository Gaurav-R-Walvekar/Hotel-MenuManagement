# Deploying Hotel Menu Management Backend on Render

This guide will help you deploy your Hotel Menu Management backend on Render.

## Prerequisites

1. **GitHub Repository**: Your code should be in a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **MongoDB Atlas**: Your database should be set up on MongoDB Atlas

## Step 1: Prepare Your Repository

### 1.1 Update Environment Variables
Make sure your `.env` file is not committed to Git (it should be in `.gitignore`).

### 1.2 Build the Frontend
Before deploying, build your React frontend:

```bash
cd client
npm install
npm run build
cd ..
```

### 1.3 Commit and Push
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

## Step 2: Deploy on Render

### 2.1 Create a New Web Service

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Select the repository containing your code

### 2.2 Configure the Service

**Basic Settings:**
- **Name**: `hotel-menu-management-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave empty (if your code is in the root)

**Build & Deploy Settings:**
- **Build Command**: `npm install && cd client && npm install && npm run build && cd ..`
- **Start Command**: `npm start`

### 2.3 Environment Variables

Add these environment variables in Render:

| Key | Value | Description |
|-----|-------|-------------|
| `NODE_ENV` | `production` | Production environment |
| `MONGO_URI` | `your_mongodb_atlas_connection_string` | Your MongoDB Atlas connection string |
| `PORT` | `10000` | Port for Render (will be overridden by Render) |

**Important**: Replace `your_mongodb_atlas_connection_string` with your actual MongoDB Atlas connection string.

### 2.4 Advanced Settings

- **Auto-Deploy**: Enable (recommended)
- **Health Check Path**: `/health`

## Step 3: Update Frontend Configuration

After deployment, update your frontend configuration to use the new API URL:

### 3.1 Update config.js

```javascript
// client/src/config.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-app-name.onrender.com';

export const config = {
  API_BASE_URL,
};

export default config;
```

### 3.2 Rebuild and Deploy Frontend

If you want to deploy the frontend separately:

```bash
cd client
npm run build
```

## Step 4: Test Your Deployment

### 4.1 Health Check
Visit: `https://your-app-name.onrender.com/health`

Should return: `{"status":"OK","message":"Server is running"}`

### 4.2 API Endpoints
Test your API endpoints:

- `https://your-app-name.onrender.com/api/menu`
- `https://your-app-name.onrender.com/api/menu/Grand_Palace_Hotel`
- `https://your-app-name.onrender.com/api/hotels`

### 4.3 Frontend
Visit: `https://your-app-name.onrender.com`

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check the build logs in Render
   - Ensure all dependencies are in `package.json`
   - Verify the build command is correct

2. **MongoDB Connection Fails**
   - Verify your MongoDB Atlas connection string
   - Check if your IP is whitelisted in MongoDB Atlas
   - Ensure the database and collection exist

3. **Environment Variables Not Set**
   - Double-check all environment variables in Render dashboard
   - Ensure variable names match exactly

4. **Port Issues**
   - Render automatically sets the PORT environment variable
   - Don't hardcode port numbers in production

### Logs and Debugging

- Check Render logs in the dashboard
- Use the health check endpoint to verify server status
- Monitor MongoDB Atlas for connection issues

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to Git
2. **CORS**: Configure CORS properly for production
3. **MongoDB**: Use connection string with proper authentication
4. **HTTPS**: Render provides HTTPS by default

## Cost Optimization

- Use the free tier for development/testing
- Monitor usage to avoid unexpected charges
- Consider upgrading only when needed

## Support

- Render Documentation: [docs.render.com](https://docs.render.com)
- MongoDB Atlas Documentation: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- GitHub Issues: For code-specific problems 