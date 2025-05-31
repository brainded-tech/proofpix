import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
// Replace with your actual Stripe publishable key
const isProduction = window.location.protocol === 'https:' && !window.location.hostname.includes('localhost');
const stripePromise = isProduction ? loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_...') : null;

export { stripePromise };

// Pricing configuration
export const PRICING_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    popular: false,
    stripePriceId: null,
    accountRequired: false,
    sessionBased: false,
    features: [
      '5 images per session',
      '2 PDF exports per day',
      '1 data export per day (JSON/CSV)',
      '3 comparisons per day',
      'Basic analytics only',
      'No batch processing',
      'Privacy-focused processing'
    ],
    limits: {
      imagesPerSession: 5,
      pdfExports: 2,
      dataExports: 1,
      comparisons: 3,
      batchProcessing: false,
      enhancedExports: false,
      priority: false,
      aiFeatures: false,
      aiCredits: 0,
      duration: undefined
    }
  },
  daypass: {
    id: 'daypass',
    name: 'Day Pass',
    price: 2.99,
    interval: 'day',
    popular: false,
    stripeProductId: 'prod_daypass_placeholder',
    stripePriceId: 'price_1RTBqq2Llp3EL08qmd6MyZgk',
    accountRequired: false,
    sessionBased: true,
    features: [
      'Unlimited photos for 24 hours',
      'Batch processing (up to 10)',
      'All EXIF data extraction',
      'No account required',
      'Session-based access'
    ],
    limits: {
      dailyPhotos: Infinity,
      batchSize: 10,
      priority: false,
      duration: '24h'
    }
  },
  weekpass: {
    id: 'weekpass',
    name: 'Week Pass',
    price: 9.99,
    interval: 'week',
    popular: false,
    stripeProductId: 'prod_weekpass_placeholder',
    stripePriceId: 'price_1RTBr22Llp3EL08qwbENUeiD',
    accountRequired: false,
    sessionBased: true,
    features: [
      'Unlimited photos for 7 days',
      'Batch processing (up to 25)',
      'All EXIF data extraction',
      'Priority processing',
      'No account required'
    ],
    limits: {
      dailyPhotos: Infinity,
      batchSize: 25,
      priority: true,
      duration: '7d'
    }
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 4.99,
    interval: 'month',
    popular: false,
    stripeProductId: 'prod_starter_placeholder',
    stripePriceId: 'price_1RTBrH2Llp3EL08qgYVJbJNW',
    accountRequired: true,
    sessionBased: false,
    features: [
      '25 images per session',
      '5 PDF exports per day',
      '3 data exports per day (JSON/CSV)',
      '10 comparisons per day',
      'Enhanced analytics',
      'Basic batch processing (up to 25 images)',
      'Standard export templates',
      'Email support'
    ],
    limits: {
      imagesPerSession: 25,
      pdfExports: 5,
      dataExports: 3,
      comparisons: 10,
      batchProcessing: true,
      batchSize: 25,
      enhancedExports: false,
      metadataEditing: false,
      priority: false,
      duration: undefined
    }
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    interval: 'month',
    stripeProductId: 'prod_pro_placeholder',
    stripePriceId: 'price_1RTBrU2Llp3EL08qRMAhtuX9',
    popular: true,
    accountRequired: true,
    sessionBased: false,
    features: [
      '50 images per session',
      'Unlimited PDF exports',
      'Unlimited data exports (all formats)',
      'Unlimited comparison tool',
      'Full analytics suite',
      'Batch processing (up to 100 images)',
      'Enhanced exports (all templates)',
      'Metadata editing (full access)',
      'Priority email support'
    ],
    limits: {
      imagesPerSession: 50,
      pdfExports: Infinity,
      dataExports: Infinity,
      comparisons: Infinity,
      batchProcessing: true,
      batchSize: 100,
      enhancedExports: true,
      metadataEditing: true,
      priority: true,
      duration: undefined
    }
  },
  teams: {
    id: 'teams',
    name: 'Teams',
    price: 49,
    interval: 'month',
    popular: true,
    stripeProductId: 'prod_teams_placeholder',
    stripePriceId: 'price_1RTBrb2Llp3EL08qVwIo8XLy',
    accountRequired: true,
    sessionBased: false,
    features: [
      'Unlimited images per session',
      'Unlimited PDF exports',
      'Unlimited data exports (JSON/CSV/XML)',
      'Unlimited comparison tool',
      'Advanced analytics dashboard',
      'Unlimited batch processing',
      'Priority processing speed',
      'Team collaboration features',
      'Shared workspace (up to 10 users)',
      'API access (1000 calls/month)',
      'Email support',
      'Custom branding options'
    ],
    limits: {
      imagesPerSession: -1,
      pdfExportsPerDay: -1,
      dataExportsPerDay: -1,
      comparisonsPerDay: -1,
      batchProcessing: true,
      advancedAnalytics: true,
      metadataEditing: true,
      priority: true,
      teamUsers: 10,
      apiCalls: 1000,
      duration: undefined
    }
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    interval: 'month',
    stripePriceId: 'price_enterprise_monthly_placeholder',
    features: [
      'Everything in Professional',
      'Unlimited users and processing',
      'Custom integrations and workflows',
      'Dedicated support and training',
      'On-premise deployment options',
      'Custom SLA and compliance'
    ]
  },
  // ===== AI-ENHANCED PRICING TIERS =====
  individual: {
    id: 'individual',
    name: 'Individual',
    price: 49, // CMO's new pricing: $19 → $49 (+157%)
    interval: 'month',
    popular: false,
    stripeProductId: 'prod_individual_ai',
    stripePriceId: 'price_individual_ai_monthly',
    accountRequired: true,
    sessionBased: false,
    features: [
      'Unlimited image processing',
      'Basic AI analysis (OCR, classification)',
      'AI-powered quality assessment',
      'Smart document categorization',
      'Enhanced PDF reports with AI insights',
      'Basic fraud detection',
      '100 AI credits/month',
      'Email support'
    ],
    limits: {
      imagesPerSession: Infinity,
      pdfExports: Infinity,
      dataExports: Infinity,
      comparisons: Infinity,
      batchProcessing: true,
      batchSize: 50,
      aiFeatures: true,
      aiCredits: 100,
      advancedAI: false,
      customModels: false,
      priority: false,
      duration: undefined
    }
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    price: 149, // CMO's new pricing: $49 → $149 (+204%)
    interval: 'month',
    stripeProductId: 'prod_professional_ai',
    stripePriceId: 'price_professional_ai_monthly',
    popular: true,
    accountRequired: true,
    sessionBased: false,
    features: [
      'Everything in Individual',
      'Advanced AI analysis (entity extraction, sentiment)',
      'Predictive processing time estimation',
      'AI-powered fraud detection (advanced)',
      'Smart workflow recommendations',
      'Custom AI model training (basic)',
      '500 AI credits/month',
      'Team collaboration (up to 5 users)',
      'API access with AI endpoints',
      'Priority support'
    ],
    limits: {
      imagesPerSession: Infinity,
      pdfExports: Infinity,
      dataExports: Infinity,
      comparisons: Infinity,
      batchProcessing: true,
      batchSize: 200,
      aiFeatures: true,
      aiCredits: 500,
      advancedAI: true,
      customModels: 'basic',
      teamUsers: 5,
      apiCalls: 5000,
      priority: true,
      duration: undefined
    }
  },
  business: {
    id: 'business',
    name: 'Business',
    price: 499, // CMO's new pricing: $149 → $499 (+235%)
    interval: 'month',
    popular: false,
    stripeProductId: 'prod_business_ai',
    stripePriceId: 'price_business_ai_monthly',
    accountRequired: true,
    sessionBased: false,
    features: [
      'Everything in Professional',
      'Industry-specific AI models (legal, healthcare, finance)',
      'Advanced custom model training',
      'AI-powered compliance monitoring',
      'Intelligent document routing',
      'Advanced predictive analytics',
      '2000 AI credits/month',
      'Team management (up to 25 users)',
      'Advanced API access',
      'SSO integration',
      'Business support'
    ],
    limits: {
      imagesPerSession: Infinity,
      pdfExports: Infinity,
      dataExports: Infinity,
      comparisons: Infinity,
      batchProcessing: true,
      batchSize: 1000,
      aiFeatures: true,
      aiCredits: 2000,
      advancedAI: true,
      customModels: 'advanced',
      industryModels: true,
      teamUsers: 25,
      apiCalls: 25000,
      priority: true,
      duration: undefined
    }
  },
  // ===== AI PREMIUM ADD-ON =====
  ai_premium: {
    id: 'ai_premium',
    name: 'AI Premium Add-On',
    price: 999, // CMO's AI Premium: $999/month
    interval: 'month',
    popular: false,
    stripeProductId: 'prod_ai_premium',
    stripePriceId: 'price_ai_premium_monthly',
    accountRequired: true,
    sessionBased: false,
    isAddon: true,
    features: [
      'Unlimited AI processing',
      'Advanced machine learning models',
      'Real-time AI insights',
      'Custom AI model training',
      'AI API access',
      'Priority AI processing',
      'Advanced AI analytics'
    ],
    limits: {
      aiCredits: Infinity,
      advancedAI: true,
      customModels: 'premium',
      realTimeAI: true,
      aiAPI: true,
      priority: true
    }
  }
};

