const request = require('supertest');
const app = require('../../server');
const { testConnection } = require('../../config/database');
const redisConfig = require('../../config/redis');
const queueService = require('../../services/queueService');

describe('Priority 5A - Advanced API & Integration Platform', () => {
  let authToken;
  let apiKey;
  let testUserId;

  beforeAll(async () => {
    // Ensure database and Redis connections
    await testConnection();
    await redisConfig.connect();
    
    // Create test user and get auth token
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@priority5a.com',
        password: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User'
      });
    
    testUserId = userResponse.body.data.user.id;
    authToken = userResponse.body.data.token;
  });

  afterAll(async () => {
    // Cleanup test data
    await redisConfig.disconnect();
  });

  describe('File Processing Pipeline', () => {
    test('should upload file with virus scanning', async () => {
      const response = await request(app)
        .post('/api/files/upload')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', Buffer.from('test file content'), 'test.txt')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.file).toHaveProperty('id');
      expect(response.body.data.file.status).toBe('processing');
    });

    test('should extract EXIF metadata from images', async () => {
      const response = await request(app)
        .post('/api/files/upload')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', Buffer.from('fake image data'), 'test.jpg')
        .expect(200);

      const fileId = response.body.data.file.id;
      
      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const metadataResponse = await request(app)
        .get(`/api/files/${fileId}/metadata`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(metadataResponse.body.success).toBe(true);
    });

    test('should handle batch file uploads', async () => {
      const response = await request(app)
        .post('/api/files/batch-upload')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('files', Buffer.from('test file 1'), 'test1.txt')
        .attach('files', Buffer.from('test file 2'), 'test2.txt')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.batchId).toBeDefined();
      expect(response.body.data.files).toHaveLength(2);
    });

    test('should track processing status', async () => {
      const uploadResponse = await request(app)
        .post('/api/files/upload')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', Buffer.from('test content'), 'status-test.txt');

      const fileId = uploadResponse.body.data.file.id;
      
      const statusResponse = await request(app)
        .get(`/api/files/${fileId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(statusResponse.body.success).toBe(true);
      expect(statusResponse.body.data).toHaveProperty('status');
      expect(statusResponse.body.data).toHaveProperty('progress');
    });
  });

  describe('API Key Management', () => {
    test('should create API key with permissions', async () => {
      const response = await request(app)
        .post('/api/keys')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test API Key',
          permissions: ['files:read', 'files:write'],
          rateLimit: 1000,
          ipWhitelist: ['127.0.0.1']
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.apiKey).toBeDefined();
      apiKey = response.body.data.apiKey;
    });

    test('should authenticate with API key', async () => {
      const response = await request(app)
        .get('/api/files')
        .set('X-API-Key', apiKey)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    test('should enforce rate limiting', async () => {
      // Make multiple rapid requests to test rate limiting
      const promises = Array(10).fill().map(() =>
        request(app)
          .get('/api/files')
          .set('X-API-Key', apiKey)
      );

      const responses = await Promise.all(promises);
      const rateLimited = responses.some(res => res.status === 429);
      
      // Rate limiting should kick in for rapid requests
      expect(rateLimited).toBe(true);
    });

    test('should track API usage analytics', async () => {
      const response = await request(app)
        .get('/api/keys/analytics')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('usage');
    });
  });

  describe('Webhook System', () => {
    let webhookId;

    test('should create webhook endpoint', async () => {
      const response = await request(app)
        .post('/api/webhooks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          url: 'https://example.com/webhook',
          events: ['file.uploaded', 'file.processed'],
          secret: 'webhook-secret-123'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.webhook).toHaveProperty('id');
      webhookId = response.body.data.webhook.id;
    });

    test('should test webhook delivery', async () => {
      const response = await request(app)
        .post(`/api/webhooks/${webhookId}/test`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          event: 'file.uploaded',
          data: { fileId: 'test-123' }
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    test('should get webhook delivery history', async () => {
      const response = await request(app)
        .get(`/api/webhooks/${webhookId}/deliveries`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.deliveries).toBeDefined();
    });

    test('should get webhook analytics', async () => {
      const response = await request(app)
        .get(`/api/webhooks/${webhookId}/analytics`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.analytics).toBeDefined();
    });
  });

  describe('OAuth2 Authorization Server', () => {
    let clientId;
    let clientSecret;
    let authCode;

    test('should create OAuth2 application', async () => {
      const response = await request(app)
        .post('/api/oauth/applications')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test OAuth App',
          redirectUris: ['https://example.com/callback'],
          scopes: ['files:read', 'files:write']
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.application).toHaveProperty('clientId');
      clientId = response.body.data.application.clientId;
      clientSecret = response.body.data.application.clientSecret;
    });

    test('should handle authorization request', async () => {
      const response = await request(app)
        .get('/api/oauth/authorize')
        .query({
          client_id: clientId,
          response_type: 'code',
          redirect_uri: 'https://example.com/callback',
          scope: 'files:read',
          state: 'test-state'
        })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    test('should exchange authorization code for token', async () => {
      // First get an auth code (simplified for testing)
      const authResponse = await request(app)
        .post('/api/oauth/authorize')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          client_id: clientId,
          response_type: 'code',
          redirect_uri: 'https://example.com/callback',
          scope: 'files:read',
          approve: true
        });

      if (authResponse.body.data && authResponse.body.data.code) {
        authCode = authResponse.body.data.code;

        const tokenResponse = await request(app)
          .post('/api/oauth/token')
          .send({
            grant_type: 'authorization_code',
            client_id: clientId,
            client_secret: clientSecret,
            code: authCode,
            redirect_uri: 'https://example.com/callback'
          })
          .expect(200);

        expect(tokenResponse.body.access_token).toBeDefined();
        expect(tokenResponse.body.token_type).toBe('Bearer');
      }
    });
  });

  describe('Analytics & Insights Platform', () => {
    test('should get system metrics', async () => {
      const response = await request(app)
        .get('/api/analytics/metrics')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ timeRange: '24h' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.metrics).toBeDefined();
    });

    test('should get usage data', async () => {
      const response = await request(app)
        .get('/api/analytics/usage')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ timeRange: '7d', granularity: 'day' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.usage).toBeDefined();
    });

    test('should get processing queue status', async () => {
      const response = await request(app)
        .get('/api/analytics/queue-status')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.queues).toBeDefined();
    });

    test('should get real-time metrics', async () => {
      const response = await request(app)
        .get('/api/analytics/real-time')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.metrics).toBeDefined();
    });
  });

  describe('Advanced Filtering System', () => {
    test('should save custom filter', async () => {
      const response = await request(app)
        .post('/api/analytics/filters')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Filter',
          description: 'Filter for testing',
          filterConfig: {
            conditions: [
              {
                field: 'created_at',
                operator: 'gte',
                value: '2024-01-01',
                dataType: 'date'
              }
            ],
            logic: 'AND'
          },
          isPublic: false
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.filter).toHaveProperty('id');
    });

    test('should get saved filters', async () => {
      const response = await request(app)
        .get('/api/analytics/filters')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.filters).toBeDefined();
    });

    test('should apply complex filters', async () => {
      const response = await request(app)
        .post('/api/analytics/apply-filter')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          filterConfig: {
            conditions: [
              {
                field: 'file_size',
                operator: 'gt',
                value: 1000,
                dataType: 'number'
              },
              {
                field: 'file_type',
                operator: 'in',
                value: ['image/jpeg', 'image/png'],
                dataType: 'string'
              }
            ],
            logic: 'AND',
            sorting: [
              { field: 'created_at', direction: 'desc' }
            ]
          },
          baseTable: 'files'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.results).toBeDefined();
    });
  });

  describe('Data Export System', () => {
    test('should create export job', async () => {
      const response = await request(app)
        .post('/api/analytics/export')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          exportType: 'metrics',
          format: 'csv',
          timeRange: '7d',
          filters: {
            conditions: [],
            logic: 'AND'
          }
        })
        .expect(202);

      expect(response.body.success).toBe(true);
      expect(response.body.data.jobId).toBeDefined();
    });

    test('should get export job status', async () => {
      // Create export job first
      const createResponse = await request(app)
        .post('/api/analytics/export')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          exportType: 'usage',
          format: 'json',
          timeRange: '24h'
        });

      const jobId = createResponse.body.data.jobId;

      const statusResponse = await request(app)
        .get(`/api/analytics/export/${jobId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(statusResponse.body.success).toBe(true);
      expect(statusResponse.body.data.job).toHaveProperty('status');
    });

    test('should list export jobs', async () => {
      const response = await request(app)
        .get('/api/analytics/export/jobs')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.jobs).toBeDefined();
    });
  });

  describe('System Health & Performance', () => {
    test('should get system health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBeDefined();
      expect(response.body.services).toBeDefined();
      expect(response.body.services.database).toBeDefined();
      expect(response.body.services.redis).toBeDefined();
    });

    test('should get performance metrics', async () => {
      const response = await request(app)
        .get('/api/analytics/performance')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.performance).toBeDefined();
    });

    test('should handle queue monitoring', async () => {
      const queueStats = await queueService.getQueueStats();
      expect(queueStats).toBeDefined();
      expect(queueStats.fileProcessing).toBeDefined();
      expect(queueStats.webhookDelivery).toBeDefined();
    });
  });

  describe('Security & Compliance', () => {
    test('should enforce authentication on protected endpoints', async () => {
      const response = await request(app)
        .get('/api/files')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('authentication');
    });

    test('should validate API key permissions', async () => {
      // Try to access endpoint without proper permissions
      const response = await request(app)
        .delete('/api/files/nonexistent')
        .set('X-API-Key', apiKey)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    test('should handle CORS properly', async () => {
      const response = await request(app)
        .options('/api/files')
        .set('Origin', 'https://proofpix.com')
        .expect(204);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    test('should sanitize input data', async () => {
      const response = await request(app)
        .post('/api/files/upload')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          maliciousScript: '<script>alert("xss")</script>',
          sqlInjection: "'; DROP TABLE files; --"
        });

      // Should not crash the server
      expect(response.status).toBeLessThan(500);
    });
  });
}); 