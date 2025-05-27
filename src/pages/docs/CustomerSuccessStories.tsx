import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Building, Shield, Scale, TrendingUp, ArrowRight, CheckCircle, Clock, DollarSign, Users } from 'lucide-react';
import DocumentationFooter from '../../components/DocumentationFooter';

export const CustomerSuccessStories: React.FC = () => {
  const caseStudies = [
    {
      company: "Morrison & Associates Law Firm",
      industry: "Legal Services",
      size: "150 attorneys, 300 staff",
      challenge: "Evidence chain of custody and digital forensics for high-profile cases",
      solution: "Forensic metadata analysis with complete audit trails",
      results: {
        timeReduction: "50%",
        costSavings: "$2.3M annually",
        casePreparation: "3x faster",
        complianceScore: "100%"
      },
      quote: "ProofPix transformed our digital evidence workflow. We can now guarantee complete chain of custody while processing evidence 3x faster than before.",
      quotePerson: "Sarah Chen, Chief Technology Officer",
      icon: Scale,
      color: "blue",
      details: {
        before: [
          "Manual evidence processing taking 4-6 hours per case",
          "Chain of custody concerns with third-party services",
          "Compliance audits requiring extensive documentation",
          "High risk of evidence tampering or data breaches"
        ],
        after: [
          "Automated processing in under 2 hours per case",
          "Guaranteed chain of custody with client-side processing",
          "Built-in compliance documentation and audit trails",
          "Zero risk of data exposure or evidence tampering"
        ],
        metrics: [
          { label: "Case Preparation Time", before: "4-6 hours", after: "1.5 hours", improvement: "75% faster" },
          { label: "Evidence Processing Cost", before: "$850 per case", after: "$200 per case", improvement: "$650 savings" },
          { label: "Compliance Audit Time", before: "2 weeks", after: "2 days", improvement: "85% reduction" },
          { label: "Data Breach Risk", before: "High", after: "Zero", improvement: "100% elimination" }
        ]
      }
    },
    {
      company: "SecureGuard Insurance",
      industry: "Insurance & Financial Services",
      size: "2,500 employees, 50,000 claims/month",
      challenge: "Claims fraud detection and image authenticity verification",
      solution: "Image authenticity verification with metadata analysis",
      results: {
        fraudReduction: "30%",
        costSavings: "$8.7M annually",
        processingSpeed: "10x faster",
        accuracy: "99.2%"
      },
      quote: "The ROI was immediate. We're detecting fraud faster and more accurately while dramatically reducing our processing costs.",
      quotePerson: "Michael Rodriguez, VP of Claims Operations",
      icon: Shield,
      color: "green",
      details: {
        before: [
          "Manual image verification taking 45 minutes per claim",
          "High false positive rate in fraud detection",
          "Expensive third-party verification services",
          "Delayed claim processing affecting customer satisfaction"
        ],
        after: [
          "Automated verification in under 4 minutes per claim",
          "AI-powered fraud detection with 99.2% accuracy",
          "Complete in-house processing with zero data exposure",
          "Real-time claim processing improving customer experience"
        ],
        metrics: [
          { label: "Claim Processing Time", before: "45 minutes", after: "4 minutes", improvement: "91% faster" },
          { label: "Fraud Detection Accuracy", before: "78%", after: "99.2%", improvement: "21% improvement" },
          { label: "Monthly Processing Costs", before: "$1.2M", after: "$275K", improvement: "$925K savings" },
          { label: "Customer Satisfaction", before: "72%", after: "94%", improvement: "22% increase" }
        ]
      }
    },
    {
      company: "Federal Security Agency",
      industry: "Government & Security",
      size: "1,200 investigators, classified operations",
      challenge: "Digital forensics workflow and secure evidence processing",
      solution: "Comprehensive metadata extraction with security compliance",
      results: {
        investigationSpeed: "65%",
        securityCompliance: "100%",
        costReduction: "$4.2M annually",
        caseResolution: "40% faster"
      },
      quote: "ProofPix meets our highest security standards while dramatically improving our investigation capabilities. It's a game-changer for digital forensics.",
      quotePerson: "Director James Patterson, Digital Forensics Division",
      icon: Building,
      color: "purple",
      details: {
        before: [
          "Complex evidence processing requiring multiple tools",
          "Security concerns with cloud-based solutions",
          "Lengthy approval processes for new technologies",
          "Inconsistent metadata extraction across different cases"
        ],
        after: [
          "Unified platform for all digital evidence processing",
          "Complete air-gapped processing meeting security requirements",
          "Instant deployment with no infrastructure changes",
          "Standardized metadata extraction with comprehensive reporting"
        ],
        metrics: [
          { label: "Evidence Processing Time", before: "8 hours", after: "2.5 hours", improvement: "69% faster" },
          { label: "Security Compliance Score", before: "85%", after: "100%", improvement: "15% improvement" },
          { label: "Tool Consolidation", before: "12 tools", after: "1 platform", improvement: "92% reduction" },
          { label: "Case Resolution Time", before: "45 days", after: "27 days", improvement: "40% faster" }
        ]
      }
    }
  ];

  const industryStats = [
    {
      industry: "Legal Services",
      customers: "150+",
      avgSavings: "$1.8M",
      satisfaction: "98%",
      icon: Scale
    },
    {
      industry: "Insurance",
      customers: "85+",
      avgSavings: "$3.2M",
      satisfaction: "96%",
      icon: Shield
    },
    {
      industry: "Government",
      customers: "45+",
      avgSavings: "$2.7M",
      satisfaction: "99%",
      icon: Building
    },
    {
      industry: "Healthcare",
      customers: "120+",
      avgSavings: "$1.4M",
      satisfaction: "97%",
      icon: Users
    }
  ];

  const testimonials = [
    {
      quote: "The security architecture is exactly what we needed. Zero data exposure means zero risk for our clients.",
      person: "Dr. Amanda Foster",
      title: "CISO, MedSecure Health Systems",
      company: "Healthcare"
    },
    {
      quote: "Implementation was seamless. We were processing images faster on day one with immediate cost savings.",
      person: "Robert Kim",
      title: "IT Director, Pacific Legal Group",
      company: "Legal Services"
    },
    {
      quote: "The ROI exceeded our projections. We're saving over $400K monthly while improving our fraud detection.",
      person: "Lisa Thompson",
      title: "VP Operations, National Insurance Corp",
      company: "Insurance"
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
        <span className="text-gray-600">Customer Success Stories</span>
      </nav>

      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
          <Award className="mr-3 text-blue-600" size={32} />
          Customer Success Stories
        </h1>
        <p className="text-xl text-gray-600">
          Real results from organizations transforming their image processing workflows
        </p>
      </div>

      {/* Industry overview */}
      <section className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Success Across Industries</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {industryStats.map((stat, index) => (
            <div key={index} className="text-center bg-white rounded-lg p-6 shadow-sm">
              <stat.icon className="mx-auto text-blue-600 mb-3" size={32} />
              <h3 className="font-semibold text-gray-900 mb-2">{stat.industry}</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div><strong>{stat.customers}</strong> customers</div>
                <div><strong>{stat.avgSavings}</strong> avg savings</div>
                <div><strong>{stat.satisfaction}</strong> satisfaction</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Case studies */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Detailed Case Studies</h2>
        
        <div className="space-y-12">
          {caseStudies.map((study, index) => (
            <div key={index} className={`border-2 border-${study.color}-200 rounded-lg p-8 bg-${study.color}-50`}>
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                  <study.icon className={`mr-4 text-${study.color}-600`} size={40} />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{study.company}</h3>
                    <p className="text-gray-600">{study.industry} • {study.size}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold text-${study.color}-600`}>
                    {Object.values(study.results)[0]}
                  </div>
                  <div className="text-sm text-gray-600">improvement</div>
                </div>
              </div>

              {/* Challenge & Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Challenge</h4>
                  <p className="text-gray-700 mb-4">{study.challenge}</p>
                  
                  <h5 className="font-medium text-gray-900 mb-2">Before ProofPix:</h5>
                  <ul className="space-y-1">
                    {study.details.before.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start text-sm text-gray-600">
                        <span className="text-red-500 mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Solution</h4>
                  <p className="text-gray-700 mb-4">{study.solution}</p>
                  
                  <h5 className="font-medium text-gray-900 mb-2">After ProofPix:</h5>
                  <ul className="space-y-1">
                    {study.details.after.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start text-sm text-gray-600">
                        <CheckCircle className="mr-2 text-green-500 mt-0.5" size={12} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Results metrics */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-4">Key Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {study.details.metrics.map((metric, metricIndex) => (
                    <div key={metricIndex} className="bg-white rounded-lg p-4 shadow-sm">
                      <h5 className="font-medium text-gray-900 text-sm mb-2">{metric.label}</h5>
                      <div className="space-y-1 text-xs">
                        <div className="text-red-600">Before: {metric.before}</div>
                        <div className="text-green-600">After: {metric.after}</div>
                        <div className={`font-bold text-${study.color}-600`}>{metric.improvement}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quote */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <blockquote className="text-lg text-gray-700 italic mb-4">
                  "{study.quote}"
                </blockquote>
                <div className="text-sm text-gray-600">
                  <strong>{study.quotePerson}</strong>
                  <br />
                  {study.company}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Additional testimonials */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">What Our Customers Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white border rounded-lg p-6 shadow-sm">
              <blockquote className="text-gray-700 mb-4">
                "{testimonial.quote}"
              </blockquote>
              <div className="text-sm">
                <div className="font-semibold text-gray-900">{testimonial.person}</div>
                <div className="text-gray-600">{testimonial.title}</div>
                <div className="text-blue-600">{testimonial.company}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Implementation success factors */}
      <section className="mb-12 bg-gray-50 border rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Keys to Implementation Success</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Critical Success Factors</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="mr-3 text-green-500 mt-1" size={16} />
                <div>
                  <strong>Executive Sponsorship:</strong> C-level support ensures smooth adoption and resource allocation
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-3 text-green-500 mt-1" size={16} />
                <div>
                  <strong>Pilot Program:</strong> Start with a small team to demonstrate value before full rollout
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-3 text-green-500 mt-1" size={16} />
                <div>
                  <strong>Training Investment:</strong> Comprehensive training ensures teams maximize platform benefits
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-3 text-green-500 mt-1" size={16} />
                <div>
                  <strong>Process Integration:</strong> Align ProofPix with existing workflows for seamless adoption
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Implementation Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</div>
                <div>
                  <strong>Week 1:</strong> Platform setup and initial team training
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</div>
                <div>
                  <strong>Week 2-3:</strong> Pilot program with core use cases
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">4</div>
                <div>
                  <strong>Week 4-6:</strong> Full team rollout and process optimization
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">8</div>
                <div>
                  <strong>Week 8+:</strong> Advanced features and custom integrations
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI summary */}
      <section className="mb-12 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Average Customer ROI</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <DollarSign className="mx-auto text-green-600 mb-2" size={32} />
            <div className="text-3xl font-bold text-green-600 mb-1">$2.4M</div>
            <div className="text-sm text-gray-600">Average Annual Savings</div>
          </div>
          <div className="text-center">
            <TrendingUp className="mx-auto text-blue-600 mb-2" size={32} />
            <div className="text-3xl font-bold text-blue-600 mb-1">340%</div>
            <div className="text-sm text-gray-600">Average ROI</div>
          </div>
          <div className="text-center">
            <Clock className="mx-auto text-purple-600 mb-2" size={32} />
            <div className="text-3xl font-bold text-purple-600 mb-1">2.3</div>
            <div className="text-sm text-gray-600">Months to Payback</div>
          </div>
          <div className="text-center">
            <CheckCircle className="mx-auto text-orange-600 mb-2" size={32} />
            <div className="text-3xl font-bold text-orange-600 mb-1">97%</div>
            <div className="text-sm text-gray-600">Customer Satisfaction</div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="mb-12 bg-white border rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Join Our Success Stories?</h2>
        <p className="text-gray-600 mb-6">
          See how ProofPix can transform your organization's image processing workflow
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/enterprise/demo" 
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Enterprise Demo
          </Link>
          <Link 
            to="/docs/roi-calculator" 
            className="inline-flex items-center border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Calculate Your ROI
          </Link>
        </div>
      </section>

      {/* Footer navigation */}
      <nav className="mt-12 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <Link 
            to="/docs/roi-calculator" 
            className="flex items-center text-blue-600 hover:underline"
          >
            ← Previous: ROI Calculator
          </Link>
          <Link 
            to="/docs/implementation-guides" 
            className="flex items-center text-blue-600 hover:underline"
          >
            Next: Implementation Guides →
            <ArrowRight className="ml-1" size={16} />
          </Link>
        </div>
      </nav>

      <DocumentationFooter />
    </div>
  );
}; 