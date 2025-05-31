# ProofPix - Enterprise-Grade Privacy-Focused EXIF Metadata Extraction

## 🔒 Don't Just Send a Photo — Send Proof.

ProofPix is a privacy-focused, enterprise-grade web application that extracts and displays EXIF metadata from your images. All processing happens locally in your browser, ensuring your photos never leave your device. Now featuring AI-driven enterprise sales, custom branding, and comprehensive compliance documentation.

## ✨ Features

### 🔍 **Complete EXIF Metadata Extraction**
- **Camera Information**: Make, model, lens details
- **Technical Settings**: ISO, aperture, shutter speed, focal length
- **GPS Data**: Location coordinates with map integration
- **Timestamp Data**: Original capture date and time
- **File Information**: Size, format, dimensions

### 🛡️ **Privacy-First Design**
- **100% Local Processing**: No server uploads or cloud storage
- **No Analytics**: Zero tracking or data collection
- **No Registration**: Use immediately without accounts
- **Open Source**: Transparent and auditable code

### 📤 **Advanced Export Options**
- **Professional PDF Reports**: Complete metadata with image embedding
- **JSON Data Export**: Machine-readable metadata format
- **Enhanced Images**: Add timestamp overlays to photos
- **Multiple Formats**: Download in various sizes and formats

### 🎨 **Modern Interface**
- **Dark Theme**: Professional and eye-friendly design
- **Drag & Drop**: Simple file upload interface
- **Responsive Design**: Works on desktop and mobile
- **Real-time Processing**: Instant metadata extraction

### 🏢 **Enterprise Features**
- **AI-Driven Pricing**: Intelligent customer segmentation and instant quotes
- **Custom Branding**: Upload logos, colors, and white-label deployment
- **Interactive Demo**: Full enterprise demo environment at `/enterprise/demo`
- **Compliance Documentation**: SOC2, GDPR, HIPAA templates and guides
- **Team Management**: Multi-user access with role-based permissions
- **API Access**: RESTful API with comprehensive documentation

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Modern web browser

### Installation
```bash
# Clone the repository
git clone https://github.com/brainded-tech/proofpix.git
cd proofpix

# Install dependencies
npm install

# Start development server
npm start
```

The application will open at `http://localhost:3001`

### Enterprise Demo
Visit `/enterprise/demo` to explore the full enterprise feature set including:
- Interactive TechCorp Industries simulation
- Team management interface
- API management dashboard
- Custom branding preview

### Production Build
```bash
# Create optimized production build
npm run build

# Serve the build directory with any static file server
```

## 🛠️ Development

### Project Structure
```
proofpix/
├── src/
│   ├── components/          # React components
│   │   ├── HomePage.tsx     # Landing page
│   │   ├── ProcessingInterface.tsx  # Main processing UI
│   │   ├── ImagePreview.tsx # Image display and controls
│   │   ├── MetadataPanel.tsx # EXIF data display
│   │   ├── PricingPage.tsx  # Subscription plans
│   │   └── Support.tsx      # Support and documentation hub
│   ├── pages/docs/          # User-facing documentation
│   │   ├── GettingStarted.tsx # Getting started guide
│   │   ├── PrivacyGuide.tsx # Privacy best practices
│   │   ├── MetadataGuide.tsx # Metadata explanation
│   │   └── ApiDocs.tsx      # API documentation
│   ├── utils/               # Utility functions
│   │   ├── metadata.ts      # EXIF extraction logic
│   │   ├── imageUtils.ts    # Image processing
│   │   ├── pdfUtils.ts      # PDF generation
│   │   └── analytics.ts     # Privacy-friendly analytics
│   ├── types.ts            # TypeScript interfaces
│   └── ProofPix.tsx        # Main app component
├── docs/                    # Comprehensive documentation suite
│   ├── ENTERPRISE_GUIDE.md  # Enterprise features and workflows
│   ├── PRO_USER_GUIDE.md    # Pro user documentation
│   ├── COMPLIANCE_GUIDE.md  # Regulatory compliance guide
│   ├── INTEGRATION_GUIDE.md # System integration documentation
│   ├── ARCHITECTURE.md      # System architecture
│   ├── API_REFERENCE.md     # Complete API reference
│   ├── TESTING_GUIDE.md     # Testing strategies
│   └── DEPLOYMENT_GUIDE.md  # Deployment documentation
├── public/                  # Static assets
├── netlify/                 # Netlify functions
├── LICENSE                 # MIT License
├── CONTRIBUTING.md         # Contribution guidelines
└── package.json            # Dependencies and scripts
```

### Available Scripts
- `npm start` - Start development server
- `npm run build` - Create production build
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App

### Technology Stack
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **exifr** for EXIF extraction
- **jsPDF** for PDF generation
- **Lucide React** for icons
- **Stripe** for payment processing
- **Netlify Functions** for serverless backend

## 📋 Supported Formats

- **JPEG/JPG** - Full EXIF support including GPS
- **PNG** - Basic metadata support
- **TIFF** - Complete EXIF extraction
- **HEIC/HEIF** - iOS format support
- **File Size Limit**: 50MB maximum

## 🔧 Configuration

### Environment Variables
For development with payment processing:
```bash
# .env file (not included in repository)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
REACT_APP_API_URL=http://localhost:3002
PORT=3001
```

**Note**: The core EXIF extraction functionality runs entirely client-side and requires no environment variables.

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🐛 Error Logging & Development

ProofPix includes a comprehensive error logging system for development:

