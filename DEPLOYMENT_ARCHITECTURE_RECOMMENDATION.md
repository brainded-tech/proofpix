# ProofPix Deployment Architecture Recommendation

## Your Current Setup Analysis

Based on your project structure and existing domains:

### Current Configuration:
- **Domain**: `proofpixapp.com` (custom domain)
- **Railway**: `api.proofpixapp.com` (already configured)
- **Render**: `https://proofpix-backend.onrender.com` (backend URL you mentioned)
- **Project Structure**: Monorepo (frontend + backend in same repository)

## Recommended Architecture

### Option 1: Railway for Backend + Render for Frontend (RECOMMENDED)

This matches your original plan and is the most cost-effective:

```
Frontend (React):  app.proofpixapp.com  → Render
Backend (API):     api.proofpixapp.com  → Railway (already set up!)
Database:          PostgreSQL           → Railway (already set up!)
```

**Why this is optimal:**
- ✅ Railway already has your database and `api.proofpixapp.com` configured
- ✅ Render is excellent for React frontends (free tier available)
- ✅ Clear separation of concerns
- ✅ Cost-effective (Railway free tier for backend + DB, Render free tier for frontend)

### Option 2: All Railway (Alternative)

```
Frontend (React):  app.proofpixapp.com  → Railway
Backend (API):     api.proofpixapp.com  → Railway (current)
Database:          PostgreSQL           → Railway (current)
```

## Specific OAuth Configuration

### For Google Cloud Console, use these redirect URIs:

```
# Production URLs (use these!)
https://api.proofpixapp.com/auth/google/callback
https://api.proofpixapp.com/oauth/callback
https://api.proofpixapp.com/api/auth/google/callback

# Development URLs (optional)
http://localhost:5000/auth/google/callback
http://localhost:3000/auth/google/callback
```

**Important**: Use `api.proofpixapp.com` (your Railway backend) for OAuth callbacks, NOT the Render URL.

## Step-by-Step Implementation

### Step 1: Confirm Railway Backend Setup

Your Railway backend should already be running at `api.proofpixapp.com`. Let's verify:

```bash
# Check if your Railway backend is working
curl https://api.proofpixapp.com/health
curl https://api.proofpixapp.com/api/docs
```

### Step 2: Deploy Frontend to Render

1. **Create new Render service** for frontend
2. **Connect your GitHub repo**
3. **Set build command**: `npm run build`
4. **Set publish directory**: `build`
5. **Add custom domain**: `app.proofpixapp.com`

### Step 3: Environment Variables

#### Railway (Backend) - api.proofpixapp.com:
```bash
railway variables set GOOGLE_CLIENT_ID="your_google_client_id"
railway variables set GOOGLE_CLIENT_SECRET="your_google_client_secret"
railway variables set OAUTH_BASE_URL="https://api.proofpixapp.com"
railway variables set FRONTEND_URL="https://app.proofpixapp.com"
railway variables set NODE_ENV="production"
```

#### Render (Frontend) - app.proofpixapp.com:
```
REACT_APP_API_URL=https://api.proofpixapp.com
REACT_APP_OAUTH_GOOGLE_CLIENT_ID=your_google_client_id
NODE_ENV=production
```

### Step 4: DNS Configuration

In your domain registrar (where you bought `proofpixapp.com`):

```
# A Records or CNAME Records:
api.proofpixapp.com  → Railway (already done!)
app.proofpixapp.com  → Render
www.proofpixapp.com  → Render (optional)
```

## Project Naming Clarification

### Current Render Project
- **Current name**: `proofpix-backend` 
- **Current URL**: `https://proofpix-backend.onrender.com`
- **Recommendation**: Rename to `proofpix-frontend` since it should host the React app

### How to rename Render project:
1. Go to Render dashboard
2. Select your service
3. Go to Settings
4. Change service name to `proofpix-frontend`
5. This will change URL to `https://proofpix-frontend.onrender.com`

## Final Architecture

```
User visits: app.proofpixapp.com (Render - Frontend)
    ↓
Frontend makes API calls to: api.proofpixapp.com (Railway - Backend)
    ↓
OAuth redirects to: api.proofpixapp.com/auth/google/callback (Railway)
    ↓
Database queries: PostgreSQL on Railway
```

## Benefits of This Setup

1. **Cost Effective**: Free tiers for both platforms
2. **Performance**: Render excels at static site hosting, Railway excels at APIs
3. **Scalability**: Each service can scale independently
4. **Reliability**: If one platform has issues, the other continues working
5. **Domain Management**: Clean subdomain structure

## OAuth Flow with This Setup

1. User visits `app.proofpixapp.com` (React app on Render)
2. Clicks "Login with Google"
3. Redirects to Google OAuth
4. Google redirects to `api.proofpixapp.com/auth/google/callback` (Railway backend)
5. Backend processes OAuth and redirects back to `app.proofpixapp.com`
6. User is logged in!

## Next Steps

1. ✅ Keep Railway as backend (`api.proofpixapp.com`)
2. 🔄 Rename Render project to `proofpix-frontend`
3. 🚀 Deploy React app to Render
4. 🌐 Set up `app.proofpixapp.com` custom domain on Render
5. ⚙️ Configure environment variables
6. 🔐 Update Google Cloud Console with `api.proofpixapp.com` URLs

This setup gives you the best of both worlds and uses your existing Railway configuration! 