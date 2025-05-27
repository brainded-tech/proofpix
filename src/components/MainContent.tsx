import React, { useState, useCallback } from 'react';
import { FileUpload } from './FileUpload';
import { UsageIndicator } from './UsageIndicator';
// import { ImagePreview } from './ImagePreview';
import { MetadataPanel } from './MetadataPanel';
import { useExifExtraction } from '../hooks/useExifExtraction';

const MainContent: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [exifData, setExifData] = useState<any>(null);
  const { extractExif, loading, error } = useExifExtraction();

  const handleFileSelect = useCallback(async (file: File) => {
    setSelectedFile(file);
    try {
      const data = await extractExif(file);
      setExifData(data);
    } catch (err) {
      console.error('Error processing file:', err);
    }
  }, [extractExif]);

  return (
    <div className="proofpix-main">
      <header className="header">
        <img src="/proofpixtoplogo.png" alt="ProofPix" className="logo" />
      </header>

      <div className="hero-section">
        <h1>Don't Just Send a Photo — Send Proof. 🔒</h1>
        <p className="subtitle">Extract and view EXIF metadata from your images, locally.</p>
        <p className="privacy-note">All processing happens in your browser. Your photos never leave your device.</p>
      </div>

      <div className="mode-toggle">
        <div className="mode-option">
          <svg viewBox="0 0 24 24" className="mode-icon">
            <path fill="currentColor" d="M4 5h16v14H4V5zm2 2v10h12V7H6z"/>
          </svg>
          Single File
        </div>
        <label className="toggle-switch">
          <input type="checkbox" disabled />
          <span className="toggle-slider"></span>
        </label>
        <div className="mode-option">
          <svg viewBox="0 0 24 24" className="mode-icon">
            <path fill="currentColor" d="M2 4h20v16H2V4zm2 2v12h16V6H4z M6 8h12 M6 12h12 M6 16h12"/>
          </svg>
          Bulk Processing
          <span className="coming-soon">COMING SOON</span>
        </div>
      </div>

      {!selectedFile ? (
        <div className="main-content">
          <div className="usage-section">
            <UsageIndicator
              uploads={0}
              pdfDownloads={0}
              imageDownloads={0}
              dataExports={0}
            />
          </div>
          <div className="upload-section">
            <FileUpload onFileSelect={handleFileSelect} />
          </div>
          
          <section className="features">
            <h2>Why ProofPix</h2>
            <div className="features-divider"></div>
            <div className="features-grid">
              <div className="feature">
                <div className="feature-icon">🔒</div>
                <h3>Built for Privacy</h3>
                <p>All processing happens directly in your browser. Your photos never leave your device.</p>
              </div>
              <div className="feature">
                <div className="feature-icon">⚡️</div>
                <h3>Instant Results</h3>
                <p>Upload, inspect, and export your metadata in seconds — no account or signup needed.</p>
              </div>
              <div className="feature">
                <div className="feature-icon">📦</div>
                <h3>Bulk Processing</h3>
                <p>Process multiple images simultaneously with advanced export options. Available with Premium.</p>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="panels-container">
          {/* Legacy component - not used in new version */}
          <div className="bg-gray-100 p-4 rounded">
            <p>Image preview would go here</p>
            <p>File: {selectedFile?.name}</p>
          </div>
          <MetadataPanel metadata={exifData} originalFile={selectedFile} />
        </div>
      )}

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-info">
            Built with React, Tailwind CSS, and exif-js.
            <br />
            All image processing happens locally. No data leaves your browser.
            <br />
            Development mode - Enhanced logging enabled
          </div>
          <nav className="footer-nav">
            <a href="#">Home</a>
            <a href="#">F.A.Q.</a>
            <a href="#">About</a>
            <a href="#">Privacy</a>
            <a href="#">Contact</a>
            <a href="#">Blog</a>
          </nav>
          <div className="footer-copyright">
            © 2025 ProofPix. Built for gig workers, by gig workers.
            <br />
            Privacy-focused EXIF metadata tool - v1.0.0
          </div>
        </div>
      </footer>
    </div>
  );
};

export { MainContent };
