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
      '5 photos per day',
      'Basic EXIF extraction',
      'Social sharing',
      'No photo storage',
      'Privacy-focused processing'
    ],
    limits: {
      dailyPhotos: 5,
      batchSize: 1,
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
    stripeProductId: 'prod_SNGnjs8yTz6sK9',
    stripePriceId: 'price_1RSYUNRwqAvTbIKupFqRBx9G',
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
    stripeProductId: 'prod_SNGoGcPZx4L3yl',
    stripePriceId: 'price_1RSYVRRwqAvTbIKuZVcBsBk6',
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
    stripeProductId: 'prod_SNGpEP63JB0Dg5',
    stripePriceId: 'price_1RSYWARwqAvTbIKuaX1vyPnD',
    accountRequired: true,
    sessionBased: false,
    features: [
      '50 photos per day',
      'Batch processing (up to 5)',
      'All EXIF data extraction',
      'Email support',
      'Usage history & analytics'
    ],
    limits: {
      dailyPhotos: 50,
      batchSize: 5,
      priority: false,
      duration: undefined
    }
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 14.99,
    interval: 'month',
    stripeProductId: 'prod_SNHfxSR543UcUs',
    stripePriceId: 'price_1RSYWNRwqAvTbIKu1NWwozWi',
    popular: true,
    accountRequired: true,
    sessionBased: false,
    features: [
      '500 photos per day',
      'Unlimited batch processing',
      'Advanced metadata editing',
      'Priority processing',
      'Export to multiple formats',
      'Priority email support',
      'Usage analytics dashboard'
    ],
    limits: {
      dailyPhotos: 500,
      batchSize: 100,
      priority: true,
      duration: undefined
    }
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 49.99,
    interval: 'month',
    popular: false,
    stripeProductId: 'prod_SNHgHMK0ClZshZ',
    stripePriceId: 'price_1RSYX8RwqAvTbIKuM11UVwIG',
    accountRequired: true,
    sessionBased: false,
    features: [
      'Unlimited photos',
      'API access',
      'White-label options',
      'Custom integrations',
      'Priority support',
      'Custom metadata fields',
      'Advanced analytics',
      'Team management'
    ],
    limits: {
      dailyPhotos: Infinity,
      batchSize: Infinity,
      priority: true,
      apiAccess: true,
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
  return `$${price.toFixed(2)}`;
};

export const createCheckoutSession = async (priceId, successUrl, cancelUrl) => {
  try {
    // Determine if this is a subscription or one-time payment based on the plan
    const plan = Object.values(PRICING_PLANS).find(p => p.stripePriceId === priceId);
    const isSubscription = plan ? plan.accountRequired : false;
    
    const endpoint = isSubscription ? '/api/create-subscription-checkout' : '/api/create-checkout-session';
    
    // API URL configuration - more robust detection
    const isProduction = window.location.hostname !== 'localhost';
    const apiUrl = isProduction 
      ? '/.netlify/functions' 
      : 'http://localhost:3002';
    
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
    const planId = plan ? plan.id : 'pro';
    
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