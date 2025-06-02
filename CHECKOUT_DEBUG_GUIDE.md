# ProofPix Checkout Debug Guide

## Issue Identified: Missing React App Environment Variables

The checkout is failing because the React app can't access the Stripe publishable key. Here's what's happening:

### Root Cause
1. **Missing Environment Variable**: `REACT_APP_STRIPE_PUBLISHABLE_KEY` is not set
2. **Fallback to Demo Mode**: When Stripe initialization fails, the app falls back to `/demo-checkout` which doesn't exist
3. **API Endpoint Issues**: The Netlify functions may not be properly configured

## Quick Fix

### Step 1: Add Missing Environment Variable
Add this line to your `.env` file:

```bash
# React App Stripe Configuration (Frontend)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_51RSVJG2Llp3EL08qxey5Ko0SGvsiQYraVaoC9K0kG3FW7auDMjjnFjGFFYahbhRRI8wySRUYJoWl
RNIrrhkL5eyP00hfGYzrgW
```

### Step 2: Add Additional React App Variables
```bash
# API Configuration
REACT_APP_API_URL=https://api.proofpixapp.com
REACT_APP_APP_URL=https://upload.proofpixapp.com

# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_51RSVJG2Llp3EL08qxey5Ko0SGvsiQYraVaoC9K0kG3FW7auDMjjnFjGFFYahbhRRI8wySRUYJoWl
RNIrrhkL5eyP00hfGYzrgW
```

### Step 3: Restart Development Server
```bash
npm start
```

## Debugging Steps

### 1. Check Environment Variables in Browser
Open browser console and run:
```javascript
console.log('Stripe Key:', process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
console.log('API URL:', process.env.REACT_APP_API_URL);
```

### 2. Test Stripe Initialization
```javascript
// In browser console
import { loadStripe } from '@stripe/stripe-js';
const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
console.log('Stripe loaded:', stripe);
```

### 3. Check Network Requests
1. Open Developer Tools → Network tab
2. Try to checkout
3. Look for failed requests to `/.netlify/functions/create-checkout-session`

## Production Deployment Fix

### For Railway (Backend) ✅
Environment variables are already set correctly in Railway:
```bash
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_vfvSnSMEHtbT8eMPLNSldn6lAkSOwJxj
```

### For Netlify (Frontend) 🔧
Add these environment variables in your **Netlify dashboard**:

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add these variables:

```bash
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_51RSVJG2Llp3EL08qxey5Ko0SGvsiQYraVaoC9K0kG3FW7auDMjjnFjGFFYahbhRRI8wySRUYJoWl
RNIrrhkL5eyP00hfGYzrgW
REACT_APP_API_URL=https://api.proofpixapp.com
REACT_APP_APP_URL=https://upload.proofpixapp.com
```

4. **Trigger a new deploy** after adding the environment variables

## Alternative: Remove Demo Fallback

If you want to remove the demo fallback that's causing the `/demo-checkout` error, edit `src/services/stripeIntegrationService.ts`:

```typescript
// Replace the fallback in createCheckoutSession method:
} catch (error) {
  console.error('Error creating checkout session:', error);
  // Instead of returning demo fallback, throw the error
  throw new Error('Failed to create checkout session. Please try again or contact support.');
}
```

## Testing Checklist

- [ ] Environment variables are set correctly
- [ ] Stripe publishable key is accessible in browser
- [ ] Network requests to Netlify functions work
- [ ] Checkout redirects to Stripe (not demo page)
- [ ] Success/cancel URLs are correct

## Common Issues

### Issue: "Stripe not loaded" error
**Solution**: Check that `REACT_APP_STRIPE_PUBLISHABLE_KEY` is set and starts with `pk_`

### Issue: Network request fails
**Solution**: Ensure Netlify functions are deployed and CORS is configured

### Issue: Redirects to demo-checkout
**Solution**: This guide fixes this exact issue

## Support

If issues persist:
1. Check browser console for errors
2. Verify all environment variables are set
3. Test with a simple Stripe checkout first
4. Contact Stripe support if payment processing fails

## Next Steps

After fixing the checkout:
1. Test with a small amount ($0.50)
2. Verify webhook handling
3. Test subscription management
4. Set up proper error handling 