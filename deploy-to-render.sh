#!/bin/bash

echo "🚀 Deploying ProofPix Backend to Render..."

# Check if git repo is clean
if [[ -n $(git status --porcelain) ]]; then
    echo "📝 Committing changes..."
    git add .
    git commit -m "Deploy to Render: $(date)"
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

echo "✅ Code pushed to GitHub!"
echo ""
echo "🎯 Next steps:"
echo "1. Go to https://dashboard.render.com"
echo "2. Click 'New +' → 'Blueprint'"
echo "3. Connect your GitHub repository: proofpixfinal"
echo "4. Select the render.yaml file"
echo "5. Click 'Apply'"
echo ""
echo "🔧 Your backend will be deployed with:"
echo "   - PostgreSQL database (free tier)"
echo "   - Redis cache (free tier)"
echo "   - All environment variables configured"
echo "   - Health check endpoint: /health"
echo ""
echo "🌐 Once deployed, update your Stripe webhook URL to:"
echo "   https://[your-render-url]/api/stripe/webhook"
echo ""
echo "🎉 That's it! Much simpler than Railway!" 