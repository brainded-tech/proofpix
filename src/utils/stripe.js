import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const isProduction = window.location.protocol === 'https:' && !window.location.hostname.includes('localhost');
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_live_51RSVJG2Llp3EL08qhQZvGpxwbskBuWayc5aFARPVEC6CImCuuXiIj0vK8TJs0T10aVWGP1XpuJOXmEnwx5Z8s6g00kdDH5IAY');

export { stripePromise };

// 🎯 CMO'S UNIFIED "PRIVACY-FIRST HYBRID" PRICING STRATEGY
// Every tier includes BOTH Privacy and Collaboration modes

// Session Passes (Entry Drug Strategy)
export const SESSION_PASSES = {
  day: {
    id: 'session_day',
    name: 'Day Pass',
    price: 2.99,
    interval: 'one-time',
    stripeProductId: 'prod_session_day',
    stripePriceId: 'price_1RVPKg2Llp3EL08qW0EgbMcd',
    duration: '24 hours',
    features: [
      'Unlimited processing for 24 hours',
      'Privacy mode only',
      'Basic reports',
      'Email support'
    ]
  },
  week: {
    id: 'session_week',
    name: 'Week Pass',
    price: 9.99,
    interval: 'one-time',
    stripeProductId: 'prod_session_week',
    stripePriceId: 'price_1RVPKg2Llp3EL08qfurRg5xQ',
    duration: '7 days',
    features: [
      'Unlimited processing for 7 days',
      'Privacy + basic collaboration',
      'Advanced reports',
      'Priority support'
    ]
  },
  month: {
    id: 'session_month',
    name: 'Month Pass',
    price: 49.99,
    interval: 'one-time',
    stripeProductId: 'prod_session_month',
    stripePriceId: 'price_1RVPKg2Llp3EL08qtdn8EU3c',
    duration: '30 days',
    features: [
      'Unlimited processing for 30 days',
      'Full privacy + collaboration modes',
      'All report types',
      'Phone support'
    ]
  }
};

// Main Subscription Tiers
export const UNIFIED_PRICING_PLANS = {
  // FREE TIER (Lead Generation)
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    popular: false,
    stripeProductId: 'prod_free',
    stripePriceId: 'price_free',
    features: [
      '5 images per session',
      'Privacy Mode ONLY',
      'Basic metadata extraction',
      'Community support'
    ],
    limits: {
      imagesPerSession: 5,
      teamMembers: 1,
      aiCredits: 0,
      apiCalls: 0,
      industryAI: 0
    }
  },

  // PROFESSIONAL ($99/month)
  professional: {
    id: 'professional',
    name: 'Professional',
    price: 99,
    priceYearly: 950, // 20% discount
    interval: 'month',
    popular: false,
    stripeProductId: 'prod_professional_unified',
    stripePriceId: 'price_1RVPKh2Llp3EL08qktUZaLpY', // Real Stripe Price ID - Monthly
    stripePriceIdYearly: 'price_1RVPKh2Llp3EL08qE56DpeHI', // Real Stripe Price ID - Yearly
    features: [
      '🔒 Privacy Mode: Unlimited local processing',
      '👥 Collaboration Mode: 5 team members',
      '🤖 AI Credits: 100/month included',
      '📊 Core AI features (OCR, classification)',
      '📄 Professional PDF reports',
      '📧 Email support',
      '🔌 API access (1K calls/month)'
    ],
    limits: {
      teamMembers: 5,
      aiCredits: 100,
      apiCalls: 1000,
      industryAI: 0,
      batchProcessing: true,
      whiteLabel: false
    }
  },

  // BUSINESS ($299/month) - Most Popular
  business: {
    id: 'business',
    name: 'Business',
    price: 299,
    priceYearly: 2870, // 20% discount
    interval: 'month',
    popular: true,
    stripeProductId: 'prod_business_unified',
    stripePriceId: 'price_1RVPKi2Llp3EL08qLZvhteLT', // Real Stripe Price ID - Monthly
    stripePriceIdYearly: 'price_1RVPKi2Llp3EL08qrFAfXlkR', // Real Stripe Price ID - Yearly
    features: [
      '🔒 Privacy Mode: Advanced local AI',
      '👥 Collaboration Mode: 25 team members',
      '🤖 AI Credits: 500/month included',
      '🏭 Industry AI models (choose 1)',
      '📊 Advanced analytics dashboard',
      '📞 Priority support',
      '🔌 API access (10K calls/month)',
      '🔗 Custom integrations'
    ],
    limits: {
      teamMembers: 25,
      aiCredits: 500,
      apiCalls: 10000,
      industryAI: 1,
      batchProcessing: true,
      whiteLabel: false,
      advancedAnalytics: true
    }
  },

  // ENTERPRISE ($999/month)
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 999,
    priceYearly: 9590, // 20% discount
    interval: 'month',
    popular: false,
    stripeProductId: 'prod_enterprise_unified',
    stripePriceId: 'price_1RVPKi2Llp3EL08qKAtT6D6K', // Real Stripe Price ID - Monthly
    stripePriceIdYearly: 'price_1RVPKi2Llp3EL08qBFS7tWp5', // Real Stripe Price ID - Yearly
    features: [
      '🔒 Privacy Mode: Full white-label',
      '👥 Collaboration Mode: Unlimited users',
      '🤖 AI Credits: 2000/month included',
      '🏭 All industry AI models included',
      '🔌 Unlimited API access',
      '👨‍💼 Dedicated account manager',
      '🛡️ Advanced security features',
      '📋 SLA guarantees'
    ],
    limits: {
      teamMembers: 'unlimited',
      aiCredits: 2000,
      apiCalls: 'unlimited',
      industryAI: 'all',
      batchProcessing: true,
      whiteLabel: true,
      advancedAnalytics: true,
      sso: true,
      dedicatedSupport: true
    }
  },

  // CUSTOM ENTERPRISE ($2,999+/month)
  custom: {
    id: 'custom',
    name: 'Custom Enterprise',
    price: 2999,
    interval: 'month',
    popular: false,
    stripeProductId: 'prod_custom_enterprise',
    stripePriceId: 'price_1RVPKj2Llp3EL08qxPAlbc7s', // Real Stripe Price ID
    features: [
      'Everything in Enterprise',
      'On-premise deployment',
      'Custom AI training',
      'Dedicated infrastructure',
      'Custom compliance frameworks',
      'White-glove onboarding'
    ],
    limits: {
      teamMembers: 'unlimited',
      aiCredits: 'unlimited',
      apiCalls: 'unlimited',
      industryAI: 'all',
      customTraining: true,
      onPremise: true,
      dedicatedInfrastructure: true
    }
  }
};

