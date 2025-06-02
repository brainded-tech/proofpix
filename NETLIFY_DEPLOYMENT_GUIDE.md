# Netlify Deployment Guide - Checkout Fix

## Your Current Setup ✅
- **Frontend**: Netlify (upload.proofpixapp.com)
- **Backend**: Railway (api.proofpixapp.com)

## Steps to Fix Checkout in Production

### 1. Add Environment Variables to Netlify

1. **Go to your Netlify dashboard**
2. **Select your site** (upload.proofpixapp.com)
3. **Navigate to**: Site settings → Environment variables
4. **Click "Add a variable"** and add these one by one:

```bash
# Variable 1
Key: REACT_APP_STRIPE_PUBLISHABLE_KEY
Value: pk_live_51RSVJG2Llp3EL08qxey5Ko0SGvsiQYraVaoC9K0kG3FW7auDMjjnFjGFFYahbhRRI8wySRUYJoWl
RNIrrhkL5eyP00hfGYzrgW

# Variable 2  
Key: REACT_APP_API_URL
Value: https://api.proofpixapp.com

# Variable 3
Key: REACT_APP_APP_URL
Value: https://upload.proofpixapp.com
```

### 2. Trigger New Deployment

After adding the environment variables:

1. **Go to**: Deploys tab in your Netlify dashboard
2. **Click**: "Trigger deploy" → "Deploy site"
3. **Wait** for the build to complete (usually 2-3 minutes)

### 3. Verify the Fix

Once deployed:

1. **Visit**: https://upload.proofpixapp.com/pricing-v2
2. **Click**: "Get Started" on any plan
3. **Should redirect to**: Stripe Checkout (not demo-checkout error)

### 4. Test in Browser Console

On your live site, open Developer Tools and run:
```javascript
console.log('Stripe Key:', process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
```

Should show your publishable key starting with `pk_live_`

## Railway Backend (Already Configured) ✅

Your Railway backend already has the correct environment variables:
- `STRIPE_SECRET_KEY` ✅
- `STRIPE_WEBHOOK_SECRET` ✅

No changes needed on Railway.

## Troubleshooting

### Issue: Environment variables not showing up
**Solution**: 
1. Make sure you clicked "Save" after adding each variable
2. Trigger a new deploy (environment changes require rebuild)
3. Clear browser cache

### Issue: Still getting demo-checkout error
**Solution**:
1. Check that all 3 environment variables are set in Netlify
2. Verify the build completed successfully
3. Hard refresh the page (Cmd+Shift+R / Ctrl+Shift+R)

### Issue: Checkout still not working
**Solution**:
1. Check browser console for errors
2. Verify Netlify functions are deployed correctly
3. Test the API endpoint: `https://upload.proofpixapp.com/.netlify/functions/create-checkout-session`

## Expected Result

After this fix:
- ✅ Checkout redirects to Stripe
- ✅ No more `/demo-checkout` errors  
- ✅ Environment variables accessible in browser
- ✅ Production-ready payment processing

## Next Steps

Once checkout is working:
1. Test with a small amount ($0.50)
2. Verify success/cancel page redirects
3. Set up webhook handling for subscription events
4. Test subscription management features

Need help? Check the main `CHECKOUT_DEBUG_GUIDE.md` for detailed troubleshooting. 