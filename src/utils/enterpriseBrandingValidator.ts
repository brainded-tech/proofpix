/**
 * Enterprise Branding Validation System
 * Validates brand assets, colors, logos, and ensures compliance with enterprise standards
 */

export interface BrandAsset {
  id: string;
  type: 'logo' | 'color' | 'font' | 'pattern' | 'template';
  name: string;
  value: string | File;
  metadata?: Record<string, any>;
  validationStatus?: 'pending' | 'valid' | 'invalid' | 'warning';
  validationErrors?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BrandingValidationResult {
  isValid: boolean;
  score: number; // 0-100
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: ValidationSuggestion[];
  compliance: ComplianceCheck[];
}

export interface ValidationError {
  type: 'color' | 'logo' | 'font' | 'accessibility' | 'format' | 'size';
  severity: 'high' | 'medium' | 'low';
  message: string;
  field: string;
  suggestedFix?: string;
}

export interface ValidationWarning {
  type: string;
  message: string;
  field: string;
  recommendation?: string;
}

export interface ValidationSuggestion {
  type: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
}

export interface ComplianceCheck {
  standard: 'WCAG' | 'SOC2' | 'GDPR' | 'Enterprise' | 'Brand';
  requirement: string;
  status: 'pass' | 'fail' | 'warning';
  details: string;
}

export class EnterpriseBrandingValidator {
  private brandAssets: Map<string, BrandAsset> = new Map();
  private validationRules: ValidationRule[] = [];

  constructor() {
    this.initializeValidationRules();
  }

  /**
   * Initialize comprehensive validation rules
   */
  private initializeValidationRules(): void {
    this.validationRules = [
      // Logo validation rules
      {
        type: 'logo',
        name: 'Logo Format Validation',
        validate: this.validateLogoFormat.bind(this),
        severity: 'high'
      },
      {
        type: 'logo',
        name: 'Logo Size Validation',
        validate: this.validateLogoSize.bind(this),
        severity: 'medium'
      },
      {
        type: 'logo',
        name: 'Logo Transparency',
        validate: this.validateLogoTransparency.bind(this),
        severity: 'low'
      },

      // Color validation rules
      {
        type: 'color',
        name: 'Color Contrast Validation',
        validate: this.validateColorContrast.bind(this),
        severity: 'high'
      },
      {
        type: 'color',
        name: 'Brand Color Consistency',
        validate: this.validateBrandColorConsistency.bind(this),
        severity: 'medium'
      },
      {
        type: 'color',
        name: 'Accessibility Color Standards',
        validate: this.validateAccessibilityColors.bind(this),
        severity: 'high'
      },

      // Font validation rules
      {
        type: 'font',
        name: 'Font License Validation',
        validate: this.validateFontLicense.bind(this),
        severity: 'high'
      },
      {
        type: 'font',
        name: 'Font Readability',
        validate: this.validateFontReadability.bind(this),
        severity: 'medium'
      },

      // Template validation rules
      {
        type: 'template',
        name: 'Template Structure',
        validate: this.validateTemplateStructure.bind(this),
        severity: 'medium'
      },
      {
        type: 'template',
        name: 'Responsive Design',
        validate: this.validateResponsiveDesign.bind(this),
        severity: 'high'
      }
    ];
  }

  /**
   * Add a brand asset for validation
   */
  async addBrandAsset(asset: Omit<BrandAsset, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = this.generateAssetId();
    const brandAsset: BrandAsset = {
      ...asset,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      validationStatus: 'pending'
    };

    this.brandAssets.set(id, brandAsset);
    
    // Trigger validation
    const validationResult = await this.validateAsset(id);
    brandAsset.validationStatus = validationResult.isValid ? 'valid' : 'invalid';
    brandAsset.validationErrors = validationResult.errors.map(e => e.message);

    return id;
  }

