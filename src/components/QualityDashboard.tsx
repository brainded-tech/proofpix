import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  FileText, 
  Target, 
  Filter, 
  Download, 
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Calendar,
  Award,
  Zap,
  Shield,
  Building2,
  BookOpen,
  Star,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { 
  ContentValidationResult, 
  ContentTemplate, 
  contentValidator,
  PROOFPIX_TEMPLATES 
} from '../utils/contentValidation';

interface QualityDashboardProps {
  className?: string;
  embedded?: boolean;
}

interface ContentItem {
  id: string;
  title: string;
  template: ContentTemplate;
  author: string;
  lastModified: Date;
  status: 'draft' | 'review' | 'published' | 'archived';
  validationResult: ContentValidationResult | null;
  wordCount: number;
  readingTime: number;
  views: number;
  category: string;
}

interface QualityMetrics {
  averageQualityScore: number;
  totalDocuments: number;
  documentsNeedingReview: number;
  highQualityDocuments: number;
  qualityTrend: 'up' | 'down' | 'stable';
  categoryBreakdown: Record<string, number>;
  authorPerformance: Record<string, number>;
  templateUsage: Record<string, number>;
}

// Mock data for demonstration
const MOCK_CONTENT_ITEMS: ContentItem[] = [
  {
    id: '1',
    title: 'EXIF Data Privacy Guide',
    template: PROOFPIX_TEMPLATES[0],
    author: 'Sarah Chen',
    lastModified: new Date('2024-01-25'),
    status: 'published',
    validationResult: {
      isValid: true,
      qualityScore: 94,
      errors: [],
      warnings: [],
      suggestions: [],
      metrics: {
        wordCount: 1250,
        sentenceCount: 85,
        paragraphCount: 12,
        averageWordsPerSentence: 14.7,
        averageSentencesPerParagraph: 7.1,
        complexWords: 18,
        readingTime: 6,
        keywordDensity: { 'exif': 2.4, 'privacy': 1.8, 'metadata': 3.1 },
        headingStructure: {
          structure: [],
          hasH1: true,
          properHierarchy: true,
          missingLevels: [],
          duplicateH1s: 1
        },
        linkAnalysis: {
          totalLinks: 8,
          internalLinks: 6,
          externalLinks: 2,
          brokenLinks: [],
          descriptiveLinks: 7,
          genericLinks: 1
        }
      },
      readabilityScore: {
        fleschKincaid: 11.2,
        fleschReadingEase: 65.4,
        gunningFog: 12.8,
        smog: 11.9,
        automatedReadabilityIndex: 12.1,
        colemanLiau: 11.7,
        grade: 'High School',
        difficulty: 'standard'
      },
      seoScore: {
        score: 88,
        titleOptimization: 85,
        metaDescription: 90,
        headingStructure: 95,
        keywordOptimization: 82,
        internalLinks: 88,
        imageOptimization: 100,
        contentLength: 95
      },
      accessibilityScore: {
        score: 92,
        headingHierarchy: 95,
        altTextCoverage: 100,
        linkDescriptiveness: 88,
        colorContrast: 100,
        languageClarity: 85,
        structuralMarkup: 90
      }
    },
    wordCount: 1250,
    readingTime: 6,
    views: 2847,
    category: 'technical'
  },
  {
    id: '2',
    title: 'Enterprise Implementation Guide',
    template: PROOFPIX_TEMPLATES[2],
    author: 'Michael Rodriguez',
    lastModified: new Date('2024-01-24'),
    status: 'review',
    validationResult: {
      isValid: false,
      qualityScore: 76,
      errors: [
        {
          type: 'structure',
          severity: 'high',
          message: 'Missing required keyword "enterprise"',
          ruleId: 'required-keyword'
        }
      ],
      warnings: [
        {
          type: 'length',
          message: 'Content is shorter than recommended',
          impact: 'medium'
        }
      ],
      suggestions: [
        {
          type: 'improvement',
          message: 'Consider adding more technical details',
          priority: 'medium',
          category: 'readability',
          actionable: true
        }
      ],
      metrics: {
        wordCount: 980,
        sentenceCount: 62,
        paragraphCount: 8,
        averageWordsPerSentence: 15.8,
        averageSentencesPerParagraph: 7.8,
        complexWords: 24,
        readingTime: 5,
        keywordDensity: { 'compliance': 1.9, 'security': 2.1, 'scalability': 1.2 },
        headingStructure: {
          structure: [],
          hasH1: true,
          properHierarchy: true,
          missingLevels: [],
          duplicateH1s: 1
        },
        linkAnalysis: {
          totalLinks: 5,
          internalLinks: 3,
          externalLinks: 2,
          brokenLinks: [],
          descriptiveLinks: 4,
          genericLinks: 1
        }
      },
      readabilityScore: {
        fleschKincaid: 13.4,
        fleschReadingEase: 58.2,
        gunningFog: 14.1,
        smog: 13.8,
        automatedReadabilityIndex: 13.9,
        colemanLiau: 13.2,
        grade: 'College',
        difficulty: 'fairly-difficult'
      },
      seoScore: {
        score: 72,
        titleOptimization: 78,
        metaDescription: 65,
        headingStructure: 80,
        keywordOptimization: 68,
        internalLinks: 70,
        imageOptimization: 85,
        contentLength: 60
      },
      accessibilityScore: {
        score: 85,
        headingHierarchy: 90,
        altTextCoverage: 80,
        linkDescriptiveness: 80,
        colorContrast: 100,
        languageClarity: 75,
        structuralMarkup: 85
      }
    },
    wordCount: 980,
    readingTime: 5,
    views: 1234,
    category: 'business'
  },
  {
    id: '3',
    title: 'Getting Started with ProofPix',
    template: PROOFPIX_TEMPLATES[1],
    author: 'Emma Thompson',
    lastModified: new Date('2024-01-23'),
    status: 'published',
    validationResult: {
      isValid: true,
      qualityScore: 89,
      errors: [],
      warnings: [],
      suggestions: [
        {
          type: 'enhancement',
          message: 'Consider adding video tutorials',
          priority: 'low',
          category: 'engagement',
          actionable: true
        }
      ],
      metrics: {
        wordCount: 750,
        sentenceCount: 58,
        paragraphCount: 15,
        averageWordsPerSentence: 12.9,
        averageSentencesPerParagraph: 3.9,
        complexWords: 8,
        readingTime: 4,
        keywordDensity: { 'proofpix': 3.2, 'upload': 2.1, 'metadata': 2.8 },
        headingStructure: {
          structure: [],
          hasH1: true,
          properHierarchy: true,
          missingLevels: [],
          duplicateH1s: 1
        },
        linkAnalysis: {
          totalLinks: 6,
          internalLinks: 5,
          externalLinks: 1,
          brokenLinks: [],
          descriptiveLinks: 6,
          genericLinks: 0
        }
      },
      readabilityScore: {
        fleschKincaid: 8.4,
        fleschReadingEase: 72.8,
        gunningFog: 9.2,
        smog: 8.9,
        automatedReadabilityIndex: 8.7,
        colemanLiau: 8.1,
        grade: 'Middle School',
        difficulty: 'fairly-easy'
      },
      seoScore: {
        score: 91,
        titleOptimization: 95,
        metaDescription: 88,
        headingStructure: 92,
        keywordOptimization: 90,
        internalLinks: 95,
        imageOptimization: 90,
        contentLength: 85
      },
      accessibilityScore: {
        score: 96,
        headingHierarchy: 100,
        altTextCoverage: 95,
        linkDescriptiveness: 100,
        colorContrast: 100,
        languageClarity: 90,
        structuralMarkup: 95
      }
    },
    wordCount: 750,
    readingTime: 4,
    views: 5621,
    category: 'support'
  }
];

