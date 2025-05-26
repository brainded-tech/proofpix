# ProofPix Testing Guide

## 🧪 Testing Overview

This guide covers comprehensive testing strategies for ProofPix, ensuring privacy compliance, functionality, and performance across all features.

## 🎯 Testing Philosophy

### **Privacy-First Testing**
- Verify no data leaves the browser
- Test metadata extraction accuracy
- Validate privacy risk assessments
- Ensure secure data handling

### **User Experience Testing**
- Cross-browser compatibility
- Mobile responsiveness
- Accessibility compliance
- Performance optimization

### **Reliability Testing**
- Error handling and recovery
- Edge cases and boundary conditions
- Memory management
- File format compatibility

## 🏗️ Testing Architecture

### **Testing Stack**
```
Testing Framework
├── Jest (Unit & Integration)
├── React Testing Library (Component)
├── Cypress (E2E)
├── Lighthouse (Performance)
└── axe-core (Accessibility)
```

### **Test Structure**
```
tests/
├── unit/                    # Unit tests
│   ├── utils/              # Utility function tests
│   ├── components/         # Component tests
│   └── hooks/              # Custom hook tests
├── integration/            # Integration tests
│   ├── metadata/           # Metadata extraction
│   ├── export/             # Export functionality
│   └── privacy/            # Privacy compliance
├── e2e/                    # End-to-end tests
│   ├── user-flows/         # Complete user journeys
│   ├── cross-browser/      # Browser compatibility
│   └── mobile/             # Mobile-specific tests
├── performance/            # Performance tests
├── accessibility/          # A11y tests
└── fixtures/               # Test data and mocks
    ├── images/             # Sample images
    ├── metadata/           # Mock metadata
    └── files/              # Test files
```

## 🔧 Unit Testing

### **Utility Function Tests**

#### **metadata.ts Tests**
```typescript
// tests/unit/utils/metadata.test.ts
import { extractMetadata, analyzePrivacyRisks } from '../../../src/utils/metadata';
import { createMockFile, createMockMetadata } from '../../fixtures/mocks';

describe('Metadata Extraction', () => {
  test('extracts EXIF data from JPEG', async () => {
    const jpegFile = createMockFile({ type: 'image/jpeg', hasExif: true });
    const metadata = await extractMetadata(jpegFile);
    
    expect(metadata.exif.camera.make).toBeDefined();
    expect(metadata.exif.settings.iso).toBeGreaterThan(0);
    expect(metadata.file.size).toBe(jpegFile.size);
  });

  test('handles files without metadata gracefully', async () => {
    const cleanFile = createMockFile({ type: 'image/png', hasExif: false });
    const metadata = await extractMetadata(cleanFile);
    
    expect(metadata.exif).toBeNull();
    expect(metadata.file).toBeDefined();
    expect(metadata.privacyAnalysis.overallRisk).toBe('LOW');
  });

  test('analyzes GPS privacy risks correctly', () => {
    const metadataWithGPS = createMockMetadata({
      gps: { latitude: 37.7749, longitude: -122.4194 }
    });
    
    const analysis = analyzePrivacyRisks(metadataWithGPS);
    
    expect(analysis.overallRisk).toBe('HIGH');
    expect(analysis.risks.gps?.level).toBe('HIGH');
    expect(analysis.recommendations).toContain('Remove GPS data');
  });
});
```

#### **imageUtils.ts Tests**
```typescript
// tests/unit/utils/imageUtils.test.ts
import { validateImageFile, createImagePreview, overlayTimestamp } from '../../../src/utils/imageUtils';

describe('Image Utilities', () => {
  test('validates supported image formats', () => {
    const jpegFile = createMockFile({ type: 'image/jpeg' });
    const validation = validateImageFile(jpegFile);
    
    expect(validation.isValid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  test('rejects unsupported formats', () => {
    const gifFile = createMockFile({ type: 'image/gif' });
    const validation = validateImageFile(gifFile);
    
    expect(validation.isValid).toBe(false);
    expect(validation.errors).toContain('Unsupported file format');
  });

  test('enforces file size limits', () => {
    const largeFile = createMockFile({ size: 60 * 1024 * 1024 }); // 60MB
    const validation = validateImageFile(largeFile);
    
    expect(validation.isValid).toBe(false);
    expect(validation.errors).toContain('File too large');
  });

  test('creates image preview with correct dimensions', async () => {
    const imageFile = createMockFile({ type: 'image/jpeg' });
    const previewUrl = await createImagePreview(imageFile, 400);
    
    expect(previewUrl).toMatch(/^data:image/);
    // Additional dimension checks would require canvas mocking
  });
});
```

