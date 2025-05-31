# ProofPix Enterprise Backend

## 🚀 Authentication & User Management System

This is the enterprise-grade backend system for ProofPix, implementing comprehensive authentication, user management, and security features.

## ✅ PRIORITY 1 - AUTHENTICATION & USER MANAGEMENT (COMPLETED)

### Features Implemented

#### 🔐 JWT-Based Authentication
- **Production-ready JWT tokens** with access/refresh token pattern
- **Secure token generation** with configurable expiration times
- **Token refresh mechanism** for seamless user experience
- **Automatic token validation** middleware

#### 👤 User Registration & Login
- **Email/password registration** with strong password requirements
- **Email verification** with secure token-based verification
- **Login with 2FA support** for enhanced security
- **Account lockout protection** after failed attempts

#### 🔒 Multi-Factor Authentication (2FA)
- **TOTP-based 2FA** using Google Authenticator/Authy
- **QR code generation** for easy setup
- **Backup codes** for account recovery
- **2FA enable/disable** with password confirmation

#### 📧 Email System
- **Professional email templates** for verification, password reset, welcome, and security alerts
- **SMTP configuration** with Gmail/custom SMTP support
- **Template-based email system** with variable substitution
- **Email verification workflow** with expiring tokens

#### 🛡️ Security Features
- **Password hashing** with bcrypt (12 rounds)
- **Rate limiting** on authentication endpoints
- **Account lockout** after failed login attempts
- **Session management** with database and Redis caching
- **Audit logging** for all security events
- **Client fingerprinting** for suspicious activity detection

#### 📊 Session Management
- **Database-backed sessions** with PostgreSQL
- **Redis caching** for performance (optional)
- **Session invalidation** on logout/security events
- **Multi-device session tracking**
- **Suspicious activity detection**

#### 🔍 Audit & Monitoring
- **Comprehensive audit logging** for all user actions
- **Security event tracking** with risk levels
- **Client information extraction** (IP, browser, device)
- **Suspicious pattern detection**
- **Winston-based logging** with file and console output

### Database Schema

#### Users Table
```sql
- id (UUID, Primary Key)
- email (Unique, Verified)
- password_hash (bcrypt)
- first_name, last_name
- company, job_title, phone
- subscription_tier (free/professional/enterprise)
- email_verified, email_verification_token
- two_factor_enabled, two_factor_secret, backup_codes
- password_reset_token, password_reset_expires
- login_attempts, locked_until
- last_login, created_at, updated_at
- GDPR compliance fields
- Audit trail fields
```

#### Sessions Table
```sql
- id (UUID, Primary Key)
- user_id (Foreign Key)
- session_token, refresh_token
- ip_address, user_agent
- device_type, browser, os
- location_country, location_city
- created_at, last_activity, expires_at
- is_active
```

#### Audit Logs Table
```sql
- id (UUID, Primary Key)
- user_id (Foreign Key, Optional)
- event_type, event_category
- event_description
- resource_type, resource_id
- ip_address, user_agent
- risk_level (low/medium/high)
- metadata (JSONB)
- created_at
```

### API Endpoints

#### Authentication Routes (`/api/auth`)
- `POST /register` - User registration with email verification
- `POST /login` - Login with optional 2FA
- `POST /verify-email` - Email verification
- `POST /forgot-password` - Password reset request
- `POST /reset-password` - Password reset completion
- `POST /logout` - Session invalidation
- `POST /refresh-token` - Token refresh

#### 2FA Routes
- `POST /setup-2fa` - Initialize 2FA setup
- `POST /enable-2fa` - Enable 2FA with verification
- `POST /disable-2fa` - Disable 2FA with password + token

#### Profile Routes
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile

### Security Middleware

#### Authentication Middleware
- `authenticateToken` - JWT token validation
- `requireAuth` - Require valid authentication
- `requireSubscription(tier)` - Subscription tier access control
- `optionalAuth` - Optional authentication
- `verifyRefreshToken` - Refresh token validation

#### Rate Limiting
- **Global rate limiting**: 1000 requests per 15 minutes
- **Auth endpoints**: 5 attempts per 15 minutes
- **Sensitive operations**: 3 attempts per hour

### Environment Configuration

```env
# Server
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=proofpix
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@proofpix.com

# Redis (Optional)
REDIS_URL=redis://localhost:6379
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for session caching)

### Installation

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Set up environment**
```bash
cp env.example .env
# Edit .env with your configuration
```

3. **Set up database**
```bash
# Create PostgreSQL database
createdb proofpix

# Run migrations
npm run migrate
```

4. **Start development server**
```bash
npm run dev
```

### Database Migrations

```bash
# Run all pending migrations
npm run migrate

# Check migration status
node database/migrate.js status

# Rollback last migration (development only)
node database/migrate.js rollback
```

## 📋 Next Implementation Priorities

### PRIORITY 2 - DATABASE & DATA LAYER (COMPLETED)

### Features Implemented

#### 🗄️ Advanced Database Configuration
- **PostgreSQL connection pooling** with performance monitoring
- **Database health checks** and automatic reconnection
- **Query performance optimization** with indexing strategies
- **Connection pool management** with configurable limits

#### 📊 Comprehensive Data Models
- **Subscriptions management** with Stripe integration
- **Usage tracking** with quotas and billing cycles
- **Analytics data collection** for user behavior insights
- **File metadata storage** with processing status
- **API key management** for enterprise access
- **Billing and transaction history**

#### 🏗️ Repository Pattern Implementation
- **BaseRepository** with common database operations
- **Specialized repositories** for each data model
- **Query builders** for complex database operations
- **Transaction management** for data consistency

#### 📈 Performance Optimizations
- **Materialized views** for analytics aggregation
- **Database indexes** for query performance
- **PostgreSQL functions** for complex operations
- **Connection pooling** with monitoring

### PRIORITY 3 - PAYMENT SYSTEM (COMPLETED)

### Features Implemented

#### 💳 Stripe Integration
- **Complete Stripe service** with customer management
- **Subscription lifecycle management** (create, update, cancel)
- **Payment method handling** with secure tokenization
- **Invoice management** and usage-based billing
- **Proration handling** for plan changes
- **Revenue analytics** and reporting

#### 🔄 Webhook Processing
- **Comprehensive webhook handling** for all Stripe events
- **Event verification** with signature validation
- **Idempotent processing** to prevent duplicate actions
- **Error handling** and retry mechanisms
- **Audit logging** for all payment events

#### 📊 Billing Management
- **Multi-tier subscription plans** (Free, Starter, Professional, Enterprise)
- **Usage-based billing** with quota enforcement
- **Billing portal integration** for customer self-service
- **Invoice generation** and payment tracking
- **Dunning management** for failed payments

#### 🎯 Quota Management
- **Real-time quota checking** before operations
- **Usage tracking** with automatic billing
- **Feature access control** based on subscription tier
- **Overage handling** and notifications
- **Quota enforcement middleware**

#### 💰 Revenue Analytics
- **Revenue reporting** with detailed breakdowns
- **Subscription metrics** (MRR, churn, growth)
- **Customer lifetime value** calculations
- **Payment success rates** and failure analysis

### Payment API Endpoints (`/api/payments`)
- `GET /plans` - Available subscription plans
- `POST /subscribe` - Create new subscription
- `PUT /subscription` - Update subscription
- `DELETE /subscription` - Cancel subscription
- `GET /subscription` - Get current subscription
- `POST /payment-method` - Add payment method
- `GET /invoices` - List customer invoices
- `POST /billing-portal` - Create billing portal session
- `POST /webhook` - Stripe webhook endpoint

### PRIORITY 4 - SECURITY & COMPLIANCE (COMPLETED)

### Features Implemented

#### 🛡️ Advanced Security Monitoring
- **Real-time threat detection** with pattern matching
- **SQL injection protection** with input validation
- **XSS prevention** with content sanitization
- **Path traversal detection** and blocking
- **Command injection prevention**
- **Brute force detection** with automatic IP blocking

#### 🚨 Incident Management
- **Automated security response** based on threat severity
- **Security incident logging** with detailed forensics
- **IP blocking** with configurable duration
- **Rate limit overrides** for suspicious activity
- **Enhanced monitoring** for flagged IPs
- **Security alerting** system integration

#### 📋 GDPR Compliance
- **Data subject rights** implementation (Articles 15-20)
- **Right of access** with complete data export
- **Right to rectification** with data correction
- **Right to erasure** (right to be forgotten)
- **Data portability** with structured export
- **Consent management** with withdrawal tracking

#### 🔒 Privacy & Compliance
- **Data retention policies** with automatic enforcement
- **Compliance logging** for audit trails
- **Data processing activities** documentation (Article 30)
- **User consent tracking** with legal basis
- **CCPA compliance** support
- **Privacy impact assessments**

#### 📊 Security Reporting
- **Security metrics dashboard** with real-time data
- **Compliance reports** for regulatory requirements
- **Security health checks** with recommendations
- **Incident response tracking**
- **Threat intelligence** aggregation

### Security API Endpoints (`/api/security`)

#### Security Monitoring (Admin Only)
- `GET /metrics` - Security metrics and statistics
- `GET /incidents` - Security incident list
- `GET /incidents/:id` - Specific incident details
- `PUT /incidents/:id` - Update incident status
- `GET /reports` - Generate security reports
- `GET /health-check` - Security health assessment

#### IP Management (Admin Only)
- `GET /blocked-ips` - List blocked IP addresses
- `POST /block-ip` - Block IP address manually
- `DELETE /block-ip/:ip` - Unblock IP address

#### GDPR Compliance
- `POST /gdpr/access-request` - Submit data access request
- `POST /gdpr/rectification-request` - Submit data correction request
- `POST /gdpr/erasure-request` - Submit data deletion request
- `POST /gdpr/portability-request` - Submit data export request

#### Consent Management
- `GET /consents` - Get user consent history
- `POST /consents` - Record new consent
- `DELETE /consents/:type` - Withdraw consent

#### Compliance Reporting (Admin Only)
- `GET /compliance/reports` - Generate compliance reports
- `GET /compliance/requests` - List data subject requests
- `POST /compliance/enforce-retention` - Enforce data retention
- `GET /compliance/retention-policies` - List retention policies

### Security Database Schema

#### Security Incidents Table
```sql
- incident_id (UUID, Primary Key)
- ip_address, user_agent, url, method
- threats (JSONB array)
- severity (low/medium/high/critical)
- status (detected/investigating/resolved/false_positive)
- resolution details and timestamps
```

#### Blocked IPs Table
```sql
- ip_address (Primary Key)
- reason, blocked_at, expires_at
- unblock reason and audit trail
```

#### Compliance Logs Table
```sql
- compliance_type (gdpr/ccpa/etc.)
- action, user_id, details (JSONB)
- data_subject_id for GDPR tracking
- audit timestamps
```

#### Data Subject Requests Table
```sql
- request_id (UUID)
- user_id, request_type, regulation
- status, request_details, response_data
- processing timestamps
```

### Security Middleware

#### Threat Detection
- `securityMonitoring` - Real-time threat detection
- `blockMaliciousIPs` - IP blocking enforcement
- `quotaAndTrack` - Usage quota with tracking

#### Compliance
- `gdprCompliance` - GDPR compliance tracking
- `consentValidation` - Consent requirement enforcement
- `dataRetention` - Automatic data cleanup

## 🔧 Complete System Architecture

### Technology Stack
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with connection pooling
- **Caching**: Redis for sessions and performance
- **Payments**: Stripe for subscription management
- **Security**: JWT, bcrypt, rate limiting, threat detection
- **Compliance**: GDPR, CCPA, data retention automation
- **Monitoring**: Winston logging, audit trails, security metrics

### Production Deployment
- **Environment**: Railway PostgreSQL, Heroku/Vercel deployment
- **Security**: HTTPS enforcement, security headers, CORS
- **Monitoring**: Health checks, performance metrics, error tracking
- **Compliance**: Automated data retention, audit logging
- **Scalability**: Connection pooling, Redis caching, optimized queries

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for session caching)

### Installation

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Set up environment**
```bash
cp env.example .env
# Edit .env with your configuration
```

3. **Set up database**
```bash
# Create PostgreSQL database
createdb proofpix

# Run migrations
npm run migrate
```

4. **Start development server**
```bash
npm run dev
```

### Database Migrations

```bash
# Run all pending migrations
npm run migrate

# Check migration status
node database/migrate.js status

# Rollback last migration (development only)
node database/migrate.js rollback
```

## 📋 Next Implementation Priorities

### PRIORITY 2 - DATABASE & DATA LAYER (COMPLETED)

### Features Implemented

#### 🗄️ Advanced Database Configuration
- **PostgreSQL connection pooling** with performance monitoring
- **Database health checks** and automatic reconnection
- **Query performance optimization** with indexing strategies
- **Connection pool management** with configurable limits

#### 📊 Comprehensive Data Models
- **Subscriptions management** with Stripe integration
- **Usage tracking** with quotas and billing cycles
- **Analytics data collection** for user behavior insights
- **File metadata storage** with processing status
- **API key management** for enterprise access
- **Billing and transaction history**

#### 🏗️ Repository Pattern Implementation
- **BaseRepository** with common database operations
- **Specialized repositories** for each data model
- **Query builders** for complex database operations
- **Transaction management** for data consistency

#### 📈 Performance Optimizations
- **Materialized views** for analytics aggregation
- **Database indexes** for query performance
- **PostgreSQL functions** for complex operations
- **Connection pooling** with monitoring

### PRIORITY 3 - PAYMENT SYSTEM (COMPLETED)

### Features Implemented

#### 💳 Stripe Integration
- **Complete Stripe service** with customer management
- **Subscription lifecycle management** (create, update, cancel)
- **Payment method handling** with secure tokenization
- **Invoice management** and usage-based billing
- **Proration handling** for plan changes
- **Revenue analytics** and reporting

#### 🔄 Webhook Processing
- **Comprehensive webhook handling** for all Stripe events
- **Event verification** with signature validation
- **Idempotent processing** to prevent duplicate actions
- **Error handling** and retry mechanisms
- **Audit logging** for all payment events

#### 📊 Billing Management
- **Multi-tier subscription plans** (Free, Starter, Professional, Enterprise)
- **Usage-based billing** with quota enforcement
- **Billing portal integration** for customer self-service
- **Invoice generation** and payment tracking
- **Dunning management** for failed payments

#### 🎯 Quota Management
- **Real-time quota checking** before operations
- **Usage tracking** with automatic billing
- **Feature access control** based on subscription tier
- **Overage handling** and notifications
- **Quota enforcement middleware**

#### 💰 Revenue Analytics
- **Revenue reporting** with detailed breakdowns
- **Subscription metrics** (MRR, churn, growth)
- **Customer lifetime value** calculations
- **Payment success rates** and failure analysis

### Payment API Endpoints (`/api/payments`)
- `GET /plans` - Available subscription plans
- `POST /subscribe` - Create new subscription
- `PUT /subscription` - Update subscription
- `DELETE /subscription` - Cancel subscription
- `GET /subscription` - Get current subscription
- `POST /payment-method` - Add payment method
- `GET /invoices` - List customer invoices
- `POST /billing-portal` - Create billing portal session
- `POST /webhook` - Stripe webhook endpoint

### PRIORITY 4 - SECURITY & COMPLIANCE (COMPLETED)

### Features Implemented

#### 🛡️ Advanced Security Monitoring
- **Real-time threat detection** with pattern matching
- **SQL injection protection** with input validation
- **XSS prevention** with content sanitization
- **Path traversal detection** and blocking
- **Command injection prevention**
- **Brute force detection** with automatic IP blocking

#### 🚨 Incident Management
- **Automated security response** based on threat severity
- **Security incident logging** with detailed forensics
- **IP blocking** with configurable duration
- **Rate limit overrides** for suspicious activity
- **Enhanced monitoring** for flagged IPs
- **Security alerting** system integration

#### 📋 GDPR Compliance
- **Data subject rights** implementation (Articles 15-20)
- **Right of access** with complete data export
- **Right to rectification** with data correction
- **Right to erasure** (right to be forgotten)
- **Data portability** with structured export
- **Consent management** with withdrawal tracking

#### 🔒 Privacy & Compliance
- **Data retention policies** with automatic enforcement
- **Compliance logging** for audit trails
- **Data processing activities** documentation (Article 30)
- **User consent tracking** with legal basis
- **CCPA compliance** support
- **Privacy impact assessments**

#### 📊 Security Reporting
- **Security metrics dashboard** with real-time data
- **Compliance reports** for regulatory requirements
- **Security health checks** with recommendations
- **Incident response tracking**
- **Threat intelligence** aggregation

### Security API Endpoints (`/api/security`)

#### Security Monitoring (Admin Only)
- `GET /metrics` - Security metrics and statistics
- `GET /incidents` - Security incident list
- `GET /incidents/:id` - Specific incident details
- `PUT /incidents/:id` - Update incident status
- `GET /reports` - Generate security reports
- `GET /health-check` - Security health assessment

#### IP Management (Admin Only)
- `GET /blocked-ips` - List blocked IP addresses
- `POST /block-ip` - Block IP address manually
- `DELETE /block-ip/:ip` - Unblock IP address

#### GDPR Compliance
- `POST /gdpr/access-request` - Submit data access request
- `POST /gdpr/rectification-request` - Submit data correction request
- `POST /gdpr/erasure-request` - Submit data deletion request
- `POST /gdpr/portability-request` - Submit data export request

#### Consent Management
- `GET /consents` - Get user consent history
- `POST /consents` - Record new consent
- `DELETE /consents/:type` - Withdraw consent

#### Compliance Reporting (Admin Only)
- `GET /compliance/reports` - Generate compliance reports
- `GET /compliance/requests` - List data subject requests
- `POST /compliance/enforce-retention` - Enforce data retention
- `GET /compliance/retention-policies` - List retention policies

### Security Database Schema

#### Security Incidents Table
```sql
- incident_id (UUID, Primary Key)
- ip_address, user_agent, url, method
- threats (JSONB array)
- severity (low/medium/high/critical)
- status (detected/investigating/resolved/false_positive)
- resolution details and timestamps
```

#### Blocked IPs Table
```sql
- ip_address (Primary Key)
- reason, blocked_at, expires_at
- unblock reason and audit trail
```

#### Compliance Logs Table
```sql
- compliance_type (gdpr/ccpa/etc.)
- action, user_id, details (JSONB)
- data_subject_id for GDPR tracking
- audit timestamps
```

#### Data Subject Requests Table
```sql
- request_id (UUID)
- user_id, request_type, regulation
- status, request_details, response_data
- processing timestamps
```

### Security Middleware

#### Threat Detection
- `securityMonitoring` - Real-time threat detection
- `blockMaliciousIPs` - IP blocking enforcement
- `quotaAndTrack` - Usage quota with tracking

#### Compliance
- `gdprCompliance` - GDPR compliance tracking
- `consentValidation` - Consent requirement enforcement
- `dataRetention` - Automatic data cleanup

## 🔧 Complete System Architecture

### Technology Stack
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with connection pooling
- **Caching**: Redis for sessions and performance
- **Payments**: Stripe for subscription management
- **Security**: JWT, bcrypt, rate limiting, threat detection
- **Compliance**: GDPR, CCPA, data retention automation
- **Monitoring**: Winston logging, audit trails, security metrics

### Production Deployment
- **Environment**: Railway PostgreSQL, Heroku/Vercel deployment
- **Security**: HTTPS enforcement, security headers, CORS
- **Monitoring**: Health checks, performance metrics, error tracking
- **Compliance**: Automated data retention, audit logging
- **Scalability**: Connection pooling, Redis caching, optimized queries

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for session caching)

### Installation

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Set up environment**
```bash
cp env.example .env
# Edit .env with your configuration
```

3. **Set up database**
```bash
# Create PostgreSQL database
createdb proofpix

