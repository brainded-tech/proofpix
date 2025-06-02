# ProofPix API Documentation - Comprehensive Guide

## 📋 **Overview**

ProofPix provides a comprehensive REST API for document processing, AI analysis, enterprise integrations, and analytics. This documentation covers all available endpoints, authentication methods, and integration patterns.

**Base URL**: `https://api.proofpix.com/v2`  
**API Version**: 2.0  
**Last Updated**: December 2024

---

## 🔐 **Authentication**

### **Authentication Methods**

#### **1. API Key Authentication**
```http
Authorization: Bearer pk_live_your_api_key_here
```

#### **2. JWT Token Authentication**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### **3. OAuth2 Authentication**
```http
Authorization: Bearer oauth2_access_token
```

### **API Key Management**

#### **Create API Key**
```http
POST /api/keys
Content-Type: application/json

{
  "name": "Production API Key",
  "permissions": ["documents:read", "documents:write", "analytics:read"],
  "rateLimit": 1000
}

Response:
{
  "id": "key_123456789",
  "name": "Production API Key",
  "key": "pk_live_abcdef123456789",
  "permissions": ["documents:read", "documents:write", "analytics:read"],
  "rateLimit": 1000,
  "usage": {
    "requests": 0,
    "lastUsed": null
  },
  "isActive": true,
  "createdAt": "2024-12-01T00:00:00Z"
}
```

#### **List API Keys**
```http
GET /api/keys

Response:
{
  "keys": [
    {
      "id": "key_123456789",
      "name": "Production API Key",
      "permissions": ["documents:read", "documents:write"],
      "rateLimit": 1000,
      "usage": {
        "requests": 1250,
        "lastUsed": "2024-12-01T12:30:00Z"
      },
      "isActive": true,
      "createdAt": "2024-11-01T00:00:00Z"
    }
  ],
  "total": 1
}
```

#### **Update API Key**
```http
PUT /api/keys/{keyId}
Content-Type: application/json

{
  "name": "Updated API Key Name",
  "permissions": ["documents:read", "documents:write", "analytics:read"],
  "rateLimit": 2000,
  "isActive": true
}
```

#### **Delete API Key**
```http
DELETE /api/keys/{keyId}

Response:
{
  "success": true,
  "message": "API key deleted successfully"
}
```

#### **Get API Key Usage**
```http
GET /api/keys/{keyId}/usage?start=2024-11-01&end=2024-12-01

Response:
{
  "requests": 15420,
  "errors": 23,
  "avgResponseTime": 245,
  "topEndpoints": [
    {
      "endpoint": "/api/documents/process",
      "count": 8500
    },
    {
      "endpoint": "/api/analytics/metrics",
      "count": 3200
    }
  ],
  "dailyUsage": [
    {
      "date": "2024-11-01",
      "requests": 450,
      "errors": 2
    }
  ]
}
```

---

## 📄 **Document Processing API**

### **Document Upload & Processing**

#### **Upload Document**
```http
POST /api/documents/upload
Content-Type: multipart/form-data

Form Data:
- file: (binary file data)
- options: {
    "enableOCR": true,
    "extractMetadata": true,
    "performSecurityScan": true,
    "generateInsights": true,
    "complianceFrameworks": ["gdpr", "hipaa"]
  }

Response:
{
  "documentId": "doc_123456789",
  "status": "processing",
  "uploadedAt": "2024-12-01T12:00:00Z",
  "filename": "contract.pdf",
  "fileSize": 2048576,
  "mimeType": "application/pdf",
  "processingOptions": {
    "enableOCR": true,
    "extractMetadata": true,
    "performSecurityScan": true,
    "generateInsights": true,
    "complianceFrameworks": ["gdpr", "hipaa"]
  }
}
```

#### **Get Document Status**
```http
GET /api/documents/{documentId}/status

Response:
{
  "documentId": "doc_123456789",
  "status": "completed",
  "progress": 100,
  "processingStages": [
    {
      "stage": "upload",
      "status": "completed",
      "completedAt": "2024-12-01T12:00:05Z"
    },
    {
      "stage": "extraction",
      "status": "completed",
      "completedAt": "2024-12-01T12:00:15Z"
    },
    {
      "stage": "analysis",
      "status": "completed",
      "completedAt": "2024-12-01T12:00:25Z"
    }
  ],
  "processingTime": 25000,
  "completedAt": "2024-12-01T12:00:25Z"
}
```

