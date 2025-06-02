# 🚀 Netlify Deployment Guide for ProofPix

## Environment Variables Setup

### 1. Go to Netlify Dashboard
- Navigate to your site settings
- Go to **Environment Variables** section

### 2. Add Required Variables

Copy these **EXACT** values to your Netlify environment variables:

```bash
# Stripe Configuration (LIVE KEYS)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_51RSVJG2Llp3EL08qhQZvGpxwbskBuWayc5aFARPVEC6CImCuuXiIj0vK8TJs0T10aVWGP1XpuJOXmEnwx5Z8s6g00kdDH5IAY
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here

# App Configuration
NODE_ENV=production
REACT_APP_API_URL=https://your-netlify-domain.netlify.app
REACT_APP_APP_URL=https://your-netlify-domain.netlify.app
```

### 3. Build Settings
- **Build command**: `npm run build`
- **Publish directory**: `build`
- **Node version**: 18.x

### 4. Functions Setup (for Stripe webhooks)
- Create `netlify/functions/` directory
- Add Stripe webhook handler
- Set webhook URL in Stripe Dashboard: `https://your-domain.netlify.app/.netlify/functions/stripe-webhook`

### 5. Deploy
1. Connect your GitHub repository
2. Set environment variables
3. Deploy!

## 🎯 Real Stripe Products Created
All 14 products are now live in your Stripe account:

### Session Passes
- Day Pass: `price_1RVPKg2Llp3EL08qW0EgbMcd` ($2.99)
- Week Pass: `price_1RVPKg2Llp3EL08qfurRg5xQ` ($9.99)
- Month Pass: `price_1RVPKg2Llp3EL08qtdn8EU3c` ($49.99)

### Subscription Plans
- Professional: `price_1RVPKh2Llp3EL08qktUZaLpY` ($99/month)
- Business: `price_1RVPKi2Llp3EL08qLZvhteLT` ($299/month)
- Enterprise: `price_1RVPKi2Llp3EL08qKAtT6D6K` ($999/month)
- Custom Enterprise: `price_1RVPKj2Llp3EL08qxPAlbc7s` ($2,999/month)

### AI Add-ons
- Legal AI: `price_1RVPKj2Llp3EL08qrXYPc17U` ($999/month)
- Healthcare AI: `price_1RVPKj2Llp3EL08qu18bFFgn` ($1,499/month)
- Financial AI: `price_1RVPKk2Llp3EL08q0QHnU1Bx` ($1,999/month)
- Insurance AI: `price_1RVPKk2Llp3EL08qQqC6bfDn` ($999/month)

### AI Training Packages
- Basic Training: `price_1RVPKk2Llp3EL08qAw2Yc4mt` ($999 one-time)
- Advanced Training: `price_1RVPKl2Llp3EL08qYDzLkxvW` ($2,999 one-time)
- Enterprise Training: `price_1RVPKl2Llp3EL08qeA3Pz5U3` ($9,999 one-time)

## ✅ Ready for Production!
Your pricing page at `/pricing-v2` is now connected to real Stripe products and ready to accept payments! 