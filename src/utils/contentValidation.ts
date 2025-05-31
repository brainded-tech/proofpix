// Content Validation System - ProofPix Documentation Quality Framework
// Implements comprehensive quality scoring for documentation content

export interface ContentValidationResult {
  isValid: boolean;
  qualityScore: number; // 0-100
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: ValidationSuggestion[];
  metrics: QualityMetrics;
  readabilityScore: ReadabilityScore;
  seoScore: SEOScore;
  accessibilityScore: AccessibilityScore;
}

export interface ValidationError {
  type: 'grammar' | 'spelling' | 'structure' | 'links' | 'formatting' | 'compliance';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  line?: number;
  column?: number;
  suggestion?: string;
  ruleId: string;
}

export interface ValidationWarning {
  type: 'style' | 'consistency' | 'clarity' | 'length' | 'tone';
  message: string;
  line?: number;
  suggestion?: string;
  impact: 'high' | 'medium' | 'low';
}

export interface ValidationSuggestion {
  type: 'improvement' | 'optimization' | 'enhancement';
  message: string;
  priority: 'high' | 'medium' | 'low';
  category: 'readability' | 'seo' | 'accessibility' | 'engagement';
  actionable: boolean;
}

export interface QualityMetrics {
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  averageWordsPerSentence: number;
  averageSentencesPerParagraph: number;
  complexWords: number;
  readingTime: number; // minutes
  keywordDensity: Record<string, number>;
  headingStructure: HeadingAnalysis;
  linkAnalysis: LinkAnalysis;
}

export interface ReadabilityScore {
  fleschKincaid: number;
  fleschReadingEase: number;
  gunningFog: number;
  smog: number;
  automatedReadabilityIndex: number;
  colemanLiau: number;
  grade: string;
  difficulty: 'very-easy' | 'easy' | 'fairly-easy' | 'standard' | 'fairly-difficult' | 'difficult' | 'very-difficult';
}

export interface SEOScore {
  score: number; // 0-100
  titleOptimization: number;
  metaDescription: number;
  headingStructure: number;
  keywordOptimization: number;
  internalLinks: number;
  imageOptimization: number;
  contentLength: number;
}

export interface AccessibilityScore {
  score: number; // 0-100
  headingHierarchy: number;
  altTextCoverage: number;
  linkDescriptiveness: number;
  colorContrast: number;
  languageClarity: number;
  structuralMarkup: number;
}

export interface HeadingAnalysis {
  structure: Array<{ level: number; text: string; line: number }>;
  hasH1: boolean;
  properHierarchy: boolean;
  missingLevels: number[];
  duplicateH1s: number;
}

export interface LinkAnalysis {
  totalLinks: number;
  internalLinks: number;
  externalLinks: number;
  brokenLinks: string[];
  descriptiveLinks: number;
  genericLinks: number;
}

export interface ContentTemplate {
  id: string;
  name: string;
  category: 'technical' | 'business' | 'legal' | 'marketing' | 'support';
  audience: 'beginner' | 'intermediate' | 'expert' | 'mixed';
  requiredSections: string[];
  optionalSections: string[];
  minWordCount: number;
  maxWordCount: number;
  requiredKeywords: string[];
  styleGuide: StyleGuideRules;
  qualityThresholds: QualityThresholds;
}

export interface StyleGuideRules {
  tone: 'formal' | 'professional' | 'conversational' | 'technical';
  voice: 'active' | 'passive' | 'mixed';
  personPerspective: 'first' | 'second' | 'third';
  sentenceLength: { min: number; max: number; preferred: number };
  paragraphLength: { min: number; max: number; preferred: number };
  forbiddenWords: string[];
  preferredTerms: Record<string, string>;
  brandTerms: string[];
}

export interface QualityThresholds {
  minimumScore: number;
  readabilityGrade: number;
  maxComplexWords: number;
  minInternalLinks: number;
  maxExternalLinks: number;
  requiredHeadings: string[];
}

