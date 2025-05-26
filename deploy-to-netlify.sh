#!/bin/bash

# 🚀 ProofPix Netlify Deployment Script
echo "🚀 Starting ProofPix deployment to Netlify..."

# Check if build folder exists
if [ ! -d "build" ]; then
    echo "❌ Build folder not found. Running npm run build..."
    npm run build
fi

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
netlify deploy --prod --dir=build

echo "✅ Deployment complete!"
echo ""
echo "🔗 Your app should now be live at:"
echo "   https://upload.proofpixapp.com"
echo ""
echo "🧪 Test the payment protection:"
echo "   1. Try batch processing (should show upgrade prompt)"
echo "   2. Try enhanced export (should be blocked for free users)"
echo "   3. Generate 4 PDFs (should block on 4th)"
echo ""
echo "📊 Monitor analytics for:"
echo "   - Payment Protection events"
echo "   - Upgrade click conversions"
echo "   - Feature usage patterns"
echo ""
echo "🎉 ProofPix is ready for marketing launch!" 