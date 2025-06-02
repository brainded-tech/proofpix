import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Users, DollarSign, Target, Eye, MousePointer, Download, Calendar, Filter, BarChart3, PieChart, LineChart } from 'lucide-react';

interface FunnelStage {
  id: string;
  name: string;
  visitors: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  averageValue: number;
  dropoffRate: number;
  timeSpent: number; // seconds
  topSources: { source: string; percentage: number }[];
  topPages: { page: string; conversions: number }[];
}

interface IndustryMetrics {
  industry: 'legal' | 'insurance' | 'healthcare' | 'realestate' | 'overall';
  stages: FunnelStage[];
  totalRevenue: number;
  totalConversions: number;
  averageDealSize: number;
  salesCycle: number; // days
  customerLifetimeValue: number;
}

interface PredictiveInsight {
  metric: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  timeframe: string;
  impact: 'positive' | 'negative' | 'neutral';
  recommendation: string;
}

interface OptimizationOpportunity {
  stage: string;
  issue: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  potentialLift: number; // percentage
  recommendation: string;
  estimatedRevenue: number;
}

const ConversionFunnelAnalytics: React.FC = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<'legal' | 'insurance' | 'healthcare' | 'realestate' | 'overall'>('overall');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [viewMode, setViewMode] = useState<'funnel' | 'trends' | 'attribution' | 'predictions'>('funnel');
  const [industryMetrics, setIndustryMetrics] = useState<IndustryMetrics[]>([]);
  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsight[]>([]);
  const [optimizationOpportunities, setOptimizationOpportunities] = useState<OptimizationOpportunity[]>([]);

  useEffect(() => {
    // Sample data for different industries
    const sampleMetrics: IndustryMetrics[] = [
      {
        industry: 'overall',
        totalRevenue: 2847000,
        totalConversions: 127,
        averageDealSize: 22400,
        salesCycle: 28,
        customerLifetimeValue: 67200,
        stages: [
          {
            id: 'awareness',
            name: 'Website Visitors',
            visitors: 45280,
            conversions: 45280,
            conversionRate: 100,
            revenue: 0,
            averageValue: 0,
            dropoffRate: 0,
            timeSpent: 145,
            topSources: [
              { source: 'Organic Search', percentage: 42 },
              { source: 'Paid Ads', percentage: 28 },
              { source: 'Direct', percentage: 18 },
              { source: 'Referral', percentage: 12 }
            ],
            topPages: [
              { page: '/homepage', conversions: 18500 },
              { page: '/legal-landing', conversions: 12800 },
              { page: '/insurance-landing', conversions: 8900 },
              { page: '/healthcare-landing', conversions: 5080 }
            ]
          },
          {
            id: 'interest',
            name: 'Page Engagement',
            visitors: 45280,
            conversions: 18650,
            conversionRate: 41.2,
            revenue: 0,
            averageValue: 0,
            dropoffRate: 58.8,
            timeSpent: 320,
            topSources: [
              { source: 'Organic Search', percentage: 45 },
              { source: 'Paid Ads', percentage: 32 },
              { source: 'Direct', percentage: 15 },
              { source: 'Referral', percentage: 8 }
            ],
            topPages: [
              { page: '/features', conversions: 7200 },
              { page: '/pricing', conversions: 5800 },
              { page: '/case-studies', conversions: 3650 },
              { page: '/roi-calculator', conversions: 2000 }
            ]
          },
          {
            id: 'consideration',
            name: 'Lead Generation',
            visitors: 18650,
            conversions: 3420,
            conversionRate: 18.3,
            revenue: 0,
            averageValue: 0,
            dropoffRate: 81.7,
            timeSpent: 480,
            topSources: [
              { source: 'Organic Search', percentage: 38 },
              { source: 'Paid Ads', percentage: 35 },
              { source: 'Direct', percentage: 17 },
              { source: 'Referral', percentage: 10 }
            ],
            topPages: [
              { page: '/demo-request', conversions: 1580 },
              { page: '/contact', conversions: 980 },
              { page: '/trial-signup', conversions: 860 }
            ]
          },
          {
            id: 'intent',
            name: 'Demo Requests',
            visitors: 3420,
            conversions: 890,
            conversionRate: 26.0,
            revenue: 0,
            averageValue: 0,
            dropoffRate: 74.0,
            timeSpent: 1200,
            topSources: [
              { source: 'Organic Search', percentage: 35 },
              { source: 'Paid Ads', percentage: 40 },
              { source: 'Direct', percentage: 15 },
              { source: 'Referral', percentage: 10 }
            ],
            topPages: [
              { page: '/schedule-demo', conversions: 890 }
            ]
          },
          {
            id: 'evaluation',
            name: 'Demo Completed',
            visitors: 890,
            conversions: 445,
            conversionRate: 50.0,
            revenue: 0,
            averageValue: 0,
            dropoffRate: 50.0,
            timeSpent: 2400,
            topSources: [
              { source: 'Organic Search', percentage: 32 },
              { source: 'Paid Ads', percentage: 43 },
              { source: 'Direct', percentage: 15 },
              { source: 'Referral', percentage: 10 }
            ],
            topPages: [
              { page: '/demo-platform', conversions: 445 }
            ]
          },
          {
            id: 'purchase',
            name: 'Customers',
            visitors: 445,
            conversions: 127,
            conversionRate: 28.5,
            revenue: 2847000,
            averageValue: 22400,
            dropoffRate: 71.5,
            timeSpent: 0,
            topSources: [
              { source: 'Organic Search', percentage: 30 },
              { source: 'Paid Ads', percentage: 45 },
              { source: 'Direct', percentage: 15 },
              { source: 'Referral', percentage: 10 }
            ],
            topPages: [
              { page: '/checkout', conversions: 127 }
            ]
          }
        ]
      },
      {
        industry: 'legal',
        totalRevenue: 1240000,
        totalConversions: 42,
        averageDealSize: 29500,
        salesCycle: 35,
        customerLifetimeValue: 88500,
        stages: [
          {
            id: 'awareness',
            name: 'Website Visitors',
            visitors: 15800,
            conversions: 15800,
            conversionRate: 100,
            revenue: 0,
            averageValue: 0,
            dropoffRate: 0,
            timeSpent: 165,
            topSources: [
              { source: 'Organic Search', percentage: 48 },
              { source: 'Referral', percentage: 25 },
              { source: 'Direct', percentage: 15 },
              { source: 'Paid Ads', percentage: 12 }
            ],
            topPages: [
              { page: '/legal-landing', conversions: 12800 },
              { page: '/homepage', conversions: 3000 }
            ]
          },
          {
            id: 'interest',
            name: 'Page Engagement',
            visitors: 15800,
            conversions: 7200,
            conversionRate: 45.6,
            revenue: 0,
            averageValue: 0,
            dropoffRate: 54.4,
            timeSpent: 380,
            topSources: [
              { source: 'Organic Search', percentage: 52 },
              { source: 'Referral', percentage: 28 },
              { source: 'Direct', percentage: 12 },
              { source: 'Paid Ads', percentage: 8 }
            ],
            topPages: [
              { page: '/legal-case-studies', conversions: 3200 },
              { page: '/evidence-analysis', conversions: 2400 },
              { page: '/pricing', conversions: 1600 }
            ]
          },
          {
            id: 'consideration',
            name: 'Lead Generation',
            visitors: 7200,
            conversions: 1580,
            conversionRate: 21.9,
            revenue: 0,
            averageValue: 0,
            dropoffRate: 78.1,
            timeSpent: 520,
            topSources: [
              { source: 'Organic Search', percentage: 45 },
              { source: 'Referral', percentage: 30 },
              { source: 'Paid Ads', percentage: 15 },
              { source: 'Direct', percentage: 10 }
            ],
            topPages: [
              { page: '/legal-demo-request', conversions: 980 },
              { page: '/contact-legal', conversions: 600 }
            ]
          },
          {
            id: 'intent',
            name: 'Demo Requests',
            visitors: 1580,
            conversions: 380,
            conversionRate: 24.1,
            revenue: 0,
            averageValue: 0,
            dropoffRate: 75.9,
            timeSpent: 1400,
            topSources: [
              { source: 'Organic Search', percentage: 42 },
              { source: 'Referral', percentage: 35 },
              { source: 'Paid Ads', percentage: 15 },
              { source: 'Direct', percentage: 8 }
            ],
            topPages: [
              { page: '/schedule-legal-demo', conversions: 380 }
            ]
          },
          {
            id: 'evaluation',
            name: 'Demo Completed',
            visitors: 380,
            conversions: 210,
            conversionRate: 55.3,
            revenue: 0,
            averageValue: 0,
            dropoffRate: 44.7,
            timeSpent: 2800,
            topSources: [
              { source: 'Organic Search', percentage: 40 },
              { source: 'Referral', percentage: 38 },
              { source: 'Paid Ads', percentage: 15 },
              { source: 'Direct', percentage: 7 }
            ],
            topPages: [
              { page: '/legal-demo-platform', conversions: 210 }
            ]
          },
          {
            id: 'purchase',
            name: 'Customers',
            visitors: 210,
            conversions: 42,
            conversionRate: 20.0,
            revenue: 1240000,
            averageValue: 29500,
            dropoffRate: 80.0,
            timeSpent: 0,
            topSources: [
              { source: 'Organic Search', percentage: 38 },
              { source: 'Referral', percentage: 40 },
              { source: 'Paid Ads', percentage: 15 },
              { source: 'Direct', percentage: 7 }
            ],
            topPages: [
              { page: '/legal-checkout', conversions: 42 }
            ]
          }
        ]
      }
    ];

    const sampleInsights: PredictiveInsight[] = [
      {
        metric: 'Overall Conversion Rate',
        currentValue: 0.28,
        predictedValue: 0.34,
        confidence: 0.87,
        timeframe: 'Next 30 days',
        impact: 'positive',
        recommendation: 'Implement A/B tested headlines across landing pages'
      },
      {
        metric: 'Demo Completion Rate',
        currentValue: 50.0,
        predictedValue: 58.5,
        confidence: 0.82,
        timeframe: 'Next 60 days',
        impact: 'positive',
        recommendation: 'Deploy interactive product demos for higher engagement'
      },
      {
        metric: 'Lead Generation Rate',
        currentValue: 18.3,
        predictedValue: 22.8,
        confidence: 0.79,
        timeframe: 'Next 45 days',
        impact: 'positive',
        recommendation: 'Optimize ROI calculator placement and messaging'
      },
      {
        metric: 'Average Deal Size',
        currentValue: 22400,
        predictedValue: 26800,
        confidence: 0.75,
        timeframe: 'Next 90 days',
        impact: 'positive',
        recommendation: 'Focus on enterprise lead qualification and pricing'
      }
    ];

    const sampleOpportunities: OptimizationOpportunity[] = [
      {
        stage: 'Page Engagement',
        issue: 'High bounce rate on pricing page (68%)',
        impact: 'high',
        effort: 'medium',
        potentialLift: 15.2,
        recommendation: 'Add ROI calculator and industry-specific pricing',
        estimatedRevenue: 432000
      },
      {
        stage: 'Lead Generation',
        issue: 'Low form completion rate (18.3%)',
        impact: 'high',
        effort: 'low',
        recommendation: 'Reduce form fields and add social proof',
        potentialLift: 12.8,
        estimatedRevenue: 364000
      },
      {
        stage: 'Demo Requests',
        issue: 'Demo no-show rate (26%)',
        impact: 'medium',
        effort: 'low',
        recommendation: 'Implement automated reminder sequence',
        potentialLift: 8.5,
        estimatedRevenue: 242000
      },
      {
        stage: 'Demo Completed',
        issue: 'Low demo-to-trial conversion (28.5%)',
        impact: 'high',
        effort: 'high',
        recommendation: 'Personalize demo experience by industry',
        potentialLift: 18.7,
        estimatedRevenue: 532000
      }
    ];

    setIndustryMetrics(sampleMetrics);
    setPredictiveInsights(sampleInsights);
    setOptimizationOpportunities(sampleOpportunities);
  }, []);

  const currentMetrics = industryMetrics.find(m => m.industry === selectedIndustry) || industryMetrics[0];

  const getStageColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-orange-500',
      'bg-purple-500',
      'bg-red-500'
    ];
    return colors[index % colors.length];
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (!currentMetrics) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Conversion Funnel Analytics</h1>
            <p className="text-slate-600">Revenue attribution and predictive insights</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value as any)}
              className="border border-slate-300 rounded-lg px-4 py-2 text-sm"
            >
              <option value="overall">All Industries</option>
              <option value="legal">Legal</option>
              <option value="insurance">Insurance</option>
              <option value="healthcare">Healthcare</option>
              <option value="realestate">Real Estate</option>
            </select>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="border border-slate-300 rounded-lg px-4 py-2 text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Revenue</p>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(currentMetrics.totalRevenue)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">+12.5% vs last period</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Conversions</p>
                <p className="text-2xl font-bold text-slate-900">{currentMetrics.totalConversions}</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">+8.3% vs last period</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Avg Deal Size</p>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(currentMetrics.averageDealSize)}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">+15.2% vs last period</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Sales Cycle</p>
                <p className="text-2xl font-bold text-slate-900">{currentMetrics.salesCycle}d</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">-5.2% vs last period</span>
            </div>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="bg-white rounded-lg shadow-sm border p-1 mb-8">
          <div className="flex space-x-1">
            {[
              { id: 'funnel', label: 'Funnel View', icon: Target },
              { id: 'trends', label: 'Trends', icon: LineChart },
              { id: 'attribution', label: 'Attribution', icon: PieChart },
              { id: 'predictions', label: 'Predictions', icon: TrendingUp }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setViewMode(id as any)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Funnel View */}
      {viewMode === 'funnel' && (
        <div className="space-y-8">
          {/* Funnel Visualization */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Conversion Funnel</h2>
            
            <div className="space-y-4">
              {currentMetrics.stages.map((stage, index) => {
                const width = (stage.conversions / currentMetrics.stages[0].conversions) * 100;
                return (
                  <div key={stage.id} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-slate-900">{stage.name}</h3>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-slate-600">{stage.conversions.toLocaleString()} visitors</span>
                        {index > 0 && (
                          <span className="text-slate-600">{formatPercentage(stage.conversionRate)} conversion</span>
                        )}
                        {stage.revenue > 0 && (
                          <span className="font-medium text-green-600">{formatCurrency(stage.revenue)}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="w-full bg-slate-200 rounded-lg h-12 flex items-center">
                        <div
                          className={`${getStageColor(index)} h-12 rounded-lg flex items-center justify-center text-white font-medium transition-all duration-500`}
                          style={{ width: `${width}%` }}
                        >
                          {width > 20 && (
                            <span>{stage.conversions.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                      
                      {index > 0 && stage.dropoffRate > 0 && (
                        <div className="absolute right-0 top-0 h-12 flex items-center">
                          <div className="bg-red-100 text-red-800 px-3 py-1 rounded-lg text-sm font-medium">
                            -{formatPercentage(stage.dropoffRate)} dropoff
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stage Details */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Traffic Sources</h3>
              <div className="space-y-3">
                {currentMetrics.stages[0].topSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-slate-600">{source.source}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${source.percentage}%` }}
                        ></div>
                      </div>
                      <span className="font-medium text-slate-900 w-8">{source.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Converting Pages</h3>
              <div className="space-y-3">
                {currentMetrics.stages[1].topPages.slice(0, 4).map((page, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-slate-600">{page.page}</span>
                    <span className="font-medium text-slate-900">{page.conversions.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Predictions View */}
      {viewMode === 'predictions' && (
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Predictive Insights</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {predictiveInsights.map((insight, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-slate-900">{insight.metric}</h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      insight.impact === 'positive' ? 'bg-green-100 text-green-800' :
                      insight.impact === 'negative' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {insight.impact}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Current:</span>
                      <span className="font-medium">
                        {insight.metric.includes('Rate') || insight.metric.includes('Conversion') 
                          ? formatPercentage(insight.currentValue)
                          : formatCurrency(insight.currentValue)
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Predicted:</span>
                      <span className="font-medium text-green-600">
                        {insight.metric.includes('Rate') || insight.metric.includes('Conversion')
                          ? formatPercentage(insight.predictedValue)
                          : formatCurrency(insight.predictedValue)
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Confidence:</span>
                      <span className="font-medium">{formatPercentage(insight.confidence * 100)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Timeframe:</span>
                      <span className="font-medium">{insight.timeframe}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">{insight.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optimization Opportunities */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Optimization Opportunities</h2>
            
            <div className="space-y-4">
              {optimizationOpportunities.map((opportunity, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-medium text-slate-900 mb-1">{opportunity.stage}</h3>
                      <p className="text-slate-600">{opportunity.issue}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(opportunity.impact)}`}>
                        {opportunity.impact} impact
                      </div>
                      <div className={`text-xs font-medium ${getEffortColor(opportunity.effort)}`}>
                        {opportunity.effort} effort
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">+{formatPercentage(opportunity.potentialLift)}</div>
                      <div className="text-sm text-slate-600">Potential Lift</div>
                    </div>
                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{formatCurrency(opportunity.estimatedRevenue)}</div>
                      <div className="text-sm text-slate-600">Est. Revenue</div>
                    </div>
                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">
                        {Math.round(opportunity.estimatedRevenue / opportunity.potentialLift * 100 / 1000)}K
                      </div>
                      <div className="text-sm text-slate-600">ROI Potential</div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Recommendation:</strong> {opportunity.recommendation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Attribution View */}
      {viewMode === 'attribution' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Revenue Attribution</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Revenue by Source</h3>
              <div className="space-y-3">
                {[
                  { source: 'Organic Search', revenue: 1280000, percentage: 45 },
                  { source: 'Paid Advertising', revenue: 854000, percentage: 30 },
                  { source: 'Direct Traffic', revenue: 427000, percentage: 15 },
                  { source: 'Referrals', revenue: 286000, percentage: 10 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium text-slate-900">{item.source}</div>
                      <div className="text-sm text-slate-600">{formatCurrency(item.revenue)}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-slate-900">{item.percentage}%</div>
                      <div className="w-16 bg-slate-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Customer Journey Analysis</h3>
              <div className="space-y-4">
                <div className="p-4 border border-slate-200 rounded-lg">
                  <div className="font-medium text-slate-900 mb-2">Average Touchpoints</div>
                  <div className="text-2xl font-bold text-blue-600">7.3</div>
                  <div className="text-sm text-slate-600">Before conversion</div>
                </div>
                
                <div className="p-4 border border-slate-200 rounded-lg">
                  <div className="font-medium text-slate-900 mb-2">Top Converting Path</div>
                  <div className="text-sm text-slate-600">
                    Organic Search → Landing Page → Pricing → Demo → Purchase
                  </div>
                  <div className="text-sm text-green-600 mt-1">32% of conversions</div>
                </div>
                
                <div className="p-4 border border-slate-200 rounded-lg">
                  <div className="font-medium text-slate-900 mb-2">Assisted Conversions</div>
                  <div className="text-2xl font-bold text-purple-600">68%</div>
                  <div className="text-sm text-slate-600">Multi-touch attribution</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trends View */}
      {viewMode === 'trends' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Conversion Trends</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Monthly Performance</h3>
              <div className="space-y-4">
                {[
                  { month: 'January', conversions: 89, revenue: 1980000, growth: 12.5 },
                  { month: 'February', conversions: 102, revenue: 2280000, growth: 15.2 },
                  { month: 'March', conversions: 127, revenue: 2847000, growth: 24.9 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium text-slate-900">{item.month}</div>
                      <div className="text-sm text-slate-600">{item.conversions} conversions</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-slate-900">{formatCurrency(item.revenue)}</div>
                      <div className="flex items-center text-sm text-green-600">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        +{item.growth}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Industry Benchmarks</h3>
              <div className="space-y-4">
                {[
                  { metric: 'Website Conversion Rate', proofpix: 0.28, industry: 0.18, better: true },
                  { metric: 'Demo Completion Rate', proofpix: 50.0, industry: 35.2, better: true },
                  { metric: 'Sales Cycle (days)', proofpix: 28, industry: 45, better: true },
                  { metric: 'Customer LTV', proofpix: 67200, industry: 42000, better: true }
                ].map((item, index) => (
                  <div key={index} className="p-4 border border-slate-200 rounded-lg">
                    <div className="font-medium text-slate-900 mb-2">{item.metric}</div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-slate-600">ProofPix</div>
                        <div className="font-medium text-blue-600">
                          {item.metric.includes('Rate') || item.metric.includes('Conversion')
                            ? formatPercentage(item.proofpix)
                            : item.metric.includes('LTV') || item.metric.includes('$')
                            ? formatCurrency(item.proofpix)
                            : item.proofpix
                          }
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Industry Avg</div>
                        <div className="font-medium text-slate-500">
                          {item.metric.includes('Rate') || item.metric.includes('Conversion')
                            ? formatPercentage(item.industry)
                            : item.metric.includes('LTV') || item.metric.includes('$')
                            ? formatCurrency(item.industry)
                            : item.industry
                          }
                        </div>
                      </div>
                      <div className={`text-sm font-medium ${item.better ? 'text-green-600' : 'text-red-600'}`}>
                        {item.better ? '↗' : '↘'} 
                        {item.metric.includes('days') 
                          ? Math.round(((item.industry - item.proofpix) / item.industry) * 100)
                          : Math.round(((item.proofpix - item.industry) / item.industry) * 100)
                        }%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversionFunnelAnalytics; 