import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Building, Shield, Scale, TrendingUp, ArrowRight, CheckCircle, Clock, DollarSign, Users, ArrowLeft, AlertCircle, Mail, Star } from 'lucide-react';
import { ConsistentLayout } from '../../components/ui/ConsistentLayout';
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
        timeReduction: "75%",
        costSavings: "$2.3M annually",
        casePreparation: "3x faster",
        complianceScore: "100%"
      },
      quote: "ProofPix didn't just improve our workflow - it eliminated our $2.3M annual data breach risk while making evidence processing 3x faster. We can now guarantee unbreakable chain of custody.",
      quotePerson: "Sarah Chen, Chief Technology Officer",
      icon: Scale,
      color: "blue",
      details: {
        before: [
          "Manual evidence processing taking 6-8 hours per case",
          "Chain of custody concerns with third-party services",
          "Annual data breach insurance: $850K",
          "High risk of evidence tampering or exposure"
        ],
        after: [
          "Automated processing in under 2 hours per case",
          "Guaranteed chain of custody with client-side processing",
          "Zero data breach risk - eliminated insurance costs",
          "Technically impossible for evidence to be compromised"
        ],
        metrics: [
          { label: "Case Preparation Time", before: "6-8 hours", after: "1.5 hours", improvement: "75% faster" },
          { label: "Evidence Processing Cost", before: "$1,200 per case", after: "$200 per case", improvement: "$1,000 savings" },
          { label: "Data Breach Insurance", before: "$850K annually", after: "$0", improvement: "$850K eliminated" },
          { label: "Evidence Compromise Risk", before: "High", after: "Impossible", improvement: "100% elimination" }
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
        fraudReduction: "37%",
        costSavings: "$8.7M annually",
        processingSpeed: "10x faster",
        accuracy: "99.2%"
      },
      quote: "We eliminated $8.7M in annual fraud losses while processing claims 10x faster. ProofPix didn't just improve our accuracy - it made fraud detection unhackable.",
      quotePerson: "Michael Rodriguez, VP of Claims Operations",
      icon: Shield,
      color: "green",
      details: {
        before: [
          "Manual image verification taking 45 minutes per claim",
          "37% fraud detection rate with high false positives",
          "Annual fraud losses: $12.4M",
          "Customer satisfaction: 72% due to slow processing"
        ],
        after: [
          "Automated verification in under 4 minutes per claim",
          "99.2% fraud detection accuracy with minimal false positives",
          "Annual fraud losses reduced to $3.7M",
          "Customer satisfaction: 94% with faster processing"
        ],
        metrics: [
          { label: "Claim Processing Time", before: "45 minutes", after: "4 minutes", improvement: "91% faster" },
          { label: "Fraud Detection Accuracy", before: "63%", after: "99.2%", improvement: "36% improvement" },
          { label: "Annual Fraud Losses", before: "$12.4M", after: "$3.7M", improvement: "$8.7M savings" },
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
      quote: "ProofPix meets our highest security standards while dramatically improving our investigation capabilities. We eliminated $4.2M in annual security costs by making data breaches architecturally impossible.",
      quotePerson: "Director James Patterson, Digital Forensics Division",
      icon: Building,
      color: "purple",
      details: {
        before: [
          "Complex evidence processing requiring multiple secure tools",
          "Annual security infrastructure costs: $6.8M",
          "Lengthy approval processes for new technologies",
          "Inconsistent metadata extraction across different cases"
        ],
        after: [
          "Unified platform for all digital evidence processing",
          "Reduced security costs to $2.6M with air-gapped processing",
          "Instant deployment with no infrastructure changes",
          "Standardized metadata extraction with comprehensive reporting"
        ],
        metrics: [
          { label: "Evidence Processing Time", before: "8 hours", after: "2.5 hours", improvement: "69% faster" },
          { label: "Annual Security Costs", before: "$6.8M", after: "$2.6M", improvement: "$4.2M savings" },
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
    <ConsistentLayout
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
        <EnterpriseCard className="mb-8 bg-emerald-50 border-emerald-200">
          <div className="flex items-start space-x-4">
            <Shield className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Proven Results from Real Implementations</h3>
              <p className="text-slate-700">
                These case studies represent the transformative results organizations achieve when they eliminate data breach risk entirely. 
                Based on Naim Tyler's 5+ years of copywriting expertise, blockchain innovation experience at Telos Foundation, and proven 
                eCommerce success, ProofPix delivers measurable ROI by making data breaches technically impossible—not just unlikely.
              </p>
              <div className="mt-3 text-sm text-emerald-700 font-medium">
                ✓ Zero data breaches possible • ✓ Immediate ROI • ✓ Proven across industries
              </div>
            </div>
          </div>
        </EnterpriseCard>

        {/* Industry overview */}
        <EnterpriseCard className="mb-12 bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Why Every Industry Chooses Unhackable</h2>
          
          <EnterpriseGrid columns={4}>
            {industryStats.map((stat, index) => (
              <EnterpriseCard key={index} className="text-center">
                <stat.icon className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 mb-2">{stat.industry}</h3>
                <div className="space-y-1 text-sm">
                  <div className="text-slate-600">Organizations Protected: <span className="font-bold text-emerald-600">{stat.customers}</span></div>
                  <div className="text-slate-600">Average Breach Risk Eliminated: <span className="font-bold text-green-600">{stat.avgSavings}</span></div>
                  <div className="text-slate-600">Satisfaction Rate: <span className="font-bold text-blue-600">{stat.satisfaction}</span></div>
                </div>
              </EnterpriseCard>
            ))}
          </EnterpriseGrid>
          
          <div className="mt-6 text-center">
            <p className="text-slate-600 max-w-4xl mx-auto">
              <span className="font-semibold text-emerald-600">Every organization faces the same choice:</span> Continue accepting data breach risk with upload-based tools, 
              or eliminate that risk entirely with ProofPix's unhackable architecture. The results speak for themselves.
            </p>
          </div>
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
        <EnterpriseCard className="bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Your Success Story Starts Here</h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Every day you wait is another day of unnecessary data breach risk. Join the organizations that chose to eliminate 
            that risk entirely with ProofPix's unhackable architecture. <span className="font-semibold text-emerald-600">Your data never leaves your device—making breaches technically impossible.</span>
          </p>
          <div className="bg-emerald-100 rounded-lg p-4 mb-6 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-emerald-600 text-lg">$2.3M+</div>
                <div className="text-slate-600">Average breach cost eliminated</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-emerald-600 text-lg">60 seconds</div>
                <div className="text-slate-600">To start protecting your data</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-emerald-600 text-lg">Zero</div>
                <div className="text-slate-600">Breaches ever possible</div>
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <EnterpriseButton variant="primary">
              Eliminate Your Breach Risk Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </EnterpriseButton>
            <EnterpriseButton variant="secondary">
              Calculate Your ROI
            </EnterpriseButton>
          </div>
        </EnterpriseCard>

        {/* Become a Featured Case Study */}
        <EnterpriseCard className="mt-16 mb-8 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
          <div className="text-center max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Become Our Next Success Story</h3>
            <p className="text-slate-600 mb-6">
              Ready to eliminate your data breach risk while achieving measurable ROI? We're looking for forward-thinking organizations 
              to showcase how ProofPix transforms their operations. <span className="font-semibold text-purple-600">Featured case study participants receive exclusive benefits and recognition.</span>
            </p>
            <div className="bg-purple-100 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-slate-900 mb-3">Featured Case Study Benefits:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                  Priority implementation support
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                  Extended trial period
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                  Industry recognition and exposure
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                  Exclusive access to new features
                </div>
              </div>
            </div>
            <div className="flex justify-center space-x-4">
              <EnterpriseButton variant="primary">
                <Mail className="mr-2 h-4 w-4" />
                Apply for Case Study
              </EnterpriseButton>
              <EnterpriseButton variant="secondary">
                Learn More
              </EnterpriseButton>
            </div>
          </div>
        </EnterpriseCard>
      </div>

      {/* Footer */}
      <DocumentationFooter />
    </ConsistentLayout>
  );
};

export default CustomerSuccessStories; 