#### **Get Document Results**
```http
GET /api/documents/{documentId}/results

Response:
{
  "documentId": "doc_123456789",
  "classification": {
    "type": "contract",
    "confidence": 0.95,
    "subCategory": "service_agreement",
    "industry": "technology",
    "language": "en",
    "complexity": "moderate"
  },
  "extractedText": "This Service Agreement...",
  "metadata": {
    "pageCount": 12,
    "wordCount": 3500,
    "createdDate": "2024-11-15T00:00:00Z",
    "author": "Legal Department",
    "title": "Service Agreement - ProofPix Integration"
  },
  "entities": [
    {
      "type": "date",
      "value": "2024-11-15",
      "confidence": 0.98,
      "location": {
        "page": 1,
        "coordinates": [100, 200]
      }
    },
    {
      "type": "amount",
      "value": "$50,000",
      "confidence": 0.92,
      "location": {
        "page": 3,
        "coordinates": [150, 300]
      }
    }
  ],
  "insights": [
    {
      "type": "key_terms",
      "title": "Contract Duration",
      "description": "This contract has a 2-year term with automatic renewal",
      "confidence": 0.89,
      "importance": "high"
    }
  ],
  "securityAnalysis": {
    "piiDetected": true,
    "piiTypes": ["email", "phone"],
    "riskLevel": "medium",
    "complianceStatus": {
      "gdpr": "compliant",
      "hipaa": "not_applicable"
    }
  }
}
```

#### **Batch Document Processing**
```http
POST /api/documents/batch
Content-Type: multipart/form-data

Form Data:
- files[]: (multiple binary files)
- options: {
    "enableOCR": true,
    "extractMetadata": true,
    "batchSize": 10,
    "priority": "normal"
  }

Response:
{
  "batchId": "batch_123456789",
  "status": "processing",
  "totalDocuments": 25,
  "processedDocuments": 0,
  "failedDocuments": 0,
  "estimatedCompletion": "2024-12-01T12:15:00Z",
  "documents": [
    {
      "documentId": "doc_123456790",
      "filename": "invoice_001.pdf",
      "status": "queued"
    },
    {
      "documentId": "doc_123456791",
      "filename": "invoice_002.pdf",
      "status": "queued"
    }
  ]
}
```

#### **Get Batch Status**
```http
GET /api/documents/batch/{batchId}/status

Response:
{
  "batchId": "batch_123456789",
  "status": "completed",
  "totalDocuments": 25,
  "processedDocuments": 23,
  "failedDocuments": 2,
  "startedAt": "2024-12-01T12:00:00Z",
  "completedAt": "2024-12-01T12:12:30Z",
  "processingTime": 750000,
  "successRate": 0.92,
  "documents": [
    {
      "documentId": "doc_123456790",
      "filename": "invoice_001.pdf",
      "status": "completed",
      "processingTime": 15000
    },
    {
      "documentId": "doc_123456791",
      "filename": "invoice_002.pdf",
      "status": "failed",
      "error": "Unsupported file format"
    }
  ]
}
```

---

## 🤖 **AI & Machine Learning API**

### **Document Intelligence**

#### **Classify Document**
```http
POST /api/ai/classify
Content-Type: application/json

{
  "documentId": "doc_123456789",
  "options": {
    "includeConfidence": true,
    "includeSubCategories": true,
    "customModels": ["legal_contracts", "financial_documents"]
  }
}

Response:
{
  "classification": {
    "type": "contract",
    "confidence": 0.95,
    "subCategory": "service_agreement",
    "industry": "technology",
    "language": "en",
    "complexity": "moderate",
    "alternativeClassifications": [
      {
        "type": "legal_document",
        "confidence": 0.87
      }
    ]
  },
  "processingTime": 1250,
  "modelVersion": "v2.1.0"
}
```

#### **Extract Entities**
```http
POST /api/ai/extract-entities
Content-Type: application/json

{
  "documentId": "doc_123456789",
  "entityTypes": ["person", "date", "amount", "email", "phone"],
  "options": {
    "includeLocation": true,
    "minimumConfidence": 0.8
  }
}

Response:
{
  "entities": [
    {
      "type": "person",
      "value": "John Smith",
      "confidence": 0.95,
      "location": {
        "page": 1,
        "coordinates": [100, 200],
        "boundingBox": {
          "x": 100,
          "y": 200,
          "width": 80,
          "height": 20
        }
      },
      "context": "Signatory"
    },
    {
      "type": "date",
      "value": "2024-11-15",
      "confidence": 0.98,
      "location": {
        "page": 1,
        "coordinates": [300, 150]
      },
      "context": "Contract Date"
    }
  ],
  "totalEntities": 15,
  "processingTime": 850
}
```

