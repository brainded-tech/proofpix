import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Target, Users, MessageSquare, TrendingUp, ArrowRight, CheckCircle, AlertTriangle, DollarSign } from 'lucide-react';
import DocumentationFooter from '../../components/DocumentationFooter';

export const SalesPlaybook: React.FC = () => {
  const customerSegments = [
    {
      name: "AI-Native Prospects",
      percentage: "40%",
      characteristics: [
        "Tech-forward organizations",
        "Early adopters of AI/automation",
        "Self-service preference",
        "Quick decision-making"
      ],
      approach: "Fully automated sales process",
      timeline: "1-2 weeks",
      avgDealSize: "$15,000 - $50,000",
      color: "green"
    },
    {
      name: "AI-Assisted Prospects",
      percentage: "35%",
      characteristics: [
        "Mid-market companies",
        "Some automation adoption",
        "Prefer guided demos",
        "Committee-based decisions"
      ],
      approach: "AI-assisted with human validation",
      timeline: "3-6 weeks",
      avgDealSize: "$25,000 - $100,000",
      color: "blue"
    },
    {
      name: "Human-Led Prospects",
      percentage: "25%",
      characteristics: [
        "Enterprise/Fortune 500",
        "Traditional sales preference",
        "Complex requirements",
        "Extensive evaluation process"
      ],
      approach: "Human-led with AI insights",
      timeline: "2-6 months",
      avgDealSize: "$75,000 - $500,000",
      color: "purple"
    }
  ];

  const qualificationCriteria = {
    budget: {
      aiNative: "$10K+ annual image processing budget",
      aiAssisted: "$25K+ annual security/compliance budget",
      humanLed: "$100K+ annual enterprise software budget"
    },
    authority: {
      aiNative: "IT Director or CTO",
      aiAssisted: "Security Officer or VP Engineering",
      humanLed: "C-Suite or procurement committee"
    },
    need: {
      aiNative: "Immediate security/privacy concerns",
      aiAssisted: "Compliance requirements or data breaches",
      humanLed: "Strategic digital transformation initiative"
    },
    timeline: {
      aiNative: "Immediate to 30 days",
      aiAssisted: "30-90 days",
      humanLed: "90+ days"
    }
  };

  const objections = [
    {
      objection: "\"We already have image processing solutions\"",
      response: "Traditional solutions expose your data to third-party servers. ProofPix processes everything client-side, ensuring zero data exposure. This isn't just better processing—it's a fundamental security upgrade.",
      evidence: ["Zero data breach risk", "Instant processing", "No server costs", "Complete privacy guarantee"]
    },
    {
      objection: "\"The pricing seems high\"",
      response: "Consider the total cost: server infrastructure, security compliance, data breach insurance, and processing delays. ProofPix eliminates all of these while providing superior results.",
      evidence: ["$50K+ annual server savings", "Zero compliance overhead", "No data breach liability", "Instant ROI"]
    },
    {
      objection: "\"We need to see more enterprise features\"",
      response: "Our enterprise demo shows a complete Fortune 500 environment with 47 team members, advanced RBAC, white-label branding, and comprehensive audit trails. Would you like to explore specific features?",
      evidence: ["Enterprise demo available", "Fortune 500 customers", "Complete feature parity", "Custom development available"]
    },
    {
      objection: "\"Client-side processing sounds too good to be true\"",
      response: "This is cutting-edge technology that major browsers now support. We can demonstrate live processing in your browser right now, showing the metadata extraction happening locally.",
      evidence: ["Live demonstration", "Browser compatibility", "Technical documentation", "Security architecture overview"]
    },
    {
      objection: "\"We need integration with our existing systems\"",
      response: "Our API-first architecture integrates with any system. We provide SDKs for all major languages and can build custom integrations. Most integrations are completed in under 2 weeks.",
      evidence: ["Comprehensive API", "Multiple SDKs", "Integration examples", "Professional services available"]
    }
  ];

  const demoStrategies = [
    {
      segment: "AI-Native",
      approach: "Self-Service Demo",
      duration: "15-30 minutes",
      format: "Interactive online demo",
      followUp: "Automated email sequence",
      conversion: "85%",
      steps: [
        "Send demo link immediately",
        "Automated onboarding sequence",
        "AI-driven pricing proposal",
        "Self-service contract signing"
      ]
    },
    {
      segment: "AI-Assisted",
      approach: "Guided Demo",
      duration: "45-60 minutes",
      format: "Screen share + Q&A",
      followUp: "Human sales rep",
      conversion: "70%",
      steps: [
        "Schedule demo within 24 hours",
        "Customized demo environment",
        "Live Q&A session",
        "Follow-up proposal call"
      ]
    },
    {
      segment: "Human-Led",
      approach: "Custom Presentation",
      duration: "90+ minutes",
      format: "Executive presentation",
      followUp: "Account team assignment",
      conversion: "60%",
      steps: [
        "Discovery call with stakeholders",
        "Custom demo environment setup",
        "Executive presentation",
        "Proof of concept proposal"
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Breadcrumb navigation */}
      <nav className="mb-6 text-sm">
        <Link to="/docs" className="text-blue-600 hover:underline">Documentation</Link>
        <span className="mx-2">/</span>
        <Link to="/docs" className="text-blue-600 hover:underline">Sales</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">Sales Playbook</span>
      </nav>

      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
          <BookOpen className="mr-3 text-blue-600" size={32} />
          ProofPix Sales Playbook
        </h1>
        <p className="text-xl text-gray-600">
          Comprehensive guide to selling ProofPix enterprise solutions
        </p>
      </div>

      {/* Executive summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Sales Strategy Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
            <div className="text-sm text-gray-600">Customer Segments</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">72%</div>
            <div className="text-sm text-gray-600">Average Conversion Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">$85K</div>
            <div className="text-sm text-gray-600">Average Deal Size</div>
          </div>
        </div>
      </div>

      {/* Customer Segmentation */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Target className="mr-2 text-green-500" size={24} />
          Customer Segmentation
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {customerSegments.map((segment, index) => (
            <div key={index} className={`border-2 border-${segment.color}-200 rounded-lg p-6 bg-${segment.color}-50`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{segment.name}</h3>
                <span className={`text-2xl font-bold text-${segment.color}-600`}>{segment.percentage}</span>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Characteristics:</h4>
                <ul className="space-y-1">
                  {segment.characteristics.map((char, charIndex) => (
                    <li key={charIndex} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="mr-2 text-green-500" size={12} />
                      {char}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 text-sm">
                <div><strong>Approach:</strong> {segment.approach}</div>
                <div><strong>Timeline:</strong> {segment.timeline}</div>
                <div><strong>Deal Size:</strong> {segment.avgDealSize}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BANT Qualification Framework */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Users className="mr-2 text-blue-500" size={24} />
          BANT Qualification Framework
        </h2>
        
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Criteria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI-Native</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI-Assisted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Human-Led</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Budget</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{qualificationCriteria.budget.aiNative}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{qualificationCriteria.budget.aiAssisted}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{qualificationCriteria.budget.humanLed}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Authority</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{qualificationCriteria.authority.aiNative}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{qualificationCriteria.authority.aiAssisted}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{qualificationCriteria.authority.humanLed}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Need</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{qualificationCriteria.need.aiNative}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{qualificationCriteria.need.aiAssisted}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{qualificationCriteria.need.humanLed}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Timeline</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{qualificationCriteria.timeline.aiNative}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{qualificationCriteria.timeline.aiAssisted}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{qualificationCriteria.timeline.humanLed}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Demo Strategy */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="mr-2 text-purple-500" size={24} />
          Demo Strategy by Segment
        </h2>
        
        <div className="space-y-6">
          {demoStrategies.map((strategy, index) => (
            <div key={index} className="border rounded-lg p-6 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{strategy.segment} Prospects</h3>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {strategy.conversion} conversion
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Demo Details:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li><strong>Approach:</strong> {strategy.approach}</li>
                    <li><strong>Duration:</strong> {strategy.duration}</li>
                    <li><strong>Format:</strong> {strategy.format}</li>
                    <li><strong>Follow-up:</strong> {strategy.followUp}</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Process Steps:</h4>
                  <ol className="space-y-1 text-sm text-gray-600">
                    {strategy.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-center">
                        <span className="bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2">
                          {stepIndex + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Objection Handling */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <MessageSquare className="mr-2 text-orange-500" size={24} />
          Objection Handling Guide
        </h2>
        
        <div className="space-y-6">
          {objections.map((obj, index) => (
            <div key={index} className="border rounded-lg p-6 bg-white shadow-sm">
              <div className="flex items-start mb-4">
                <AlertTriangle className="mr-3 text-orange-500 mt-1" size={20} />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{obj.objection}</h3>
                  <p className="text-gray-600 mb-4">{obj.response}</p>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Supporting Evidence:</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {obj.evidence.map((evidence, evidenceIndex) => (
                        <li key={evidenceIndex} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="mr-2 text-green-500" size={14} />
                          {evidence}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick reference */}
      <section className="mb-12 bg-gray-50 border rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Reference Guide</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Value Props</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <CheckCircle className="mr-2 text-green-500" size={14} />
                Zero data exposure guarantee
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 text-green-500" size={14} />
                Instant processing (no server delays)
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 text-green-500" size={14} />
                Complete compliance out-of-the-box
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 text-green-500" size={14} />
                Massive cost savings (no infrastructure)
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Competitive Advantages</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <CheckCircle className="mr-2 text-green-500" size={14} />
                Industry-first client-side architecture
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 text-green-500" size={14} />
                No vendor lock-in or data dependency
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 text-green-500" size={14} />
                Instant deployment and scaling
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 text-green-500" size={14} />
                Future-proof technology stack
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer navigation */}
      <nav className="mt-12 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <Link 
            to="/docs/enterprise-demo-walkthrough" 
            className="flex items-center text-blue-600 hover:underline"
          >
            ← Previous: Enterprise Demo Walkthrough
          </Link>
          <Link 
            to="/docs/roi-calculator" 
            className="flex items-center text-blue-600 hover:underline"
          >
            Next: ROI Calculator →
            <ArrowRight className="ml-1" size={16} />
          </Link>
        </div>
      </nav>

      <DocumentationFooter />
    </div>
  );
}; 