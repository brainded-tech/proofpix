import React, { useState, useEffect } from 'react';
import { Brain, Users, Target, Zap, TrendingUp, Eye, Clock, DollarSign } from 'lucide-react';

interface VisitorProfile {
  id: string;
  industry?: 'legal' | 'insurance' | 'healthcare' | 'realestate' | 'general';
  companySize?: 'startup' | 'smb' | 'enterprise';
  intent?: 'awareness' | 'consideration' | 'decision';
  source?: 'organic' | 'paid' | 'direct' | 'referral' | 'social';
  behavior: {
    pageViews: number;
    timeOnSite: number;
    pagesVisited: string[];
    ctaClicks: number;
    formSubmissions: number;
    pricingPageViews: number;
  };
  demographics?: {
    location?: string;
    deviceType?: 'desktop' | 'mobile' | 'tablet';
    browserType?: string;
  };
  preferences?: {
    contentType?: 'technical' | 'business' | 'emotional';
    communicationStyle?: 'formal' | 'casual' | 'urgent';
  };
}

interface PersonalizationRule {
  id: string;
  name: string;
  condition: {
    field: keyof VisitorProfile | string;
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
    value: any;
  }[];
  action: {
    element: 'headline' | 'cta' | 'case_study' | 'pricing' | 'social_proof' | 'hero_image';
    content: any;
    priority: number;
  };
  active: boolean;
  performance: {
    impressions: number;
    conversions: number;
    conversionRate: number;
  };
}

interface PersonalizedContent {
  headlines: { [key: string]: string };
  ctas: { [key: string]: { text: string; color: string; urgency: string } };
  caseStudies: { [key: string]: any };
  pricing: { [key: string]: any };
  socialProof: { [key: string]: string };
}