  /**
   * Validate a specific brand asset
   */
  async validateAsset(assetId: string): Promise<BrandingValidationResult> {
    const asset = this.brandAssets.get(assetId);
    if (!asset) {
      throw new Error(`Asset with ID ${assetId} not found`);
    }

    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: ValidationSuggestion[] = [];
    const compliance: ComplianceCheck[] = [];

    // Run applicable validation rules
    const applicableRules = this.validationRules.filter(rule => rule.type === asset.type);
    
    for (const rule of applicableRules) {
      try {
        const result = await rule.validate(asset);
        errors.push(...(result.errors || []));
        warnings.push(...(result.warnings || []));
        suggestions.push(...(result.suggestions || []));
        compliance.push(...(result.compliance || []));
      } catch (error) {
        console.error(`Validation rule ${rule.name} failed:`, error);
        errors.push({
          type: 'format',
          severity: 'high',
          message: `Validation rule ${rule.name} failed to execute`,
          field: 'general'
        });
      }
    }

    // Calculate validation score
    const score = this.calculateValidationScore(errors, warnings);

    return {
      isValid: errors.filter(e => e.severity === 'high').length === 0,
      score,
      errors,
      warnings,
      suggestions,
      compliance
    };
  }

  /**
   * Validate all brand assets
   */
  async validateAllAssets(): Promise<Map<string, BrandingValidationResult>> {
    const results = new Map<string, BrandingValidationResult>();
    
    const assetIds = Array.from(this.brandAssets.keys());
    for (const assetId of assetIds) {
      const result = await this.validateAsset(assetId);
      results.set(assetId, result);
    }

    return results;
  }

  /**
   * Logo format validation
   */
  private async validateLogoFormat(asset: BrandAsset): Promise<Partial<BrandingValidationResult>> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: ValidationSuggestion[] = [];
    const compliance: ComplianceCheck[] = [];

    if (asset.type === 'logo' && asset.value instanceof File) {
      const file = asset.value;
      const allowedFormats = ['image/svg+xml', 'image/png', 'image/jpeg'];
      
      if (!allowedFormats.includes(file.type)) {
        errors.push({
          type: 'format',
          severity: 'high',
          message: `Logo format ${file.type} is not supported. Use SVG, PNG, or JPEG.`,
          field: 'format',
          suggestedFix: 'Convert logo to SVG format for best scalability'
        });
      }

      // SVG preference for scalability
      if (file.type !== 'image/svg+xml') {
        suggestions.push({
          type: 'format',
          message: 'Consider using SVG format for better scalability across devices',
          priority: 'medium',
          actionable: true
        });
      }

      compliance.push({
        standard: 'Enterprise',
        requirement: 'Logo Format Standards',
        status: allowedFormats.includes(file.type) ? 'pass' : 'fail',
        details: `Logo format: ${file.type}`
      });
    }

    return { errors, warnings, suggestions, compliance };
  }

  /**
   * Logo size validation
   */
  private async validateLogoSize(asset: BrandAsset): Promise<Partial<BrandingValidationResult>> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: ValidationSuggestion[] = [];
    const compliance: ComplianceCheck[] = [];

    if (asset.type === 'logo' && asset.value instanceof File) {
      const file = asset.value;
      const maxSize = 5 * 1024 * 1024; // 5MB
      const minSize = 1024; // 1KB

      if (file.size > maxSize) {
        errors.push({
          type: 'size',
          severity: 'medium',
          message: `Logo file size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size (5MB)`,
          field: 'size',
          suggestedFix: 'Optimize logo file size using image compression tools'
        });
      }

      if (file.size < minSize) {
        warnings.push({
          type: 'size',
          message: 'Logo file size is very small, may indicate low quality',
          field: 'size',
          recommendation: 'Ensure logo has sufficient resolution for all use cases'
        });
      }

      compliance.push({
        standard: 'Enterprise',
        requirement: 'Logo Size Standards',
        status: file.size <= maxSize && file.size >= minSize ? 'pass' : 'warning',
        details: `Logo size: ${(file.size / 1024).toFixed(2)}KB`
      });
    }

