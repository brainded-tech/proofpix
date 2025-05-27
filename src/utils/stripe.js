import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

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
    price: 'Custom',
    interval: 'month',
    popular: false,
    stripeProductId: 'prod_enterprise_placeholder',
    stripePriceId: 'price_enterprise_placeholder',
    accountRequired: true,
    sessionBased: false,
    features: [
      'Unlimited images per session',
      'Unlimited PDF exports',
      'Unlimited data exports (all formats + custom)',
      'Unlimited comparison tool',
      'Advanced analytics + API',
      'Unlimited batch processing',
      'Custom export templates',
      'Advanced metadata editing',
      'Full REST API access',
      'Dedicated support + SLA'
    ],
    limits: {
      imagesPerSession: Infinity,
      pdfExports: Infinity,
      dataExports: Infinity,
      comparisons: Infinity,
      batchProcessing: true,
      batchSize: Infinity,
      enhancedExports: true,
      customTemplates: true,
      metadataEditing: true,
      apiAccess: true,
      priority: true,
      duration: undefined
    }
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
  if (window.location.hostname === "localhost") { alert("Local Development: Stripe checkout simulation. Deploy to test real payments."); return; }
  // 🧪 LOCAL DEVELOPMENT: Skip API calls for localhost
  if (window.location.hostname === "localhost") {
    console.log("🧪 Local Development: Simulating checkout for", plan?.name || "Unknown Plan");
    alert(`Local Development Checkout

Plan: ${plan?.name || "Unknown"}
Price: ${plan?.price || "Unknown"}

This is a local development simulation.
In production, this would redirect to Stripe Checkout.

To test real payments, deploy to Netlify.`);
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