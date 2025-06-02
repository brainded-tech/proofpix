# Backend API Comprehensive Guide

## 📋 **Overview**

ProofPix's backend API provides a comprehensive suite of endpoints for document processing, team management, enterprise integrations, security, analytics, and more. This guide covers all 20+ route modules and their associated services.

**Backend Location**: `backend/`  
**Main Server**: `backend/server.js` (13KB, 433 lines)

---

## 🏗️ **Architecture Overview**

### **Backend Structure**
```
backend/
├── server.js                    # Main Express server
├── routes/                      # API route modules (20+ files)
├── services/                    # Business logic services
├── middleware/                  # Authentication & validation
├── models/                      # Database models
├── utils/                       # Utility functions
├── ai/                         # AI/ML processing services
├── plugins/                    # Plugin architecture
├── workers/                    # Background job processing
├── config/                     # Configuration management
└── tests/                      # API testing suite
```

### **Core Technologies**
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Redis caching
- **Authentication**: JWT with OAuth2 support
- **File Processing**: Multer with cloud storage
- **Real-time**: WebSocket with Socket.io
- **Background Jobs**: Bull Queue with Redis
- **Security**: Helmet, CORS, rate limiting

---

## 🔐 **Authentication & Authorization**

### **Authentication Routes** (`routes/auth.js` - 18KB, 731 lines)

#### **Core Authentication Endpoints**
```javascript
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
POST /api/auth/verify-email
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/change-password
```

#### **OAuth Integration** (`routes/oauth.js` - 22KB, 814 lines)
```javascript
// OAuth Providers
GET /api/oauth/google
GET /api/oauth/microsoft
GET /api/oauth/salesforce
GET /api/oauth/slack
POST /api/oauth/callback/:provider
DELETE /api/oauth/disconnect/:provider

// OAuth Token Management
POST /api/oauth/refresh-token
GET /api/oauth/user-info/:provider
POST /api/oauth/validate-token
```

#### **API Key Management** (`routes/apiKeys.js` - 15KB, 589 lines)
```javascript
POST /api/keys/generate
GET /api/keys/list
PUT /api/keys/:keyId/rotate
DELETE /api/keys/:keyId/revoke
GET /api/keys/:keyId/usage
POST /api/keys/:keyId/permissions
```

---

## 👥 **Team Management & RBAC**

### **Team Management Routes** (`routes/teams.js` - 27KB, 1,013 lines)

#### **Team Operations**
```javascript
// Team CRUD
POST /api/teams/create
GET /api/teams/:teamId
PUT /api/teams/:teamId/update
DELETE /api/teams/:teamId

// Member Management
POST /api/teams/:teamId/invite
PUT /api/teams/:teamId/members/:userId/role
DELETE /api/teams/:teamId/members/:userId
GET /api/teams/:teamId/members

// Team Settings
PUT /api/teams/:teamId/settings
GET /api/teams/:teamId/usage
POST /api/teams/:teamId/billing
```

#### **Role-Based Access Control**
```javascript
// Role Management
POST /api/teams/:teamId/roles/create
GET /api/teams/:teamId/roles
PUT /api/teams/:teamId/roles/:roleId
DELETE /api/teams/:teamId/roles/:roleId

// Permission Management
POST /api/teams/:teamId/permissions/assign
GET /api/teams/:teamId/permissions/audit
PUT /api/teams/:teamId/permissions/bulk-update
```

---

## 📁 **File Processing & Document Intelligence**

### **File Processing Routes** (`routes/files.js` - 18KB, 706 lines)

#### **File Upload & Management**
```javascript
POST /api/files/upload
POST /api/files/bulk-upload
GET /api/files/:fileId
DELETE /api/files/:fileId
GET /api/files/:fileId/download
POST /api/files/:fileId/share
```

#### **Document Processing**
```javascript
POST /api/files/:fileId/process
GET /api/files/:fileId/status
POST /api/files/:fileId/reprocess
GET /api/files/:fileId/results
POST /api/files/batch-process
```