// Industry-Specific AI Packages (Pure Profit)
export const INDUSTRY_AI_PACKAGES = {
  legal: {
    id: 'legal_ai_package',
    name: 'Legal AI Package',
    price: 999,
    interval: 'month',
    stripeProductId: 'prod_legal_ai',
    stripePriceId: 'price_1RVPKj2Llp3EL08qrXYPc17U', // Real Stripe Price ID
    features: [
      'Contract analysis & clause extraction',
      'Legal document classification',
      'Redaction & privacy protection',
      'Citation & reference validation',
      'Chain of custody documentation'
    ]
  },
  healthcare: {
    id: 'healthcare_ai_package',
    name: 'Healthcare AI Package',
    price: 1499,
    interval: 'month',
    stripeProductId: 'prod_healthcare_ai',
    stripePriceId: 'price_1RVPKj2Llp3EL08qu18bFFgn', // Real Stripe Price ID
    features: [
      'Medical records classification',
      'HIPAA compliance automation',
      'PHI detection & protection',
      'EHR integration & routing',
      'Medical audit trail generation'
    ]
  },
  financial: {
    id: 'financial_ai_package',
    name: 'Financial AI Package',
    price: 1999,
    interval: 'month',
    stripeProductId: 'prod_financial_ai',
    stripePriceId: 'price_1RVPKk2Llp3EL08q0QHnU1Bx', // Real Stripe Price ID
    features: [
      'Financial document analysis',
      'SOX compliance automation',
      'Fraud detection & prevention',
      'Audit trail & reporting',
      'Regulatory compliance monitoring'
    ]
  },
  insurance: {
    id: 'insurance_ai_package',
    name: 'Insurance AI Package',
    price: 999,
    interval: 'month',
    stripeProductId: 'prod_insurance_ai',
    stripePriceId: 'price_1RVPKk2Llp3EL08qQqC6bfDn', // Real Stripe Price ID
    features: [
      'Claims document analysis',
      'Fraud detection algorithms',
      'Risk assessment automation',
      'Claims workflow integration',
      'Automated reporting'
    ]
  }
};

