import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Tag, 
  Star, 
  ExternalLink, 
  ChevronDown, 
  ChevronRight,
  X,
  Copy,
  Check,
  Lightbulb,
  Shield,
  Zap,
  Users,
  Building2,
  FileText,
  Camera,
  Lock,
  Globe,
  Smartphone,
  Monitor,
  Layers
} from 'lucide-react';

// Types for glossary system
interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: 'technical' | 'business' | 'security' | 'compliance' | 'ui' | 'metadata';
  difficulty: 'beginner' | 'intermediate' | 'expert';
  tags: string[];
  relatedTerms: string[];
  examples?: string[];
  links?: { title: string; url: string; type: 'internal' | 'external' }[];
  lastUpdated: Date;
  popularity: number;
  qualityScore: number;
}

interface FilterState {
  categories: string[];
  difficulties: string[];
  tags: string[];
  showFavorites: boolean;
}

interface MasterGlossaryProps {
  className?: string;
  embedded?: boolean;
  initialTerm?: string;
}

// Sample glossary data with ProofPix-specific terms
const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'exif',
    term: 'EXIF Data',
    definition: 'Exchangeable Image File Format data embedded in digital images containing metadata about camera settings, location, timestamp, and technical details.',
    category: 'metadata',
    difficulty: 'beginner',
    tags: ['metadata', 'photography', 'privacy', 'technical'],
    relatedTerms: ['metadata', 'gps-coordinates', 'camera-settings'],
    examples: [
      'Camera make and model (e.g., Canon EOS R5)',
      'GPS coordinates (latitude/longitude)',
      'Timestamp when photo was taken',
      'Camera settings (ISO, aperture, shutter speed)'
    ],
    links: [
      { title: 'Understanding EXIF Data', url: '/docs/metadata-guide', type: 'internal' },
      { title: 'EXIF Privacy Guide', url: '/docs/privacy-guide', type: 'internal' }
    ],
    lastUpdated: new Date('2024-01-15'),
    popularity: 95,
    qualityScore: 98
  },
  {
    id: 'client-side-processing',
    term: 'Client-Side Processing',
    definition: 'ProofPix\'s revolutionary approach where all image analysis happens locally in your browser, ensuring your images never leave your device.',
    category: 'technical',
    difficulty: 'intermediate',
    tags: ['privacy', 'security', 'architecture', 'webassembly'],
    relatedTerms: ['privacy-first', 'zero-upload', 'local-processing'],
    examples: [
      'Images processed using WebAssembly in browser',
      'No server uploads required',
      'Complete data privacy guarantee',
      'Works offline after initial load'
    ],
    links: [
      { title: 'Security Architecture', url: '/docs/security-architecture', type: 'internal' },
      { title: 'Privacy Best Practices', url: '/docs/privacy-guide', type: 'internal' }
    ],
    lastUpdated: new Date('2024-01-20'),
    popularity: 88,
    qualityScore: 96
  },
  {
    id: 'batch-processing',
    term: 'Batch Processing',
    definition: 'Professional feature allowing simultaneous analysis of multiple images with advanced filtering, sorting, and export capabilities.',
    category: 'business',
    difficulty: 'intermediate',
    tags: ['pro-feature', 'efficiency', 'workflow', 'enterprise'],
    relatedTerms: ['pro-subscription', 'bulk-export', 'workflow-automation'],
    examples: [
      'Process 100+ images simultaneously',
      'Advanced filtering and sorting options',
      'Bulk export to CSV, JSON, or PDF',
      'Custom report generation'
    ],
    links: [
      { title: 'Pro User Guide', url: '/docs/pro-user-guide', type: 'internal' },
      { title: 'Batch Processing Tutorial', url: '/docs/batch-tutorial', type: 'internal' }
    ],
    lastUpdated: new Date('2024-01-18'),
    popularity: 76,
    qualityScore: 94
  },
  {
    id: 'gdpr-compliance',
    term: 'GDPR Compliance',
    definition: 'General Data Protection Regulation compliance achieved through ProofPix\'s privacy-by-design architecture that eliminates data processing risks.',
    category: 'compliance',
    difficulty: 'expert',
    tags: ['compliance', 'privacy', 'legal', 'enterprise', 'eu'],
    relatedTerms: ['privacy-by-design', 'data-protection', 'compliance-framework'],
    examples: [
      'No personal data collection or storage',
      'Automatic compliance through architecture',
      'Data subject rights automatically satisfied',
      'No cross-border data transfer issues'
    ],
    links: [
      { title: 'Compliance Guide', url: '/docs/compliance-guide', type: 'internal' },
      { title: 'GDPR Assessment', url: '/docs/gdpr-assessment', type: 'internal' }
    ],
    lastUpdated: new Date('2024-01-22'),
    popularity: 82,
    qualityScore: 97
  },
  {
    id: 'white-label',
    term: 'White-Label Solution',
    definition: 'Enterprise feature allowing complete customization of ProofPix with your organization\'s branding, domain, and visual identity.',
    category: 'business',
    difficulty: 'expert',
    tags: ['enterprise', 'branding', 'customization', 'b2b'],
    relatedTerms: ['enterprise-features', 'custom-branding', 'domain-customization'],
    examples: [
      'Custom logo and color scheme',
      'Your domain (e.g., metadata.yourcompany.com)',
      'Branded PDF reports',
      'Custom user interface elements'
    ],
    links: [
      { title: 'Enterprise Solutions', url: '/docs/enterprise-guide', type: 'internal' },
      { title: 'Custom Branding Guide', url: '/docs/custom-branding', type: 'internal' }
    ],
    lastUpdated: new Date('2024-01-25'),
    popularity: 65,
    qualityScore: 95
  },
  {
    id: 'metadata-sanitization',
    term: 'Metadata Sanitization',
    definition: 'Process of removing or redacting sensitive metadata from images while preserving necessary technical information.',
    category: 'security',
    difficulty: 'intermediate',
    tags: ['privacy', 'security', 'data-protection', 'sanitization'],
    relatedTerms: ['privacy-protection', 'data-redaction', 'secure-export'],
    examples: [
      'Remove GPS coordinates from images',
      'Strip personal camera settings',
      'Redact timestamp information',
      'Preserve only essential technical data'
    ],
    links: [
      { title: 'Privacy Guide', url: '/docs/privacy-guide', type: 'internal' },
      { title: 'Metadata Security', url: '/docs/metadata-security', type: 'internal' }
    ],
    lastUpdated: new Date('2024-01-20'),
    popularity: 71,
    qualityScore: 93
  }
];

