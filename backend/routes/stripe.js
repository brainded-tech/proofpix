const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create Stripe Checkout Session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { priceId, successUrl, cancelUrl, metadata = {} } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
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
      mode: 'subscription',
      success_url: successUrl || `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.origin}/pricing-v2`,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
        source: 'proofpix_checkout'
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_creation: 'always',
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message 
    });
  }
});

// Handle one-time payments (session passes, training packages)
router.post('/create-payment-session', async (req, res) => {
  try {
    const { priceId, successUrl, cancelUrl, metadata = {} } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    // Create Stripe checkout session for one-time payment
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.origin}/pricing-v2`,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
        source: 'proofpix_payment'
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating payment session:', error);
    res.status(500).json({ 
      error: 'Failed to create payment session',
      details: error.message 
    });
  }
});

// Create customer portal session
router.post('/customer-portal', async (req, res) => {
  try {
    const { customerId, returnUrl } = req.body;

    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID is required' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${req.headers.origin}/dashboard`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    res.status(500).json({ 
      error: 'Failed to create customer portal session',
      details: error.message 
    });
  }
});

// Validate discount code
router.get('/validate-discount/:code', async (req, res) => {
  try {
    const { code } = req.params;

    // Get promotion codes from Stripe
    const promotionCodes = await stripe.promotionCodes.list({
      code: code,
      active: true,
      limit: 1,
    });

    if (promotionCodes.data.length === 0) {
      return res.status(404).json({ error: 'Invalid discount code' });
    }

    const promotionCode = promotionCodes.data[0];
    const coupon = await stripe.coupons.retrieve(promotionCode.coupon);

    res.json({
      valid: true,
      code: promotionCode.code,
      discount: {
        type: coupon.percent_off ? 'percentage' : 'amount',
        value: coupon.percent_off || coupon.amount_off,
        currency: coupon.currency,
      },
      restrictions: {
        first_time_transaction: coupon.max_redemptions === 1,
        minimum_amount: coupon.minimum_amount,
      }
    });
  } catch (error) {
    console.error('Error validating discount code:', error);
    res.status(500).json({ 
      error: 'Failed to validate discount code',
      details: error.message 
    });
  }
});

// Webhook endpoint for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment successful:', session.id);
      // TODO: Fulfill the purchase, update user subscription, etc.
      break;
    
    case 'customer.subscription.created':
      const subscription = event.data.object;
      console.log('Subscription created:', subscription.id);
      // TODO: Update user subscription status
      break;
    
    case 'customer.subscription.updated':
      const updatedSubscription = event.data.object;
      console.log('Subscription updated:', updatedSubscription.id);
      // TODO: Update user subscription status
      break;
    
    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object;
      console.log('Subscription cancelled:', deletedSubscription.id);
      // TODO: Update user subscription status
      break;
    
    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      console.log('Invoice payment succeeded:', invoice.id);
      // TODO: Update billing records
      break;
    
    case 'invoice.payment_failed':
      const failedInvoice = event.data.object;
      console.log('Invoice payment failed:', failedInvoice.id);
      // TODO: Handle failed payment
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router; 