# Run migrations
npm run migrate
```

4. **Start development server**
```bash
npm run dev
```

### Database Migrations

```bash
# Run all pending migrations
npm run migrate

# Check migration status
node database/migrate.js status

# Rollback last migration (development only)
node database/migrate.js rollback
```

## 📋 Next Implementation Priorities

### PRIORITY 2 - DATABASE & DATA LAYER (COMPLETED)

### Features Implemented

#### 🗄️ Advanced Database Configuration
- **PostgreSQL connection pooling** with performance monitoring
- **Database health checks** and automatic reconnection
- **Query performance optimization** with indexing strategies
- **Connection pool management** with configurable limits

#### 📊 Comprehensive Data Models
- **Subscriptions management** with Stripe integration
- **Usage tracking** with quotas and billing cycles
- **Analytics data collection** for user behavior insights
- **File metadata storage** with processing status
- **API key management** for enterprise access
- **Billing and transaction history**

#### 🏗️ Repository Pattern Implementation
- **BaseRepository** with common database operations
- **Specialized repositories** for each data model
- **Query builders** for complex database operations
- **Transaction management** for data consistency

#### 📈 Performance Optimizations
- **Materialized views** for analytics aggregation
- **Database indexes** for query performance
- **PostgreSQL functions** for complex operations
- **Connection pooling** with monitoring

### PRIORITY 3 - PAYMENT SYSTEM (COMPLETED)

### Features Implemented

#### 💳 Stripe Integration
- **Complete Stripe service** with customer management
- **Subscription lifecycle management** (create, update, cancel)
- **Payment method handling** with secure tokenization
- **Invoice management** and usage-based billing
- **Proration handling** for plan changes
- **Revenue analytics** and reporting

#### 🔄 Webhook Processing
- **Comprehensive webhook handling** for all Stripe events
- **Event verification** with signature validation
- **Idempotent processing** to prevent duplicate actions
- **Error handling** and retry mechanisms
- **Audit logging** for all payment events

#### 📊 Billing Management
- **Multi-tier subscription plans** (Free, Starter, Professional, Enterprise)
- **Usage-based billing** with quota enforcement
- **Billing portal integration** for customer self-service
- **Invoice generation** and payment tracking
- **Dunning management** for failed payments

#### 🎯 Quota Management
- **Real-time quota checking** before operations
- **Usage tracking** with automatic billing
- **Feature access control** based on subscription tier
- **Overage handling** and notifications
- **Quota enforcement middleware**

#### 💰 Revenue Analytics
- **Revenue reporting** with detailed breakdowns
- **Subscription metrics** (MRR, churn, growth)
- **Customer lifetime value** calculations
- **Payment success rates** and failure analysis

### Payment API Endpoints (`/api/payments`)
- `GET /plans` - Available subscription plans
- `POST /subscribe` - Create new subscription
- `PUT /subscription` - Update subscription
- `DELETE /subscription` - Cancel subscription
- `GET /subscription` - Get current subscription
- `POST /payment-method` - Add payment method
- `GET /invoices` - List customer invoices
- `POST /billing-portal` - Create billing portal session
- `POST /webhook` - Stripe webhook endpoint

### PRIORITY 4 - SECURITY & COMPLIANCE (COMPLETED)

### Features Implemented

#### 🛡️ Advanced Security Monitoring
- **Real-time threat detection** with pattern matching
- **SQL injection protection** with input validation
- **XSS prevention** with content sanitization
- **Path traversal detection** and blocking
- **Command injection prevention**
- **Brute force detection** with automatic IP blocking

#### 🚨 Incident Management
- **Automated security response** based on threat severity
- **Security incident logging** with detailed forensics
- **IP blocking** with configurable duration
- **Rate limit overrides** for suspicious activity
- **Enhanced monitoring** for flagged IPs
- **Security alerting** system integration

#### 📋 GDPR Compliance
- **Data subject rights** implementation (Articles 15-20)
- **Right of access** with complete data export
- **Right to rectification** with data correction
- **Right to erasure** (right to be forgotten)
- **Data portability** with structured export
- **Consent management** with withdrawal tracking

#### 🔒 Privacy & Compliance
- **Data retention policies** with automatic enforcement
- **Compliance logging** for audit trails
- **Data processing activities** documentation (Article 30)
- **User consent tracking** with legal basis
- **CCPA compliance** support
- **Privacy impact assessments**

#### 📊 Security Reporting
- **Security metrics dashboard** with real-time data
- **Compliance reports** for regulatory requirements
- **Security health checks** with recommendations
- **Incident response tracking**
- **Threat intelligence** aggregation

### Security API Endpoints (`/api/security`)

#### Security Monitoring (Admin Only)
- `GET /metrics` - Security metrics and statistics
- `GET /incidents` - Security incident list
- `GET /incidents/:id` - Specific incident details
- `PUT /incidents/:id` - Update incident status
- `GET /reports` - Generate security reports
- `GET /health-check` - Security health assessment

#### IP Management (Admin Only)
- `GET /blocked-ips` - List blocked IP addresses
- `POST /block-ip` - Block IP address manually
- `DELETE /block-ip/:ip` - Unblock IP address

#### GDPR Compliance
- `POST /gdpr/access-request` - Submit data access request
- `POST /gdpr/rectification-request` - Submit data correction request
- `POST /gdpr/erasure-request` - Submit data deletion request
- `POST /gdpr/portability-request` - Submit data export request

#### Consent Management
- `GET /consents` - Get user consent history
- `POST /consents` - Record new consent
- `DELETE /consents/:type` - Withdraw consent

#### Compliance Reporting (Admin Only)
- `GET /compliance/reports` - Generate compliance reports
- `GET /compliance/requests` - List data subject requests
- `POST /compliance/enforce-retention` - Enforce data retention
- `GET /compliance/retention-policies` - List retention policies

### Security Database Schema

#### Security Incidents Table
```sql
- incident_id (UUID, Primary Key)
- ip_address, user_agent, url, method
- threats (JSONB array)
- severity (low/medium/high/critical)
- status (detected/investigating/resolved/false_positive)
- resolution details and timestamps
```

#### Blocked IPs Table
```sql
- ip_address (Primary Key)
- reason, blocked_at, expires_at
- unblock reason and audit trail
```

#### Compliance Logs Table
```sql
- compliance_type (gdpr/ccpa/etc.)
- action, user_id, details (JSONB)
- data_subject_id for GDPR tracking
- audit timestamps
```

#### Data Subject Requests Table
```sql
- request_id (UUID)
- user_id, request_type, regulation
- status, request_details, response_data
- processing timestamps
```

### Security Middleware

#### Threat Detection
- `securityMonitoring` - Real-time threat detection
- `blockMaliciousIPs` - IP blocking enforcement
- `quotaAndTrack` - Usage quota with tracking

#### Compliance
- `gdprCompliance` - GDPR compliance tracking
- `consentValidation` - Consent requirement enforcement
- `dataRetention` - Automatic data cleanup

## 🔧 Complete System Architecture

### Technology Stack
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with connection pooling
- **Caching**: Redis for sessions and performance
- **Payments**: Stripe for subscription management
- **Security**: JWT, bcrypt, rate limiting, threat detection
- **Compliance**: GDPR, CCPA, data retention automation
- **Monitoring**: Winston logging, audit trails, security metrics

### Production Deployment
- **Environment**: Railway PostgreSQL, Heroku/Vercel deployment
- **Security**: HTTPS enforcement, security headers, CORS
- **Monitoring**: Health checks, performance metrics, error tracking
- **Compliance**: Automated data retention, audit logging
- **Scalability**: Connection pooling, Redis caching, optimized queries

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for session caching)

### Installation

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Set up environment**
```bash
cp env.example .env
# Edit .env with your configuration
```

3. **Set up database**
```bash
# Create PostgreSQL database
createdb proofpix

# Run migrations
npm run migrate
```

4. **Start development server**
```bash
npm run dev
```

### Database Migrations

```bash
# Run all pending migrations
npm run migrate

# Check migration status
node database/migrate.js status

# Rollback last migration (development only)
node database/migrate.js rollback
```

## 📋 Next Implementation Priorities

### PRIORITY 2 - DATABASE & DATA LAYER (COMPLETED)

### Features Implemented

#### 🗄️ Advanced Database Configuration
- **PostgreSQL connection pooling** with performance monitoring
- **Database health checks** and automatic reconnection
- **Query performance optimization** with indexing strategies
- **Connection pool management** with configurable limits

#### 📊 Comprehensive Data Models
- **Subscriptions management** with Stripe integration
- **Usage tracking** with quotas and billing cycles
- **Analytics data collection** for user behavior insights
- **File metadata storage** with processing status
- **API key management** for enterprise access
- **Billing and transaction history**

#### 🏗️ Repository Pattern Implementation
- **BaseRepository** with common database operations
- **Specialized repositories** for each data model
- **Query builders** for complex database operations
- **Transaction management** for data consistency

#### 📈 Performance Optimizations
- **Materialized views** for analytics aggregation
- **Database indexes** for query performance
- **PostgreSQL functions** for complex operations
- **Connection pooling** with monitoring

### PRIORITY 3 - PAYMENT SYSTEM (COMPLETED)

### Features Implemented

#### 💳 Stripe Integration
- **Complete Stripe service** with customer management
- **Subscription lifecycle management** (create, update, cancel)
- **Payment method handling** with secure tokenization
- **Invoice management** and usage-based billing
- **Proration handling** for plan changes
- **Revenue analytics** and reporting

#### 🔄 Webhook Processing
- **Comprehensive webhook handling** for all Stripe events
- **Event verification** with signature validation
- **Idempotent processing** to prevent duplicate actions
- **Error handling** and retry mechanisms
- **Audit logging** for all payment events

#### 📊 Billing Management
- **Multi-tier subscription plans** (Free, Starter, Professional, Enterprise)
- **Usage-based billing** with quota enforcement
- **Billing portal integration** for customer self-service
- **Invoice generation** and payment tracking
- **Dunning management** for failed payments

#### 🎯 Quota Management
- **Real-time quota checking** before operations
- **Usage tracking** with automatic billing
- **Feature access control** based on subscription tier
- **Overage handling** and notifications
- **Quota enforcement middleware**

#### 💰 Revenue Analytics
- **Revenue reporting** with detailed breakdowns
- **Subscription metrics** (MRR, churn, growth)
- **Customer lifetime value** calculations
- **Payment success rates** and failure analysis

### Payment API Endpoints (`/api/payments`)
- `GET /plans` - Available subscription plans
- `POST /subscribe` - Create new subscription
- `PUT /subscription` - Update subscription
- `DELETE /subscription` - Cancel subscription
- `GET /subscription` - Get current subscription
- `POST /payment-method` - Add payment method
- `GET /invoices` - List customer invoices
- `POST /billing-portal` - Create billing portal session
- `POST /webhook` - Stripe webhook endpoint

### PRIORITY 4 - SECURITY & COMPLIANCE (COMPLETED)

### Features Implemented

#### 🛡️ Advanced Security Monitoring
- **Real-time threat detection** with pattern matching
- **SQL injection protection** with input validation
- **XSS prevention** with content sanitization
- **Path traversal detection** and blocking
- **Command injection prevention**
- **Brute force detection** with automatic IP blocking

#### 🚨 Incident Management
- **Automated security response** based on threat severity
- **Security incident logging** with detailed forensics
- **IP blocking** with configurable duration
- **Rate limit overrides** for suspicious activity
- **Enhanced monitoring** for flagged IPs
- **Security alerting** system integration

#### 📋 GDPR Compliance
- **Data subject rights** implementation (Articles 15-20)
- **Right of access** with complete data export
- **Right to rectification** with data correction
- **Right to erasure** (right to be forgotten)
- **Data portability** with structured export
- **Consent management** with withdrawal tracking

#### 🔒 Privacy & Compliance
- **Data retention policies** with automatic enforcement
- **Compliance logging** for audit trails
- **Data processing activities** documentation (Article 30)
- **User consent tracking** with legal basis
- **CCPA compliance** support
- **Privacy impact assessments**

#### 📊 Security Reporting
- **Security metrics dashboard** with real-time data
- **Compliance reports** for regulatory requirements
- **Security health checks** with recommendations
- **Incident response tracking**
- **Threat intelligence** aggregation

### Security API Endpoints (`/api/security`)

#### Security Monitoring (Admin Only)
- `GET /metrics` - Security metrics and statistics
- `GET /incidents` - Security incident list
- `GET /incidents/:id` - Specific incident details
- `PUT /incidents/:id` - Update incident status
- `GET /reports` - Generate security reports
- `GET /health-check` - Security health assessment

#### IP Management (Admin Only)
- `GET /blocked-ips` - List blocked IP addresses
- `POST /block-ip` - Block IP address manually
- `DELETE /block-ip/:ip` - Unblock IP address

#### GDPR Compliance
- `POST /gdpr/access-request` - Submit data access request
- `POST /gdpr/rectification-request` - Submit data correction request
- `POST /gdpr/erasure-request` - Submit data deletion request
- `POST /gdpr/portability-request` - Submit data export request

#### Consent Management
- `GET /consents` - Get user consent history
- `POST /consents` - Record new consent
- `DELETE /consents/:type` - Withdraw consent

#### Compliance Reporting (Admin Only)
- `GET /compliance/reports` - Generate compliance reports
- `GET /compliance/requests` - List data subject requests
- `POST /compliance/enforce-retention` - Enforce data retention
- `GET /compliance/retention-policies` - List retention policies

### Security Database Schema

#### Security Incidents Table
```sql
- incident_id (UUID, Primary Key)
- ip_address, user_agent, url, method
- threats (JSONB array)
- severity (low/medium/high/critical)
- status (detected/investigating/resolved/false_positive)
- resolution details and timestamps
```

#### Blocked IPs Table
```sql
- ip_address (Primary Key)
- reason, blocked_at, expires_at
- unblock reason and audit trail
```

#### Compliance Logs Table
```sql
- compliance_type (gdpr/ccpa/etc.)
- action, user_id, details (JSONB)
- data_subject_id for GDPR tracking
- audit timestamps
```

#### Data Subject Requests Table
```sql
- request_id (UUID)
- user_id, request_type, regulation
- status, request_details, response_data
- processing timestamps
```

### Security Middleware

#### Threat Detection
- `securityMonitoring` - Real-time threat detection
- `blockMaliciousIPs` - IP blocking enforcement
- `quotaAndTrack` - Usage quota with tracking

#### Compliance
- `gdprCompliance` - GDPR compliance tracking
- `consentValidation` - Consent requirement enforcement
- `dataRetention` - Automatic data cleanup

## 🔧 Complete System Architecture

### Technology Stack
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with connection pooling
- **Caching**: Redis for sessions and performance
- **Payments**: Stripe for subscription management
- **Security**: JWT, bcrypt, rate limiting, threat detection
- **Compliance**: GDPR, CCPA, data retention automation
- **Monitoring**: Winston logging, audit trails, security metrics

### Production Deployment
- **Environment**: Railway PostgreSQL, Heroku/Vercel deployment
- **Security**: HTTPS enforcement, security headers, CORS
- **Monitoring**: Health checks, performance metrics, error tracking
- **Compliance**: Automated data retention, audit logging
- **Scalability**: Connection pooling, Redis caching, optimized queries

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for session caching)

### Installation

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Set up environment**
```bash
cp env.example .env
# Edit .env with your configuration
```

3. **Set up database**
```bash
# Create PostgreSQL database
createdb proofpix

# Run migrations
npm run migrate
```

4. **Start development server**
```bash
npm run dev
```

### Database Migrations

```bash
# Run all pending migrations
npm run migrate

# Check migration status
node database/migrate.js status

