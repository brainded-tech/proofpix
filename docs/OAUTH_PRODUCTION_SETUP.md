# OAuth Production Setup Guide

## Overview

This guide explains how to configure OAuth (Google Cloud, Microsoft, etc.) for your ProofPix deployment on Railway or Render, ensuring 24/7 availability without relying on your local machine.

## Step 1: Deploy to Production First

Before configuring OAuth, you need your production URL:

### Railway Deployment
```bash
# Deploy to Railway
railway up

# Get your production URL
railway domain
# Example output: https://proofpix-production-abc123.railway.app
```

### Render Deployment
```bash
# Deploy to Render (via Git)
# Your URL will be: https://your-app-name.onrender.com
```

## Step 2: Configure Google Cloud OAuth

### 2.1 Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth 2.0 Client IDs**

### 2.2 Configure Redirect URIs

**IMPORTANT**: Use your production URLs, not localhost!

#### For Railway:
```
https://your-app.railway.app/auth/google/callback
https://your-app.railway.app/oauth/callback
https://your-app.railway.app/api/auth/google/callback
```

#### For Render:
```
https://your-app-name.onrender.com/auth/google/callback
https://your-app-name.onrender.com/oauth/callback
https://your-app-name.onrender.com/api/auth/google/callback
```

#### For Custom Domain (if you have one):
```
https://yourdomain.com/auth/google/callback
https://yourdomain.com/oauth/callback
https://yourdomain.com/api/auth/google/callback
```

#### For Development (optional):
```
http://localhost:5000/auth/google/callback
http://localhost:3000/auth/google/callback
```

### 2.3 Application Type
- Select **Web application**
- Name: "ProofPix Production"

## Step 3: Environment Variables

### 3.1 Railway Environment Variables
```bash
# Set OAuth credentials
railway variables set GOOGLE_CLIENT_ID="your_google_client_id_here"
railway variables set GOOGLE_CLIENT_SECRET="your_google_client_secret_here"
railway variables set OAUTH_ISSUER="https://your-app.railway.app"
railway variables set OAUTH_BASE_URL="https://your-app.railway.app"

# Set frontend URL
railway variables set FRONTEND_URL="https://your-frontend-app.railway.app"
```

### 3.2 Render Environment Variables
In your Render dashboard:
- `GOOGLE_CLIENT_ID`: your_google_client_id_here
- `GOOGLE_CLIENT_SECRET`: your_google_client_secret_here
- `OAUTH_ISSUER`: https://your-app-name.onrender.com
- `OAUTH_BASE_URL`: https://your-app-name.onrender.com
- `FRONTEND_URL`: https://your-frontend-app.onrender.com

## Step 4: Update OAuth Service Configuration

The OAuth service automatically uses production URLs when deployed. No code changes needed!

## Step 5: Test Production OAuth

### 5.1 Test OAuth Endpoints
```bash
# Test OAuth server info
curl https://your-app.railway.app/api/oauth/.well-known/oauth-authorization-server

# Test authorization endpoint (should redirect to Google)
curl -I "https://your-app.railway.app/api/oauth/authorize?client_id=test&response_type=code&redirect_uri=https://your-app.railway.app/oauth/callback"
```

### 5.2 Test Google OAuth Flow
1. Visit: `https://your-app.railway.app/auth/google`
2. Should redirect to Google login
3. After login, should redirect back to your app

## Step 6: Frontend Configuration

Update your frontend environment variables:

### Railway Frontend
```bash
railway variables set REACT_APP_API_URL="https://your-backend-app.railway.app"
railway variables set REACT_APP_OAUTH_GOOGLE_CLIENT_ID="your_google_client_id_here"
```

### Render Frontend
- `REACT_APP_API_URL`: https://your-backend-app.onrender.com
- `REACT_APP_OAUTH_GOOGLE_CLIENT_ID`: your_google_client_id_here

## Step 7: Custom Domain (Optional)

### 7.1 Railway Custom Domain
```bash
# Add custom domain
railway domain add yourdomain.com

# Update environment variables
railway variables set OAUTH_ISSUER="https://yourdomain.com"
railway variables set OAUTH_BASE_URL="https://yourdomain.com"
```

### 7.2 Update Google Cloud Console
Add your custom domain redirect URIs:
```
https://yourdomain.com/auth/google/callback
https://yourdomain.com/oauth/callback
https://yourdomain.com/api/auth/google/callback
```

## Step 8: Security Considerations

### 8.1 HTTPS Only
- Production OAuth **requires HTTPS**
- Railway and Render provide HTTPS automatically
- Never use HTTP for OAuth in production

### 8.2 Environment Separation
- Use different Google Cloud projects for dev/staging/production
- Use different client IDs for each environment
- Keep secrets secure and never commit them to code

### 8.3 Redirect URI Validation
- Only add trusted domains to redirect URIs
- Remove localhost URIs from production configuration
- Use specific paths, not wildcards

## Step 9: Monitoring & Troubleshooting

### 9.1 Check Deployment Status
```bash
# Railway
railway status
railway logs

# Check OAuth endpoints
curl https://your-app.railway.app/health
curl https://your-app.railway.app/api/oauth/.well-known/oauth-authorization-server
```

### 9.2 Common Issues

#### "redirect_uri_mismatch" Error
- Check that redirect URI in Google Cloud Console exactly matches your production URL
- Ensure HTTPS is used (not HTTP)
- Verify the path is correct (/auth/google/callback)

#### "invalid_client" Error
- Check that GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set correctly
- Verify the client ID matches the one in Google Cloud Console

#### OAuth Flow Not Working
- Check that OAUTH_ISSUER and OAUTH_BASE_URL point to your production domain
- Verify FRONTEND_URL is set to your frontend production URL
- Check that all environment variables are deployed

### 9.3 Debug Commands
```bash
# Check environment variables
railway variables

# View real-time logs
railway logs --follow

# Test OAuth endpoints
curl -v https://your-app.railway.app/api/oauth/.well-known/oauth-authorization-server
```

## Step 10: Production Checklist

- [ ] Application deployed to Railway/Render
- [ ] Production URL obtained
- [ ] Google Cloud OAuth configured with production redirect URIs
- [ ] Environment variables set in production
- [ ] HTTPS enabled (automatic on Railway/Render)
- [ ] OAuth endpoints tested
- [ ] Frontend configured with production API URL
- [ ] Custom domain configured (if applicable)
- [ ] Localhost redirect URIs removed from production config

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Railway/Render deployment logs
3. Verify Google Cloud Console configuration
4. Test OAuth endpoints manually

## Example Production URLs

### Railway
- Backend: `https://proofpix-backend-abc123.railway.app`
- Frontend: `https://proofpix-frontend-def456.railway.app`
- OAuth Callback: `https://proofpix-backend-abc123.railway.app/auth/google/callback`

### Render
- Backend: `https://proofpix-backend.onrender.com`
- Frontend: `https://proofpix-frontend.onrender.com`
- OAuth Callback: `https://proofpix-backend.onrender.com/auth/google/callback`

### Custom Domain
- Backend: `https://api.yourdomain.com`
- Frontend: `https://app.yourdomain.com`
- OAuth Callback: `https://api.yourdomain.com/auth/google/callback` 