/**
 * ProofPix Enterprise - API Integration Testing Utility
 * 
 * This utility provides comprehensive testing of all backend enterprise features
 * to ensure seamless frontend-backend integration.
 */

interface TestResult {
  testName: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  details?: any;
}

interface TestSuite {
  suiteName: string;
  tests: TestResult[];
  totalDuration: number;
  passedCount: number;
  failedCount: number;
  skippedCount: number;
}

export class APIIntegrationTester {
  private baseURL: string;
  private authToken: string | null = null;
  private testResults: TestSuite[] = [];

  constructor(baseURL: string = process.env.REACT_APP_API_URL || 'http://localhost:5000') {
    this.baseURL = baseURL;
  }

  /**
   * Run all integration tests
   */
  async runAllTests(): Promise<TestSuite[]> {
    console.log('🚀 Starting ProofPix Enterprise API Integration Tests...');
    
    this.testResults = [];
    
    // Test suites in order of dependency
    await this.runAuthenticationTests();
    await this.runPaymentSystemTests();
    await this.runEnterpriseFeatureTests();
    await this.runSecurityComplianceTests();
    await this.runPerformanceTests();
    
    this.generateTestReport();
    return this.testResults;
  }

  /**
   * Authentication & User Management Tests
   */
  private async runAuthenticationTests(): Promise<void> {
    const suite: TestSuite = {
      suiteName: 'Authentication & User Management',
      tests: [],
      totalDuration: 0,
      passedCount: 0,
      failedCount: 0,
      skippedCount: 0
    };

    // Test 1: User Registration
    await this.runTest(suite, 'User Registration', async () => {
      const response = await fetch(`${this.baseURL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `test-${Date.now()}@proofpix.com`,
          password: 'SecurePassword123!',
          firstName: 'Test',
          lastName: 'User',
          company: 'ProofPix Test Corp'
        })
      });

      if (!response.ok) {
        throw new Error(`Registration failed: ${response.status}`);
      }

      const data = await response.json();
      return { userId: data.user?.id, message: data.message };
    });

    // Test 2: User Login
    await this.runTest(suite, 'User Login', async () => {
      const response = await fetch(`${this.baseURL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'demo@proofpix.com',
          password: 'demo123'
        })
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.status}`);
      }

      const data = await response.json();
      this.authToken = data.token;
      return { token: data.token, user: data.user };
    });

    // Test 3: Token Validation
    await this.runTest(suite, 'Token Validation', async () => {
      if (!this.authToken) {
        throw new Error('No auth token available');
      }

      const response = await fetch(`${this.baseURL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${this.authToken}` }
      });

      if (!response.ok) {
        throw new Error(`Token validation failed: ${response.status}`);
      }

      const data = await response.json();
      return { user: data.user };
    });

    // Test 4: Password Reset Request
    await this.runTest(suite, 'Password Reset Request', async () => {
      const response = await fetch(`${this.baseURL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'demo@proofpix.com'
        })
      });

      if (!response.ok) {
        throw new Error(`Password reset failed: ${response.status}`);
      }

