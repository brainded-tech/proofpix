#!/bin/bash

echo "💰 Creating ALL Revenue-Generating Products..."
echo "=============================================="

# Healthcare AI Package - $3999/month
echo "Creating Healthcare AI Package ($3999/month)..."
HEALTHCARE_PRODUCT=$(stripe products create --name="Healthcare AI Package" --description="HIPAA-compliant AI for healthcare organizations")
HEALTHCARE_PRODUCT_ID=$(echo "$HEALTHCARE_PRODUCT" | grep '"id":' | head -1 | cut -d'"' -f4)
HEALTHCARE_PRICE=$(stripe prices create --product=$HEALTHCARE_PRODUCT_ID --unit-amount=399900 --currency=usd --recurring.interval=month --nickname="Healthcare AI Monthly")
HEALTHCARE_PRICE_ID=$(echo "$HEALTHCARE_PRICE" | grep '"id":' | head -1 | cut -d'"' -f4)
echo "✅ Healthcare AI: $HEALTHCARE_PRICE_ID"

# Financial AI Package - $4999/month
echo "Creating Financial AI Package ($4999/month)..."
FINANCIAL_PRODUCT=$(stripe products create --name="Financial AI Package" --description="Advanced fraud detection for financial institutions")
FINANCIAL_PRODUCT_ID=$(echo "$FINANCIAL_PRODUCT" | grep '"id":' | head -1 | cut -d'"' -f4)
FINANCIAL_PRICE=$(stripe prices create --product=$FINANCIAL_PRODUCT_ID --unit-amount=499900 --currency=usd --recurring.interval=month --nickname="Financial AI Monthly")
FINANCIAL_PRICE_ID=$(echo "$FINANCIAL_PRICE" | grep '"id":' | head -1 | cut -d'"' -f4)
echo "✅ Financial AI: $FINANCIAL_PRICE_ID"

# Insurance AI Package - $3499/month
echo "Creating Insurance AI Package ($3499/month)..."
INSURANCE_PRODUCT=$(stripe products create --name="Insurance AI Package" --description="Claims processing and fraud detection for insurance")
INSURANCE_PRODUCT_ID=$(echo "$INSURANCE_PRODUCT" | grep '"id":' | head -1 | cut -d'"' -f4)
INSURANCE_PRICE=$(stripe prices create --product=$INSURANCE_PRODUCT_ID --unit-amount=349900 --currency=usd --recurring.interval=month --nickname="Insurance AI Monthly")
INSURANCE_PRICE_ID=$(echo "$INSURANCE_PRICE" | grep '"id":' | head -1 | cut -d'"' -f4)
echo "✅ Insurance AI: $INSURANCE_PRICE_ID"

# Enterprise Standard Setup - $499/month
echo "Creating Enterprise Standard Setup ($499/month)..."
ENT_STANDARD_PRODUCT=$(stripe products create --name="Enterprise Standard Setup" --description="One-click enterprise setup for up to 100 users")
ENT_STANDARD_PRODUCT_ID=$(echo "$ENT_STANDARD_PRODUCT" | grep '"id":' | head -1 | cut -d'"' -f4)
ENT_STANDARD_PRICE=$(stripe prices create --product=$ENT_STANDARD_PRODUCT_ID --unit-amount=49900 --currency=usd --recurring.interval=month --nickname="Enterprise Standard Monthly")
ENT_STANDARD_PRICE_ID=$(echo "$ENT_STANDARD_PRICE" | grep '"id":' | head -1 | cut -d'"' -f4)
echo "✅ Enterprise Standard: $ENT_STANDARD_PRICE_ID"

# Enterprise Plus Setup - $999/month
echo "Creating Enterprise Plus Setup ($999/month)..."
ENT_PLUS_PRODUCT=$(stripe products create --name="Enterprise Plus Setup" --description="Premium enterprise features with unlimited users")
ENT_PLUS_PRODUCT_ID=$(echo "$ENT_PLUS_PRODUCT" | grep '"id":' | head -1 | cut -d'"' -f4)
ENT_PLUS_PRICE=$(stripe prices create --product=$ENT_PLUS_PRODUCT_ID --unit-amount=99900 --currency=usd --recurring.interval=month --nickname="Enterprise Plus Monthly")
ENT_PLUS_PRICE_ID=$(echo "$ENT_PLUS_PRICE" | grep '"id":' | head -1 | cut -d'"' -f4)
echo "✅ Enterprise Plus: $ENT_PLUS_PRICE_ID"