# Rollback last migration (development only)
node database/migrate.js rollback
```

## 📋 Next Implementation Priorities

### PRIORITY 2 - DATABASE & DATA LAYER (COMPLETED)

### Features Implemented

#### 🗄️ Advanced Database Configuration
- **PostgreSQL connection pooling** with performance monitoring
- **Database health checks** and automatic reconnection
- **Query performance optimization** with indexing strategies
- **Connection pool management** with configurable limits

#### 📊 Comprehensive Data Models
- **Subscriptions management** with Stripe integration
- **Usage tracking** with quotas and billing cycles
- **Analytics data collection** for user behavior insights
- **File metadata storage** with processing status
- **API key management** for enterprise access
- **Billing and transaction history**

#### 🏗️ Repository Pattern Implementation
- **BaseRepository** with common database operations
- **Specialized repositories** for each data model
- **Query builders** for complex database operations
- **Transaction management** for data consistency

#### 📈 Performance Optimizations
- **Materialized views** for analytics aggregation
- **Database indexes** for query performance
- **PostgreSQL functions** for complex operations
- **Connection pooling** with monitoring

### PRIORITY 3 - PAYMENT SYSTEM (COMPLETED)

### Features Implemented

#### 💳 Stripe Integration
- **Complete Stripe service** with customer management
- **Subscription lifecycle management** (create, update, cancel)
- **Payment method handling** with secure tokenization
- **Invoice management** and usage-based billing
- **Proration handling** for plan changes
- **Revenue analytics** and reporting

#### 🔄 Webhook Processing
- **Comprehensive webhook handling** for all Stripe events
- **Event verification** with signature validation
- **Idempotent processing** to prevent duplicate actions
- **Error handling** and retry mechanisms
- **Audit logging** for all payment events

#### 📊 Billing Management
- **Multi-tier subscription plans** (Free, Starter, Professional, Enterprise)
- **Usage-based billing** with quota enforcement
- **Billing portal integration** for customer self-service
- **Invoice generation** and payment tracking
- **Dunning management** for failed payments

#### 🎯 Quota Management
- **Real-time quota checking** before operations
- **Usage tracking** with automatic billing
- **Feature access control** based on subscription tier
- **Overage handling** and notifications
- **Quota enforcement middleware**

#### 💰 Revenue Analytics
- **Revenue reporting** with detailed breakdowns
- **Subscription metrics** (MRR, churn, growth)
- **Customer lifetime value** calculations
- **Payment success rates** and failure analysis

### Payment API Endpoints (`/api/payments`)
- `GET /plans` - Available subscription plans
- `POST /subscribe` - Create new subscription
- `PUT /subscription` - Update subscription
- `DELETE /subscription` - Cancel subscription
- `GET /subscription` - Get current subscription
- `POST /payment-method` - Add payment method
- `GET /invoices` - List customer invoices
- `POST /billing-portal` - Create billing portal session
- `POST /webhook` - Stripe webhook endpoint

### PRIORITY 4 - SECURITY & COMPLIANCE (COMPLETED)

### Features Implemented

#### 🛡️ Advanced Security Monitoring
- **Real-time threat detection** with pattern matching
- **SQL injection protection** with input validation
- **XSS prevention** with content sanitization
- **Path traversal detection** and blocking
- **Command injection prevention**
- **Brute force detection** with automatic IP blocking

#### 🚨 Incident Management
- **Automated security response** based on threat severity
- **Security incident logging** with detailed forensics
- **IP blocking** with configurable duration
- **Rate limit overrides** for suspicious activity
- **Enhanced monitoring** for flagged IPs
- **Security alerting** system integration

#### 📋 GDPR Compliance
- **Data subject rights** implementation (Articles 15-20)
- **Right of access** with complete data export
- **Right to rectification** with data correction
- **Right to erasure** (right to be forgotten)
- **Data portability** with structured export
- **Consent management** with withdrawal tracking

#### 🔒 Privacy & Compliance
- **Data retention policies** with automatic enforcement
- **Compliance logging** for audit trails
- **Data processing activities** documentation (Article 30)
- **User consent tracking** with legal basis
- **CCPA compliance** support
- **Privacy impact assessments**

#### 📊 Security Reporting
- **Security metrics dashboard** with real-time data
- **Compliance reports** for regulatory requirements
- **Security health checks** with recommendations
- **Incident response tracking**
- **Threat intelligence** aggregation

### Security API Endpoints (`/api/security`)

#### Security Monitoring (Admin Only)
- `GET /metrics` - Security metrics and statistics
- `GET /incidents` - Security incident list
- `GET /incidents/:id` - Specific incident details
- `PUT /incidents/:id` - Update incident status
- `GET /reports` - Generate security reports
- `GET /health-check` - Security health assessment

#### IP Management (Admin Only)
- `GET /blocked-ips` - List blocked IP addresses
- `POST /block-ip` - Block IP address manually
- `DELETE /block-ip/:ip` - Unblock IP address

#### GDPR Compliance
- `POST /gdpr/access-request` - Submit data access request
- `POST /gdpr/rectification-request` - Submit data correction request
- `POST /gdpr/erasure-request` - Submit data deletion request
- `POST /gdpr/portability-request` - Submit data export request

#### Consent Management
- `GET /consents` - Get user consent history
- `POST /consents` - Record new consent
- `DELETE /consents/:type` - Withdraw consent

#### Compliance Reporting (Admin Only)
- `GET /compliance/reports` - Generate compliance reports
- `GET /compliance/requests` - List data subject requests
- `POST /compliance/enforce-retention` - Enforce data retention
- `GET /compliance/retention-policies` - List retention policies

### Security Database Schema

#### Security Incidents Table
```sql
- incident_id (UUID, Primary Key)
- ip_address, user_agent, url, method
- threats (JSONB array)
- severity (low/medium/high/critical)
- status (detected/investigating/resolved/false_positive)
- resolution details and timestamps
```

#### Blocked IPs Table
```sql
- ip_address (Primary Key)
- reason, blocked_at, expires_at
- unblock reason and audit trail
```

#### Compliance Logs Table
```sql
- compliance_type (gdpr/ccpa/etc.)
- action, user_id, details (JSONB)
- data_subject_id for GDPR tracking
- audit timestamps
```

#### Data Subject Requests Table
```sql
- request_id (UUID)
- user_id, request_type, regulation
- status, request_details, response_data
- processing timestamps
```

### Security Middleware

#### Threat Detection
- `securityMonitoring` - Real-time threat detection
- `blockMaliciousIPs` - IP blocking enforcement
- `quotaAndTrack` - Usage quota with tracking

#### Compliance
- `gdprCompliance` - GDPR compliance tracking
- `consentValidation` - Consent requirement enforcement
- `dataRetention` - Automatic data cleanup

## 🔧 Complete System Architecture

### Technology Stack
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with connection pooling
- **Caching**: Redis for sessions and performance
- **Payments**: Stripe for subscription management
- **Security**: JWT, bcrypt, rate limiting, threat detection
- **Compliance**: GDPR, CCPA, data retention automation
- **Monitoring**: Winston logging, audit trails, security metrics

### Production Deployment
- **Environment**: Railway PostgreSQL, Heroku/Vercel deployment
- **Security**: HTTPS enforcement, security headers, CORS
- **Monitoring**: Health checks, performance metrics, error tracking
- **Compliance**: Automated data retention, audit logging
- **Scalability**: Connection pooling, Redis caching, optimized queries

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for session caching)

### Installation

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Set up environment**
```bash
cp env.example .env
# Edit .env with your configuration
```

3. **Set up database**
```bash
# Create PostgreSQL database
createdb proofpix

# Run migrations
npm run migrate
```

4. **Start development server**
```bash
npm run dev
```

### Database Migrations

```bash
# Run all pending migrations
npm run migrate

# Check migration status
node database/migrate.js status

# Rollback last migration (development only)
node database/migrate.js rollback
```

## 📋 Next Implementation Priorities

### PRIORITY 2 - DATABASE & DATA LAYER (COMPLETED)

### Features Implemented

#### 🗄️ Advanced Database Configuration
- **PostgreSQL connection pooling** with performance monitoring
- **Database health checks** and automatic reconnection
- **Query performance optimization** with indexing strategies
- **Connection pool management** with configurable limits

#### 📊 Comprehensive Data Models
- **Subscriptions management** with Stripe integration
- **Usage tracking** with quotas and billing cycles
- **Analytics data collection** for user behavior insights
- **File metadata storage** with processing status
- **API key management** for enterprise access
- **Billing and transaction history**

#### 🏗️ Repository Pattern Implementation
- **BaseRepository** with common database operations
- **Specialized repositories** for each data model
- **Query builders** for complex database operations
- **Transaction management** for data consistency

#### 📈 Performance Optimizations
- **Materialized views** for analytics aggregation
- **Database indexes** for query performance
- **PostgreSQL functions** for complex operations
- **Connection pooling** with monitoring

### PRIORITY 3 - PAYMENT SYSTEM (COMPLETED)

### Features Implemented

#### 💳 Stripe Integration
- **Complete Stripe service** with customer management
- **Subscription lifecycle management** (create, update, cancel)
- **Payment method handling** with secure tokenization
- **Invoice management** and usage-based billing
- **Proration handling** for plan changes
- **Revenue analytics** and reporting

#### 🔄 Webhook Processing
- **Comprehensive webhook handling** for all Stripe events
- **Event verification** with signature validation
- **Idempotent processing** to prevent duplicate actions
- **Error handling** and retry mechanisms
- **Audit logging** for all payment events

#### 📊 Billing Management
- **Multi-tier subscription plans** (Free, Starter, Professional, Enterprise)
- **Usage-based billing** with quota enforcement
- **Billing portal integration** for customer self-service
- **Invoice generation** and payment tracking
- **Dunning management** for failed payments

#### 🎯 Quota Management
- **Real-time quota checking** before operations
- **Usage tracking** with automatic billing
- **Feature access control** based on subscription tier
- **Overage handling** and notifications
- **Quota enforcement middleware**

#### 💰 Revenue Analytics
- **Revenue reporting** with detailed breakdowns
- **Subscription metrics** (MRR, churn, growth)
- **Customer lifetime value** calculations
- **Payment success rates** and failure analysis

### Payment API Endpoints (`/api/payments`)
- `GET /plans` - Available subscription plans
- `POST /subscribe` - Create new subscription
- `PUT /subscription` - Update subscription
- `DELETE /subscription` - Cancel subscription
- `GET /subscription` - Get current subscription
- `POST /payment-method` - Add payment method
- `GET /invoices` - List customer invoices
- `POST /billing-portal` - Create billing portal session
- `POST /webhook` - Stripe webhook endpoint

### PRIORITY 4 - SECURITY & COMPLIANCE (COMPLETED)

### Features Implemented

#### 🛡️ Advanced Security Monitoring
- **Real-time threat detection** with pattern matching
- **SQL injection protection** with input validation
- **XSS prevention** with content sanitization
- **Path traversal detection** and blocking
- **Command injection prevention**
- **Brute force detection** with automatic IP blocking

#### 🚨 Incident Management
- **Automated security response** based on threat severity
- **Security incident logging** with detailed forensics
- **IP blocking** with configurable duration
- **Rate limit overrides** for suspicious activity
- **Enhanced monitoring** for flagged IPs
- **Security alerting** system integration

#### 📋 GDPR Compliance
- **Data subject rights** implementation (Articles 15-20)
- **Right of access** with complete data export
- **Right to rectification** with data correction
- **Right to erasure** (right to be forgotten)
- **Data portability** with structured export
- **Consent management** with withdrawal tracking

#### 🔒 Privacy & Compliance
- **Data retention policies** with automatic enforcement
- **Compliance logging** for audit trails
- **Data processing activities** documentation (Article 30)
- **User consent tracking** with legal basis
- **CCPA compliance** support
- **Privacy impact assessments**

#### 📊 Security Reporting
- **Security metrics dashboard** with real-time data
- **Compliance reports** for regulatory requirements
- **Security health checks** with recommendations
- **Incident response tracking**
- **Threat intelligence** aggregation

### Security API Endpoints (`/api/security`)

#### Security Monitoring (Admin Only)
- `GET /metrics` - Security metrics and statistics
- `GET /incidents` - Security incident list
- `GET /incidents/:id` - Specific incident details
- `PUT /incidents/:id` - Update incident status
- `GET /reports` - Generate security reports
- `GET /health-check` - Security health assessment

#### IP Management (Admin Only)
- `GET /blocked-ips` - List blocked IP addresses
- `POST /block-ip` - Block IP address manually
- `DELETE /block-ip/:ip` - Unblock IP address

#### GDPR Compliance
- `POST /gdpr/access-request` - Submit data access request
- `POST /gdpr/rectification-request` - Submit data correction request
- `POST /gdpr/erasure-request` - Submit data deletion request
- `POST /gdpr/portability-request` - Submit data export request

#### Consent Management
- `GET /consents` - Get user consent history
- `POST /consents` - Record new consent
- `DELETE /consents/:type` - Withdraw consent

#### Compliance Reporting (Admin Only)
- `GET /compliance/reports` - Generate compliance reports
- `GET /compliance/requests` - List data subject requests
- `POST /compliance/enforce-retention` - Enforce data retention
- `GET /compliance/retention-policies` - List retention policies

### Security Database Schema

#### Security Incidents Table
```sql
- incident_id (UUID, Primary Key)
- ip_address, user_agent, url, method
- threats (JSONB array)
- severity (low/medium/high/critical)
- status (detected/investigating/resolved/false_positive)
- resolution details and timestamps
```

#### Blocked IPs Table
```sql
- ip_address (Primary Key)
- reason, blocked_at, expires_at
- unblock reason and audit trail
```

#### Compliance Logs Table
```sql
- compliance_type (gdpr/ccpa/etc.)
- action, user_id, details (JSONB)
- data_subject_id for GDPR tracking
- audit timestamps
```

#### Data Subject Requests Table
```sql
- request_id (UUID)
- user_id, request_type, regulation
- status, request_details, response_data
- processing timestamps
```

### Security Middleware

#### Threat Detection
- `securityMonitoring` - Real-time threat detection
- `blockMaliciousIPs` - IP blocking enforcement
- `quotaAndTrack` - Usage quota with tracking

#### Compliance
- `gdprCompliance` - GDPR compliance tracking
- `consentValidation` - Consent requirement enforcement
- `dataRetention` - Automatic data cleanup

## 🔧 Complete System Architecture

### Technology Stack
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with connection pooling
- **Caching**: Redis for sessions and performance
- **Payments**: Stripe for subscription management
- **Security**: JWT, bcrypt, rate limiting, threat detection
- **Compliance**: GDPR, CCPA, data retention automation
- **Monitoring**: Winston logging, audit trails, security metrics

### Production Deployment
- **Environment**: Railway PostgreSQL, Heroku/Vercel deployment
- **Security**: HTTPS enforcement, security headers, CORS
- **Monitoring**: Health checks, performance metrics, error tracking
- **Compliance**: Automated data retention, audit logging
- **Scalability**: Connection pooling, Redis caching, optimized queries

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for session caching)

### Installation

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Set up environment**
```bash
cp env.example .env
# Edit .env with your configuration
```

3. **Set up database**
```bash
# Create PostgreSQL database
createdb proofpix

# Run migrations
npm run migrate
```

4. **Start development server**
```bash
npm run dev
```

### Database Migrations

```bash
# Run all pending migrations
npm run migrate

# Check migration status
node database/migrate.js status

