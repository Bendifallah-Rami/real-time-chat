# Deployment Guide

## Backend Deployment to Render

### Option 1: Deploy from GitHub (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Add CORS support and prepare for deployment"
   git push origin main
   ```

2. **Deploy to Render:**
   - Go to [Render.com](https://render.com)
   - Sign up/Login with your GitHub account
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `Bendifallah-Rami/real-time-chat`
   - Configure the service:
     - **Name:** `websocket-chat-backend` (or your preferred name)
     - **Environment:** `Node`
     - **Region:** Choose closest to your users
     - **Branch:** `main`
     - **Root Directory:** `backend`
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Plan:** Free
   - Click "Create Web Service"

3. **Get your backend URL:**
   - After deployment, Render will give you a URL like:
   - `https://websocket-chat-backend-xxxx.onrender.com`
   - Copy this URL for the next step

### Option 2: Manual Upload

1. **Prepare backend files:**
   - Zip the `backend` folder contents
   - Upload to Render manually

## Frontend Configuration Update

1. **Update config.js:**
   - Replace `websocket-chat-backend-xxxx.onrender.com` in `frontend/config.js`
   - Use your actual Render URL from step 3 above

2. **Example:**
   ```javascript
   production: {
       wsUrl: 'wss://your-actual-render-url.onrender.com',
       apiUrl: 'https://your-actual-render-url.onrender.com'
   }
   ```

## Frontend Redeploy to Netlify

1. **Update and redeploy:**
   ```bash
   # Update the config with your Render URL
   # Then redeploy to Netlify
   ```

2. **Netlify Auto-Deploy (if connected to GitHub):**
   - Just push changes to GitHub
   - Netlify will auto-deploy

3. **Manual Deploy:**
   - Zip the `frontend` folder
   - Drag & drop to Netlify dashboard

## Testing the Connection

1. **Test backend directly:**
   - Visit: `https://your-render-url.onrender.com/health`
   - Should show: `{"status":"OK","message":"WebSocket Chat Server is running"}`

2. **Test frontend:**
   - Visit: `https://ramichatweb.netlify.app/`
   - Check browser console for connection status
   - Try sending messages

## Important Notes

- **Free Render services sleep after 15 minutes of inactivity**
- **First connection after sleep takes ~30 seconds to wake up**
- **For production use, consider upgrading to paid plan**
- **WebSocket connections work on both HTTP and HTTPS**

## Troubleshooting

1. **Connection issues:**
   - Check browser console for errors
   - Verify URLs in config.js match your Render deployment
   - Test backend health endpoint

2. **CORS errors:**
   - Backend now includes CORS headers
   - Should work between Netlify and Render

3. **Backend won't start:**
   - Check Render logs
   - Ensure package.json has correct scripts
   - Verify Node.js version compatibility
