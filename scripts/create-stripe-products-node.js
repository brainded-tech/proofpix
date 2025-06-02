#!/usr/bin/env node

// 🎯 CMO's Unified "Privacy-First Hybrid" Pricing Strategy
// Node.js Stripe Product Creation Script (No CLI Required)

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

console.log('🚀 Creating Stripe products for Unified Pricing Strategy...');

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ Please set STRIPE_SECRET_KEY environment variable');
  console.error('   Get your secret key from: https://dashboard.stripe.com/apikeys');
  process.exit(1);
}

async function createProducts() {
  try {
    console.log('✅ Stripe SDK initialized');

    // =============================================================================
    // SESSION PASSES (Entry Drug Strategy)
    // =============================================================================

    console.log('\n📦 Creating Session Pass products...');

    // Day Pass - $2.99
    console.log('Creating Day Pass...');
    const dayPassProduct = await stripe.products.create({
      name: 'ProofPix Day Pass',
      description: '24-hour unlimited access to ProofPix with Privacy Mode',
      metadata: {
        category: 'session_pass',
        duration: '24_hours',
        price_id: 'price_session_day'
      }
    });

    const dayPassPrice = await stripe.prices.create({
      product: dayPassProduct.id,
      unit_amount: 299, // $2.99
      currency: 'usd',
      metadata: {
        price_id: 'price_session_day',
        pass_type: 'day'
      }
    });

    // Week Pass - $9.99
    console.log('Creating Week Pass...');
    const weekPassProduct = await stripe.products.create({
      name: 'ProofPix Week Pass',
      description: '7-day unlimited access with Privacy + basic Collaboration',
      metadata: {
        category: 'session_pass',
        duration: '7_days',
        price_id: 'price_session_week'
      }
    });

    const weekPassPrice = await stripe.prices.create({
      product: weekPassProduct.id,
      unit_amount: 999, // $9.99
      currency: 'usd',
      metadata: {
        price_id: 'price_session_week',
        pass_type: 'week'
      }
    });

    // Month Pass - $49.99
    console.log('Creating Month Pass...');
    const monthPassProduct = await stripe.products.create({
      name: 'ProofPix Month Pass',
      description: '30-day unlimited access with full Privacy + Collaboration modes',
      metadata: {
        category: 'session_pass',
        duration: '30_days',
        price_id: 'price_session_month'
      }
    });

    const monthPassPrice = await stripe.prices.create({
      product: monthPassProduct.id,
      unit_amount: 4999, // $49.99
      currency: 'usd',
      metadata: {
        price_id: 'price_session_month',
        pass_type: 'month'
      }
    });

    // =============================================================================
    // MAIN SUBSCRIPTION TIERS
    // =============================================================================

    console.log('\n💼 Creating Main Subscription products...');

    // Professional - $99/month, $950/year
    console.log('Creating Professional Plan...');
    const professionalProduct = await stripe.products.create({
      name: 'ProofPix Professional',
      description: 'Perfect for professionals and small teams - includes both Privacy and Collaboration modes',
      metadata: {
        category: 'subscription',
        tier: 'professional',
        team_members: '5',
        ai_credits: '100'
      }
    });

    const professionalMonthlyPrice = await stripe.prices.create({
      product: professionalProduct.id,
      unit_amount: 9900, // $99.00
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: {
        price_id: 'price_professional_unified_monthly',
        billing: 'monthly'
      }
    });

    const professionalYearlyPrice = await stripe.prices.create({
      product: professionalProduct.id,
      unit_amount: 95000, // $950.00 (20% discount)
      currency: 'usd',
      recurring: { interval: 'year' },
      metadata: {
        price_id: 'price_professional_unified_yearly',
        billing: 'yearly',
        discount: '20_percent'
      }
    });

    // Business - $299/month, $2870/year (Most Popular)
    console.log('Creating Business Plan...');
    const businessProduct = await stripe.products.create({
      name: 'ProofPix Business',
      description: 'Most popular for growing businesses - advanced features with 25 team members',
      metadata: {
        category: 'subscription',
        tier: 'business',
        team_members: '25',
        ai_credits: '500',
        popular: 'true'
      }
    });

    const businessMonthlyPrice = await stripe.prices.create({
      product: businessProduct.id,
      unit_amount: 29900, // $299.00
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: {
        price_id: 'price_business_unified_monthly',
        billing: 'monthly'
      }
    });

    const businessYearlyPrice = await stripe.prices.create({
      product: businessProduct.id,
      unit_amount: 287000, // $2,870.00 (20% discount)
      currency: 'usd',
      recurring: { interval: 'year' },
      metadata: {
        price_id: 'price_business_unified_yearly',
        billing: 'yearly',
        discount: '20_percent'
      }
    });

    // Enterprise - $999/month, $9590/year
    console.log('Creating Enterprise Plan...');
    const enterpriseProduct = await stripe.products.create({
      name: 'ProofPix Enterprise',
      description: 'Complete platform control with unlimited users and all industry AI models',
      metadata: {
        category: 'subscription',
        tier: 'enterprise',
        team_members: 'unlimited',
        ai_credits: '2000'
      }
    });

    const enterpriseMonthlyPrice = await stripe.prices.create({
      product: enterpriseProduct.id,
      unit_amount: 99900, // $999.00
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: {
        price_id: 'price_enterprise_unified_monthly',
        billing: 'monthly'
      }
    });

    const enterpriseYearlyPrice = await stripe.prices.create({
      product: enterpriseProduct.id,
      unit_amount: 959000, // $9,590.00 (20% discount)
      currency: 'usd',
      recurring: { interval: 'year' },
      metadata: {
        price_id: 'price_enterprise_unified_yearly',
        billing: 'yearly',
        discount: '20_percent'
      }
    });

    // Custom Enterprise - $2999/month
    console.log('Creating Custom Enterprise Plan...');
    const customProduct = await stripe.products.create({
      name: 'ProofPix Custom Enterprise',
      description: 'Tailored solutions for large organizations with on-premise deployment',
      metadata: {
        category: 'subscription',
        tier: 'custom',
        team_members: 'unlimited',
        ai_credits: 'unlimited'
      }
    });

    const customPrice = await stripe.prices.create({
      product: customProduct.id,
      unit_amount: 299900, // $2,999.00
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: {
        price_id: 'price_custom_enterprise',
        billing: 'monthly'
      }
    });

    // =============================================================================
    // AI ADD-ONS (Pure Profit)
    // =============================================================================

    console.log('\n🤖 Creating AI Add-on products...');

    // Legal AI Package - $999/month
    console.log('Creating Legal AI Package...');
    const legalAIProduct = await stripe.products.create({
      name: 'Legal AI Package',
      description: 'Contract analysis, legal document classification, and compliance tools',
      metadata: {
        category: 'ai_addon',
        industry: 'legal'
      }
    });

    const legalAIPrice = await stripe.prices.create({
      product: legalAIProduct.id,
      unit_amount: 99900, // $999.00
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: {
        price_id: 'price_legal_ai_package_monthly',
        addon_type: 'industry_ai'
      }
    });

    // Healthcare AI Package - $1499/month
    console.log('Creating Healthcare AI Package...');
    const healthcareAIProduct = await stripe.products.create({
      name: 'Healthcare AI Package',
      description: 'HIPAA-compliant medical document processing and PHI protection',
      metadata: {
        category: 'ai_addon',
        industry: 'healthcare'
      }
    });

    const healthcareAIPrice = await stripe.prices.create({
      product: healthcareAIProduct.id,
      unit_amount: 149900, // $1,499.00
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: {
        price_id: 'price_healthcare_ai_package_monthly',
        addon_type: 'industry_ai'
      }
    });

    // Financial AI Package - $1999/month
    console.log('Creating Financial AI Package...');
    const financialAIProduct = await stripe.products.create({
      name: 'Financial AI Package',
      description: 'SOX compliance automation and financial document analysis',
      metadata: {
        category: 'ai_addon',
        industry: 'financial'
      }
    });

    const financialAIPrice = await stripe.prices.create({
      product: financialAIProduct.id,
      unit_amount: 199900, // $1,999.00
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: {
        price_id: 'price_financial_ai_package_monthly',
        addon_type: 'industry_ai'
      }
    });

    // Insurance AI Package - $999/month
    console.log('Creating Insurance AI Package...');
    const insuranceAIProduct = await stripe.products.create({
      name: 'Insurance AI Package',
      description: 'Claims processing automation and fraud detection',
      metadata: {
        category: 'ai_addon',
        industry: 'insurance'
      }
    });

    const insuranceAIPrice = await stripe.prices.create({
      product: insuranceAIProduct.id,
      unit_amount: 99900, // $999.00
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: {
        price_id: 'price_insurance_ai_package_monthly',
        addon_type: 'industry_ai'
      }
    });

    // =============================================================================
    // AI TRAINING PACKAGES (One-time)
    // =============================================================================

    console.log('\n🎓 Creating AI Training products...');

    // Basic AI Training - $999 one-time
    console.log('Creating Basic AI Training...');
    const basicTrainingProduct = await stripe.products.create({
      name: 'Basic AI Training',
      description: 'Custom AI model training with 1,000 samples',
      metadata: {
        category: 'ai_training',
        tier: 'basic',
        samples: '1000'
      }
    });

    const basicTrainingPrice = await stripe.prices.create({
      product: basicTrainingProduct.id,
      unit_amount: 99900, // $999.00
      currency: 'usd',
      metadata: {
        price_id: 'price_ai_training_basic',
        training_type: 'basic'
      }
    });

    // Advanced AI Training - $2999 one-time
    console.log('Creating Advanced AI Training...');
    const advancedTrainingProduct = await stripe.products.create({
      name: 'Advanced AI Training',
      description: 'Advanced AI model training with 10,000 samples',
      metadata: {
        category: 'ai_training',
        tier: 'advanced',
        samples: '10000'
      }
    });

    const advancedTrainingPrice = await stripe.prices.create({
      product: advancedTrainingProduct.id,
      unit_amount: 299900, // $2,999.00
      currency: 'usd',
      metadata: {
        price_id: 'price_ai_training_advanced',
        training_type: 'advanced'
      }
    });

    // Enterprise AI Training - $9999 one-time
    console.log('Creating Enterprise AI Training...');
    const enterpriseTrainingProduct = await stripe.products.create({
      name: 'Enterprise AI Training',
      description: 'Unlimited AI model training with dedicated support',
      metadata: {
        category: 'ai_training',
        tier: 'enterprise',
        samples: 'unlimited'
      }
    });

    const enterpriseTrainingPrice = await stripe.prices.create({
      product: enterpriseTrainingProduct.id,
      unit_amount: 999900, // $9,999.00
      currency: 'usd',
      metadata: {
        price_id: 'price_ai_training_enterprise',
        training_type: 'enterprise'
      }
    });

    // =============================================================================
    // SUMMARY & ENV FILE GENERATION
    // =============================================================================

    console.log('\n🎉 SUCCESS! All Stripe products created for Unified Pricing Strategy');
    console.log('\n📊 SUMMARY:');
    console.log('   Session Passes: 3 products (Day, Week, Month)');
    console.log('   Subscription Tiers: 4 products (Professional, Business, Enterprise, Custom)');
    console.log('   AI Add-ons: 4 products (Legal, Healthcare, Financial, Insurance)');
    console.log('   AI Training: 3 products (Basic, Advanced, Enterprise)');
    console.log('\n💰 REVENUE POTENTIAL:');
    console.log('   Conservative ARR: $10.66M with 1,000 customers');
    console.log('   AI Add-on Revenue: $389K/month (30% attach rate)');
    console.log('   Total MRR: $888K/month');

    // Generate .env.local file
    const envContent = `# Stripe Configuration - Generated by create-stripe-products-node.js
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here

# Session Passes
REACT_APP_STRIPE_PRICE_SESSION_DAY=${dayPassPrice.id}
REACT_APP_STRIPE_PRICE_SESSION_WEEK=${weekPassPrice.id}
REACT_APP_STRIPE_PRICE_SESSION_MONTH=${monthPassPrice.id}

# Professional Plan
REACT_APP_STRIPE_PRICE_PROFESSIONAL_MONTHLY=${professionalMonthlyPrice.id}
REACT_APP_STRIPE_PRICE_PROFESSIONAL_YEARLY=${professionalYearlyPrice.id}

# Business Plan
REACT_APP_STRIPE_PRICE_BUSINESS_MONTHLY=${businessMonthlyPrice.id}
REACT_APP_STRIPE_PRICE_BUSINESS_YEARLY=${businessYearlyPrice.id}

# Enterprise Plan
REACT_APP_STRIPE_PRICE_ENTERPRISE_MONTHLY=${enterpriseMonthlyPrice.id}
REACT_APP_STRIPE_PRICE_ENTERPRISE_YEARLY=${enterpriseYearlyPrice.id}

# Custom Enterprise
REACT_APP_STRIPE_PRICE_CUSTOM_ENTERPRISE=${customPrice.id}

# AI Add-ons
REACT_APP_STRIPE_PRICE_LEGAL_AI=${legalAIPrice.id}
REACT_APP_STRIPE_PRICE_HEALTHCARE_AI=${healthcareAIPrice.id}
REACT_APP_STRIPE_PRICE_FINANCIAL_AI=${financialAIPrice.id}
REACT_APP_STRIPE_PRICE_INSURANCE_AI=${insuranceAIPrice.id}

# AI Training
REACT_APP_STRIPE_PRICE_AI_TRAINING_BASIC=${basicTrainingPrice.id}
REACT_APP_STRIPE_PRICE_AI_TRAINING_ADVANCED=${advancedTrainingPrice.id}
REACT_APP_STRIPE_PRICE_AI_TRAINING_ENTERPRISE=${enterpriseTrainingPrice.id}
`;

    require('fs').writeFileSync('.env.local', envContent);
    console.log('\n✅ Generated .env.local file with all Price IDs');

    console.log('\n🔗 Next Steps:');
    console.log('   1. Update REACT_APP_STRIPE_PUBLISHABLE_KEY in .env.local');
    console.log('   2. Test the checkout flow on /pricing-v2');
    console.log('   3. Set up webhooks for subscription management');
    console.log('   4. Configure automated enterprise onboarding');
    console.log('\n🚀 Ready to launch the billion-dollar pricing strategy!');

  } catch (error) {
    console.error('❌ Error creating Stripe products:', error.message);
    process.exit(1);
  }
}

createProducts(); 