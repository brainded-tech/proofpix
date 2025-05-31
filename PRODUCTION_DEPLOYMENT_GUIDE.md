# 🚀 Production Deployment Guide - Hybrid Architecture

## 📋 **Overview**

This guide covers the complete production deployment of the hybrid architecture system with:
- **Railway**: Backend API with Redis (api.proofpixapp.com)
- **Render**: Frontend React app (upload.proofpixapp.com)
- **Hybrid Architecture**: Privacy + Collaboration modes

---

## 🔧 **Step 1: Railway Backend Deployment**

### **1.1 Add Redis Service**

1. **Login to Railway Dashboard**:
   ```bash
   https://railway.app/dashboard
   ```

2. **Add Redis to Your Project**:
   - Click "New Service" → "Database" → "Redis"
   - Connect to your existing backend project
   - Note the Redis connection details

3. **Get Redis Environment Variables**:
   ```bash
   REDIS_HOST=${REDIS_HOST}
   REDIS_PORT=${REDIS_PORT}
   REDIS_PASSWORD=${REDIS_PASSWORD}
   REDIS_URL=${REDIS_URL}
   ```

### **1.2 Update Backend Environment Variables**

Add these to your Railway backend service:

```bash
# Redis Configuration
REDIS_HOST=${REDIS_HOST}
REDIS_PORT=${REDIS_PORT}
REDIS_PASSWORD=${REDIS_PASSWORD}
REDIS_URL=${REDIS_URL}

# Hybrid Architecture
EPHEMERAL_SESSION_DURATION=86400
EPHEMERAL_MAX_FILE_SIZE=52428800
EPHEMERAL_CLEANUP_INTERVAL=3600000
ENABLE_COLLABORATION_MODE=true

# Frontend URL
FRONTEND_URL=https://upload.proofpixapp.com

# OAuth Configuration
OAUTH_BASE_URL=https://api.proofpixapp.com/api/oauth

# Security
CORS_ORIGIN=https://upload.proofpixapp.com
```

### **1.3 Deploy Backend Updates**

```bash
# Commit and push hybrid architecture changes
git add .
git commit -m "Add hybrid architecture with ephemeral processing"
git push origin main
```

---

## 🎨 **Step 2: Render Frontend Deployment**

### **2.1 Update Environment Variables**

Add to your Render frontend service:

```bash
# API Configuration
REACT_APP_API_URL=https://api.proofpixapp.com

# OAuth Configuration
REACT_APP_OAUTH_CLIENT_ID=your_oauth_client_id
REACT_APP_OAUTH_REDIRECT_URI=https://upload.proofpixapp.com/auth/callback

# Feature Flags
REACT_APP_ENABLE_COLLABORATION=true
REACT_APP_ENABLE_TEAMS=true
```

### **2.2 Deploy Frontend Updates**

```bash
# Commit and push frontend changes
git add .
git commit -m "Add hybrid architecture UI components"
git push origin main
```

---

## 🔒 **Step 3: Google Cloud OAuth Configuration**

### **3.1 Update OAuth Redirect URIs**

In Google Cloud Console → APIs & Services → Credentials:

```bash
# Authorized JavaScript origins
https://upload.proofpixapp.com

# Authorized redirect URIs
https://upload.proofpixapp.com/auth/callback
https://api.proofpixapp.com/api/oauth/callback
https://api.proofpixapp.com/api/oauth/collaboration/callback
```

### **3.2 Update OAuth Scopes**

Add collaboration scopes to your OAuth application:

```bash
# Standard scopes
openid
email
profile

# Collaboration scopes
collaboration:create
collaboration:join
ephemeral:process
ephemeral:share
team:read
```

---

## 🌐 **Step 4: Domain Configuration**

### **4.1 Verify Domain Settings**

Ensure your domains are properly configured:

```bash
# Frontend (Render)
upload.proofpixapp.com → Render frontend service

# Backend (Railway)
api.proofpixapp.com → Railway backend service
```

### **4.2 SSL Certificate Verification**

Both platforms should automatically provision SSL certificates. Verify:

```bash
# Test HTTPS endpoints
curl -I https://api.proofpixapp.com/health
curl -I https://upload.proofpixapp.com
```

---

## 🧪 **Step 5: Production Testing**

### **5.1 Test Privacy Mode**

```bash
# Should work without server communication
1. Visit https://upload.proofpixapp.com
2. Select "Privacy Mode" (default)
3. Upload and process files
4. Verify no network requests to backend
```

### **5.2 Test Collaboration Mode**

```bash
# Should create ephemeral sessions
1. Switch to "Collaboration Mode"
2. Accept consent modal
3. Verify session creation
4. Test file processing
5. Verify auto-deletion after 24 hours
```

### **5.3 Test OAuth Integration**

```bash
# Test OAuth flow
1. Create OAuth application
2. Test collaboration authorization
3. Verify team access validation
4. Test session management
```

---

## 📊 **Step 6: Monitoring Setup**

### **6.1 Railway Monitoring**

Monitor these metrics in Railway:

```bash
# Backend Metrics
- CPU usage
- Memory usage
- Redis memory usage
- Request rate
- Error rate

# Redis Metrics
- Memory usage
- Key count
- Expired keys
- Connection count
```

### **6.2 Application Monitoring**

Set up monitoring for:

```bash
# Ephemeral Sessions
- Session creation rate
- Session cleanup success rate
- Auto-deletion failures
- Memory usage

# Security Events
- Failed authentication attempts
- Unauthorized access attempts
- Suspicious activity patterns
```

