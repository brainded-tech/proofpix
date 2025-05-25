const express = require('express');
const cors = require('cors');

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'https://upload.proofpixapp.com'],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    mode: 'development',
    message: 'Mock Stripe server for testing'
  });
});

// Mock session-based checkout (Day Pass, Week Pass)
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { priceId, successUrl, cancelUrl } = req.body;
    
    console.log('🧪 Mock: Creating session-based checkout for price:', priceId);
    
    // Mock session ID
    const mockSessionId = `cs_test_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('✅ Mock session created:', mockSessionId);
    
    // For development, we'll just return a mock session ID
    // In a real implementation, this would redirect to Stripe Checkout
    res.json({ 
      id: mockSessionId,
      url: `https://checkout.stripe.com/pay/${mockSessionId}`,
      mock: true,
      message: 'This is a mock response for development. In production, this would redirect to Stripe Checkout.'
    });
  } catch (error) {
    console.error('❌ Mock error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Mock subscription checkout (Starter, Pro, Enterprise)
app.post('/api/create-subscription-checkout', async (req, res) => {
  try {
    const { priceId, successUrl, cancelUrl, customerEmail } = req.body;
    
    console.log('🧪 Mock: Creating subscription checkout for price:', priceId);
    console.log('🧪 Mock: Customer email:', customerEmail);
    
    // Mock session ID
    const mockSessionId = `cs_test_mock_sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('✅ Mock subscription session created:', mockSessionId);
    
    // For development, we'll just return a mock session ID
    res.json({ 
      id: mockSessionId,
      url: `https://checkout.stripe.com/pay/${mockSessionId}`,
      mock: true,
      message: 'This is a mock subscription response for development. In production, this would redirect to Stripe Checkout.'
    });
  } catch (error) {
    console.error('❌ Mock error creating subscription checkout:', error);
    res.status(500).json({ error: error.message });
  }
});

// Mock webhook endpoint
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  console.log('🧪 Mock: Webhook received');
  res.json({received: true, mock: true});
});

// Mock subscription status endpoint
app.get('/api/subscription/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    
    console.log('🧪 Mock: Checking subscription for customer:', customerId);
    
    // Mock response - no active subscription
    res.json({ 
      active: false,
      mock: true,
      message: 'Mock response - no active subscription found'
    });
  } catch (error) {
    console.error('Mock error fetching subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

// Mock cancel subscription endpoint
app.post('/api/cancel-subscription', async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    
    console.log('🧪 Mock: Cancelling subscription:', subscriptionId);
    
    res.json({ 
      success: true, 
      mock: true,
      message: 'Mock cancellation - subscription would be cancelled in production'
    });
  } catch (error) {
    console.error('Mock error cancelling subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🧪 ProofPix MOCK Stripe server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Mock webhook endpoint: http://localhost:${PORT}/webhook`);
  console.log(`⚠️  This is a DEVELOPMENT server with mock responses`);
  console.log(`⚠️  For production, use server.js with real Stripe keys`);
}); 