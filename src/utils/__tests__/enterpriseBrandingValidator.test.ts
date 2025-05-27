import { 
  EnterpriseBrandingValidator, 
  BrandAsset, 
  BrandingValidationResult 
} from '../enterpriseBrandingValidator';

describe('EnterpriseBrandingValidator', () => {
  let validator: EnterpriseBrandingValidator;

  beforeEach(() => {
    validator = new EnterpriseBrandingValidator();
  });

  describe('Color Validation', () => {
    it('should validate valid hex colors', async () => {
      const assetId = await validator.addBrandAsset({
        type: 'color',
        name: 'Primary Blue',
        value: '#3b82f6',
        metadata: { colorFormat: 'hex' }
      });

      const result = await validator.validateAsset(assetId);
      
      expect(result.isValid).toBe(true);
      expect(result.score).toBeGreaterThan(80);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid hex colors', async () => {
      const assetId = await validator.addBrandAsset({
        type: 'color',
        name: 'Invalid Color',
        value: 'not-a-color',
        metadata: { colorFormat: 'hex' }
      });

      const result = await validator.validateAsset(assetId);
      
      // Check if there are color format errors
      const hasColorError = result.errors.some(error => error.type === 'color');
      expect(hasColorError).toBe(true);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should check color contrast ratios', async () => {
      // Test with a color that has poor contrast
      const assetId = await validator.addBrandAsset({
        type: 'color',
        name: 'Light Gray',
        value: '#f0f0f0',
        metadata: { colorFormat: 'hex' }
      });

      const result = await validator.validateAsset(assetId);
      
      // Light gray should have contrast issues or at least be validated
      const hasContrastCheck = result.compliance.some(check => 
        check.standard === 'WCAG' && check.requirement.includes('Contrast')
      );
      expect(hasContrastCheck).toBe(true);
    });
  });

  describe('Logo Validation', () => {
    it('should validate logo file formats', async () => {
      // Create a mock PNG file
      const mockFile = new File(['mock content'], 'logo.png', { type: 'image/png' });
      
      const assetId = await validator.addBrandAsset({
        type: 'logo',
        name: 'Company Logo',
        value: mockFile,
        metadata: { fileSize: mockFile.size, fileType: mockFile.type }
      });

      const result = await validator.validateAsset(assetId);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject unsupported logo formats', async () => {
      // Create a mock unsupported file
      const mockFile = new File(['mock content'], 'logo.bmp', { type: 'image/bmp' });
      
      const assetId = await validator.addBrandAsset({
        type: 'logo',
        name: 'Unsupported Logo',
        value: mockFile,
        metadata: { fileSize: mockFile.size, fileType: mockFile.type }
      });

      const result = await validator.validateAsset(assetId);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].type).toBe('format');
    });

    it('should validate logo file sizes', async () => {
      // Create a mock large file (6MB)
      const largeContent = new Array(6 * 1024 * 1024).fill('x').join('');
      const mockFile = new File([largeContent], 'large-logo.png', { type: 'image/png' });
      
      const assetId = await validator.addBrandAsset({
        type: 'logo',
        name: 'Large Logo',
        value: mockFile,
        metadata: { fileSize: mockFile.size, fileType: mockFile.type }
      });

      const result = await validator.validateAsset(assetId);
      
      const hasSizeError = result.errors.some(error => 
        error.type === 'size' && error.message.includes('exceeds maximum')
      );
      expect(hasSizeError).toBe(true);
    });
  });

  describe('Font Validation', () => {
    it('should validate font licensing', async () => {
      const assetId = await validator.addBrandAsset({
        type: 'font',
        name: 'Roboto',
        value: 'Roboto',
        metadata: { source: 'Google Fonts' }
      });

      const result = await validator.validateAsset(assetId);
      
      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });

    it('should warn about unknown font sources', async () => {
      const assetId = await validator.addBrandAsset({
        type: 'font',
        name: 'Unknown Font',
        value: 'UnknownFont',
        metadata: { source: 'Unknown Source' }
      });

      const result = await validator.validateAsset(assetId);
      
      const hasLicenseWarning = result.warnings.some(warning => 
        warning.type === 'license'
      );
      expect(hasLicenseWarning).toBe(true);
    });
  });

  describe('Asset Management', () => {
    it('should add and retrieve brand assets', async () => {
      const assetId = await validator.addBrandAsset({
        type: 'color',
        name: 'Test Color',
        value: '#ff0000',
        metadata: { colorFormat: 'hex' }
      });

      const asset = validator.getBrandAsset(assetId);
      expect(asset).toBeDefined();
      expect(asset?.name).toBe('Test Color');
      expect(asset?.value).toBe('#ff0000');
      expect(asset?.type).toBe('color');
    });

    it('should delete brand assets', async () => {
      const assetId = await validator.addBrandAsset({
        type: 'color',
        name: 'Test Color',
        value: '#ff0000',
        metadata: { colorFormat: 'hex' }
      });

      const deleted = validator.deleteBrandAsset(assetId);
      expect(deleted).toBe(true);

      const asset = validator.getBrandAsset(assetId);
      expect(asset).toBeUndefined();
    });

    it('should update brand assets', async () => {
      const assetId = await validator.addBrandAsset({
        type: 'color',
        name: 'Test Color',
        value: '#ff0000',
        metadata: { colorFormat: 'hex' }
      });

      await validator.updateBrandAsset(assetId, {
        name: 'Updated Color',
        value: '#00ff00'
      });

      const asset = validator.getBrandAsset(assetId);
      expect(asset?.name).toBe('Updated Color');
      expect(asset?.value).toBe('#00ff00');
    });
  });

  describe('Validation Scoring', () => {
    it('should calculate validation scores correctly', async () => {
      // Add a valid color
      const validAssetId = await validator.addBrandAsset({
        type: 'color',
        name: 'Valid Color',
        value: '#000000', // Black - good contrast
        metadata: { colorFormat: 'hex' }
      });

      const validResult = await validator.validateAsset(validAssetId);
      expect(validResult.score).toBeGreaterThanOrEqual(80);

      // Add an invalid color
      const invalidAssetId = await validator.addBrandAsset({
        type: 'color',
        name: 'Invalid Color',
        value: 'invalid-color',
        metadata: { colorFormat: 'hex' }
      });

      const invalidResult = await validator.validateAsset(invalidAssetId);
      expect(invalidResult.score).toBeLessThanOrEqual(100);
      expect(invalidResult.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Compliance Reporting', () => {
    it('should generate compliance reports', async () => {
      // Add some assets
      await validator.addBrandAsset({
        type: 'color',
        name: 'Primary Color',
        value: '#3b82f6',
        metadata: { colorFormat: 'hex' }
      });

      await validator.addBrandAsset({
        type: 'font',
        name: 'Primary Font',
        value: 'Roboto',
        metadata: { source: 'Google Fonts' }
      });

      const report = await validator.generateComplianceReport();
      
      expect(report.totalAssets).toBe(2);
      expect(report.overallScore).toBeGreaterThanOrEqual(0);
      expect(report.overallScore).toBeLessThanOrEqual(100);
      expect(report.complianceByStandard).toBeDefined();
      expect(report.generatedAt).toBeInstanceOf(Date);
    });
  });

  describe('Validation Rules', () => {
    it('should provide actionable suggestions', async () => {
      const assetId = await validator.addBrandAsset({
        type: 'logo',
        name: 'JPEG Logo',
        value: new File(['content'], 'logo.jpg', { type: 'image/jpeg' }),
        metadata: {}
      });

      const result = await validator.validateAsset(assetId);
      
      // Should suggest SVG format for better scalability
      const hasSvgSuggestion = result.suggestions.some(suggestion => 
        suggestion.message.includes('SVG')
      );
      expect(hasSvgSuggestion).toBe(true);
    });

    it('should validate multiple assets', async () => {
      // Add multiple assets
      await validator.addBrandAsset({
        type: 'color',
        name: 'Color 1',
        value: '#ff0000',
        metadata: {}
      });

      await validator.addBrandAsset({
        type: 'color',
        name: 'Color 2',
        value: '#00ff00',
        metadata: {}
      });

      const results = await validator.validateAllAssets();
      expect(results.size).toBe(2);
      
      // Check that all results are BrandingValidationResult objects
      results.forEach(result => {
        expect(result).toHaveProperty('isValid');
        expect(result).toHaveProperty('score');
        expect(result).toHaveProperty('errors');
        expect(result).toHaveProperty('warnings');
        expect(result).toHaveProperty('suggestions');
        expect(result).toHaveProperty('compliance');
      });
    });
  });

  describe('Color Contrast Calculations', () => {
    it('should calculate contrast ratios correctly', async () => {
      // Test with black text on white background (should have high contrast)
      const blackAssetId = await validator.addBrandAsset({
        type: 'color',
        name: 'Black',
        value: '#000000',
        metadata: { colorFormat: 'hex' }
      });

      const blackResult = await validator.validateAsset(blackAssetId);
      
      // Black should pass contrast requirements
      const hasContrastPass = blackResult.compliance.some(check => 
        check.standard === 'WCAG' && check.status === 'pass'
      );
      expect(hasContrastPass).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle validation errors gracefully', async () => {
      // Try to validate non-existent asset
      await expect(validator.validateAsset('non-existent-id')).rejects.toThrow();
    });

    it('should handle update errors gracefully', async () => {
      // Try to update non-existent asset
      await expect(validator.updateBrandAsset('non-existent-id', {})).rejects.toThrow();
    });
  });

  describe('Asset Export', () => {
    it('should export brand assets', async () => {
      await validator.addBrandAsset({
        type: 'color',
        name: 'Export Test',
        value: '#123456',
        metadata: { colorFormat: 'hex' }
      });

      const exported = validator.exportBrandAssets();
      expect(typeof exported).toBe('string');
      
      const parsed = JSON.parse(exported);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBe(1);
      expect(parsed[0].name).toBe('Export Test');
    });
  });
}); 