### Browser Console Commands
```javascript
// View error statistics
errorLogger.getErrorStats()

// Export error logs
errorLogger.downloadErrorLog()

// Clear stored errors
errorLogger.clearLogs()
```

### Development Logs
Check the `ProofPixPhoenix_DevLogs/` directory for:
- **CHANGELOG.md** - Complete version history
- **ERROR_LOG.md** - Error tracking and resolutions
- **README.md** - Logging system documentation

## 🚀 Deployment

### Static Hosting
ProofPix is a static React application that can be deployed to any static hosting service:

- **Netlify**: Drag and drop the `build/` folder
- **Vercel**: Connect your repository
- **GitHub Pages**: Use the `gh-pages` package
- **AWS S3**: Upload build files to S3 bucket
- **Any Web Server**: Serve the `build/` directory

### Build Optimization
```bash
# Create optimized production build
npm run build

# The build folder is ready to deploy
```

## 🔒 Privacy & Security

### Data Processing
- **Client-Side Only**: All EXIF extraction happens in your browser
- **No Network Requests**: Images never leave your device
- **No Cookies**: No tracking or session storage
- **No Analytics**: Zero data collection

### File Handling
- **Memory Processing**: Files processed in browser memory
- **No Temporary Storage**: Files not saved to disk
- **User Control**: Complete control over data export

## 📖 Documentation

### User Documentation
- **[Getting Started Guide](src/pages/docs/GettingStarted.tsx)** - Complete setup and usage guide
- **[Privacy Best Practices](src/pages/docs/PrivacyGuide.tsx)** - Privacy protection guidelines
- **[Metadata Types Explained](src/pages/docs/MetadataGuide.tsx)** - Understanding EXIF data
- **[Pro User Guide](PRO_USER_GUIDE.md)** - Advanced features for Pro subscribers

### Enterprise Documentation
- **[Enterprise Guide](ENTERPRISE_GUIDE.md)** - Complete enterprise features and workflows
- **[API Documentation](src/pages/docs/ApiDocs.tsx)** - Enterprise API reference
- **[Integration Guide](INTEGRATION_GUIDE.md)** - System integration documentation
- **[Compliance Guide](COMPLIANCE_GUIDE.md)** - Regulatory compliance and audit procedures

### Technical Documentation
- **[System Architecture](ARCHITECTURE.md)** - Complete system design and architecture
- **[API Reference](API_REFERENCE.md)** - Comprehensive API documentation
- **[Testing Guide](TESTING_GUIDE.md)** - Testing strategies and procedures
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Deployment and DevOps documentation

### Quick API Reference

#### `extractMetadata(file: File): Promise<ImageMetadata>`
Extracts EXIF metadata from an image file.

#### `overlayTimestamp(imageUrl: string, timestamp: string): Promise<string>`
Adds timestamp overlay to an image.

#### `generatePDF(processedImage: ProcessedImage): Promise<Blob>`
Creates PDF report with image and metadata.

### Type Definitions
See `src/types.ts` for complete TypeScript interface definitions.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

Key principles:
1. Maintain client-side only processing for EXIF extraction
2. Add comprehensive error handling
3. Update documentation and changelog
4. Test on multiple browsers and devices
5. Ensure no user data leaves the device without explicit consent

## 📄 License

This project is open source and available under the MIT License.

## 🛠️ Support

### Common Issues
- **Large Files**: Reduce image size if processing fails
- **Unsupported Format**: Check file format compatibility
- **No Metadata**: Some images may not contain EXIF data
- **Browser Compatibility**: Update to a modern browser

### Development Support
- Check browser console for error messages
- Review error logs using `errorLogger.getErrorStats()`
- Consult the DevLogs directory for troubleshooting

---

**ProofPix** - Extract metadata, preserve privacy, maintain proof. 🔒 # Environment variables updated

# ProofPix Enterprise Analytics Dashboard

A comprehensive analytics system for the ProofPix Enterprise platform, featuring real-time metrics, custom dashboards, and performance monitoring.

## Components

### 1. RealTimeMetricsDashboard

Displays real-time analytics with interactive charts using Chart.js:

- Time-range selection (24h, 7d, 30d, 90d)
- Key metrics cards with trend indicators
- Interactive charts with drill-down capability
- Light/dark theme support

### 2. CustomDashboardBuilder

A drag-and-drop dashboard builder:

- Custom widget creation for various visualization types
- Configurable widget settings
- Dashboard layout customization
- Theme support

### 3. PerformanceTrackingSystem

A system health monitoring dashboard:

- Service status monitoring
- Performance metrics tracking
- Historical data visualization
- Alert thresholds

### 4. Supporting Components

- **SortableWidget**: Draggable widget component
- **WidgetSettings**: Widget configuration panel
- **Tabs**: UI component for tab navigation

## Installation

```bash
# Install dependencies
npm install chart.js@4.4.9 react-chartjs-2@5.3.0 chartjs-adapter-date-fns@3.0.0 date-fns
npm install @dnd-kit/core @dnd-kit/sortable
npm install @radix-ui/react-tabs tailwind-merge clsx
npm install lucide-react
```

## Usage

```jsx
import React from 'react';
import AnalyticsDashboard from './pages/AnalyticsDashboard';

function App() {
  return (
    <div className="App">
      <AnalyticsDashboard />
    </div>
  );
}

export default App;
```

The main dashboard integrates all components and provides tab navigation between:
- Real-Time Metrics
- Custom Dashboards
- System Performance

## Theme Support

The dashboard supports both light and dark themes and adapts to the user's preferences.
