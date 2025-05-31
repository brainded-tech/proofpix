import React, { useState } from 'react';
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  FileJson, 
  Calendar, 
  RefreshCw, 
  AlertTriangle,
  Check
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { analyticsPermissionService } from '../../services/analyticsPermissionService';
import { enhancedDataExporter } from '../../utils/enhancedDataExporter';

interface AnalyticsExportManagerProps {
  dashboardId?: string;
  metricIds?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  fileName?: string;
  theme?: 'light' | 'dark';
  onExportComplete?: () => void;
}

type ExportFormat = 'csv' | 'pdf' | 'json' | 'excel';

export const AnalyticsExportManager: React.FC<AnalyticsExportManagerProps> = ({
  dashboardId,
  metricIds = [],
  dateRange,
  fileName = 'analytics_export',
  theme = 'light',
  onExportComplete
}) => {
  const { user } = useAuth();
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [customDateRange, setCustomDateRange] = useState<{
    start: string;
    end: string;
  }>({
    start: dateRange?.start.toISOString().split('T')[0] || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: dateRange?.end.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
  });

  // Check export permission
  const checkExportPermission = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const hasPermission = await analyticsPermissionService.hasPermission(
        user,
        'export_data',
        dashboardId
      );
      
      return hasPermission;
    } catch (error) {
      console.error('Error checking export permission:', error);
      return false;
    }
  };

  // Handle export
  const handleExport = async () => {
    setError(null);
    setSuccess(false);
    
    // Check permission
    const hasPermission = await checkExportPermission();
    if (!hasPermission) {
      setError('You do not have permission to export analytics data');
      return;
    }
    
    try {
      setIsExporting(true);
      
      // Prepare export configuration
      const exportConfig = {
        format: selectedFormat,
        fileName: `${fileName}_${new Date().toISOString().slice(0, 10)}`,
        dashboardId,
        metricIds,
        dateRange: {
          start: new Date(customDateRange.start),
          end: new Date(customDateRange.end)
        },
        userId: user?.id
      };
      
      // Use the enhanced data exporter utility
      await enhancedDataExporter.exportData(exportConfig);
      
      setSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
      if (onExportComplete) {
        onExportComplete();
      }
    } catch (error) {
      console.error('Export error:', error);
      setError('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const isDarkTheme = theme === 'dark';

  return (
    <div className={`rounded-lg border ${
      isDarkTheme ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
    }`}>
      <div className={`px-4 py-3 border-b ${
        isDarkTheme ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <h3 className="font-medium">Export Analytics Data</h3>
      </div>
      
      <div className="p-4">
        {error && (
          <div className={`p-3 mb-4 rounded-md ${
            isDarkTheme ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-700'
          }`}>
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}
        
        {success && (
          <div className={`p-3 mb-4 rounded-md ${
            isDarkTheme ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-700'
          }`}>
            <div className="flex items-center">
              <Check className="w-5 h-5 mr-2" />
              <span>Export completed successfully</span>
            </div>
          </div>
        )}
        
        {/* Export Format Selection */}
        <div className="mb-4">
          <label className={`block mb-2 text-sm font-medium ${
            isDarkTheme ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Export Format
          </label>
          
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setSelectedFormat('csv')}
              className={`flex flex-col items-center justify-center p-3 rounded-md border ${
                selectedFormat === 'csv'
                  ? isDarkTheme
                    ? 'bg-blue-900/30 border-blue-700'
                    : 'bg-blue-50 border-blue-200'
                  : isDarkTheme
                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <FileSpreadsheet className={`w-6 h-6 mb-1 ${
                selectedFormat === 'csv'
                  ? isDarkTheme ? 'text-blue-400' : 'text-blue-500'
                  : ''
              }`} />
              <span className="text-sm">CSV</span>
            </button>
            
            <button
              onClick={() => setSelectedFormat('excel')}
              className={`flex flex-col items-center justify-center p-3 rounded-md border ${
                selectedFormat === 'excel'
                  ? isDarkTheme
                    ? 'bg-blue-900/30 border-blue-700'
                    : 'bg-blue-50 border-blue-200'
                  : isDarkTheme
                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <FileSpreadsheet className={`w-6 h-6 mb-1 ${
                selectedFormat === 'excel'
                  ? isDarkTheme ? 'text-green-400' : 'text-green-500'
                  : ''
              }`} />
              <span className="text-sm">Excel</span>
            </button>
            
            <button
              onClick={() => setSelectedFormat('pdf')}
              className={`flex flex-col items-center justify-center p-3 rounded-md border ${
                selectedFormat === 'pdf'
                  ? isDarkTheme
                    ? 'bg-blue-900/30 border-blue-700'
                    : 'bg-blue-50 border-blue-200'
                  : isDarkTheme
                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <FileText className={`w-6 h-6 mb-1 ${
                selectedFormat === 'pdf'
                  ? isDarkTheme ? 'text-red-400' : 'text-red-500'
                  : ''
              }`} />
              <span className="text-sm">PDF</span>
            </button>
            
            <button
              onClick={() => setSelectedFormat('json')}
              className={`flex flex-col items-center justify-center p-3 rounded-md border ${
                selectedFormat === 'json'
                  ? isDarkTheme
                    ? 'bg-blue-900/30 border-blue-700'
                    : 'bg-blue-50 border-blue-200'
                  : isDarkTheme
                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <FileJson className={`w-6 h-6 mb-1 ${
                selectedFormat === 'json'
                  ? isDarkTheme ? 'text-yellow-400' : 'text-yellow-500'
                  : ''
              }`} />
              <span className="text-sm">JSON</span>
            </button>
          </div>
        </div>
        
        {/* Date Range Selection */}
        <div className="mb-4">
          <label className={`block mb-2 text-sm font-medium ${
            isDarkTheme ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Date Range
          </label>
          
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <label className={`block mb-1 text-xs ${
                isDarkTheme ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Start Date
              </label>
              <div className={`flex items-center rounded-md border ${
                isDarkTheme ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}>
                <Calendar className={`ml-2 w-4 h-4 ${
                  isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={(e) => setCustomDateRange({
                    ...customDateRange,
                    start: e.target.value
                  })}
                  className={`flex-1 py-2 px-2 border-none outline-none ${
                    isDarkTheme ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
                  }`}
                />
              </div>
            </div>
            
            <div className="flex-1">
              <label className={`block mb-1 text-xs ${
                isDarkTheme ? 'text-gray-400' : 'text-gray-500'
              }`}>
                End Date
              </label>
              <div className={`flex items-center rounded-md border ${
                isDarkTheme ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}>
                <Calendar className={`ml-2 w-4 h-4 ${
                  isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={(e) => setCustomDateRange({
                    ...customDateRange,
                    end: e.target.value
                  })}
                  className={`flex-1 py-2 px-2 border-none outline-none ${
                    isDarkTheme ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          className={`w-full flex items-center justify-center px-4 py-2 rounded-md ${
            isDarkTheme
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          } ${isExporting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isExporting ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              <span>Export Data</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AnalyticsExportManager; 