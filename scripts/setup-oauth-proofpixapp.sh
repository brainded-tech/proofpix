#!/bin/bash

# ProofPix OAuth Setup for proofpixapp.com
# Specific configuration for your existing Railway + Render setup

echo "🚀 ProofPix OAuth Setup for proofpixapp.com"
echo "============================================"

# Verify Railway backend is working
echo "🔍 Checking Railway backend status..."
if curl -s -f https://api.proofpixapp.com/health > /dev/null; then
    echo "✅ Railway backend (api.proofpixapp.com) is working!"
else
    echo "❌ Railway backend not responding. Please check your Railway deployment."
    exit 1
fi

echo ""
echo "📋 Your Current Architecture:"
echo "  Backend (API):  https://api.proofpixapp.com (Railway) ✅"
echo "  Frontend:       https://app.proofpixapp.com (Render) - to be set up"
echo "  Database:       PostgreSQL on Railway ✅"
echo ""

# Get OAuth credentials
echo "🔐 OAuth Configuration"
echo "Please enter your Google Cloud OAuth credentials:"

read -p "Google Client ID: " GOOGLE_CLIENT_ID
read -s -p "Google Client Secret: " GOOGLE_CLIENT_SECRET
echo

if [ -z "$GOOGLE_CLIENT_ID" ] || [ -z "$GOOGLE_CLIENT_SECRET" ]; then
    echo "❌ Both Client ID and Secret are required"
    exit 1
fi

# Check if Railway CLI is available
if command -v railway &> /dev/null; then
    echo ""
    echo "⚙️  Setting Railway environment variables..."
    
    # Set OAuth environment variables on Railway
    railway variables set GOOGLE_CLIENT_ID="$GOOGLE_CLIENT_ID"
    railway variables set GOOGLE_CLIENT_SECRET="$GOOGLE_CLIENT_SECRET"
    railway variables set OAUTH_BASE_URL="https://api.proofpixapp.com"
    railway variables set OAUTH_ISSUER="https://api.proofpixapp.com"
    railway variables set FRONTEND_URL="https://app.proofpixapp.com"
    
    echo "✅ Railway environment variables updated"
else
    echo ""
    echo "⚠️  Railway CLI not found. Please set these variables manually in Railway dashboard:"
    echo "  GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID"
    echo "  GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET"
    echo "  OAUTH_BASE_URL=https://api.proofpixapp.com"
    echo "  OAUTH_ISSUER=https://api.proofpixapp.com"
    echo "  FRONTEND_URL=https://app.proofpixapp.com"
fi

echo ""
echo "🔗 Google Cloud Console Configuration"
echo "======================================"
echo ""
echo "Add these EXACT URLs to your Google Cloud Console OAuth2 configuration:"
echo ""
echo "✅ PRODUCTION REDIRECT URIs (use these!):"
echo "  https://api.proofpixapp.com/auth/google/callback"
echo "  https://api.proofpixapp.com/oauth/callback"
echo "  https://api.proofpixapp.com/api/auth/google/callback"
echo ""
echo "🛠️  DEVELOPMENT REDIRECT URIs (optional):"
echo "  http://localhost:5000/auth/google/callback"
echo "  http://localhost:3000/auth/google/callback"
echo ""

echo "📝 Steps to configure Google Cloud Console:"
echo "1. Go to: https://console.cloud.google.com/"
echo "2. Navigate to: APIs & Services > Credentials"
echo "3. Edit your OAuth 2.0 Client ID"
echo "4. Add the production redirect URIs shown above"
echo "5. Save the configuration"
echo ""

# Test OAuth endpoints
echo "🧪 Testing OAuth endpoints..."

# Test OAuth discovery
DISCOVERY_URL="https://api.proofpixapp.com/api/oauth/.well-known/oauth-authorization-server"
echo "Testing OAuth discovery: $DISCOVERY_URL"

if curl -s -f "$DISCOVERY_URL" > /dev/null; then
    echo "✅ OAuth discovery endpoint working"
else
    echo "⚠️  OAuth discovery endpoint not responding (this is normal if OAuth routes aren't deployed yet)"
fi

echo ""
echo "🎯 Next Steps for Complete Setup:"
echo "================================="
echo ""
echo "1. ✅ Railway Backend: Already working at api.proofpixapp.com"
echo "2. 🔄 Render Frontend Setup:"
echo "   - Go to Render dashboard"
echo "   - Rename your service to 'proofpix-frontend'"
echo "   - Set build command: npm run build"
echo "   - Set publish directory: build"
echo "   - Add custom domain: app.proofpixapp.com"
echo ""
echo "3. ⚙️  Render Environment Variables:"
echo "   REACT_APP_API_URL=https://api.proofpixapp.com"
echo "   REACT_APP_OAUTH_GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID"
echo "   NODE_ENV=production"
echo ""
echo "4. 🌐 DNS Configuration:"
echo "   - api.proofpixapp.com → Railway (already done!)"
echo "   - app.proofpixapp.com → Render (add this)"
echo ""
echo "5. 🔐 Google Cloud Console:"
echo "   - Add the redirect URIs shown above"
echo ""

# Save configuration
cat > oauth-proofpixapp-config.txt << EOF
ProofPix OAuth Configuration for proofpixapp.com
===============================================

Date: $(date)

Architecture:
- Backend:  https://api.proofpixapp.com (Railway)
- Frontend: https://app.proofpixapp.com (Render)
- Database: PostgreSQL on Railway

Google Cloud Console Redirect URIs:
- https://api.proofpixapp.com/auth/google/callback
- https://api.proofpixapp.com/oauth/callback
- https://api.proofpixapp.com/api/auth/google/callback

Railway Environment Variables:
- GOOGLE_CLIENT_ID: $GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET: [HIDDEN]
- OAUTH_BASE_URL: https://api.proofpixapp.com
- OAUTH_ISSUER: https://api.proofpixapp.com
- FRONTEND_URL: https://app.proofpixapp.com

Render Environment Variables:
- REACT_APP_API_URL: https://api.proofpixapp.com
- REACT_APP_OAUTH_GOOGLE_CLIENT_ID: $GOOGLE_CLIENT_ID
- NODE_ENV: production

Test URLs:
- Backend Health: https://api.proofpixapp.com/health
- OAuth Discovery: https://api.proofpixapp.com/api/oauth/.well-known/oauth-authorization-server
- API Docs: https://api.proofpixapp.com/api/docs

EOF

echo "📄 Configuration saved to: oauth-proofpixapp-config.txt"
echo ""
echo "🎉 OAuth setup complete for your proofpixapp.com architecture!"
echo ""
echo "💡 Remember: Use api.proofpixapp.com URLs for OAuth callbacks, not Render URLs!" 