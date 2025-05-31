import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Users, 
  Building2, 
  Shield, 
  Zap, 
  BookOpen, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Edit3, 
  Save, 
  Eye, 
  Download,
  Copy,
  RefreshCw,
  Target,
  BarChart3,
  Clock,
  Star,
  Filter,
  Search,
  Plus,
  X
} from 'lucide-react';
import { 
  ContentTemplate, 
  ContentValidationResult, 
  contentValidator,
  PROOFPIX_TEMPLATES 
} from '../utils/contentValidation';

interface ContentTemplatesProps {
  onTemplateSelect?: (template: ContentTemplate) => void;
  onContentValidate?: (result: ContentValidationResult) => void;
  embedded?: boolean;
  showEditor?: boolean;
}

interface TemplateEditorState {
  content: string;
  template: ContentTemplate | null;
  validationResult: ContentValidationResult | null;
  isValidating: boolean;
  lastValidated: Date | null;
  metadata: {
    title: string;
    description: string;
    keywords: string[];
  };
}

const TEMPLATE_CATEGORIES = {
  technical: { icon: Zap, color: 'blue', label: 'Technical' },
  business: { icon: Building2, color: 'purple', label: 'Business' },
  legal: { icon: Shield, color: 'red', label: 'Legal' },
  marketing: { icon: Target, color: 'green', label: 'Marketing' },
  support: { icon: Users, color: 'orange', label: 'Support' }
};

const AUDIENCE_LEVELS = {
  beginner: { color: 'green', label: 'Beginner', description: 'New users and basic concepts' },
  intermediate: { color: 'blue', label: 'Intermediate', description: 'Users with some experience' },
  expert: { color: 'purple', label: 'Expert', description: 'Advanced users and technical details' },
  mixed: { color: 'gray', label: 'Mixed', description: 'Multiple audience levels' }
};

