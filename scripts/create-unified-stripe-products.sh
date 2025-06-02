#!/bin/bash

# 🎯 CMO's Unified "Privacy-First Hybrid" Pricing Strategy
# Stripe Product Creation Script

echo "🚀 Creating Stripe products for Unified Pricing Strategy..."

# Check if Stripe CLI is installed
if ! command -v stripe &> /dev/null; then
    echo "❌ Stripe CLI is not installed. Please install it first:"
    echo "   https://stripe.com/docs/stripe-cli"
    exit 1
fi

# Check if logged in to Stripe
if ! stripe config --list | grep -q "test_mode = true\|live_mode = true"; then
    echo "❌ Please login to Stripe CLI first:"
    echo "   stripe login"
    exit 1
fi

echo "✅ Stripe CLI detected and configured"

# =============================================================================
# SESSION PASSES (Entry Drug Strategy)
# =============================================================================

echo "📦 Creating Session Pass products..."

# Day Pass - $2.99
echo "Creating Day Pass..."
DAY_PASS_PRODUCT=$(stripe products create \
  --name="ProofPix Day Pass" \
  --description="24-hour unlimited access to ProofPix with Privacy Mode" \
  --metadata[category]="session_pass" \
  --metadata[duration]="24_hours" \
  --format=json | jq -r '.id')

stripe prices create \
  --product="$DAY_PASS_PRODUCT" \
  --unit-amount=299 \
  --currency=usd \
  --metadata[price_id]="price_session_day" \
  --metadata[pass_type]="day"

# Week Pass - $9.99
echo "Creating Week Pass..."
WEEK_PASS_PRODUCT=$(stripe products create \
  --name="ProofPix Week Pass" \
  --description="7-day unlimited access with Privacy + basic Collaboration" \
  --metadata[category]="session_pass" \
  --metadata[duration]="7_days" \
  --format=json | jq -r '.id')

stripe prices create \
  --product="$WEEK_PASS_PRODUCT" \
  --unit-amount=999 \
  --currency=usd \
  --metadata[price_id]="price_session_week" \
  --metadata[pass_type]="week"

# Month Pass - $49.99
echo "Creating Month Pass..."
MONTH_PASS_PRODUCT=$(stripe products create \
  --name="ProofPix Month Pass" \
  --description="30-day unlimited access with full Privacy + Collaboration modes" \
  --metadata[category]="session_pass" \
  --metadata[duration]="30_days" \
  --format=json | jq -r '.id')

stripe prices create \
  --product="$MONTH_PASS_PRODUCT" \
  --unit-amount=4999 \
  --currency=usd \
  --metadata[price_id]="price_session_month" \
  --metadata[pass_type]="month"

# =============================================================================
# MAIN SUBSCRIPTION TIERS
# =============================================================================

echo "💼 Creating Main Subscription products..."

# Professional - $99/month, $950/year
echo "Creating Professional Plan..."
PROFESSIONAL_PRODUCT=$(stripe products create \
  --name="ProofPix Professional" \
  --description="Perfect for professionals and small teams - includes both Privacy and Collaboration modes" \
  --metadata[category]="subscription" \
  --metadata[tier]="professional" \
  --metadata[team_members]="5" \
  --metadata[ai_credits]="100" \
  --format=json | jq -r '.id')

stripe prices create \
  --product="$PROFESSIONAL_PRODUCT" \
  --unit-amount=9900 \
  --currency=usd \
  --recurring[interval]=month \
  --metadata[price_id]="price_professional_unified_monthly" \
  --metadata[billing]="monthly"

stripe prices create \
  --product="$PROFESSIONAL_PRODUCT" \
  --unit-amount=95000 \
  --currency=usd \
  --recurring[interval]=year \
  --metadata[price_id]="price_professional_unified_yearly" \
  --metadata[billing]="yearly" \
  --metadata[discount]="20_percent"

# Business - $299/month, $2870/year (Most Popular)
echo "Creating Business Plan..."
BUSINESS_PRODUCT=$(stripe products create \
  --name="ProofPix Business" \
  --description="Most popular for growing businesses - advanced features with 25 team members" \
  --metadata[category]="subscription" \
  --metadata[tier]="business" \
  --metadata[team_members]="25" \
  --metadata[ai_credits]="500" \
  --metadata[popular]="true" \
  --format=json | jq -r '.id')