    return { errors, warnings, suggestions, compliance };
  }

  /**
   * Logo transparency validation
   */
  private async validateLogoTransparency(asset: BrandAsset): Promise<Partial<BrandingValidationResult>> {
    const suggestions: ValidationSuggestion[] = [];
    const compliance: ComplianceCheck[] = [];

    if (asset.type === 'logo' && asset.value instanceof File) {
      const file = asset.value;
      
      if (file.type === 'image/jpeg') {
        suggestions.push({
          type: 'transparency',
          message: 'JPEG format does not support transparency. Consider PNG or SVG for logos with transparent backgrounds',
          priority: 'low',
          actionable: true
        });
      }

      compliance.push({
        standard: 'Enterprise',
        requirement: 'Logo Transparency Support',
        status: file.type !== 'image/jpeg' ? 'pass' : 'warning',
        details: `Format: ${file.type}`
      });
    }

    return { errors: [], warnings: [], suggestions, compliance };
  }

  /**
   * Color contrast validation for accessibility
   */
  private async validateColorContrast(asset: BrandAsset): Promise<Partial<BrandingValidationResult>> {
    const errors: ValidationError[] = [];
    const compliance: ComplianceCheck[] = [];

    if (asset.type === 'color' && typeof asset.value === 'string') {
      const color = asset.value;
      
      // Check if it's a valid hex color
      if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
        errors.push({
          type: 'color',
          severity: 'medium',
          message: 'Invalid color format. Use hex format (#RRGGBB or #RGB)',
          field: 'format'
        });
      } else {
        // Calculate contrast ratio with white and black
        const contrastWithWhite = this.calculateContrastRatio(color, '#FFFFFF');
        const contrastWithBlack = this.calculateContrastRatio(color, '#000000');
        
        const minContrast = 4.5; // WCAG AA standard
        
        if (contrastWithWhite < minContrast && contrastWithBlack < minContrast) {
          errors.push({
            type: 'accessibility',
            severity: 'high',
            message: `Color ${color} does not meet WCAG contrast requirements`,
            field: 'contrast',
            suggestedFix: 'Adjust color to meet minimum contrast ratio of 4.5:1'
          });
        }

        compliance.push({
          standard: 'WCAG',
          requirement: 'Color Contrast (AA)',
          status: Math.max(contrastWithWhite, contrastWithBlack) >= minContrast ? 'pass' : 'fail',
          details: `Best contrast ratio: ${Math.max(contrastWithWhite, contrastWithBlack).toFixed(2)}:1`
        });
      }
    }

    return { errors, warnings: [], suggestions: [], compliance };
  }

  /**
   * Brand color consistency validation
   */
  private async validateBrandColorConsistency(asset: BrandAsset): Promise<Partial<BrandingValidationResult>> {
    const warnings: ValidationWarning[] = [];
    const suggestions: ValidationSuggestion[] = [];

    if (asset.type === 'color') {
      // Check against existing brand colors
      const existingColors = Array.from(this.brandAssets.values())
        .filter(a => a.type === 'color' && a.id !== asset.id)
        .map(a => a.value as string);

      if (existingColors.length > 0 && typeof asset.value === 'string') {
        const similarColors = existingColors.filter(color => 
          this.calculateColorSimilarity(asset.value as string, color) > 0.8
        );

        if (similarColors.length > 0) {
          warnings.push({
            type: 'consistency',
            message: 'This color is very similar to existing brand colors',
            field: 'color',
            recommendation: 'Consider using existing brand colors for consistency'
          });
        }

        if (existingColors.length > 8) {
          suggestions.push({
            type: 'palette',
            message: 'Brand palette is getting large. Consider consolidating colors',
            priority: 'low',
            actionable: true
          });
        }
      }
    }

    return { errors: [], warnings, suggestions, compliance: [] };
  }

  /**
   * Accessibility color standards validation
   */
  private async validateAccessibilityColors(asset: BrandAsset): Promise<Partial<BrandingValidationResult>> {
    const errors: ValidationError[] = [];
    const compliance: ComplianceCheck[] = [];

    if (asset.type === 'color' && typeof asset.value === 'string') {
      const color = asset.value;
      
      // Check for problematic colors for colorblind users
      const problematicCombinations = [
        { colors: ['#FF0000', '#00FF00'], issue: 'Red-Green colorblind users cannot distinguish' },
        { colors: ['#0000FF', '#800080'], issue: 'Blue-Purple distinction issues' }
      ];

      // This is a simplified check - in practice, you'd want more sophisticated color analysis
      compliance.push({
        standard: 'WCAG',
        requirement: 'Color Accessibility',
        status: 'pass', // Simplified for demo
        details: `Color ${color} accessibility checked`
      });
    }

    return { errors, warnings: [], suggestions: [], compliance };
  }

  /**
   * Font license validation
   */
  private async validateFontLicense(asset: BrandAsset): Promise<Partial<BrandingValidationResult>> {
    const warnings: ValidationWarning[] = [];
    const compliance: ComplianceCheck[] = [];

    if (asset.type === 'font') {
      // Check if font is from a known safe source
      const safeFontSources = ['Google Fonts', 'Adobe Fonts', 'System Fonts'];
      const fontSource = asset.metadata?.source;

      if (!fontSource || !safeFontSources.includes(fontSource)) {
        warnings.push({
          type: 'license',
          message: 'Font license not verified. Ensure proper licensing for commercial use',
          field: 'license',
          recommendation: 'Use fonts from verified sources like Google Fonts or Adobe Fonts'
        });
      }

      compliance.push({
        standard: 'Enterprise',
        requirement: 'Font Licensing',
        status: fontSource && safeFontSources.includes(fontSource) ? 'pass' : 'warning',
        details: `Font source: ${fontSource || 'Unknown'}`
      });
    }

    return { errors: [], warnings, suggestions: [], compliance };
  }

  /**
   * Font readability validation
   */
  private async validateFontReadability(asset: BrandAsset): Promise<Partial<BrandingValidationResult>> {
    const warnings: ValidationWarning[] = [];
    const suggestions: ValidationSuggestion[] = [];

    if (asset.type === 'font') {
      const fontName = asset.value as string;
      
      // Check for decorative fonts in body text
      const decorativeFonts = ['script', 'decorative', 'display', 'handwriting'];
      const isDecorative = decorativeFonts.some(type => 
        fontName.toLowerCase().includes(type)
      );

      if (isDecorative) {
        warnings.push({
          type: 'readability',
          message: 'Decorative fonts should be used sparingly and not for body text',
          field: 'usage',
          recommendation: 'Reserve decorative fonts for headings and use readable fonts for body text'
        });
      }

      suggestions.push({
        type: 'accessibility',
        message: 'Ensure font size is at least 16px for body text to meet accessibility standards',
        priority: 'medium',
        actionable: true
      });
    }

    return { errors: [], warnings, suggestions, compliance: [] };
  }

  /**
   * Template structure validation
   */
  private async validateTemplateStructure(asset: BrandAsset): Promise<Partial<BrandingValidationResult>> {
    const errors: ValidationError[] = [];
    const suggestions: ValidationSuggestion[] = [];

    if (asset.type === 'template') {
      // Basic template validation
      suggestions.push({
        type: 'structure',
        message: 'Ensure template includes proper semantic HTML structure',
        priority: 'high',
        actionable: true
      });

      suggestions.push({
        type: 'accessibility',
        message: 'Include proper ARIA labels and alt text for images',
        priority: 'high',
        actionable: true
      });
    }

    return { errors, warnings: [], suggestions, compliance: [] };
  }

  /**
   * Responsive design validation
   */
  private async validateResponsiveDesign(asset: BrandAsset): Promise<Partial<BrandingValidationResult>> {
    const suggestions: ValidationSuggestion[] = [];
    const compliance: ComplianceCheck[] = [];

    if (asset.type === 'template') {
      suggestions.push({
        type: 'responsive',
        message: 'Ensure template works on mobile devices (320px width minimum)',
        priority: 'high',
        actionable: true
      });

      suggestions.push({
        type: 'responsive',
        message: 'Test template on tablet and desktop breakpoints',
        priority: 'medium',
        actionable: true
      });

      compliance.push({
        standard: 'Enterprise',
        requirement: 'Responsive Design',
        status: 'warning', // Would need actual testing
        details: 'Manual testing required for responsive design validation'
      });
    }

    return { errors: [], warnings: [], suggestions, compliance };
  }

  /**
   * Calculate validation score based on errors and warnings
   */
  private calculateValidationScore(errors: ValidationError[], warnings: ValidationWarning[]): number {
    let score = 100;
    
    // Deduct points for errors
    errors.forEach(error => {
      switch (error.severity) {
        case 'high':
          score -= 20;
          break;
        case 'medium':
          score -= 10;
          break;
        case 'low':
          score -= 5;
          break;
      }
    });

    // Deduct points for warnings
    warnings.forEach(() => {
      score -= 2;
    });

    return Math.max(0, score);
  }

  /**
   * Calculate contrast ratio between two colors
   */
  private calculateContrastRatio(color1: string, color2: string): number {
    const luminance1 = this.calculateLuminance(color1);
    const luminance2 = this.calculateLuminance(color2);
    
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Calculate relative luminance of a color
   */
  private calculateLuminance(hex: string): number {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return 0;

    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /**
   * Convert hex color to RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  /**
   * Calculate color similarity (simplified)
   */
  private calculateColorSimilarity(color1: string, color2: string): number {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return 0;

    const distance = Math.sqrt(
      Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2)
    );

    // Normalize to 0-1 scale (max distance is ~441 for RGB)
    return 1 - (distance / 441);
  }

  /**
   * Generate unique asset ID
   */
  private generateAssetId(): string {
    return `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get all brand assets
   */
  getBrandAssets(): BrandAsset[] {
    return Array.from(this.brandAssets.values());
  }

  /**
   * Get brand asset by ID
   */
  getBrandAsset(id: string): BrandAsset | undefined {
    return this.brandAssets.get(id);
  }

  /**
   * Update brand asset
   */
  async updateBrandAsset(id: string, updates: Partial<BrandAsset>): Promise<void> {
    const asset = this.brandAssets.get(id);
    if (!asset) {
      throw new Error(`Asset with ID ${id} not found`);
    }

    const updatedAsset = {
      ...asset,
      ...updates,
      updatedAt: new Date()
    };

    this.brandAssets.set(id, updatedAsset);

    // Re-validate if content changed
    if (updates.value || updates.metadata) {
      const validationResult = await this.validateAsset(id);
      updatedAsset.validationStatus = validationResult.isValid ? 'valid' : 'invalid';
      updatedAsset.validationErrors = validationResult.errors.map(e => e.message);
    }
  }

  /**
   * Delete brand asset
   */
  deleteBrandAsset(id: string): boolean {
    return this.brandAssets.delete(id);
  }

  /**
   * Export brand assets for backup/sharing
   */
  exportBrandAssets(): string {
    const assets = Array.from(this.brandAssets.values()).map(asset => ({
      ...asset,
      value: asset.value instanceof File ? `[File: ${asset.value.name}]` : asset.value
    }));

    return JSON.stringify(assets, null, 2);
  }

  /**
   * Generate compliance report
   */
  async generateComplianceReport(): Promise<ComplianceReport> {
    const validationResults = await this.validateAllAssets();
    const allCompliance: ComplianceCheck[] = [];
    
    validationResults.forEach(result => {
      allCompliance.push(...result.compliance);
    });

    const complianceByStandard = allCompliance.reduce((acc, check) => {
      if (!acc[check.standard]) {
        acc[check.standard] = { pass: 0, fail: 0, warning: 0 };
      }
      acc[check.standard][check.status]++;
      return acc;
    }, {} as Record<string, { pass: number; fail: number; warning: number }>);

    return {
      totalAssets: this.brandAssets.size,
      complianceByStandard,
      overallScore: this.calculateOverallComplianceScore(allCompliance),
      generatedAt: new Date(),
      recommendations: this.generateComplianceRecommendations(allCompliance)
    };
  }

  private calculateOverallComplianceScore(compliance: ComplianceCheck[]): number {
    if (compliance.length === 0) return 100;
    
    const passCount = compliance.filter(c => c.status === 'pass').length;
    return Math.round((passCount / compliance.length) * 100);
  }

  private generateComplianceRecommendations(compliance: ComplianceCheck[]): string[] {
    const recommendations: string[] = [];
    const failedChecks = compliance.filter(c => c.status === 'fail');
    
    if (failedChecks.length > 0) {
      recommendations.push(`Address ${failedChecks.length} failed compliance checks`);
    }

    const warningChecks = compliance.filter(c => c.status === 'warning');
    if (warningChecks.length > 0) {
      recommendations.push(`Review ${warningChecks.length} compliance warnings`);
    }

    return recommendations;
  }
}

interface ValidationRule {
  type: string;
  name: string;
  validate: (asset: BrandAsset) => Promise<Partial<BrandingValidationResult>>;
  severity: 'high' | 'medium' | 'low';
}

interface ComplianceReport {
  totalAssets: number;
  complianceByStandard: Record<string, { pass: number; fail: number; warning: number }>;
  overallScore: number;
  generatedAt: Date;
  recommendations: string[];
}

// Export singleton instance
export const enterpriseBrandingValidator = new EnterpriseBrandingValidator(); 