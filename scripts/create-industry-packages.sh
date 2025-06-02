#!/bin/bash

echo "🏭 Creating Industry-Specific AI Packages..."
echo "============================================="

# Legal AI Package - $2999/month
echo "Creating Legal AI Package ($2999/month)..."
LEGAL_PRODUCT=$(stripe products create \
  --name="Legal AI Package" \
  --description="Specialized AI for legal document processing with court-admissible metadata" \
  --metadata[industry]="legal" \
  --metadata[compliance]="court_admissible" \
  --metadata[features]="legal_ocr,case_analysis,contract_review,evidence_chain")

LEGAL_PRODUCT_ID=$(echo "$LEGAL_PRODUCT" | grep '"id":' | head -1 | cut -d'"' -f4)

LEGAL_PRICE=$(stripe prices create \
  --product=$LEGAL_PRODUCT_ID \
  --unit-amount=299900 \
  --currency=usd \
  --recurring.interval=month \
  --nickname="Legal AI Monthly")

LEGAL_PRICE_ID=$(echo "$LEGAL_PRICE" | grep '"id":' | head -1 | cut -d'"' -f4)
echo "✅ Legal AI Package: $LEGAL_PRICE_ID"

# Healthcare AI Package - $3999/month
echo "Creating Healthcare AI Package ($3999/month)..."
HEALTHCARE_PRODUCT=$(stripe products create \
  --name="Healthcare AI Package" \
  --description="HIPAA-compliant AI for healthcare organizations" \
  --metadata[industry]="healthcare" \
  --metadata[compliance]="hipaa" \
  --metadata[features]="medical_ocr,patient_records,diagnostic_imaging,phi_protection")

HEALTHCARE_PRODUCT_ID=$(echo "$HEALTHCARE_PRODUCT" | grep '"id":' | head -1 | cut -d'"' -f4)

HEALTHCARE_PRICE=$(stripe prices create \
  --product=$HEALTHCARE_PRODUCT_ID \
  --unit-amount=399900 \
  --currency=usd \
  --recurring.interval=month \
  --nickname="Healthcare AI Monthly")

HEALTHCARE_PRICE_ID=$(echo "$HEALTHCARE_PRICE" | grep '"id":' | head -1 | cut -d'"' -f4)
echo "✅ Healthcare AI Package: $HEALTHCARE_PRICE_ID"

# Financial AI Package - $4999/month
echo "Creating Financial AI Package ($4999/month)..."
FINANCIAL_PRODUCT=$(stripe products create \
  --name="Financial AI Package" \
  --description="Advanced fraud detection for financial institutions" \
  --metadata[industry]="financial" \
  --metadata[compliance]="sox_pci" \
  --metadata[features]="fraud_detection,aml_compliance,transaction_analysis,risk_assessment")

FINANCIAL_PRODUCT_ID=$(echo "$FINANCIAL_PRODUCT" | grep '"id":' | head -1 | cut -d'"' -f4)

FINANCIAL_PRICE=$(stripe prices create \
  --product=$FINANCIAL_PRODUCT_ID \
  --unit-amount=499900 \
  --currency=usd \
  --recurring.interval=month \
  --nickname="Financial AI Monthly")

FINANCIAL_PRICE_ID=$(echo "$FINANCIAL_PRICE" | grep '"id":' | head -1 | cut -d'"' -f4)
echo "✅ Financial AI Package: $FINANCIAL_PRICE_ID"

# Insurance AI Package - $3499/month
echo "Creating Insurance AI Package ($3499/month)..."
INSURANCE_PRODUCT=$(stripe products create \
  --name="Insurance AI Package" \
  --description="Claims processing and fraud detection for insurance companies" \
  --metadata[industry]="insurance" \
  --metadata[compliance]="claims_processing" \
  --metadata[features]="claims_analysis,damage_assessment,fraud_detection,policy_review")

INSURANCE_PRODUCT_ID=$(echo "$INSURANCE_PRODUCT" | grep '"id":' | head -1 | cut -d'"' -f4)

INSURANCE_PRICE=$(stripe prices create \
  --product=$INSURANCE_PRODUCT_ID \
  --unit-amount=349900 \
  --currency=usd \
  --recurring.interval=month \
  --nickname="Insurance AI Monthly")

INSURANCE_PRICE_ID=$(echo "$INSURANCE_PRICE" | grep '"id":' | head -1 | cut -d'"' -f4)
echo "✅ Insurance AI Package: $INSURANCE_PRICE_ID"

echo ""
echo "🎯 INDUSTRY PACKAGE PRICE IDs:"
echo "================================"
echo "LEGAL_AI_PACKAGE=$LEGAL_PRICE_ID"
echo "HEALTHCARE_AI_PACKAGE=$HEALTHCARE_PRICE_ID"
echo "FINANCIAL_AI_PACKAGE=$FINANCIAL_PRICE_ID"
echo "INSURANCE_AI_PACKAGE=$INSURANCE_PRICE_ID"
echo ""
echo "💰 HIGH-VALUE REVENUE POTENTIAL:"
echo "- Legal AI: $2,999/month per client"
echo "- Healthcare AI: $3,999/month per client"
echo "- Financial AI: $4,999/month per client"
echo "- Insurance AI: $3,499/month per client"
echo ""
echo "🚀 Industry packages created successfully!"
echo "💰 Ready for enterprise sales!" 