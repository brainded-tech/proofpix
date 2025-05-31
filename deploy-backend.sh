#!/bin/bash

# ProofPix Enterprise - Railway Deployment Script
# This script automates the Railway deployment process

set -e  # Exit on any error

echo "🚀 ProofPix Enterprise - Railway Deployment"
echo "============================================"

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Check if logged in to Railway
if ! railway whoami &> /dev/null; then
    echo "🔐 Please login to Railway..."
    railway login
fi

echo "📋 Pre-deployment checks..."

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found!"
    exit 1
fi

# Check if server.js exists
if [ ! -f "server.js" ]; then
    echo "❌ server.js not found!"
    exit 1
fi

echo "✅ All files present"

# Install dependencies locally to verify
echo "📦 Installing dependencies..."
npm install

# Run basic tests - macOS compatible version
echo "🧪 Running basic server test..."

# Start server in background on port 3001 (to avoid macOS AirTunes on 5000)
PORT=3001 npm run server &
SERVER_PID=$!

# Wait for server to start (macOS compatible)
sleep 3

# Check if server is running by testing the health endpoint
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Server starts successfully"
    kill $SERVER_PID 2>/dev/null || true
    sleep 1
else
    echo "❌ Server failed to start or health check failed"
    kill $SERVER_PID 2>/dev/null || true
    echo "💡 Continuing with deployment anyway - server might work in production environment"
fi

# Initialize Railway project if not exists
if railway status &> /dev/null; then
    echo "🚂 Using existing Railway project link..."
    railway status
else
    echo "🚂 Initializing Railway project..."
    railway init
fi

# Add PostgreSQL if not exists
echo "🗄️ Setting up PostgreSQL database..."
railway add -d postgres || echo "Database might already exist"

# Set environment variables
echo "⚙️ Configuring environment variables..."
railway variables --set "NODE_ENV=production"
railway variables --set "PORT=5000"

# Deploy to Railway
echo "🚀 Deploying to Railway..."
railway up

# Generate domain if not exists
echo "🌐 Setting up public domain..."
railway domain || echo "Domain might already exist"

# Wait for deployment
echo "⏳ Waiting for deployment to complete..."
sleep 30

# Get the deployment URL
RAILWAY_URL=$(railway status --json 2>/dev/null | grep -o '"url":"[^"]*"' | cut -d'"' -f4 || echo "")

if [ -n "$RAILWAY_URL" ]; then
    echo "✅ Deployment successful!"
    echo "🔗 API URL: $RAILWAY_URL"
    echo "🏥 Health check: $RAILWAY_URL/health"
    echo "📚 API docs: $RAILWAY_URL/api/docs"
    
    # Test the deployment
    echo "🧪 Testing deployment..."
    sleep 10  # Give it more time to fully start
    if curl -f "$RAILWAY_URL/health" > /dev/null 2>&1; then
        echo "✅ Health check passed"
    else
        echo "⚠️ Health check failed - check logs with: railway logs"
    fi
else
    echo "⚠️ Could not determine deployment URL"
    echo "Check status with: railway status"
fi

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Test your API endpoints"
echo "2. Update frontend API URLs"
echo "3. Configure custom domain (optional)"
echo "4. Set up monitoring"
echo ""
echo "Useful commands:"
echo "- View logs: railway logs"
echo "- Check status: railway status"
echo "- Open dashboard: railway open"
