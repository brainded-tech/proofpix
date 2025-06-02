#!/bin/bash

echo "🚀 Creating ProofPix AI-Enhanced Products..."
echo "============================================="

# Create Individual AI Plan
echo "Creating Individual AI Plan ($49/month)..."
INDIVIDUAL_PRODUCT=$(stripe products create \
  --name="Individual AI" \
  --description="AI-powered document processing for professionals" \
  --metadata[plan_type]="individual_ai" \
  --metadata[features]="ai_ocr,smart_classification,quality_assessment,fraud_detection")

INDIVIDUAL_PRODUCT_ID=$(echo $INDIVIDUAL_PRODUCT | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)

INDIVIDUAL_PRICE=$(stripe prices create \
  --product=$INDIVIDUAL_PRODUCT_ID \
  --unit-amount=4900 \
  --currency=usd \
  --recurring[interval]=month \
  --nickname="Individual AI Monthly")

INDIVIDUAL_PRICE_ID=$(echo $INDIVIDUAL_PRICE | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)
echo "✅ Individual AI: $INDIVIDUAL_PRICE_ID"

# Create Professional AI Plan
echo "Creating Professional AI Plan ($149/month)..."
PROFESSIONAL_PRODUCT=$(stripe products create \
  --name="Professional AI" \
  --description="Advanced AI features for growing teams" \
  --metadata[plan_type]="professional_ai" \
  --metadata[features]="advanced_ai,entity_extraction,custom_models,team_collaboration")

PROFESSIONAL_PRODUCT_ID=$(echo $PROFESSIONAL_PRODUCT | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)

PROFESSIONAL_PRICE=$(stripe prices create \
  --product=$PROFESSIONAL_PRODUCT_ID \
  --unit-amount=14900 \
  --currency=usd \
  --recurring[interval]=month \
  --nickname="Professional AI Monthly")

PROFESSIONAL_PRICE_ID=$(echo $PROFESSIONAL_PRICE | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)
echo "✅ Professional AI: $PROFESSIONAL_PRICE_ID"

# Create Business AI Plan
echo "Creating Business AI Plan ($499/month)..."
BUSINESS_PRODUCT=$(stripe products create \
  --name="Business AI" \
  --description="Enterprise-grade AI for organizations" \
  --metadata[plan_type]="business_ai" \
  --metadata[features]="industry_models,compliance_monitoring,advanced_analytics,sso")

BUSINESS_PRODUCT_ID=$(echo $BUSINESS_PRODUCT | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)

BUSINESS_PRICE=$(stripe prices create \
  --product=$BUSINESS_PRODUCT_ID \
  --unit-amount=49900 \
  --currency=usd \
  --recurring[interval]=month \
  --nickname="Business AI Monthly")

BUSINESS_PRICE_ID=$(echo $BUSINESS_PRICE | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)
echo "✅ Business AI: $BUSINESS_PRICE_ID"

# Create Enterprise AI Plan
echo "Creating Enterprise AI Plan ($1999/month)..."
ENTERPRISE_PRODUCT=$(stripe products create \
  --name="Enterprise AI" \
  --description="Unlimited AI with custom development" \
  --metadata[plan_type]="enterprise_ai" \
  --metadata[features]="unlimited_ai,custom_development,white_label,dedicated_support")

ENTERPRISE_PRODUCT_ID=$(echo $ENTERPRISE_PRODUCT | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)

ENTERPRISE_PRICE=$(stripe prices create \
  --product=$ENTERPRISE_PRODUCT_ID \
  --unit-amount=199900 \
  --currency=usd \
  --recurring[interval]=month \
  --nickname="Enterprise AI Monthly")

ENTERPRISE_PRICE_ID=$(echo $ENTERPRISE_PRICE | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)
echo "✅ Enterprise AI: $ENTERPRISE_PRICE_ID"

echo ""
echo "🎯 PRICE IDs FOR CODE UPDATE:"
echo "================================"
echo "INDIVIDUAL_AI_MONTHLY=$INDIVIDUAL_PRICE_ID"
echo "PROFESSIONAL_AI_MONTHLY=$PROFESSIONAL_PRICE_ID"
echo "BUSINESS_AI_MONTHLY=$BUSINESS_PRICE_ID"
echo "ENTERPRISE_AI_MONTHLY=$ENTERPRISE_PRICE_ID"
echo ""
echo "🚀 Core AI plans created successfully!"
echo "💰 Ready to start making money!" 