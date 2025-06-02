const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    if (event.httpMethod === 'GET') {
      // Handle payment status polling
      const sessionId = event.queryStringParameters?.session_id;
      
      if (!sessionId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'session_id is required' }),
        };
      }

      // Retrieve checkout session from Stripe
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      let status = 'processing';
      let progress = 50;
      let message = 'Processing payment...';

      // Map Stripe status to our status
      switch (session.payment_status) {
        case 'paid':
          status = 'succeeded';
          progress = 100;
          message = 'Payment successful!';
          break;
        case 'unpaid':
          if (session.status === 'expired') {
            status = 'failed';
            progress = 0;
            message = 'Payment session expired';
          } else {
            status = 'processing';
            progress = 30;
            message = 'Awaiting payment...';
          }
          break;
        case 'no_payment_required':
          status = 'succeeded';
          progress = 100;
          message = 'Setup complete!';
          break;
        default:
          status = 'processing';
          progress = 50;
          message = 'Processing payment...';
      }

      // If payment succeeded, check if account setup is complete
      if (status === 'succeeded' && session.metadata?.enterprise_setup) {
        // Simulate enterprise account setup progress
        const setupStartTime = parseInt(session.metadata.setup_start_time || '0');
        const currentTime = Date.now();
        const elapsedTime = currentTime - setupStartTime;
        
        if (elapsedTime < 30000) { // First 30 seconds
          progress = 70 + Math.floor((elapsedTime / 30000) * 30);
          message = 'Setting up your enterprise account...';
        } else {
          progress = 100;
          message = 'Enterprise account ready!';
        }
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          sessionId,
          status,
          progress,
          message,
          amount: session.amount_total,
          currency: session.currency,
          customer_email: session.customer_details?.email,
          metadata: session.metadata,
          timestamp: Date.now()
        }),
      };
    }

    if (event.httpMethod === 'POST') {
      // Handle webhook for real-time updates
      const signature = event.headers['stripe-signature'];
      
      if (!signature) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing Stripe signature' }),
        };
      }

      let stripeEvent;
      try {
        stripeEvent = stripe.webhooks.constructEvent(
          event.body,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid signature' }),
        };
      }

      // Handle different webhook events
      let responseData = { received: true };

      switch (stripeEvent.type) {
        case 'checkout.session.completed':
          const session = stripeEvent.data.object;
          
          // Trigger enterprise setup if needed
          if (session.metadata?.enterprise_setup === 'true') {
            await triggerEnterpriseSetup(session);
          }
          
          responseData = {
            received: true,
            sessionId: session.id,
            status: 'succeeded',
            progress: 100,
            message: 'Payment successful!',
            amount: session.amount_total,
            currency: session.currency
          };
          break;

        case 'checkout.session.expired':
          const expiredSession = stripeEvent.data.object;
          responseData = {
            received: true,
            sessionId: expiredSession.id,
            status: 'failed',
            progress: 0,
            message: 'Payment session expired'
          };
          break;

        case 'payment_intent.succeeded':
          const paymentIntent = stripeEvent.data.object;
          responseData = {
            received: true,
            paymentIntentId: paymentIntent.id,
            status: 'succeeded',
            progress: 100,
            message: 'Payment confirmed!'
          };
          break;

        case 'payment_intent.payment_failed':
          const failedPayment = stripeEvent.data.object;
          responseData = {
            received: true,
            paymentIntentId: failedPayment.id,
            status: 'failed',
            progress: 0,
            message: 'Payment failed'
          };
          break;

        default:
          console.log(`Unhandled event type: ${stripeEvent.type}`);
      }

      // In a real implementation, you would broadcast this to connected WebSocket clients
      // For now, we'll just log it
      console.log('Payment status update:', responseData);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(responseData),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };

  } catch (error) {
    console.error('Payment status error:', error);
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

// Helper function to trigger enterprise account setup
async function triggerEnterpriseSetup(session) {
  try {
    // Generate enterprise account credentials
    const accountId = `ent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const apiKey = `pk_live_${Math.random().toString(36).substr(2, 32)}`;
    const secretKey = `sk_live_your_stripe_secret_key_here`;
    
    // In a real implementation, you would:
    // 1. Create database records for the enterprise account
    // 2. Set up user permissions and roles
    // 3. Configure API access and rate limits
    // 4. Send welcome email with credentials
    // 5. Set up monitoring and analytics
    
    console.log('Enterprise account setup triggered:', {
      sessionId: session.id,
      accountId,
      customerEmail: session.customer_details?.email,
      planType: session.metadata?.plan_type || 'enterprise'
    });
    
    // Store setup data (in production, this would go to a database)
    const setupData = {
      accountId,
      apiKey,
      secretKey,
      dashboardUrl: `https://enterprise.proofpixapp.com/dashboard/${accountId}`,
      adminEmail: session.customer_details?.email,
      setupToken: Math.random().toString(36).substr(2, 16),
      createdAt: new Date().toISOString(),
      planType: session.metadata?.plan_type || 'enterprise',
      stripeCustomerId: session.customer,
      stripeSessionId: session.id
    };
    
    // In production, save to database and send email
    console.log('Enterprise setup complete:', setupData);
    
    return setupData;
  } catch (error) {
    console.error('Enterprise setup error:', error);
    throw error;
  }
} 