### **Component Tests**

#### **ProcessingInterface Component**
```typescript
// tests/unit/components/ProcessingInterface.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProcessingInterface } from '../../../src/components/ProcessingInterface';
import { createMockFile } from '../../fixtures/mocks';

describe('ProcessingInterface', () => {
  test('renders file upload area', () => {
    render(<ProcessingInterface />);
    
    expect(screen.getByText(/drag.*drop/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /select files/i })).toBeInTheDocument();
  });

  test('handles file selection', async () => {
    const onMetadataExtracted = jest.fn();
    render(<ProcessingInterface onMetadataExtracted={onMetadataExtracted} />);
    
    const fileInput = screen.getByLabelText(/select files/i);
    const mockFile = createMockFile({ type: 'image/jpeg', hasExif: true });
    
    fireEvent.change(fileInput, { target: { files: [mockFile] } });
    
    await waitFor(() => {
      expect(onMetadataExtracted).toHaveBeenCalledWith(
        expect.objectContaining({
          file: expect.objectContaining({ name: mockFile.name })
        })
      );
    });
  });

  test('displays error for invalid files', async () => {
    render(<ProcessingInterface />);
    
    const fileInput = screen.getByLabelText(/select files/i);
    const invalidFile = createMockFile({ type: 'text/plain' });
    
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });
    
    await waitFor(() => {
      expect(screen.getByText(/unsupported file format/i)).toBeInTheDocument();
    });
  });
});
```

#### **MetadataPanel Component**
```typescript
// tests/unit/components/MetadataPanel.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MetadataPanel } from '../../../src/components/MetadataPanel';
import { createMockMetadata } from '../../fixtures/mocks';

describe('MetadataPanel', () => {
  test('displays camera information', () => {
    const metadata = createMockMetadata({
      exif: {
        camera: { make: 'Apple', model: 'iPhone 13 Pro' }
      }
    });
    
    render(<MetadataPanel metadata={metadata} />);
    
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('iPhone 13 Pro')).toBeInTheDocument();
  });

  test('shows privacy warnings for risky metadata', () => {
    const metadata = createMockMetadata({
      gps: { latitude: 37.7749, longitude: -122.4194 },
      privacyAnalysis: {
        overallRisk: 'HIGH',
        risks: { gps: { level: 'HIGH', reason: 'Exact location' } }
      }
    });
    
    render(<MetadataPanel metadata={metadata} showPrivacyAnalysis />);
    
    expect(screen.getByText(/high privacy risk/i)).toBeInTheDocument();
    expect(screen.getByText(/exact location/i)).toBeInTheDocument();
  });

  test('handles export button clicks', () => {
    const onExport = jest.fn();
    const metadata = createMockMetadata();
    
    render(<MetadataPanel metadata={metadata} onExport={onExport} />);
    
    fireEvent.click(screen.getByRole('button', { name: /export pdf/i }));
    
    expect(onExport).toHaveBeenCalledWith('pdf');
  });
});
```

### **Custom Hook Tests**

