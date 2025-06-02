#!/bin/bash

echo "🏢 Creating Enterprise One-Click Setup Packages..."
echo "=================================================="

# Enterprise Standard - $499/month
echo "Creating Enterprise Standard ($499/month)..."
ENTERPRISE_STANDARD_PRODUCT=$(stripe products create \
  --name="Enterprise Standard Setup" \
  --description="One-click enterprise setup for up to 100 users" \
  --metadata[plan_type]="enterprise_standard" \
  --metadata[setup_type]="one_click" \
  --metadata[max_users]="100" \
  --metadata[features]="instant_setup,dedicated_instance,basic_customization")

ENTERPRISE_STANDARD_PRODUCT_ID=$(echo "$ENTERPRISE_STANDARD_PRODUCT" | grep '"id":' | head -1 | cut -d'"' -f4)

ENTERPRISE_STANDARD_PRICE=$(stripe prices create \
  --product=$ENTERPRISE_STANDARD_PRODUCT_ID \
  --unit-amount=49900 \
  --currency=usd \
  --recurring.interval=month \
  --nickname="Enterprise Standard Monthly")

ENTERPRISE_STANDARD_PRICE_ID=$(echo "$ENTERPRISE_STANDARD_PRICE" | grep '"id":' | head -1 | cut -d'"' -f4)
echo "✅ Enterprise Standard: $ENTERPRISE_STANDARD_PRICE_ID"

# Enterprise Plus - $999/month
echo "Creating Enterprise Plus ($999/month)..."
ENTERPRISE_PLUS_PRODUCT=$(stripe products create \
  --name="Enterprise Plus Setup" \
  --description="Premium enterprise features with unlimited users" \
  --metadata[plan_type]="enterprise_plus" \
  --metadata[setup_type]="one_click" \
  --metadata[max_users]="unlimited" \
  --metadata[features]="instant_setup,dedicated_instance,advanced_customization,priority_support")

ENTERPRISE_PLUS_PRODUCT_ID=$(echo "$ENTERPRISE_PLUS_PRODUCT" | grep '"id":' | head -1 | cut -d'"' -f4)

ENTERPRISE_PLUS_PRICE=$(stripe prices create \
  --product=$ENTERPRISE_PLUS_PRODUCT_ID \
  --unit-amount=99900 \
  --currency=usd \
  --recurring.interval=month \
  --nickname="Enterprise Plus Monthly")

ENTERPRISE_PLUS_PRICE_ID=$(echo "$ENTERPRISE_PLUS_PRICE" | grep '"id":' | head -1 | cut -d'"' -f4)
echo "✅ Enterprise Plus: $ENTERPRISE_PLUS_PRICE_ID"

# Enterprise Custom - $1999/month
echo "Creating Enterprise Custom ($1999/month)..."
ENTERPRISE_CUSTOM_PRODUCT=$(stripe products create \
  --name="Enterprise Custom Setup" \
  --description="Custom enterprise solution with dedicated development" \
  --metadata[plan_type]="enterprise_custom" \
  --metadata[setup_type]="one_click" \
  --metadata[custom_development]="true" \
  --metadata[features]="instant_setup,dedicated_team,full_customization,white_label")

ENTERPRISE_CUSTOM_PRODUCT_ID=$(echo "$ENTERPRISE_CUSTOM_PRODUCT" | grep '"id":' | head -1 | cut -d'"' -f4)

ENTERPRISE_CUSTOM_PRICE=$(stripe prices create \
  --product=$ENTERPRISE_CUSTOM_PRODUCT_ID \
  --unit-amount=199900 \
  --currency=usd \
  --recurring.interval=month \
  --nickname="Enterprise Custom Monthly")

ENTERPRISE_CUSTOM_PRICE_ID=$(echo "$ENTERPRISE_CUSTOM_PRICE" | grep '"id":' | head -1 | cut -d'"' -f4)
echo "✅ Enterprise Custom: $ENTERPRISE_CUSTOM_PRICE_ID"

echo ""
echo "🎯 ENTERPRISE SETUP PRICE IDs:"
echo "================================"
echo "ENTERPRISE_STANDARD_SETUP=$ENTERPRISE_STANDARD_PRICE_ID"
echo "ENTERPRISE_PLUS_SETUP=$ENTERPRISE_PLUS_PRICE_ID"
echo "ENTERPRISE_CUSTOM_SETUP=$ENTERPRISE_CUSTOM_PRICE_ID"
echo ""
echo "💰 ENTERPRISE REVENUE POTENTIAL:"
echo "- Enterprise Standard: $499/month (up to 100 users)"
echo "- Enterprise Plus: $999/month (unlimited users)"
echo "- Enterprise Custom: $1,999/month (custom development)"
echo ""
echo "🚀 Enterprise packages created successfully!"
echo "💰 Ready for one-click enterprise sales!" 