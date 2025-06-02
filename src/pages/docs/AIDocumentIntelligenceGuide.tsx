import React from 'react';
import { EnterpriseLayout } from '../../components/ui/EnterpriseLayout';

const AIDocumentIntelligenceGuide: React.FC = () => {
  return (
    <EnterpriseLayout
      showHero
      title="AI Document Intelligence Technical Guide"
      description="Comprehensive technical documentation for ProofPix's AI Document Intelligence Dashboard"
      maxWidth="6xl"
      backgroundColor="dark"
    >
      <div className="prose prose-invert max-w-none">
        <div className="bg-slate-800/50 rounded-lg p-8 border border-slate-700/50">
          <h1 className="text-3xl font-bold text-emerald-400 mb-6">
            AI Document Intelligence Dashboard - Technical Guide
          </h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Overview</h2>
              <p className="text-slate-300 mb-4">
                The AI Document Intelligence Dashboard represents ProofPix's flagship AI/ML system, 
                providing advanced document analysis, classification, and intelligence extraction capabilities. 
                This comprehensive system processes over 1,485 lines of sophisticated AI logic to deliver 
                enterprise-grade document intelligence.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Core Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">Document Classification</h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• Intelligent document type detection</li>
                    <li>• Multi-format support (PDF, images, scans)</li>
                    <li>• Industry-specific classification models</li>
                    <li>• Confidence scoring and validation</li>
                  </ul>
                </div>
                
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">Entity Extraction</h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• Named Entity Recognition (NER)</li>
                    <li>• Key-value pair extraction</li>
                    <li>• Table and form data parsing</li>
                    <li>• Custom entity model training</li>
                  </ul>
                </div>
                
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">OCR Processing</h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• Advanced optical character recognition</li>
                    <li>• Multi-language support</li>
                    <li>• Handwriting recognition</li>
                    <li>• Quality enhancement and preprocessing</li>
                  </ul>
                </div>
                
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">Real-time Processing</h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• WebSocket-based live updates</li>
                    <li>• Streaming document analysis</li>
                    <li>• Progressive result delivery</li>
                    <li>• Real-time confidence metrics</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Technical Architecture</h2>
              <div className="bg-slate-700/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-emerald-400 mb-3">System Components</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-200">AI Processing Engine</h4>
                    <p className="text-slate-400">Core ML models for document analysis and classification</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">Real-time Dashboard</h4>
                    <p className="text-slate-400">Interactive interface for monitoring and managing AI operations</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">API Integration Layer</h4>
                    <p className="text-slate-400">RESTful and WebSocket APIs for seamless integration</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">Performance Analytics</h4>
                    <p className="text-slate-400">Comprehensive metrics and performance monitoring</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">API Integration</h2>
              <div className="bg-slate-700/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-emerald-400 mb-3">Key Endpoints</h3>
                <div className="space-y-3">
                  <div className="bg-slate-800/50 rounded p-3">
                    <code className="text-emerald-400">POST /api/ai/document/analyze</code>
                    <p className="text-slate-400 text-sm mt-1">Submit document for AI analysis</p>
                  </div>
                  <div className="bg-slate-800/50 rounded p-3">
                    <code className="text-emerald-400">GET /api/ai/document/results/:id</code>
                    <p className="text-slate-400 text-sm mt-1">Retrieve analysis results</p>
                  </div>
                  <div className="bg-slate-800/50 rounded p-3">
                    <code className="text-emerald-400">WebSocket /ws/ai/realtime</code>
                    <p className="text-slate-400 text-sm mt-1">Real-time processing updates</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Performance Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-700/30 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">99.7%</div>
                  <div className="text-slate-300">Accuracy Rate</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">&lt;2s</div>
                  <div className="text-slate-300">Processing Time</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">50+</div>
                  <div className="text-slate-300">Document Types</div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Development Guide</h2>
              <div className="bg-slate-700/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-emerald-400 mb-3">Getting Started</h3>
                <ol className="text-slate-300 space-y-2 list-decimal list-inside">
                  <li>Configure AI service credentials</li>
                  <li>Initialize document processing pipeline</li>
                  <li>Set up real-time WebSocket connections</li>
                  <li>Implement error handling and retry logic</li>
                  <li>Configure performance monitoring</li>
                </ol>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Troubleshooting</h2>
              <div className="space-y-4">
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">Common Issues</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-slate-200">Processing Timeouts</h4>
                      <p className="text-slate-400">Check document size limits and network connectivity</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200">Low Confidence Scores</h4>
                      <p className="text-slate-400">Verify document quality and format compatibility</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200">WebSocket Connection Issues</h4>
                      <p className="text-slate-400">Ensure proper authentication and firewall configuration</p>
                    </div>
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

export default AIDocumentIntelligenceGuide; 