#### **Generate Summary**
```http
POST /api/ai/summarize
Content-Type: application/json

{
  "documentId": "doc_123456789",
  "options": {
    "length": "medium",
    "focus": ["key_terms", "obligations", "dates"],
    "includeKeyPoints": true
  }
}

Response:
{
  "summary": "This service agreement establishes a 2-year partnership between ProofPix and the client for document processing services. Key terms include monthly payments of $5,000, automatic renewal clauses, and specific performance metrics.",
  "keyPoints": [
    "2-year contract duration with automatic renewal",
    "Monthly payment of $5,000",
    "Performance metrics: 99.9% uptime, <2s response time",
    "Termination clause: 30-day notice required"
  ],
  "wordCount": 45,
  "confidence": 0.92,
  "processingTime": 2100
}
```

### **Smart Recommendations**

#### **Get Document Recommendations**
```http
POST /api/ai/recommendations
Content-Type: application/json

{
  "documentId": "doc_123456789",
  "context": {
    "userRole": "legal_reviewer",
    "businessContext": "contract_review",
    "urgency": "high"
  },
  "options": {
    "maxRecommendations": 10,
    "includeImplementation": true,
    "includeImpactAnalysis": true
  }
}

Response:
{
  "recommendations": [
    {
      "id": "rec_123456789",
      "type": "compliance_check",
      "title": "Review GDPR Compliance Clauses",
      "description": "This contract lacks specific GDPR compliance language required for EU operations.",
      "priority": "high",
      "confidence": 0.89,
      "impact": {
        "risk": "high",
        "effort": "medium",
        "timeframe": "immediate"
      },
      "implementation": {
        "steps": [
          "Add GDPR compliance clause in Section 7",
          "Include data processing agreement",
          "Specify data retention periods"
        ],
        "estimatedTime": "2 hours",
        "resources": ["legal_template_gdpr"]
      }
    }
  ],
  "totalRecommendations": 5,
  "processingTime": 1800
}
```

#### **Implement Recommendation**
```http
POST /api/ai/recommendations/{recommendationId}/implement
Content-Type: application/json

{
  "parameters": {
    "autoApply": false,
    "reviewRequired": true,
    "notifyStakeholders": true
  }
}

Response:
{
  "implementationId": "impl_123456789",
  "status": "pending",
  "estimatedCompletion": "2024-12-01T14:00:00Z",
  "reviewers": ["legal_team@company.com"],
  "nextSteps": [
    "Legal team review scheduled",
    "Implementation pending approval",
    "Stakeholder notification sent"
  ]
}
```

### **Predictive Analytics**

#### **Generate Predictions**
```http
POST /api/ai/predict
Content-Type: application/json

{
  "modelType": "document_processing_time",
  "inputData": {
    "documentType": "contract",
    "pageCount": 12,
    "complexity": "moderate",
    "language": "en"
  },
  "options": {
    "includeConfidenceInterval": true,
    "includeFactors": true
  }
}

Response:
{
  "prediction": {
    "value": 25.5,
    "unit": "seconds",
    "confidence": 0.87,
    "confidenceInterval": {
      "lower": 22.1,
      "upper": 28.9
    }
  },
  "factors": [
    {
      "factor": "page_count",
      "impact": 0.45,
      "description": "Document length significantly affects processing time"
    },
    {
      "factor": "complexity",
      "impact": 0.32,
      "description": "Moderate complexity adds processing overhead"
    }
  ],
  "modelVersion": "v1.3.2",
  "processingTime": 150
}
```

---

## 🏢 **Enterprise API**

### **Team Management**

#### **Create Team**
```http
POST /api/enterprise/teams
Content-Type: application/json

{
  "name": "Legal Department",
  "description": "Legal document review team",
  "settings": {
    "defaultPermissions": ["documents:read", "documents:review"],
    "requireApproval": true,
    "maxMembers": 50
  }
}

Response:
{
  "teamId": "team_123456789",
  "name": "Legal Department",
  "description": "Legal document review team",
  "memberCount": 0,
  "settings": {
    "defaultPermissions": ["documents:read", "documents:review"],
    "requireApproval": true,
    "maxMembers": 50
  },
  "createdAt": "2024-12-01T12:00:00Z",
  "createdBy": "user_123456789"
}
```

