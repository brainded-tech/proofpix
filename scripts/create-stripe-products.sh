#!/bin/bash

# 🚀 ProofPix Stripe Products Creation Script
# Run this script after installing Stripe CLI and logging in

echo "🚀 Creating ProofPix Stripe Products..."
echo "Make sure you're logged into Stripe CLI: stripe login"
echo ""

# Core AI-Enhanced Plans
echo "📦 Creating Core AI Plans..."

echo "Creating Individual AI Plan..."
INDIVIDUAL_PRODUCT=$(stripe products create \
  --name="Individual AI" \
  --description="AI-powered document processing for professionals" \
  --metadata[plan_type]="individual_ai" \
  --metadata[features]="ai_ocr,smart_classification,quality_assessment,fraud_detection" \
  --format=json | jq -r '.id')

INDIVIDUAL_PRICE=$(stripe prices create \
  --product=$INDIVIDUAL_PRODUCT \
  --unit-amount=4900 \
  --currency=usd \
  --recurring[interval]=month \
  --nickname="Individual AI Monthly" \
  --format=json | jq -r '.id')

echo "✅ Individual AI: Product $INDIVIDUAL_PRODUCT, Price $INDIVIDUAL_PRICE"

echo "Creating Professional AI Plan..."
PROFESSIONAL_PRODUCT=$(stripe products create \
  --name="Professional AI" \
  --description="Advanced AI features for growing teams" \
  --metadata[plan_type]="professional_ai" \
  --metadata[features]="advanced_ai,entity_extraction,custom_models,team_collaboration" \
  --format=json | jq -r '.id')

PROFESSIONAL_PRICE=$(stripe prices create \
  --product=$PROFESSIONAL_PRODUCT \
  --unit-amount=14900 \
  --currency=usd \
  --recurring[interval]=month \
  --nickname="Professional AI Monthly" \
  --format=json | jq -r '.id')

echo "✅ Professional AI: Product $PROFESSIONAL_PRODUCT, Price $PROFESSIONAL_PRICE"

echo "Creating Business AI Plan..."
BUSINESS_PRODUCT=$(stripe products create \
  --name="Business AI" \
  --description="Enterprise-grade AI for organizations" \
  --metadata[plan_type]="business_ai" \
  --metadata[features]="industry_models,compliance_monitoring,advanced_analytics,sso" \
  --format=json | jq -r '.id')

BUSINESS_PRICE=$(stripe prices create \
  --product=$BUSINESS_PRODUCT \
  --unit-amount=49900 \
  --currency=usd \
  --recurring[interval]=month \
  --nickname="Business AI Monthly" \
  --format=json | jq -r '.id')

echo "✅ Business AI: Product $BUSINESS_PRODUCT, Price $BUSINESS_PRICE"

echo "Creating Enterprise AI Plan..."
ENTERPRISE_PRODUCT=$(stripe products create \
  --name="Enterprise AI" \
  --description="Unlimited AI with custom development" \
  --metadata[plan_type]="enterprise_ai" \
  --metadata[features]="unlimited_ai,custom_development,white_label,dedicated_support" \
  --format=json | jq -r '.id')

ENTERPRISE_PRICE=$(stripe prices create \
  --product=$ENTERPRISE_PRODUCT \
  --unit-amount=199900 \
  --currency=usd \
  --recurring[interval]=month \
  --nickname="Enterprise AI Monthly" \
  --format=json | jq -r '.id')

echo "✅ Enterprise AI: Product $ENTERPRISE_PRODUCT, Price $ENTERPRISE_PRICE"

# Enterprise One-Click Setup Plans
echo ""
echo "🏢 Creating Enterprise One-Click Setup Plans..."

echo "Creating Enterprise Standard..."
ENT_STANDARD_PRODUCT=$(stripe products create \
  --name="Enterprise Standard" \
  --description="One-click enterprise setup for large organizations" \
  --metadata[plan_type]="enterprise_standard" \
  --metadata[setup_type]="one_click" \
  --metadata[max_users]="100" \
  --format=json | jq -r '.id')

