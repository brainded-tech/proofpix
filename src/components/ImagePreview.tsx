import React from 'react';
import { Download, FileDown, FileJson, Clock, Image, Settings } from 'lucide-react';
import { ImagePreviewProps, OutputSize, ImageFormat } from '../types';

export const ImagePreview = ({ 
  image, 
  showTimestamp,
  onToggleTimestamp,
  onDownload,
  onExportPDF,
  onExportJSON,
  outputOptions,
  onOutputOptionsChange
}: ImagePreviewProps): JSX.Element => {
  const sizeOptions: { value: OutputSize; label: string }[] = [
    { value: 'original', label: 'Original Size' },
    { value: 'large', label: '2048px' },
    { value: 'medium', label: '1024px' },
    { value: 'small', label: '640px' }
  ];

  const formatOptions: { value: ImageFormat; label: string }[] = [
    { value: 'jpeg', label: 'JPEG' },
    { value: 'png', label: 'PNG' }
  ];

  return (
    <div className="preview-panel bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-white">Image Preview</h2>
      
      <div className="preview-container mb-6">
        <div className="relative bg-gray-700 rounded-lg overflow-hidden">
          <img 
            src={showTimestamp && image.timestampedUrl ? image.timestampedUrl : image.previewUrl} 
            alt={image.file.name}
            className="w-full h-auto max-h-96 object-contain"
          />
        </div>
      </div>

      <div className="preview-actions space-y-4">
        {/* Output Options */}
        <div className="output-options bg-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
            <Settings size={16} className="mr-2" />
            Output Options
          </h3>
          
          <div className="options-grid grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Size selection */}
            <div className="option-item">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                <Image size={14} className="inline mr-1" />
                Size
              </label>
              <select 
                value={outputOptions.size}
                onChange={(e) => onOutputOptionsChange({ size: e.target.value as OutputSize })}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
              >
                {sizeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Format selection */}
            <div className="option-item">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                <Settings size={14} className="inline mr-1" />
                Format
              </label>
              <select 
                value={outputOptions.format}
                onChange={(e) => onOutputOptionsChange({ format: e.target.value as ImageFormat })}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
              >
                {formatOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Quality slider */}
            <div className="option-item md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Quality: {Math.round(outputOptions.quality * 100)}%
              </label>
              <input 
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={outputOptions.quality}
                onChange={(e) => onOutputOptionsChange({ quality: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-600 rounded-lg cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${outputOptions.quality * 100}%, #4b5563 ${outputOptions.quality * 100}%, #4b5563 100%)`
                }}
              />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="action-buttons flex flex-wrap gap-3">
          <button 
            className={`action-button flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              showTimestamp 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
            }`}
            onClick={onToggleTimestamp}
          >
            <Clock size={16} className="mr-2" />
            {showTimestamp ? 'Hide Timestamp' : 'Show Timestamp'}
          </button>
          
          <button 
            className="action-button flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            onClick={onDownload}
          >
            <Download size={16} className="mr-2" />
            Download Image
          </button>
          
          <button 
            className="action-button flex items-center px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            onClick={onExportPDF}
          >
            <FileDown size={16} className="mr-2" />
            Export PDF
          </button>
          
          <button 
            className="action-button flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            onClick={onExportJSON}
          >
            <FileJson size={16} className="mr-2" />
            Export JSON
          </button>
        </div>
      </div>
    </div>
  );
}; 