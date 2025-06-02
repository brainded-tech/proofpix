import React from 'react';
import { EnterpriseLayout } from '../../components/ui/EnterpriseLayout';

const ComprehensiveAPIGuide: React.FC = () => {
  return (
    <EnterpriseLayout
      showHero
      title="Comprehensive API Documentation"
      description="Complete REST API reference for ProofPix platform integration"
      maxWidth="6xl"
      backgroundColor="dark"
    >
      <div className="prose prose-invert max-w-none">
        <div className="bg-slate-800/50 rounded-lg p-8 border border-slate-700/50">
          <h1 className="text-3xl font-bold text-emerald-400 mb-6">
            ProofPix API - Comprehensive Documentation
          </h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Overview</h2>
              <p className="text-slate-300 mb-4">
                The ProofPix API provides comprehensive access to our document intelligence platform, 
                offering over 50 endpoints across authentication, document processing, AI/ML services, 
                enterprise features, analytics, and security. This RESTful API supports JSON payloads 
                and follows industry-standard conventions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Authentication</h2>
              <div className="bg-slate-700/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-emerald-400 mb-3">API Key Authentication</h3>
                <div className="bg-slate-800/50 rounded p-4 mb-4">
                  <pre className="text-emerald-400 text-sm">
{`curl -H "Authorization: Bearer YOUR_API_KEY" \\
     -H "Content-Type: application/json" \\
     https://api.proofpix.com/v1/documents`}
                  </pre>
                </div>
                
                <h3 className="text-lg font-semibold text-emerald-400 mb-3">OAuth 2.0 Flow</h3>
                <div className="bg-slate-800/50 rounded p-4">
                  <pre className="text-emerald-400 text-sm">
{`// Step 1: Authorization
GET /oauth/authorize?client_id=YOUR_CLIENT_ID&response_type=code&scope=read:documents

// Step 2: Token Exchange
POST /oauth/token
{
  "grant_type": "authorization_code",
  "code": "AUTH_CODE",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET"
}`}
                  </pre>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Core Endpoints</h2>
              <div className="space-y-6">
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">Document Processing</h3>
                  <div className="space-y-3">
                    <div className="bg-slate-800/50 rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-emerald-400">POST /api/v1/documents/upload</code>
                        <span className="text-xs bg-blue-600 px-2 py-1 rounded">Core</span>
                      </div>
                      <p className="text-slate-400 text-sm">Upload and process documents</p>
                    </div>
                    <div className="bg-slate-800/50 rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-emerald-400">GET /api/v1/documents/:id</code>
                        <span className="text-xs bg-blue-600 px-2 py-1 rounded">Core</span>
                      </div>
                      <p className="text-slate-400 text-sm">Retrieve document details and metadata</p>
                    </div>
                    <div className="bg-slate-800/50 rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-emerald-400">POST /api/v1/documents/:id/analyze</code>
                        <span className="text-xs bg-purple-600 px-2 py-1 rounded">AI/ML</span>
                      </div>
                      <p className="text-slate-400 text-sm">Trigger AI analysis on document</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">AI/ML Services</h3>
                  <div className="space-y-3">
                    <div className="bg-slate-800/50 rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-emerald-400">POST /api/v1/ai/classify</code>
                        <span className="text-xs bg-purple-600 px-2 py-1 rounded">AI/ML</span>
                      </div>
                      <p className="text-slate-400 text-sm">Classify document type using AI</p>
                    </div>
                    <div className="bg-slate-800/50 rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-emerald-400">POST /api/v1/ai/extract</code>
                        <span className="text-xs bg-purple-600 px-2 py-1 rounded">AI/ML</span>
                      </div>
                      <p className="text-slate-400 text-sm">Extract entities and key information</p>
                    </div>
                    <div className="bg-slate-800/50 rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-emerald-400">POST /api/v1/ai/chat</code>
                        <span className="text-xs bg-purple-600 px-2 py-1 rounded">AI/ML</span>
                      </div>
                      <p className="text-slate-400 text-sm">Interact with Smart Document Assistant</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">Enterprise Features</h3>
                  <div className="space-y-3">
                    <div className="bg-slate-800/50 rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-emerald-400">GET /api/v1/enterprise/teams</code>
                        <span className="text-xs bg-orange-600 px-2 py-1 rounded">Enterprise</span>
                      </div>
                      <p className="text-slate-400 text-sm">Manage enterprise teams and permissions</p>
                    </div>
                    <div className="bg-slate-800/50 rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-emerald-400">POST /api/v1/enterprise/integrations</code>
                        <span className="text-xs bg-orange-600 px-2 py-1 rounded">Enterprise</span>
                      </div>
                      <p className="text-slate-400 text-sm">Configure third-party integrations</p>
                    </div>
                    <div className="bg-slate-800/50 rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-emerald-400">GET /api/v1/enterprise/audit</code>
                        <span className="text-xs bg-orange-600 px-2 py-1 rounded">Enterprise</span>
                      </div>
                      <p className="text-slate-400 text-sm">Access audit logs and compliance data</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibent text-slate-100 mb-4">Request/Response Examples</h2>
              <div className="space-y-6">
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">Document Upload</h3>
                  <div className="bg-slate-800/50 rounded p-4">
                    <pre className="text-emerald-400 text-sm">
{`// Request
POST /api/v1/documents/upload
Content-Type: multipart/form-data

{
  "file": [binary data],
  "metadata": {
    "title": "Contract Agreement",
    "category": "legal",
    "tags": ["contract", "agreement"]
  }
}

// Response
{
  "id": "doc_1234567890",
  "status": "processing",
  "metadata": {
    "filename": "contract.pdf",
    "size": 2048576,
    "type": "application/pdf",
    "uploaded_at": "2024-01-15T10:30:00Z"
  },
  "processing": {
    "stage": "upload_complete",
    "progress": 25,
    "estimated_completion": "2024-01-15T10:32:00Z"
  }
}`}
                    </pre>
                  </div>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">AI Classification</h3>
                  <div className="bg-slate-800/50 rounded p-4">
                    <pre className="text-emerald-400 text-sm">
{`// Request
POST /api/v1/ai/classify
{
  "document_id": "doc_1234567890",
  "model": "document-classifier-v2",
  "options": {
    "confidence_threshold": 0.8,
    "return_alternatives": true
  }
}

// Response
{
  "classification": {
    "primary": {
      "type": "legal_contract",
      "confidence": 0.95,
      "subcategory": "service_agreement"
    },
    "alternatives": [
      {
        "type": "legal_document",
        "confidence": 0.87
      }
    ]
  },
  "processing_time": 1.2,
  "model_version": "v2.1.0"
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Rate Limiting & Security</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">Rate Limits</h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• Standard: 1,000 requests/hour</li>
                    <li>• Premium: 10,000 requests/hour</li>
                    <li>• Enterprise: Custom limits</li>
                    <li>• Burst allowance: 2x for 5 minutes</li>
                  </ul>
                </div>
                
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">Security Features</h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• TLS 1.3 encryption</li>
                    <li>• Request signing (HMAC-SHA256)</li>
                    <li>• IP whitelisting</li>
                    <li>• Audit logging</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Error Handling</h2>
              <div className="bg-slate-700/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-emerald-400 mb-3">Standard Error Response</h3>
                <div className="bg-slate-800/50 rounded p-4">
                  <pre className="text-emerald-400 text-sm">
{`{
  "error": {
    "code": "INVALID_DOCUMENT_FORMAT",
    "message": "The uploaded file format is not supported",
    "details": {
      "supported_formats": ["pdf", "jpg", "png", "tiff"],
      "received_format": "bmp"
    },
    "request_id": "req_1234567890",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}`}
                  </pre>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">SDK Examples</h2>
              <div className="space-y-6">
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">JavaScript/Node.js</h3>
                  <div className="bg-slate-800/50 rounded p-4">
                    <pre className="text-emerald-400 text-sm">
{`import { ProofPixAPI } from '@proofpix/sdk';

const client = new ProofPixAPI({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Upload and analyze document
const result = await client.documents.upload({
  file: fileBuffer,
  options: {
    autoAnalyze: true,
    extractMetadata: true
  }
});

console.log('Document ID:', result.id);`}
                    </pre>
                  </div>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">Python</h3>
                  <div className="bg-slate-800/50 rounded p-4">
                    <pre className="text-emerald-400 text-sm">
{`from proofpix import ProofPixClient

client = ProofPixClient(api_key='your-api-key')

# Upload document
with open('document.pdf', 'rb') as file:
    result = client.documents.upload(
        file=file,
        metadata={'category': 'legal'}
    )

# Get analysis results
analysis = client.ai.analyze(result.id)
print(f"Classification: {analysis.classification.type}")`}
                    </pre>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </EnterpriseLayout>
  );
};

export default ComprehensiveAPIGuide; 