const STATUS_CONFIG = {
  draft: { color: 'gray', label: 'Draft', icon: Edit },
  review: { color: 'yellow', label: 'In Review', icon: Eye },
  published: { color: 'green', label: 'Published', icon: CheckCircle },
  archived: { color: 'red', label: 'Archived', icon: Trash2 }
};

const CATEGORY_CONFIG = {
  technical: { icon: Zap, color: 'blue', label: 'Technical' },
  business: { icon: Building2, color: 'purple', label: 'Business' },
  legal: { icon: Shield, color: 'red', label: 'Legal' },
  marketing: { icon: Target, color: 'green', label: 'Marketing' },
  support: { icon: Users, color: 'orange', label: 'Support' }
};

export const QualityDashboard: React.FC<QualityDashboardProps> = ({
  className = '',
  embedded = false
}) => {
  const [contentItems, setContentItems] = useState<ContentItem[]>(MOCK_CONTENT_ITEMS);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterAuthor, setFilterAuthor] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'quality' | 'modified' | 'views' | 'title'>('quality');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Calculate quality metrics
  const qualityMetrics = useMemo((): QualityMetrics => {
    const validItems = contentItems.filter(item => item.validationResult);
    const totalQuality = validItems.reduce((sum, item) => sum + (item.validationResult?.qualityScore || 0), 0);
    const averageQualityScore = validItems.length > 0 ? totalQuality / validItems.length : 0;
    
    const documentsNeedingReview = contentItems.filter(item => 
      item.status === 'review' || 
      (item.validationResult && item.validationResult.qualityScore < 80)
    ).length;
    
    const highQualityDocuments = contentItems.filter(item => 
      item.validationResult && item.validationResult.qualityScore >= 90
    ).length;

    // Category breakdown
    const categoryBreakdown: Record<string, number> = {};
    contentItems.forEach(item => {
      const category = item.category;
      const score = item.validationResult?.qualityScore || 0;
      if (!categoryBreakdown[category]) {
        categoryBreakdown[category] = 0;
      }
      categoryBreakdown[category] += score;
    });

    // Average scores by category
    Object.keys(categoryBreakdown).forEach(category => {
      const categoryItems = contentItems.filter(item => item.category === category);
      categoryBreakdown[category] = categoryBreakdown[category] / categoryItems.length;
    });

    // Author performance
    const authorPerformance: Record<string, number> = {};
    contentItems.forEach(item => {
      const author = item.author;
      const score = item.validationResult?.qualityScore || 0;
      if (!authorPerformance[author]) {
        authorPerformance[author] = 0;
      }
      authorPerformance[author] += score;
    });

    // Average scores by author
    Object.keys(authorPerformance).forEach(author => {
      const authorItems = contentItems.filter(item => item.author === author);
      authorPerformance[author] = authorPerformance[author] / authorItems.length;
    });

    // Template usage
    const templateUsage: Record<string, number> = {};
    contentItems.forEach(item => {
      const templateName = item.template.name;
      templateUsage[templateName] = (templateUsage[templateName] || 0) + 1;
    });

    return {
      averageQualityScore: Math.round(averageQualityScore),
      totalDocuments: contentItems.length,
      documentsNeedingReview,
      highQualityDocuments,
      qualityTrend: 'up', // Mock trend
      categoryBreakdown,
      authorPerformance,
      templateUsage
    };
  }, [contentItems]);

  // Filter and sort content items
  const filteredAndSortedItems = useMemo(() => {
    let filtered = contentItems.filter(item => {
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
      const matchesAuthor = filterAuthor === 'all' || item.author === filterAuthor;
      const matchesSearch = !searchTerm || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesCategory && matchesAuthor && matchesSearch;
    });

    // Sort items
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'quality':
          aValue = a.validationResult?.qualityScore || 0;
          bValue = b.validationResult?.qualityScore || 0;
          break;
        case 'modified':
          aValue = a.lastModified.getTime();
          bValue = b.lastModified.getTime();
          break;
        case 'views':
          aValue = a.views;
          bValue = b.views;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [contentItems, filterStatus, filterCategory, filterAuthor, searchTerm, sortBy, sortOrder]);

  const getQualityScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 60) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getQualityScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-100 dark:bg-green-900/30';
    if (score >= 80) return 'bg-blue-100 dark:bg-blue-900/30';
    if (score >= 70) return 'bg-yellow-100 dark:bg-yellow-900/30';
    if (score >= 60) return 'bg-orange-100 dark:bg-orange-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };

  const getUniqueAuthors = () => {
    return Array.from(new Set(contentItems.map(item => item.author))).sort();
  };

  const containerClasses = embedded 
    ? 'bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700'
    : 'min-h-screen bg-slate-50 dark:bg-slate-900';

  return (
    <div className={`${containerClasses} ${className}`}>
      {!embedded && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <BarChart3 className="w-10 h-10" />
                  <h1 className="text-4xl font-bold">Quality Dashboard</h1>
                </div>
                <p className="text-xl text-blue-100">
                  Monitor and manage content quality across all ProofPix documentation
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Export Report</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quality Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Average Quality Score
                </p>
                <p className={`text-3xl font-bold ${getQualityScoreColor(qualityMetrics.averageQualityScore)}`}>
                  {qualityMetrics.averageQualityScore}%
                </p>
              </div>
              <div className={`p-3 rounded-full ${getQualityScoreBg(qualityMetrics.averageQualityScore)}`}>
                <Award className={`w-6 h-6 ${getQualityScoreColor(qualityMetrics.averageQualityScore)}`} />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              {qualityMetrics.qualityTrend === 'up' ? (
                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
              ) : qualityMetrics.qualityTrend === 'down' ? (
                <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
              ) : (
                <Minus className="w-4 h-4 text-slate-500 mr-1" />
              )}
              <span className={qualityMetrics.qualityTrend === 'up' ? 'text-green-600' : 
                             qualityMetrics.qualityTrend === 'down' ? 'text-red-600' : 'text-slate-600'}>
                {qualityMetrics.qualityTrend === 'up' ? '+2.3%' : 
                 qualityMetrics.qualityTrend === 'down' ? '-1.2%' : '0%'} from last month
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Documents
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {qualityMetrics.totalDocuments}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm text-slate-600 dark:text-slate-400">
              <span>{qualityMetrics.highQualityDocuments} high quality documents</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Need Review
                </p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {qualityMetrics.documentsNeedingReview}
                </p>
              </div>
              <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30">
                <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm text-slate-600 dark:text-slate-400">
              <span>Requires immediate attention</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  High Quality
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {qualityMetrics.highQualityDocuments}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                <Star className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm text-slate-600 dark:text-slate-400">
              <span>90%+ quality score</span>
            </div>
          </motion.div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Category Performance */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Quality by Category
            </h3>
            <div className="space-y-4">
              {Object.entries(qualityMetrics.categoryBreakdown).map(([category, score]) => {
                const categoryConfig = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
                const CategoryIcon = categoryConfig?.icon || FileText;
                
                return (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-${categoryConfig?.color || 'gray'}-100 dark:bg-${categoryConfig?.color || 'gray'}-900/30`}>
                        <CategoryIcon className={`w-4 h-4 text-${categoryConfig?.color || 'gray'}-600 dark:text-${categoryConfig?.color || 'gray'}-400`} />
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                        {categoryConfig?.label || category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-${categoryConfig?.color || 'gray'}-500`}
                          style={{ width: `${Math.min(100, score)}%` }}
                        />
                      </div>
                      <span className={`text-sm font-medium ${getQualityScoreColor(score)}`}>
                        {Math.round(score)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Author Performance */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Author Performance
            </h3>
            <div className="space-y-4">
              {Object.entries(qualityMetrics.authorPerformance)
                .sort(([,a], [,b]) => b - a)
                .map(([author, score]) => (
                <div key={author} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {author}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${score >= 90 ? 'bg-green-500' : score >= 80 ? 'bg-blue-500' : score >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(100, score)}%` }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${getQualityScoreColor(score)}`}>
                      {Math.round(score)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="all">All Status</option>
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="all">All Categories</option>
              {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>

            <select
              value={filterAuthor}
              onChange={(e) => setFilterAuthor(e.target.value)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="all">All Authors</option>
              {getUniqueAuthors().map(author => (
                <option key={author} value={author}>{author}</option>
              ))}
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy as any);
                setSortOrder(newSortOrder as any);
              }}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="quality-desc">Quality (High to Low)</option>
              <option value="quality-asc">Quality (Low to High)</option>
              <option value="modified-desc">Recently Modified</option>
              <option value="modified-asc">Oldest Modified</option>
              <option value="views-desc">Most Views</option>
              <option value="views-asc">Least Views</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
            </select>
          </div>

          <div className="text-sm text-slate-500 dark:text-slate-400">
            {filteredAndSortedItems.length} of {contentItems.length} documents
          </div>
        </div>

        {/* Content Items Table */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Quality Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Modified
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Metrics
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {filteredAndSortedItems.map((item) => {
                  const statusConfig = STATUS_CONFIG[item.status];
                  const categoryConfig = CATEGORY_CONFIG[item.category as keyof typeof CATEGORY_CONFIG];
                  const StatusIcon = statusConfig.icon;
                  const CategoryIcon = categoryConfig?.icon || FileText;

                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg bg-${categoryConfig?.color || 'gray'}-100 dark:bg-${categoryConfig?.color || 'gray'}-900/30 mr-3`}>
                            <CategoryIcon className={`w-4 h-4 text-${categoryConfig?.color || 'gray'}-600 dark:text-${categoryConfig?.color || 'gray'}-400`} />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {item.title}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                              {item.template.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.validationResult ? (
                          <div className="flex items-center space-x-2">
                            <div className={`px-2 py-1 text-xs rounded-full ${getQualityScoreBg(item.validationResult.qualityScore)}`}>
                              <span className={getQualityScoreColor(item.validationResult.qualityScore)}>
                                {item.validationResult.qualityScore}%
                              </span>
                            </div>
                            {item.validationResult.errors.length > 0 && (
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">Not validated</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <StatusIcon className={`w-4 h-4 text-${statusConfig.color}-500`} />
                          <span className={`text-sm text-${statusConfig.color}-700 dark:text-${statusConfig.color}-300`}>
                            {statusConfig.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {item.author.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm text-slate-900 dark:text-slate-100">
                            {item.author}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {item.lastModified.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                          <div>{item.wordCount} words • {item.readingTime} min read</div>
                          <div>{item.views.toLocaleString()} views</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredAndSortedItems.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                No documents found
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Try adjusting your search or filters to find documents.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QualityDashboard; 