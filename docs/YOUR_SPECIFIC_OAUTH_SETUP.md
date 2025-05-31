# Your Specific OAuth Setup Guide

## Current Setup Analysis:
- **Railway**: Running at `api.proofpixapp.com` (your custom domain)
- **Railway**: Has PostgreSQL and backend services
- **Render**: Backend at `https://proofpix-backend.onrender.com`
- **Port**: Railway running on port 5000 (backend configuration)

## Recommendation: Use Railway as Your Primary Backend

Based on your current setup, here's what I recommend:

### Why Railway for Backend:
✅ **Already configured**: `api.proofpixapp.com` is pointing to Railway  
✅ **PostgreSQL included**: Railway has your database  
✅ **Custom domain ready**: Professional URL already set up  
✅ **Environment variables**: Already has JWT_SECRET and Stripe configured  

### Architecture Recommendation:
```
Frontend (Railway or Render) → Backend (Railway at api.proofpixapp.com) → PostgreSQL (Railway)
```

## OAuth Setup for Your Configuration:

### Step 1: Add OAuth Environment Variables to Railway
```bash
# Add these to your Railway backend
railway variables set GOOGLE_CLIENT_ID="your_google_client_id_here"
railway variables set GOOGLE_CLIENT_SECRET="your_google_client_secret_here"
railway variables set OAUTH_ISSUER="https://api.proofpixapp.com"
railway variables set OAUTH_BASE_URL="https://api.proofpixapp.com"
railway variables set FRONTEND_URL="https://app.proofpixapp.com"
```

### Step 2: Google Cloud Console Redirect URIs
**Add these URLs to your Google Cloud Console:**

```
✅ PRIMARY (Use these):
https://api.proofpixapp.com/auth/google/callback
https://api.proofpixapp.com/oauth/callback
https://api.proofpixapp.com/api/auth/google/callback

🛠️ DEVELOPMENT (Optional):
http://localhost:5000/auth/google/callback
http://localhost:3000/auth/google/callback
```

### Step 3: Frontend Options

#### Option A: Railway Frontend (Recommended)
- Deploy frontend to Railway
- Set up `app.proofpixapp.com` domain
- Point to Railway frontend service

#### Option B: Render Frontend
- Keep Render for frontend
- Set up `app.proofpixapp.com` to point to Render
- Configure Render with `REACT_APP_API_URL=https://api.proofpixapp.com`

## What About the Render Backend?

Since Railway is already set up with your database and custom domain, you have two options:

### Option 1: Migrate from Render to Railway (Recommended)
- Use Railway for everything (backend + frontend)
- Decommission the Render backend
- Simpler architecture, everything in one place

### Option 2: Keep Both (Backup/Testing)
- Railway: Production backend (`api.proofpixapp.com`)
- Render: Staging/testing backend
- Add both URLs to Google Cloud Console for flexibility

## Current Railway Configuration:
```
✅ Domain: api.proofpixapp.com
✅ Port: 5000 (correct for backend)
✅ Environment: production
✅ JWT_SECRET: configured
✅ Stripe: configured
✅ PostgreSQL: available
```

## Next Steps:

1. **Add OAuth variables to Railway** (commands above)
2. **Configure Google Cloud Console** with `api.proofpixapp.com` URLs
3. **Set up frontend** (Railway or Render pointing to `app.proofpixapp.com`)
4. **Test OAuth flow** with your custom domain

## Quick Setup Commands:

```bash
# Add OAuth to Railway
railway variables set GOOGLE_CLIENT_ID="your_client_id"
railway variables set GOOGLE_CLIENT_SECRET="your_client_secret"
railway variables set OAUTH_ISSUER="https://api.proofpixapp.com"
railway variables set OAUTH_BASE_URL="https://api.proofpixapp.com"

# Deploy latest code
railway up

# Check status
railway logs
```

## Google Cloud Console Setup:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services > Credentials
3. Edit your OAuth 2.0 Client ID
4. Add redirect URIs:
   - `https://api.proofpixapp.com/auth/google/callback`
   - `https://api.proofpixapp.com/oauth/callback`
   - `https://api.proofpixapp.com/api/auth/google/callback`

## Testing:
```bash
# Test OAuth discovery
curl https://api.proofpixapp.com/api/oauth/.well-known/oauth-authorization-server

# Test health
curl https://api.proofpixapp.com/health
```

Your OAuth will work 24/7 with `api.proofpixapp.com` - no laptop required! 