// General AI Add-ons (Additional features)
export const AI_ADDONS = {
  extra_credits: {
    id: 'ai_credits_1000',
    name: 'Extra AI Credits (1,000)',
    price: 99,
    interval: 'month',
    stripeProductId: 'prod_ai_credits_1000',
    stripePriceId: 'price_ai_credits_1000',
    features: [
      '1,000 additional AI credits per month',
      'Rollover unused credits',
      'Priority processing',
      'Advanced analytics'
    ]
  },
  api_boost: {
    id: 'api_boost_10k',
    name: 'API Boost (10K calls)',
    price: 199,
    interval: 'month',
    stripeProductId: 'prod_api_boost_10k',
    stripePriceId: 'price_api_boost_10k',
    features: [
      '10,000 additional API calls per month',
      'Higher rate limits',
      'Webhook support',
      'Advanced monitoring'
    ]
  },
  white_label: {
    id: 'white_label_addon',
    name: 'White Label Add-on',
    price: 499,
    interval: 'month',
    stripeProductId: 'prod_white_label',
    stripePriceId: 'price_white_label',
    features: [
      'Custom branding',
      'Remove ProofPix branding',
      'Custom domain support',
      'Branded reports'
    ]
  }
};

// AI Training Packages (One-time)
export const AI_TRAINING_PACKAGES = {
  basic: {
    id: 'ai_training_basic',
    name: 'Basic AI Training',
    price: 999,
    interval: 'one-time',
    stripeProductId: 'prod_ai_training_basic',
    stripePriceId: 'price_1RVPKk2Llp3EL08qAw2Yc4mt', // Real Stripe Price ID
    features: [
      '1,000 training samples',
      'Basic model customization',
      'Standard accuracy optimization',
      'Email support during training'
    ]
  },
  advanced: {
    id: 'ai_training_advanced',
    name: 'Advanced AI Training',
    price: 2999,
    interval: 'one-time',
    stripeProductId: 'prod_ai_training_advanced',
    stripePriceId: 'price_1RVPKl2Llp3EL08qYDzLkxvW', // Real Stripe Price ID
    features: [
      '10,000 training samples',
      'Advanced model customization',
      'High accuracy optimization',
      'Priority support during training',
      'Custom validation metrics'
    ]
  },
  enterprise: {
    id: 'ai_training_enterprise',
    name: 'Enterprise AI Training',
    price: 9999,
    interval: 'one-time',
    stripeProductId: 'prod_ai_training_enterprise',
    stripePriceId: 'price_1RVPKl2Llp3EL08qeA3Pz5U3', // Real Stripe Price ID
    features: [
      'Unlimited training samples',
      'Full model customization',
      'Maximum accuracy optimization',
      'Dedicated AI engineer support',
      'Custom metrics & validation',
      'Ongoing model updates'
    ]
  }
};

// Legacy plans for backward compatibility
export const PRICING_PLANS = UNIFIED_PRICING_PLANS;

// Helper functions
export const getPlanById = (planId) => {
  return UNIFIED_PRICING_PLANS[planId] || SESSION_PASSES[planId] || INDUSTRY_AI_PACKAGES[planId] || AI_ADDONS[planId] || AI_TRAINING_PACKAGES[planId];
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

export const createCheckoutSession = async (priceId, successUrl, cancelUrl, metadata = {}) => {
  try {
    const stripe = await stripePromise;
    
    // Use Railway backend API instead of Netlify functions
    const apiUrl = process.env.REACT_APP_API_URL || 'https://api.proofpixapp.com';
    
    const response = await fetch(`${apiUrl}/api/stripe/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        successUrl: successUrl || `${window.location.origin}/success`,
        cancelUrl: cancelUrl || `${window.location.origin}/pricing-v2`,
        metadata
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const session = await response.json();
    
    if (session.error) {
      throw new Error(session.error);
    }

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export const redirectToCheckout = async (priceId, metadata = {}) => {
  try {
    await createCheckoutSession(
      priceId,
      `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      `${window.location.origin}/pricing-v2`,
      metadata
    );
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    alert('There was an error processing your request. Please try again.');
  }
};

// Revenue projections
export const REVENUE_PROJECTIONS = {
  conservative: {
    totalCustomers: 1000,
    distribution: {
      professional: { percentage: 40, customers: 400, mrr: 39600 },
      business: { percentage: 40, customers: 400, mrr: 119600 },
      enterprise: { percentage: 15, customers: 150, mrr: 149850 },
      custom: { percentage: 5, customers: 50, mrr: 149950 }
    },
    baseMRR: 459000,
    addons: {
      industryAI: { attachRate: 0.3, customers: 300, avgPrice: 1299, mrr: 389700 },
      aiCredits: { attachRate: 0.2, customers: 200, avgPrice: 199, mrr: 39800 }
    },
    totalMRR: 888500,
    arr: 10662000
  }
};

export default {
  stripePromise,
  UNIFIED_PRICING_PLANS,
  SESSION_PASSES,
  INDUSTRY_AI_PACKAGES,
  AI_ADDONS,
  AI_TRAINING_PACKAGES,
  REVENUE_PROJECTIONS,
  getPlanById,
  formatPrice,
  createCheckoutSession,
  redirectToCheckout
}; 