# Rollback last migration (development only)
node database/migrate.js rollback
```

## 📋 Next Implementation Priorities

### PRIORITY 2 - DATABASE & DATA LAYER (COMPLETED)

### Features Implemented

#### 🗄️ Advanced Database Configuration
- **PostgreSQL connection pooling** with performance monitoring
- **Database health checks** and automatic reconnection
- **Query performance optimization** with indexing strategies
- **Connection pool management** with configurable limits

#### 📊 Comprehensive Data Models
- **Subscriptions management** with Stripe integration
- **Usage tracking** with quotas and billing cycles
- **Analytics data collection** for user behavior insights
- **File metadata storage** with processing status
- **API key management** for enterprise access
- **Billing and transaction history**

#### 🏗️ Repository Pattern Implementation
- **BaseRepository** with common database operations
- **Specialized repositories** for each data model
- **Query builders** for complex database operations
- **Transaction management** for data consistency

#### 📈 Performance Optimizations
- **Materialized views** for analytics aggregation
- **Database indexes** for query performance
- **PostgreSQL functions** for complex operations
- **Connection pooling** with monitoring

### PRIORITY 3 - PAYMENT SYSTEM (COMPLETED)

### Features Implemented

#### 💳 Stripe Integration
- **Complete Stripe service** with customer management
- **Subscription lifecycle management** (create, update, cancel)
- **Payment method handling** with secure tokenization
- **Invoice management** and usage-based billing
- **Proration handling** for plan changes
- **Revenue analytics** and reporting

#### 🔄 Webhook Processing
- **Comprehensive webhook handling** for all Stripe events
- **Event verification** with signature validation
- **Idempotent processing** to prevent duplicate actions
- **Error handling** and retry mechanisms
- **Audit logging** for all payment events

#### 📊 Billing Management
- **Multi-tier subscription plans** (Free, Starter, Professional, Enterprise)
- **Usage-based billing** with quota enforcement
- **Billing portal integration** for customer self-service
- **Invoice generation** and payment tracking
- **Dunning management** for failed payments

#### 🎯 Quota Management
- **Real-time quota checking** before operations
- **Usage tracking** with automatic billing
- **Feature access control** based on subscription tier
- **Overage handling** and notifications
- **Quota enforcement middleware**

#### 💰 Revenue Analytics
- **Revenue reporting** with detailed breakdowns
- **Subscription metrics** (MRR, churn, growth)
- **Customer lifetime value** calculations
- **Payment success rates** and failure analysis

### Payment API Endpoints (`/api/payments`)
- `GET /plans` - Available subscription plans
- `POST /subscribe` - Create new subscription
- `PUT /subscription` - Update subscription
- `DELETE /subscription` - Cancel subscription
- `GET /subscription` - Get current subscription
- `POST /payment-method` - Add payment method
- `GET /invoices` - List customer invoices
- `POST /billing-portal` - Create billing portal session
- `POST /webhook` - Stripe webhook endpoint

### PRIORITY 4 - SECURITY & COMPLIANCE (COMPLETED)

### Features Implemented

#### 🛡️ Advanced Security Monitoring
- **Real-time threat detection** with pattern matching
- **SQL injection protection** with input validation
- **XSS prevention** with content sanitization
- **Path traversal detection** and blocking
- **Command injection prevention**
- **Brute force detection** with automatic IP blocking

#### 🚨 Incident Management
- **Automated security response** based on threat severity
- **Security incident logging** with detailed forensics
- **IP blocking** with configurable duration
- **Rate limit overrides** for suspicious activity
- **Enhanced monitoring** for flagged IPs
- **Security alerting** system integration

#### 📋 GDPR Compliance
- **Data subject rights** implementation (Articles 15-20)
- **Right of access** with complete data export
- **Right to rectification** with data correction
- **Right to erasure** (right to be forgotten)
- **Data portability** with structured export
- **Consent management** with withdrawal tracking

#### 🔒 Privacy & Compliance
- **Data retention policies** with automatic enforcement
- **Compliance logging** for audit trails
- **Data processing activities** documentation (Article 30)
- **User consent tracking** with legal basis
- **CCPA compliance** support
- **Privacy impact assessments**

#### 📊 Security Reporting
- **Security metrics dashboard** with real-time data
- **Compliance reports** for regulatory requirements
- **Security health checks** with recommendations
- **Incident response tracking**
- **Threat intelligence** aggregation

### Security API Endpoints (`/api/security`)

#### Security Monitoring (Admin Only)
- `GET /metrics` - Security metrics and statistics
- `GET /incidents` - Security incident list
- `GET /incidents/:id` - Specific incident details
- `PUT /incidents/:id` - Update incident status
- `GET /reports` - Generate security reports
- `GET /health-check` - Security health assessment

#### IP Management (Admin Only)
- `GET /blocked-ips` - List blocked IP addresses
- `POST /block-ip` - Block IP address manually
- `DELETE /block-ip/:ip` - Unblock IP address

#### GDPR Compliance
- `POST /gdpr/access-request` - Submit data access request
- `POST /gdpr/rectification-request` - Submit data correction request
- `POST /gdpr/erasure-request` - Submit data deletion request
- `POST /gdpr/portability-request` - Submit data export request

#### Consent Management
- `GET /consents` - Get user consent history
- `POST /consents` - Record new consent
- `DELETE /consents/:type` - Withdraw consent

#### Compliance Reporting (Admin Only)
- `GET /compliance/reports` - Generate compliance reports
- `GET /compliance/requests` - List data subject requests
- `POST /compliance/enforce-retention` - Enforce data retention
- `GET /compliance/retention-policies` - List retention policies

### Security Database Schema

#### Security Incidents Table
```sql
- incident_id (UUID, Primary Key)
- ip_address, user_agent, url, method
- threats (JSONB array)
- severity (low/medium/high/critical)
- status (detected/investigating/resolved/false_positive)
- resolution details and timestamps
```

#### Blocked IPs Table
```sql
- ip_address (Primary Key)
- reason, blocked_at, expires_at
- unblock reason and audit trail
```

#### Compliance Logs Table
```sql
- compliance_type (gdpr/ccpa/etc.)
- action, user_id, details (JSONB)
- data_subject_id for GDPR tracking
- audit timestamps
```

#### Data Subject Requests Table
```sql
- request_id (UUID)
- user_id, request_type, regulation
- status, request_details, response_data
- processing timestamps
```

### Security Middleware

#### Threat Detection
- `securityMonitoring` - Real-time threat detection
- `blockMaliciousIPs` - IP blocking enforcement
- `quotaAndTrack` - Usage quota with tracking

#### Compliance
- `gdprCompliance` - GDPR compliance tracking
- `consentValidation` - Consent requirement enforcement
- `dataRetention` - Automatic data cleanup

## 🔧 Complete System Architecture

### Technology Stack
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with connection pooling
- **Caching**: Redis for sessions and performance
- **Payments**: Stripe for subscription management
- **Security**: JWT, bcrypt, rate limiting, threat detection
- **Compliance**: GDPR, CCPA, data retention automation
- **Monitoring**: Winston logging, audit trails, security metrics

### Production Deployment
- **Environment**: Railway PostgreSQL, Heroku/Vercel deployment
- **Security**: HTTPS enforcement, security headers, CORS
- **Monitoring**: Health checks, performance metrics, error tracking
- **Compliance**: Automated data retention, audit logging
- **Scalability**: Connection pooling, Redis caching, optimized queries

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for session caching)

### Installation

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Set up environment**
```bash
cp env.example .env
# Edit .env with your configuration
```

3. **Set up database**
```bash
# Create PostgreSQL database
createdb proofpix

# Run migrations
npm run migrate
```

4. **Start development server**
```bash
npm run dev
```

### Database Migrations

```bash
# Run all pending migrations
npm run migrate

# Check migration status
node database/migrate.js status

# Rollback last migration (development only)
node database/migrate.js rollback
```

## 📋 Next Implementation Priorities

### PRIORITY 2 - DATABASE & DATA LAYER (COMPLETED)

### Features Implemented

#### 🗄️ Advanced Database Configuration
- **PostgreSQL connection pooling** with performance monitoring
- **Database health checks** and automatic reconnection
- **Query performance optimization** with indexing strategies
- **Connection pool management** with configurable limits

#### 📊 Comprehensive Data Models
- **Subscriptions management** with Stripe integration
- **Usage tracking** with quotas and billing cycles
- **Analytics data collection** for user behavior insights
- **File metadata storage** with processing status
- **API key management** for enterprise access
- **Billing and transaction history**

#### 🏗️ Repository Pattern Implementation
- **BaseRepository** with common database operations
- **Specialized repositories** for each data model
- **Query builders** for complex database operations
- **Transaction management** for data consistency

#### 📈 Performance Optimizations
- **Materialized views** for analytics aggregation
- **Database indexes** for query performance
- **PostgreSQL functions** for complex operations
- **Connection pooling** with monitoring

### PRIORITY 3 - PAYMENT SYSTEM (COMPLETED)

### Features Implemented

#### 💳 Stripe Integration
- **Complete Stripe service** with customer management
- **Subscription lifecycle management** (create, update, cancel)
- **Payment method handling** with secure tokenization
- **Invoice management** and usage-based billing
- **Proration handling** for plan changes
- **Revenue analytics** and reporting

#### 🔄 Webhook Processing
- **Comprehensive webhook handling** for all Stripe events
- **Event verification** with signature validation
- **Idempotent processing** to prevent duplicate actions
- **Error handling** and retry mechanisms
- **Audit logging** for all payment events

#### 📊 Billing Management
- **Multi-tier subscription plans** (Free, Starter, Professional, Enterprise)
- **Usage-based billing** with quota enforcement
- **Billing portal integration** for customer self-service
- **Invoice generation** and payment tracking
- **Dunning management** for failed payments

#### 🎯 Quota Management
- **Real-time quota checking** before operations
- **Usage tracking** with automatic billing
- **Feature access control** based on subscription tier
- **Overage handling** and notifications
- **Quota enforcement middleware**

#### 💰 Revenue Analytics
- **Revenue reporting** with detailed breakdowns
- **Subscription metrics** (MRR, churn, growth)
- **Customer lifetime value** calculations
- **Payment success rates** and failure analysis

### Payment API Endpoints (`/api/payments`)
- `GET /plans` - Available subscription plans
- `POST /subscribe` - Create new subscription
- `PUT /subscription` - Update subscription
- `DELETE /subscription` - Cancel subscription
- `GET /subscription` - Get current subscription
- `POST /payment-method` - Add payment method
- `GET /invoices` - List customer invoices
- `POST /billing-portal` - Create billing portal session
- `POST /webhook` - Stripe webhook endpoint

### PRIORITY 4 - SECURITY & COMPLIANCE (COMPLETED)

### Features Implemented

#### 🛡️ Advanced Security Monitoring
- **Real-time threat detection** with pattern matching
- **SQL injection protection** with input validation
- **XSS prevention** with content sanitization
- **Path traversal detection** and blocking
- **Command injection prevention**
- **Brute force detection** with automatic IP blocking

#### 🚨 Incident Management
- **Automated security response** based on threat severity
- **Security incident logging** with detailed forensics
- **IP blocking** with configurable duration
- **Rate limit overrides** for suspicious activity
- **Enhanced monitoring** for flagged IPs
- **Security alerting** system integration

#### 📋 GDPR Compliance
- **Data subject rights** implementation (Articles 15-20)
- **Right of access** with complete data export
- **Right to rectification** with data correction
- **Right to erasure** (right to be forgotten)
- **Data portability** with structured export
- **Consent management** with withdrawal tracking

#### 🔒 Privacy & Compliance
- **Data retention policies** with automatic enforcement
- **Compliance logging** for audit trails
- **Data processing activities** documentation (Article 30)
- **User consent tracking** with legal basis
- **CCPA compliance** support
- **Privacy impact assessments**

#### 📊 Security Reporting
- **Security metrics dashboard** with real-time data
- **Compliance reports** for regulatory requirements
- **Security health checks** with recommendations
- **Incident response tracking**
- **Threat intelligence** aggregation

### Security API Endpoints (`/api/security`)

#### Security Monitoring (Admin Only)
- `GET /metrics` - Security metrics and statistics
- `GET /incidents` - Security incident list
- `GET /incidents/:id` - Specific incident details
- `PUT /incidents/:id` - Update incident status
- `GET /reports` - Generate security reports
- `GET /health-check` - Security health assessment

#### IP Management (Admin Only)
- `GET /blocked-ips` - List blocked IP addresses
- `POST /block-ip` - Block IP address manually
- `DELETE /block-ip/:ip` - Unblock IP address

#### GDPR Compliance
- `POST /gdpr/access-request` - Submit data access request
- `POST /gdpr/rectification-request` - Submit data correction request
- `POST /gdpr/erasure-request` - Submit data deletion request
- `POST /gdpr/portability-request` - Submit data export request

#### Consent Management
- `GET /consents` - Get user consent history
- `POST /consents` - Record new consent
- `DELETE /consents/:type` - Withdraw consent

#### Compliance Reporting (Admin Only)
- `GET /compliance/reports` - Generate compliance reports
- `GET /compliance/requests` - List data subject requests
- `POST /compliance/enforce-retention` - Enforce data retention
- `GET /compliance/retention-policies` - List retention policies

### Security Database Schema

#### Security Incidents Table
```sql
- incident_id (UUID, Primary Key)
- ip_address, user_agent, url, method
- threats (JSONB array)
- severity (low/medium/high/critical)
- status (detected/investigating/resolved/false_positive)
- resolution details and timestamps
```

#### Blocked IPs Table
```sql
- ip_address (Primary Key)
- reason, blocked_at, expires_at
- unblock reason and audit trail
```

#### Compliance Logs Table
```sql
- compliance_type (gdpr/ccpa/etc.)
- action, user_id, details (JSONB)
- data_subject_id for GDPR tracking
- audit timestamps
```

#### Data Subject Requests Table
```sql
- request_id (UUID)
- user_id, request_type, regulation
- status, request_details, response_data
- processing timestamps
```

### Security Middleware

#### Threat Detection
- `securityMonitoring` - Real-time threat detection
- `blockMaliciousIPs` - IP blocking enforcement
- `quotaAndTrack` - Usage quota with tracking

#### Compliance
- `gdprCompliance` - GDPR compliance tracking
- `consentValidation` - Consent requirement enforcement
- `dataRetention` - Automatic data cleanup

## 🔧 Complete System Architecture

### Technology Stack
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with connection pooling
- **Caching**: Redis for sessions and performance
- **Payments**: Stripe for subscription management
- **Security**: JWT, bcrypt, rate limiting, threat detection
- **Compliance**: GDPR, CCPA, data retention automation
- **Monitoring**: Winston logging, audit trails, security metrics

### Production Deployment
- **Environment**: Railway PostgreSQL, Heroku/Vercel deployment
- **Security**: HTTPS enforcement, security headers, CORS
- **Monitoring**: Health checks, performance metrics, error tracking
- **Compliance**: Automated data retention, audit logging
- **Scalability**: Connection pooling, Redis caching, optimized queries

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for session caching)

### Installation

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Set up environment**
```bash
cp env.example .env
# Edit .env with your configuration
```

3. **Set up database**
```bash
# Create PostgreSQL database
createdb proofpix

# Run migrations
npm run migrate
```

4. **Start development server**
```bash
npm run dev
```

### Database Migrations

```bash
# Run all pending migrations
npm run migrate

# Check migration status
node database/migrate.js status

# Rollback last migration (development only)
node database/migrate.js rollback
```

## 📋 Next Implementation Priorities

### PRIORITY 2 - DATABASE & DATA LAYER (COMPLETED)

### Features Implemented

#### 🗄️ Advanced Database Configuration
- **PostgreSQL connection pooling** with performance monitoring
- **Database health checks** and automatic reconnection
- **Query performance optimization** with indexing strategies
- **Connection pool management** with configurable limits

#### 📊 Comprehensive Data Models
- **Subscriptions management** with Stripe integration
- **Usage tracking** with quotas and billing cycles
- **Analytics data collection** for user behavior insights
- **File metadata storage** with processing status
- **API key management** for enterprise access
- **Billing and transaction history**

#### 🏗️ Repository Pattern Implementation
- **BaseRepository** with common database operations
- **Specialized repositories** for each data model
- **Query builders** for complex database operations
- **Transaction management** for data consistency

#### 📈 Performance Optimizations
- **Materialized views** for analytics aggregation
- **Database indexes** for query performance
- **PostgreSQL functions** for complex operations
- **Connection pooling** with monitoring

### PRIORITY 3 - PAYMENT SYSTEM (COMPLETED)

### Features Implemented

#### 💳 Stripe Integration
- **Complete Stripe service** with customer management
- **Subscription lifecycle management** (create, update, cancel)
- **Payment method handling** with secure tokenization
- **Invoice management** and usage-based billing
- **Proration handling** for plan changes
- **Revenue analytics** and reporting

#### 🔄 Webhook Processing
- **Comprehensive webhook handling** for all Stripe events
- **Event verification** with signature validation
- **Idempotent processing** to prevent duplicate actions
- **Error handling** and retry mechanisms
- **Audit logging** for all payment events

#### 📊 Billing Management
- **Multi-tier subscription plans** (Free, Starter, Professional, Enterprise)
- **Usage-based billing** with quota enforcement
- **Billing portal integration** for customer self-service
- **Invoice generation** and payment tracking
- **Dunning management** for failed payments

#### 🎯 Quota Management
- **Real-time quota checking** before operations
- **Usage tracking** with automatic billing
- **Feature access control** based on subscription tier
- **Overage handling** and notifications
- **Quota enforcement middleware**

#### 💰 Revenue Analytics
- **Revenue reporting** with detailed breakdowns
- **Subscription metrics** (MRR, churn, growth)
- **Customer lifetime value** calculations
- **Payment success rates** and failure analysis

### Payment API Endpoints (`/api/payments`)
- `GET /plans` - Available subscription plans
- `POST /subscribe` - Create new subscription
- `PUT /subscription` - Update subscription
- `DELETE /subscription` - Cancel subscription
- `GET /subscription` - Get current subscription
- `POST /payment-method` - Add payment method
- `GET /invoices` - List customer invoices
- `POST /billing-portal` - Create billing portal session
- `POST /webhook` - Stripe webhook endpoint

### PRIORITY 4 - SECURITY & COMPLIANCE (COMPLETED)

### Features Implemented

#### 🛡️ Advanced Security Monitoring
- **Real-time threat detection** with pattern matching
- **SQL injection protection** with input validation
- **XSS prevention** with content sanitization
- **Path traversal detection** and blocking
- **Command injection prevention**
- **Brute force detection** with automatic IP blocking

#### 🚨 Incident Management
- **Automated security response** based on threat severity
- **Security incident logging** with detailed forensics
- **IP blocking** with configurable duration
- **Rate limit overrides** for suspicious activity
- **Enhanced monitoring** for flagged IPs
- **Security alerting** system integration

#### 📋 GDPR Compliance
- **Data subject rights** implementation (Articles 15-20)
- **Right of access** with complete data export
- **Right to rectification** with data correction
- **Right to erasure** (right to be forgotten)
- **Data portability** with structured export
- **Consent management** with withdrawal tracking

#### 🔒 Privacy & Compliance
- **Data retention policies** with automatic enforcement
- **Compliance logging** for audit trails
- **Data processing activities** documentation (Article 30)
- **User consent tracking** with legal basis
- **CCPA compliance** support
- **Privacy impact assessments**

#### 📊 Security Reporting
- **Security metrics dashboard** with real-time data
- **Compliance reports** for regulatory requirements
- **Security health checks** with recommendations
- **Incident response tracking**
- **Threat intelligence** aggregation

### Security API Endpoints (`/api/security`)

#### Security Monitoring (Admin Only)
- `GET /metrics` - Security metrics and statistics
- `GET /incidents` - Security incident list
- `GET /incidents/:id` - Specific incident details
- `PUT /incidents/:id` - Update incident status
- `GET /reports` - Generate security reports
- `GET /health-check` - Security health assessment

#### IP Management (Admin Only)
- `GET /blocked-ips` - List blocked IP addresses
- `POST /block-ip` - Block IP address manually
- `DELETE /block-ip/:ip` - Unblock IP address

#### GDPR Compliance
- `POST /gdpr/access-request` - Submit data access request
- `POST /gdpr/rectification-request` - Submit data correction request
- `POST /gdpr/erasure-request` - Submit data deletion request
- `POST /gdpr/portability-request` - Submit data export request

#### Consent Management
- `GET /consents` - Get user consent history
- `POST /consents` - Record new consent
- `DELETE /consents/:type` - Withdraw consent

#### Compliance Reporting (Admin Only)
- `GET /compliance/reports` - Generate compliance reports
- `GET /compliance/requests` - List data subject requests
- `POST /compliance/enforce-retention` - Enforce data retention
- `GET /compliance/retention-policies` - List retention policies

### Security Database Schema

#### Security Incidents Table
```sql
- incident_id (UUID, Primary Key)
- ip_address, user_agent, url, method
- threats (JSONB array)
- severity (low/medium/high/critical)
- status (detected/investigating/resolved/false_positive)
- resolution details and timestamps
```

#### Blocked IPs Table
```sql
- ip_address (Primary Key)
- reason, blocked_at, expires_at
- unblock reason and audit trail
```

#### Compliance Logs Table
```sql
- compliance_type (gdpr/ccpa/etc.)
- action, user_id, details (JSONB)
- data_subject_id for GDPR tracking
- audit timestamps
```

#### Data Subject Requests Table
```sql
- request_id (UUID)
- user_id, request_type, regulation
- status, request_details, response_data
- processing timestamps
```

### Security Middleware

#### Threat Detection
- `securityMonitoring` - Real-time threat detection
- `blockMaliciousIPs` - IP blocking enforcement
- `quotaAndTrack` - Usage quota with tracking

#### Compliance
- `gdprCompliance` - GDPR compliance tracking
- `consentValidation` - Consent requirement enforcement
- `dataRetention` - Automatic data cleanup

## 🔧 Complete System Architecture

### Technology Stack
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with connection pooling
- **Caching**: Redis for sessions and performance
- **Payments**: Stripe for subscription management
- **Security**: JWT, bcrypt, rate limiting, threat detection
- **Compliance**: GDPR, CCPA, data retention automation
- **Monitoring**: Winston logging, audit trails, security metrics

### Production Deployment
- **Environment**: Railway PostgreSQL, Heroku/Vercel deployment
- **Security**: HTTPS enforcement, security headers, CORS
- **Monitoring**: Health checks, performance metrics, error tracking
- **Compliance**: Automated data retention, audit logging
- **Scalability**: Connection pooling, Redis caching, optimized queries

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for session caching)

### Installation

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Set up environment**
```bash
cp env.example .env
# Edit .env with your configuration
```

3. **Set up database**
```bash
# Create PostgreSQL database
createdb proofpix

