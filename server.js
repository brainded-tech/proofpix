require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'https://upload.proofpixapp.com'],
  credentials: true
}));

// Webhook endpoint (MUST be before express.json() middleware)
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      if (session.mode === 'payment') {
        // Session-based purchase (Day Pass, Week Pass)
        console.log('✅ Session-based purchase completed:', session.id);
        console.log('Plan:', session.metadata?.planId || 'Unknown');
        // No database storage needed - handled client-side
      } else if (session.mode === 'subscription') {
        // Subscription purchase (Starter, Pro, Enterprise)
        console.log('✅ Subscription created:', session.subscription);
        console.log('Customer:', session.customer);
        console.log('Email:', session.customer_details?.email);
        // Store subscription in your database
        // Example implementation:
        // await createUserSubscription({
        //   customerId: session.customer,
        //   subscriptionId: session.subscription,
        //   email: session.customer_details.email,
        //   planId: session.metadata?.planId
        // });
      }
      break;

    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      console.log('❌ Subscription cancelled:', subscription.id);
      // Update user's subscription status in database
      break;

    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      console.log('💰 Payment succeeded:', invoice.id);
      // Extend subscription period
      break;

    case 'invoice.payment_failed':
      const failedInvoice = event.data.object;
      console.log('💸 Payment failed:', failedInvoice.id);
      // Handle failed payment (email user, etc.)
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

// JSON middleware for other routes
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Session-based checkout (Day Pass, Week Pass)
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { priceId, successUrl, cancelUrl } = req.body;
    
    console.log('Creating session-based checkout for price:', priceId);
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'payment', // One-time payment
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        planType: 'session'
      }
    });

    console.log('✅ Session created:', session.id);
    res.json({ id: session.id });
  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    
    // If the price doesn't exist, return a helpful error for development
    if (error.message.includes('No such price')) {
      res.status(400).json({ 
        error: error.message,
        development_note: 'This price ID does not exist in your Stripe account. Please create the products in your Stripe dashboard or use test mode.',
        priceId: req.body.priceId
      });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Subscription checkout (Starter, Pro, Enterprise)
app.post('/api/create-subscription-checkout', async (req, res) => {
  try {
    const { priceId, successUrl, cancelUrl, customerEmail } = req.body;
    
    console.log('Creating subscription checkout for price:', priceId);
    
    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription', // Recurring payment
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        planType: 'subscription'
      },
      // Allow promotion codes
      allow_promotion_codes: true,
    };

    // Add customer email if provided
    if (customerEmail) {
      sessionConfig.customer_email = customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log('✅ Subscription session created:', session.id);
    res.json({ id: session.id });
  } catch (error) {
    console.error('❌ Error creating subscription checkout:', error);
    
    // If the price doesn't exist, return a helpful error for development
    if (error.message.includes('No such price')) {
      res.status(400).json({ 
        error: error.message,
        development_note: 'This price ID does not exist in your Stripe account. Please create the products in your Stripe dashboard or use test mode.',
        priceId: req.body.priceId
      });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Get subscription status (for account-based plans)
app.get('/api/subscription/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1
    });

    if (subscriptions.data.length > 0) {
      const subscription = subscriptions.data[0];
      res.json({
        active: true,
        subscription: {
          id: subscription.id,
          status: subscription.status,
          current_period_end: subscription.current_period_end,
          plan: subscription.items.data[0].price.id
        }
      });
    } else {
      res.json({ active: false });
    }
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

// Cancel subscription
app.post('/api/cancel-subscription', async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    });

    console.log('✅ Subscription cancelled:', subscriptionId);
    res.json({ success: true, subscription });
  } catch (error) {
    console.error('❌ Error cancelling subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 ProofPix Stripe server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Webhook endpoint: http://localhost:${PORT}/webhook`);
}); 