const CATEGORY_CONFIG = {
  technical: { icon: Zap, color: 'blue', label: 'Technical' },
  business: { icon: Building2, color: 'purple', label: 'Business' },
  security: { icon: Shield, color: 'red', label: 'Security' },
  compliance: { icon: FileText, color: 'green', label: 'Compliance' },
  ui: { icon: Monitor, color: 'orange', label: 'User Interface' },
  metadata: { icon: Camera, color: 'indigo', label: 'Metadata' }
};

const DIFFICULTY_CONFIG = {
  beginner: { color: 'green', label: 'Beginner' },
  intermediate: { color: 'yellow', label: 'Intermediate' },
  expert: { color: 'red', label: 'Expert' }
};

export const MasterGlossary: React.FC<MasterGlossaryProps> = ({
  className = '',
  embedded = false,
  initialTerm
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    difficulties: [],
    tags: [],
    showFavorites: false
  });
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [copiedTerm, setCopiedTerm] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'alphabetical' | 'popularity' | 'quality' | 'recent'>('alphabetical');

  // Initialize with initial term if provided
  useEffect(() => {
    if (initialTerm) {
      const term = GLOSSARY_TERMS.find(t => t.id === initialTerm || t.term.toLowerCase() === initialTerm.toLowerCase());
      if (term) {
        setSelectedTerm(term);
      }
    }
  }, [initialTerm]);

  // Filter and search logic
  const filteredTerms = useMemo(() => {
    let terms = GLOSSARY_TERMS;

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      terms = terms.filter(term => 
        term.term.toLowerCase().includes(search) ||
        term.definition.toLowerCase().includes(search) ||
        term.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      terms = terms.filter(term => filters.categories.includes(term.category));
    }

    // Apply difficulty filter
    if (filters.difficulties.length > 0) {
      terms = terms.filter(term => filters.difficulties.includes(term.difficulty));
    }

    // Apply tag filter
    if (filters.tags.length > 0) {
      terms = terms.filter(term => 
        filters.tags.some(tag => term.tags.includes(tag))
      );
    }

    // Apply favorites filter
    if (filters.showFavorites) {
      terms = terms.filter(term => favorites.has(term.id));
    }

    // Apply sorting
    switch (sortBy) {
      case 'popularity':
        terms.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'quality':
        terms.sort((a, b) => b.qualityScore - a.qualityScore);
        break;
      case 'recent':
        terms.sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());
        break;
      default:
        terms.sort((a, b) => a.term.localeCompare(b.term));
    }

    return terms;
  }, [searchTerm, filters, favorites, sortBy]);

  // Get all unique tags for filter options
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    GLOSSARY_TERMS.forEach(term => {
      term.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  const toggleFavorite = useCallback((termId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(termId)) {
        newFavorites.delete(termId);
      } else {
        newFavorites.add(termId);
      }
      return newFavorites;
    });
  }, []);

  const copyTermLink = useCallback(async (term: GlossaryTerm) => {
    const url = `${window.location.origin}/glossary#${term.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedTerm(term.id);
      setTimeout(() => setCopiedTerm(null), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      categories: [],
      difficulties: [],
      tags: [],
      showFavorites: false
    });
    setSearchTerm('');
  }, []);

  const getQualityScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-600 dark:text-green-400';
    if (score >= 90) return 'text-blue-600 dark:text-blue-400';
    if (score >= 85) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const containerClasses = embedded 
    ? 'bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700'
    : 'min-h-screen bg-slate-50 dark:bg-slate-900';

  return (
    <div className={`${containerClasses} ${className}`}>
      {!embedded && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <BookOpen className="w-12 h-12 mr-4" />
                <h1 className="text-4xl md:text-5xl font-bold">ProofPix Glossary</h1>
              </div>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Comprehensive guide to image metadata, privacy, and enterprise features. 
                Search, filter, and explore {GLOSSARY_TERMS.length} terms.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Controls */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search terms, definitions, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {showFilters ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="alphabetical">Alphabetical</option>
              <option value="popularity">Most Popular</option>
              <option value="quality">Highest Quality</option>
              <option value="recent">Recently Updated</option>
            </select>

            {(searchTerm || filters.categories.length > 0 || filters.difficulties.length > 0 || filters.tags.length > 0 || filters.showFavorites) && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-1 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Clear</span>
              </button>
            )}

            <div className="text-sm text-slate-500 dark:text-slate-400">
              {filteredTerms.length} of {GLOSSARY_TERMS.length} terms
            </div>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Categories */}
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Categories</h4>
                    <div className="space-y-2">
                      {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
                        const Icon = config.icon;
                        return (
                          <label key={key} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.categories.includes(key)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFilters(prev => ({ ...prev, categories: [...prev.categories, key] }));
                                } else {
                                  setFilters(prev => ({ ...prev, categories: prev.categories.filter(c => c !== key) }));
                                }
                              }}
                              className="rounded border-slate-300 dark:border-slate-600"
                            />
                            <Icon className={`w-4 h-4 text-${config.color}-500`} />
                            <span className="text-sm text-slate-700 dark:text-slate-300">{config.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Difficulty Levels */}
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Difficulty</h4>
                    <div className="space-y-2">
                      {Object.entries(DIFFICULTY_CONFIG).map(([key, config]) => (
                        <label key={key} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.difficulties.includes(key)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters(prev => ({ ...prev, difficulties: [...prev.difficulties, key] }));
                              } else {
                                setFilters(prev => ({ ...prev, difficulties: prev.difficulties.filter(d => d !== key) }));
                              }
                            }}
                            className="rounded border-slate-300 dark:border-slate-600"
                          />
                          <span className={`w-2 h-2 rounded-full bg-${config.color}-500`}></span>
                          <span className="text-sm text-slate-700 dark:text-slate-300">{config.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Popular Tags */}
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Popular Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {allTags.slice(0, 8).map(tag => (
                        <button
                          key={tag}
                          onClick={() => {
                            if (filters.tags.includes(tag)) {
                              setFilters(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
                            } else {
                              setFilters(prev => ({ ...prev, tags: [...prev.tags, tag] }));
                            }
                          }}
                          className={`px-2 py-1 text-xs rounded-full transition-colors ${
                            filters.tags.includes(tag)
                              ? 'bg-blue-500 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Terms List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {filteredTerms.map((term) => {
                const categoryConfig = CATEGORY_CONFIG[term.category];
                const difficultyConfig = DIFFICULTY_CONFIG[term.difficulty];
                const CategoryIcon = categoryConfig.icon;

                return (
                  <motion.div
                    key={term.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedTerm(term)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <CategoryIcon className={`w-5 h-5 text-${categoryConfig.color}-500`} />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                          {term.term}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full bg-${difficultyConfig.color}-100 text-${difficultyConfig.color}-800 dark:bg-${difficultyConfig.color}-900/30 dark:text-${difficultyConfig.color}-300`}>
                          {difficultyConfig.label}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(term.id);
                          }}
                          className={`p-1 rounded-full transition-colors ${
                            favorites.has(term.id)
                              ? 'text-yellow-500 hover:text-yellow-600'
                              : 'text-slate-400 hover:text-yellow-500'
                          }`}
                        >
                          <Star className={`w-4 h-4 ${favorites.has(term.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                      {term.definition}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {term.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {term.tags.length > 3 && (
                          <span className="px-2 py-1 text-xs text-slate-500 dark:text-slate-400">
                            +{term.tags.length - 3} more
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className={getQualityScoreColor(term.qualityScore)}>
                          {term.qualityScore}% quality
                        </span>
                        <span>•</span>
                        <span>{term.popularity}% popular</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {filteredTerms.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    No terms found
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Term Detail Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {selectedTerm ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      {selectedTerm.term}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copyTermLink(selectedTerm)}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        title="Copy link"
                      >
                        {copiedTerm === selectedTerm.id ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => setSelectedTerm(null)}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Definition</h4>
                      <p className="text-slate-600 dark:text-slate-400">{selectedTerm.definition}</p>
                    </div>

                    {selectedTerm.examples && selectedTerm.examples.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Examples</h4>
                        <ul className="space-y-1">
                          {selectedTerm.examples.map((example, index) => (
                            <li key={index} className="text-sm text-slate-600 dark:text-slate-400 flex items-start">
                              <span className="text-blue-500 mr-2">•</span>
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedTerm.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900/50"
                            onClick={() => {
                              if (!filters.tags.includes(tag)) {
                                setFilters(prev => ({ ...prev, tags: [...prev.tags, tag] }));
                              }
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {selectedTerm.links && selectedTerm.links.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Related Links</h4>
                        <div className="space-y-2">
                          {selectedTerm.links.map((link, index) => (
                            <a
                              key={index}
                              href={link.url}
                              target={link.type === 'external' ? '_blank' : '_self'}
                              rel={link.type === 'external' ? 'noopener noreferrer' : undefined}
                              className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                            >
                              <span>{link.title}</span>
                              {link.type === 'external' && <ExternalLink className="w-3 h-3" />}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>Quality Score: <span className={getQualityScoreColor(selectedTerm.qualityScore)}>{selectedTerm.qualityScore}%</span></span>
                        <span>Updated: {selectedTerm.lastUpdated.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 text-center">
                  <Lightbulb className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Select a term
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Click on any term from the list to view detailed information, examples, and related links.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterGlossary; 