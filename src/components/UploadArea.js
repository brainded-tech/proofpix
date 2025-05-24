// components/UploadArea.js
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { mobileUtils } from '../utils/mobileUtils';

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const isIOSSafari = mobileUtils.isIOS() && isSafari;
const isIOSChrome = mobileUtils.isIOS() && !isSafari;

const UploadArea = ({ onFileSelect, canUpload, remainingUploads }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff']
    },
    disabled: !canUpload,
    multiple: false
  });

  const renderUploadContent = useCallback(() => (
    <div className="upload-content">
      <Upload size={48} className="upload-icon" />
      <p className="drag-text">
        {isDragActive
          ? "Drop your image here..."
          : "Drag & drop your image here"}
      </p>
      <p className="or-text">or</p>
      <button className="browse-button">
        Browse Files
      </button>
      <p className="formats">
        Supported formats: JPG, PNG, GIF, BMP, TIFF
      </p>
      {remainingUploads !== undefined && (
        <p className="formats">{remainingUploads} uploads remaining today</p>
      )}
    </div>
  ), [isDragActive, remainingUploads]);

  return (
    <div 
      {...getRootProps()} 
      className={`upload-area ${isDragActive ? 'active' : ''} ${!canUpload ? 'disabled' : ''}`}
      role="button"
      aria-label="Upload image area. Drag and drop an image here or click to select a file."
      tabIndex={0}
    >
      <input {...getInputProps()} aria-label="File upload input" />
      {renderUploadContent()}
    </div>
  );
};

UploadArea.displayName = 'UploadArea';
export default UploadArea;