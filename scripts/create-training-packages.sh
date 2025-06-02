#!/bin/bash

echo "🧠 Creating AI Training Packages..."
echo "==================================="

# AI Training Starter - $10,000 one-time
echo "Creating AI Training Starter ($10,000 one-time)..."
TRAINING_STARTER_PRODUCT=$(stripe products create \
  --name="AI Training Starter" \
  --description="Basic custom model training package for up to 1,000 documents" \
  --metadata[service_type]="ai_training" \
  --metadata[training_docs]="1000" \
  --metadata[delivery_time]="2_weeks" \
  --metadata[features]="custom_model,basic_training,email_support")

TRAINING_STARTER_PRODUCT_ID=$(echo "$TRAINING_STARTER_PRODUCT" | grep '"id":' | head -1 | cut -d'"' -f4)

TRAINING_STARTER_PRICE=$(stripe prices create \
  --product=$TRAINING_STARTER_PRODUCT_ID \
  --unit-amount=1000000 \
  --currency=usd \
  --nickname="AI Training Starter")

TRAINING_STARTER_PRICE_ID=$(echo "$TRAINING_STARTER_PRICE" | grep '"id":' | head -1 | cut -d'"' -f4)
echo "✅ AI Training Starter: $TRAINING_STARTER_PRICE_ID"

# AI Training Professional - $25,000 setup + $1,000/month
echo "Creating AI Training Professional ($25,000 setup + $1,000/month)..."
TRAINING_PRO_PRODUCT=$(stripe products create \
  --name="AI Training Professional" \
  --description="Advanced custom model training with ongoing updates for up to 10,000 documents" \
  --metadata[service_type]="ai_training_pro" \
  --metadata[training_docs]="10000" \
  --metadata[delivery_time]="4_weeks" \
  --metadata[features]="advanced_model,ongoing_updates,priority_support,api_integration")

TRAINING_PRO_PRODUCT_ID=$(echo "$TRAINING_PRO_PRODUCT" | grep '"id":' | head -1 | cut -d'"' -f4)

# Setup fee
TRAINING_PRO_SETUP_PRICE=$(stripe prices create \
  --product=$TRAINING_PRO_PRODUCT_ID \
  --unit-amount=2500000 \
  --currency=usd \
  --nickname="AI Training Pro Setup")

TRAINING_PRO_SETUP_PRICE_ID=$(echo "$TRAINING_PRO_SETUP_PRICE" | grep '"id":' | head -1 | cut -d'"' -f4)

# Monthly fee
TRAINING_PRO_MONTHLY_PRICE=$(stripe prices create \
  --product=$TRAINING_PRO_PRODUCT_ID \
  --unit-amount=100000 \
  --currency=usd \
  --recurring.interval=month \
  --nickname="AI Training Pro Monthly")

TRAINING_PRO_MONTHLY_PRICE_ID=$(echo "$TRAINING_PRO_MONTHLY_PRICE" | grep '"id":' | head -1 | cut -d'"' -f4)
echo "✅ AI Training Professional: Setup $TRAINING_PRO_SETUP_PRICE_ID, Monthly $TRAINING_PRO_MONTHLY_PRICE_ID"

# AI Training Enterprise - $100,000 setup + $5,000/month
echo "Creating AI Training Enterprise ($100,000 setup + $5,000/month)..."
TRAINING_ENT_PRODUCT=$(stripe products create \
  --name="AI Training Enterprise" \
  --description="Enterprise custom model development with dedicated team and unlimited documents" \
  --metadata[service_type]="ai_training_enterprise" \
  --metadata[training_docs]="unlimited" \
  --metadata[delivery_time]="8_weeks" \
  --metadata[features]="dedicated_team,unlimited_training,white_label,on_premise")

TRAINING_ENT_PRODUCT_ID=$(echo "$TRAINING_ENT_PRODUCT" | grep '"id":' | head -1 | cut -d'"' -f4)

# Setup fee
TRAINING_ENT_SETUP_PRICE=$(stripe prices create \
  --product=$TRAINING_ENT_PRODUCT_ID \
  --unit-amount=10000000 \
  --currency=usd \
  --nickname="AI Training Enterprise Setup")

TRAINING_ENT_SETUP_PRICE_ID=$(echo "$TRAINING_ENT_SETUP_PRICE" | grep '"id":' | head -1 | cut -d'"' -f4)

# Monthly fee
TRAINING_ENT_MONTHLY_PRICE=$(stripe prices create \
  --product=$TRAINING_ENT_PRODUCT_ID \
  --unit-amount=500000 \
  --currency=usd \
  --recurring.interval=month \
  --nickname="AI Training Enterprise Monthly")

TRAINING_ENT_MONTHLY_PRICE_ID=$(echo "$TRAINING_ENT_MONTHLY_PRICE" | grep '"id":' | head -1 | cut -d'"' -f4)
echo "✅ AI Training Enterprise: Setup $TRAINING_ENT_SETUP_PRICE_ID, Monthly $TRAINING_ENT_MONTHLY_PRICE_ID"

echo ""
echo "🎯 AI TRAINING PACKAGE PRICE IDs:"
echo "=================================="
echo "TRAINING_STARTER=$TRAINING_STARTER_PRICE_ID"
echo "TRAINING_PRO_SETUP=$TRAINING_PRO_SETUP_PRICE_ID"
echo "TRAINING_PRO_MONTHLY=$TRAINING_PRO_MONTHLY_PRICE_ID"
echo "TRAINING_ENT_SETUP=$TRAINING_ENT_SETUP_PRICE_ID"
echo "TRAINING_ENT_MONTHLY=$TRAINING_ENT_MONTHLY_PRICE_ID"
echo ""
echo "💰 PREMIUM REVENUE POTENTIAL:"
echo "- AI Training Starter: $10,000 one-time"
echo "- AI Training Professional: $25,000 setup + $1,000/month"
echo "- AI Training Enterprise: $100,000 setup + $5,000/month"
echo ""
echo "🚀 AI Training packages created successfully!"
echo "💰 Ready for premium AI services!" 