ENT_STANDARD_PRICE=$(stripe prices create \
  --product=$ENT_STANDARD_PRODUCT \
  --unit-amount=49900 \
  --currency=usd \
  --recurring[interval]=month \
  --nickname="Enterprise Standard Monthly" \
  --format=json | jq -r '.id')

echo "✅ Enterprise Standard: Product $ENT_STANDARD_PRODUCT, Price $ENT_STANDARD_PRICE"

echo "Creating Enterprise Plus..."
ENT_PLUS_PRODUCT=$(stripe products create \
  --name="Enterprise Plus" \
  --description="Premium enterprise features with unlimited users" \
  --metadata[plan_type]="enterprise_plus" \
  --metadata[setup_type]="one_click" \
  --metadata[max_users]="unlimited" \
  --format=json | jq -r '.id')

ENT_PLUS_PRICE=$(stripe prices create \
  --product=$ENT_PLUS_PRODUCT \
  --unit-amount=99900 \
  --currency=usd \
  --recurring[interval]=month \
  --nickname="Enterprise Plus Monthly" \
  --format=json | jq -r '.id')

echo "✅ Enterprise Plus: Product $ENT_PLUS_PRODUCT, Price $ENT_PLUS_PRICE"

echo "Creating Enterprise Custom..."
ENT_CUSTOM_PRODUCT=$(stripe products create \
  --name="Enterprise Custom" \
  --description="Custom enterprise solution with dedicated development" \
  --metadata[plan_type]="enterprise_custom" \
  --metadata[setup_type]="one_click" \
  --metadata[custom_development]="true" \
  --format=json | jq -r '.id')

ENT_CUSTOM_PRICE=$(stripe prices create \
  --product=$ENT_CUSTOM_PRODUCT \
  --unit-amount=199900 \
  --currency=usd \
  --recurring[interval]=month \
  --nickname="Enterprise Custom Monthly" \
  --format=json | jq -r '.id')

echo "✅ Enterprise Custom: Product $ENT_CUSTOM_PRODUCT, Price $ENT_CUSTOM_PRICE"

# Industry-Specific AI Packages
echo ""
echo "🏭 Creating Industry-Specific AI Packages..."

echo "Creating Legal AI Package..."
LEGAL_PRODUCT=$(stripe products create \
  --name="Legal AI Package" \
  --description="Specialized AI for legal document processing" \
  --metadata[industry]="legal" \
  --metadata[compliance]="court_admissible" \
  --format=json | jq -r '.id')

LEGAL_PRICE=$(stripe prices create \
  --product=$LEGAL_PRODUCT \
  --unit-amount=299900 \
  --currency=usd \
  --recurring[interval]=month \
  --nickname="Legal AI Monthly" \
  --format=json | jq -r '.id')

echo "✅ Legal AI: Product $LEGAL_PRODUCT, Price $LEGAL_PRICE"

echo "Creating Healthcare AI Package..."
HEALTHCARE_PRODUCT=$(stripe products create \
  --name="Healthcare AI Package" \
  --description="HIPAA-compliant AI for healthcare organizations" \
  --metadata[industry]="healthcare" \
  --metadata[compliance]="hipaa" \
  --format=json | jq -r '.id')

HEALTHCARE_PRICE=$(stripe prices create \
  --product=$HEALTHCARE_PRODUCT \
  --unit-amount=399900 \
  --currency=usd \
  --recurring[interval]=month \
  --nickname="Healthcare AI Monthly" \
  --format=json | jq -r '.id')

echo "✅ Healthcare AI: Product $HEALTHCARE_PRODUCT, Price $HEALTHCARE_PRICE"

echo "Creating Financial AI Package..."
FINANCIAL_PRODUCT=$(stripe products create \
  --name="Financial AI Package" \
  --description="Advanced fraud detection for financial institutions" \
  --metadata[industry]="financial" \
  --metadata[compliance]="sox_pci" \
  --format=json | jq -r '.id')