#### **useMetadataExtraction Hook**
```typescript
// tests/unit/hooks/useMetadataExtraction.test.ts
import { renderHook, act } from '@testing-library/react';
import { useMetadataExtraction } from '../../../src/hooks/useMetadataExtraction';
import { createMockFile } from '../../fixtures/mocks';

describe('useMetadataExtraction', () => {
  test('extracts metadata from file', async () => {
    const mockFile = createMockFile({ type: 'image/jpeg', hasExif: true });
    const { result } = renderHook(() => useMetadataExtraction(mockFile));
    
    expect(result.current.loading).toBe(true);
    expect(result.current.metadata).toBeNull();
    
    await act(async () => {
      await result.current.extract();
    });
    
    expect(result.current.loading).toBe(false);
    expect(result.current.metadata).toBeDefined();
    expect(result.current.error).toBeNull();
  });

  test('handles extraction errors', async () => {
    const corruptFile = createMockFile({ type: 'image/jpeg', isCorrupt: true });
    const { result } = renderHook(() => useMetadataExtraction(corruptFile));
    
    await act(async () => {
      await result.current.extract();
    });
    
    expect(result.current.loading).toBe(false);
    expect(result.current.metadata).toBeNull();
    expect(result.current.error).toBeDefined();
  });
});
```

## 🔗 Integration Testing

### **Metadata Processing Pipeline**
```typescript
// tests/integration/metadata/processing-pipeline.test.ts
import { extractMetadata, analyzePrivacyRisks, generateMetadataReport } from '../../../src/utils';
import { loadTestImage } from '../../fixtures/images';

describe('Metadata Processing Pipeline', () => {
  test('complete processing workflow', async () => {
    // Load real test image with known metadata
    const testImage = await loadTestImage('sample-with-gps.jpg');
    
    // Extract metadata
    const metadata = await extractMetadata(testImage);
    expect(metadata.exif.camera.make).toBe('Canon');
    expect(metadata.gps).toBeDefined();
    
    // Analyze privacy risks
    const analysis = analyzePrivacyRisks(metadata);
    expect(analysis.overallRisk).toBe('HIGH');
    expect(analysis.risks.gps?.level).toBe('HIGH');
    
    // Generate PDF report
    const pdfBlob = await generateMetadataReport(metadata, {
      template: 'professional',
      includePrivacyAnalysis: true
    });
    
    expect(pdfBlob.type).toBe('application/pdf');
    expect(pdfBlob.size).toBeGreaterThan(0);
  });

  test('handles batch processing', async () => {
    const testImages = await Promise.all([
      loadTestImage('sample-1.jpg'),
      loadTestImage('sample-2.png'),
      loadTestImage('sample-3.heic')
    ]);
    
    const results = await Promise.all(
      testImages.map(extractMetadata)
    );
    
    expect(results).toHaveLength(3);
    results.forEach(metadata => {
      expect(metadata.file).toBeDefined();
      expect(metadata.privacyAnalysis).toBeDefined();
    });
  });
});
```

### **Export Functionality**
```typescript
// tests/integration/export/export-formats.test.ts
import { exportToJSON, exportToCSV, generateMetadataReport } from '../../../src/utils';
import { createMockMetadata } from '../../fixtures/mocks';

describe('Export Functionality', () => {
  test('exports to JSON format', () => {
    const metadata = createMockMetadata();
    const jsonString = exportToJSON(metadata, { pretty: true });
    
    const parsed = JSON.parse(jsonString);
    expect(parsed.exif).toBeDefined();
    expect(parsed.privacyAnalysis).toBeDefined();
  });

  test('exports batch to CSV', () => {
    const metadataArray = [
      createMockMetadata({ exif: { camera: { make: 'Apple' } } }),
      createMockMetadata({ exif: { camera: { make: 'Canon' } } })
    ];
    
    const csvString = exportToCSV(metadataArray);
    const lines = csvString.split('\n');
    
    expect(lines[0]).toContain('Camera Make'); // Header
    expect(lines[1]).toContain('Apple');
    expect(lines[2]).toContain('Canon');
  });

  test('generates PDF with all templates', async () => {
    const metadata = createMockMetadata();
    const templates = ['basic', 'professional', 'detailed'];
    
    for (const template of templates) {
      const pdfBlob = await generateMetadataReport(metadata, { template });
      
      expect(pdfBlob.type).toBe('application/pdf');
      expect(pdfBlob.size).toBeGreaterThan(1000); // Reasonable size
    }
  });
});
```

## 🔒 Privacy Testing

