require('dotenv').config({ path: '.env.test' });

// Mock external services for testing
jest.mock('../services/emailService', () => ({
  sendEmail: jest.fn().mockResolvedValue({ success: true }),
  verifyEmailConfig: jest.fn().mockResolvedValue(true)
}));

jest.mock('aws-sdk', () => ({
  S3: jest.fn(() => ({
    upload: jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        Location: 'https://test-bucket.s3.amazonaws.com/test-file.jpg',
        Key: 'test-file.jpg'
      })
    }),
    deleteObject: jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({})
    }),
    getSignedUrl: jest.fn().mockReturnValue('https://test-signed-url.com')
  }))
}));

// Mock virus scanner
jest.mock('../utils/virusScanner', () => ({
  scanFile: jest.fn().mockResolvedValue({ 
    isClean: true, 
    threats: [] 
  })
}));

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://localhost:5432/proofpix_test';
process.env.REDIS_URL = process.env.TEST_REDIS_URL || 'redis://localhost:6379/1';
process.env.AWS_ACCESS_KEY_ID = 'test-access-key';
process.env.AWS_SECRET_ACCESS_KEY = 'test-secret-key';
process.env.AWS_S3_BUCKET = 'test-bucket';
process.env.AWS_S3_REGION = 'us-east-1';
process.env.FRONTEND_URL = 'http://localhost:3000';
process.env.STRIPE_SECRET_KEY = 'sk_test_fake_key_for_testing';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_fake_webhook_secret';

// Increase timeout for integration tests
jest.setTimeout(30000);

// Global test utilities
global.testUtils = {
  createTestUser: async () => {
    const { v4: uuidv4 } = require('uuid');
    return {
      id: uuidv4(),
      email: `test-${Date.now()}@example.com`,
      firstName: 'Test',
      lastName: 'User',
      isVerified: true,
      createdAt: new Date()
    };
  },
  
  createTestFile: () => {
    const { v4: uuidv4 } = require('uuid');
    return {
      id: uuidv4(),
      originalName: 'test-file.jpg',
      fileName: `test-${Date.now()}.jpg`,
      mimeType: 'image/jpeg',
      size: 1024,
      status: 'completed'
    };
  },
  
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms))
}; 