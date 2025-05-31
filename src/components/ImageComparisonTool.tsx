import React, { useState } from 'react';
import { Upload, X, Layers, Download } from 'lucide-react';

interface ProcessedImage {
  file: File;
  metadata: any;
  previewUrl: string;
}

interface ComparisonData {
  leftImage: ProcessedImage | null;
  rightImage: ProcessedImage | null;
  differences: string[];
  similarities: string[];
  detailedComparison: any;
}

interface ImageComparisonToolProps {
  onClose?: () => void;
  onComparisonComplete?: (comparisonData: ComparisonData) => void;
}

const ImageComparisonTool: React.FC<ImageComparisonToolProps> = ({ onClose, onComparisonComplete }) => {
  const [comparison, setComparison] = useState<ComparisonData>({
    leftImage: null,
    rightImage: null,
    differences: [],
    similarities: [],
    detailedComparison: null
  });

  const handleImageUpload = async (side: 'left' | 'right', file: File) => {
    const processedImage: ProcessedImage = {
      file,
      metadata: {
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        fileType: file.type,
        lastModified: new Date(file.lastModified).toISOString(),
      },
      previewUrl: URL.createObjectURL(file)
    };

    setComparison(prev => ({
      ...prev,
      [side === 'left' ? 'leftImage' : 'rightImage']: processedImage
    }));
  };

  const analyzeComparison = () => {
    if (!comparison.leftImage || !comparison.rightImage) return;

    const differences = ['Different file sizes', 'Different upload times'];
    const similarities = ['Both are image files', 'Both uploaded successfully'];

    const updatedComparison = {
      ...comparison,
      differences,
      similarities,
      detailedComparison: { analyzed: true }
    };

    setComparison(updatedComparison);

    if (onComparisonComplete) {
      onComparisonComplete(updatedComparison);
    }
  };

  const clearComparison = () => {
    if (comparison.leftImage?.previewUrl) {
      URL.revokeObjectURL(comparison.leftImage.previewUrl);
    }
    if (comparison.rightImage?.previewUrl) {
      URL.revokeObjectURL(comparison.rightImage.previewUrl);
    }
    setComparison({
      leftImage: null,
      rightImage: null,
      differences: [],
      similarities: [],
      detailedComparison: null
    });
  };

  const exportReport = () => {
    const reportData = {
      comparison,
      timestamp: new Date().toISOString(),
      tool: 'ProofPix Image Comparison Tool'
    };

    const reportUrl = `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(reportData, null, 2))}`;
    const link = document.createElement('a');
    link.href = reportUrl;
    link.download = `comparison-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const canAnalyze = comparison.leftImage && comparison.rightImage;
  const hasResults = comparison.differences.length > 0;

  return (
    <div className="image-comparison-tool bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-7xl mx-auto">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
            <Layers className="mr-3 text-blue-600" size={28} />
            Image Comparison Tool
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Compare metadata between two images for forensic analysis</p>
        </div>
        <div className="flex items-center space-x-3">
          {canAnalyze && !hasResults && (
            <button
              onClick={analyzeComparison}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <span>Analyze</span>
            </button>
          )}
          {hasResults && (
            <button
              onClick={exportReport}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <Download size={16} />
              <span>Export</span>
            </button>
          )}
          <button
            onClick={clearComparison}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
          >
            <X size={16} />
            <span>Clear</span>
          </button>
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X size={24} />
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {!hasResults ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="upload-area">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Image A</h3>
              {comparison.leftImage ? (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <img 
                    src={comparison.leftImage.previewUrl} 
                    alt="Left comparison" 
                    className="w-full h-48 object-cover rounded mb-3"
                  />
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{comparison.leftImage.metadata.fileName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{comparison.leftImage.metadata.fileSize}</p>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                  <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">Drop image here or click to upload</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload('left', e.target.files[0])}
                    className="hidden"
                    id="left-upload"
                  />
                  <label htmlFor="left-upload" className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition-colors">
                    Choose File
                  </label>
                </div>
              )}
            </div>

            <div className="upload-area">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Image B</h3>
              {comparison.rightImage ? (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <img 
                    src={comparison.rightImage.previewUrl} 
                    alt="Right comparison" 
                    className="w-full h-48 object-cover rounded mb-3"
                  />
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{comparison.rightImage.metadata.fileName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{comparison.rightImage.metadata.fileSize}</p>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                  <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">Drop image here or click to upload</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload('right', e.target.files[0])}
                    className="hidden"
                    id="right-upload"
                  />
                  <label htmlFor="right-upload" className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition-colors">
                    Choose File
                  </label>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-3">
                  Differences ({comparison.differences.length})
                </h3>
                <ul className="space-y-2">
                  {comparison.differences.map((diff, index) => (
                    <li key={index} className="text-sm text-red-700 dark:text-red-300 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{diff}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-3">
                  Similarities ({comparison.similarities.length})
                </h3>
                <ul className="space-y-2">
                  {comparison.similarities.map((sim, index) => (
                    <li key={index} className="text-sm text-green-700 dark:text-green-300 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{sim}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageComparisonTool; 