### **Data Isolation Tests**
```typescript
// tests/integration/privacy/data-isolation.test.ts
describe('Privacy Compliance', () => {
  test('no network requests with user data', async () => {
    const networkSpy = jest.spyOn(window, 'fetch');
    const xhrSpy = jest.spyOn(XMLHttpRequest.prototype, 'open');
    
    const testImage = await loadTestImage('sample-with-gps.jpg');
    await extractMetadata(testImage);
    
    // Verify no network calls were made with image data
    expect(networkSpy).not.toHaveBeenCalled();
    expect(xhrSpy).not.toHaveBeenCalled();
    
    networkSpy.mockRestore();
    xhrSpy.mockRestore();
  });

  test('memory cleanup after processing', async () => {
    const initialMemory = performance.memory?.usedJSHeapSize || 0;
    
    const testImage = await loadTestImage('large-sample.jpg');
    const metadata = await extractMetadata(testImage);
    
    // Force garbage collection if available
    if (global.gc) global.gc();
    
    const finalMemory = performance.memory?.usedJSHeapSize || 0;
    const memoryIncrease = finalMemory - initialMemory;
    
    // Memory increase should be reasonable (less than 10MB)
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
  });

  test('sensitive data removal', () => {
    const metadata = createMockMetadata({
      gps: { latitude: 37.7749, longitude: -122.4194 },
      exif: { camera: { make: 'Apple', model: 'iPhone 13 Pro' } }
    });
    
    const cleaned = stripSensitiveMetadata(metadata);
    
    expect(cleaned.gps).toBeUndefined();
    expect(cleaned.exif.camera.make).toBeDefined(); // Non-sensitive data preserved
  });
});
```

### **Privacy Risk Assessment Tests**
```typescript
// tests/integration/privacy/risk-assessment.test.ts
describe('Privacy Risk Assessment', () => {
  test('correctly identifies high-risk metadata', () => {
    const highRiskMetadata = createMockMetadata({
      gps: { latitude: 37.7749, longitude: -122.4194 },
      exif: {
        camera: { make: 'Apple', model: 'iPhone 13 Pro' },
        timestamp: new Date('2024-01-15T14:30:22Z')
      }
    });
    
    const analysis = analyzePrivacyRisks(highRiskMetadata);
    
    expect(analysis.overallRisk).toBe('HIGH');
    expect(analysis.risks.gps?.level).toBe('HIGH');
    expect(analysis.risks.device?.level).toBe('MEDIUM');
    expect(analysis.recommendations).toContain('Remove GPS data');
  });

  test('identifies low-risk clean images', () => {
    const cleanMetadata = createMockMetadata({
      gps: undefined,
      exif: { camera: { make: 'Unknown' } }
    });
    
    const analysis = analyzePrivacyRisks(cleanMetadata);
    
    expect(analysis.overallRisk).toBe('LOW');
    expect(analysis.risks.gps).toBeUndefined();
  });
});
```

## 🌐 End-to-End Testing

### **Complete User Workflows**
```typescript
// tests/e2e/user-flows/metadata-extraction.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Metadata Extraction Workflow', () => {
  test('user can extract and view metadata', async ({ page }) => {
    await page.goto('/');
    
    // Upload image
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('tests/fixtures/images/sample-with-gps.jpg');
    
    // Wait for processing
    await expect(page.locator('[data-testid="metadata-panel"]')).toBeVisible();
    
    // Verify metadata display
    await expect(page.locator('[data-testid="camera-make"]')).toContainText('Canon');
    await expect(page.locator('[data-testid="gps-coordinates"]')).toBeVisible();
    
    // Check privacy warnings
    await expect(page.locator('[data-testid="privacy-warning"]')).toContainText('HIGH');
  });

  test('user can export PDF report', async ({ page }) => {
    await page.goto('/');
    
    // Upload and process image
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('tests/fixtures/images/sample.jpg');
    
    await expect(page.locator('[data-testid="metadata-panel"]')).toBeVisible();
    
    // Start PDF export
    const downloadPromise = page.waitForDownload();
    await page.click('[data-testid="export-pdf-button"]');
    
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.pdf$/);
  });

  test('batch processing workflow', async ({ page }) => {
    await page.goto('/batch');
    
    // Upload multiple files
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles([
      'tests/fixtures/images/sample-1.jpg',
      'tests/fixtures/images/sample-2.png',
      'tests/fixtures/images/sample-3.heic'
    ]);
    
    // Wait for batch processing
    await expect(page.locator('[data-testid="batch-progress"]')).toBeVisible();
    await expect(page.locator('[data-testid="batch-complete"]')).toBeVisible();
    
    // Verify results
    const resultItems = page.locator('[data-testid="batch-result-item"]');
    await expect(resultItems).toHaveCount(3);
  });
});
```

