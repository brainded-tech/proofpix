#!/bin/bash

# ProofPix OAuth Production Setup Script
# This script helps configure OAuth for Railway or Render deployment

echo "🚀 ProofPix OAuth Production Setup"
echo "=================================="

# Check if Railway CLI is installed
if command -v railway &> /dev/null; then
    echo "✅ Railway CLI detected"
    PLATFORM="railway"
elif command -v render &> /dev/null; then
    echo "✅ Render CLI detected"
    PLATFORM="render"
else
    echo "❌ Neither Railway nor Render CLI found"
    echo "Please install one of them:"
    echo "  Railway: npm install -g @railway/cli"
    echo "  Render: npm install -g @render/cli"
    exit 1
fi

echo ""
echo "📋 Pre-deployment Checklist:"
echo "1. Have you created a Google Cloud project?"
echo "2. Have you enabled the Google+ API?"
echo "3. Do you have your Google Client ID and Secret ready?"
echo ""

read -p "Continue with setup? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# Get production URL
echo ""
echo "🌐 Getting production URL..."

if [ "$PLATFORM" = "railway" ]; then
    # Deploy to Railway first if not already deployed
    echo "Deploying to Railway..."
    railway up
    
    # Get the production URL
    PRODUCTION_URL=$(railway domain | grep -o 'https://[^[:space:]]*' | head -1)
    
    if [ -z "$PRODUCTION_URL" ]; then
        echo "❌ Could not get Railway production URL"
        echo "Please run 'railway domain' manually and note your URL"
        exit 1
    fi
    
    echo "✅ Production URL: $PRODUCTION_URL"
    
elif [ "$PLATFORM" = "render" ]; then
    echo "Please enter your Render production URL:"
    read -p "URL (e.g., https://your-app.onrender.com): " PRODUCTION_URL
    
    if [ -z "$PRODUCTION_URL" ]; then
        echo "❌ Production URL is required"
        exit 1
    fi
fi

# Get OAuth credentials
echo ""
echo "🔐 OAuth Configuration"
echo "Please enter your Google Cloud OAuth credentials:"

read -p "Google Client ID: " GOOGLE_CLIENT_ID
read -s -p "Google Client Secret: " GOOGLE_CLIENT_SECRET
echo

if [ -z "$GOOGLE_CLIENT_ID" ] || [ -z "$GOOGLE_CLIENT_SECRET" ]; then
    echo "❌ Both Client ID and Secret are required"
    exit 1
fi

# Set environment variables
echo ""
echo "⚙️  Setting environment variables..."

if [ "$PLATFORM" = "railway" ]; then
    railway variables set GOOGLE_CLIENT_ID="$GOOGLE_CLIENT_ID"
    railway variables set GOOGLE_CLIENT_SECRET="$GOOGLE_CLIENT_SECRET"
    railway variables set OAUTH_ISSUER="$PRODUCTION_URL"
    railway variables set OAUTH_BASE_URL="$PRODUCTION_URL"
    railway variables set NODE_ENV="production"
    
    echo "✅ Railway environment variables set"
    
elif [ "$PLATFORM" = "render" ]; then
    echo "Please set these environment variables in your Render dashboard:"
    echo "  GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID"
    echo "  GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET"
    echo "  OAUTH_ISSUER=$PRODUCTION_URL"
    echo "  OAUTH_BASE_URL=$PRODUCTION_URL"
    echo "  NODE_ENV=production"
fi

# Generate redirect URIs
echo ""
echo "🔗 OAuth Redirect URIs"
echo "Add these URLs to your Google Cloud Console:"
echo ""
echo "  $PRODUCTION_URL/auth/google/callback"
echo "  $PRODUCTION_URL/oauth/callback"
echo "  $PRODUCTION_URL/api/auth/google/callback"
echo ""
echo "For development, also add:"
echo "  http://localhost:5000/auth/google/callback"
echo "  http://localhost:3000/auth/google/callback"
echo ""

# Test deployment
echo "🧪 Testing OAuth endpoints..."

# Wait a moment for deployment
sleep 5

# Test OAuth discovery endpoint
DISCOVERY_URL="$PRODUCTION_URL/api/oauth/.well-known/oauth-authorization-server"
echo "Testing: $DISCOVERY_URL"

if curl -s -f "$DISCOVERY_URL" > /dev/null; then
    echo "✅ OAuth discovery endpoint working"
else
    echo "❌ OAuth discovery endpoint not responding"
    echo "The deployment might still be starting up. Try again in a few minutes."
fi

# Test health endpoint
HEALTH_URL="$PRODUCTION_URL/health"
echo "Testing: $HEALTH_URL"

if curl -s -f "$HEALTH_URL" > /dev/null; then
    echo "✅ Health endpoint working"
else
    echo "❌ Health endpoint not responding"
fi

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Go to Google Cloud Console: https://console.cloud.google.com/"
echo "2. Navigate to APIs & Services > Credentials"
echo "3. Edit your OAuth 2.0 Client ID"
echo "4. Add the redirect URIs shown above"
echo "5. Test your OAuth flow at: $PRODUCTION_URL"
echo ""
echo "📖 For detailed instructions, see: docs/OAUTH_PRODUCTION_SETUP.md"
echo ""

# Save configuration for reference
cat > oauth-production-config.txt << EOF
ProofPix OAuth Production Configuration
======================================

Production URL: $PRODUCTION_URL
Platform: $PLATFORM
Date: $(date)

Google Cloud Console Redirect URIs:
- $PRODUCTION_URL/auth/google/callback
- $PRODUCTION_URL/oauth/callback
- $PRODUCTION_URL/api/auth/google/callback

Development Redirect URIs:
- http://localhost:5000/auth/google/callback
- http://localhost:3000/auth/google/callback

Environment Variables Set:
- GOOGLE_CLIENT_ID: $GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET: [HIDDEN]
- OAUTH_ISSUER: $PRODUCTION_URL
- OAUTH_BASE_URL: $PRODUCTION_URL
- NODE_ENV: production

Test URLs:
- OAuth Discovery: $PRODUCTION_URL/api/oauth/.well-known/oauth-authorization-server
- Health Check: $PRODUCTION_URL/health
- API Documentation: $PRODUCTION_URL/api/docs

EOF

echo "📄 Configuration saved to: oauth-production-config.txt" 