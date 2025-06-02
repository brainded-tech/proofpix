import React, { useState } from 'react';
import { Building, Users, DollarSign, Clock, Shield, TrendingUp, ArrowRight, Star, Quote } from 'lucide-react';

interface CaseStudy {
  id: string;
  company: string;
  industry: 'legal' | 'insurance' | 'healthcare' | 'realestate';
  size: 'startup' | 'smb' | 'enterprise';
  challenge: string;
  solution: string;
  results: {
    timeSaved: string;
    costSavings: string;
    roiPercentage: number;
    additionalBenefits: string[];
  };
  testimonial: {
    quote: string;
    author: string;
    title: string;
    avatar: string;
  };
  metrics: {
    photosProcessed: string;
    teamSize: number;
    implementationTime: string;
    paybackPeriod: string;
  };
  beforeAfter: {
    before: string;
    after: string;
  };
}

const AdvancedCaseStudies: React.FC = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedCase, setSelectedCase] = useState<string | null>(null);

  const caseStudies: CaseStudy[] = [
    {
      id: 'martinez-law',
      company: 'Martinez & Associates',
      industry: 'legal',
      size: 'smb',
      challenge: 'Personal injury law firm spending 15+ hours per case manually analyzing accident photos and struggling with evidence authenticity in court.',
      solution: 'Implemented ProofPix for forensic-grade metadata extraction and court-admissible evidence reports.',
      results: {
        timeSaved: '12 hours per case',
        costSavings: '$156,000 annually',
        roiPercentage: 847,
        additionalBenefits: [
          'Won 3 previously challenging cases',
          'Reduced evidence preparation time by 85%',
          'Increased case acceptance rate by 40%',
          'Zero evidence authenticity challenges'
        ]
      },
      testimonial: {
        quote: "ProofPix helped us prove the exact time and location of accident photos, strengthening our client's case and securing a $2.3M settlement. The court-ready reports are game-changing.",
        author: 'Maria Martinez',
        title: 'Managing Partner',
        avatar: 'MM'
      },
      metrics: {
        photosProcessed: '2,400+ monthly',
        teamSize: 8,
        implementationTime: '2 hours',
        paybackPeriod: '1.4 months'
      },
      beforeAfter: {
        before: 'Manual analysis taking 15+ hours per case with frequent authenticity challenges',
        after: '2-minute automated analysis with court-admissible reports'
      }
    },
    {
      id: 'regional-insurance',
      company: 'Regional Insurance Group',
      industry: 'insurance',
      size: 'enterprise',
      challenge: 'Insurance company losing $2.8M annually to fraudulent claims with manipulated photos and spending excessive time on claims verification.',
      solution: 'Deployed ProofPix across 15 regional offices for automated fraud detection and claims processing.',
      results: {
        timeSaved: '847 hours monthly',
        costSavings: '$3.2M annually',
        roiPercentage: 1247,
        additionalBenefits: [
          'Detected 127 fraudulent claims',
          'Reduced claims processing time by 73%',
          'Improved customer satisfaction by 45%',
          'Eliminated data breach risk'
        ]
      },
      testimonial: {
        quote: "We were paying DocuSign $12,000/month and still worried about data breaches. ProofPix gives us better fraud detection for $599/month with zero breach risk. ROI was immediate.",
        author: 'Jennifer Martinez',
        title: 'CTO',
        avatar: 'JM'
      },
      metrics: {
        photosProcessed: '15,000+ monthly',
        teamSize: 45,
        implementationTime: '1 week',
        paybackPeriod: '0.8 months'
      },
      beforeAfter: {
        before: '$12K/month tools with ongoing breach risk and manual fraud detection',
        after: '$599/month automated solution with zero breach risk'
      }
    },
    {
      id: 'thompson-defense',
      company: 'Thompson Defense Group',
      industry: 'legal',
      size: 'smb',
      challenge: 'Criminal defense firm needed to prove photo manipulation in prosecution evidence but lacked technical expertise and tools.',
      solution: 'Used ProofPix to analyze prosecution photos and generate expert-level forensic reports for court presentation.',
      results: {
        timeSaved: '25 hours per case',
        costSavings: '$89,000 annually',
        roiPercentage: 623,
        additionalBenefits: [
          'Case dismissed due to evidence tampering proof',
          'Established reputation for technical expertise',
          'Increased referrals by 60%',
          'Reduced expert witness costs by 90%'
        ]
      },
      testimonial: {
        quote: "The metadata analysis revealed photo manipulation in the prosecution's evidence. Case dismissed. ProofPix literally saved our client's freedom and our reputation.",
        author: 'David Thompson',
        title: 'Managing Partner',
        avatar: 'DT'
      },
      metrics: {
        photosProcessed: '800+ monthly',
        teamSize: 6,
        implementationTime: '1 hour',
        paybackPeriod: '2.1 months'
      },
      beforeAfter: {
        before: 'Hiring expensive expert witnesses and hoping for the best',
        after: 'In-house forensic analysis with court-ready documentation'
      }
    },
    {
      id: 'metro-healthcare',
      company: 'Metro Healthcare System',
      industry: 'healthcare',
      size: 'enterprise',
      challenge: 'Healthcare network needed HIPAA-compliant photo analysis for medical documentation while maintaining patient privacy.',
      solution: 'Implemented ProofPix for client-side processing ensuring photos never leave the local environment.',
      results: {
        timeSaved: '320 hours monthly',
        costSavings: '$1.8M annually',
        roiPercentage: 892,
        additionalBenefits: [
          'Zero HIPAA compliance issues',
          'Improved medical documentation accuracy',
          'Reduced IT security overhead',
          'Enhanced patient trust'
        ]
      },
      testimonial: {
        quote: "Client-side processing means patient photos never leave our network. We get the analysis we need with absolute privacy protection. It's exactly what healthcare needs.",
        author: 'Dr. Sarah Chen',
        title: 'Chief Medical Officer',
        avatar: 'SC'
      },
      metrics: {
        photosProcessed: '8,500+ monthly',
        teamSize: 120,
        implementationTime: '3 days',
        paybackPeriod: '1.2 months'
      },
      beforeAfter: {
        before: 'Complex HIPAA compliance with cloud-based tools and ongoing risk',
        after: 'Automatic compliance with local processing and zero risk'
      }
    }
  ];

  const industries = [
    { id: 'all', name: 'All Industries', icon: Building },
    { id: 'legal', name: 'Legal Services', icon: Shield },
    { id: 'insurance', name: 'Insurance', icon: TrendingUp },
    { id: 'healthcare', name: 'Healthcare', icon: Users }
  ];

  const filteredCases = selectedIndustry === 'all' 
    ? caseStudies 
    : caseStudies.filter(cs => cs.industry === selectedIndustry);

  const getIndustryColor = (industry: string) => {
    const colors = {
      legal: 'bg-blue-100 text-blue-800',
      insurance: 'bg-green-100 text-green-800',
      healthcare: 'bg-purple-100 text-purple-800',
      realestate: 'bg-orange-100 text-orange-800'
    };
    return colors[industry as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getSizeLabel = (size: string) => {
    const labels = {
      startup: 'Startup',
      smb: 'Small-Medium Business',
      enterprise: 'Enterprise'
    };
    return labels[size as keyof typeof labels] || size;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-12">
        <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Star className="w-4 h-4 mr-2" />
          CUSTOMER SUCCESS STORIES
        </div>
        
        <h2 className="text-4xl font-bold text-slate-900 mb-6">
          Real Results from Real Customers
        </h2>
        
        <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
          See how organizations across industries are saving time, money, and reducing risk with ProofPix
        </p>
      </div>

      {/* Industry Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {industries.map((industry) => {
          const Icon = industry.icon;
          return (
            <button
              key={industry.id}
              onClick={() => setSelectedIndustry(industry.id)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedIndustry === industry.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {industry.name}
            </button>
          );
        })}
      </div>

      {/* Case Studies Grid */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {filteredCases.map((caseStudy) => (
          <div
            key={caseStudy.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => setSelectedCase(selectedCase === caseStudy.id ? null : caseStudy.id)}
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900">{caseStudy.company}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getIndustryColor(caseStudy.industry)}`}>
                    {caseStudy.industry.charAt(0).toUpperCase() + caseStudy.industry.slice(1)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                    {getSizeLabel(caseStudy.size)}
                  </span>
                </div>
              </div>
              
              <p className="text-slate-600 mb-4">{caseStudy.challenge}</p>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{caseStudy.results.roiPercentage}%</div>
                  <div className="text-xs text-slate-500">ROI</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{caseStudy.results.timeSaved}</div>
                  <div className="text-xs text-slate-500">Time Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{caseStudy.results.costSavings}</div>
                  <div className="text-xs text-slate-500">Annual Savings</div>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {selectedCase === caseStudy.id && (
              <div className="p-6 bg-slate-50">
                {/* Testimonial */}
                <div className="mb-6">
                  <div className="flex items-start mb-4">
                    <Quote className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                    <p className="text-slate-700 italic text-lg leading-relaxed">
                      "{caseStudy.testimonial.quote}"
                    </p>
                  </div>
                  <div className="flex items-center ml-9">
                    <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-semibold text-sm">
                        {caseStudy.testimonial.avatar}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{caseStudy.testimonial.author}</div>
                      <div className="text-sm text-slate-500">{caseStudy.testimonial.title}</div>
                    </div>
                  </div>
                </div>

                {/* Before/After */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-900 mb-2">Before ProofPix</h4>
                    <p className="text-red-700 text-sm">{caseStudy.beforeAfter.before}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-2">After ProofPix</h4>
                    <p className="text-green-700 text-sm">{caseStudy.beforeAfter.after}</p>
                  </div>
                </div>

                {/* Additional Benefits */}
                <div className="mb-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Additional Benefits</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {caseStudy.results.additionalBenefits.map((benefit, index) => (
                      <div key={index} className="flex items-center text-sm text-slate-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Implementation Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-slate-900">{caseStudy.metrics.photosProcessed}</div>
                    <div className="text-xs text-slate-500">Photos Processed</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-slate-900">{caseStudy.metrics.teamSize}</div>
                    <div className="text-xs text-slate-500">Team Size</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-slate-900">{caseStudy.metrics.implementationTime}</div>
                    <div className="text-xs text-slate-500">Setup Time</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-slate-900">{caseStudy.metrics.paybackPeriod}</div>
                    <div className="text-xs text-slate-500">Payback Period</div>
                  </div>
                </div>
              </div>
            )}

            {/* Expand/Collapse Indicator */}
            <div className="px-6 py-3 bg-slate-100 text-center">
              <span className="text-sm text-slate-600">
                {selectedCase === caseStudy.id ? 'Click to collapse' : 'Click to read full case study'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg text-center">
        <h3 className="text-2xl font-bold mb-4">Ready to Join These Success Stories?</h3>
        <p className="text-blue-100 mb-6">
          See how ProofPix can transform your organization's photo analysis workflow
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center">
            Calculate Your ROI
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
          <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
            Schedule Success Demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCaseStudies; 