# Run migrations
npm run migrate
```

4. **Start development server**
```bash
npm run dev
```

### Database Migrations

```bash
# Run all pending migrations
npm run migrate

# Check migration status
node database/migrate.js status

# Rollback last migration (development only)
node database/migrate.js rollback
```

## 📋 Next Implementation Priorities

### PRIORITY 2 - DATABASE & DATA LAYER (COMPLETED)

### Features Implemented

#### 🗄️ Advanced Database Configuration
- **PostgreSQL connection pooling** with performance monitoring
- **Database health checks** and automatic reconnection
- **Query performance optimization** with indexing strategies
- **Connection pool management** with configurable limits

#### 📊 Comprehensive Data Models
- **Subscriptions management** with Stripe integration
- **Usage tracking** with quotas and billing cycles
- **Analytics data collection** for user behavior insights
- **File metadata storage** with processing status
- **API key management** for enterprise access
- **Billing and transaction history**

#### 🏗️ Repository Pattern Implementation
- **BaseRepository** with common database operations
- **Specialized repositories** for each data model
- **Query builders** for complex database operations
- **Transaction management** for data consistency

#### 📈 Performance Optimizations
- **Materialized views** for analytics aggregation
- **Database indexes** for query performance
- **PostgreSQL functions** for complex operations
- **Connection pooling** with monitoring

### PRIORITY 3 - PAYMENT SYSTEM (COMPLETED)

### Features Implemented

#### 💳 Stripe Integration
- **Complete Stripe service** with customer management
- **Subscription lifecycle management** (create, update, cancel)
- **Payment method handling** with secure tokenization
- **Invoice management** and usage-based billing
- **Proration handling** for plan changes
- **Revenue analytics** and reporting

#### 🔄 Webhook Processing
- **Comprehensive webhook handling** for all Stripe events
- **Event verification** with signature validation
- **Idempotent processing** to prevent duplicate actions
- **Error handling** and retry mechanisms
- **Audit logging** for all payment events

#### 📊 Billing Management
- **Multi-tier subscription plans** (Free, Starter, Professional, Enterprise)
- **Usage-based billing** with quota enforcement
- **Billing portal integration** for customer self-service
- **Invoice generation** and payment tracking
- **Dunning management** for failed payments

#### 🎯 Quota Management
- **Real-time quota checking** before operations
- **Usage tracking** with automatic billing
- **Feature access control** based on subscription tier
- **Overage handling** and notifications
- **Quota enforcement middleware**

#### 💰 Revenue Analytics
- **Revenue reporting** with detailed breakdowns
- **Subscription metrics** (MRR, churn, growth)
- **Customer lifetime value** calculations
- **Payment success rates** and failure analysis

### Payment API Endpoints (`/api/payments`)
- `GET /plans` - Available subscription plans
- `POST /subscribe` - Create new subscription
- `PUT /subscription` - Update subscription
- `DELETE /subscription` - Cancel subscription
- `GET /subscription` - Get current subscription
- `POST /payment-method` - Add payment method
- `GET /invoices` - List customer invoices
- `POST /billing-portal` - Create billing portal session
- `POST /webhook` - Stripe webhook endpoint

### PRIORITY 4 - SECURITY & COMPLIANCE (COMPLETED)

### Features Implemented

#### 🛡️ Advanced Security Monitoring
- **Real-time threat detection** with pattern matching
- **SQL injection protection** with input validation
- **XSS prevention** with content sanitization
- **Path traversal detection** and blocking
- **Command injection prevention**
- **Brute force detection** with automatic IP blocking

#### 🚨 Incident Management
- **Automated security response** based on threat severity
- **Security incident logging** with detailed forensics
- **IP blocking** with configurable duration
- **Rate limit overrides** for suspicious activity
- **Enhanced monitoring** for flagged IPs
- **Security alerting** system integration

#### 📋 GDPR Compliance
- **Data subject rights** implementation (Articles 15-20)
- **Right of access** with complete data export
- **Right to rectification** with data correction
- **Right to erasure** (right to be forgotten)
- **Data portability** with structured export
- **Consent management** with withdrawal tracking

#### 🔒 Privacy & Compliance
- **Data retention policies** with automatic enforcement
- **Compliance logging** for audit trails
- **Data processing activities** documentation (Article 30)
- **User consent tracking** with legal basis
- **CCPA compliance** support
- **Privacy impact assessments**

#### 📊 Security Reporting
- **Security metrics dashboard** with real-time data
- **Compliance reports** for regulatory requirements
- **Security health checks** with recommendations
- **Incident response tracking**
- **Threat intelligence** aggregation

### Security API Endpoints (`/api/security`)

#### Security Monitoring (Admin Only)
- `GET /metrics` - Security metrics and statistics
- `GET /incidents` - Security incident list
- `GET /incidents/:id` - Specific incident details
- `PUT /incidents/:id` - Update incident status
- `GET /reports` - Generate security reports
- `GET /health-check` - Security health assessment

#### IP Management (Admin Only)
- `GET /blocked-ips` - List blocked IP addresses
- `POST /block-ip` - Block IP address manually
- `DELETE /block-ip/:ip` - Unblock IP address

#### GDPR Compliance
- `POST /gdpr/access-request` - Submit data access request
- `POST /gdpr/rectification-request` - Submit data correction request
- `POST /gdpr/erasure-request` - Submit data deletion request
- `POST /gdpr/portability-request` - Submit data export request

#### Consent Management
- `GET /consents` - Get user consent history
- `POST /consents` - Record new consent
- `DELETE /consents/:type` - Withdraw consent

#### Compliance Reporting (Admin Only)
- `GET /compliance/reports` - Generate compliance reports
- `GET /compliance/requests` - List data subject requests
- `POST /compliance/enforce-retention` - Enforce data retention
- `GET /compliance/retention-policies` - List retention policies

### Security Database Schema

#### Security Incidents Table
```sql
- incident_id (UUID, Primary Key)
- ip_address, user_agent, url, method
- threats (JSONB array)
- severity (low/medium/high/critical)
- status (detected/investigating/resolved/false_positive)
- resolution details and timestamps
```

#### Blocked IPs Table
```sql
- ip_address (Primary Key)
- reason, blocked_at, expires_at
- unblock reason and audit trail
```

#### Compliance Logs Table
```sql
- compliance_type (gdpr/ccpa/etc.)
- action, user_id, details (JSONB)
- data_subject_id for GDPR tracking
- audit timestamps
```

#### Data Subject Requests Table
```sql
- request_id (UUID)
- user_id, request_type, regulation
- status, request_details, response_data
- processing timestamps
```

### Security Middleware

#### Threat Detection
- `securityMonitoring` - Real-time threat detection
- `blockMaliciousIPs` - IP blocking enforcement
- `quotaAndTrack` - Usage quota with tracking

#### Compliance
- `gdprCompliance` - GDPR compliance tracking
- `consentValidation` - Consent requirement enforcement
- `dataRetention` - Automatic data cleanup

## 🔧 Complete System Architecture

### Technology Stack
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with connection pooling
- **Caching**: Redis for sessions and performance
- **Payments**: Stripe for subscription management
- **Security**: JWT, bcrypt, rate limiting, threat detection
- **Compliance**: GDPR, CCPA, data retention automation
- **Monitoring**: Winston logging, audit trails, security metrics

### Production Deployment
- **Environment**: Railway PostgreSQL, Heroku/Vercel deployment
- **Security**: HTTPS enforcement, security headers, CORS
- **Monitoring**: Health checks, performance metrics, error tracking
- **Compliance**: Automated data retention, audit logging
- **Scalability**: Connection pooling, Redis caching, optimized queries

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for session caching)

### Installation

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Set up environment**
```bash
cp env.example .env
# Edit .env with your configuration
```

3. **Set up database**
```bash
# Create PostgreSQL database
createdb proofpix

# Run migrations
npm run migrate
```

4. **Start development server**
```bash
npm run dev
```

### Database Migrations

```bash
# Run all pending migrations
npm run migrate

# Check migration status
node database/migrate.js status

# Rollback last migration (development only)
node database/migrate.js rollback
```

## 📋 Next Implementation Priorities

### PRIORITY 2 - DATABASE & DATA LAYER (COMPLETED)

### Features Implemented

#### 🗄️ Advanced Database Configuration
- **PostgreSQL connection pooling** with performance monitoring
- **Database health checks** and automatic reconnection
- **Query performance optimization** with indexing strategies
- **Connection pool management** with configurable limits

#### 📊 Comprehensive Data Models
- **Subscriptions management** with Stripe integration
- **Usage tracking** with quotas and billing cycles
- **Analytics data collection** for user behavior insights
- **File metadata storage** with processing status
- **API key management** for enterprise access
- **Billing and transaction history**

#### 🏗️ Repository Pattern Implementation
- **BaseRepository** with common database operations
- **Specialized repositories** for each data model
- **Query builders** for complex database operations
- **Transaction management** for data consistency

#### 📈 Performance Optimizations
- **Materialized views** for analytics aggregation
- **Database indexes** for query performance
- **PostgreSQL functions** for complex operations
- **Connection pooling** with monitoring

### PRIORITY 3 - PAYMENT SYSTEM (COMPLETED)

### Features Implemented

#### 💳 Stripe Integration
- **Complete Stripe service** with customer management
- **Subscription lifecycle management** (create, update, cancel)
- **Payment method handling** with secure tokenization
- **Invoice management** and usage-based billing
- **Proration handling** for plan changes
- **Revenue analytics** and reporting

#### 🔄 Webhook Processing
- **Comprehensive webhook handling** for all Stripe events
- **Event verification** with signature validation
- **Idempotent processing** to prevent duplicate actions
- **Error handling** and retry mechanisms
- **Audit logging** for all payment events

#### 📊 Billing Management
- **Multi-tier subscription plans** (Free, Starter, Professional, Enterprise)
- **Usage-based billing** with quota enforcement
- **Billing portal integration** for customer self-service
- **Invoice generation** and payment tracking
- **Dunning management** for failed payments

#### 🎯 Quota Management
- **Real-time quota checking** before operations
- **Usage tracking** with automatic billing
- **Feature access control** based on subscription tier
- **Overage handling** and notifications
- **Quota enforcement middleware**

#### 💰 Revenue Analytics
- **Revenue reporting** with detailed breakdowns
- **Subscription metrics** (MRR, churn, growth)
- **Customer lifetime value** calculations
- **Payment success rates** and failure analysis

### Payment API Endpoints (`/api/payments`)
- `GET /plans` - Available subscription plans
- `POST /subscribe` - Create new subscription
- `PUT /subscription` - Update subscription
- `DELETE /subscription` - Cancel subscription
- `GET /subscription` - Get current subscription
- `POST /payment-method` - Add payment method
- `GET /invoices` - List customer invoices
- `POST /billing-portal` - Create billing portal session
- `POST /webhook` - Stripe webhook endpoint

### PRIORITY 4 - SECURITY & COMPLIANCE (COMPLETED)

### Features Implemented

#### 🛡️ Advanced Security Monitoring
- **Real-time threat detection** with pattern matching
- **SQL injection protection** with input validation
- **XSS prevention** with content sanitization
- **Path traversal detection** and blocking
- **Command injection prevention**
- **Brute force detection** with automatic IP blocking

#### 🚨 Incident Management
- **Automated security response** based on threat severity
- **Security incident logging** with detailed forensics
- **IP blocking** with configurable duration
- **Rate limit overrides** for suspicious activity
- **Enhanced monitoring** for flagged IPs
- **Security alerting** system integration

#### 📋 GDPR Compliance
- **Data subject rights** implementation (Articles 15-20)
- **Right of access** with complete data export
- **Right to rectification** with data correction
- **Right to erasure** (right to be forgotten)
- **Data portability** with structured export
- **Consent management** with withdrawal tracking

#### 🔒 Privacy & Compliance
- **Data retention policies** with automatic enforcement
- **Compliance logging** for audit trails
- **Data processing activities** documentation (Article 30)
- **User consent tracking** with legal basis
- **CCPA compliance** support
- **Privacy impact assessments**

#### 📊 Security Reporting
- **Security metrics dashboard** with real-time data
- **Compliance reports** for regulatory requirements
- **Security health checks** with recommendations
- **Incident response tracking**
- **Threat intelligence** aggregation

### Security API Endpoints (`/api/security`)

#### Security Monitoring (Admin Only)
- `GET /metrics` - Security metrics and statistics
- `GET /incidents` - Security incident list
- `GET /incidents/:id` - Specific incident details
- `PUT /incidents/:id` - Update incident status
- `GET /reports` - Generate security reports
- `GET /health-check` - Security health assessment

#### IP Management (Admin Only)
- `GET /blocked-ips` - List blocked IP addresses
- `POST /block-ip` - Block IP address manually
- `DELETE /block-ip/:ip` - Unblock IP address

#### GDPR Compliance
- `POST /gdpr/access-request` - Submit data access request
- `POST /gdpr/rectification-request` - Submit data correction request
- `POST /gdpr/erasure-request` - Submit data deletion request
- `POST /gdpr/portability-request` - Submit data export request

#### Consent Management
- `GET /consents` - Get user consent history
- `POST /consents` - Record new consent
- `DELETE /consents/:type` - Withdraw consent

#### Compliance Reporting (Admin Only)
- `GET /compliance/reports` - Generate compliance reports
- `GET /compliance/requests` - List data subject requests
- `POST /compliance/enforce-retention` - Enforce data retention
- `GET /compliance/retention-policies` - List retention policies

### Security Database Schema

#### Security Incidents Table
```sql
- incident_id (UUID, Primary Key)
- ip_address, user_agent, url, method
- threats (JSONB array)
- severity (low/medium/high/critical)
- status (detected/investigating/resolved/false_positive)
- resolution details and timestamps
```

#### Blocked IPs Table
```sql
- ip_address (Primary Key)
- reason, blocked_at, expires_at
- unblock reason and audit trail
```

#### Compliance Logs Table
```sql
- compliance_type (gdpr/ccpa/etc.)
- action, user_id, details (JSONB)
- data_subject_id for GDPR tracking
- audit timestamps
```

#### Data Subject Requests Table
```sql
- request_id (UUID)
- user_id, request_type, regulation
- status, request_details, response_data
- processing timestamps
```

### Security Middleware

#### Threat Detection
- `securityMonitoring` - Real-time threat detection
- `blockMaliciousIPs` - IP blocking enforcement
- `quotaAndTrack` - Usage quota with tracking

#### Compliance
- `gdprCompliance` - GDPR compliance tracking
- `consentValidation` - Consent requirement enforcement
- `dataRetention` - Automatic data cleanup

## 🔧 Complete System Architecture

### Technology Stack
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with connection pooling
- **Caching**: Redis for sessions and performance
- **Payments**: Stripe for subscription management
- **Security**: JWT, bcrypt, rate limiting, threat detection
- **Compliance**: GDPR, CCPA, data retention automation
- **Monitoring**: Winston logging, audit trails, security metrics

### Production Deployment
- **Environment**: Railway PostgreSQL, Heroku/Vercel deployment
- **Security**: HTTPS enforcement, security headers, CORS
- **Monitoring**: Health checks, performance metrics, error tracking
- **Compliance**: Automated data retention, audit logging
- **Scalability**: Connection pooling, Redis caching, optimized queries

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for session caching)

### Installation

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Set up environment**
```bash
cp env.example .env
# Edit .env with your configuration
```

3. **Set up database**
```bash
# Create PostgreSQL database
createdb proofpix

# Run migrations
npm run migrate
```

4. **Start development server**
```bash
npm run dev
```

### Database Migrations

```bash
# Run all pending migrations
npm run migrate

# Check migration status
node database/migrate.js status