// ProofPix-specific content templates
export const PROOFPIX_TEMPLATES: ContentTemplate[] = [
  {
    id: 'technical-guide',
    name: 'Technical Documentation',
    category: 'technical',
    audience: 'intermediate',
    requiredSections: ['Overview', 'Prerequisites', 'Implementation', 'Examples', 'Troubleshooting'],
    optionalSections: ['Advanced Configuration', 'Best Practices', 'FAQ'],
    minWordCount: 800,
    maxWordCount: 3000,
    requiredKeywords: ['ProofPix', 'metadata', 'EXIF', 'privacy'],
    styleGuide: {
      tone: 'technical',
      voice: 'active',
      personPerspective: 'second',
      sentenceLength: { min: 8, max: 25, preferred: 15 },
      paragraphLength: { min: 2, max: 6, preferred: 4 },
      forbiddenWords: ['obviously', 'simply', 'just', 'easy'],
      preferredTerms: {
        'photo': 'image',
        'picture': 'image',
        'app': 'application',
        'setup': 'configuration'
      },
      brandTerms: ['ProofPix', 'client-side processing', 'privacy-first', 'zero-upload']
    },
    qualityThresholds: {
      minimumScore: 85,
      readabilityGrade: 12,
      maxComplexWords: 15,
      minInternalLinks: 3,
      maxExternalLinks: 5,
      requiredHeadings: ['h1', 'h2']
    }
  },
  {
    id: 'user-guide',
    name: 'User Guide',
    category: 'support',
    audience: 'beginner',
    requiredSections: ['Getting Started', 'Step-by-Step Instructions', 'Tips & Tricks'],
    optionalSections: ['Video Tutorials', 'Common Questions', 'Next Steps'],
    minWordCount: 500,
    maxWordCount: 2000,
    requiredKeywords: ['ProofPix', 'upload', 'metadata', 'export'],
    styleGuide: {
      tone: 'conversational',
      voice: 'active',
      personPerspective: 'second',
      sentenceLength: { min: 6, max: 20, preferred: 12 },
      paragraphLength: { min: 1, max: 4, preferred: 3 },
      forbiddenWords: ['utilize', 'leverage', 'paradigm', 'synergy'],
      preferredTerms: {
        'utilize': 'use',
        'commence': 'start',
        'terminate': 'end',
        'facilitate': 'help'
      },
      brandTerms: ['ProofPix', 'privacy-first', 'local processing', 'secure']
    },
    qualityThresholds: {
      minimumScore: 80,
      readabilityGrade: 8,
      maxComplexWords: 10,
      minInternalLinks: 2,
      maxExternalLinks: 3,
      requiredHeadings: ['h1', 'h2']
    }
  },
  {
    id: 'enterprise-documentation',
    name: 'Enterprise Documentation',
    category: 'business',
    audience: 'expert',
    requiredSections: ['Executive Summary', 'Technical Specifications', 'Implementation Plan', 'ROI Analysis', 'Compliance'],
    optionalSections: ['Case Studies', 'Integration Examples', 'Migration Guide'],
    minWordCount: 1500,
    maxWordCount: 5000,
    requiredKeywords: ['enterprise', 'compliance', 'security', 'scalability', 'ROI'],
    styleGuide: {
      tone: 'professional',
      voice: 'active',
      personPerspective: 'third',
      sentenceLength: { min: 10, max: 30, preferred: 18 },
      paragraphLength: { min: 3, max: 8, preferred: 5 },
      forbiddenWords: ['awesome', 'amazing', 'incredible', 'revolutionary'],
      preferredTerms: {
        'buy': 'purchase',
        'get': 'obtain',
        'fix': 'resolve',
        'problem': 'challenge'
      },
      brandTerms: ['ProofPix Enterprise', 'white-label', 'GDPR compliance', 'enterprise-grade']
    },
    qualityThresholds: {
      minimumScore: 90,
      readabilityGrade: 14,
      maxComplexWords: 20,
      minInternalLinks: 5,
      maxExternalLinks: 8,
      requiredHeadings: ['h1', 'h2', 'h3']
    }
  }
];

export class ContentValidator {
  private templates: Map<string, ContentTemplate> = new Map();
  private customRules: ValidationRule[] = [];

