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
    const { priceId, successUrl, cancelUrl, metadata = {} } = JSON.parse(event.body);

    if (!priceId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Price ID is required' }),
      };
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: priceId.includes('training') ? 'payment' : 'subscription',
      success_url: successUrl || `${process.env.REACT_APP_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.REACT_APP_APP_URL}/pricing-v2`,
      metadata: {
        ...metadata,
        source: 'proofpix_unified_pricing',
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_creation: 'always',
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ id: session.id }),
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
}; 