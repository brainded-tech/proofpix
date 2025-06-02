#!/bin/bash

# ProofPix Stripe Integration Deployment Script for Railway
# This script helps deploy the updated backend with Stripe integration

echo "🚀 ProofPix Stripe Integration Deployment to Railway"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "backend/server.js" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "⚠️  Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

echo "📋 Pre-deployment checklist:"
echo "1. ✅ Stripe routes integrated in backend/server.js"
echo "2. ✅ Deployment guide created"
echo "3. ✅ Changes committed to Git"

# Push to Git (assuming Railway is connected to Git)
echo ""
echo "📤 Pushing changes to Git repository..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to Git"
else
    echo "❌ Failed to push to Git. Please check your Git configuration."
    exit 1
fi

echo ""
echo "🔧 Next steps for Railway deployment:"
echo ""
echo "1. 🌐 Go to your Railway dashboard: https://railway.app/dashboard"
echo "2. 📁 Select your ProofPix backend service"
echo "3. ⚙️  Add these environment variables:"
echo "   - STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here"
echo "   - STRIPE_WEBHOOK_SECRET=(get from Stripe dashboard after creating webhook)"
echo "   - FRONTEND_URL=https://upload.proofpixapp.com"
echo ""
echo "4. 🔗 Configure Stripe webhook:"
echo "   - URL: https://your-railway-domain.railway.app/api/stripe/webhook"
echo "   - Events: checkout.session.completed, customer.subscription.*, invoice.payment_*"
echo ""
echo "5. 🧪 Test the integration:"
echo "   - Health check: https://your-railway-domain.railway.app/health"
echo "   - Stripe endpoint: https://your-railway-domain.railway.app/api/stripe/create-checkout-session"
echo ""
echo "📖 For detailed instructions, see: RAILWAY_STRIPE_DEPLOYMENT_GUIDE.md"
echo ""
echo "🎉 Deployment initiated! Check Railway dashboard for build status." 