#### **Add Team Member**
```http
POST /api/enterprise/teams/{teamId}/members
Content-Type: application/json

{
  "userId": "user_987654321",
  "role": "reviewer",
  "permissions": ["documents:read", "documents:review", "documents:comment"]
}

Response:
{
  "memberId": "member_123456789",
  "userId": "user_987654321",
  "teamId": "team_123456789",
  "role": "reviewer",
  "permissions": ["documents:read", "documents:review", "documents:comment"],
  "addedAt": "2024-12-01T12:00:00Z",
  "status": "active"
}
```

### **SSO & Authentication**

#### **Configure SSO Provider**
```http
POST /api/enterprise/sso/providers
Content-Type: application/json

{
  "provider": "okta",
  "name": "Company Okta",
  "configuration": {
    "domain": "company.okta.com",
    "clientId": "okta_client_id",
    "clientSecret": "okta_client_secret",
    "redirectUri": "https://app.proofpix.com/auth/callback"
  },
  "attributeMapping": {
    "email": "email",
    "firstName": "given_name",
    "lastName": "family_name",
    "department": "department"
  }
}

Response:
{
  "providerId": "sso_123456789",
  "provider": "okta",
  "name": "Company Okta",
  "status": "active",
  "configuration": {
    "domain": "company.okta.com",
    "redirectUri": "https://app.proofpix.com/auth/callback"
  },
  "createdAt": "2024-12-01T12:00:00Z"
}
```

#### **SSO Login URL**
```http
GET /api/enterprise/sso/{providerId}/login?redirect_uri=https://app.proofpix.com/dashboard

Response:
{
  "loginUrl": "https://company.okta.com/oauth2/v1/authorize?client_id=...&redirect_uri=...&response_type=code&scope=openid+profile+email",
  "state": "random_state_string",
  "expiresAt": "2024-12-01T12:15:00Z"
}
```

### **Role-Based Access Control (RBAC)**

#### **Create Role**
```http
POST /api/enterprise/rbac/roles
Content-Type: application/json

{
  "name": "Document Reviewer",
  "description": "Can review and approve documents",
  "permissions": [
    "documents:read",
    "documents:review",
    "documents:approve",
    "comments:create",
    "comments:read"
  ],
  "restrictions": {
    "documentTypes": ["contract", "legal"],
    "departments": ["legal", "compliance"]
  }
}

Response:
{
  "roleId": "role_123456789",
  "name": "Document Reviewer",
  "description": "Can review and approve documents",
  "permissions": [
    "documents:read",
    "documents:review",
    "documents:approve",
    "comments:create",
    "comments:read"
  ],
  "restrictions": {
    "documentTypes": ["contract", "legal"],
    "departments": ["legal", "compliance"]
  },
  "createdAt": "2024-12-01T12:00:00Z"
}
```

#### **Assign Role to User**
```http
POST /api/enterprise/rbac/users/{userId}/roles
Content-Type: application/json

{
  "roleId": "role_123456789",
  "scope": {
    "teams": ["team_123456789"],
    "projects": ["project_123456789"]
  },
  "expiresAt": "2025-12-01T00:00:00Z"
}

Response:
{
  "assignmentId": "assignment_123456789",
  "userId": "user_123456789",
  "roleId": "role_123456789",
  "scope": {
    "teams": ["team_123456789"],
    "projects": ["project_123456789"]
  },
  "assignedAt": "2024-12-01T12:00:00Z",
  "expiresAt": "2025-12-01T00:00:00Z",
  "status": "active"
}
```

---

## 📊 **Analytics API**

### **Usage Analytics**

#### **Get Usage Metrics**
```http
GET /api/analytics/usage?start=2024-11-01&end=2024-12-01&granularity=day

Response:
{
  "timeRange": {
    "start": "2024-11-01T00:00:00Z",
    "end": "2024-12-01T00:00:00Z",
    "granularity": "day"
  },
  "metrics": {
    "totalDocuments": 15420,
    "totalProcessingTime": 125000000,
    "averageProcessingTime": 8100,
    "successRate": 0.987,
    "errorRate": 0.013,
    "apiCalls": 45600,
    "storageUsed": 2048576000,
    "bandwidthUsed": 5120000000
  },
  "trends": [
    {
      "date": "2024-11-01",
      "documents": 450,
      "processingTime": 3600000,
      "apiCalls": 1200,
      "errors": 5
    },
    {
      "date": "2024-11-02",
      "documents": 520,
      "processingTime": 4200000,
      "apiCalls": 1450,
      "errors": 3
    }
  ]
}
```

