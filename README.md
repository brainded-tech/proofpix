# ProofPix - Privacy-Focused Open Source EXIF Metadata Extraction

## 🔒 Don't Just Send a Photo — Send Proof.

ProofPix is a privacy-focused, open source web application that extracts and displays EXIF metadata from your images. All processing happens locally in your browser, ensuring your photos never leave your device.

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

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Modern web browser

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/proofpix.git
cd proofpix

# Install dependencies
npm install

# Start development server
npm start
```

The application will open at `http://localhost:3001`

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
│   │   └── Sponsorships.tsx # Direct sponsorship system
│   ├── utils/               # Utility functions
│   │   ├── metadata.ts      # EXIF extraction logic
│   │   ├── imageUtils.ts    # Image processing
│   │   ├── pdfUtils.ts      # PDF generation
│   │   ├── errorLogger.ts   # Error tracking
│   │   └── stripe.js        # Payment processing
│   ├── types.ts            # TypeScript interfaces
│   └── ProofPix.tsx        # Main app component
├── public/                  # Static assets
├── netlify/                 # Netlify functions
├── ProofPixPhoenix_DevLogs/ # Development logging
├── server.js               # Backend server (development)
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

## 📖 API Reference

### Core Functions

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
