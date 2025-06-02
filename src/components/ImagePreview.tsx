import React from 'react';
import { Download, Clock, Image, Settings, Sparkles, Eye, Maximize2 } from 'lucide-react';
import { ImagePreviewProps, OutputSize, ImageFormat } from '../types';

export const ImagePreview = ({ 
  image, 
  showTimestamp,
  onToggleTimestamp,
  onDownload,
  onExportPDF,
  onExportJSON,
  onEnhancedExport,
  outputOptions,
  onOutputOptionsChange
}: ImagePreviewProps): JSX.Element => {
  const sizeOptions: { value: OutputSize; label: string; description: string }[] = [
    { value: 'original', label: 'Original Size', description: 'Keep original dimensions' },
    { value: 'large', label: '2048px', description: 'High quality' },
    { value: 'medium', label: '1024px', description: 'Balanced size' },
    { value: 'small', label: '640px', description: 'Compact size' }
  ];

  const formatOptions: { value: ImageFormat; label: string; description: string }[] = [
    { value: 'jpeg', label: 'JPEG', description: 'Smaller file size' },
    { value: 'png', label: 'PNG', description: 'Lossless quality' }
  ];

  const getImageDimensions = () => {
    if (image.metadata?.imageWidth && image.metadata?.imageHeight) {
      return `${image.metadata.imageWidth} × ${image.metadata.imageHeight}`;
    }
    return 'Unknown';
  };

  const getFileSize = () => {
    if (image.file?.size) {
      const sizeInMB = (image.file.size / (1024 * 1024)).toFixed(2);
      return `${sizeInMB} MB`;
    }
    return 'Unknown';
  };

  return (
    <div className="space-y-6">
      {/* Image Preview */}
      <div className="relative group">
        <div className="relative bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-700/50">
          {/* Image Info Overlay */}
          <div className="absolute top-4 left-4 z-10">
            <div className="flex items-center space-x-2">
              <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-slate-600/50">
                <div className="flex items-center space-x-2 text-xs text-slate-300">
                  <Eye size={12} />
                  <span>{getImageDimensions()}</span>
                  <span>•</span>
                  <span>{getFileSize()}</span>
                </div>
              </div>
              {showTimestamp && (
                <div className="bg-blue-500/20 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-blue-500/30">
                  <div className="flex items-center space-x-1 text-xs text-blue-300">
                    <Clock size={12} />
                    <span>Timestamped</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Full Screen Button */}
          <button 
            className="absolute top-4 right-4 z-10 p-2 bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-600/50 text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-200 opacity-0 group-hover:opacity-100"
            title="View full size"
            onClick={() => {
              const imageUrl = showTimestamp && image.timestampedUrl ? image.timestampedUrl : image.previewUrl;
              window.open(imageUrl, '_blank');
            }}
          >
            <Maximize2 size={16} />
          </button>

          {/* Main Image */}
          <div className="p-6">
            <img 
              src={showTimestamp && image.timestampedUrl ? image.timestampedUrl : image.previewUrl} 
              alt={image.file?.name || 'Processed image'}
              className="w-full h-auto max-h-96 object-contain rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Output Configuration */}
      <div className="bg-slate-800/30 rounded-2xl border border-slate-700/30 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Settings size={20} className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-100">Output Configuration</h3>
            <p className="text-sm text-slate-400">Customize your image export settings</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Size Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-300">
              <Image size={16} className="inline mr-2" />
              Output Size
            </label>
            <div className="space-y-2">
              {sizeOptions.map(option => (
                <label key={option.value} className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="size"
                    value={option.value}
                    checked={outputOptions.size === option.value}
                    onChange={(e) => onOutputOptionsChange({ size: e.target.value as OutputSize })}
                    className="w-4 h-4 text-blue-500 bg-slate-700 border-slate-600 focus:ring-blue-500 focus:ring-2"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                      {option.label}
                    </div>
                    <div className="text-xs text-slate-400">
                      {option.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
          
          {/* Format Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-300">
              <Settings size={16} className="inline mr-2" />
              Output Format
            </label>
            <div className="space-y-2">
              {formatOptions.map(option => (
                <label key={option.value} className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="format"
                    value={option.value}
                    checked={outputOptions.format === option.value}
                    onChange={(e) => onOutputOptionsChange({ format: e.target.value as ImageFormat })}
                    className="w-4 h-4 text-blue-500 bg-slate-700 border-slate-600 focus:ring-blue-500 focus:ring-2"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                      {option.label}
                    </div>
                    <div className="text-xs text-slate-400">
                      {option.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Quality Slider */}
        <div className="mt-6 space-y-3">
          <label className="block text-sm font-medium text-slate-300">
            Quality: {Math.round(outputOptions.quality * 100)}%
          </label>
          <div className="relative">
            <input 
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={outputOptions.quality}
              onChange={(e) => onOutputOptionsChange({ quality: parseFloat(e.target.value) })}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div 
              className="absolute top-0 left-0 h-2 bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg pointer-events-none"
              style={{ width: `${outputOptions.quality * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>Lower file size</span>
            <span>Higher quality</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button 
          className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
            showTimestamp 
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25' 
              : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300 border border-slate-600/50'
          }`}
          onClick={onToggleTimestamp}
        >
          <Clock size={18} />
          <span>{showTimestamp ? 'Hide Timestamp' : 'Add Timestamp'}</span>
        </button>
        
        <button 
          className="flex items-center space-x-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-emerald-500/25"
          onClick={onDownload}
        >
          <Download size={18} />
          <span>Download Image</span>
        </button>
        
        {/* Enhanced Export Button - Only show if available */}
        {onEnhancedExport && (
          <button 
            className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-purple-500/25"
            onClick={onEnhancedExport}
          >
            <Sparkles size={18} />
            <span>Enhanced Export</span>
          </button>
        )}
      </div>

      {/* Export Info */}
      <div className="bg-slate-800/20 rounded-xl border border-slate-700/30 p-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-slate-700/50 rounded-lg">
            <Settings size={16} className="text-slate-400" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-slate-200 mb-1">Export Settings</h4>
            <div className="text-xs text-slate-400 space-y-1">
              <div>Format: {outputOptions.format.toUpperCase()}</div>
              <div>Size: {outputOptions.size}</div>
              <div>Quality: {Math.round(outputOptions.quality * 100)}%</div>
              {showTimestamp && <div>Timestamp: Enabled</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 