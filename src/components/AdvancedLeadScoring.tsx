import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Target, Brain, Star, AlertCircle, CheckCircle, Clock, DollarSign, Zap } from 'lucide-react';

interface LeadProfile {
  id: string;
  email: string;
  company: string;
  industry: 'legal' | 'insurance' | 'healthcare' | 'realestate' | 'other';
  companySize: 'startup' | 'smb' | 'enterprise';
  role: 'decision_maker' | 'influencer' | 'user' | 'researcher';
  source: 'organic' | 'paid' | 'referral' | 'direct' | 'social';
  createdAt: string;
  lastActivity: string;
}

interface BehavioralData {
  pageViews: number;
  timeOnSite: number;
  pagesVisited: string[];
  ctaClicks: number;
  formSubmissions: number;
  demoRequests: number;
  pricingPageViews: number;
  caseStudyViews: number;
  competitorPageViews: number;
  roiCalculatorUsage: number;
  emailOpens: number;
  emailClicks: number;
  socialEngagement: number;
}

interface ScoringFactors {
  demographic: number;
  behavioral: number;
  engagement: number;
  intent: number;
  fit: number;
}

interface LeadScore {
  total: number;
  factors: ScoringFactors;
  grade: 'A' | 'B' | 'C' | 'D';
  conversionProbability: number;
  recommendedAction: string;
  priority: 'hot' | 'warm' | 'cold';
  estimatedValue: number;
  timeToClose: number; // days
}

interface MLPrediction {
  conversionProbability: number;
  confidence: number;
  keyFactors: string[];
  similarLeads: {
    converted: number;
    total: number;
    averageValue: number;
    averageTimeToClose: number;
  };
}