  constructor() {
    // Initialize with ProofPix templates
    PROOFPIX_TEMPLATES.forEach(template => {
      this.templates.set(template.id, template);
    });

    // Initialize custom validation rules
    this.initializeCustomRules();
  }

  /**
   * Validate content against a specific template
   */
  async validateContent(
    content: string,
    templateId: string,
    metadata?: { title?: string; description?: string; keywords?: string[] }
  ): Promise<ContentValidationResult> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: ValidationSuggestion[] = [];

    // Basic content analysis
    const metrics = this.analyzeContent(content);
    const readabilityScore = this.calculateReadabilityScore(content, metrics);
    const seoScore = this.calculateSEOScore(content, metadata, template);
    const accessibilityScore = this.calculateAccessibilityScore(content, metrics);

    // Template-specific validation
    await this.validateAgainstTemplate(content, template, errors, warnings, suggestions);

    // Custom rule validation
    await this.validateCustomRules(content, template, errors, warnings, suggestions);

    // Calculate overall quality score
    const qualityScore = this.calculateQualityScore(
      errors,
      warnings,
      readabilityScore,
      seoScore,
      accessibilityScore,
      template
    );

    return {
      isValid: errors.filter(e => e.severity === 'critical' || e.severity === 'high').length === 0,
      qualityScore,
      errors,
      warnings,
      suggestions,
      metrics,
      readabilityScore,
      seoScore,
      accessibilityScore
    };
  }

  /**
   * Analyze basic content metrics
   */
  private analyzeContent(content: string): QualityMetrics {
    const words = content.split(/\s+/).filter(word => word.length > 0);
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);

    // Complex words (3+ syllables)
    const complexWords = words.filter(word => this.countSyllables(word) >= 3).length;

    // Keyword density analysis
    const keywordDensity: Record<string, number> = {};
    const totalWords = words.length;
    words.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
      if (cleanWord.length > 3) {
        keywordDensity[cleanWord] = (keywordDensity[cleanWord] || 0) + 1;
      }
    });

    // Convert to percentages
    Object.keys(keywordDensity).forEach(keyword => {
      keywordDensity[keyword] = (keywordDensity[keyword] / totalWords) * 100;
    });

    // Heading structure analysis
    const headingStructure = this.analyzeHeadingStructure(content);

    // Link analysis
    const linkAnalysis = this.analyzeLinkStructure(content);

    return {
      wordCount: words.length,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      averageWordsPerSentence: words.length / sentences.length || 0,
      averageSentencesPerParagraph: sentences.length / paragraphs.length || 0,
      complexWords,
      readingTime: Math.ceil(words.length / 200), // 200 WPM average
      keywordDensity,
      headingStructure,
      linkAnalysis
    };
  }

  /**
   * Calculate readability scores
   */
  private calculateReadabilityScore(content: string, metrics: QualityMetrics): ReadabilityScore {
    const { wordCount, sentenceCount, complexWords } = metrics;
    const syllableCount = this.countTotalSyllables(content);

    // Flesch-Kincaid Grade Level
    const fleschKincaid = 0.39 * (wordCount / sentenceCount) + 11.8 * (syllableCount / wordCount) - 15.59;

    // Flesch Reading Ease
    const fleschReadingEase = 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllableCount / wordCount);

    // Gunning Fog Index
    const gunningFog = 0.4 * ((wordCount / sentenceCount) + 100 * (complexWords / wordCount));

    // SMOG Index
    const smog = 1.0430 * Math.sqrt(complexWords * (30 / sentenceCount)) + 3.1291;

    // Automated Readability Index
    const automatedReadabilityIndex = 4.71 * (this.countCharacters(content) / wordCount) + 0.5 * (wordCount / sentenceCount) - 21.43;

    // Coleman-Liau Index
    const avgSentencesPer100Words = (sentenceCount / wordCount) * 100;
    const avgCharactersPer100Words = (this.countCharacters(content) / wordCount) * 100;
    const colemanLiau = 0.0588 * avgCharactersPer100Words - 0.296 * avgSentencesPer100Words - 15.8;

    // Determine grade and difficulty
    const averageGrade = (fleschKincaid + gunningFog + smog + automatedReadabilityIndex + colemanLiau) / 5;
    const grade = this.getGradeLevel(averageGrade);
    const difficulty = this.getDifficultyLevel(fleschReadingEase);

    return {
      fleschKincaid: Math.round(fleschKincaid * 10) / 10,
      fleschReadingEase: Math.round(fleschReadingEase * 10) / 10,
      gunningFog: Math.round(gunningFog * 10) / 10,
      smog: Math.round(smog * 10) / 10,
      automatedReadabilityIndex: Math.round(automatedReadabilityIndex * 10) / 10,
      colemanLiau: Math.round(colemanLiau * 10) / 10,
      grade,
      difficulty
    };
  }

  /**
   * Calculate SEO score
   */
  private calculateSEOScore(
    content: string,
    metadata?: { title?: string; description?: string; keywords?: string[] },
    template?: ContentTemplate
  ): SEOScore {
    let score = 0;
    const maxScore = 100;

    // Title optimization (15 points)
    const titleScore = this.evaluateTitle(metadata?.title || '', content);
    score += titleScore * 0.15;

    // Meta description (10 points)
    const metaScore = this.evaluateMetaDescription(metadata?.description || '');
    score += metaScore * 0.10;

    // Heading structure (20 points)
    const headingScore = this.evaluateHeadingStructure(content);
    score += headingScore * 0.20;

    // Keyword optimization (20 points)
    const keywordScore = this.evaluateKeywordOptimization(content, metadata?.keywords || [], template);
    score += keywordScore * 0.20;

    // Internal links (15 points)
    const internalLinkScore = this.evaluateInternalLinks(content);
    score += internalLinkScore * 0.15;

    // Image optimization (10 points)
    const imageScore = this.evaluateImageOptimization(content);
    score += imageScore * 0.10;

    // Content length (10 points)
    const lengthScore = this.evaluateContentLength(content, template);
    score += lengthScore * 0.10;

    return {
      score: Math.round(score),
      titleOptimization: titleScore,
      metaDescription: metaScore,
      headingStructure: headingScore,
      keywordOptimization: keywordScore,
      internalLinks: internalLinkScore,
      imageOptimization: imageScore,
      contentLength: lengthScore
    };
  }

  /**
   * Calculate accessibility score
   */
  private calculateAccessibilityScore(content: string, metrics: QualityMetrics): AccessibilityScore {
    let score = 0;

    // Heading hierarchy (25 points)
    const headingScore = this.evaluateHeadingHierarchy(metrics.headingStructure);
    score += headingScore * 0.25;

    // Alt text coverage (20 points)
    const altTextScore = this.evaluateAltTextCoverage(content);
    score += altTextScore * 0.20;

    // Link descriptiveness (20 points)
    const linkScore = this.evaluateLinkDescriptiveness(content);
    score += linkScore * 0.20;

    // Color contrast (15 points) - placeholder for future implementation
    const contrastScore = 100; // Assume good contrast for now
    score += contrastScore * 0.15;

    // Language clarity (10 points)
    const clarityScore = this.evaluateLanguageClarity(content);
    score += clarityScore * 0.10;

    // Structural markup (10 points)
    const structureScore = this.evaluateStructuralMarkup(content);
    score += structureScore * 0.10;

    return {
      score: Math.round(score),
      headingHierarchy: headingScore,
      altTextCoverage: altTextScore,
      linkDescriptiveness: linkScore,
      colorContrast: contrastScore,
      languageClarity: clarityScore,
      structuralMarkup: structureScore
    };
  }

  /**
   * Calculate overall quality score
   */
  private calculateQualityScore(
    errors: ValidationError[],
    warnings: ValidationWarning[],
    readabilityScore: ReadabilityScore,
    seoScore: SEOScore,
    accessibilityScore: AccessibilityScore,
    template: ContentTemplate
  ): number {
    let score = 100;

    // Deduct points for errors
    errors.forEach(error => {
      switch (error.severity) {
        case 'critical':
          score -= 25;
          break;
        case 'high':
          score -= 15;
          break;
        case 'medium':
          score -= 8;
          break;
        case 'low':
          score -= 3;
          break;
      }
    });

    // Deduct points for warnings
    warnings.forEach(warning => {
      switch (warning.impact) {
        case 'high':
          score -= 5;
          break;
        case 'medium':
          score -= 3;
          break;
        case 'low':
          score -= 1;
          break;
      }
    });

    // Factor in readability (20% weight)
    const readabilityWeight = this.getReadabilityWeight(readabilityScore, template);
    score = score * 0.8 + (readabilityWeight * 20);

    // Factor in SEO score (10% weight)
    score = score * 0.9 + (seoScore.score * 0.1);

    // Factor in accessibility score (10% weight)
    score = score * 0.9 + (accessibilityScore.score * 0.1);

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  // Helper methods for content analysis
  private countSyllables(word: string): number {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  }

  private countTotalSyllables(content: string): number {
    const words = content.split(/\s+/).filter(word => word.length > 0);
    return words.reduce((total, word) => total + this.countSyllables(word), 0);
  }

  private countCharacters(content: string): number {
    return content.replace(/\s/g, '').length;
  }

  private getGradeLevel(grade: number): string {
    if (grade < 6) return 'Elementary School';
    if (grade < 9) return 'Middle School';
    if (grade < 13) return 'High School';
    if (grade < 16) return 'College';
    return 'Graduate';
  }

  private getDifficultyLevel(fleschScore: number): ReadabilityScore['difficulty'] {
    if (fleschScore >= 90) return 'very-easy';
    if (fleschScore >= 80) return 'easy';
    if (fleschScore >= 70) return 'fairly-easy';
    if (fleschScore >= 60) return 'standard';
    if (fleschScore >= 50) return 'fairly-difficult';
    if (fleschScore >= 30) return 'difficult';
    return 'very-difficult';
  }

  private analyzeHeadingStructure(content: string): HeadingAnalysis {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings: Array<{ level: number; text: string; line: number }> = [];
    const lines = content.split('\n');
    
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const line = content.substring(0, match.index).split('\n').length;
      headings.push({ level, text, line });
    }

    const hasH1 = headings.some(h => h.level === 1);
    const duplicateH1s = headings.filter(h => h.level === 1).length;
    
    // Check for proper hierarchy
    let properHierarchy = true;
    const missingLevels: number[] = [];
    
    for (let i = 1; i < headings.length; i++) {
      const current = headings[i];
      const previous = headings[i - 1];
      
      if (current.level > previous.level + 1) {
        properHierarchy = false;
        for (let level = previous.level + 1; level < current.level; level++) {
          if (!missingLevels.includes(level)) {
            missingLevels.push(level);
          }
        }
      }
    }

    return {
      structure: headings,
      hasH1,
      properHierarchy,
      missingLevels,
      duplicateH1s
    };
  }

  private analyzeLinkStructure(content: string): LinkAnalysis {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const links: Array<{ text: string; url: string }> = [];
    
    let match;
    while ((match = linkRegex.exec(content)) !== null) {
      links.push({ text: match[1], url: match[2] });
    }

    const totalLinks = links.length;
    const internalLinks = links.filter(link => 
      link.url.startsWith('/') || 
      link.url.startsWith('#') || 
      link.url.includes(window.location?.hostname || 'proofpix.com')
    ).length;
    const externalLinks = totalLinks - internalLinks;

    // Check for descriptive links
    const genericTerms = ['click here', 'read more', 'here', 'this', 'link'];
    const descriptiveLinks = links.filter(link => 
      !genericTerms.some(term => link.text.toLowerCase().includes(term))
    ).length;
    const genericLinks = totalLinks - descriptiveLinks;

    // Placeholder for broken link detection
    const brokenLinks: string[] = [];

    return {
      totalLinks,
      internalLinks,
      externalLinks,
      brokenLinks,
      descriptiveLinks,
      genericLinks
    };
  }

  // SEO evaluation methods
  private evaluateTitle(title: string, content: string): number {
    if (!title) return 0;
    
    let score = 0;
    
    // Length check (50-60 characters ideal)
    if (title.length >= 50 && title.length <= 60) score += 40;
    else if (title.length >= 30 && title.length <= 70) score += 25;
    else score += 10;
    
    // Contains primary keyword
    const firstHeading = content.match(/^#\s+(.+)$/m);
    if (firstHeading && title.toLowerCase().includes(firstHeading[1].toLowerCase())) {
      score += 30;
    }
    
    // Uniqueness and descriptiveness
    if (title.split(' ').length >= 4) score += 20;
    if (title.includes('ProofPix')) score += 10;
    
    return Math.min(100, score);
  }

  private evaluateMetaDescription(description: string): number {
    if (!description) return 0;
    
    let score = 0;
    
    // Length check (150-160 characters ideal)
    if (description.length >= 150 && description.length <= 160) score += 50;
    else if (description.length >= 120 && description.length <= 180) score += 35;
    else score += 15;
    
    // Contains call to action
    const ctaWords = ['learn', 'discover', 'explore', 'get', 'start', 'try'];
    if (ctaWords.some(word => description.toLowerCase().includes(word))) {
      score += 25;
    }
    
    // Contains brand name
    if (description.includes('ProofPix')) score += 25;
    
    return Math.min(100, score);
  }

  private evaluateHeadingStructure(content: string): number {
    const headings = this.analyzeHeadingStructure(content);
    let score = 0;
    
    // Has H1
    if (headings.hasH1) score += 30;
    
    // Proper hierarchy
    if (headings.properHierarchy) score += 25;
    
    // Has multiple heading levels
    const levels = new Set(headings.structure.map(h => h.level));
    if (levels.size >= 2) score += 20;
    if (levels.size >= 3) score += 10;
    
    // Reasonable number of headings
    const headingCount = headings.structure.length;
    if (headingCount >= 3 && headingCount <= 10) score += 15;
    
    return Math.min(100, score);
  }

  private evaluateKeywordOptimization(content: string, keywords: string[], template?: ContentTemplate): number {
    if (!keywords.length && !template?.requiredKeywords.length) return 50;
    
    const allKeywords = [...keywords, ...(template?.requiredKeywords || [])];
    let score = 0;
    
    allKeywords.forEach(keyword => {
      const regex = new RegExp(keyword, 'gi');
      const matches = content.match(regex);
      const density = matches ? (matches.length / content.split(' ').length) * 100 : 0;
      
      // Optimal density is 1-3%
      if (density >= 1 && density <= 3) score += 20;
      else if (density > 0 && density < 1) score += 10;
      else if (density > 3 && density <= 5) score += 5;
    });
    
    return Math.min(100, score / allKeywords.length * 100);
  }

  private evaluateInternalLinks(content: string): number {
    const linkAnalysis = this.analyzeLinkStructure(content);
    let score = 0;
    
    // Has internal links
    if (linkAnalysis.internalLinks > 0) score += 40;
    if (linkAnalysis.internalLinks >= 3) score += 30;
    if (linkAnalysis.internalLinks >= 5) score += 20;
    
    // Good ratio of internal to external links
    const ratio = linkAnalysis.totalLinks > 0 ? linkAnalysis.internalLinks / linkAnalysis.totalLinks : 0;
    if (ratio >= 0.5) score += 10;
    
    return Math.min(100, score);
  }

  private evaluateImageOptimization(content: string): number {
    const imageRegex = /!\[([^\]]*)\]\([^)]+\)/g;
    const images = content.match(imageRegex) || [];
    
    if (images.length === 0) return 100; // No images to optimize
    
    let score = 0;
    let imagesWithAlt = 0;
    
    images.forEach(image => {
      const altMatch = image.match(/!\[([^\]]*)\]/);
      if (altMatch && altMatch[1].trim().length > 0) {
        imagesWithAlt++;
      }
    });
    
    // Alt text coverage
    const altCoverage = (imagesWithAlt / images.length) * 100;
    score = altCoverage;
    
    return Math.round(score);
  }

  private evaluateContentLength(content: string, template?: ContentTemplate): number {
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    
    if (!template) {
      // General content length scoring
      if (wordCount >= 300 && wordCount <= 2000) return 100;
      if (wordCount >= 200 && wordCount <= 3000) return 75;
      if (wordCount >= 100) return 50;
      return 25;
    }
    
    // Template-specific scoring
    if (wordCount >= template.minWordCount && wordCount <= template.maxWordCount) {
      return 100;
    }
    
    const deviation = Math.min(
      Math.abs(wordCount - template.minWordCount),
      Math.abs(wordCount - template.maxWordCount)
    );
    
    const tolerance = (template.maxWordCount - template.minWordCount) * 0.2;
    
    if (deviation <= tolerance) return 75;
    if (deviation <= tolerance * 2) return 50;
    return 25;
  }

  // Accessibility evaluation methods
  private evaluateHeadingHierarchy(headingStructure: HeadingAnalysis): number {
    let score = 0;
    
    if (headingStructure.hasH1) score += 30;
    if (headingStructure.properHierarchy) score += 40;
    if (headingStructure.duplicateH1s <= 1) score += 20;
    if (headingStructure.missingLevels.length === 0) score += 10;
    
    return Math.min(100, score);
  }

  private evaluateAltTextCoverage(content: string): number {
    return this.evaluateImageOptimization(content); // Same logic
  }

  private evaluateLinkDescriptiveness(content: string): number {
    const linkAnalysis = this.analyzeLinkStructure(content);
    
    if (linkAnalysis.totalLinks === 0) return 100;
    
    const descriptiveRatio = linkAnalysis.descriptiveLinks / linkAnalysis.totalLinks;
    return Math.round(descriptiveRatio * 100);
  }

  private evaluateLanguageClarity(content: string): number {
    // Simple clarity metrics
    const words = content.split(/\s+/).filter(word => word.length > 0);
    const longWords = words.filter(word => word.length > 12).length;
    const longWordRatio = longWords / words.length;
    
    // Prefer fewer long words for clarity
    if (longWordRatio <= 0.05) return 100;
    if (longWordRatio <= 0.10) return 75;
    if (longWordRatio <= 0.15) return 50;
    return 25;
  }

  private evaluateStructuralMarkup(content: string): number {
    let score = 0;
    
    // Has lists
    if (content.includes('- ') || content.includes('* ') || /^\d+\.\s/.test(content)) {
      score += 30;
    }
    
    // Has code blocks
    if (content.includes('```') || content.includes('`')) {
      score += 20;
    }
    
    // Has emphasis
    if (content.includes('**') || content.includes('*') || content.includes('_')) {
      score += 25;
    }
    
    // Has blockquotes
    if (content.includes('> ')) {
      score += 15;
    }
    
    // Has tables
    if (content.includes('|')) {
      score += 10;
    }
    
    return Math.min(100, score);
  }

  private getReadabilityWeight(readabilityScore: ReadabilityScore, template: ContentTemplate): number {
    const targetGrade = template.audience === 'beginner' ? 8 : 
                      template.audience === 'intermediate' ? 12 : 16;
    
    const actualGrade = readabilityScore.fleschKincaid;
    const deviation = Math.abs(actualGrade - targetGrade);
    
    if (deviation <= 1) return 100;
    if (deviation <= 2) return 85;
    if (deviation <= 3) return 70;
    if (deviation <= 4) return 55;
    return 40;
  }

  // Template validation methods
  private async validateAgainstTemplate(
    content: string,
    template: ContentTemplate,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): Promise<void> {
    // Word count validation
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    
    if (wordCount < template.minWordCount) {
      errors.push({
        type: 'structure',
        severity: 'medium',
        message: `Content is too short. Expected at least ${template.minWordCount} words, got ${wordCount}.`,
        suggestion: `Add more detailed explanations and examples to reach the minimum word count.`,
        ruleId: 'min-word-count'
      });
    }
    
    if (wordCount > template.maxWordCount) {
      warnings.push({
        type: 'length',
        message: `Content is longer than recommended. Expected at most ${template.maxWordCount} words, got ${wordCount}.`,
        suggestion: `Consider breaking this into multiple documents or removing unnecessary content.`,
        impact: 'medium'
      });
    }

    // Required keywords validation
    template.requiredKeywords.forEach(keyword => {
      if (!content.toLowerCase().includes(keyword.toLowerCase())) {
        errors.push({
          type: 'structure',
          severity: 'high',
          message: `Required keyword "${keyword}" is missing from the content.`,
          suggestion: `Include the keyword "${keyword}" naturally in the content.`,
          ruleId: 'required-keyword'
        });
      }
    });

    // Style guide validation
    await this.validateStyleGuide(content, template.styleGuide, errors, warnings, suggestions);
  }

  private async validateStyleGuide(
    content: string,
    styleGuide: StyleGuideRules,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): Promise<void> {
    // Forbidden words check
    styleGuide.forbiddenWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      if (regex.test(content)) {
        warnings.push({
          type: 'style',
          message: `Avoid using the word "${word}" as it doesn't align with our style guide.`,
          suggestion: `Consider using an alternative term.`,
          impact: 'low'
        });
      }
    });

    // Preferred terms check
    Object.entries(styleGuide.preferredTerms).forEach(([avoid, prefer]) => {
      const regex = new RegExp(`\\b${avoid}\\b`, 'gi');
      if (regex.test(content)) {
        suggestions.push({
          type: 'improvement',
          message: `Consider using "${prefer}" instead of "${avoid}" for consistency.`,
          priority: 'low',
          category: 'readability',
          actionable: true
        });
      }
    });

    // Brand terms check
    styleGuide.brandTerms.forEach(term => {
      const regex = new RegExp(term, 'g');
      const matches = content.match(regex);
      if (!matches || matches.length === 0) {
        suggestions.push({
          type: 'enhancement',
          message: `Consider including the brand term "${term}" to reinforce brand identity.`,
          priority: 'medium',
          category: 'seo',
          actionable: true
        });
      }
    });
  }

  private async validateCustomRules(
    content: string,
    template: ContentTemplate,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): Promise<void> {
    // Apply custom validation rules
    for (const rule of this.customRules) {
      try {
        await rule.validate(content, template, errors, warnings, suggestions);
      } catch (error) {
        console.error(`Custom rule ${rule.id} failed:`, error);
      }
    }
  }

  private initializeCustomRules(): void {
    // ProofPix-specific validation rules
    this.customRules = [
      {
        id: 'privacy-terminology',
        name: 'Privacy Terminology Consistency',
        validate: async (content, template, errors, warnings, suggestions) => {
          // Ensure consistent privacy terminology
          const privacyTerms = {
            'client side': 'client-side',
            'server side': 'server-side',
            'zero data': 'zero-data',
            'privacy first': 'privacy-first'
          };

          Object.entries(privacyTerms).forEach(([incorrect, correct]) => {
            if (content.toLowerCase().includes(incorrect)) {
              suggestions.push({
                type: 'improvement',
                message: `Use "${correct}" instead of "${incorrect}" for consistency.`,
                priority: 'medium',
                category: 'readability',
                actionable: true
              });
            }
          });
        }
      },
      {
        id: 'security-claims',
        name: 'Security Claims Validation',
        validate: async (content, template, errors, warnings, suggestions) => {
          // Ensure security claims are backed by evidence
          const securityClaims = ['100% secure', 'completely safe', 'totally private'];
          
          securityClaims.forEach(claim => {
            if (content.toLowerCase().includes(claim.toLowerCase())) {
              warnings.push({
                type: 'clarity',
                message: `Avoid absolute security claims like "${claim}". Provide specific technical details instead.`,
                suggestion: `Replace with specific technical explanations of our security measures.`,
                impact: 'high'
              });
            }
          });
        }
      }
    ];
  }

  /**
   * Add a custom validation rule
   */
  addCustomRule(rule: ValidationRule): void {
    this.customRules.push(rule);
  }

  /**
   * Get available templates
   */
  getTemplates(): ContentTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Add a custom template
   */
  addTemplate(template: ContentTemplate): void {
    this.templates.set(template.id, template);
  }
}

interface ValidationRule {
  id: string;
  name: string;
  validate: (
    content: string,
    template: ContentTemplate,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ) => Promise<void>;
}

// Export singleton instance
export const contentValidator = new ContentValidator(); 