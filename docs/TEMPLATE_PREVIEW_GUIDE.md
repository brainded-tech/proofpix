# ProofPix Template Preview System

## Overview

The ProofPix Enhanced Export Dialog now features a comprehensive template preview system that provides users with detailed information about each PDF template option, including visual previews, feature lists, use cases, and file size estimates.

## Template Structure

### Enhanced Template Data

Each template now includes:

```javascript
{
  id: 'standard',
  label: 'Standard',
  tagline: 'Complete Professional Report',
  description: 'Everything you need in a clean, organized format',
  detailedFeatures: [
    'Full metadata table with all available EXIF data',
    'High-resolution image thumbnail for reference',
    // ... more features
  ],
  useCase: 'Perfect for photographers, real estate professionals...',
  fileSize: 'Typically 1-2 pages, 200-400KB',
  preview: '/templates/standard-preview.svg'
}
```

### Available Templates

1. **Standard Template**
   - Professional business reports
   - Complete metadata analysis
   - Image thumbnails and GPS data
   - 1-2 pages, 200-400KB

2. **Forensic Template**
   - Legal-grade documentation
   - Chain of custody tracking
   - Hash verification and authenticity scoring
   - 3-5 pages, 400-800KB

3. **Minimal Template**
   - Quick facts summary
   - Essential metadata only
   - Single-page layout
   - Always 1 page, under 150KB

4. **Comparison Template**
   - Side-by-side analysis
   - Difference highlighting
   - Similarity calculations
   - 2-3 pages, 300-600KB

## Preview Image Generation

### SVG-Based Previews

Template previews are generated as SVG files for:
- Scalability across devices
- Small file sizes
- Crisp rendering at any resolution
- Easy maintenance and updates

### Generation Script

Use the provided script to regenerate previews:

```bash
node scripts/generate-template-previews.js
```

This creates:
- `standard-preview.svg`
- `forensic-preview.svg`
- `minimal-preview.svg`
- `comparison-preview.svg`

### Manual Preview Creation

For custom previews:

1. Open `public/templates/generate-previews.html` in a browser
2. Right-click each preview and save as PNG
3. Place files in `public/templates/` directory
4. Update template data to reference new files

## CSS Implementation

### Enhanced Template Cards

The template selector uses a card-based layout with:

```css
.pdf-template-option {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.pdf-template-preview {
  height: 120px;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
}

.pdf-template-content {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}
```

### Responsive Design

Mobile layout switches to horizontal cards:

```css
@media (max-width: 768px) {
  .pdf-template-option {
    flex-direction: row;
  }
  
  .pdf-template-preview {
    height: 80px;
    width: 120px;
    flex-shrink: 0;
  }
}
```

## Feature Toggles

### Expandable Feature Lists

Each template includes a collapsible feature list:

```javascript
<div className="features-toggle" onClick={(e) => {
  e.stopPropagation();
  const featuresContent = e.target.nextSibling;
  featuresContent.style.display = 
    featuresContent.style.display === 'none' ? 'block' : 'none';
}}>
  ▼ View Features
</div>
```

### Mobile Optimization

Feature lists are hidden on mobile to save space:

```css
@media (max-width: 768px) {
  .features-content {
    display: none !important;
  }
}
```

## PDF Generator Integration

### Template Mapping

The enhanced PDF generator maps template IDs:

```javascript
this.templates = {
  professional: this.professionalTemplate,
  standard: this.professionalTemplate, // Alias
  forensic: this.forensicTemplate,
  minimal: this.minimalTemplate,
  detailed: this.detailedTemplate,
  comparison: this.detailedTemplate // Uses detailed for now
};
```

### Default Template

The dialog defaults to 'standard' template:

```javascript
const [pdfTemplate, setPdfTemplate] = useState('standard');
```

## Maintenance

### Adding New Templates

1. Add template data to the array in `EnhancedExportDialog.js`
2. Create preview image using the generation script
3. Implement template logic in `enhancedPdfGenerator.js`
4. Update CSS if needed for new template types

### Updating Previews

1. Modify the preview generation script
2. Run `node scripts/generate-template-previews.js`
3. Commit updated SVG files

### Customizing Descriptions

Update the template data directly in the component:

```javascript
{
  id: 'custom',
  label: 'Custom Template',
  tagline: 'Your Custom Solution',
  description: 'Tailored for specific needs',
  detailedFeatures: ['Feature 1', 'Feature 2'],
  useCase: 'Perfect for...',
  fileSize: 'Estimated size',
  preview: '/templates/custom-preview.svg'
}
```

## Performance Considerations

- SVG previews are lightweight (1-2KB each)
- Images are loaded lazily with error fallbacks
- Feature lists are hidden by default to reduce DOM complexity
- Mobile layout optimizes for touch interaction

## Accessibility

- All images include alt text
- Keyboard navigation supported
- High contrast mode compatible
- Screen reader friendly structure

## Browser Support

- Modern browsers with SVG support
- Fallback placeholder for failed image loads
- Graceful degradation on older browsers 
 