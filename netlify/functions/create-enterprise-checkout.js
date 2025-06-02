const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { 
      planType, 
      accountId, 
      features, 
      source, 
      successUrl, 
      cancelUrl,
      customerEmail 
    } = JSON.parse(event.body);

    // Enterprise plan configurations
    const enterprisePlans = {
      enterprise: {
        name: 'Enterprise Standard',
        priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise_standard',
        amount: 49900, // $499.00
        description: 'Enterprise Standard Plan - Up to 100 users'
      },
      'enterprise-plus': {
        name: 'Enterprise Plus',
        priceId: process.env.STRIPE_ENTERPRISE_PLUS_PRICE_ID || 'price_enterprise_plus',
        amount: 99900, // $999.00
        description: 'Enterprise Plus Plan - Unlimited users'
      },
      custom: {
        name: 'Custom Enterprise',
        priceId: process.env.STRIPE_ENTERPRISE_CUSTOM_PRICE_ID || 'price_enterprise_custom',
        amount: 199900, // $1999.00
        description: 'Custom Enterprise Plan - Tailored solution'
      }
    };

    const selectedPlan = enterprisePlans[planType] || enterprisePlans.enterprise;

    // Create checkout session with enterprise metadata
    const sessionConfig = {
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: selectedPlan.priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${process.env.URL || 'https://upload.proofpixapp.com'}/enterprise/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.URL || 'https://upload.proofpixapp.com'}/enterprise`,
      
      // Enterprise-specific metadata
      metadata: {
        plan_type: planType,
        account_id: accountId,
        enterprise_setup: 'true',
        setup_start_time: Date.now().toString(),
        source: source || 'one_click_setup',
        features: JSON.stringify(features || [])
      },
      
      // Subscription metadata
      subscription_data: {
        metadata: {
          plan_type: planType,
          account_id: accountId,
          enterprise_account: 'true'
        }
      },

      // Customer information
      customer_email: customerEmail,
      
      // Billing details collection
      billing_address_collection: 'required',
      
      // Tax calculation
      automatic_tax: {
        enabled: true,
      },
      
      // Allow promotion codes
      allow_promotion_codes: true,
      
      // Custom fields for enterprise
      custom_fields: [
        {
          key: 'company_name',
          label: {
            type: 'custom',
            custom: 'Company Name'
          },
          type: 'text',
          optional: false
        },
        {
          key: 'estimated_users',
          label: {
            type: 'custom', 
            custom: 'Estimated Number of Users'
          },
          type: 'numeric',
          optional: true
        }
      ],
      
      // Phone number collection
      phone_number_collection: {
        enabled: true,
      }
    };

    // Handle development mode with placeholder price IDs
    if (selectedPlan.priceId.includes('placeholder') || !process.env.STRIPE_SECRET_KEY?.startsWith('sk_')) {
      console.log('🧪 Development Mode: Simulating enterprise checkout');
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          sessionId: `cs_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          url: `${process.env.URL || 'https://upload.proofpixapp.com'}/enterprise/demo-success`,
          mock: true,
          message: `Mock enterprise checkout for ${selectedPlan.name}`,
          planType,
          accountId,
          amount: selectedPlan.amount
        }),
      };
    }

    // Create real Stripe checkout session
    const session = await stripe.checkout.sessions.create(sessionConfig);

    // Log enterprise setup initiation
    console.log('Enterprise checkout session created:', {
      sessionId: session.id,
      planType,
      accountId,
      amount: selectedPlan.amount,
      customerEmail
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        sessionId: session.id,
        url: session.url,
        planType,
        accountId,
        amount: selectedPlan.amount
      }),
    };

  } catch (error) {
    console.error('Enterprise checkout error:', error);
    
    // Handle specific Stripe errors
    if (error.type === 'StripeCardError') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Card error',
          message: error.message
        }),
      };
    }
    
    if (error.type === 'StripeInvalidRequestError') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Invalid request',
          message: error.message
        }),
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      }),
    };
  }
}; 