# Enterprise Custom Setup - $1999/month
echo "Creating Enterprise Custom Setup ($1999/month)..."
ENT_CUSTOM_PRODUCT=$(stripe products create --name="Enterprise Custom Setup" --description="Custom enterprise solution with dedicated development")
ENT_CUSTOM_PRODUCT_ID=$(echo "$ENT_CUSTOM_PRODUCT" | grep '"id":' | head -1 | cut -d'"' -f4)
ENT_CUSTOM_PRICE=$(stripe prices create --product=$ENT_CUSTOM_PRODUCT_ID --unit-amount=199900 --currency=usd --recurring.interval=month --nickname="Enterprise Custom Monthly")
ENT_CUSTOM_PRICE_ID=$(echo "$ENT_CUSTOM_PRICE" | grep '"id":' | head -1 | cut -d'"' -f4)
echo "✅ Enterprise Custom: $ENT_CUSTOM_PRICE_ID"

# AI Training Starter - $10,000 one-time
echo "Creating AI Training Starter ($10,000 one-time)..."
TRAINING_STARTER_PRODUCT=$(stripe products create --name="AI Training Starter" --description="Basic custom model training package")
TRAINING_STARTER_PRODUCT_ID=$(echo "$TRAINING_STARTER_PRODUCT" | grep '"id":' | head -1 | cut -d'"' -f4)
TRAINING_STARTER_PRICE=$(stripe prices create --product=$TRAINING_STARTER_PRODUCT_ID --unit-amount=1000000 --currency=usd --nickname="AI Training Starter")
TRAINING_STARTER_PRICE_ID=$(echo "$TRAINING_STARTER_PRICE" | grep '"id":' | head -1 | cut -d'"' -f4)
echo "✅ AI Training Starter: $TRAINING_STARTER_PRICE_ID"

echo ""
echo "🎯 ALL REVENUE PRODUCT PRICE IDs:"
echo "=================================="
echo "# Core AI Plans (Already Created)"
echo "INDIVIDUAL_AI_MONTHLY=price_1RVJ08RwqAvTbIKuWpD9T8TJ"
echo "PROFESSIONAL_AI_MONTHLY=price_1RVJ0aRwqAvTbIKuDQ57QNkL"
echo "BUSINESS_AI_MONTHLY=price_1RVJ0bRwqAvTbIKuh4ABzpLt"
echo "ENTERPRISE_AI_MONTHLY=price_1RVJ0cRwqAvTbIKuEniR6biz"
echo ""
echo "# Industry AI Packages"
echo "LEGAL_AI_PACKAGE=price_1RVJ8CRwqAvTbIKumVT2tOjI"
echo "HEALTHCARE_AI_PACKAGE=$HEALTHCARE_PRICE_ID"
echo "FINANCIAL_AI_PACKAGE=$FINANCIAL_PRICE_ID"
echo "INSURANCE_AI_PACKAGE=$INSURANCE_PRICE_ID"
echo ""
echo "# Enterprise Setup Packages"
echo "ENTERPRISE_STANDARD_SETUP=$ENT_STANDARD_PRICE_ID"
echo "ENTERPRISE_PLUS_SETUP=$ENT_PLUS_PRICE_ID"
echo "ENTERPRISE_CUSTOM_SETUP=$ENT_CUSTOM_PRICE_ID"
echo ""
echo "# AI Training Services"
echo "AI_TRAINING_STARTER=$TRAINING_STARTER_PRICE_ID"
echo ""
echo "💰 TOTAL REVENUE POTENTIAL:"
echo "============================"
echo "Core Plans: $49-$1,999/month"
echo "Industry Packages: $2,999-$4,999/month"
echo "Enterprise Setup: $499-$1,999/month"
echo "AI Training: $10,000+ one-time"
echo ""
echo "🚀 ALL REVENUE PRODUCTS CREATED!"
echo "💰 READY TO SCALE TO $1M+ ARR!" 