const AdvancedLeadScoring: React.FC = () => {
  const [leads, setLeads] = useState<(LeadProfile & { behavioral: BehavioralData; score: LeadScore; prediction: MLPrediction })[]>([]);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score' | 'probability' | 'value' | 'recent'>('score');
  const [scoringModel, setScoringModel] = useState<'standard' | 'industry_specific' | 'ml_enhanced'>('ml_enhanced');

  // Sample lead data
  useEffect(() => {
    const sampleLeads = [
      {
        id: '1',
        email: 'sarah.chen@martinezlaw.com',
        company: 'Martinez & Associates',
        industry: 'legal' as const,
        companySize: 'smb' as const,
        role: 'decision_maker' as const,
        source: 'organic' as const,
        createdAt: '2024-03-15T10:30:00Z',
        lastActivity: '2024-03-20T14:22:00Z',
        behavioral: {
          pageViews: 47,
          timeOnSite: 1840, // seconds
          pagesVisited: ['/legal-landing', '/pricing', '/case-studies', '/roi-calculator', '/demo'],
          ctaClicks: 8,
          formSubmissions: 3,
          demoRequests: 1,
          pricingPageViews: 5,
          caseStudyViews: 3,
          competitorPageViews: 2,
          roiCalculatorUsage: 2,
          emailOpens: 12,
          emailClicks: 7,
          socialEngagement: 4
        },
        score: {
          total: 92,
          factors: { demographic: 85, behavioral: 95, engagement: 90, intent: 98, fit: 88 },
          grade: 'A' as const,
          conversionProbability: 0.87,
          recommendedAction: 'Schedule immediate demo call',
          priority: 'hot' as const,
          estimatedValue: 52000,
          timeToClose: 12
        },
        prediction: {
          conversionProbability: 0.87,
          confidence: 0.94,
          keyFactors: ['High demo engagement', 'Decision maker role', 'Multiple pricing views', 'ROI calculator usage'],
          similarLeads: { converted: 23, total: 27, averageValue: 48500, averageTimeToClose: 14 }
        }
      },
      {
        id: '2',
        email: 'michael.torres@regionalinsurance.com',
        company: 'Regional Insurance Group',
        industry: 'insurance' as const,
        companySize: 'enterprise' as const,
        role: 'influencer' as const,
        source: 'paid' as const,
        createdAt: '2024-03-18T09:15:00Z',
        lastActivity: '2024-03-20T11:45:00Z',
        behavioral: {
          pageViews: 23,
          timeOnSite: 920,
          pagesVisited: ['/insurance-landing', '/features', '/security', '/pricing'],
          ctaClicks: 4,
          formSubmissions: 1,
          demoRequests: 0,
          pricingPageViews: 3,
          caseStudyViews: 1,
          competitorPageViews: 1,
          roiCalculatorUsage: 1,
          emailOpens: 6,
          emailClicks: 3,
          socialEngagement: 2
        },
        score: {
          total: 76,
          factors: { demographic: 78, behavioral: 72, engagement: 68, intent: 75, fit: 85 },
          grade: 'B' as const,
          conversionProbability: 0.64,
          recommendedAction: 'Send targeted case study',
          priority: 'warm' as const,
          estimatedValue: 89000,
          timeToClose: 28
        },
        prediction: {
          conversionProbability: 0.64,
          confidence: 0.81,
          keyFactors: ['Enterprise size', 'Insurance industry fit', 'Security page focus', 'Pricing interest'],
          similarLeads: { converted: 15, total: 24, averageValue: 82000, averageTimeToClose: 32 }
        }
      },
      {
        id: '3',
        email: 'dr.patel@metrohealth.org',
        company: 'Metro Healthcare System',
        industry: 'healthcare' as const,
        companySize: 'enterprise' as const,
        role: 'user' as const,
        source: 'referral' as const,
        createdAt: '2024-03-19T16:20:00Z',
        lastActivity: '2024-03-20T09:30:00Z',
        behavioral: {
          pageViews: 15,
          timeOnSite: 680,
          pagesVisited: ['/healthcare-landing', '/privacy', '/compliance'],
          ctaClicks: 2,
          formSubmissions: 1,
          demoRequests: 0,
          pricingPageViews: 1,
          caseStudyViews: 2,
          competitorPageViews: 0,
          roiCalculatorUsage: 0,
          emailOpens: 3,
          emailClicks: 1,
          socialEngagement: 1
        },
        score: {
          total: 58,
          factors: { demographic: 65, behavioral: 45, engagement: 52, intent: 48, fit: 78 },
          grade: 'C' as const,
          conversionProbability: 0.34,
          recommendedAction: 'Nurture with HIPAA content',
          priority: 'warm' as const,
          estimatedValue: 125000,
          timeToClose: 45
        },
        prediction: {
          conversionProbability: 0.34,
          confidence: 0.72,
          keyFactors: ['Healthcare compliance focus', 'Early stage research', 'Referral source', 'Privacy concerns'],
          similarLeads: { converted: 8, total: 19, averageValue: 118000, averageTimeToClose: 52 }
        }
      },
      {
        id: '4',
        email: 'jennifer.kim@luxuryproperties.com',
        company: 'Luxury Properties Inc',
        industry: 'realestate' as const,
        companySize: 'smb' as const,
        role: 'decision_maker' as const,
        source: 'social' as const,
        createdAt: '2024-03-20T08:45:00Z',
        lastActivity: '2024-03-20T15:10:00Z',
        behavioral: {
          pageViews: 31,
          timeOnSite: 1240,
          pagesVisited: ['/realestate-landing', '/features', '/pricing', '/case-studies', '/roi-calculator'],
          ctaClicks: 6,
          formSubmissions: 2,
          demoRequests: 1,
          pricingPageViews: 4,
          caseStudyViews: 2,
          competitorPageViews: 1,
          roiCalculatorUsage: 2,
          emailOpens: 8,
          emailClicks: 5,
          socialEngagement: 6
        },
        score: {
          total: 84,
          factors: { demographic: 80, behavioral: 88, engagement: 85, intent: 90, fit: 77 },
          grade: 'A' as const,
          conversionProbability: 0.79,
          recommendedAction: 'Follow up on demo request',
          priority: 'hot' as const,
          estimatedValue: 28000,
          timeToClose: 18
        },
        prediction: {
          conversionProbability: 0.79,
          confidence: 0.88,
          keyFactors: ['Recent demo request', 'High engagement', 'ROI calculator usage', 'Social media source'],
          similarLeads: { converted: 18, total: 22, averageValue: 26500, averageTimeToClose: 21 }
        }
      }
    ];
    
    setLeads(sampleLeads);
  }, []);

  const calculateScore = (lead: LeadProfile, behavioral: BehavioralData): LeadScore => {
    // Industry-specific scoring weights
    const industryWeights = {
      legal: { demographic: 0.2, behavioral: 0.3, engagement: 0.2, intent: 0.2, fit: 0.1 },
      insurance: { demographic: 0.25, behavioral: 0.25, engagement: 0.2, intent: 0.2, fit: 0.1 },
      healthcare: { demographic: 0.15, behavioral: 0.2, engagement: 0.25, intent: 0.25, fit: 0.15 },
      realestate: { demographic: 0.2, behavioral: 0.35, engagement: 0.2, intent: 0.15, fit: 0.1 },
      other: { demographic: 0.2, behavioral: 0.25, engagement: 0.25, intent: 0.2, fit: 0.1 }
    };

    const weights = industryWeights[lead.industry];
    
    // Calculate individual factor scores
    const demographic = calculateDemographicScore(lead);
    const behavioralScore = calculateBehavioralScore(behavioral);
    const engagement = calculateEngagementScore(behavioral);
    const intent = calculateIntentScore(behavioral);
    const fit = calculateFitScore(lead);

    const factors = { demographic, behavioral: behavioralScore, engagement, intent, fit };
    
    const total = Math.round(
      demographic * weights.demographic +
      behavioralScore * weights.behavioral +
      engagement * weights.engagement +
      intent * weights.intent +
      fit * weights.fit
    );

    const grade = total >= 80 ? 'A' : total >= 65 ? 'B' : total >= 50 ? 'C' : 'D';
    const conversionProbability = Math.min(0.95, total / 100 * 0.9 + 0.1);
    const priority = total >= 75 ? 'hot' : total >= 55 ? 'warm' : 'cold';
    
    const estimatedValue = getEstimatedValue(lead.industry, lead.companySize);
    const timeToClose = getTimeToClose(lead.industry, lead.companySize, total);
    
    const recommendedAction = getRecommendedAction(total, behavioral, lead);

    return {
      total,
      factors,
      grade,
      conversionProbability,
      recommendedAction,
      priority,
      estimatedValue,
      timeToClose
    };
  };

  const calculateDemographicScore = (lead: LeadProfile): number => {
    let score = 50; // base score
    
    // Company size scoring
    if (lead.companySize === 'enterprise') score += 25;
    else if (lead.companySize === 'smb') score += 15;
    else score += 5;
    
    // Role scoring
    if (lead.role === 'decision_maker') score += 20;
    else if (lead.role === 'influencer') score += 15;
    else if (lead.role === 'user') score += 10;
    else score += 5;
    
    // Industry fit
    if (['legal', 'insurance', 'healthcare', 'realestate'].includes(lead.industry)) score += 5;
    
    return Math.min(100, score);
  };

  const calculateBehavioralScore = (behavioral: BehavioralData): number => {
    let score = 0;
    
    // Page views (0-30 points)
    score += Math.min(30, behavioral.pageViews * 0.8);
    
    // Time on site (0-25 points)
    score += Math.min(25, behavioral.timeOnSite / 60); // minutes
    
    // Form submissions (0-25 points)
    score += behavioral.formSubmissions * 8;
    
    // CTA clicks (0-20 points)
    score += Math.min(20, behavioral.ctaClicks * 2.5);
    
    return Math.min(100, score);
  };

  const calculateEngagementScore = (behavioral: BehavioralData): number => {
    let score = 0;
    
    // Email engagement (0-30 points)
    score += Math.min(20, behavioral.emailOpens * 1.5);
    score += Math.min(10, behavioral.emailClicks * 2);
    
    // Social engagement (0-20 points)
    score += Math.min(20, behavioral.socialEngagement * 4);
    
    // Case study views (0-25 points)
    score += Math.min(25, behavioral.caseStudyViews * 8);
    
    // Demo requests (0-25 points)
    score += behavioral.demoRequests * 25;
    
    return Math.min(100, score);
  };

  const calculateIntentScore = (behavioral: BehavioralData): number => {
    let score = 0;
    
    // Pricing page views (0-35 points)
    score += Math.min(35, behavioral.pricingPageViews * 7);
    
    // ROI calculator usage (0-30 points)
    score += behavioral.roiCalculatorUsage * 15;
    
    // Demo requests (0-35 points)
    score += behavioral.demoRequests * 35;
    
    return Math.min(100, score);
  };

  const calculateFitScore = (lead: LeadProfile): number => {
    let score = 60; // base score
    
    // Industry fit
    const industryFit = {
      legal: 90,
      insurance: 85,
      healthcare: 95,
      realestate: 80,
      other: 40
    };
    
    return industryFit[lead.industry];
  };

  const getEstimatedValue = (industry: string, companySize: string): number => {
    const baseValues = {
      legal: { startup: 15000, smb: 35000, enterprise: 75000 },
      insurance: { startup: 25000, smb: 60000, enterprise: 150000 },
      healthcare: { startup: 35000, smb: 85000, enterprise: 200000 },
      realestate: { startup: 8000, smb: 25000, enterprise: 60000 },
      other: { startup: 5000, smb: 15000, enterprise: 40000 }
    };
    
    return baseValues[industry as keyof typeof baseValues]?.[companySize as keyof typeof baseValues.legal] || 10000;
  };

  const getTimeToClose = (industry: string, companySize: string, score: number): number => {
    const baseDays = {
      legal: { startup: 21, smb: 35, enterprise: 60 },
      insurance: { startup: 28, smb: 45, enterprise: 90 },
      healthcare: { startup: 35, smb: 60, enterprise: 120 },
      realestate: { startup: 14, smb: 28, enterprise: 45 },
      other: { startup: 30, smb: 45, enterprise: 75 }
    };
    
    const base = baseDays[industry as keyof typeof baseDays]?.[companySize as keyof typeof baseDays.legal] || 30;
    const scoreMultiplier = score >= 80 ? 0.7 : score >= 65 ? 0.85 : score >= 50 ? 1.0 : 1.3;
    
    return Math.round(base * scoreMultiplier);
  };

  const getRecommendedAction = (score: number, behavioral: BehavioralData, lead: LeadProfile): string => {
    if (behavioral.demoRequests > 0) return 'Schedule immediate demo call';
    if (score >= 80) return 'Personal outreach within 24 hours';
    if (score >= 65) return 'Send targeted case study';
    if (behavioral.pricingPageViews >= 3) return 'Offer pricing consultation';
    if (behavioral.roiCalculatorUsage > 0) return 'Follow up on ROI results';
    return 'Continue nurturing with relevant content';
  };

  const filteredLeads = leads.filter(lead => 
    filterGrade === 'all' || lead.score.grade === filterGrade
  );

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    switch (sortBy) {
      case 'score': return b.score.total - a.score.total;
      case 'probability': return b.score.conversionProbability - a.score.conversionProbability;
      case 'value': return b.score.estimatedValue - a.score.estimatedValue;
      case 'recent': return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
      default: return 0;
    }
  });

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800 border-green-200';
      case 'B': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'C': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'D': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'hot': return 'text-red-600';
      case 'warm': return 'text-orange-600';
      case 'cold': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const selectedLeadData = selectedLead ? leads.find(l => l.id === selectedLead) : null;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Advanced Lead Scoring</h1>
            <p className="text-slate-600">ML-powered lead qualification and conversion prediction</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={scoringModel}
              onChange={(e) => setScoringModel(e.target.value as any)}
              className="border border-slate-300 rounded-lg px-4 py-2 text-sm"
            >
              <option value="standard">Standard Model</option>
              <option value="industry_specific">Industry-Specific</option>
              <option value="ml_enhanced">ML-Enhanced</option>
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Leads</p>
                <p className="text-2xl font-bold text-slate-900">{leads.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Hot Leads</p>
                <p className="text-2xl font-bold text-red-600">
                  {leads.filter(l => l.score.priority === 'hot').length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Avg. Score</p>
                <p className="text-2xl font-bold text-slate-900">
                  {Math.round(leads.reduce((sum, l) => sum + l.score.total, 0) / leads.length)}
                </p>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Pipeline Value</p>
                <p className="text-2xl font-bold text-slate-900">
                  ${(leads.reduce((sum, l) => sum + l.score.estimatedValue, 0) / 1000).toFixed(0)}K
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="text-sm text-slate-600 mr-2">Filter by Grade:</label>
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Grades</option>
                <option value="A">Grade A</option>
                <option value="B">Grade B</option>
                <option value="C">Grade C</option>
                <option value="D">Grade D</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm text-slate-600 mr-2">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="score">Lead Score</option>
                <option value="probability">Conversion Probability</option>
                <option value="value">Estimated Value</option>
                <option value="recent">Recent Activity</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Leads List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-slate-900">Lead Pipeline</h2>
            </div>
            <div className="divide-y">
              {sortedLeads.map((lead) => (
                <div
                  key={lead.id}
                  className={`p-6 cursor-pointer hover:bg-slate-50 transition-colors ${
                    selectedLead === lead.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => setSelectedLead(lead.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getGradeColor(lead.score.grade)}`}>
                        Grade {lead.score.grade}
                      </div>
                      <div className={`flex items-center text-sm font-medium ${getPriorityColor(lead.score.priority)}`}>
                        <Zap className="w-4 h-4 mr-1" />
                        {lead.score.priority.toUpperCase()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-900">{lead.score.total}</div>
                      <div className="text-sm text-slate-500">Score</div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h3 className="font-semibold text-slate-900">{lead.company}</h3>
                    <p className="text-sm text-slate-600">{lead.email}</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Industry:</span>
                      <span className="ml-1 font-medium capitalize">{lead.industry}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Probability:</span>
                      <span className="ml-1 font-medium">{(lead.score.conversionProbability * 100).toFixed(0)}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Value:</span>
                      <span className="ml-1 font-medium">${(lead.score.estimatedValue / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-sm text-slate-600">
                    <strong>Action:</strong> {lead.score.recommendedAction}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lead Details */}
        <div className="space-y-6">
          {selectedLeadData ? (
            <>
              {/* Lead Overview */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Lead Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-slate-900">{selectedLeadData.company}</h4>
                    <p className="text-sm text-slate-600">{selectedLeadData.email}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Industry:</span>
                      <span className="ml-1 font-medium capitalize">{selectedLeadData.industry}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Size:</span>
                      <span className="ml-1 font-medium capitalize">{selectedLeadData.companySize}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Role:</span>
                      <span className="ml-1 font-medium">{selectedLeadData.role.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Source:</span>
                      <span className="ml-1 font-medium capitalize">{selectedLeadData.source}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Score Breakdown</h3>
                
                <div className="space-y-4">
                  {Object.entries(selectedLeadData.score.factors).map(([factor, score]) => (
                    <div key={factor}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize text-slate-600">{factor.replace('_', ' ')}</span>
                        <span className="font-medium">{score}/100</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900">Total Score</span>
                    <span className="text-2xl font-bold text-blue-600">{selectedLeadData.score.total}</span>
                  </div>
                </div>
              </div>

              {/* ML Prediction */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center mb-4">
                  <Brain className="w-5 h-5 text-purple-600 mr-2" />
                  <h3 className="text-lg font-semibold text-slate-900">ML Prediction</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 mb-1">
                      {(selectedLeadData.prediction.conversionProbability * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm text-purple-700">Conversion Probability</div>
                    <div className="text-xs text-purple-600 mt-1">
                      {(selectedLeadData.prediction.confidence * 100).toFixed(0)}% confidence
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Key Factors</h4>
                    <ul className="space-y-1">
                      {selectedLeadData.prediction.keyFactors.map((factor, index) => (
                        <li key={index} className="flex items-start text-sm text-slate-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-medium text-slate-900 mb-2">Similar Leads</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Converted:</span>
                        <span className="ml-1 font-medium">
                          {selectedLeadData.prediction.similarLeads.converted}/{selectedLeadData.prediction.similarLeads.total}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Avg Value:</span>
                        <span className="ml-1 font-medium">
                          ${(selectedLeadData.prediction.similarLeads.averageValue / 1000).toFixed(0)}K
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended Actions */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Recommended Actions</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start p-3 bg-blue-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-900">Primary Action</div>
                      <div className="text-sm text-blue-700">{selectedLeadData.score.recommendedAction}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-3 bg-green-50 rounded-lg">
                    <Clock className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                    <div>
                      <div className="font-medium text-green-900">Timeline</div>
                      <div className="text-sm text-green-700">
                        Expected close: {selectedLeadData.score.timeToClose} days
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-3 bg-purple-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-purple-600 mr-3 mt-0.5" />
                    <div>
                      <div className="font-medium text-purple-900">Estimated Value</div>
                      <div className="text-sm text-purple-700">
                        ${selectedLeadData.score.estimatedValue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Select a Lead</h3>
              <p className="text-slate-600">Choose a lead from the list to view detailed scoring and recommendations</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedLeadScoring; 