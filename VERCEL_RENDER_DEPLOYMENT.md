# Vercel + Render Deployment Guide

This guide explains how to deploy your React frontend on Vercel and Node.js backend on Render, then connect them together.

## Architecture Overview

- **Frontend (React)**: Deployed on Vercel
- **Backend (Node.js)**: Deployed on Render
- **Database**: MongoDB Atlas

## Step 1: Deploy Backend to Render

### 1.1 Update Render Configuration
The `render.yaml` file is already configured for backend-only deployment:
```yaml
buildCommand: npm install
startCommand: npm start
```

### 1.2 Deploy to Render
1. Push your code to GitHub
2. Connect your repository to Render
3. Set environment variables in Render:
   - `MONGO_URI` or `MONGODB_URI`: Your MongoDB connection string
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `FRONTEND_URL`: Your Vercel app URL (set this after deploying frontend)

### 1.3 Get Your Render URL
After deployment, note your Render app URL (e.g., `https://your-app.onrender.com`)

## Step 2: Deploy Frontend to Vercel

### 2.1 Prepare Frontend
1. Update `client/src/config.js` with your Render URL:
   ```javascript
   const API_BASE_URL = process.env.REACT_APP_API_URL || 
     (process.env.NODE_ENV === 'production' 
       ? 'https://hotel-menumanagement.onrender.com' // Your actual Render URL
       : 'http://localhost:5000'
     );
   ```

### 2.2 Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to the client directory: `cd client`
3. Deploy: `vercel`
4. Follow the prompts:
   - Link to existing project or create new
   - Set build command: `npm run build`
   - Set output directory: `build`

### 2.3 Alternative: Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set root directory to `client`
4. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

### 2.4 Set Environment Variables in Vercel
In your Vercel project settings, add:
- `REACT_APP_API_URL`: `https://your-render-app.onrender.com`

## Step 3: Connect Frontend and Backend

### 3.1 Update CORS in Backend
Update the CORS configuration in `server.js` with your Vercel domain:
```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://hotel-menu-management.vercel.app', // Your Vercel domain
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  optionsSuccessStatus: 200
};
```

### 3.2 Update Render Environment Variables
Add your Vercel URL to Render environment variables:
- `FRONTEND_URL`: `https://your-vercel-app.vercel.app`

## Step 4: Testing the Connection

### 4.1 Test Backend Health
Visit: `https://your-render-app.onrender.com/health`
Should return: `{"status":"OK","message":"Server is running"}`

### 4.2 Test Frontend
Visit your Vercel app URL and check if it can fetch data from the backend.

### 4.3 Debug Common Issues

#### CORS Errors
- Check that your Vercel domain is in the CORS origins list
- Ensure `FRONTEND_URL` is set correctly in Render

#### API Connection Issues
- Verify the API URL in `client/src/config.js`
- Check that `REACT_APP_API_URL` is set in Vercel
- Test the backend endpoints directly

#### Build Errors
- Ensure all dependencies are in `client/package.json`
- Check that the build command works locally: `cd client && npm run build`

## Step 5: Environment Variables Summary

### Render (Backend) Environment Variables
```
NODE_ENV=production
MONGO_URI=your_mongodb_connection_string
PORT=10000
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### Vercel (Frontend) Environment Variables
```
REACT_APP_API_URL=https://your-render-app.onrender.com
```

## Step 6: Local Development

For local development, you can run both services:

### Terminal 1 (Backend)
```bash
npm start
```

### Terminal 2 (Frontend)
```bash
cd client
npm start
```

The frontend will automatically connect to `http://localhost:5000` in development.

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check that your Vercel domain is in the CORS origins
2. **API Not Found**: Verify the API URL in the frontend config
3. **Build Failures**: Test builds locally before deploying
4. **Environment Variables**: Ensure all variables are set in both platforms

### Debug Commands

```bash
# Test backend locally
npm start

# Test frontend locally
cd client && npm start

# Test build locally
cd client && npm run build

# Check environment variables
echo $REACT_APP_API_URL
```

## Security Considerations

1. **CORS**: Only allow your Vercel domain in CORS origins
2. **Environment Variables**: Never commit sensitive data to Git
3. **API Keys**: Use environment variables for all sensitive data
4. **HTTPS**: Both Vercel and Render provide HTTPS by default

## Performance Tips

1. **Caching**: Consider adding caching headers to your API responses
2. **CDN**: Vercel provides global CDN for static assets
3. **Database**: Use MongoDB Atlas for global database access
4. **Monitoring**: Set up monitoring for both frontend and backend

## Next Steps

1. Set up custom domains (optional)
2. Configure monitoring and logging
3. Set up CI/CD pipelines
4. Add error tracking (Sentry, etc.)
5. Implement caching strategies 