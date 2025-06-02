#!/bin/bash

# Disable Analytics Script
echo "🔇 Disabling Analytics in Development..."

# Add environment variable to disable analytics
if grep -q "REACT_APP_DISABLE_ANALYTICS" .env; then
    echo "✅ Analytics already disabled in .env"
else
    echo "" >> .env
    echo "# Disable Analytics in Development" >> .env
    echo "REACT_APP_DISABLE_ANALYTICS=true" >> .env
    echo "✅ Added REACT_APP_DISABLE_ANALYTICS=true to .env"
fi

echo ""
echo "🎉 Analytics disabled!"
echo ""
echo "To re-enable analytics:"
echo "1. Remove REACT_APP_DISABLE_ANALYTICS=true from .env"
echo "2. Restart development server: npm start"
echo ""
echo "Note: This only affects development mode."
echo "Production analytics will still work normally." 