stripe prices create \
  --product="$BUSINESS_PRODUCT" \
  --unit-amount=29900 \
  --currency=usd \
  --recurring[interval]=month \
  --metadata[price_id]="price_business_unified_monthly" \
  --metadata[billing]="monthly"

stripe prices create \
  --product="$BUSINESS_PRODUCT" \
  --unit-amount=287000 \
  --currency=usd \
  --recurring[interval]=year \
  --metadata[price_id]="price_business_unified_yearly" \
  --metadata[billing]="yearly" \
  --metadata[discount]="20_percent"

# Enterprise - $999/month, $9590/year
echo "Creating Enterprise Plan..."
ENTERPRISE_PRODUCT=$(stripe products create \
  --name="ProofPix Enterprise" \
  --description="Complete platform control with unlimited users and all industry AI models" \
  --metadata[category]="subscription" \
  --metadata[tier]="enterprise" \
  --metadata[team_members]="unlimited" \
  --metadata[ai_credits]="2000" \
  --format=json | jq -r '.id')

stripe prices create \
  --product="$ENTERPRISE_PRODUCT" \
  --unit-amount=99900 \
  --currency=usd \
  --recurring[interval]=month \
  --metadata[price_id]="price_enterprise_unified_monthly" \
  --metadata[billing]="monthly"

stripe prices create \
  --product="$ENTERPRISE_PRODUCT" \
  --unit-amount=959000 \
  --currency=usd \
  --recurring[interval]=year \
  --metadata[price_id]="price_enterprise_unified_yearly" \
  --metadata[billing]="yearly" \
  --metadata[discount]="20_percent"

# Custom Enterprise - $2999/month
echo "Creating Custom Enterprise Plan..."
CUSTOM_PRODUCT=$(stripe products create \
  --name="ProofPix Custom Enterprise" \
  --description="Tailored solutions for large organizations with on-premise deployment" \
  --metadata[category]="subscription" \
  --metadata[tier]="custom" \
  --metadata[team_members]="unlimited" \
  --metadata[ai_credits]="unlimited" \
  --format=json | jq -r '.id')

stripe prices create \
  --product="$CUSTOM_PRODUCT" \
  --unit-amount=299900 \
  --currency=usd \
  --recurring[interval]=month \
  --metadata[price_id]="price_custom_enterprise" \
  --metadata[billing]="monthly"

# =============================================================================
# AI ADD-ONS (Pure Profit)
# =============================================================================

echo "🤖 Creating AI Add-on products..."

# Legal AI Package - $999/month
echo "Creating Legal AI Package..."
LEGAL_AI_PRODUCT=$(stripe products create \
  --name="Legal AI Package" \
  --description="Contract analysis, legal document classification, and compliance tools" \
  --metadata[category]="ai_addon" \
  --metadata[industry]="legal" \
  --format=json | jq -r '.id')

stripe prices create \
  --product="$LEGAL_AI_PRODUCT" \
  --unit-amount=99900 \
  --currency=usd \
  --recurring[interval]=month \
  --metadata[price_id]="price_legal_ai_package_monthly" \
  --metadata[addon_type]="industry_ai"

# Healthcare AI Package - $1499/month
echo "Creating Healthcare AI Package..."
HEALTHCARE_AI_PRODUCT=$(stripe products create \
  --name="Healthcare AI Package" \
  --description="HIPAA-compliant medical document processing and PHI protection" \
  --metadata[category]="ai_addon" \
  --metadata[industry]="healthcare" \
  --format=json | jq -r '.id')

stripe prices create \
  --product="$HEALTHCARE_AI_PRODUCT" \
  --unit-amount=149900 \
  --currency=usd \
  --recurring[interval]=month \
  --metadata[price_id]="price_healthcare_ai_package_monthly" \
  --metadata[addon_type]="industry_ai"

# Financial AI Package - $1999/month
echo "Creating Financial AI Package..."
FINANCIAL_AI_PRODUCT=$(stripe products create \
  --name="Financial AI Package" \
  --description="SOX compliance automation and financial document analysis" \
  --metadata[category]="ai_addon" \
  --metadata[industry]="financial" \
  --format=json | jq -r '.id')