# Rollback last migration (development only)
node database/migrate.js rollback
```

## 📋 Next Implementation Priorities

### PRIORITY 2 - DATABASE & DATA LAYER (COMPLETED)

### Features Implemented

#### 🗄️ Advanced Database Configuration
- **PostgreSQL connection pooling** with performance monitoring
- **Database health checks** and automatic reconnection
- **Query performance optimization** with indexing strategies
- **Connection pool management** with configurable limits

#### 📊 Comprehensive Data Models
- **Subscriptions management** with Stripe integration
- **Usage tracking** with quotas and billing cycles
- **Analytics data collection** for user behavior insights
- **File metadata storage** with processing status
- **API key management** for enterprise access
- **Billing and transaction history**

#### 🏗️ Repository Pattern Implementation
- **BaseRepository** with common database operations
- **Specialized repositories** for each data model
- **Query builders** for complex database operations
- **Transaction management** for data consistency

#### 📈 Performance Optimizations
- **Materialized views** for analytics aggregation
- **Database indexes** for query performance
- **PostgreSQL functions** for complex operations
- **Connection pooling** with monitoring

### PRIORITY 3 - PAYMENT SYSTEM (COMPLETED)

### Features Implemented

#### 💳 Stripe Integration
- **Complete Stripe service** with customer management
- **Subscription lifecycle management** (create, update, cancel)
- **Payment method handling** with secure tokenization
- **Invoice management** and usage-based billing
- **Proration handling** for plan changes
- **Revenue analytics** and reporting

#### 🔄 Webhook Processing
- **Comprehensive webhook handling** for all Stripe events
- **Event verification** with signature validation
- **Idempotent processing** to prevent duplicate actions
- **Error handling** and retry mechanisms
- **Audit logging** for all payment events

#### 📊 Billing Management
- **Multi-tier subscription plans** (Free, Starter, Professional, Enterprise)
- **Usage-based billing** with quota enforcement
- **Billing portal integration** for customer self-service
- **Invoice generation** and payment tracking
- **Dunning management** for failed payments

#### 🎯 Quota Management
- **Real-time quota checking** before operations
- **Usage tracking** with automatic billing
- **Feature access control** based on subscription tier
- **Overage handling** and notifications
- **Quota enforcement middleware**

#### 💰 Revenue Analytics
- **Revenue reporting** with detailed breakdowns
- **Subscription metrics** (MRR, churn, growth)
- **Customer lifetime value** calculations
- **Payment success rates** and failure analysis

### Payment API Endpoints (`/api/payments`)
- `GET /plans` - Available subscription plans
- `POST /subscribe` - Create new subscription
- `PUT /subscription` - Update subscription
- `DELETE /subscription` - Cancel subscription
- `GET /subscription` - Get current subscription
- `POST /payment-method` - Add payment method
- `GET /invoices` - List customer invoices
- `POST /billing-portal` - Create billing portal session
- `POST /webhook` - Stripe webhook endpoint

### PRIORITY 4 - SECURITY & COMPLIANCE (COMPLETED)

### Features Implemented

#### 🛡️ Advanced Security Monitoring
- **Real-time threat detection** with pattern matching
- **SQL injection protection** with input validation
- **XSS prevention** with content sanitization
- **Path traversal detection** and blocking
- **Command injection prevention**
- **Brute force detection** with automatic IP blocking

#### 🚨 Incident Management
- **Automated security response** based on threat severity
- **Security incident logging** with detailed forensics
- **IP blocking** with configurable duration
- **Rate limit overrides** for suspicious activity
- **Enhanced monitoring** for flagged IPs
- **Security alerting** system integration

#### 📋 GDPR Compliance
- **Data subject rights** implementation (Articles 15-20)
- **Right of access** with complete data export
- **Right to rectification** with data correction
- **Right to erasure** (right to be forgotten)
- **Data portability** with structured export
- **Consent management** with withdrawal tracking

#### 🔒 Privacy & Compliance
- **Data retention policies** with automatic enforcement
- **Compliance logging** for audit trails
- **Data processing activities** documentation (Article 30)
- **User consent tracking** with legal basis
- **CCPA compliance** support
- **Privacy impact assessments**

#### 📊 Security Reporting
- **Security metrics dashboard** with real-time data
- **Compliance reports** for regulatory requirements
- **Security health checks** with recommendations
- **Incident response tracking**
- **Threat intelligence** aggregation

### Security API Endpoints (`/api/security`)

#### Security Monitoring (Admin Only)
- `GET /metrics` - Security metrics and statistics
- `GET /incidents` - Security incident list
- `GET /incidents/:id` - Specific incident details
- `PUT /incidents/:id` - Update incident status
- `GET /reports` - Generate security reports
- `GET /health-check` - Security health assessment

#### IP Management (Admin Only)
- `GET /blocked-ips` - List blocked IP addresses
- `POST /block-ip` - Block IP address manually
- `DELETE /block-ip/:ip` - Unblock IP address

#### GDPR Compliance
- `POST /gdpr/access-request` - Submit data access request
- `POST /gdpr/rectification-request` - Submit data correction request
- `POST /gdpr/erasure-request` - Submit data deletion request
- `POST /gdpr/portability-request` - Submit data export request

#### Consent Management
- `GET /consents` - Get user consent history
- `POST /consents` - Record new consent
- `DELETE /consents/:type` - Withdraw consent

#### Compliance Reporting (Admin Only)
- `GET /compliance/reports` - Generate compliance reports
- `GET /compliance/requests` - List data subject requests
- `POST /compliance/enforce-retention` - Enforce data retention
- `GET /compliance/retention-policies` - List retention policies

### Security Database Schema

#### Security Incidents Table
```sql
- incident_id (UUID, Primary Key)
- ip_address, user_agent, url, method
- threats (JSONB array)
- severity (low/medium/high/critical)
- status (detected/investigating/resolved/false_positive)
- resolution details and timestamps
```

#### Blocked IPs Table
```sql
- ip_address (Primary Key)
- reason, blocked_at, expires_at
- unblock reason and audit trail
```

#### Compliance Logs Table
```sql
- compliance_type (gdpr/ccpa/etc.)
- action, user_id, details (JSONB)
- data_subject_id for GDPR tracking
- audit timestamps
```

#### Data Subject Requests Table
```sql
- request_id (UUID)
- user_id, request_type, regulation
- status, request_details, response_data
- processing timestamps
```

### Security Middleware

#### Threat Detection
- `securityMonitoring` - Real-time threat detection
- `blockMaliciousIPs` - IP blocking enforcement
- `quotaAndTrack` - Usage quota with tracking

#### Compliance
- `gdprCompliance` - GDPR compliance tracking
- `consentValidation` - Consent requirement enforcement
- `dataRetention` - Automatic data cleanup

## 🔧 Complete System Architecture

### Technology Stack
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with connection pooling
- **Caching**: Redis for sessions and performance
- **Payments**: Stripe for subscription management
- **Security**: JWT, bcrypt, rate limiting, threat detection
- **Compliance**: GDPR, CCPA, data retention automation
- **Monitoring**: Winston logging, audit trails, security metrics

### Production Deployment
- **Environment**: Railway PostgreSQL, Heroku/Vercel deployment
- **Security**: HTTPS enforcement, security headers, CORS
- **Monitoring**: Health checks, performance metrics, error tracking
- **Compliance**: Automated data retention, audit logging
- **Scalability**: Connection pooling, Redis caching, optimized queries

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for session caching)

### Installation

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Set up environment**
```bash
cp env.example .env
# Edit .env with your configuration
```

3. **Set up database**
```bash
# Create PostgreSQL database
createdb proofpix

# Run migrations
npm run migrate
```

4. **Start development server**
```bash
npm run dev
```

### Database Migrations

```bash
# Run all pending migrations
npm run migrate

# Check migration status
node database/migrate.js status

# Rollback last migration (development only)
node database/migrate.js rollback
```

## 📋 Next Implementation Priorities

### PRIORITY 2 - DATABASE & DATA LAYER (COMPLETED)

### Features Implemented

#### 🗄️ Advanced Database Configuration
- **PostgreSQL connection pooling** with performance monitoring
- **Database health checks** and automatic reconnection
- **Query performance optimization** with indexing strategies
- **Connection pool management** with configurable limits

#### 📊 Comprehensive Data Models
- **Subscriptions management** with Stripe integration
- **Usage tracking** with quotas and billing cycles
- **Analytics data collection** for user behavior insights
- **File metadata storage** with processing status
- **API key management** for enterprise access
- **Billing and transaction history**

#### 🏗️ Repository Pattern Implementation
- **BaseRepository** with common database operations
- **Specialized repositories** for each data model
- **Query builders** for complex database operations
- **Transaction management** for data consistency

#### 📈 Performance Optimizations
- **Materialized views** for analytics aggregation
- **Database indexes** for query performance
- **PostgreSQL functions** for complex operations
- **Connection pooling** with monitoring

### PRIORITY 3 - PAYMENT SYSTEM (COMPLETED)

### Features Implemented

#### 💳 Stripe Integration
- **Complete Stripe service** with customer management
- **Subscription lifecycle management** (create, update, cancel)
- **Payment method handling** with secure tokenization
- **Invoice management** and usage-based billing
- **Proration handling** for plan changes
- **Revenue analytics** and reporting

#### 🔄 Webhook Processing
- **Comprehensive webhook handling** for all Stripe events
- **Event verification** with signature validation
- **Idempotent processing** to prevent duplicate actions
- **Error handling** and retry mechanisms
- **Audit logging** for all payment events

#### 📊 Billing Management
- **Multi-tier subscription plans** (Free, Starter, Professional, Enterprise)
- **Usage-based billing** with quota enforcement
- **Billing portal integration** for customer self-service
- **Invoice generation** and payment tracking
- **Dunning management** for failed payments

#### 🎯 Quota Management
- **Real-time quota checking** before operations
- **Usage tracking** with automatic billing
- **Feature access control** based on subscription tier
- **Overage handling** and notifications
- **Quota enforcement middleware**

#### 💰 Revenue Analytics
- **Revenue reporting** with detailed breakdowns
- **Subscription metrics** (MRR, churn, growth)
- **Customer lifetime value** calculations
- **Payment success rates** and failure analysis

### Payment API Endpoints (`/api/payments`)
- `GET /plans` - Available subscription plans
- `POST /subscribe` - Create new subscription
- `PUT /subscription` - Update subscription
- `DELETE /subscription` - Cancel subscription
- `GET /subscription` - Get current subscription
- `POST /payment-method` - Add payment method
- `GET /invoices` - List customer invoices
- `POST /billing-portal` - Create billing portal session
- `POST /webhook` - Stripe webhook endpoint

### PRIORITY 4 - SECURITY & COMPLIANCE (COMPLETED)

### Features Implemented

#### 🛡️ Advanced Security Monitoring
- **Real-time threat detection** with pattern matching
- **SQL injection protection** with input validation
- **XSS prevention** with content sanitization
- **Path traversal detection** and blocking
- **Command injection prevention**
- **Brute force detection** with automatic IP blocking

#### 🚨 Incident Management
- **Automated security response** based on threat severity
- **Security incident logging** with detailed forensics
- **IP blocking** with configurable duration
- **Rate limit overrides** for suspicious activity
- **Enhanced monitoring** for flagged IPs
- **Security alerting** system integration

#### 📋 GDPR Compliance
- **Data subject rights** implementation (Articles 15-20)
- **Right of access** with complete data export
- **Right to rectification** with data correction
- **Right to erasure** (right to be forgotten)
- **Data portability** with structured export
- **Consent management** with withdrawal tracking

#### 🔒 Privacy & Compliance
- **Data retention policies** with automatic enforcement
- **Compliance logging** for audit trails
- **Data processing activities** documentation (Article 30)
- **User consent tracking** with legal basis
- **CCPA compliance** support
- **Privacy impact assessments**

#### 📊 Security Reporting
- **Security metrics dashboard** with real-time data
- **Compliance reports** for regulatory requirements
- **Security health checks** with recommendations
- **Incident response tracking**
- **Threat intelligence** aggregation

### Security API Endpoints (`/api/security`)

#### Security Monitoring (Admin Only)
- `GET /metrics` - Security metrics and statistics
- `GET /incidents` - Security incident list
- `GET /incidents/:id` - Specific incident details
- `PUT /incidents/:id` - Update incident status
- `GET /reports` - Generate security reports
- `GET /health-check` - Security health assessment

#### IP Management (Admin Only)
- `GET /blocked-ips` - List blocked IP addresses
- `POST /block-ip` - Block IP address manually
- `DELETE /block-ip/:ip` - Unblock IP address

#### GDPR Compliance
- `POST /gdpr/access-request` - Submit data access request
- `POST /gdpr/rectification-request` - Submit data correction request
- `POST /gdpr/erasure-request` - Submit data deletion request
- `POST /gdpr/portability-request` - Submit data export request

#### Consent Management
- `GET /consents` - Get user consent history
- `POST /consents` - Record new consent
- `DELETE /consents/:type` - Withdraw consent

#### Compliance Reporting (Admin Only)
- `GET /compliance/reports` - Generate compliance reports
- `GET /compliance/requests` - List data subject requests
- `POST /compliance/enforce-retention` - Enforce data retention
- `GET /compliance/retention-policies` - List retention policies

### Security Database Schema

#### Security Incidents Table
```sql
- incident_id (UUID, Primary Key)
- ip_address, user_agent, url, method
- threats (JSONB array)
- severity (low/medium/high/critical)
- status (detected/investigating/resolved/false_positive)
- resolution details and timestamps
```

#### Blocked IPs Table
```sql
- ip_address (Primary Key)
- reason, blocked_at, expires_at
- unblock reason and audit trail
```

#### Compliance Logs Table
```sql
- compliance_type (gdpr/ccpa/etc.)
- action, user_id, details (JSONB)
- data_subject_id for GDPR tracking
- audit timestamps
```

#### Data Subject Requests Table
```sql
- request_id (UUID)
- user_id, request_type, regulation
- status, request_details, response_data
- processing timestamps
```

### Security Middleware

#### Threat Detection
- `securityMonitoring` - Real-time threat detection
- `blockMaliciousIPs` - IP blocking enforcement
- `quotaAndTrack` - Usage quota with tracking

#### Compliance
- `gdprCompliance` - GDPR compliance tracking
- `consentValidation` - Consent requirement enforcement
- `dataRetention` - Automatic data cleanup

## 🔧 Complete System Architecture

### Technology Stack
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with connection pooling
- **Caching**: Redis for sessions and performance
- **Payments**: Stripe for subscription management
- **Security**: JWT, bcrypt, rate limiting, threat detection
- **Compliance**: GDPR, CCPA, data retention automation
- **Monitoring**: Winston logging, audit trails, security metrics

### Production Deployment
- **Environment**: Railway PostgreSQL, Heroku/Vercel deployment
- **Security**: HTTPS enforcement, security headers, CORS
- **Monitoring**: Health checks, performance metrics, error tracking
- **Compliance**: Automated data retention, audit logging
- **Scalability**: Connection pooling, Redis caching, optimized queries

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for session caching)

### Installation

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Set up environment**
```bash
cp env.example .env
# Edit .env with your configuration
```

3. **Set up database**
```bash
# Create PostgreSQL database
createdb proofpix

# Run migrations
npm run migrate
```

4. **Start development server**
```bash
npm run dev
```

### Database Migrations

```bash
# Run all pending migrations
npm run migrate

# Check migration status
node database/migrate.js status

# Rollback last migration (development only)
node database/migrate.js rollback
```

## 📋 Next Implementation Priorities

### PRIORITY 2 - DATABASE & DATA LAYER (COMPLETED)

### Features Implemented

#### 🗄️ Advanced Database Configuration
- **PostgreSQL connection pooling** with performance monitoring
- **Database health checks** and automatic reconnection
- **Query performance optimization** with indexing strategies
- **Connection pool management** with configurable limits

#### 📊 Comprehensive Data Models
- **Subscriptions management** with Stripe integration
- **Usage tracking** with quotas and billing cycles
- **Analytics data collection** for user behavior insights
- **File metadata storage** with processing status
- **API key management** for enterprise access
- **Billing and transaction history**

#### 🏗️ Repository Pattern Implementation
- **BaseRepository** with common database operations
- **Specialized repositories** for each data model
- **Query builders** for complex database operations
- **Transaction management** for data consistency

#### 📈 Performance Optimizations
- **Materialized views** for analytics aggregation
- **Database indexes** for query performance
- **PostgreSQL functions** for complex operations
- **Connection pooling** with monitoring

### PRIORITY 3 - PAYMENT SYSTEM (COMPLETED)

### Features Implemented

#### 💳 Stripe Integration
- **Complete Stripe service** with customer management
- **Subscription lifecycle management** (create, update, cancel)
- **Payment method handling** with secure tokenization
- **Invoice management** and usage-based billing
- **Proration handling** for plan changes
- **Revenue analytics** and reporting

#### 🔄 Webhook Processing
- **Comprehensive webhook handling** for all Stripe events
- **Event verification** with signature validation
- **Idempotent processing** to prevent duplicate actions
- **Error handling** and retry mechanisms
- **Audit logging** for all payment events

#### 📊 Billing Management
- **Multi-tier subscription plans** (Free, Starter, Professional, Enterprise)
- **Usage-based billing** with quota enforcement
- **Billing portal integration** for customer self-service
- **Invoice generation** and payment tracking
- **Dunning management** for failed payments

#### 🎯 Quota Management
- **Real-time quota checking** before operations
- **Usage tracking** with automatic billing
- **Feature access control** based on subscription tier
- **Overage handling** and notifications
- **Quota enforcement middleware**

#### 💰 Revenue Analytics
- **Revenue reporting** with detailed breakdowns
- **Subscription metrics** (MRR, churn, growth)
- **Customer lifetime value** calculations
- **Payment success rates** and failure analysis

### Payment API Endpoints (`/api/payments`)
- `GET /plans` - Available subscription plans
- `POST /subscribe` - Create new subscription
- `PUT /subscription` - Update subscription
- `DELETE /subscription` - Cancel subscription
- `GET /subscription` - Get current subscription
- `POST /payment-method` - Add payment method
- `GET /invoices` - List customer invoices
- `POST /billing-portal` - Create billing portal session
- `POST /webhook` - Stripe webhook endpoint

### PRIORITY 4 - SECURITY & COMPLIANCE (COMPLETED)

### Features Implemented

#### 🛡️ Advanced Security Monitoring
- **Real-time threat detection** with pattern matching
- **SQL injection protection** with input validation
- **XSS prevention** with content sanitization
- **Path traversal detection** and blocking
- **Command injection prevention**
- **Brute force detection** with automatic IP blocking

#### 🚨 Incident Management
- **Automated security response** based on threat severity
- **Security incident logging** with detailed forensics
- **IP blocking** with configurable duration
- **Rate limit overrides** for suspicious activity
- **Enhanced monitoring** for flagged IPs
- **Security alerting** system integration

#### 📋 GDPR Compliance
- **Data subject rights** implementation (Articles 15-20)
- **Right of access** with complete data export
- **Right to rectification** with data correction
- **Right to erasure** (right to be forgotten)
- **Data portability** with structured export
- **Consent management** with withdrawal tracking

#### 🔒 Privacy & Compliance
- **Data retention policies** with automatic enforcement
- **Compliance logging** for audit trails
- **Data processing activities** documentation (Article 30)
- **User consent tracking** with legal basis
- **CCPA compliance** support
- **Privacy impact assessments**

#### 📊 Security Reporting
- **Security metrics dashboard** with real-time data
- **Compliance reports** for regulatory requirements
- **Security health checks** with recommendations
- **Incident response tracking**
- **Threat intelligence** aggregation

### Security API Endpoints (`/api/security`)

#### Security Monitoring (Admin Only)
- `GET /metrics` - Security metrics and statistics
- `GET /incidents` - Security incident list
- `GET /incidents/:id` - Specific incident details
- `PUT /incidents/:id` - Update incident status
- `GET /reports` - Generate security reports
- `GET /health-check` - Security health assessment

#### IP Management (Admin Only)
- `GET /blocked-ips` - List blocked IP addresses
- `POST /block-ip` - Block IP address manually
- `DELETE /block-ip/:ip` - Unblock IP address

#### GDPR Compliance
- `POST /gdpr/access-request` - Submit data access request
- `POST /gdpr/rectification-request` - Submit data correction request
- `POST /gdpr/erasure-request` - Submit data deletion request
- `POST /gdpr/portability-request` - Submit data export request

#### Consent Management
- `GET /consents` - Get user consent history
- `POST /consents` - Record new consent
- `DELETE /consents/:type` - Withdraw consent

#### Compliance Reporting (Admin Only)
- `GET /compliance/reports` - Generate compliance reports
- `GET /compliance/requests` - List data subject requests
- `POST /compliance/enforce-retention` - Enforce data retention
- `GET /compliance/retention-policies` - List retention policies

### Security Database Schema

#### Security Incidents Table
```sql
- incident_id (UUID, Primary Key)
- ip_address, user_agent, url, method
- threats (JSONB array)
- severity (low/medium/high/critical)
- status (detected/investigating/resolved/false_positive)
- resolution details and timestamps
```

#### Blocked IPs Table
```sql
- ip_address (Primary Key)
- reason, blocked_at, expires_at
- unblock reason and audit trail
```

#### Compliance Logs Table
```sql
- compliance_type (gdpr/ccpa/etc.)
- action, user_id, details (JSONB)
- data_subject_id for GDPR tracking
- audit timestamps
```

#### Data Subject Requests Table
```sql
- request_id (UUID)
- user_id, request_type, regulation
- status, request_details, response_data
- processing timestamps
```

### Security Middleware

#### Threat Detection
- `securityMonitoring` - Real-time threat detection
- `blockMaliciousIPs` - IP blocking enforcement
- `quotaAndTrack` - Usage quota with tracking

#### Compliance
- `gdprCompliance` - GDPR compliance tracking
- `consentValidation` - Consent requirement enforcement
- `dataRetention` - Automatic data cleanup

## 🔧 Complete System Architecture

### Technology Stack
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with connection pooling
- **Caching**: Redis for sessions and performance
- **Payments**: Stripe for subscription management
- **Security**: JWT, bcrypt, rate limiting, threat detection
- **Compliance**: GDPR, CCPA, data retention automation
- **Monitoring**: Winston logging, audit trails, security metrics

### Production Deployment
- **Environment**: Railway PostgreSQL, Heroku/Vercel deployment
- **Security**: HTTPS enforcement, security headers, CORS
- **Monitoring**: Health checks, performance metrics, error tracking
- **Compliance**: Automated data retention, audit logging
- **Scalability**: Connection pooling, Redis caching, optimized queries

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for session caching)

### Installation

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Set up environment**
```bash
cp env.example .env
# Edit .env with your configuration
```

3. **Set up database**
```bash
# Create PostgreSQL database
createdb proofpix

