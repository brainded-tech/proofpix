import React, { useState } from 'react';
import {
  MessageSquare,
  Shield,
  Target,
  Users,
  FileText,
  Download,
  Copy,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Clock,
  DollarSign,
  Phone,
  Mail,
  Linkedin,
  Building,
  Zap
} from 'lucide-react';

interface SalesTemplate {
  id: string;
  title: string;
  type: 'email' | 'linkedin' | 'call' | 'demo';
  industry: string[];
  scenario: string;
  subject?: string;
  content: string;
  followUp?: string;
}

interface BattleCard {
  competitor: string;
  strengths: string[];
  weaknesses: string[];
  ourAdvantages: string[];
  keyMessages: string[];
  pricing: {
    their: string;
    ours: string;
    savings: string;
  };
}

interface Objection {
  objection: string;
  response: string;
  proof: string;
  followUp: string;
}

const SalesEnablementKit: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'templates' | 'battlecards' | 'objections' | 'demos'>('templates');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  const salesTemplates: SalesTemplate[] = [
    {
      id: 'breach-victim-email',
      title: 'Post-Breach Outreach Email',
      type: 'email',
      industry: ['legal', 'healthcare', 'financial'],
      scenario: 'Recent ransomware/breach victim',
      subject: 'What if your recent breach was architecturally impossible?',
      content: `Hi [Name],

I saw the news about [Company]'s recent security incident. While I'm sure your team is working hard on remediation, I wanted to share something that might interest you for the future.

What if I told you there's a way to make data breaches mathematically impossible, not just improbable?

ProofPix's hybrid architecture processes documents locally in your browser - meaning your files never touch our servers. It's not about better security; it's about eliminating the attack surface entirely.

The result:
• Zero breach risk (mathematically impossible)
• 80% cost savings vs traditional enterprise solutions
• 4-week implementation vs 24+ months

Would you be open to a 15-minute call to see how this could prevent future incidents?

Best regards,
[Your Name]

P.S. Our architecture is open source - you can verify our claims yourself.`,
      followUp: 'Follow up in 3 days if no response, reference specific breach details'
    },
    {
      id: 'enterprise-linkedin',
      title: 'Enterprise CIO LinkedIn Message',
      type: 'linkedin',
      industry: ['legal', 'financial', 'healthcare'],
      scenario: 'Cold outreach to enterprise decision makers',
      content: `Hi [Name],

Noticed [Company] is exploring AI document solutions. Quick question: What if you could eliminate data breach risk entirely while saving 80% on enterprise document processing?

Most platforms promise "secure cloud storage." We deliver mathematical impossibility of breaches through local processing.

Worth a 10-minute conversation?

[Your Name]
ProofPix - Where breaches are impossible, not improbable`,
      followUp: 'Send connection request with personalized note about their recent posts/company news'
    },
    {
      id: 'compliance-email',
      title: 'GDPR/Compliance Focused Email',
      type: 'email',
      industry: ['legal', 'healthcare', 'financial'],
      scenario: 'Organizations with heavy compliance requirements',
      subject: 'GDPR compliance by design, not by effort',
      content: `Hi [Name],

Compliance fatigue is real. Between GDPR, HIPAA, SOX, and emerging regulations, your team is probably spending more time on compliance than innovation.

What if compliance was automatic?

ProofPix's hybrid architecture makes compliance inherent:
• Local processing = automatic GDPR compliance
• No data uploads = no breach notification requirements  
• Open source verification = auditor-friendly
• Built-in retention policies = automatic compliance

Real example: [Similar Company] reduced compliance costs by 83% while eliminating breach risk entirely.

15-minute demo to show how this works?

Best,
[Your Name]`,
      followUp: 'Share compliance cost calculator and case study'
    },
    {
      id: 'cost-savings-call',
      title: 'Cost Savings Discovery Call Script',
      type: 'call',
      industry: ['all'],
      scenario: 'Initial discovery call focusing on ROI',
      content: `OPENING:
"Thanks for taking the time today. I know you're evaluating document AI solutions, so let me ask: what's more important - saving 80% on costs or eliminating data breach risk entirely?"

DISCOVERY QUESTIONS:
1. What's your current document processing solution costing annually?
2. How much are you spending on compliance and security infrastructure?
3. What would a data breach cost your organization?
4. How long did your last enterprise software implementation take?

POSITIONING:
"Most platforms ask you to trust their security. We've eliminated the need for trust through mathematical impossibility. Your files never leave your device in privacy mode."

DEMO TRANSITION:
"Let me show you exactly how this works. Can you see my screen?"

CLOSE:
"Based on what you've shared, you could save [calculated amount] annually while eliminating breach risk. What questions do you have about moving forward?"`,
      followUp: 'Send ROI calculation and technical architecture document'
    },
    {
      id: 'ai-forward-demo',
      title: 'AI-Forward Legal Firm Demo Script',
      type: 'demo',
      industry: ['legal'],
      scenario: 'Law firms exploring AI adoption',
      content: `DEMO FLOW:

1. PRIVACY MODE DEMONSTRATION (5 minutes)
   - Upload sensitive legal document
   - Show local processing in browser
   - Highlight zero network transmission
   - "This is mathematically impossible to breach"

2. AI CAPABILITIES (5 minutes)
   - Document classification and entity extraction
   - Legal-specific insights and analysis
   - Chain of custody preservation
   - "AI without privacy compromise"

3. COLLABORATION MODE (3 minutes)
   - Switch to team sharing
   - Show 24-hour auto-deletion
   - Demonstrate audit trails
   - "Collaboration when needed, privacy by default"

4. COST COMPARISON (2 minutes)
   - Show competitor pricing vs ProofPix
   - Highlight 80% savings
   - "Why pay $10K for 'unlikely breach' when you can pay $2K for 'impossible breach'?"

CLOSING QUESTIONS:
- "What would eliminating breach risk mean for your client relationships?"
- "How would 80% cost savings impact your technology budget?"
- "What's your timeline for implementing a solution like this?"`,
      followUp: 'Provide legal industry case study and compliance documentation'
    }
  ];

  const battleCards: BattleCard[] = [
    {
      competitor: 'DocuSign AI',
      strengths: ['Market leader', 'Enterprise features', 'Integrations'],
      weaknesses: ['Server-based storage', 'High costs', 'Breach vulnerability'],
      ourAdvantages: [
        'Local processing eliminates breach risk',
        '80% cost savings ($2K vs $10K+)',
        'Open source verification',
        '83% faster implementation'
      ],
      keyMessages: [
        'They upload files, we don\'t',
        'Mathematical impossibility vs security promises',
        'Compliance by design, not by effort'
      ],
      pricing: {
        their: '$10,000+/month',
        ours: '$2,000/month',
        savings: '80% cost reduction'
      }
    },
    {
      competitor: 'Adobe Enterprise',
      strengths: ['PDF expertise', 'Creative suite integration', 'Brand recognition'],
      weaknesses: ['Cloud storage dependency', 'Complex implementation', 'High costs'],
      ourAdvantages: [
        'Hybrid architecture vs cloud-only',
        '87% cost savings ($2K vs $15K+)',
        '4-week vs 24+ month implementation',
        'Zero breach risk vs possible breach'
      ],
      keyMessages: [
        'Privacy-first vs cloud-first',
        'Architectural impossibility vs mitigation',
        'Rapid deployment vs lengthy implementation'
      ],
      pricing: {
        their: '$15,000+/month',
        ours: '$2,000/month',
        savings: '87% cost reduction'
      }
    },
    {
      competitor: 'Box AI',
      strengths: ['Cloud collaboration', 'Enterprise adoption', 'API ecosystem'],
      weaknesses: ['Cloud storage model', 'Breach vulnerability', 'Compliance complexity'],
      ourAdvantages: [
        'Optional collaboration vs mandatory cloud',
        '75% cost savings ($2K vs $8K+)',
        'Built-in compliance vs additional costs',
        'Ephemeral sharing vs permanent storage'
      ],
      keyMessages: [
        'Collaboration when needed, privacy by default',
        'Automatic compliance vs manual processes',
        'Temporary sharing vs permanent exposure'
      ],
      pricing: {
        their: '$8,000+/month',
        ours: '$2,000/month',
        savings: '75% cost reduction'
      }
    }
  ];

  const objections: Objection[] = [
    {
      objection: "How do we verify your privacy claims?",
      response: "Great question - and exactly why we open-sourced our privacy components. You can verify our claims through code inspection, not just trust our marketing.",
      proof: "GitHub repository with privacy architecture + third-party security audits",
      followUp: "Would you like me to connect you with our technical team for a code walkthrough?"
    },
    {
      objection: "What about team collaboration features?",
      response: "We offer optional ephemeral collaboration mode with 24-hour auto-deletion. You get team features when needed while maintaining privacy by default.",
      proof: "Live demo of collaboration mode + audit trail documentation",
      followUp: "Let me show you exactly how the collaboration mode works in practice."
    },
    {
      objection: "Is it really more secure than enterprise solutions?",
      response: "It's not about being 'more secure' - it's about eliminating the attack surface entirely. When files never leave your device, breaches become mathematically impossible, not just improbable.",
      proof: "Architecture diagram showing local processing + competitor breach history",
      followUp: "What would eliminating breach risk entirely mean for your organization?"
    },
    {
      objection: "How do you handle compliance requirements?",
      response: "Compliance becomes automatic when data never leaves your control. GDPR, HIPAA, SOX - they're all satisfied by design, not by effort.",
      proof: "Compliance documentation + legal opinion letters",
      followUp: "Which specific compliance requirements are most challenging for your organization?"
    },
    {
      objection: "The pricing seems too good to be true.",
      response: "Our costs are lower because we don't need massive server infrastructure. When processing happens locally, our operational costs are dramatically reduced - savings we pass to you.",
      proof: "ROI calculator showing cost breakdown + customer testimonials",
      followUp: "Let me show you exactly how the cost savings break down for an organization your size."
    },
    {
      objection: "What about implementation complexity?",
      response: "Actually, it's simpler because there's no server infrastructure to configure. Most customers are up and running in 4 weeks vs 24+ months for traditional enterprise solutions.",
      proof: "Implementation timeline comparison + customer case studies",
      followUp: "What's your typical timeline for enterprise software implementations?"
    }
  ];

  const copyToClipboard = (text: string, templateId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplate(templateId);
    setTimeout(() => setCopiedTemplate(null), 2000);
  };

  const filteredTemplates = selectedIndustry === 'all' 
    ? salesTemplates 
    : salesTemplates.filter(template => 
        template.industry.includes(selectedIndustry) || template.industry.includes('all')
      );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-purple-600/20 rounded-full text-purple-300 text-sm font-medium mb-6">
            <Target className="w-4 h-4 mr-2" />
            Sales Enablement Kit
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Hybrid Architecture Sales Tools
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Everything you need to sell the "architectural impossibility" message and close enterprise deals
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { id: 'templates', label: 'Sales Templates', icon: MessageSquare },
            { id: 'battlecards', label: 'Battle Cards', icon: Shield },
            { id: 'objections', label: 'Objection Handling', icon: AlertTriangle },
            { id: 'demos', label: 'Demo Scripts', icon: Users }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center ${
                activeTab === id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Icon className="w-5 h-5 mr-2" />
              {label}
            </button>
          ))}
        </div>

        {/* Sales Templates */}
        {activeTab === 'templates' && (
          <div className="space-y-8">
            {/* Industry Filter */}
            <div className="flex justify-center">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Industries</option>
                <option value="legal">Legal Services</option>
                <option value="healthcare">Healthcare</option>
                <option value="financial">Financial Services</option>
              </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredTemplates.map((template) => (
                <div key={template.id} className="bg-slate-800/50 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{template.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        {template.type === 'email' && <Mail className="w-4 h-4" />}
                        {template.type === 'linkedin' && <Linkedin className="w-4 h-4" />}
                        {template.type === 'call' && <Phone className="w-4 h-4" />}
                        {template.type === 'demo' && <Users className="w-4 h-4" />}
                        <span className="capitalize">{template.type}</span>
                        <span>•</span>
                        <span>{template.scenario}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(template.content, template.id)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors flex items-center"
                    >
                      {copiedTemplate === template.id ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>

                  {template.subject && (
                    <div className="mb-4">
                      <div className="text-sm font-medium text-slate-300 mb-1">Subject Line:</div>
                      <div className="text-blue-300 italic">{template.subject}</div>
                    </div>
                  )}

                  <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                    <pre className="text-slate-200 text-sm whitespace-pre-wrap font-mono">
                      {template.content}
                    </pre>
                  </div>

                  {template.followUp && (
                    <div className="text-sm text-slate-400">
                      <strong>Follow-up:</strong> {template.followUp}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Battle Cards */}
        {activeTab === 'battlecards' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {battleCards.map((card, index) => (
              <div key={index} className="bg-slate-800/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Building className="w-5 h-5 mr-2 text-red-400" />
                  vs {card.competitor}
                </h3>

                <div className="space-y-6">
                  {/* Pricing Comparison */}
                  <div className="bg-green-900/30 rounded-lg p-4">
                    <h4 className="font-semibold text-green-300 mb-2">Pricing Advantage</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Their cost:</span>
                        <span className="text-red-400">{card.pricing.their}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Our cost:</span>
                        <span className="text-green-400">{card.pricing.ours}</span>
                      </div>
                      <div className="border-t border-green-700 pt-1 flex justify-between font-semibold">
                        <span className="text-green-300">Savings:</span>
                        <span className="text-green-300">{card.pricing.savings}</span>
                      </div>
                    </div>
                  </div>

                  {/* Our Advantages */}
                  <div>
                    <h4 className="font-semibold text-blue-300 mb-2">Our Advantages</h4>
                    <ul className="space-y-1">
                      {card.ourAdvantages.map((advantage, i) => (
                        <li key={i} className="text-sm text-slate-300 flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                          {advantage}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Messages */}
                  <div>
                    <h4 className="font-semibold text-purple-300 mb-2">Key Messages</h4>
                    <ul className="space-y-1">
                      {card.keyMessages.map((message, i) => (
                        <li key={i} className="text-sm text-slate-300 flex items-start">
                          <Zap className="w-4 h-4 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                          {message}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Their Weaknesses */}
                  <div>
                    <h4 className="font-semibold text-orange-300 mb-2">Their Weaknesses</h4>
                    <ul className="space-y-1">
                      {card.weaknesses.map((weakness, i) => (
                        <li key={i} className="text-sm text-slate-300 flex items-start">
                          <AlertTriangle className="w-4 h-4 text-orange-400 mr-2 mt-0.5 flex-shrink-0" />
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Objection Handling */}
        {activeTab === 'objections' && (
          <div className="space-y-6">
            {objections.map((objection, index) => (
              <div key={index} className="bg-slate-800/50 rounded-xl p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-red-300 mb-3 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Objection
                    </h3>
                    <p className="text-slate-200 mb-4 italic">"{objection.objection}"</p>
                    
                    <h4 className="font-semibold text-green-300 mb-2">Response</h4>
                    <p className="text-slate-300 text-sm">{objection.response}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-blue-300 mb-2">Proof Points</h4>
                    <p className="text-slate-300 text-sm mb-4">{objection.proof}</p>
                    
                    <h4 className="font-semibold text-purple-300 mb-2">Follow-up Question</h4>
                    <p className="text-slate-300 text-sm italic">"{objection.followUp}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Demo Scripts */}
        {activeTab === 'demos' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {salesTemplates.filter(t => t.type === 'demo').map((template) => (
              <div key={template.id} className="bg-slate-800/50 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{template.title}</h3>
                    <div className="text-sm text-slate-400">{template.scenario}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(template.content, template.id)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors flex items-center"
                  >
                    {copiedTemplate === template.id ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                  <pre className="text-slate-200 text-sm whitespace-pre-wrap font-mono">
                    {template.content}
                  </pre>
                </div>

                {template.followUp && (
                  <div className="text-sm text-slate-400">
                    <strong>Follow-up:</strong> {template.followUp}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Close More Enterprise Deals?
            </h3>
            <p className="text-purple-100 mb-6">
              Use these tools to position ProofPix's hybrid architecture as the unassailable competitive advantage
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
                Download Complete Kit
              </button>
              <button className="px-8 py-3 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800 transition-colors">
                Schedule Sales Training
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesEnablementKit; 