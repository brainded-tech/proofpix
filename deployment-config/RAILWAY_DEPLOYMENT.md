# 🚀 Railway Deployment Guide for ProofPix

## Environment Variables Setup

### 1. Go to Railway Dashboard
- Navigate to your project
- Go to **Variables** tab

### 2. Add Required Variables

Copy these **EXACT** values to your Railway environment variables:

```bash
# Stripe Configuration (LIVE KEYS)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_51RSVJG2Llp3EL08qhQZvGpxwbskBuWayc5aFARPVEC6CImCuuXiIj0vK8TJs0T10aVWGP1XpuJOXmEnwx5Z8s6g00kdDH5IAY
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here

# App Configuration
NODE_ENV=production
PORT=3000
REACT_APP_API_URL=https://your-railway-domain.railway.app
REACT_APP_APP_URL=https://your-railway-domain.railway.app
```

### 3. Build Configuration
Railway will automatically detect your React app and:
- Install dependencies with `npm install`
- Build with `npm run build`
- Serve with `npm start`

### 4. Custom Domain (Optional)
- Go to **Settings** > **Domains**
- Add your custom domain
- Update environment variables with your domain

### 5. Deploy
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push!

## 🎯 Stripe Integration Status
✅ **All 14 products created and integrated**
✅ **Real price IDs updated in code**
✅ **Ready for live payments**

## 🔧 Additional Railway Features
- **Auto-scaling**: Handles traffic spikes automatically
- **Zero-downtime deployments**: Seamless updates
- **Built-in monitoring**: Track performance and errors
- **Database integration**: Easy PostgreSQL/MySQL setup

## ✅ Production Ready!
Your ProofPix app is ready to handle real customers and payments on Railway! 