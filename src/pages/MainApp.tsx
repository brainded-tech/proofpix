import React, { useState, useCallback } from 'react';
import { FileUploadInterface } from '../components/FileUploadInterface';
import { MetadataVisualization } from '../components/MetadataVisualization';
import { api, UploadProgress, ExifData } from '../utils/apiClient';
import { 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  BarChart3,
  Zap
} from 'lucide-react';

interface ProcessedFile {
  file: File;
  metadata: {
    fileName: string;
    fileSize: number;
    fileType: string;
    lastModified: Date;
    exif?: ExifData;
    privacyAnalysis?: {
      overallRisk: 'LOW' | 'MEDIUM' | 'HIGH';
      risks: {
        gps?: { level: 'LOW' | 'MEDIUM' | 'HIGH'; description: string };
        device?: { level: 'LOW' | 'MEDIUM' | 'HIGH'; description: string };
        timestamp?: { level: 'LOW' | 'MEDIUM' | 'HIGH'; description: string };
      };
      recommendations: string[];
    };
  };
}

export const MainApp: React.FC = () => {
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<ProcessedFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalSize: 0,
    privacyRisks: { low: 0, medium: 0, high: 0 },
    processingTime: 0
  });

  const handleFilesSelected = useCallback((files: File[]) => {
    console.log('Files selected:', files);
    // Files will be processed individually by the FileUploadInterface
  }, []);

  const handleFileProcessed = useCallback(async (file: File, basicMetadata: any) => {
    setIsProcessing(true);
    const startTime = Date.now();

    try {
      // Extract EXIF data using the API
      const response = await api.exif.extract(file, {
        onProgress: setUploadProgress
      });

      if (response.success && response.data) {
        // Generate privacy analysis
        const privacyAnalysis = generatePrivacyAnalysis(response.data.exif);

        const processedFile: ProcessedFile = {
          file,
          metadata: {
            ...basicMetadata,
            exif: response.data.exif,
            privacyAnalysis
          }
        };

        setProcessedFiles(prev => [...prev, processedFile]);
        
        // Update stats
        const processingTime = Date.now() - startTime;
        setStats(prev => ({
          totalFiles: prev.totalFiles + 1,
          totalSize: prev.totalSize + file.size,
          privacyRisks: {
            low: prev.privacyRisks.low + (privacyAnalysis.overallRisk === 'LOW' ? 1 : 0),
            medium: prev.privacyRisks.medium + (privacyAnalysis.overallRisk === 'MEDIUM' ? 1 : 0),
            high: prev.privacyRisks.high + (privacyAnalysis.overallRisk === 'HIGH' ? 1 : 0),
          },
          processingTime: prev.processingTime + processingTime
        }));

        // Auto-select first file if none selected
        if (!selectedFile) {
          setSelectedFile(processedFile);
        }
      }
    } catch (error) {
      console.error('Error processing file:', error);
      // Handle error - could show toast notification
    } finally {
      setIsProcessing(false);
      setUploadProgress(null);
    }
  }, [selectedFile]);

  const generatePrivacyAnalysis = (exifData: ExifData) => {
    const risks: any = {};
    const recommendations: string[] = [];
    let overallRisk: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';

    // GPS Analysis
    if (exifData?.location?.latitude && exifData?.location?.longitude) {
      risks.gps = {
        level: 'HIGH',
        description: 'Exact GPS coordinates found - reveals precise location'
      };
      recommendations.push('Remove GPS coordinates before sharing');
      overallRisk = 'HIGH';
    }

    // Device Information Analysis
    if (exifData?.camera?.make || exifData?.camera?.model) {
      risks.device = {
        level: 'MEDIUM',
        description: 'Camera/device information present - may reveal equipment details'
      };
      recommendations.push('Consider removing device information for privacy');
      if (overallRisk === 'LOW') overallRisk = 'MEDIUM';
    }

    // Timestamp Analysis
    if (exifData?.timestamp?.dateTimeOriginal) {
      risks.timestamp = {
        level: 'MEDIUM',
        description: 'Original capture timestamp present - reveals when photo was taken'
      };
      recommendations.push('Remove timestamps if timing information is sensitive');
      if (overallRisk === 'LOW') overallRisk = 'MEDIUM';
    }

    if (recommendations.length === 0) {
      recommendations.push('No significant privacy risks detected');
    }

    return {
      overallRisk,
      risks,
      recommendations
    };
  };

  const handleExport = useCallback((format: 'json' | 'csv' | 'pdf') => {
    if (!selectedFile) return;

    const data = selectedFile.metadata;
    const fileName = `${selectedFile.file.name}_metadata.${format}`;

    switch (format) {
      case 'json':
        const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        downloadFile(jsonBlob, fileName);
        break;
      
      case 'csv':
        const csvContent = convertToCSV(data);
        const csvBlob = new Blob([csvContent], { type: 'text/csv' });
        downloadFile(csvBlob, fileName);
        break;
      
      case 'pdf':
        // This would require jsPDF implementation
        console.log('PDF export not yet implemented');
        break;
    }
  }, [selectedFile]);

  const convertToCSV = (data: any): string => {
    const rows: string[] = [];
    rows.push('Property,Value');
    
    const flattenObject = (obj: any, prefix = '') => {
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;
        
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          flattenObject(value, newKey);
        } else {
          rows.push(`"${newKey}","${value}"`);
        }
      });
    };
    
    flattenObject(data);
    return rows.join('\n');
  };

  const downloadFile = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRemoveMetadata = useCallback(async () => {
    if (!selectedFile) return;

    try {
      // This would call an API to remove metadata and return a clean file
      console.log('Remove metadata functionality not yet implemented');
      // const cleanFile = await api.exif.remove(selectedFile.file);
      // downloadFile(cleanFile, `clean_${selectedFile.file.name}`);
    } catch (error) {
      console.error('Error removing metadata:', error);
    }
  }, [selectedFile]);

  const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(unitIndex > 0 ? 2 : 0)} ${units[unitIndex]}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="ml-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
                ProofPix Enterprise
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Image Metadata Analysis
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Dashboard */}
        {stats.totalFiles > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Files Processed</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.totalFiles}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-green-600 dark:text-green-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Size</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {formatFileSize(stats.totalSize)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Privacy Risks</p>
                  <div className="flex space-x-2 mt-1">
                    <span className="text-sm text-green-600 dark:text-green-400">L:{stats.privacyRisks.low}</span>
                    <span className="text-sm text-yellow-600 dark:text-yellow-400">M:{stats.privacyRisks.medium}</span>
                    <span className="text-sm text-red-600 dark:text-red-400">H:{stats.privacyRisks.high}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Processing</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {stats.totalFiles > 0 ? Math.round(stats.processingTime / stats.totalFiles) : 0}ms
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - File Upload */}
          <div className="space-y-6">
            <FileUploadInterface
              onFilesSelected={handleFilesSelected}
              onFileProcessed={handleFileProcessed}
              maxFiles={10}
              maxFileSize={50 * 1024 * 1024} // 50MB
            />

            {/* Processing Status */}
            {isProcessing && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center">
                  <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-pulse" />
                  <span className="ml-2 text-sm font-medium text-blue-900 dark:text-blue-100">
                    Processing image metadata...
                  </span>
                </div>
                {uploadProgress && (
                  <div className="mt-2">
                    <div className="bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                      <div 
                        className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      {uploadProgress.percentage}% - {formatFileSize(uploadProgress.loaded)} / {formatFileSize(uploadProgress.total)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* File List */}
            {processedFiles.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Processed Files ({processedFiles.length})
                  </h3>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {processedFiles.map((processedFile, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedFile(processedFile)}
                      className={`
                        w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                        ${selectedFile === processedFile ? 'bg-blue-50 dark:bg-blue-900/20 border-r-4 border-blue-600' : ''}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {processedFile.file.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatFileSize(processedFile.file.size)} • {processedFile.file.type}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {processedFile.metadata.privacyAnalysis && (
                            <span className={`
                              px-2 py-1 rounded-full text-xs font-medium
                              ${processedFile.metadata.privacyAnalysis.overallRisk === 'LOW' 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                : processedFile.metadata.privacyAnalysis.overallRisk === 'MEDIUM'
                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                              }
                            `}>
                              {processedFile.metadata.privacyAnalysis.overallRisk}
                            </span>
                          )}
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Metadata Visualization */}
          <div>
            {selectedFile ? (
              <MetadataVisualization
                metadata={selectedFile.metadata}
                onExport={handleExport}
                onRemoveMetadata={handleRemoveMetadata}
              />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
                <FileText className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No File Selected
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Upload and process an image to view its metadata analysis
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 