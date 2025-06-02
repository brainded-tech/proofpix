#!/bin/bash

echo "🚀 Creating ProofPix AI-Enhanced Products..."
echo "============================================="

# Professional AI Plan
echo "Creating Professional AI Plan ($149/month)..."
PROFESSIONAL_PRODUCT=$(stripe products create --name="Professional AI" --description="Advanced AI features for growing teams")
PROFESSIONAL_PRODUCT_ID=$(echo "$PROFESSIONAL_PRODUCT" | grep '"id":' | head -1 | cut -d'"' -f4)
PROFESSIONAL_PRICE=$(stripe prices create --product=$PROFESSIONAL_PRODUCT_ID --unit-amount=14900 --currency=usd --recurring.interval=month --nickname="Professional AI Monthly")
PROFESSIONAL_PRICE_ID=$(echo "$PROFESSIONAL_PRICE" | grep '"id":' | head -1 | cut -d'"' -f4)
echo "✅ Professional AI: $PROFESSIONAL_PRICE_ID"

# Business AI Plan
echo "Creating Business AI Plan ($499/month)..."
BUSINESS_PRODUCT=$(stripe products create --name="Business AI" --description="Enterprise-grade AI for organizations")
BUSINESS_PRODUCT_ID=$(echo "$BUSINESS_PRODUCT" | grep '"id":' | head -1 | cut -d'"' -f4)
BUSINESS_PRICE=$(stripe prices create --product=$BUSINESS_PRODUCT_ID --unit-amount=49900 --currency=usd --recurring.interval=month --nickname="Business AI Monthly")
BUSINESS_PRICE_ID=$(echo "$BUSINESS_PRICE" | grep '"id":' | head -1 | cut -d'"' -f4)
echo "✅ Business AI: $BUSINESS_PRICE_ID"

# Enterprise AI Plan
echo "Creating Enterprise AI Plan ($1999/month)..."
ENTERPRISE_PRODUCT=$(stripe products create --name="Enterprise AI" --description="Unlimited AI with custom development")
ENTERPRISE_PRODUCT_ID=$(echo "$ENTERPRISE_PRODUCT" | grep '"id":' | head -1 | cut -d'"' -f4)
ENTERPRISE_PRICE=$(stripe prices create --product=$ENTERPRISE_PRODUCT_ID --unit-amount=199900 --currency=usd --recurring.interval=month --nickname="Enterprise AI Monthly")
ENTERPRISE_PRICE_ID=$(echo "$ENTERPRISE_PRICE" | grep '"id":' | head -1 | cut -d'"' -f4)
echo "✅ Enterprise AI: $ENTERPRISE_PRICE_ID"

echo ""
echo "🎯 PRICE IDs FOR CODE UPDATE:"
echo "================================"
echo "INDIVIDUAL_AI_MONTHLY=price_1RVJ08RwqAvTbIKuWpD9T8TJ"
echo "PROFESSIONAL_AI_MONTHLY=$PROFESSIONAL_PRICE_ID"
echo "BUSINESS_AI_MONTHLY=$BUSINESS_PRICE_ID"
echo "ENTERPRISE_AI_MONTHLY=$ENTERPRISE_PRICE_ID"
echo ""
echo "🚀 All AI plans created successfully!"
echo "💰 Ready to start making money!" 