### **Cross-Browser Testing**
```typescript
// tests/e2e/cross-browser/compatibility.spec.ts
import { test, expect, devices } from '@playwright/test';

const browsers = ['chromium', 'firefox', 'webkit'];
const mobileDevices = [devices['iPhone 13'], devices['Pixel 5']];

browsers.forEach(browserName => {
  test.describe(`${browserName} compatibility`, () => {
    test('metadata extraction works', async ({ page }) => {
      await page.goto('/');
      
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles('tests/fixtures/images/sample.jpg');
      
      await expect(page.locator('[data-testid="metadata-panel"]')).toBeVisible();
      await expect(page.locator('[data-testid="camera-info"]')).toBeVisible();
    });
  });
});

mobileDevices.forEach(device => {
  test.describe(`${device.name} mobile testing`, () => {
    test.use({ ...device });
    
    test('mobile interface works', async ({ page }) => {
      await page.goto('/');
      
      // Test mobile-specific interactions
      await expect(page.locator('[data-testid="mobile-upload-button"]')).toBeVisible();
      
      // Test touch interactions
      await page.tap('[data-testid="mobile-upload-button"]');
      await expect(page.locator('input[type="file"]')).toBeVisible();
    });
  });
});
```

## ⚡ Performance Testing

### **Load Time Testing**
```typescript
// tests/performance/load-time.test.ts
import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('page loads within performance budget', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // 3 second budget
  });

  test('large file processing performance', async ({ page }) => {
    await page.goto('/');
    
    const startTime = Date.now();
    
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('tests/fixtures/images/large-sample.jpg'); // 20MB file
    
    await expect(page.locator('[data-testid="metadata-panel"]')).toBeVisible();
    
    const processingTime = Date.now() - startTime;
    expect(processingTime).toBeLessThan(10000); // 10 second budget for large files
  });

  test('memory usage stays within limits', async ({ page }) => {
    await page.goto('/');
    
    // Process multiple files to test memory management
    for (let i = 0; i < 5; i++) {
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles(`tests/fixtures/images/sample-${i}.jpg`);
      await expect(page.locator('[data-testid="metadata-panel"]')).toBeVisible();
      
      // Check memory usage
      const memoryUsage = await page.evaluate(() => {
        return (performance as any).memory?.usedJSHeapSize || 0;
      });
      
      expect(memoryUsage).toBeLessThan(100 * 1024 * 1024); // 100MB limit
    }
  });
});
```

### **Lighthouse Performance Testing**
```typescript
// tests/performance/lighthouse.test.ts
import { playAudit } from 'playwright-lighthouse';
import { test } from '@playwright/test';

test.describe('Lighthouse Audits', () => {
  test('homepage performance audit', async ({ page }) => {
    await page.goto('/');
    
    const audit = await playAudit({
      page,
      thresholds: {
        performance: 90,
        accessibility: 95,
        'best-practices': 90,
        seo: 80
      }
    });
    
    expect(audit.lhr.categories.performance.score).toBeGreaterThan(0.9);
    expect(audit.lhr.categories.accessibility.score).toBeGreaterThan(0.95);
  });

  test('processing page performance', async ({ page }) => {
    await page.goto('/');
    
    // Upload file to trigger processing interface
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('tests/fixtures/images/sample.jpg');
    
    const audit = await playAudit({
      page,
      thresholds: {
        performance: 85, // Slightly lower due to processing
        accessibility: 95
      }
    });
    
    expect(audit.lhr.categories.performance.score).toBeGreaterThan(0.85);
  });
});
```

## ♿ Accessibility Testing