const PersonalizationEngine: React.FC = () => {
  const [visitorProfile, setVisitorProfile] = useState<VisitorProfile>({
    id: 'visitor-123',
    industry: 'legal',
    companySize: 'smb',
    intent: 'consideration',
    source: 'organic',
    behavior: {
      pageViews: 7,
      timeOnSite: 420, // seconds
      pagesVisited: ['/legal', '/pricing', '/case-studies'],
      ctaClicks: 2,
      formSubmissions: 0,
      pricingPageViews: 2
    },
    demographics: {
      location: 'San Francisco, CA',
      deviceType: 'desktop',
      browserType: 'Chrome'
    },
    preferences: {
      contentType: 'business',
      communicationStyle: 'formal'
    }
  });

  const [personalizationRules, setPersonalizationRules] = useState<PersonalizationRule[]>([
    {
      id: 'legal-high-intent',
      name: 'Legal High Intent Visitors',
      condition: [
        { field: 'industry', operator: 'equals', value: 'legal' },
        { field: 'behavior.pricingPageViews', operator: 'greater_than', value: 1 }
      ],
      action: {
        element: 'headline',
        content: 'Court-Admissible Evidence Analysis in 5 Minutes',
        priority: 10
      },
      active: true,
      performance: {
        impressions: 1247,
        conversions: 198,
        conversionRate: 15.9
      }
    },
    {
      id: 'insurance-enterprise',
      name: 'Enterprise Insurance Companies',
      condition: [
        { field: 'industry', operator: 'equals', value: 'insurance' },
        { field: 'companySize', operator: 'equals', value: 'enterprise' }
      ],
      action: {
        element: 'cta',
        content: { text: 'Schedule Enterprise Demo', color: 'green', urgency: 'high' },
        priority: 9
      },
      active: true,
      performance: {
        impressions: 847,
        conversions: 156,
        conversionRate: 18.4
      }
    },
    {
      id: 'healthcare-privacy-focused',
      name: 'Healthcare Privacy-Focused',
      condition: [
        { field: 'industry', operator: 'equals', value: 'healthcare' },
        { field: 'behavior.timeOnSite', operator: 'greater_than', value: 300 }
      ],
      action: {
        element: 'social_proof',
        content: 'Zero breaches in 3+ years—HIPAA compliance guaranteed',
        priority: 8
      },
      active: true,
      performance: {
        impressions: 623,
        conversions: 112,
        conversionRate: 18.0
      }
    },
    {
      id: 'realestate-commission-focused',
      name: 'Real Estate Commission-Focused',
      condition: [
        { field: 'industry', operator: 'equals', value: 'realestate' },
        { field: 'preferences.contentType', operator: 'equals', value: 'business' }
      ],
      action: {
        element: 'headline',
        content: 'Increase Commissions 23% with Property Verification',
        priority: 7
      },
      active: true,
      performance: {
        impressions: 934,
        conversions: 167,
        conversionRate: 17.9
      }
    }
  ]);

  const [personalizedContent, setPersonalizedContent] = useState<PersonalizedContent>({
    headlines: {},
    ctas: {},
    caseStudies: {},
    pricing: {},
    socialProof: {}
  });

  // Personalization logic
  useEffect(() => {
    const generatePersonalizedContent = () => {
      const content: PersonalizedContent = {
        headlines: {},
        ctas: {},
        caseStudies: {},
        pricing: {},
        socialProof: {}
      };

      // Apply personalization rules based on visitor profile
      const applicableRules = personalizationRules
        .filter(rule => rule.active)
        .filter(rule => {
          return rule.condition.every(condition => {
            const fieldValue = getNestedValue(visitorProfile, condition.field);
            switch (condition.operator) {
              case 'equals':
                return fieldValue === condition.value;
              case 'contains':
                return String(fieldValue).includes(condition.value);
              case 'greater_than':
                return Number(fieldValue) > condition.value;
              case 'less_than':
                return Number(fieldValue) < condition.value;
              default:
                return false;
            }
          });
        })
        .sort((a, b) => b.action.priority - a.action.priority);

      // Apply rules to content
      applicableRules.forEach(rule => {
        if (rule.action.element === 'headline') {
          content.headlines[rule.id] = rule.action.content;
        } else if (rule.action.element === 'cta') {
          content.ctas[rule.id] = rule.action.content;
        } else if (rule.action.element === 'social_proof') {
          content.socialProof[rule.id] = rule.action.content;
        }
      });

      // Industry-specific defaults
      if (visitorProfile.industry) {
        const industryDefaults = getIndustryDefaults(visitorProfile.industry);
        Object.assign(content, industryDefaults);
      }

      // Intent-based customization
      if (visitorProfile.intent) {
        const intentCustomization = getIntentCustomization(visitorProfile.intent);
        Object.assign(content, intentCustomization);
      }

      setPersonalizedContent(content);
    };

    generatePersonalizedContent();
  }, [visitorProfile, personalizationRules]);

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const getIndustryDefaults = (industry: string) => {
    const defaults: { [key: string]: any } = {
      legal: {
        headlines: { default: 'Turn Every Photo Into Bulletproof Legal Evidence' },
        ctas: { default: { text: 'Analyze Evidence Now—Free', color: 'blue', urgency: 'medium' } },
        socialProof: { default: '847 Law Firms Trust ProofPix' }
      },
      insurance: {
        headlines: { default: 'Stop Fraud Before It Costs You Millions' },
        ctas: { default: { text: 'Detect Fraud Now—Free Trial', color: 'green', urgency: 'high' } },
        socialProof: { default: '312 Insurance Companies Trust ProofPix' }
      },
      healthcare: {
        headlines: { default: 'Patient Privacy Protection That Actually Works' },
        ctas: { default: { text: 'Protect Patient Privacy—Try Free', color: 'purple', urgency: 'medium' } },
        socialProof: { default: '89 Healthcare Systems Trust ProofPix' }
      },
      realestate: {
        headlines: { default: 'Close Deals Faster with Verified Property Photos' },
        ctas: { default: { text: 'Verify Properties Now—Free Trial', color: 'orange', urgency: 'medium' } },
        socialProof: { default: '1,247 Real Estate Professionals Trust ProofPix' }
      }
    };
    return defaults[industry] || defaults.legal;
  };

  const getIntentCustomization = (intent: string) => {
    const customizations: { [key: string]: any } = {
      awareness: {
        ctas: { intent: { text: 'Learn More', color: 'gray', urgency: 'low' } }
      },
      consideration: {
        ctas: { intent: { text: 'See Demo', color: 'blue', urgency: 'medium' } }
      },
      decision: {
        ctas: { intent: { text: 'Start Free Trial', color: 'green', urgency: 'high' } }
      }
    };
    return customizations[intent] || {};
  };

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'awareness': return 'bg-blue-100 text-blue-800';
      case 'consideration': return 'bg-yellow-100 text-yellow-800';
      case 'decision': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCompanySizeIcon = (size: string) => {
    switch (size) {
      case 'startup': return <Zap className="w-4 h-4" />;
      case 'smb': return <Users className="w-4 h-4" />;
      case 'enterprise': return <Target className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Brain className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold text-slate-900">Personalization Engine</h1>
        </div>
        <p className="text-lg text-slate-600">
          Dynamic content optimization based on visitor behavior and industry
        </p>
      </div>

      {/* Visitor Profile */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Current Visitor Profile</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Industry:</span>
              <span className="font-medium capitalize">{visitorProfile.industry}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Company Size:</span>
              <div className="flex items-center">
                {getCompanySizeIcon(visitorProfile.companySize || '')}
                <span className="font-medium capitalize ml-2">{visitorProfile.companySize}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Intent Level:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getIntentColor(visitorProfile.intent || '')}`}>
                {visitorProfile.intent}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Page Views:</span>
              <span className="font-medium">{visitorProfile.behavior.pageViews}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Time on Site:</span>
              <span className="font-medium">{Math.floor(visitorProfile.behavior.timeOnSite / 60)}m {visitorProfile.behavior.timeOnSite % 60}s</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Pricing Views:</span>
              <span className="font-medium">{visitorProfile.behavior.pricingPageViews}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Personalized Content</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-slate-700 mb-2">Active Headline</h3>
              <div className="p-3 bg-blue-50 rounded-lg text-sm">
                {Object.values(personalizedContent.headlines)[0] || 'Default headline'}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-slate-700 mb-2">Active CTA</h3>
              <div className="p-3 bg-green-50 rounded-lg text-sm">
                {Object.values(personalizedContent.ctas)[0]?.text || 'Default CTA'}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-slate-700 mb-2">Social Proof</h3>
              <div className="p-3 bg-purple-50 rounded-lg text-sm">
                {Object.values(personalizedContent.socialProof)[0] || 'Default social proof'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personalization Rules */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Active Personalization Rules</h2>
        
        <div className="space-y-4">
          {personalizationRules.filter(rule => rule.active).map((rule) => (
            <div key={rule.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{rule.name}</h3>
                  <p className="text-slate-600">Priority: {rule.action.priority}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{rule.performance.conversionRate}%</div>
                  <div className="text-sm text-slate-500">Conversion Rate</div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-slate-700 mb-2">Conditions</h4>
                  <div className="space-y-1">
                    {rule.condition.map((condition, index) => (
                      <div key={index} className="text-sm text-slate-600 p-2 bg-slate-50 rounded">
                        {condition.field} {condition.operator} {String(condition.value)}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-700 mb-2">Action</h4>
                  <div className="text-sm text-slate-600 p-2 bg-blue-50 rounded">
                    {rule.action.element}: {typeof rule.action.content === 'string' ? rule.action.content : JSON.stringify(rule.action.content)}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-700 mb-2">Performance</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Impressions:</span>
                      <span>{rule.performance.impressions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversions:</span>
                      <span>{rule.performance.conversions}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-600">Personalization Lift</h3>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">+24.7%</div>
          <div className="text-sm text-green-600">vs non-personalized</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-600">Active Rules</h3>
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{personalizationRules.filter(r => r.active).length}</div>
          <div className="text-sm text-blue-600">Currently running</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-600">Avg Engagement</h3>
            <Eye className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">7.2min</div>
          <div className="text-sm text-purple-600">Time on site</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-600">Revenue Impact</h3>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">$1.2M</div>
          <div className="text-sm text-green-600">Additional ARR</div>
        </div>
      </div>

      {/* Industry Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Personalization Performance by Industry</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {['legal', 'insurance', 'healthcare', 'realestate'].map((industry) => (
            <div key={industry} className="text-center">
              <h3 className="font-medium text-slate-700 mb-3 capitalize">{industry}</h3>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-blue-600">
                  {industry === 'legal' ? '18.4%' : industry === 'insurance' ? '22.1%' : industry === 'healthcare' ? '19.7%' : '16.8%'}
                </div>
                <div className="text-sm text-slate-500">Conversion Rate</div>
                <div className="text-sm text-green-600">
                  +{industry === 'legal' ? '3.2%' : industry === 'insurance' ? '4.8%' : industry === 'healthcare' ? '3.9%' : '2.7%'} lift
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalizationEngine; 