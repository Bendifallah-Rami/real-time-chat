#!/bin/bash

# WebSocket Chat App - Quick Deployment Script

echo "🚀 WebSocket Chat Deployment Helper"
echo "======================================"

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📝 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - WebSocket chat app"
    echo "✅ Git repository initialized"
else
    echo "📂 Git repository already exists"
fi

echo ""
echo "🎯 Deployment Options:"
echo "1. Render.com (Recommended for WebSocket)"
echo "2. Railway.app"
echo "3. Glitch.com (Easiest)"
echo "4. Manual GitHub setup"

echo ""
echo "📋 Next Steps:"
echo ""
echo "For Render.com deployment:"
echo "1. Push your code to GitHub:"
echo "   git remote add origin https://github.com/yourusername/websocket-chat.git"
echo "   git push -u origin main"
echo ""
echo "2. Go to render.com and create a new Web Service"
echo "3. Connect your GitHub repository"
echo "4. Set build command: npm install"
echo "5. Set start command: npm start"
echo "6. Deploy!"
echo ""
echo "📱 Frontend deployment:"
echo "1. Deploy frontend folder to Netlify (drag & drop)"
echo "2. Update config.js with your backend URL"
echo ""
echo "🔗 Useful links:"
echo "- Render.com: https://render.com"
echo "- Netlify: https://netlify.com"
echo "- Railway: https://railway.app"
echo "- Glitch: https://glitch.com"

echo ""
echo "✨ Happy deploying!"