### **Automated A11y Testing**
```typescript
// tests/accessibility/a11y.test.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('homepage accessibility', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('processing interface accessibility', async ({ page }) => {
    await page.goto('/');
    
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('tests/fixtures/images/sample.jpg');
    
    await expect(page.locator('[data-testid="metadata-panel"]')).toBeVisible();
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
    
    // Test file upload via keyboard
    await page.keyboard.press('Enter');
    await expect(page.locator('input[type="file"]')).toBeFocused();
  });

  test('screen reader compatibility', async ({ page }) => {
    await page.goto('/');
    
    // Check for proper ARIA labels
    await expect(page.locator('[aria-label="Upload image file"]')).toBeVisible();
    await expect(page.locator('[role="main"]')).toBeVisible();
    
    // Check heading hierarchy
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    await expect(h1).toContainText('ProofPix');
  });
});
```

## 🧪 Test Data Management

### **Mock Data Factory**
```typescript
// tests/fixtures/mocks.ts
export const createMockFile = (options: {
  type?: string;
  size?: number;
  name?: string;
  hasExif?: boolean;
  isCorrupt?: boolean;
} = {}): File => {
  const {
    type = 'image/jpeg',
    size = 1024 * 1024, // 1MB
    name = 'test-image.jpg',
    hasExif = true,
    isCorrupt = false
  } = options;

  // Create mock file with appropriate metadata
  const mockFile = new File(['mock-content'], name, { type });
  
  // Add custom properties for testing
  Object.defineProperty(mockFile, 'size', { value: size });
  Object.defineProperty(mockFile, '_hasExif', { value: hasExif });
  Object.defineProperty(mockFile, '_isCorrupt', { value: isCorrupt });
  
  return mockFile;
};

export const createMockMetadata = (overrides: Partial<ImageMetadata> = {}): ImageMetadata => {
  return {
    exif: {
      camera: {
        make: 'Apple',
        model: 'iPhone 13 Pro',
        lens: 'iPhone 13 Pro back triple camera',
        software: 'iOS 15.0'
      },
      settings: {
        iso: 100,
        aperture: 1.5,
        shutterSpeed: '1/120',
        focalLength: 26,
        flash: { fired: false, mode: 'auto' },
        whiteBalance: 'auto',
        exposureMode: 'auto'
      },
      timestamp: new Date('2024-01-15T14:30:22Z')
    },
    file: {
      name: 'test-image.jpg',
      size: 1024 * 1024,
      type: 'image/jpeg',
      lastModified: new Date()
    },
    privacyAnalysis: {
      overallRisk: 'MEDIUM',
      risks: {},
      recommendations: []
    },
    ...overrides
  };
};
```

### **Test Image Fixtures**
```typescript
// tests/fixtures/images.ts
export const loadTestImage = async (filename: string): Promise<File> => {
  const response = await fetch(`/tests/fixtures/images/${filename}`);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
};

export const TEST_IMAGES = {
  'sample-with-gps.jpg': 'JPEG with GPS coordinates',
  'sample-clean.png': 'PNG without metadata',
  'sample-large.jpg': 'Large JPEG (20MB)',
  'sample-heic.heic': 'HEIC format from iOS',
  'sample-corrupt.jpg': 'Corrupted JPEG file'
};
```

## 🚀 Running Tests

### **Test Scripts**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:performance": "playwright test tests/performance",
    "test:a11y": "playwright test tests/accessibility",
    "test:all": "npm run test && npm run test:e2e"
  }
}
```

### **CI/CD Pipeline Testing**
```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install
      - run: npm run test:e2e

  performance-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install
      - run: npm run test:performance
```

## 📊 Test Coverage Goals

### **Coverage Targets**
- **Unit Tests**: 90%+ code coverage
- **Integration Tests**: 80%+ feature coverage
- **E2E Tests**: 100% critical user flows
- **Performance Tests**: All major features
- **Accessibility Tests**: WCAG 2.1 AA compliance

### **Quality Gates**
- All tests must pass before deployment
- Performance budgets must be met
- No accessibility violations
- Privacy compliance verified
- Cross-browser compatibility confirmed

---

*This testing guide is maintained by the Technical Analysis Lead and updated with each release. For specific test implementation details, see the API Reference Documentation.* 