FINANCIAL_PRICE=$(stripe prices create \
  --product=$FINANCIAL_PRODUCT \
  --unit-amount=499900 \
  --currency=usd \
  --recurring[interval]=month \
  --nickname="Financial AI Monthly" \
  --format=json | jq -r '.id')

echo "✅ Financial AI: Product $FINANCIAL_PRODUCT, Price $FINANCIAL_PRICE"

echo "Creating Insurance AI Package..."
INSURANCE_PRODUCT=$(stripe products create \
  --name="Insurance AI Package" \
  --description="Claims processing and fraud detection for insurance" \
  --metadata[industry]="insurance" \
  --metadata[compliance]="claims_processing" \
  --format=json | jq -r '.id')

INSURANCE_PRICE=$(stripe prices create \
  --product=$INSURANCE_PRODUCT \
  --unit-amount=349900 \
  --currency=usd \
  --recurring[interval]=month \
  --nickname="Insurance AI Monthly" \
  --format=json | jq -r '.id')

echo "✅ Insurance AI: Product $INSURANCE_PRODUCT, Price $INSURANCE_PRICE"

# Create yearly versions with 20% discount
echo ""
echo "📅 Creating Yearly Plans (20% discount)..."

INDIVIDUAL_YEARLY=$(stripe prices create \
  --product=$INDIVIDUAL_PRODUCT \
  --unit-amount=47040 \
  --currency=usd \
  --recurring[interval]=year \
  --nickname="Individual AI Yearly" \
  --format=json | jq -r '.id')

PROFESSIONAL_YEARLY=$(stripe prices create \
  --product=$PROFESSIONAL_PRODUCT \
  --unit-amount=143040 \
  --currency=usd \
  --recurring[interval]=year \
  --nickname="Professional AI Yearly" \
  --format=json | jq -r '.id')

BUSINESS_YEARLY=$(stripe prices create \
  --product=$BUSINESS_PRODUCT \
  --unit-amount=479040 \
  --currency=usd \
  --recurring[interval]=year \
  --nickname="Business AI Yearly" \
  --format=json | jq -r '.id')

ENTERPRISE_YEARLY=$(stripe prices create \
  --product=$ENTERPRISE_PRODUCT \
  --unit-amount=1919040 \
  --currency=usd \
  --recurring[interval]=year \
  --nickname="Enterprise AI Yearly" \
  --format=json | jq -r '.id')

echo "✅ Yearly plans created"

# Output all price IDs for easy copying
echo ""
echo "🎯 PRICE IDs FOR CODE UPDATE:"
echo "================================"
echo "# Core AI Plans"
echo "INDIVIDUAL_AI_MONTHLY=$INDIVIDUAL_PRICE"
echo "PROFESSIONAL_AI_MONTHLY=$PROFESSIONAL_PRICE"
echo "BUSINESS_AI_MONTHLY=$BUSINESS_PRICE"
echo "ENTERPRISE_AI_MONTHLY=$ENTERPRISE_PRICE"
echo ""
echo "# Enterprise One-Click Plans"
echo "ENTERPRISE_STANDARD=$ENT_STANDARD_PRICE"
echo "ENTERPRISE_PLUS=$ENT_PLUS_PRICE"
echo "ENTERPRISE_CUSTOM=$ENT_CUSTOM_PRICE"
echo ""
echo "# Industry AI Packages"
echo "LEGAL_AI=$LEGAL_PRICE"
echo "HEALTHCARE_AI=$HEALTHCARE_PRICE"
echo "FINANCIAL_AI=$FINANCIAL_PRICE"
echo "INSURANCE_AI=$INSURANCE_PRICE"
echo ""
echo "# Yearly Plans"
echo "INDIVIDUAL_AI_YEARLY=$INDIVIDUAL_YEARLY"
echo "PROFESSIONAL_AI_YEARLY=$PROFESSIONAL_YEARLY"
echo "BUSINESS_AI_YEARLY=$BUSINESS_YEARLY"
echo "ENTERPRISE_AI_YEARLY=$ENTERPRISE_YEARLY"
echo ""
echo "🚀 All products created successfully!"
echo "💰 Ready to start making money!" 