#### **Get Performance Metrics**
```http
GET /api/analytics/performance?timeRange=24h

Response:
{
  "timeRange": "24h",
  "metrics": {
    "averageResponseTime": 245,
    "p50ResponseTime": 180,
    "p95ResponseTime": 450,
    "p99ResponseTime": 850,
    "throughput": 125.5,
    "errorRate": 0.012,
    "uptime": 0.9998
  },
  "endpoints": [
    {
      "endpoint": "/api/documents/process",
      "averageResponseTime": 2100,
      "requestCount": 8500,
      "errorRate": 0.008
    },
    {
      "endpoint": "/api/ai/classify",
      "averageResponseTime": 1250,
      "requestCount": 3200,
      "errorRate": 0.015
    }
  ]
}
```

### **Business Intelligence**

#### **Get Business Metrics**
```http
POST /api/analytics/business-metrics
Content-Type: application/json

{
  "timeRange": {
    "start": "2024-11-01T00:00:00Z",
    "end": "2024-12-01T00:00:00Z"
  },
  "metrics": [
    "revenue",
    "customer_acquisition",
    "document_volume",
    "user_engagement"
  ],
  "groupBy": "week"
}

Response:
{
  "timeRange": {
    "start": "2024-11-01T00:00:00Z",
    "end": "2024-12-01T00:00:00Z"
  },
  "metrics": {
    "revenue": {
      "total": 125000,
      "growth": 0.15,
      "trend": "increasing"
    },
    "customerAcquisition": {
      "newCustomers": 45,
      "churnRate": 0.02,
      "netGrowth": 0.13
    },
    "documentVolume": {
      "totalDocuments": 15420,
      "growth": 0.22,
      "averagePerCustomer": 342
    },
    "userEngagement": {
      "activeUsers": 1250,
      "sessionsPerUser": 8.5,
      "averageSessionDuration": 1800
    }
  },
  "trends": [
    {
      "week": "2024-W44",
      "revenue": 28000,
      "newCustomers": 12,
      "documents": 3500
    }
  ]
}
```

---

## 🔗 **Webhook API**

### **Webhook Management**

#### **Create Webhook**
```http
POST /api/webhooks
Content-Type: application/json

{
  "url": "https://your-app.com/webhooks/proofpix",
  "events": [
    "document.processed",
    "document.failed",
    "batch.completed"
  ],
  "secret": "your_webhook_secret",
  "active": true,
  "retryPolicy": {
    "maxRetries": 3,
    "retryDelay": 1000
  }
}

Response:
{
  "webhookId": "webhook_123456789",
  "url": "https://your-app.com/webhooks/proofpix",
  "events": [
    "document.processed",
    "document.failed",
    "batch.completed"
  ],
  "secret": "your_webhook_secret",
  "active": true,
  "retryPolicy": {
    "maxRetries": 3,
    "retryDelay": 1000
  },
  "createdAt": "2024-12-01T12:00:00Z"
}
```

#### **Test Webhook**
```http
POST /api/webhooks/{webhookId}/test

Response:
{
  "success": true,
  "status": 200,
  "response": "OK",
  "latency": 245,
  "timestamp": "2024-12-01T12:00:00Z"
}
```

### **Webhook Events**

#### **Document Processed Event**
```json
{
  "event": "document.processed",
  "timestamp": "2024-12-01T12:00:00Z",
  "data": {
    "documentId": "doc_123456789",
    "status": "completed",
    "processingTime": 25000,
    "classification": {
      "type": "contract",
      "confidence": 0.95
    },
    "metadata": {
      "pageCount": 12,
      "wordCount": 3500
    }
  }
}
```

#### **Batch Completed Event**
```json
{
  "event": "batch.completed",
  "timestamp": "2024-12-01T12:15:00Z",
  "data": {
    "batchId": "batch_123456789",
    "totalDocuments": 25,
    "processedDocuments": 23,
    "failedDocuments": 2,
    "processingTime": 750000,
    "successRate": 0.92
  }
}
```

---

## 🔒 **Security API**

### **Security Scanning**