// ===== INDUSTRY-SPECIFIC AI PACKAGES =====
export const INDUSTRY_AI_PACKAGES = {
  legal: {
    id: 'legal_ai',
    name: 'Legal AI Package',
    price: 2999,
    interval: 'month',
    features: [
      'Court document classification',
      'Legal entity extraction',
      'Case precedent matching',
      'Legal compliance monitoring',
      'Court-ready AI reports'
    ]
  },
  healthcare: {
    id: 'healthcare_ai',
    name: 'Healthcare AI Package',
    price: 3999,
    interval: 'month',
    features: [
      'HIPAA-compliant AI processing',
      'Medical terminology extraction',
      'Patient data protection AI',
      'Medical document classification',
      'Healthcare compliance monitoring'
    ]
  },
  financial: {
    id: 'financial_ai',
    name: 'Financial AI Package',
    price: 4999,
    interval: 'month',
    features: [
      'Fraud pattern detection',
      'Financial entity extraction',
      'Compliance automation',
      'Risk assessment AI',
      'Financial document analysis'
    ]
  }
};

// ===== CUSTOM AI MODEL TRAINING PACKAGES =====
export const AI_TRAINING_PACKAGES = {
  starter: {
    id: 'ai_training_starter',
    name: 'AI Training Starter',
    price: 10000,
    interval: 'one-time',
    features: [
      'Basic custom model training',
      'Up to 1000 training documents',
      'Standard accuracy optimization',
      'Basic deployment'
    ]
  },
  professional: {
    id: 'ai_training_professional',
    name: 'AI Training Professional',
    price: 25000,
    setupFee: 25000,
    monthlyFee: 1000,
    features: [
      'Advanced custom model training',
      'Up to 10000 training documents',
      'Advanced accuracy optimization',
      'Production deployment',
      'Monthly model updates'
    ]
  },
  enterprise: {
    id: 'ai_training_enterprise',
    name: 'AI Training Enterprise',
    price: 100000,
    setupFee: 100000,
    monthlyFee: 5000,
    features: [
      'Enterprise custom model development',
      'Unlimited training documents',
      'Maximum accuracy optimization',
      'Enterprise deployment',
      'Continuous model improvement',
      'Dedicated AI team'
    ]
  }
};