### **Document Intelligence Routes** (`routes/documentIntelligence.js` - 8.9KB, 333 lines)

#### **AI-Powered Analysis**
```javascript
POST /api/document-intelligence/analyze
GET /api/document-intelligence/results/:jobId
POST /api/document-intelligence/classify
POST /api/document-intelligence/extract-entities
POST /api/document-intelligence/security-scan
GET /api/document-intelligence/insights/:documentId
```

---

## 🔒 **Security & Compliance**

### **Security Routes** (`routes/security.js` - 29KB, 1,201 lines)

#### **Security Monitoring**
```javascript
GET /api/security/dashboard
GET /api/security/threats
POST /api/security/scan
GET /api/security/audit-log
POST /api/security/incident/report
GET /api/security/compliance/status
```

#### **Privacy & Compliance**
```javascript
POST /api/security/privacy/scan
GET /api/security/compliance/frameworks
POST /api/security/compliance/assess
GET /api/security/retention/policies
POST /api/security/data/purge
GET /api/security/encryption/status
```

#### **Threat Detection**
```javascript
POST /api/security/threats/detect
GET /api/security/threats/active
PUT /api/security/threats/:threatId/resolve
POST /api/security/threats/block-ip
GET /api/security/threats/intelligence
```

---

## 🔗 **Enterprise Integrations**

### **Integration Routes** (`routes/integrations.js` - 15KB, 556 lines)

#### **Platform Integrations**
```javascript
// Salesforce Integration
POST /api/integrations/salesforce/connect
GET /api/integrations/salesforce/objects
POST /api/integrations/salesforce/sync
DELETE /api/integrations/salesforce/disconnect

// Microsoft 365 Integration
POST /api/integrations/microsoft/connect
GET /api/integrations/microsoft/files
POST /api/integrations/microsoft/sharepoint/sync
GET /api/integrations/microsoft/teams/channels

// Google Workspace Integration
POST /api/integrations/google/connect
GET /api/integrations/google/drive/files
POST /api/integrations/google/sheets/export
GET /api/integrations/google/calendar/events
```

#### **Integration Management**
```javascript
GET /api/integrations/status
POST /api/integrations/:platform/test
PUT /api/integrations/:platform/settings
GET /api/integrations/:platform/logs
POST /api/integrations/:platform/sync
```

---

## 📊 **Analytics & Performance**

### **Analytics Routes** (`routes/analytics.js` - 18KB, 653 lines)

#### **Usage Analytics**
```javascript
GET /api/analytics/usage
GET /api/analytics/performance
GET /api/analytics/users
GET /api/analytics/documents
GET /api/analytics/api-usage
GET /api/analytics/costs
```

#### **Business Intelligence**
```javascript
GET /api/analytics/dashboard
POST /api/analytics/reports/generate
GET /api/analytics/insights
GET /api/analytics/forecasts
POST /api/analytics/custom-query
GET /api/analytics/export/:format
```

### **Performance Monitoring** (`routes/performance.js` - 13KB, 463 lines)

#### **System Performance**
```javascript
GET /api/performance/metrics
GET /api/performance/health
GET /api/performance/uptime
GET /api/performance/errors
POST /api/performance/benchmark
GET /api/performance/alerts
```

---

## 💳 **Payments & Subscriptions**

### **Payment Routes** (`routes/payments.js` - 14KB, 607 lines)

#### **Stripe Integration**
```javascript
POST /api/payments/create-intent
POST /api/payments/confirm
GET /api/payments/methods
POST /api/payments/methods/add
DELETE /api/payments/methods/:methodId
POST /api/payments/refund
```

#### **Subscription Management**
```javascript
POST /api/subscriptions/create
GET /api/subscriptions/current
PUT /api/subscriptions/update
POST /api/subscriptions/cancel
POST /api/subscriptions/reactivate
GET /api/subscriptions/invoices
```

### **Subscription Routes** (`routes/subscriptions.js` - 19KB, 694 lines)