---

## 🔧 **Step 7: Environment Variables Reference**

### **Backend (Railway)**

```bash
# Database
DATABASE_URL=${DATABASE_URL}

# Redis
REDIS_HOST=${REDIS_HOST}
REDIS_PORT=${REDIS_PORT}
REDIS_PASSWORD=${REDIS_PASSWORD}
REDIS_URL=${REDIS_URL}

# Server
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://upload.proofpixapp.com
BACKEND_URL=https://api.proofpixapp.com

# JWT
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=24h

# OAuth
OAUTH_BASE_URL=https://api.proofpixapp.com/api/oauth
GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}

# Hybrid Architecture
EPHEMERAL_SESSION_DURATION=86400
EPHEMERAL_MAX_FILE_SIZE=52428800
EPHEMERAL_CLEANUP_INTERVAL=3600000
ENABLE_COLLABORATION_MODE=true

# Security
CORS_ORIGIN=https://upload.proofpixapp.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### **Frontend (Render)**

```bash
# API
REACT_APP_API_URL=https://api.proofpixapp.com

# OAuth
REACT_APP_OAUTH_CLIENT_ID=${OAUTH_CLIENT_ID}
REACT_APP_OAUTH_REDIRECT_URI=https://upload.proofpixapp.com/auth/callback

# Features
REACT_APP_ENABLE_COLLABORATION=true
REACT_APP_ENABLE_TEAMS=true

# Build
NODE_ENV=production
```

---

## 🚨 **Step 8: Security Checklist**

### **8.1 Backend Security**

- ✅ HTTPS enforced
- ✅ CORS properly configured
- ✅ Rate limiting enabled
- ✅ Input validation active
- ✅ JWT tokens secured
- ✅ Redis password protected
- ✅ Environment variables secured

### **8.2 Frontend Security**

- ✅ HTTPS enforced
- ✅ CSP headers configured
- ✅ XSS protection enabled
- ✅ Secure cookie settings
- ✅ OAuth flow secured

### **8.3 Hybrid Architecture Security**

- ✅ Privacy mode: Zero server communication
- ✅ Collaboration mode: Ephemeral processing only
- ✅ Auto-deletion: 24-hour guarantee
- ✅ Encryption: All data encrypted in transit
- ✅ Audit logging: All actions logged

---

## 📈 **Step 9: Performance Optimization**

### **9.1 Backend Optimization**

```bash
# Redis Configuration
- Enable Redis persistence for session recovery
- Configure memory limits
- Set up Redis clustering if needed

# Node.js Optimization
- Enable compression middleware
- Configure connection pooling
- Set up proper logging levels
```

### **9.2 Frontend Optimization**

```bash
# Build Optimization
- Enable code splitting
- Optimize bundle size
- Configure caching headers

# Runtime Optimization
- Lazy load components
- Optimize re-renders
- Use service workers
```

---

## 🔄 **Step 10: Backup and Recovery**

### **10.1 Database Backup**

```bash
# Railway automatically backs up PostgreSQL
# Configure additional backup retention if needed
```

### **10.2 Redis Backup**

```bash
# Configure Redis persistence
# Set up periodic snapshots
# Plan for session recovery scenarios
```

### **10.3 Application Backup**

```bash
# Code repository: GitHub
# Environment variables: Secure storage
# Configuration files: Version controlled
```

---

## 🎯 **Deployment Verification**

### **Success Criteria**

- ✅ Backend API responding at https://api.proofpixapp.com
- ✅ Frontend app loading at https://upload.proofpixapp.com
- ✅ Redis connection established
- ✅ OAuth flow working
- ✅ Privacy mode: Zero server communication
- ✅ Collaboration mode: Ephemeral sessions working
- ✅ Auto-deletion: 24-hour cleanup verified
- ✅ SSL certificates valid
- ✅ CORS properly configured
- ✅ Rate limiting active

### **Post-Deployment Testing**

1. **Privacy Mode Test**: Upload files without server communication
2. **Collaboration Mode Test**: Create ephemeral session and process files
3. **OAuth Test**: Complete authorization flow
4. **Team Test**: Create team and invite members
5. **Security Test**: Verify auto-deletion and encryption
6. **Performance Test**: Load test with multiple users

---

## 📞 **Support and Troubleshooting**

### **Common Issues**

1. **Redis Connection Failed**:
   - Check Redis service status in Railway
   - Verify environment variables
   - Check network connectivity

2. **OAuth Flow Broken**:
   - Verify redirect URIs in Google Cloud Console
   - Check OAuth client credentials
   - Validate CORS configuration

3. **Session Creation Failed**:
   - Check Redis memory usage
   - Verify authentication tokens
   - Review audit logs

### **Monitoring Commands**

```bash
# Check backend health
curl https://api.proofpixapp.com/health

# Check Redis status
curl https://api.proofpixapp.com/api/ephemeral/status

# Check OAuth configuration
curl https://api.proofpixapp.com/api/oauth/.well-known/oauth-authorization-server
```

---

## 🎉 **Deployment Complete!**

Your hybrid architecture is now deployed in production with:

- **Privacy Mode**: Client-side processing, zero server communication
- **Collaboration Mode**: Ephemeral processing with 24-hour auto-deletion
- **OAuth Integration**: Team-based authentication
- **Production Security**: Enterprise-grade security controls
- **Scalable Infrastructure**: Railway + Render deployment

The system maintains your competitive advantage while adding enterprise collaboration features! 