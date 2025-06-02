import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  FileText, 
  Crown, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  ExternalLink,
  Copy,
  Mail,
  Share2,
  Printer,
  FileImage,
  BarChart3,
  Lock
} from 'lucide-react';

interface DemoExportProps {
  demoResults: any;
  scenarioName: string;
  industry: string;
  onUpgrade?: () => void;
  onClose?: () => void;
}

interface ExportFormat {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  format: string;
  available: boolean;
  watermarked: boolean;
}

export const DemoExportComponent: React.FC<DemoExportProps> = ({
  demoResults,
  scenarioName,
  industry,
  onUpgrade,
  onClose
}) => {
  const [selectedFormat, setSelectedFormat] = useState<string>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const exportFormats: ExportFormat[] = [
    {
      id: 'pdf',
      name: 'PDF Report',
      description: 'Comprehensive analysis report with charts and insights',
      icon: FileText,
      format: 'PDF',
      available: true,
      watermarked: true
    },
    {
      id: 'json',
      name: 'JSON Data',
      description: 'Raw metadata and analysis results in JSON format',
      icon: FileImage,
      format: 'JSON',
      available: true,
      watermarked: true
    },
    {
      id: 'csv',
      name: 'CSV Export',
      description: 'Tabular data export for spreadsheet analysis',
      icon: BarChart3,
      format: 'CSV',
      available: true,
      watermarked: true
    },
    {
      id: 'xml',
      name: 'XML Report',
      description: 'Structured XML format for system integration',
      icon: FileText,
      format: 'XML',
      available: false,
      watermarked: false
    },
    {
      id: 'api',
      name: 'API Integration',
      description: 'Direct API access for automated workflows',
      icon: ExternalLink,
      format: 'API',
      available: false,
      watermarked: false
    }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const format = exportFormats.find(f => f.id === selectedFormat);
    if (!format) return;

    // Create demo export data
    const exportData = {
      ...demoResults,
      demoInfo: {
        scenario: scenarioName,
        industry: industry,
        timestamp: new Date().toISOString(),
        watermark: 'DEMO VERSION - NOT FOR PRODUCTION USE',
        restrictions: [
          'This is a demonstration report with sample data',
          'Results are for evaluation purposes only',
          'Contact sales for production licensing'
        ]
      },
      metadata: {
        ...demoResults.metadata,
        demoVersion: true,
        productionFeatures: 'Contact sales for full feature access'
      }
    };

    // Create and download file
    let blob: Blob;
    let filename: string;

    switch (selectedFormat) {
      case 'pdf':
        // For demo, we'll create a text file with PDF-like content
        const pdfContent = `
PROOFPIX DEMO REPORT - ${scenarioName.toUpperCase()}
${'='.repeat(60)}

DEMO WATERMARK: NOT FOR PRODUCTION USE
Industry: ${industry}
Generated: ${new Date().toLocaleString()}

ANALYSIS RESULTS:
${JSON.stringify(exportData, null, 2)}

DEMO LIMITATIONS:
- Sample data only
- Watermarked results
- Limited export formats
- No API access

UPGRADE TO PRODUCTION:
Contact sales@proofpix.com for full access
        `;
        blob = new Blob([pdfContent], { type: 'text/plain' });
        filename = `proofpix-demo-${industry}-${Date.now()}.txt`;
        break;

      case 'json':
        blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        filename = `proofpix-demo-${industry}-${Date.now()}.json`;
        break;

      case 'csv':
        const csvContent = Object.entries(exportData.metadata || {})
          .map(([key, value]) => `"${key}","${value}"`)
          .join('\n');
        const csvWithHeader = `"Property","Value"\n${csvContent}\n"Demo Version","True"\n"Watermark","DEMO - NOT FOR PRODUCTION"`;
        blob = new Blob([csvWithHeader], { type: 'text/csv' });
        filename = `proofpix-demo-${industry}-${Date.now()}.csv`;
        break;

      default:
        return;
    }

    // Download file
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    setIsExporting(false);
    setExportComplete(true);
  };

  const handleShare = () => {
    const shareText = `I just tried ProofPix's ${scenarioName} demo! Check out their ${industry} solutions for secure image metadata processing.`;
    const shareUrl = window.location.origin;
    
    if (navigator.share) {
      navigator.share({
        title: 'ProofPix Demo Results',
        text: shareText,
        url: shareUrl
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert('Demo link copied to clipboard!');
    }
  };

  const getIndustryColor = (industry: string) => {
    const colors = {
      legal: 'blue',
      insurance: 'emerald',
      healthcare: 'red',
      general: 'purple'
    };
    return colors[industry as keyof typeof colors] || 'gray';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Download className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Export Demo Results</h2>
        <p className="text-gray-600">Download your {scenarioName} analysis results</p>
      </div>

      {/* Demo Watermark Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
        <div className="flex items-start space-x-3">
          <Crown className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-1">Demo Version</h3>
            <p className="text-yellow-700 text-sm mb-3">
              This export contains watermarked demo results with sample data. 
              Production exports provide clean, professional reports without watermarks.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Watermarked</span>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Sample Data</span>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Limited Formats</span>
            </div>
          </div>
        </div>
      </div>

      {/* Export Formats */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Export Format</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exportFormats.map((format) => (
            <motion.div
              key={format.id}
              whileHover={{ scale: format.available ? 1.02 : 1 }}
              whileTap={{ scale: format.available ? 0.98 : 1 }}
              onClick={() => format.available && setSelectedFormat(format.id)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedFormat === format.id && format.available
                  ? `border-${getIndustryColor(industry)}-500 bg-${getIndustryColor(industry)}-50`
                  : format.available
                    ? 'border-gray-200 hover:border-gray-300 bg-white'
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  format.available 
                    ? `bg-${getIndustryColor(industry)}-100` 
                    : 'bg-gray-100'
                }`}>
                  <format.icon className={`w-5 h-5 ${
                    format.available 
                      ? `text-${getIndustryColor(industry)}-600` 
                      : 'text-gray-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900">{format.name}</h4>
                    {!format.available && (
                      <Lock className="w-4 h-4 text-gray-400" />
                    )}
                    {format.watermarked && format.available && (
                      <Crown className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{format.description}</p>
                  {!format.available && (
                    <p className="text-gray-500 text-xs mt-2">Available in production version</p>
                  )}
                </div>
                {selectedFormat === format.id && format.available && (
                  <CheckCircle className={`w-5 h-5 text-${getIndustryColor(industry)}-600`} />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Export Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleExport}
            disabled={isExporting || !selectedFormat}
            className={`bg-gradient-to-r from-${getIndustryColor(industry)}-500 to-${getIndustryColor(industry)}-600 hover:from-${getIndustryColor(industry)}-600 hover:to-${getIndustryColor(industry)}-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center`}
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export Demo Report
              </>
            )}
          </button>

          <button
            onClick={handleShare}
            className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Demo
          </button>
        </div>

        {onUpgrade && (
          <button
            onClick={onUpgrade}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center"
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Production
          </button>
        )}
      </div>

      {/* Export Success */}
      {exportComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
        >
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h4 className="font-semibold text-green-800">Export Complete!</h4>
              <p className="text-green-700 text-sm">
                Your demo report has been downloaded. Remember, this is a watermarked demo version.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Production Features */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Shield className="w-5 h-5 text-blue-600 mr-2" />
          Production Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Clean, professional reports
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              All export formats available
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              API integration support
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Custom branding options
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Batch processing capabilities
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Enterprise security features
            </div>
          </div>
        </div>
      </div>

      {/* Close Button */}
      {onClose && (
        <div className="text-center mt-6">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            Close Export
          </button>
        </div>
      )}
    </div>
  );
}; 