# Run migrations
npm run migrate
```

4. **Start development server**
```bash
npm run dev
```

### Database Migrations

```bash
# Run all pending migrations
npm run migrate

# Check migration status
node database/migrate.js status

# Rollback last migration (development only)
node database/migrate.js rollback
```

## 📋 Next Implementation Priorities

### PRIORITY 2 - DATABASE & DATA LAYER (COMPLETED)

### Features Implemented

#### 🗄️ Advanced Database Configuration
- **PostgreSQL connection pooling** with performance monitoring
- **Database health checks** and automatic reconnection
- **Query performance optimization** with indexing strategies
- **Connection pool management** with configurable limits

#### 📊 Comprehensive Data Models
- **Subscriptions management** with Stripe integration
- **Usage tracking** with quotas and billing cycles
- **Analytics data collection** for user behavior insights
- **File metadata storage** with processing status
- **API key management** for enterprise access
- **Billing and transaction history**

#### 🏗️ Repository Pattern Implementation
- **BaseRepository** with common database operations
- **Specialized repositories** for each data model
- **Query builders** for complex database operations
- **Transaction management** for data consistency

#### 📈 Performance Optimizations
- **Materialized views** for analytics aggregation
- **Database indexes** for query performance
- **PostgreSQL functions** for complex operations
- **Connection pooling** with monitoring

### PRIORITY 3 - PAYMENT SYSTEM (COMPLETED)

### Features Implemented

#### 💳 Stripe Integration
- **Complete Stripe service** with customer management
- **Subscription lifecycle management** (create, update, cancel)
- **Payment method handling** with secure tokenization
- **Invoice management** and usage-based billing
- **Proration handling** for plan changes
- **Revenue analytics** and reporting

#### 🔄 Webhook Processing
- **Comprehensive webhook handling** for all Stripe events
- **Event verification** with signature validation
- **Idempotent processing** to prevent duplicate actions
- **Error handling** and retry mechanisms
- **Audit logging** for all payment events

#### 📊 Billing Management
- **Multi-tier subscription plans** (Free, Starter, Professional, Enterprise)
- **Usage-based billing** with quota enforcement
- **Billing portal integration** for customer self-service
- **Invoice generation** and payment tracking
- **Dunning management** for failed payments

#### 🎯 Quota Management
- **Real-time quota checking** before operations
- **Usage tracking** with automatic billing
- **Feature access control** based on subscription tier
- **Overage handling** and notifications
- **Quota enforcement middleware**

#### 💰 Revenue Analytics
- **Revenue reporting** with detailed breakdowns
- **Subscription metrics** (MRR, churn, growth)
- **Customer lifetime value** calculations
- **Payment success rates** and failure analysis

### Payment API Endpoints (`/api/payments`)
- `GET /plans` - Available subscription plans
- `POST /subscribe` - Create new subscription
- `PUT /subscription` - Update subscription
- `DELETE /subscription` - Cancel subscription
- `GET /subscription` - Get current subscription
- `POST /payment-method` - Add payment method
- `GET /invoices` - List customer invoices
- `POST /billing-portal` - Create billing portal session
- `POST /webhook` - Stripe webhook endpoint

### PRIORITY 4 - SECURITY & COMPLIANCE (COMPLETED)

### Features Implemented

#### 🛡️ Advanced Security Monitoring
- **Real-time threat detection** with pattern matching
- **SQL injection protection** with input validation
- **XSS prevention** with content sanitization
- **Path traversal detection** and blocking
- **Command injection prevention**
- **Brute force detection** with automatic IP blocking

#### 🚨 Incident Management
- **Automated security response** based on threat severity
- **Security incident logging** with detailed forensics
- **IP blocking** with configurable duration
- **Rate limit overrides** for suspicious activity
- **Enhanced monitoring** for flagged IPs
- **Security alerting** system integration

#### 📋 GDPR Compliance
- **Data subject rights** implementation (Articles 15-20)
- **Right of access** with complete data export
- **Right to rectification** with data correction
- **Right to erasure** (right to be forgotten)
- **Data portability** with structured export
- **Consent management** with withdrawal tracking

#### 🔒 Privacy & Compliance
- **Data retention policies** with automatic enforcement
- **Compliance logging** for audit trails
- **Data processing activities** documentation (Article 30)
- **User consent tracking** with legal basis
- **CCPA compliance** support
- **Privacy impact assessments**

#### 📊 Security Reporting
- **Security metrics dashboard** with real-time data
- **Compliance reports** for regulatory requirements
- **Security health checks** with recommendations
- **Incident response tracking**
- **Threat intelligence** aggregation

### Security API Endpoints (`/api/security`)

#### Security Monitoring (Admin Only)
- `GET /metrics` - Security metrics and statistics
- `GET /incidents` - Security incident list
- `GET /incidents/:id` - Specific incident details
- `PUT /incidents/:id` - Update incident status
- `GET /reports` - Generate security reports
- `GET /health-check` - Security health assessment

#### IP Management (Admin Only)
- `GET /blocked-ips` - List blocked IP addresses
- `POST /block-ip` - Block IP address manually
- `DELETE /block-ip/:ip` - Unblock IP address

#### GDPR Compliance
- `POST /gdpr/access-request` - Submit data access request
- `POST /gdpr/rectification-request` - Submit data correction request
- `POST /gdpr/erasure-request` - Submit data deletion request
- `POST /gdpr/portability-request` - Submit data export request

#### Consent Management
- `GET /consents` - Get user consent history
- `POST /consents` - Record new consent
- `DELETE /consents/:type` - Withdraw consent

#### Compliance Reporting (Admin Only)
- `GET /compliance/reports` - Generate compliance reports
- `GET /compliance/requests` - List data subject requests
- `POST /compliance/enforce-retention` - Enforce data retention
- `GET /compliance/retention-policies` - List retention policies

### Security Database Schema

#### Security Incidents Table
```sql
- incident_id (UUID, Primary Key)
- ip_address, user_agent, url, method
- threats (JSONB array)
- severity (low/medium/high/critical)
- status (detected/investigating/resolved/false_positive)
- resolution details and timestamps
```

#### Blocked IPs Table
```sql
- ip_address (Primary Key)
- reason, blocked_at, expires_at
- unblock reason and audit trail
```

#### Compliance Logs Table
```sql
- compliance_type (gdpr/ccpa/etc.)
- action, user_id, details (JSONB)
- data_subject_id for GDPR tracking
- audit timestamps
```

#### Data Subject Requests Table
```sql
- request_id (UUID)
- user_id, request_type, regulation
- status, request_details, response_data
- processing timestamps
```

### Security Middleware

#### Threat Detection
- `securityMonitoring` - Real-time threat detection
- `blockMaliciousIPs` - IP blocking enforcement
- `quotaAndTrack` - Usage quota with tracking

#### Compliance
- `gdprCompliance` - GDPR compliance tracking
- `consentValidation` - Consent requirement enforcement
- `dataRetention` - Automatic data cleanup

## 🔧 Complete System Architecture

### Technology Stack
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with connection pooling
- **Caching**: Redis for sessions and performance
- **Payments**: Stripe for subscription management
- **Security**: JWT, bcrypt, rate limiting, threat detection
- **Compliance**: GDPR, CCPA, data retention automation
- **Monitoring**: Winston logging, audit trails, security metrics

### Production Deployment
- **Environment**: Railway PostgreSQL, Heroku/Vercel deployment
- **Security**: HTTPS enforcement, security headers, CORS
- **Monitoring**: Health checks, performance metrics, error tracking
- **Compliance**: Automated data retention, audit logging
- **Scalability**: Connection pooling, Redis caching, optimized queries

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for session caching)

### Installation

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Set up environment**
```bash
cp env.example .env
# Edit .env with your configuration
```

3. **Set up database**
```bash
# Create PostgreSQL database
createdb proofpix

# Run migrations
npm run migrate
```

4. **Start development server**
```bash
npm run dev
```

### Database Migrations

```bash
# Run all pending migrations
npm run migrate

# Check migration status
node database/migrate.js status

# Rollback last migration (development only)
node database/migrate.js rollback
```

## 📋 Next Implementation Priorities

### PRIORITY 2 - DATABASE & DATA LAYER (COMPLETED)

### Features Implemented

#### 🗄️ Advanced Database Configuration
- **PostgreSQL connection pooling** with performance monitoring
- **Database health checks** and automatic reconnection
- **Query performance optimization** with indexing strategies
- **Connection pool management** with configurable limits

#### 📊 Comprehensive Data Models
- **Subscriptions management** with Stripe integration
- **Usage tracking** with quotas and billing cycles
- **Analytics data collection** for user behavior insights
- **File metadata storage** with processing status
- **API key management** for enterprise access
- **Billing and transaction history**

#### 🏗️ Repository Pattern Implementation
- **BaseRepository** with common database operations
- **Specialized repositories** for each data model
- **Query builders** for complex database operations
- **Transaction management** for data consistency

#### 📈 Performance Optimizations
- **Materialized views** for analytics aggregation
- **Database indexes** for query performance
- **PostgreSQL functions** for complex operations
- **Connection pooling** with monitoring

### PRIORITY 3 - PAYMENT SYSTEM (COMPLETED)

### Features Implemented

#### 💳 Stripe Integration
- **Complete Stripe service** with customer management
- **Subscription lifecycle management** (create, update, cancel)
- **Payment method handling** with secure tokenization
- **Invoice management** and usage-based billing
- **Proration handling** for plan changes
- **Revenue analytics** and reporting

#### 🔄 Webhook Processing
- **Comprehensive webhook handling** for all Stripe events
- **Event verification** with signature validation
- **Idempotent processing** to prevent duplicate actions
- **Error handling** and retry mechanisms
- **Audit logging** for all payment events

#### 📊 Billing Management
- **Multi-tier subscription plans** (Free, Starter, Professional, Enterprise)
- **Usage-based billing** with quota enforcement
- **Billing portal integration** for customer self-service
- **Invoice generation** and payment tracking
- **Dunning management** for failed payments

#### 🎯 Quota Management
- **Real-time quota checking** before operations
- **Usage tracking** with automatic billing
- **Feature access control** based on subscription tier
- **Overage handling** and notifications
- **Quota enforcement middleware**

#### 💰 Revenue Analytics
- **Revenue reporting** with detailed breakdowns
- **Subscription metrics** (MRR, churn, growth)
- **Customer lifetime value** calculations
- **Payment success rates** and failure analysis

### Payment API Endpoints (`/api/payments`)
- `GET /plans` - Available subscription plans
- `POST /subscribe` - Create new subscription
- `PUT /subscription` - Update subscription
- `DELETE /subscription` - Cancel subscription
- `GET /subscription` - Get current subscription
- `POST /payment-method` - Add payment method
- `GET /invoices` - List customer invoices
- `POST /billing-portal` - Create billing portal session
- `POST /webhook` - Stripe webhook endpoint

### PRIORITY 4 - SECURITY & COMPLIANCE (COMPLETED)

### Features Implemented

#### 🛡️ Advanced Security Monitoring
- **Real-time threat detection** with pattern matching
- **SQL injection protection** with input validation
- **XSS prevention** with content sanitization
- **Path traversal detection** and blocking
- **Command injection prevention**
- **Brute force detection** with automatic IP blocking

#### 🚨 Incident Management
- **Automated security response** based on threat severity
- **Security incident logging** with detailed forensics
- **IP blocking** with configurable duration
- **Rate limit overrides** for suspicious activity
- **Enhanced monitoring** for flagged IPs
- **Security alerting** system integration

#### 📋 GDPR Compliance
- **Data subject rights** implementation (Articles 15-20)
- **Right of access** with complete data export
- **Right to rectification** with data correction
- **Right to erasure** (right to be forgotten)
- **Data portability** with structured export
- **Consent management** with withdrawal tracking

#### 🔒 Privacy & Compliance
- **Data retention policies** with automatic enforcement
- **Compliance logging** for audit trails
- **Data processing activities** documentation (Article 30)
- **User consent tracking** with legal basis
- **CCPA compliance** support
- **Privacy impact assessments**

#### 📊 Security Reporting
- **Security metrics dashboard** with real-time data
- **Compliance reports** for regulatory requirements
- **Security health checks** with recommendations
- **Incident response tracking**
- **Threat intelligence** aggregation

### Security API Endpoints (`/api/security`)

#### Security Monitoring (Admin Only)
- `GET /metrics` - Security metrics and statistics
- `GET /incidents` - Security incident list
- `GET /incidents/:id` - Specific incident details
- `PUT /incidents/:id` - Update incident status
- `GET /reports` - Generate security reports
- `GET /health-check` - Security health assessment

#### IP Management (Admin Only)
- `GET /blocked-ips` - List blocked IP addresses
- `POST /block-ip` - Block IP address manually
- `DELETE /block-ip/:ip` - Unblock IP address

#### GDPR Compliance
- `POST /gdpr/access-request` - Submit data access request
- `POST /gdpr/rectification-request` - Submit data correction request
- `POST /gdpr/erasure-request` - Submit data deletion request
- `POST /gdpr/portability-request` - Submit data export request

#### Consent Management
- `GET /consents` - Get user consent history
- `POST /consents` - Record new consent
- `DELETE /consents/:type` - Withdraw consent

#### Compliance Reporting (Admin Only)
- `GET /compliance/reports` - Generate compliance reports
- `GET /compliance/requests` - List data subject requests
- `POST /compliance/enforce-retention` - Enforce data retention
- `GET /compliance/retention-policies` - List retention policies

### Security Database Schema

#### Security Incidents Table
```sql
- incident_id (UUID, Primary Key)
- ip_address, user_agent, url, method
- threats (JSONB array)
- severity (low/medium/high/critical)
- status (detected/investigating/resolved/false_positive)
- resolution details and timestamps
```

#### Blocked IPs Table
```sql
- ip_address (Primary Key)
- reason, blocked_at, expires_at
- unblock reason and audit trail
```

#### Compliance Logs Table
```sql
- compliance_type (gdpr/ccpa/etc.)
- action, user_id, details (JSONB)
- data_subject_id for GDPR tracking
- audit timestamps
```

#### Data Subject Requests Table
```sql
- request_id (UUID)
- user_id, request_type, regulation
- status, request_details, response_data
- processing timestamps
```

### Security Middleware

#### Threat Detection
- `securityMonitoring` - Real-time threat detection
- `blockMaliciousIPs` - IP blocking enforcement
- `quotaAndTrack` - Usage quota with tracking

#### Compliance
- `gdprCompliance` - GDPR compliance tracking
- `consentValidation` - Consent requirement enforcement
- `dataRetention` - Automatic data cleanup

## 🔧 Complete System Architecture

### Technology Stack
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with connection pooling
- **Caching**: Redis for sessions and performance
- **Payments**: Stripe for subscription management
- **Security**: JWT, bcrypt, rate limiting, threat detection
- **Compliance**: GDPR, CCPA, data retention automation
- **Monitoring**: Winston logging, audit trails, security metrics

### Production Deployment
- **Environment**: Railway PostgreSQL, Heroku/Vercel deployment
- **Security**: HTTPS enforcement, security headers, CORS
- **Monitoring**: Health checks, performance metrics, error tracking
- **Compliance**: Automated data retention, audit logging
- **Scalability**: Connection pooling, Redis caching, optimized queries

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for session caching)

### Installation

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Set up environment**
```bash
cp env.example .env
# Edit .env with your configuration
```

3. **Set up database**
```bash
# Create PostgreSQL database
createdb proofpix

