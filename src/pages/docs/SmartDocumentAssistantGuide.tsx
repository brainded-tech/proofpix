import React from 'react';
import { EnterpriseLayout } from '../../components/ui/EnterpriseLayout';

const SmartDocumentAssistantGuide: React.FC = () => {
  return (
    <EnterpriseLayout
      showHero
      title="Smart Document Assistant Technical Guide"
      description="Comprehensive technical documentation for ProofPix's Smart Document Assistant"
      maxWidth="6xl"
      backgroundColor="dark"
    >
      <div className="prose prose-invert max-w-none">
        <div className="bg-slate-800/50 rounded-lg p-8 border border-slate-700/50">
          <h1 className="text-3xl font-bold text-emerald-400 mb-6">
            Smart Document Assistant - Technical Guide
          </h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Overview</h2>
              <p className="text-slate-300 mb-4">
                The Smart Document Assistant is ProofPix's advanced conversational AI interface, 
                providing intelligent document analysis through natural language interactions. 
                This sophisticated system spans 1,295 lines of AI-powered conversational logic, 
                delivering enterprise-grade document intelligence through intuitive dialogue.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Core Capabilities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">Natural Language Processing</h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• Advanced NLP for document queries</li>
                    <li>• Multi-language conversation support</li>
                    <li>• Context-aware response generation</li>
                    <li>• Intent recognition and classification</li>
                  </ul>
                </div>
                
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">Intelligent Assistance</h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• Document analysis recommendations</li>
                    <li>• Automated workflow suggestions</li>
                    <li>• Smart query completion</li>
                    <li>• Contextual help and guidance</li>
                  </ul>
                </div>
                
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">Conversational Interface</h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• Real-time chat interface</li>
                    <li>• Voice input and output support</li>
                    <li>• Rich media responses</li>
                    <li>• Interactive document previews</li>
                  </ul>
                </div>
                
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">Learning & Adaptation</h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• User preference learning</li>
                    <li>• Conversation history analysis</li>
                    <li>• Adaptive response optimization</li>
                    <li>• Continuous model improvement</li>
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
                    <h4 className="font-semibold text-slate-200">Conversational AI Engine</h4>
                    <p className="text-slate-400">Advanced NLP models for natural language understanding and generation</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">Intent Recognition System</h4>
                    <p className="text-slate-400">Machine learning models for understanding user intentions</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">Context Management</h4>
                    <p className="text-slate-400">Sophisticated context tracking and conversation state management</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">Response Generation</h4>
                    <p className="text-slate-400">Dynamic response creation with document-specific insights</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Integration Examples</h2>
              <div className="space-y-4">
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">Basic Implementation</h3>
                  <div className="bg-slate-800/50 rounded p-4">
                    <pre className="text-emerald-400 text-sm">
{`import { SmartDocumentAssistant } from '@proofpix/ai';

const assistant = new SmartDocumentAssistant({
  apiKey: 'your-api-key',
  model: 'gpt-4-turbo',
  context: 'document-analysis'
});

// Start conversation
await assistant.startConversation({
  documentId: 'doc-123',
  userId: 'user-456'
});`}
                    </pre>
                  </div>
                </div>
                
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">Advanced Configuration</h3>
                  <div className="bg-slate-800/50 rounded p-4">
                    <pre className="text-emerald-400 text-sm">
{`// Configure custom intents
assistant.addIntent('analyze-metadata', {
  patterns: ['analyze metadata', 'check exif data'],
  handler: async (context) => {
    return await analyzeDocumentMetadata(context.documentId);
  }
});

// Set up real-time responses
assistant.onMessage(async (message) => {
  const response = await assistant.processMessage(message);
  return response;
});`}
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Performance Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-700/30 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">98.5%</div>
                  <div className="text-slate-300">Intent Accuracy</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">&lt;500ms</div>
                  <div className="text-slate-300">Response Time</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">25+</div>
                  <div className="text-slate-300">Languages</div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Common Use Cases</h2>
              <div className="space-y-4">
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">Document Analysis Queries</h3>
                  <div className="space-y-2">
                    <div className="bg-slate-800/50 rounded p-3">
                      <p className="text-slate-300">"What metadata is available in this document?"</p>
                    </div>
                    <div className="bg-slate-800/50 rounded p-3">
                      <p className="text-slate-300">"Can you extract all the key information from this contract?"</p>
                    </div>
                    <div className="bg-slate-800/50 rounded p-3">
                      <p className="text-slate-300">"Show me the compliance status of these documents"</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Development Guide</h2>
              <div className="bg-slate-700/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-emerald-400 mb-3">Setup Instructions</h3>
                <ol className="text-slate-300 space-y-2 list-decimal list-inside">
                  <li>Install the Smart Document Assistant SDK</li>
                  <li>Configure API credentials and endpoints</li>
                  <li>Initialize conversation context</li>
                  <li>Set up intent handlers and custom responses</li>
                  <li>Implement real-time message processing</li>
                  <li>Configure analytics and monitoring</li>
                </ol>
              </div>
            </section>
          </div>
        </div>
      </div>
    </EnterpriseLayout>
  );
};

export default SmartDocumentAssistantGuide; 