#### **Scan Document for Security Issues**
```http
POST /api/security/scan/{documentId}
Content-Type: application/json

{
  "scanTypes": ["pii", "malware", "compliance"],
  "complianceFrameworks": ["gdpr", "hipaa", "sox"],
  "options": {
    "deepScan": true,
    "generateReport": true
  }
}

Response:
{
  "scanId": "scan_123456789",
  "documentId": "doc_123456789",
  "status": "completed",
  "results": {
    "clean": false,
    "threats": ["pii_detected"],
    "riskLevel": "medium",
    "piiDetection": {
      "detected": true,
      "types": ["email", "phone", "ssn"],
      "count": 5,
      "locations": [
        {
          "type": "email",
          "value": "john@example.com",
          "page": 1,
          "coordinates": [100, 200]
        }
      ]
    },
    "complianceStatus": {
      "gdpr": {
        "compliant": false,
        "issues": ["missing_consent_clause", "unclear_data_retention"]
      },
      "hipaa": {
        "compliant": true,
        "issues": []
      }
    }
  },
  "scanTime": 5000,
  "completedAt": "2024-12-01T12:00:00Z"
}
```

#### **Get Security Events**
```http
GET /api/security/events?page=1&limit=50&severity=high

Response:
{
  "events": [
    {
      "id": "event_123456789",
      "type": "pii_detected",
      "severity": "high",
      "message": "PII detected in document processing",
      "timestamp": "2024-12-01T12:00:00Z",
      "metadata": {
        "documentId": "doc_123456789",
        "piiTypes": ["ssn", "email"],
        "userAgent": "ProofPix API Client v2.0"
      }
    }
  ],
  "total": 150,
  "page": 1,
  "totalPages": 3
}
```

---

## 📈 **Rate Limits & Quotas**

### **Rate Limiting**

| Tier | Requests/Minute | Requests/Hour | Requests/Day |
|------|----------------|---------------|--------------|
| Free | 60 | 1,000 | 10,000 |
| Pro | 300 | 10,000 | 100,000 |
| Enterprise | 1,000 | 50,000 | 1,000,000 |

### **Rate Limit Headers**
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1638360000
X-RateLimit-Retry-After: 60
```

### **Quota Management**

#### **Get Current Usage**
```http
GET /api/usage/current

Response:
{
  "period": "monthly",
  "usage": {
    "apiCalls": 45600,
    "documentsProcessed": 1250,
    "storageUsed": 2048576000,
    "bandwidthUsed": 5120000000
  },
  "limits": {
    "apiCalls": 100000,
    "documentsProcessed": 5000,
    "storageUsed": 10737418240,
    "bandwidthUsed": 21474836480
  },
  "resetDate": "2024-12-31T23:59:59Z"
}
```

---

## 🚨 **Error Handling**

### **Error Response Format**
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request is invalid or malformed",
    "details": "Missing required field: documentId",
    "requestId": "req_123456789",
    "timestamp": "2024-12-01T12:00:00Z"
  }
}
```

### **Common Error Codes**

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_REQUEST` | 400 | Request is malformed or missing required fields |
| `UNAUTHORIZED` | 401 | Invalid or missing authentication credentials |
| `FORBIDDEN` | 403 | Insufficient permissions for the requested operation |
| `NOT_FOUND` | 404 | Requested resource does not exist |
| `RATE_LIMITED` | 429 | Rate limit exceeded |
| `INTERNAL_ERROR` | 500 | Internal server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

---

## 📚 **SDK & Libraries**

### **Official SDKs**

#### **JavaScript/Node.js**
```bash
npm install @proofpix/sdk
```

```javascript
import { ProofPixClient } from '@proofpix/sdk';

const client = new ProofPixClient({
  apiKey: 'pk_live_your_api_key',
  baseUrl: 'https://api.proofpix.com/v2'
});

// Upload and process document
const result = await client.documents.upload({
  file: fileBuffer,
  options: {
    enableOCR: true,
    extractMetadata: true
  }
});
```

#### **Python**
```bash
pip install proofpix-python
```

```python
from proofpix import ProofPixClient

client = ProofPixClient(api_key='pk_live_your_api_key')

# Upload and process document
result = client.documents.upload(
    file=file_data,
    options={
        'enableOCR': True,
        'extractMetadata': True
    }
)
```

---

## 🔄 **Webhooks & Real-time Updates**

### **WebSocket Connection**
```javascript
const ws = new WebSocket('wss://api.proofpix.com/v2/ws');

ws.onopen = () => {
  // Subscribe to document processing updates
  ws.send(JSON.stringify({
    action: 'subscribe',
    channel: 'document-processing',
    documentId: 'doc_123456789'
  }));
};

ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  console.log('Processing update:', update);
};
```

---

**Last Updated**: December 2024  
**Version**: 2.0  
**Support**: api-support@proofpix.com 