# Run migrations
npm run migrate
```

4. **Start development server**
```bash
npm run dev
```

### Database Migrations

```bash
# Run all pending migrations
npm run migrate

# Check migration status
node database/migrate.js status

# Rollback last migration (development only)
node database/migrate.js rollback
```

## 📋 Next Implementation Priorities

### PRIORITY 2 - DATABASE & DATA LAYER (COMPLETED)

### Features Implemented

#### 🗄️ Advanced Database Configuration
- **PostgreSQL connection pooling** with performance monitoring
- **Database health checks** and automatic reconnection
- **Query performance optimization** with indexing strategies
- **Connection pool management** with configurable limits

#### 📊 Comprehensive Data Models
- **Subscriptions management** with Stripe integration
- **Usage tracking** with quotas and billing cycles
- **Analytics data collection** for user behavior insights
- **File metadata storage** with processing status
- **API key management** for enterprise access
- **Billing and transaction history**

#### 🏗️ Repository Pattern Implementation
- **BaseRepository** with common database operations
- **Specialized repositories** for each data model
- **Query builders** for complex database operations
- **Transaction management** for data consistency

#### 📈 Performance Optimizations
- **Materialized views** for analytics aggregation
- **Database indexes** for query performance
- **PostgreSQL functions** for complex operations
- **Connection pooling** with monitoring

### PRIORITY 3 - PAYMENT SYSTEM (COMPLETED)

### Features Implemented

#### 💳 Stripe Integration
- **Complete Stripe service** with customer management
- **Subscription lifecycle management** (create, update, cancel)
- **Payment method handling** with secure tokenization
- **Invoice management** and usage-based billing
- **Proration handling** for plan changes
- **Revenue analytics** and reporting

#### 🔄 Webhook Processing
- **Comprehensive webhook handling** for all Stripe events
- **Event verification** with signature validation
- **Idempotent processing** to prevent duplicate actions
- **Error handling** and retry mechanisms
- **Audit logging** for all payment events

#### 📊 Billing Management
- **Multi-tier subscription plans** (Free, Starter, Professional, Enterprise)
- **Usage-based billing** with quota enforcement
- **Billing portal integration** for customer self-service
- **Invoice generation** and payment tracking
- **Dunning management** for failed payments

#### 🎯 Quota Management
- **Real-time quota checking** before operations
- **Usage tracking** with automatic billing
- **Feature access control** based on subscription tier
- **Overage handling** and notifications
- **Quota enforcement middleware**

#### 💰 Revenue Analytics
- **Revenue reporting** with detailed breakdowns
- **Subscription metrics** (MRR, churn, growth)
- **Customer lifetime value** calculations
- **Payment success rates** and failure analysis

### Payment API Endpoints (`/api/payments`)
- `GET /plans` - Available subscription plans
- `POST /subscribe` - Create new subscription
- `PUT /subscription` - Update subscription
- `DELETE /subscription` - Cancel subscription
- `GET /subscription` - Get current subscription
- `POST /payment-method` - Add payment method
- `GET /invoices` - List customer invoices
- `POST /billing-portal` - Create billing portal session
- `POST /webhook` - Stripe webhook endpoint

### PRIORITY 4 - SECURITY & COMPLIANCE (COMPLETED)

### Features Implemented

#### 🛡️ Advanced Security Monitoring
- **Real-time threat detection** with pattern matching
- **SQL injection protection** with input validation
- **XSS prevention** with content sanitization
- **Path traversal detection** and blocking
- **Command injection prevention**
- **Brute force detection** with automatic IP blocking

#### 🚨 Incident Management
- **Automated security response** based on threat severity
- **Security incident logging** with detailed forensics
- **IP blocking** with configurable duration
- **Rate limit overrides** for suspicious activity
- **Enhanced monitoring** for flagged IPs
- **Security alerting** system integration

#### 📋 GDPR Compliance
- **Data subject rights** implementation (Articles 15-20)
- **Right of access** with complete data export
- **Right to rectification** with data correction
- **Right to erasure** (right to be forgotten)
- **Data portability** with structured export
- **Consent management** with withdrawal tracking

#### 🔒 Privacy & Compliance
- **Data retention policies** with automatic enforcement
- **Compliance logging** for audit trails
- **Data processing activities** documentation (Article 30)
- **User consent tracking** with legal basis
- **CCPA compliance** support
- **Privacy impact assessments**

#### 📊 Security Reporting
- **Security metrics dashboard** with real-time data
- **Compliance reports** for regulatory requirements
- **Security health checks** with recommendations
- **Incident response tracking**
- **Threat intelligence** aggregation

### Security API Endpoints (`/api/security`)

#### Security Monitoring (Admin Only)
- `GET /metrics` - Security metrics and statistics
- `GET /incidents` - Security incident list
- `GET /incidents/:id` - Specific incident details
- `PUT /incidents/:id` - Update incident status
- `GET /reports` - Generate security reports
- `GET /health-check` - Security health assessment

#### IP Management (Admin Only)
- `GET /blocked-ips` - List blocked IP addresses
- `POST /block-ip` - Block IP address manually
- `DELETE /block-ip/:ip` - Unblock IP address

#### GDPR Compliance
- `POST /gdpr/access-request` - Submit data access request
- `POST /gdpr/rectification-request` - Submit data correction request
- `POST /gdpr/erasure-request` - Submit data deletion request
- `POST /gdpr/portability-request` - Submit data export request

#### Consent Management
- `GET /consents` - Get user consent history
- `POST /consents` - Record new consent
- `DELETE /consents/:type` - Withdraw consent

#### Compliance Reporting (Admin Only)
- `GET /compliance/reports` - Generate compliance reports
- `GET /compliance/requests` - List data subject requests
- `POST /compliance/enforce-retention` - Enforce data retention
- `GET /compliance/retention-policies` - List retention policies

### Security Database Schema

#### Security Incidents Table
```sql
- incident_id (UUID, Primary Key)
- ip_address, user_agent, url, method
- threats (JSONB array)
- severity (low/medium/high/critical)
- status (detected/investigating/resolved/false_positive)
- resolution details and timestamps
```

#### Blocked IPs Table
```sql
- ip_address (Primary Key)
- reason, blocked_at, expires_at
- unblock reason and audit trail
```

#### Compliance Logs Table
```sql
- compliance_type (gdpr/ccpa/etc.)
- action, user_id, details (JSONB)
- data_subject_id for GDPR tracking
- audit timestamps
```

#### Data Subject Requests Table
```sql
- request_id (UUID)
- user_id, request_type, regulation
- status, request_details, response_data
- processing timestamps
```

### Security Middleware

#### Threat Detection
- `securityMonitoring` - Real-time threat detection
- `blockMaliciousIPs` - IP blocking enforcement
- `quotaAndTrack` - Usage quota with tracking

#### Compliance
- `gdprCompliance` - GDPR compliance tracking
- `consentValidation` - Consent requirement enforcement
- `dataRetention` - Automatic data cleanup

## 🔧 Complete System Architecture

### Technology Stack
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with connection pooling
- **Caching**: Redis for sessions and performance
- **Payments**: Stripe for subscription management
- **Security**: JWT, bcrypt, rate limiting, threat detection
- **Compliance**: GDPR, CCPA, data retention automation
- **Monitoring**: Winston logging, audit trails, security metrics

### Production Deployment
- **Environment**: Railway PostgreSQL, Heroku/Vercel deployment
- **Security**: HTTPS enforcement, security headers, CORS
- **Monitoring**: Health checks, performance metrics, error tracking
- **Compliance**: Automated data retention, audit logging
- **Scalability**: Connection pooling, Redis caching, optimized queries

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for session caching)

### Installation

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Set up environment**
```bash
cp env.example .env
# Edit .env with your configuration
```

3. **Set up database**
```bash
# Create PostgreSQL database
createdb proofpix

# Run migrations
npm run migrate
```

4. **Start development server**
```bash
npm run dev
```

### Database Migrations

```bash
# Run all pending migrations
npm run migrate

# Check migration status
node database/migrate.js status

# Rollback last migration (development only)
node database/migrate.js rollback
```

## 📋 Next Implementation Priorities

### PRIORITY 2 - DATABASE & DATA LAYER (COMPLETED)

### Features Implemented

#### 🗄️ Advanced Database Configuration
- **PostgreSQL connection pooling** with performance monitoring
- **Database health checks** and automatic reconnection
- **Query performance optimization** with indexing strategies
- **Connection pool management** with configurable limits

#### 📊 Comprehensive Data Models
- **Subscriptions management** with Stripe integration
- **Usage tracking** with quotas and billing cycles
- **Analytics data collection** for user behavior insights
- **File metadata storage** with processing status
- **API key management** for enterprise access
- **Billing and transaction history**

#### 🏗️ Repository Pattern Implementation
- **BaseRepository** with common database operations
- **Specialized repositories** for each data model
- **Query builders** for complex database operations
- **Transaction management** for data consistency

#### 📈 Performance Optimizations
- **Materialized views** for analytics aggregation
- **Database indexes** for query performance
- **PostgreSQL functions** for complex operations
- **Connection pooling** with monitoring

### PRIORITY 3 - PAYMENT SYSTEM (COMPLETED)

### Features Implemented

#### 💳 Stripe Integration
- **Complete Stripe service** with customer management
- **Subscription lifecycle management** (create, update, cancel)
- **Payment method handling** with secure tokenization
- **Invoice management** and usage-based billing
- **Proration handling** for plan changes
- **Revenue analytics** and reporting

#### 🔄 Webhook Processing
- **Comprehensive webhook handling** for all Stripe events
- **Event verification** with signature validation
- **Idempotent processing** to prevent duplicate actions
- **Error handling** and retry mechanisms
- **Audit logging** for all payment events

#### 📊 Billing Management
- **Multi-tier subscription plans** (Free, Starter, Professional, Enterprise)
- **Usage-based billing** with quota enforcement
- **Billing portal integration** for customer self-service
- **Invoice generation** and payment tracking
- **Dunning management** for failed payments

#### 🎯 Quota Management
- **Real-time quota checking** before operations
- **Usage tracking** with automatic billing
- **Feature access control** based on subscription tier
- **Overage handling** and notifications
- **Quota enforcement middleware**

#### 💰 Revenue Analytics
- **Revenue reporting** with detailed breakdowns
- **Subscription metrics** (MRR, churn, growth)
- **Customer lifetime value** calculations
- **Payment success rates** and failure analysis

### Payment API Endpoints (`/api/payments`)
- `GET /plans` - Available subscription plans
- `POST /subscribe` - Create new subscription
- `PUT /subscription` - Update subscription
- `DELETE /subscription` - Cancel subscription
- `GET /subscription` - Get current subscription
- `POST /payment-method` - Add payment method
- `GET /invoices` - List customer invoices
- `POST /billing-portal` - Create billing portal session
- `POST /webhook` - Stripe webhook endpoint

### PRIORITY 4 - SECURITY & COMPLIANCE (COMPLETED)

### Features Implemented

#### 🛡️ Advanced Security Monitoring
- **Real-time threat detection** with pattern matching
- **SQL injection protection** with input validation
- **XSS prevention** with content sanitization
- **Path traversal detection** and blocking
- **Command injection prevention**
- **Brute force detection** with automatic IP blocking

#### 🚨 Incident Management
- **Automated security response** based on threat severity
- **Security incident logging** with detailed forensics
- **IP blocking** with configurable duration
- **Rate limit overrides** for suspicious activity
- **Enhanced monitoring** for flagged IPs
- **Security alerting** system integration

#### 📋 GDPR Compliance
- **Data subject rights** implementation (Articles 15-20)
- **Right of access** with complete data export
- **Right to rectification** with data correction
- **Right to erasure** (right to be forgotten)
- **Data portability** with structured export
- **Consent management** with withdrawal tracking

#### 🔒 Privacy & Compliance
- **Data retention policies** with automatic enforcement
- **Compliance logging** for audit trails
- **Data processing activities** documentation (Article 30)
- **User consent tracking** with legal basis
- **CCPA compliance** support
- **Privacy impact assessments**

#### 📊 Security Reporting
- **Security metrics dashboard** with real-time data
- **Compliance reports** for regulatory requirements
- **Security health checks** with recommendations
- **Incident response tracking**
- **Threat intelligence** aggregation

### Security API Endpoints (`/api/security`)

#### Security Monitoring (Admin Only)
- `GET /metrics` - Security metrics and statistics
- `GET /incidents` - Security incident list
- `GET /incidents/:id` - Specific incident details
- `PUT /incidents/:id` - Update incident status
- `GET /reports` - Generate security reports
- `GET /health-check` - Security health assessment

#### IP Management (Admin Only)
- `GET /blocked-ips` - List blocked IP addresses
- `POST /block-ip` - Block IP address manually
- `DELETE /block-ip/:ip` - Unblock IP address

#### GDPR Compliance
- `POST /gdpr/access-request` - Submit data access request
- `POST /gdpr/rectification-request` - Submit data correction request
- `POST /gdpr/erasure-request` - Submit data deletion request
- `POST /gdpr/portability-request` - Submit data export request

#### Consent Management
- `GET /consents` - Get user consent history
- `POST /consents` - Record new consent
- `DELETE /consents/:type` - Withdraw consent

#### Compliance Reporting (Admin Only)
- `GET /compliance/reports` - Generate compliance reports
- `GET /compliance/requests` - List data subject requests
- `POST /compliance/enforce-retention` - Enforce data retention
- `GET /compliance/retention-policies` - List retention policies

### Security Database Schema

#### Security Incidents Table
```sql
- incident_id (UUID, Primary Key)
- ip_address, user_agent, url, method
- threats (JSONB array)
- severity (low/medium/high/critical)
- status (detected/investigating/resolved/false_positive)
- resolution details and timestamps
```

#### Blocked IPs Table
```sql
- ip_address (Primary Key)
- reason, blocked_at, expires_at
- unblock reason and audit trail
```

#### Compliance Logs Table
```sql
- compliance_type (gdpr/ccpa/etc.)
- action, user_id, details (JSONB)
- data_subject_id for GDPR tracking
- audit timestamps
```

#### Data Subject Requests Table
```sql
- request_id (UUID)
- user_id, request_type, regulation
- status, request_details, response_data
- processing timestamps
```

### Security Middleware

#### Threat Detection
- `securityMonitoring` - Real-time threat detection
- `blockMaliciousIPs` - IP blocking enforcement
- `quotaAndTrack` - Usage quota with tracking

#### Compliance
- `gdprCompliance` - GDPR compliance tracking
- `consentValidation` - Consent requirement enforcement
- `dataRetention` - Automatic data cleanup

## 🔧 Complete System Architecture

### Technology Stack
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with connection pooling
- **Caching**: Redis for sessions and performance
- **Payments**: Stripe for subscription management
- **Security**: JWT, bcrypt, rate limiting, threat detection
- **Compliance**: GDPR, CCPA, data retention automation
- **Monitoring**: Winston logging, audit trails, security metrics

### Production Deployment
- **Environment**: Railway PostgreSQL, Heroku/Vercel deployment
- **Security**: HTTPS enforcement, security headers, CORS
- **Monitoring**: Health checks, performance metrics, error tracking
- **Compliance**: Automated data retention, audit logging
- **Scalability**: Connection pooling, Redis caching, optimized queries

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for session caching)

### Installation

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Set up environment**
```bash
cp env.example .env
# Edit .env with your configuration
```

3. **Set up database**
```bash
# Create PostgreSQL database
createdb proofpix

# Run migrations
npm run migrate
```

4. **Start development server**
```bash
npm run dev
```

### Database Migrations

```bash
# Run all pending migrations
npm run migrate

# Check migration status
node database/migrate.js status

# Rollback last migration (development only)
node database/migrate.js rollback
```

## 📋 Next Implementation Priorities

### PRIORITY 2 - DATABASE & DATA LAYER (COMPLETED)

### Features Implemented

#### 🗄️ Advanced Database Configuration
- **PostgreSQL connection pooling** with performance monitoring
- **Database health checks** and automatic reconnection
- **Query performance optimization** with indexing strategies
- **Connection pool management** with configurable limits

#### 📊 Comprehensive Data Models
- **Subscriptions management** with Stripe integration
- **Usage tracking** with quotas and billing cycles
- **Analytics data collection** for user behavior insights
- **File metadata storage** with processing status
- **API key management** for enterprise access
- **Billing and transaction history**

#### 🏗️ Repository Pattern Implementation
- **BaseRepository** with common database operations
- **Specialized repositories** for each data model
- **Query builders** for complex database operations
- **Transaction management** for data consistency

#### 📈 Performance Optimizations
- **Materialized views** for analytics aggregation
- **Database indexes** for query performance
- **PostgreSQL functions** for complex operations
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 📚 API Documentation

Comprehensive API documentation is available in the enterprise documentation:
- Authentication API Reference
- Security Architecture Overview
- Deployment Guide

## 🤝 Contributing

This is an enterprise-grade system. All changes should:
1. Include comprehensive tests
2. Follow security best practices
3. Update documentation
4. Pass security review

## 📄 License

Enterprise License - ProofPix 2025 