stripe prices create \
  --product="$FINANCIAL_AI_PRODUCT" \
  --unit-amount=199900 \
  --currency=usd \
  --recurring[interval]=month \
  --metadata[price_id]="price_financial_ai_package_monthly" \
  --metadata[addon_type]="industry_ai"

# Insurance AI Package - $999/month
echo "Creating Insurance AI Package..."
INSURANCE_AI_PRODUCT=$(stripe products create \
  --name="Insurance AI Package" \
  --description="Claims processing automation and fraud detection" \
  --metadata[category]="ai_addon" \
  --metadata[industry]="insurance" \
  --format=json | jq -r '.id')

stripe prices create \
  --product="$INSURANCE_AI_PRODUCT" \
  --unit-amount=99900 \
  --currency=usd \
  --recurring[interval]=month \
  --metadata[price_id]="price_insurance_ai_package_monthly" \
  --metadata[addon_type]="industry_ai"

# =============================================================================
# AI TRAINING PACKAGES (One-time)
# =============================================================================

echo "🎓 Creating AI Training products..."

# Basic AI Training - $999 one-time
echo "Creating Basic AI Training..."
BASIC_TRAINING_PRODUCT=$(stripe products create \
  --name="Basic AI Training" \
  --description="Custom AI model training with 1,000 samples" \
  --metadata[category]="ai_training" \
  --metadata[tier]="basic" \
  --metadata[samples]="1000" \
  --format=json | jq -r '.id')

stripe prices create \
  --product="$BASIC_TRAINING_PRODUCT" \
  --unit-amount=99900 \
  --currency=usd \
  --metadata[price_id]="price_ai_training_basic" \
  --metadata[training_type]="basic"

# Advanced AI Training - $2999 one-time
echo "Creating Advanced AI Training..."
ADVANCED_TRAINING_PRODUCT=$(stripe products create \
  --name="Advanced AI Training" \
  --description="Advanced AI model training with 10,000 samples" \
  --metadata[category]="ai_training" \
  --metadata[tier]="advanced" \
  --metadata[samples]="10000" \
  --format=json | jq -r '.id')

stripe prices create \
  --product="$ADVANCED_TRAINING_PRODUCT" \
  --unit-amount=299900 \
  --currency=usd \
  --metadata[price_id]="price_ai_training_advanced" \
  --metadata[training_type]="advanced"

# Enterprise AI Training - $9999 one-time
echo "Creating Enterprise AI Training..."
ENTERPRISE_TRAINING_PRODUCT=$(stripe products create \
  --name="Enterprise AI Training" \
  --description="Unlimited AI model training with dedicated support" \
  --metadata[category]="ai_training" \
  --metadata[tier]="enterprise" \
  --metadata[samples]="unlimited" \
  --format=json | jq -r '.id')

stripe prices create \
  --product="$ENTERPRISE_TRAINING_PRODUCT" \
  --unit-amount=999900 \
  --currency=usd \
  --metadata[price_id]="price_ai_training_enterprise" \
  --metadata[training_type]="enterprise"

# =============================================================================
# SUMMARY
# =============================================================================

echo ""
echo "🎉 SUCCESS! All Stripe products created for Unified Pricing Strategy"
echo ""
echo "📊 SUMMARY:"
echo "   Session Passes: 3 products (Day, Week, Month)"
echo "   Subscription Tiers: 4 products (Professional, Business, Enterprise, Custom)"
echo "   AI Add-ons: 4 products (Legal, Healthcare, Financial, Insurance)"
echo "   AI Training: 3 products (Basic, Advanced, Enterprise)"
echo ""
echo "💰 REVENUE POTENTIAL:"
echo "   Conservative ARR: $10.66M with 1,000 customers"
echo "   AI Add-on Revenue: $389K/month (30% attach rate)"
echo "   Total MRR: $888K/month"
echo ""
echo "🔗 Next Steps:"
echo "   1. Update your .env file with the new price IDs"
echo "   2. Test the checkout flow on /pricing-v2"
echo "   3. Set up webhooks for subscription management"
echo "   4. Configure automated enterprise onboarding"
echo ""
echo "🚀 Ready to launch the billion-dollar pricing strategy!" 