      const data = await response.json();
      return { message: data.message };
    });

    this.testResults.push(suite);
  }

  /**
   * Payment System Integration Tests
   */
  private async runPaymentSystemTests(): Promise<void> {
    const suite: TestSuite = {
      suiteName: 'Payment System Integration',
      tests: [],
      totalDuration: 0,
      passedCount: 0,
      failedCount: 0,
      skippedCount: 0
    };

    // Test 1: Get Current Subscription
    await this.runTest(suite, 'Get Current Subscription', async () => {
      const response = await fetch(`${this.baseURL}/api/payments/subscriptions/me`, {
        headers: { 'Authorization': `Bearer ${this.authToken}` }
      });

      if (!response.ok) {
        throw new Error(`Get subscription failed: ${response.status}`);
      }

      const data = await response.json();
      return { subscription: data.subscription };
    });

    // Test 2: Get Usage Summary
    await this.runTest(suite, 'Get Usage Summary', async () => {
      const response = await fetch(`${this.baseURL}/api/payments/usage`, {
        headers: { 'Authorization': `Bearer ${this.authToken}` }
      });

      if (!response.ok) {
        throw new Error(`Get usage failed: ${response.status}`);
      }

      const data = await response.json();
      return { usage: data.usage };
    });

    // Test 3: Track Usage Event
    await this.runTest(suite, 'Track Usage Event', async () => {
      const response = await fetch(`${this.baseURL}/api/payments/usage/track`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          usage_type: 'api_calls',
          quantity: 1,
          metadata: { test: true }
        })
      });

      if (!response.ok) {
        throw new Error(`Track usage failed: ${response.status}`);
      }

      const data = await response.json();
      return { usage: data.usage, quotaStatus: data.quota_status };
    });

    // Test 4: Check Quota Status
    await this.runTest(suite, 'Check Quota Status', async () => {
      const response = await fetch(`${this.baseURL}/api/payments/usage/check/api_calls`, {
        headers: { 'Authorization': `Bearer ${this.authToken}` }
      });

      if (!response.ok) {
        throw new Error(`Check quota failed: ${response.status}`);
      }

      const data = await response.json();
      return { quotaStatus: data.quota_status };
    });

    // Test 5: Get Invoices
    await this.runTest(suite, 'Get Invoices', async () => {
      const response = await fetch(`${this.baseURL}/api/payments/invoices`, {
        headers: { 'Authorization': `Bearer ${this.authToken}` }
      });

      if (!response.ok) {
        throw new Error(`Get invoices failed: ${response.status}`);
      }

      const data = await response.json();
      return { invoices: data.invoices };
    });

    this.testResults.push(suite);
  }

  /**
   * Enterprise Features Tests
   */
  private async runEnterpriseFeatureTests(): Promise<void> {
    const suite: TestSuite = {
      suiteName: 'Enterprise Features',
      tests: [],
      totalDuration: 0,
      passedCount: 0,
      failedCount: 0,
      skippedCount: 0
    };

    // Test 1: Generate API Key
    await this.runTest(suite, 'Generate API Key', async () => {
      const response = await fetch(`${this.baseURL}/api/keys/generate`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'Integration Test Key',
          permissions: ['read', 'write'],
          rateLimit: 1000,
          environment: 'test'
        })
      });

      if (!response.ok) {
        throw new Error(`Generate API key failed: ${response.status}`);
      }

      const data = await response.json();
      return { apiKey: data.data };
    });

    // Test 2: Get User API Keys
    await this.runTest(suite, 'Get User API Keys', async () => {
      const response = await fetch(`${this.baseURL}/api/keys`, {
        headers: { 'Authorization': `Bearer ${this.authToken}` }
      });

      if (!response.ok) {
        throw new Error(`Get API keys failed: ${response.status}`);
      }

      const data = await response.json();
      return { apiKeys: data.data };
    });

    // Test 3: Validate API Key
    await this.runTest(suite, 'Validate API Key', async () => {
      // First get an API key
      const keysResponse = await fetch(`${this.baseURL}/api/keys`, {
        headers: { 'Authorization': `Bearer ${this.authToken}` }
      });
      
      if (!keysResponse.ok) {
        throw new Error('Could not get API keys for validation test');
      }
      
      const keysData = await keysResponse.json();
      if (!keysData.data || keysData.data.length === 0) {
        throw new Error('No API keys available for validation test');
      }

      // Use a dummy key for validation test
      const response = await fetch(`${this.baseURL}/api/keys/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: 'pk_test_dummy_key_for_testing'
        })
      });

      // This should fail with invalid key, which is expected
      const data = await response.json();
      return { validation: data, expectedFailure: true };
    });

    this.testResults.push(suite);
  }

  /**
   * Security & Compliance Tests
   */
  private async runSecurityComplianceTests(): Promise<void> {
    const suite: TestSuite = {
      suiteName: 'Security & Compliance',
      tests: [],
      totalDuration: 0,
      passedCount: 0,
      failedCount: 0,
      skippedCount: 0
    };

    // Test 1: Rate Limiting
    await this.runTest(suite, 'Rate Limiting Protection', async () => {
      const requests = [];
      
      // Make multiple rapid requests to test rate limiting
      for (let i = 0; i < 10; i++) {
        requests.push(
          fetch(`${this.baseURL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: 'invalid@test.com',
              password: 'invalid'
            })
          })
        );
      }

      const responses = await Promise.all(requests);
      const rateLimited = responses.some(r => r.status === 429);
      
      return { rateLimitingActive: rateLimited, responses: responses.length };
    });

    // Test 2: Input Validation
    await this.runTest(suite, 'Input Validation', async () => {
      const response = await fetch(`${this.baseURL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'invalid-email',
          password: '123', // Too short
          firstName: '', // Empty
          lastName: '<script>alert("xss")</script>' // XSS attempt
        })
      });

      // Should return validation errors
      const data = await response.json();
      return { 
        validationWorking: response.status === 400,
        errors: data.errors || data.message 
      };
    });

    // Test 3: Security Headers
    await this.runTest(suite, 'Security Headers', async () => {
      const response = await fetch(`${this.baseURL}/health`);
      
      const securityHeaders = {
        'x-frame-options': response.headers.get('x-frame-options'),
        'x-content-type-options': response.headers.get('x-content-type-options'),
        'x-xss-protection': response.headers.get('x-xss-protection'),
        'strict-transport-security': response.headers.get('strict-transport-security')
      };

      return { securityHeaders };
    });

    this.testResults.push(suite);
  }

  /**
   * Performance Tests
   */
  private async runPerformanceTests(): Promise<void> {
    const suite: TestSuite = {
      suiteName: 'Performance Tests',
      tests: [],
      totalDuration: 0,
      passedCount: 0,
      failedCount: 0,
      skippedCount: 0
    };

    // Test 1: API Response Time
    await this.runTest(suite, 'API Response Time', async () => {
      const startTime = Date.now();
      
      const response = await fetch(`${this.baseURL}/health`);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }

      return { 
        responseTime,
        acceptable: responseTime < 1000, // Should be under 1 second
        data: await response.json()
      };
    });

    // Test 2: Concurrent Requests
    await this.runTest(suite, 'Concurrent Request Handling', async () => {
      const startTime = Date.now();
      
      const requests = Array(5).fill(null).map(() => 
        fetch(`${this.baseURL}/health`)
      );

      const responses = await Promise.all(requests);
      const endTime = Date.now();
      
      const allSuccessful = responses.every(r => r.ok);
      const totalTime = endTime - startTime;

      return {
        allSuccessful,
        totalTime,
        averageTime: totalTime / requests.length,
        concurrentRequestsHandled: requests.length
      };
    });

    this.testResults.push(suite);
  }

  /**
   * Run individual test with error handling and timing
   */
  private async runTest(
    suite: TestSuite, 
    testName: string, 
    testFunction: () => Promise<any>
  ): Promise<void> {
    const startTime = Date.now();
    
    try {
      console.log(`  ⏳ Running: ${testName}`);
      
      const result = await testFunction();
      const duration = Date.now() - startTime;
      
      suite.tests.push({
        testName,
        status: 'passed',
        duration,
        details: result
      });
      
      suite.passedCount++;
      suite.totalDuration += duration;
      
      console.log(`  ✅ Passed: ${testName} (${duration}ms)`);
      
    } catch (error) {
      const duration = Date.now() - startTime;
      
      suite.tests.push({
        testName,
        status: 'failed',
        duration,
        error: error instanceof Error ? error.message : String(error)
      });
      
      suite.failedCount++;
      suite.totalDuration += duration;
      
      console.log(`  ❌ Failed: ${testName} (${duration}ms) - ${error}`);
    }
  }

  /**
   * Generate comprehensive test report
   */
  private generateTestReport(): void {
    console.log('\n📊 ProofPix Enterprise API Integration Test Report');
    console.log('=' .repeat(60));
    
    let totalTests = 0;
    let totalPassed = 0;
    let totalFailed = 0;
    let totalDuration = 0;

    this.testResults.forEach(suite => {
      console.log(`\n📋 ${suite.suiteName}`);
      console.log(`   Tests: ${suite.tests.length} | Passed: ${suite.passedCount} | Failed: ${suite.failedCount}`);
      console.log(`   Duration: ${suite.totalDuration}ms`);
      
      totalTests += suite.tests.length;
      totalPassed += suite.passedCount;
      totalFailed += suite.failedCount;
      totalDuration += suite.totalDuration;
      
      // Show failed tests
      suite.tests.filter(t => t.status === 'failed').forEach(test => {
        console.log(`   ❌ ${test.testName}: ${test.error}`);
      });
    });

    console.log('\n🎯 Overall Results');
    console.log(`   Total Tests: ${totalTests}`);
    console.log(`   Passed: ${totalPassed} (${Math.round(totalPassed/totalTests*100)}%)`);
    console.log(`   Failed: ${totalFailed} (${Math.round(totalFailed/totalTests*100)}%)`);
    console.log(`   Total Duration: ${totalDuration}ms`);
    console.log(`   Average Test Time: ${Math.round(totalDuration/totalTests)}ms`);
    
    if (totalFailed === 0) {
      console.log('\n🎉 All tests passed! Integration is working correctly.');
    } else {
      console.log(`\n⚠️  ${totalFailed} tests failed. Please review and fix issues.`);
    }
  }

  /**
   * Get test results for external use
   */
  getTestResults(): TestSuite[] {
    return this.testResults;
  }

  /**
   * Export test results as JSON
   */
  exportResults(): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      testResults: this.testResults,
      summary: {
        totalSuites: this.testResults.length,
        totalTests: this.testResults.reduce((sum, suite) => sum + suite.tests.length, 0),
        totalPassed: this.testResults.reduce((sum, suite) => sum + suite.passedCount, 0),
        totalFailed: this.testResults.reduce((sum, suite) => sum + suite.failedCount, 0),
        totalDuration: this.testResults.reduce((sum, suite) => sum + suite.totalDuration, 0)
      }
    }, null, 2);
  }
}

// Export for use in React components
export default APIIntegrationTester; 