#### **Plan Management**
```javascript
GET /api/subscriptions/plans
POST /api/subscriptions/upgrade
POST /api/subscriptions/downgrade
GET /api/subscriptions/usage
POST /api/subscriptions/add-ons
GET /api/subscriptions/billing-history
```

---

## 🔌 **Webhooks & Real-time**

### **Webhook Routes** (`routes/webhooks.js` - 18KB, 701 lines)

#### **Webhook Management**
```javascript
POST /api/webhooks/create
GET /api/webhooks/list
PUT /api/webhooks/:webhookId/update
DELETE /api/webhooks/:webhookId
POST /api/webhooks/:webhookId/test
GET /api/webhooks/:webhookId/logs
```

#### **Event Processing**
```javascript
POST /api/webhooks/stripe
POST /api/webhooks/salesforce
POST /api/webhooks/microsoft
POST /api/webhooks/google
POST /api/webhooks/slack
POST /api/webhooks/custom/:endpoint
```

---

## 🚀 **Deployment & DevOps**

### **Deployment Routes** (`routes/deployment.js` - 16KB, 566 lines)

#### **Environment Management**
```javascript
GET /api/deployment/environments
POST /api/deployment/deploy
GET /api/deployment/status
POST /api/deployment/rollback
GET /api/deployment/logs
POST /api/deployment/health-check
```

#### **Configuration Management**
```javascript
GET /api/deployment/config
PUT /api/deployment/config/update
POST /api/deployment/config/validate
GET /api/deployment/secrets
PUT /api/deployment/secrets/rotate
```

---

## 🔧 **Plugin Architecture**

### **Plugin Routes** (`routes/plugins.js` - 14KB, 601 lines)

#### **Plugin Management**
```javascript
GET /api/plugins/available
POST /api/plugins/install
PUT /api/plugins/:pluginId/enable
DELETE /api/plugins/:pluginId/uninstall
GET /api/plugins/:pluginId/config
POST /api/plugins/:pluginId/execute
```

#### **Custom Plugins**
```javascript
POST /api/plugins/upload
POST /api/plugins/validate
GET /api/plugins/marketplace
POST /api/plugins/publish
GET /api/plugins/reviews
```

---

## 👤 **User Management**

### **User Routes** (`routes/users.js` - 12KB, 491 lines)

#### **User Profile Management**
```javascript
GET /api/users/profile
PUT /api/users/profile/update
POST /api/users/avatar/upload
DELETE /api/users/account
GET /api/users/preferences
PUT /api/users/preferences/update
```

#### **User Administration**
```javascript
GET /api/users/list
PUT /api/users/:userId/status
POST /api/users/:userId/impersonate
GET /api/users/:userId/activity
POST /api/users/bulk-operations
```

---

## 📋 **Templates & Workflows**

### **Template Routes** (`routes/templates.js` - 18KB, 652 lines)

#### **Template Management**
```javascript
GET /api/templates/list
POST /api/templates/create
PUT /api/templates/:templateId/update
DELETE /api/templates/:templateId
POST /api/templates/:templateId/apply
GET /api/templates/categories
```

#### **Workflow Automation**
```javascript
POST /api/templates/workflows/create
GET /api/templates/workflows/list
PUT /api/templates/workflows/:workflowId
POST /api/templates/workflows/:workflowId/execute
GET /api/templates/workflows/:workflowId/history
```

---

## ⚡ **Real-time Services**

### **WebSocket Events**
```javascript
// Connection Events
'connection' - Client connected
'disconnect' - Client disconnected
'authenticate' - User authentication

// Document Processing Events
'document:upload' - Document uploaded
'document:processing' - Processing started
'document:progress' - Processing progress update
'document:completed' - Processing completed
'document:error' - Processing error

// Team Events
'team:member-joined' - New team member
'team:member-left' - Member left team
'team:role-changed' - Role updated
'team:settings-updated' - Team settings changed

// System Events
'system:maintenance' - Maintenance mode
'system:alert' - System alert
'system:update' - System update available
```

---

## 🔍 **Ephemeral Processing**

### **Ephemeral Routes** (`routes/ephemeral.js` - 11KB, 455 lines)

