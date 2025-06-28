# Deploying Hotel Menu App to Vercel

This guide will help you deploy your Hotel Menu Management application to Vercel using serverless functions for the backend API.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account**: Your code should be in a GitHub repository
3. **Node.js**: Make sure you have Node.js installed locally for testing

## Project Structure

After conversion, your project structure should look like this:

```
Hotel-MenuManagement/
├── api/                          # Vercel Serverless Functions
│   ├── menu.js                   # GET /api/menu
│   ├── menu/[hotelName].js       # GET /api/menu/[hotelName]
│   ├── hotels.js                 # GET /api/hotels
│   └── hotel-info/[hotelName].js # GET /api/hotel-info/[hotelName]
├── client/                       # React Frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── menu.json                     # Menu data
├── vercel.json                   # Vercel configuration
└── DEPLOYMENT.md                 # This file
```

## Deployment Steps

### 1. Prepare Your Repository

1. **Push to GitHub**: Make sure your code is pushed to a GitHub repository
2. **Verify Structure**: Ensure you have the `api/` folder with serverless functions and `vercel.json`

### 2. Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (root of your project)
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/build`
   - **Install Command**: `npm install && cd client && npm install`

5. Click **"Deploy"**

#### Option B: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from your project root:
   ```bash
   vercel
   ```

4. Follow the prompts and deploy

### 3. Environment Variables (if needed)

If you need environment variables, add them in the Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add any required variables

### 4. Custom Domain (Optional)

1. In your Vercel project dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Configure DNS settings as instructed

## API Endpoints

After deployment, your API endpoints will be available at:

- `https://your-domain.vercel.app/api/menu` - Get all hotels
- `https://your-domain.vercel.app/api/menu/[hotelName]` - Get specific hotel menu
- `https://your-domain.vercel.app/api/hotels` - Get list of hotels
- `https://your-domain.vercel.app/api/hotel-info/[hotelName]` - Get hotel info

## Testing Your Deployment

1. **Frontend**: Visit your Vercel URL to see the React app
2. **API**: Test API endpoints using tools like Postman or curl:
   ```bash
   curl https://your-domain.vercel.app/api/menu
   curl https://your-domain.vercel.app/api/hotels
   ```

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check that all dependencies are in `package.json`
   - Verify the build command in `vercel.json`

2. **API Not Working**:
   - Ensure `menu.json` is in the root directory
   - Check that API functions are in the `api/` folder
   - Verify CORS headers in serverless functions

3. **404 Errors**:
   - Check that routes are properly configured in `vercel.json`
   - Ensure file paths are correct

### Debugging

1. **Vercel Logs**: Check deployment logs in the Vercel dashboard
2. **Function Logs**: View serverless function logs in the Functions tab
3. **Local Testing**: Test serverless functions locally using `vercel dev`

## Local Development

To test locally before deploying:

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Run development server:
   ```bash
   vercel dev
   ```

3. Test your API endpoints locally

## Performance Optimization

1. **Caching**: Add caching headers to your API responses
2. **CDN**: Vercel automatically provides CDN for static assets
3. **Function Optimization**: Keep serverless functions lightweight

## Monitoring

1. **Analytics**: Enable Vercel Analytics in your project
2. **Logs**: Monitor function logs for errors
3. **Performance**: Use Vercel's performance insights

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Vercel Community](https://github.com/vercel/vercel/discussions) 