export const ContentTemplates: React.FC<ContentTemplatesProps> = ({
  onTemplateSelect,
  onContentValidate,
  embedded = false,
  showEditor = false
}) => {
  const [templates, setTemplates] = useState<ContentTemplate[]>(PROOFPIX_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [editorState, setEditorState] = useState<TemplateEditorState>({
    content: '',
    template: null,
    validationResult: null,
    isValidating: false,
    lastValidated: null,
    metadata: {
      title: '',
      description: '',
      keywords: []
    }
  });
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterAudience, setFilterAudience] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);

  // Real-time validation with debouncing
  const validateContent = useCallback(async (content: string, template: ContentTemplate, metadata: any) => {
    if (!content.trim() || !template) return;

    setEditorState(prev => ({ ...prev, isValidating: true }));

    try {
      const result = await contentValidator.validateContent(content, template.id, metadata);
      setEditorState(prev => ({
        ...prev,
        validationResult: result,
        isValidating: false,
        lastValidated: new Date()
      }));

      if (onContentValidate) {
        onContentValidate(result);
      }
    } catch (error) {
      console.error('Validation failed:', error);
      setEditorState(prev => ({ ...prev, isValidating: false }));
    }
  }, [onContentValidate]);

  // Debounced validation
  useEffect(() => {
    if (!editorState.content || !editorState.template) return;

    const timeoutId = setTimeout(() => {
      validateContent(editorState.content, editorState.template!, editorState.metadata);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [editorState.content, editorState.template, editorState.metadata, validateContent]);

  const handleTemplateSelect = (template: ContentTemplate) => {
    setSelectedTemplate(template);
    setEditorState(prev => ({
      ...prev,
      template,
      content: generateTemplateContent(template),
      validationResult: null,
      lastValidated: null
    }));

    if (onTemplateSelect) {
      onTemplateSelect(template);
    }
  };

  const generateTemplateContent = (template: ContentTemplate): string => {
    const sections = [...template.requiredSections, ...template.optionalSections];
    
    let content = `# ${template.name}\n\n`;
    content += `> ${template.category.charAt(0).toUpperCase() + template.category.slice(1)} documentation for ${template.audience} users\n\n`;
    
    sections.forEach((section, index) => {
      const level = index === 0 ? '##' : '###';
      content += `${level} ${section}\n\n`;
      content += `[Add your ${section.toLowerCase()} content here]\n\n`;
    });

    return content;
  };

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    const matchesAudience = filterAudience === 'all' || template.audience === filterAudience;
    const matchesSearch = !searchTerm || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.requiredSections.some(section => section.toLowerCase().includes(searchTerm.toLowerCase())) ||
      template.requiredKeywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesAudience && matchesSearch;
  });

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

  const containerClasses = embedded 
    ? 'bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700'
    : 'min-h-screen bg-slate-50 dark:bg-slate-900';

  return (
    <div className={`${containerClasses} p-6`}>
      {!embedded && (
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Content Templates
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Professional templates with real-time quality validation for ProofPix documentation
          </p>
        </div>
      )}

      {/* Filters and Search */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          >
            <option value="all">All Categories</option>
            {Object.entries(TEMPLATE_CATEGORIES).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>

          <select
            value={filterAudience}
            onChange={(e) => setFilterAudience(e.target.value)}
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          >
            <option value="all">All Audiences</option>
            {Object.entries(AUDIENCE_LEVELS).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>

          <button
            onClick={() => setShowCreateTemplate(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Template</span>
          </button>
        </div>

        <div className="text-sm text-slate-500 dark:text-slate-400">
          {filteredTemplates.length} of {templates.length} templates
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates List */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((template) => {
              const categoryConfig = TEMPLATE_CATEGORIES[template.category];
              const audienceConfig = AUDIENCE_LEVELS[template.audience];
              const CategoryIcon = categoryConfig.icon;

              return (
                <motion.div
                  key={template.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-${categoryConfig.color}-100 dark:bg-${categoryConfig.color}-900/30`}>
                        <CategoryIcon className={`w-5 h-5 text-${categoryConfig.color}-600 dark:text-${categoryConfig.color}-400`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                          {template.name}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {categoryConfig.label}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full bg-${audienceConfig.color}-100 text-${audienceConfig.color}-800 dark:bg-${audienceConfig.color}-900/30 dark:text-${audienceConfig.color}-300`}>
                      {audienceConfig.label}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Required Sections
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {template.requiredSections.slice(0, 3).map((section) => (
                          <span
                            key={section}
                            className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded"
                          >
                            {section}
                          </span>
                        ))}
                        {template.requiredSections.length > 3 && (
                          <span className="px-2 py-1 text-xs text-slate-500 dark:text-slate-400">
                            +{template.requiredSections.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>{template.minWordCount}-{template.maxWordCount} words</span>
                      <span>Quality threshold: {template.qualityThresholds.minimumScore}%</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {filteredTemplates.length === 0 && (
              <div className="col-span-2 text-center py-12">
                <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  No templates found
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Try adjusting your search or filters to find templates.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterCategory('all');
                    setFilterAudience('all');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Template Details & Editor */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            {selectedTemplate ? (
              <div className="space-y-6">
                {/* Template Details */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      {selectedTemplate.name}
                    </h2>
                    <button
                      onClick={() => setSelectedTemplate(null)}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        Template Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Category:</span>
                          <span className="text-slate-900 dark:text-slate-100">
                            {TEMPLATE_CATEGORIES[selectedTemplate.category].label}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Audience:</span>
                          <span className="text-slate-900 dark:text-slate-100">
                            {AUDIENCE_LEVELS[selectedTemplate.audience].label}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Word Count:</span>
                          <span className="text-slate-900 dark:text-slate-100">
                            {selectedTemplate.minWordCount}-{selectedTemplate.maxWordCount}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Min Quality:</span>
                          <span className="text-slate-900 dark:text-slate-100">
                            {selectedTemplate.qualityThresholds.minimumScore}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        Required Keywords
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedTemplate.requiredKeywords.map((keyword) => (
                          <span
                            key={keyword}
                            className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        Style Guide
                      </h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Tone:</span>
                          <span className="text-slate-900 dark:text-slate-100 capitalize">
                            {selectedTemplate.styleGuide.tone}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Voice:</span>
                          <span className="text-slate-900 dark:text-slate-100 capitalize">
                            {selectedTemplate.styleGuide.voice}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Perspective:</span>
                          <span className="text-slate-900 dark:text-slate-100 capitalize">
                            {selectedTemplate.styleGuide.personPerspective} person
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Editor */}
                {showEditor && (
                  <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Content Editor
                      </h3>
                      <div className="flex items-center space-x-2">
                        {editorState.isValidating && (
                          <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                        )}
                        {editorState.validationResult && (
                          <div className={`px-2 py-1 text-xs rounded-full ${getQualityScoreBg(editorState.validationResult.qualityScore)}`}>
                            <span className={getQualityScoreColor(editorState.validationResult.qualityScore)}>
                              {editorState.validationResult.qualityScore}% Quality
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Metadata Inputs */}
                    <div className="space-y-3 mb-4">
                      <input
                        type="text"
                        placeholder="Document title..."
                        value={editorState.metadata.title}
                        onChange={(e) => setEditorState(prev => ({
                          ...prev,
                          metadata: { ...prev.metadata, title: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      />
                      <textarea
                        placeholder="Meta description..."
                        value={editorState.metadata.description}
                        onChange={(e) => setEditorState(prev => ({
                          ...prev,
                          metadata: { ...prev.metadata, description: e.target.value }
                        }))}
                        rows={2}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      />
                    </div>

                    {/* Content Textarea */}
                    <textarea
                      value={editorState.content}
                      onChange={(e) => setEditorState(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Start writing your content..."
                      rows={12}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-sm"
                    />

                    {/* Validation Results */}
                    {editorState.validationResult && (
                      <div className="mt-4 space-y-3">
                        {/* Quality Score Summary */}
                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <BarChart3 className="w-4 h-4 text-slate-500" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              Overall Quality Score
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-xs">
                            <span className="text-slate-500">
                              SEO: {editorState.validationResult.seoScore.score}%
                            </span>
                            <span className="text-slate-500">
                              Accessibility: {editorState.validationResult.accessibilityScore.score}%
                            </span>
                            <span className={`font-bold ${getQualityScoreColor(editorState.validationResult.qualityScore)}`}>
                              {editorState.validationResult.qualityScore}%
                            </span>
                          </div>
                        </div>

                        {/* Errors */}
                        {editorState.validationResult.errors.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium text-red-700 dark:text-red-300 flex items-center">
                              <AlertTriangle className="w-4 h-4 mr-1" />
                              Errors ({editorState.validationResult.errors.length})
                            </h5>
                            {editorState.validationResult.errors.slice(0, 3).map((error, index) => (
                              <div key={index} className="p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs">
                                <div className="font-medium text-red-800 dark:text-red-300">
                                  {error.message}
                                </div>
                                {error.suggestion && (
                                  <div className="text-red-600 dark:text-red-400 mt-1">
                                    Suggestion: {error.suggestion}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Warnings */}
                        {editorState.validationResult.warnings.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium text-yellow-700 dark:text-yellow-300 flex items-center">
                              <AlertTriangle className="w-4 h-4 mr-1" />
                              Warnings ({editorState.validationResult.warnings.length})
                            </h5>
                            {editorState.validationResult.warnings.slice(0, 2).map((warning, index) => (
                              <div key={index} className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs">
                                <div className="font-medium text-yellow-800 dark:text-yellow-300">
                                  {warning.message}
                                </div>
                                {warning.suggestion && (
                                  <div className="text-yellow-600 dark:text-yellow-400 mt-1">
                                    Suggestion: {warning.suggestion}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Suggestions */}
                        {editorState.validationResult.suggestions.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center">
                              <Info className="w-4 h-4 mr-1" />
                              Suggestions ({editorState.validationResult.suggestions.length})
                            </h5>
                            {editorState.validationResult.suggestions.slice(0, 2).map((suggestion, index) => (
                              <div key={index} className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                                <div className="font-medium text-blue-800 dark:text-blue-300">
                                  {suggestion.message}
                                </div>
                                <div className="text-blue-600 dark:text-blue-400 mt-1">
                                  Priority: {suggestion.priority} • Category: {suggestion.category}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Metrics Summary */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded">
                            <div className="font-medium text-slate-700 dark:text-slate-300">Words</div>
                            <div className="text-slate-500">{editorState.validationResult.metrics.wordCount}</div>
                          </div>
                          <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded">
                            <div className="font-medium text-slate-700 dark:text-slate-300">Reading Time</div>
                            <div className="text-slate-500">{editorState.validationResult.metrics.readingTime} min</div>
                          </div>
                          <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded">
                            <div className="font-medium text-slate-700 dark:text-slate-300">Grade Level</div>
                            <div className="text-slate-500">{editorState.validationResult.readabilityScore.grade}</div>
                          </div>
                          <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded">
                            <div className="font-medium text-slate-700 dark:text-slate-300">Difficulty</div>
                            <div className="text-slate-500 capitalize">{editorState.validationResult.readabilityScore.difficulty.replace('-', ' ')}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => validateContent(editorState.content, selectedTemplate, editorState.metadata)}
                          disabled={editorState.isValidating}
                          className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3 h-3 ${editorState.isValidating ? 'animate-spin' : ''}`} />
                          <span>Validate</span>
                        </button>
                        {editorState.lastValidated && (
                          <span className="text-xs text-slate-500">
                            Last validated: {editorState.lastValidated.toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="flex items-center space-x-1 px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </button>
                        <button className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                          <Download className="w-3 h-3" />
                          <span>Export</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 text-center">
                <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Select a template
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Choose a template from the list to view details and start editing with real-time quality validation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentTemplates; 