import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  FileText, 
  Image, 
  Table, 
  Code, 
  Crown, 
  CheckCircle, 
  AlertTriangle,
  Zap,
  ArrowRight,
  X
} from 'lucide-react';

interface ExportFormat {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  fileExtension: string;
  demoLimitations: string[];
  productionFeatures: string[];
}

interface DemoExportComponentProps {
  results: any[];
  industryType: string;
  onUpgrade: () => void;
  onClose?: () => void;
}

const DemoExportComponent: React.FC<DemoExportComponentProps> = ({
  results,
  industryType,
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
      icon: <FileText className="w-6 h-6" />,
      fileExtension: 'pdf',
      demoLimitations: [
        'Watermarked pages',
        'Limited to 3 pages',
        'Basic formatting only'
      ],
      productionFeatures: [
        'Professional branding',
        'Unlimited pages',
        'Advanced formatting',
        'Custom templates'
      ]
    },
    {
      id: 'excel',
      name: 'Excel Spreadsheet',
      description: 'Structured data export for further analysis',
      icon: <Table className="w-6 h-6" />,
      fileExtension: 'xlsx',
      demoLimitations: [
        'Watermarked cells',
        'Limited to 100 rows',
        'Basic formatting'
      ],
      productionFeatures: [
        'Clean data export',
        'Unlimited rows',
        'Advanced formulas',
        'Custom styling'
      ]
    },
    {
      id: 'json',
      name: 'JSON Data',
      description: 'Raw structured data for API integration',
      icon: <Code className="w-6 h-6" />,
      fileExtension: 'json',
      demoLimitations: [
        'Demo metadata included',
        'Limited data fields',
        'Sample timestamps'
      ],
      productionFeatures: [
        'Clean JSON output',
        'Full data fields',
        'Real timestamps',
        'API-ready format'
      ]
    },
    {
      id: 'images',
      name: 'Processed Images',
      description: 'Enhanced images with metadata overlays',
      icon: <Image className="w-6 h-6" />,
      fileExtension: 'zip',
      demoLimitations: [
        'Visible watermarks',
        'Reduced resolution',
        'Demo overlays'
      ],
      productionFeatures: [
        'Original resolution',
        'Clean images',
        'Custom overlays',
        'Batch processing'
      ]
    }
  ];

  const getIndustryColor = (industry: string) => {
    const colors = {
      legal: 'from-blue-600 to-indigo-700',
      healthcare: 'from-green-600 to-emerald-700',
      insurance: 'from-orange-600 to-red-700',
      enterprise: 'from-purple-600 to-violet-700'
    };
    return colors[industry as keyof typeof colors] || 'from-gray-600 to-gray-700';
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const format = exportFormats.find(f => f.id === selectedFormat);
    if (format) {
      // Create demo file with watermark
      const demoContent = {
        metadata: {
          exportedAt: new Date().toISOString(),
          format: format.name,
          industry: industryType,
          watermark: 'DEMO VERSION - ProofPix',
          limitation: 'This is a demonstration export with limited features'
        },
        results: results.map(result => ({
          ...result,
          demoNote: 'Demo data - upgrade for production features'
        }))
      };

      // Create and download demo file
      const blob = new Blob([JSON.stringify(demoContent, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `proofpix-demo-${industryType}-${Date.now()}.${format.fileExtension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    setIsExporting(false);
    setExportComplete(true);
  };

  const selectedFormatData = exportFormats.find(f => f.id === selectedFormat);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Export Demo Results</h3>
          <p className="text-gray-600 mt-1">
            Download your analysis results in various formats
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Demo Notice */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-amber-900">Demo Export Mode</h4>
            <p className="text-amber-700 text-sm">
              Demo exports include watermarks and limitations. Upgrade for full production features.
            </p>
          </div>
          <button
            onClick={onUpgrade}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors flex items-center gap-2"
          >
            <Crown className="w-4 h-4" />
            Upgrade Now
          </button>
        </div>
      </div>

      {/* Format Selection */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Choose Export Format</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exportFormats.map((format) => (
            <div
              key={format.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                selectedFormat === format.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedFormat(format.id)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  selectedFormat === format.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {format.icon}
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">{format.name}</h5>
                  <p className="text-sm text-gray-600">{format.description}</p>
                </div>
              </div>
              
              {selectedFormat === format.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="border-t border-blue-200 pt-3 mt-3"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h6 className="font-medium text-red-700 mb-2">Demo Limitations:</h6>
                      <ul className="space-y-1">
                        {format.demoLimitations.map((limitation, index) => (
                          <li key={index} className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="w-3 h-3" />
                            {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h6 className="font-medium text-green-700 mb-2">Production Features:</h6>
                      <ul className="space-y-1">
                        {format.productionFeatures.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-3 h-3" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Export Summary */}
      {selectedFormatData && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Export Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Format</div>
              <div className="font-medium">{selectedFormatData.name}</div>
            </div>
            <div>
              <div className="text-gray-500">File Type</div>
              <div className="font-medium">.{selectedFormatData.fileExtension}</div>
            </div>
            <div>
              <div className="text-gray-500">Results</div>
              <div className="font-medium">{results.length} files</div>
            </div>
            <div>
              <div className="text-gray-500">Industry</div>
              <div className="font-medium capitalize">{industryType}</div>
            </div>
          </div>
        </div>
      )}

      {/* Export Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleExport}
          disabled={isExporting || exportComplete}
          className={`flex-1 px-6 py-3 bg-gradient-to-r ${getIndustryColor(industryType)} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Exporting...
            </>
          ) : exportComplete ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Export Complete
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Export Demo {selectedFormatData?.name}
            </>
          )}
        </button>

        <button
          onClick={onUpgrade}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-700 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2"
        >
          <Crown className="w-4 h-4" />
          Upgrade for Full Features
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {exportComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-900">Demo Export Successful!</h4>
                <p className="text-green-700 text-sm">
                  Your demo file has been downloaded. Ready to see the full power of ProofPix?
                </p>
              </div>
              <button
                onClick={onUpgrade}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DemoExportComponent; 