// Helper functions
export const getPlanById = (planId) => {
  return PRICING_PLANS[planId] || PRICING_PLANS.free;
};

export const formatPrice = (price) => {
  if (price === 0) return 'Free';
  if (typeof price === 'string') return price; // Handle 'Custom' and other string prices
  if (typeof price === 'number') return `$${price.toFixed(2)}`;
  return price; // Fallback for any other type
};

export const createCheckoutSession = async (priceId, successUrl, cancelUrl) => {
  try {
    // Determine if this is a subscription or one-time payment based on the plan
    const plan = Object.values(PRICING_PLANS).find(p => p.stripePriceId === priceId);
    const isSubscription = plan ? plan.accountRequired : false;
    
    const endpoint = isSubscription ? '/.netlify/functions/create-checkout' : '/.netlify/functions/create-checkout';
    
    // API URL configuration - more robust detection
    const isProduction = window.location.hostname !== 'localhost';
    const apiUrl = isProduction ? "/.netlify/functions" : "http://localhost:8888/.netlify/functions";
    
    const fullEndpoint = isProduction
      ? `${apiUrl}/create-checkout`
      : `${apiUrl}${endpoint}`;
    
    console.log('🔧 Environment:', { isProduction, hostname: window.location.hostname });
    console.log('🔧 API URL:', fullEndpoint);
    
    const response = await fetch(fullEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        successUrl,
        cancelUrl,
        isSubscription,
      }),
    });

    console.log('🔧 Response status:', response.status);
    console.log('🔧 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔧 Response error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const session = await response.json();
    console.log('🔧 Response data:', session);
    
    if (session.error) {
      // Handle development errors gracefully
      if (session.development_note) {
        console.warn('🔧 Development Note:', session.development_note);
        console.warn('🔧 Price ID:', session.priceId);
        throw new Error(`Development Mode: ${session.error}\n\nTo fix this:\n1. Create products in your Stripe dashboard, or\n2. Use the mock server for testing`);
      }
      throw new Error(session.error);
    }

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export const redirectToCheckout = async (priceId) => {
  try {
    // Get plan info to determine success URL parameters
    const plan = Object.values(PRICING_PLANS).find(p => p.stripePriceId === priceId);
    
    // Check for non-HTTPS environment
    if (!isProduction) {
      console.log("🧪 Development/Non-HTTPS Environment: Simulating checkout for", plan?.name || "Unknown Plan");
      alert(`Development Mode Checkout

Plan: ${plan?.name || "Unknown"}
Price: ${plan?.price || "Unknown"}

This is a development simulation.
Stripe requires HTTPS for live payments.

To test real payments, deploy to a secure HTTPS environment.`);
      return;
    }
    
    const planId = plan ? plan.id : 'pro';
    
    // 🚀 DEVELOPMENT MODE: Handle placeholder price IDs
    if (priceId && priceId.includes('placeholder')) {
      console.log('🧪 Development Mode: Simulating checkout for', plan?.name || 'Unknown Plan');
      alert(`Development Mode Checkout\n\nPlan: ${plan?.name || 'Unknown'}\nPrice: ${plan?.price || 'Unknown'}\n\nIn production, this would redirect to Stripe Checkout.\n\nTo set up real Stripe products, use the Stripe CLI.`);
      return;
    }
    
    const session = await createCheckoutSession(
      priceId,
      `${window.location.origin}/success?plan=${planId}`,
      `${window.location.origin}/pricing`
    );

    // Check if this is a mock response (development mode)
    if (session.mock) {
      console.log('🧪 Mock checkout detected:', session.message);
      alert(`Mock Checkout for ${plan?.name || 'Unknown Plan'}\n\nThis is a development mock. In production, you would be redirected to Stripe Checkout.\n\nSession ID: ${session.id}`);
      return;
    }

    // Real Stripe checkout
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to load. Please ensure you are using HTTPS.');
    }
    
    const result = await stripe.redirectToCheckout({
      sessionId: session.sessionId || session.id,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    throw error;
  }
}; 