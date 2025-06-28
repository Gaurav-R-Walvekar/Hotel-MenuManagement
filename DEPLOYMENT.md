# Deployment Guide - Render

## Prerequisites
- GitHub repository with your code
- Render account (free tier available)

## Deployment Steps

### 1. Push Code to GitHub
Make sure your code is pushed to a GitHub repository.

### 2. Deploy on Render

1. **Sign up/Login to Render**
   - Go to [render.com](https://render.com)
   - Sign up with your GitHub account

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing this project

3. **Configure the Service**
   - **Name**: `hotel-menu-backend` (or any name you prefer)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: Leave empty (deploy from root)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Environment Variables** (Optional)
   - `NODE_ENV`: `production`
   - `PORT`: Render will set this automatically

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your app

### 3. Access Your App

Once deployed, Render will provide you with a URL like:
`https://your-app-name.onrender.com`

### 4. Update Frontend API URLs

If you're deploying the frontend separately (e.g., on Vercel), update the API base URL in your React app to point to your Render backend URL.

## API Endpoints

Your backend will be available at:
- `https://your-app-name.onrender.com/api/menu` - Get all hotels
- `https://your-app-name.onrender.com/api/menu/:hotelName` - Get specific hotel menu
- `https://your-app-name.onrender.com/api/hotels` - Get list of hotels
- `https://your-app-name.onrender.com/api/hotel-info/:hotelName` - Get hotel info

## Troubleshooting

- **Build fails**: Check the build logs in Render dashboard
- **App not starting**: Verify the start command is `npm start`
- **API not working**: Check if the service is running and the URL is correct

## Free Tier Limitations

- Service may sleep after 15 minutes of inactivity
- First request after sleep may take 30-60 seconds
- Limited to 750 hours per month 