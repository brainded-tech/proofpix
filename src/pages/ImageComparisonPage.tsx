import React, { useState } from 'react';
import { ArrowLeft, Info, Zap, FileText, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ImageComparisonTool from '../components/ImageComparisonTool';

export const ImageComparisonPage: React.FC = () => {
  const navigate = useNavigate();
  const [comparisonData, setComparisonData] = useState<any>(null);

  const handleComparisonComplete = (data: any) => {
    setComparisonData(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Image Comparison Tool</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Compare metadata and visual differences between images</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                Enhanced PDF Reports Integration
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Use this tool to generate comparative data that can be included in your enhanced PDF reports. 
                The side-by-side comparison format in PDF reports requires comparison analysis to be performed first.
              </p>
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-3">
              <Zap className="h-6 w-6 text-yellow-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Real-time Analysis</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Instantly compare EXIF metadata, camera settings, GPS locations, and file properties between two images.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-3">
              <FileText className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Detailed Reports</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Generate comprehensive comparison reports with similarities, differences, and forensic analysis data.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-3">
              <Download className="h-6 w-6 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Export Ready</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Export comparison data for use in enhanced PDF reports, legal documentation, or further analysis.
            </p>
          </div>
        </div>

        {/* Main Tool */}
        <ImageComparisonTool onComparisonComplete={handleComparisonComplete} />

        {/* Usage Instructions */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">How to Use</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">1. Upload Images</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Upload two images you want to compare. The tool supports JPEG, PNG, HEIC, and TIFF formats.
              </p>

              <h4 className="font-medium text-gray-900 dark:text-white mb-2">2. Analyze Comparison</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Click "Analyze" to perform detailed metadata comparison including camera settings, GPS data, and file properties.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">3. Review Results</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Explore visual comparison, metadata analysis, and detailed reports to understand similarities and differences.
              </p>

              <h4 className="font-medium text-gray-900 dark:text-white mb-2">4. Export Data</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Export comparison reports for use in enhanced PDF reports or save the analysis for future reference.
              </p>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Common Use Cases</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">🔍 Forensic Investigation</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Compare evidence photos to determine if they were taken with the same camera or at the same location.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">📋 Insurance Claims</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Verify the authenticity of claim photos by comparing metadata and camera information.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">⚖️ Legal Evidence</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Generate detailed comparison reports for court proceedings and legal documentation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 