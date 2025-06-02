#!/bin/bash

# ProofPix Checkout Fix Script
echo "🔧 Fixing ProofPix Checkout Issue..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    exit 1
fi

# Backup current .env
cp .env .env.backup
echo "✅ Created backup: .env.backup"

# Check if REACT_APP_STRIPE_PUBLISHABLE_KEY already exists
if grep -q "REACT_APP_STRIPE_PUBLISHABLE_KEY" .env; then
    echo "✅ REACT_APP_STRIPE_PUBLISHABLE_KEY already exists"
else
    echo "🔧 Adding REACT_APP_STRIPE_PUBLISHABLE_KEY..."
    echo "" >> .env
    echo "# React App Stripe Configuration (Frontend)" >> .env
    echo "REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_51RSVJG2Llp3EL08qxey5Ko0SGvsiQYraVaoC9K0kG3FW7auDMjjnFjGFFYahbhRRI8wySRUYJoWl
RNIrrhkL5eyP00hfGYzrgW" >> .env
    echo "✅ Added REACT_APP_STRIPE_PUBLISHABLE_KEY"
fi

# Check if REACT_APP_APP_URL already exists
if grep -q "REACT_APP_APP_URL" .env; then
    echo "✅ REACT_APP_APP_URL already exists"
else
    echo "🔧 Adding REACT_APP_APP_URL..."
    echo "REACT_APP_APP_URL=https://upload.proofpixapp.com" >> .env
    echo "✅ Added REACT_APP_APP_URL"
fi

echo ""
echo "🎉 Checkout fix complete!"
echo ""
echo "Next steps:"
echo "1. Restart your development server: npm start"
echo "2. Test checkout functionality"
echo "3. Check browser console for any remaining errors"
echo ""
echo "If you're deploying to production:"
echo "- Add REACT_APP_STRIPE_PUBLISHABLE_KEY to your Netlify environment variables"
echo "- Add REACT_APP_API_URL=https://api.proofpixapp.com to Netlify"
echo "- Add REACT_APP_APP_URL=https://upload.proofpixapp.com to Netlify"
echo "- Trigger a new deploy after adding variables"
echo ""
echo "📖 See CHECKOUT_DEBUG_GUIDE.md for detailed troubleshooting" 