#### **Temporary Processing**
```javascript
POST /api/ephemeral/process
GET /api/ephemeral/:sessionId/status
DELETE /api/ephemeral/:sessionId/cleanup
POST /api/ephemeral/batch-process
GET /api/ephemeral/sessions/active
```

---

## 📈 **Performance Metrics**

### **API Performance**
- **Average Response Time**: < 200ms for standard endpoints
- **Throughput**: 10,000+ requests per minute
- **Uptime**: 99.99% availability target
- **Error Rate**: < 0.1% for production endpoints

### **Processing Performance**
- **File Upload**: Up to 100MB per file
- **Batch Processing**: 1000+ files simultaneously
- **Real-time Updates**: < 100ms latency
- **Background Jobs**: 10,000+ jobs per hour

---

## 🛠️ **Development Guide**

### **Local Development Setup**

#### **Prerequisites**
```bash
# Install dependencies
npm install

# Set up environment variables
cp env.example .env

# Start development server
npm run dev

# Run tests
npm test
```

#### **Environment Configuration**
```bash
# Database
DATABASE_URL=postgresql://localhost:5432/proofpix
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d

# File Storage
AWS_S3_BUCKET=proofpix-files
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# External Services
STRIPE_SECRET_KEY=sk_test_...
SENDGRID_API_KEY=SG...
```

### **API Testing**

#### **Authentication Testing**
```javascript
// Test user registration
POST /api/auth/register
{
  "email": "test@example.com",
  "password": "securePassword123",
  "firstName": "Test",
  "lastName": "User"
}

// Test login
POST /api/auth/login
{
  "email": "test@example.com",
  "password": "securePassword123"
}
```

#### **File Processing Testing**
```javascript
// Test file upload
POST /api/files/upload
Content-Type: multipart/form-data
{
  file: [binary data],
  options: {
    processImmediately: true,
    extractMetadata: true
  }
}
```

---

## 🚨 **Error Handling**

### **Standard Error Responses**
```javascript
// Validation Error (400)
{
  "error": "VALIDATION_ERROR",
  "message": "Invalid input data",
  "details": {
    "field": "email",
    "issue": "Invalid email format"
  }
}

// Authentication Error (401)
{
  "error": "UNAUTHORIZED",
  "message": "Invalid or expired token"
}

// Permission Error (403)
{
  "error": "FORBIDDEN",
  "message": "Insufficient permissions"
}

// Not Found Error (404)
{
  "error": "NOT_FOUND",
  "message": "Resource not found"
}

// Rate Limit Error (429)
{
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests",
  "retryAfter": 60
}

// Server Error (500)
{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "An unexpected error occurred",
  "requestId": "req_123456789"
}
```

### **Error Monitoring**
- **Error Tracking**: Comprehensive error logging and tracking
- **Performance Monitoring**: Real-time performance metrics
- **Alert System**: Automated alerts for critical issues
- **Health Checks**: Regular system health monitoring

---

## 🔒 **Security Features**

### **Authentication Security**
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Request rate limiting per IP/user
- **CORS Protection**: Cross-origin request security

### **Data Security**
- **Input Validation**: Comprehensive input sanitization
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Content Security Policy headers
- **HTTPS Enforcement**: TLS 1.3 encryption

### **API Security**
- **API Key Authentication**: Secure API key management
- **Request Signing**: HMAC request signing
- **IP Whitelisting**: IP-based access control
- **Audit Logging**: Comprehensive audit trails

---

## 📚 **Additional Resources**

### **Related Documentation**
- [Enterprise Integrations Guide](../enterprise/enterprise-integrations-technical-guide.md)
- [Security & Compliance Guide](../security/security-compliance-technical-guide.md)
- [API Reference](../api/comprehensive-api-documentation.md)
- [Deployment Guide](./deployment-infrastructure-guide.md)

### **External Resources**
- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)
- [Socket.io Documentation](https://socket.io/docs/)

---

**Last Updated**: December 2024  
**Version**: 2.0  
**Maintainer**: ProofPix Backend Team 