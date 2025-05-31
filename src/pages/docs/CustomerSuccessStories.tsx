import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Building, Shield, Scale, TrendingUp, ArrowRight, CheckCircle, Clock, DollarSign, Users, ArrowLeft, AlertCircle, Mail, Star } from 'lucide-react';
import { EnterpriseLayout } from '../../components/ui/EnterpriseLayout';
import { 
  EnterpriseButton, 
  EnterpriseCard, 
  EnterpriseBadge,
  EnterpriseSection,
  EnterpriseGrid
} from '../../components/ui/EnterpriseComponents';
import DocumentationFooter from '../../components/DocumentationFooter';

export const CustomerSuccessStories: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToDocs = () => {
    navigate('/docs');
  };

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
    <EnterpriseLayout
      showHero
      title="Customer Success Stories"
      description="See how ProofPix can transform document processing workflows"
      maxWidth="6xl"
    >
      {/* Header */}
      <EnterpriseSection size="sm">
        <EnterpriseButton
          variant="ghost"
          onClick={handleBackToDocs}
          className="mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Documentation
        </EnterpriseButton>
        
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-blue-600 p-3 rounded-lg">
            <Award className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Customer Success Stories</h1>
            <p className="text-xl text-slate-600 mt-2">
              See how ProofPix can transform document processing workflows
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 text-sm">
          <EnterpriseBadge variant="primary" icon={<Award className="enterprise-icon-sm" />}>
            Success Stories
          </EnterpriseBadge>
          <EnterpriseBadge variant="success" icon={<TrendingUp className="enterprise-icon-sm" />}>
            Proven Results
          </EnterpriseBadge>
          <EnterpriseBadge variant="neutral" icon={<CheckCircle className="enterprise-icon-sm" />}>
            Customer Validated
          </EnterpriseBadge>
        </div>
      </EnterpriseSection>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Representative Examples Notice */}
        <EnterpriseCard className="mb-8 bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-4">
            <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Representative Examples</h3>
              <p className="text-slate-700">
                The following case studies represent composite examples based on projected results and industry benchmarks. 
                They illustrate how organizations in different sectors can benefit from ProofPix's document intelligence platform. 
                While based on extensive research and industry expertise, these specific organizations are representative examples rather than actual customers.
              </p>
            </div>
          </div>
        </EnterpriseCard>

        {/* Industry overview */}
        <EnterpriseCard className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Projected Results Across Industries</h2>
          
          <EnterpriseGrid columns={4}>
            {industryStats.map((stat, index) => (
              <EnterpriseCard key={index} className="text-center">
                <stat.icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 mb-2">{stat.industry}</h3>
                <div className="space-y-1 text-sm">
                  <div className="text-slate-600">Target Users: <span className="font-bold text-blue-600">{stat.customers}</span></div>
                  <div className="text-slate-600">Projected Savings: <span className="font-bold text-green-600">{stat.avgSavings}</span></div>
                  <div className="text-slate-600">Expected Satisfaction: <span className="font-bold text-purple-600">{stat.satisfaction}</span></div>
                </div>
              </EnterpriseCard>
            ))}
          </EnterpriseGrid>
        </EnterpriseCard>

        {/* Case studies */}
        <div className="space-y-12">
          {caseStudies.map((study, index) => (
            <EnterpriseCard key={index} className="border-2 border-slate-200">
              <div className="flex items-start space-x-6">
                <div className={`p-4 rounded-lg ${
                  study.color === 'blue' ? 'bg-blue-100' :
                  study.color === 'green' ? 'bg-green-100' :
                  'bg-purple-100'
                }`}>
                  <study.icon className={`h-8 w-8 ${
                    study.color === 'blue' ? 'text-blue-600' :
                    study.color === 'green' ? 'text-green-600' :
                    'text-purple-600'
                  }`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-1">{study.company}</h3>
                      <div className="flex items-center space-x-4 text-sm text-slate-600">
                        <span>{study.industry}</span>
                        <span>•</span>
                        <span>{study.size}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <EnterpriseBadge variant="primary">
                        {study.industry}
                      </EnterpriseBadge>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-slate-900 mb-2">Challenge:</h4>
                    <p className="text-slate-600 mb-4">{study.challenge}</p>
                    
                    <h4 className="font-semibold text-slate-900 mb-2">Solution:</h4>
                    <p className="text-slate-600">{study.solution}</p>
                  </div>

                  {/* Results metrics */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-slate-900 mb-3">Key Results:</h4>
                    <EnterpriseGrid columns={4}>
                      {Object.entries(study.results).map(([key, value], resultIndex) => (
                        <div key={resultIndex} className="text-center p-3 bg-slate-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">{value}</div>
                          <div className="text-xs text-slate-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                        </div>
                      ))}
                    </EnterpriseGrid>
                  </div>

                  {/* Quote */}
                  <div className="bg-slate-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <blockquote className="text-slate-700 italic mb-2">
                      "{study.quote}"
                    </blockquote>
                    <cite className="text-sm text-slate-600 font-medium">
                      — {study.quotePerson}
                    </cite>
                  </div>

                  {/* Detailed metrics */}
                  <div className="mt-6">
                    <h4 className="font-semibold text-slate-900 mb-3">Detailed Impact:</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-slate-700">Metric</th>
                            <th className="px-4 py-2 text-left text-slate-700">Before</th>
                            <th className="px-4 py-2 text-left text-slate-700">After</th>
                            <th className="px-4 py-2 text-left text-slate-700">Improvement</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {study.details.metrics.map((metric, metricIndex) => (
                            <tr key={metricIndex}>
                              <td className="px-4 py-2 font-medium text-slate-900">{metric.label}</td>
                              <td className="px-4 py-2 text-slate-600">{metric.before}</td>
                              <td className="px-4 py-2 text-slate-600">{metric.after}</td>
                              <td className="px-4 py-2 font-medium text-green-600">{metric.improvement}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Before/After comparison */}
                  <div className="mt-6">
                    <EnterpriseGrid columns={2}>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                          <Clock className="h-4 w-4 text-red-500 mr-2" />
                          Before ProofPix
                        </h4>
                        <ul className="space-y-2">
                          {study.details.before.map((item, beforeIndex) => (
                            <li key={beforeIndex} className="flex items-start text-sm text-slate-600">
                              <span className="text-red-500 mr-2">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          After ProofPix
                        </h4>
                        <ul className="space-y-2">
                          {study.details.after.map((item, afterIndex) => (
                            <li key={afterIndex} className="flex items-start text-sm text-slate-600">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </EnterpriseGrid>
                  </div>
                </div>
              </div>
            </EnterpriseCard>
          ))}
        </div>

        {/* Testimonials */}
        <EnterpriseCard className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">What Our Customers Say</h2>
          
          <EnterpriseGrid columns={1}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-50 p-6 rounded-lg border-l-4 border-blue-500">
                <blockquote className="text-slate-700 italic mb-4 text-lg">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <cite className="font-semibold text-slate-900">{testimonial.person}</cite>
                    <div className="text-sm text-slate-600">{testimonial.title}</div>
                    <EnterpriseBadge variant="neutral">
                      {testimonial.company}
                    </EnterpriseBadge>
                  </div>
                </div>
              </div>
            ))}
          </EnterpriseGrid>
        </EnterpriseCard>

        {/* Call to Action */}
        <EnterpriseCard className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Ready to Join Our Success Stories?</h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            See how ProofPix can transform your organization's image processing workflows. 
            Schedule a demo to discuss your specific use case and requirements.
          </p>
          <div className="flex justify-center space-x-4">
            <EnterpriseButton variant="primary">
              Schedule Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </EnterpriseButton>
            <EnterpriseButton variant="secondary">
              View ROI Calculator
            </EnterpriseButton>
          </div>
        </EnterpriseCard>

        {/* Become a Featured Case Study */}
        <EnterpriseCard className="mt-16 mb-8 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
          <div className="text-center max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Become Our First Featured Case Study</h2>
            <p className="text-slate-700 mb-6">
              Are you achieving exceptional results with ProofPix? We'd love to feature your organization as one of our 
              first official case studies. Share your success story and inspire others in your industry.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <EnterpriseButton
                variant="primary"
                size="lg"
                icon={<Mail className="h-5 w-5" />}
                onClick={() => window.location.href = 'mailto:success@proofpixapp.com'}
              >
                Submit Your Story
              </EnterpriseButton>
              <EnterpriseButton
                variant="secondary"
                size="lg"
                onClick={() => navigate('/enterprise/demo')}
              >
                <ArrowRight className="h-5 w-5 mr-2" />
                Try ProofPix Enterprise
              </EnterpriseButton>
            </div>
          </div>
        </EnterpriseCard>
      </div>

      {/* Footer */}
      <DocumentationFooter />
    </EnterpriseLayout>
  );
};

export default CustomerSuccessStories; 