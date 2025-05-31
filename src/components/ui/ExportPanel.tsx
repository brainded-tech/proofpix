import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Image, X, Calendar } from 'lucide-react';

interface ExportOption {
  id: string;
  label: string;
  format: 'pdf' | 'csv' | 'excel' | 'json' | 'png' | 'svg';
  description: string;
  icon: React.ComponentType<any>;
}

interface ExportPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: string, options: any) => void;
  title?: string;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  isOpen,
  onClose,
  onExport,
  title = "Export Data"
}) => {
  const [selectedFormat, setSelectedFormat] = useState<string>('pdf');
  const [exportOptions, setExportOptions] = useState({
    includeCharts: true,
    includeData: true,
    dateRange: 'all',
    customDateStart: '',
    customDateEnd: ''
  });

  const exportFormats: ExportOption[] = [
    {
      id: 'pdf',
      label: 'PDF Report',
      format: 'pdf',
      description: 'Formatted report with charts and data',
      icon: FileText
    },
    {
      id: 'excel',
      label: 'Excel Spreadsheet',
      format: 'excel',
      description: 'Raw data in Excel format',
      icon: FileSpreadsheet
    },
    {
      id: 'csv',
      label: 'CSV Data',
      format: 'csv',
      description: 'Comma-separated values file',
      icon: FileText
    },
    {
      id: 'json',
      label: 'JSON Data',
      format: 'json',
      description: 'Structured data in JSON format',
      icon: FileText
    },
    {
      id: 'png',
      label: 'PNG Image',
      format: 'png',
      description: 'High-quality image of charts',
      icon: Image
    }
  ];

  const handleExport = () => {
    onExport(selectedFormat, exportOptions);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Export Format
            </label>
            <div className="space-y-2">
              {exportFormats.map((format) => {
                const IconComponent = format.icon;
                return (
                  <label
                    key={format.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedFormat === format.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="format"
                      value={format.id}
                      checked={selectedFormat === format.id}
                      onChange={(e) => setSelectedFormat(e.target.value)}
                      className="sr-only"
                    />
                    <IconComponent className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {format.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {format.description}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Export Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Export Options
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={exportOptions.includeCharts}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, includeCharts: e.target.checked }))}
                  className="mr-2 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Include charts and visualizations</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={exportOptions.includeData}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, includeData: e.target.checked }))}
                  className="mr-2 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Include raw data tables</span>
              </label>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Date Range
            </label>
            <select
              value={exportOptions.dateRange}
              onChange={(e) => setExportOptions(prev => ({ ...prev, dateRange: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All time</option>
              <option value="last7days">Last 7 days</option>
              <option value="last30days">Last 30 days</option>
              <option value="last90days">Last 90 days</option>
              <option value="custom">Custom range</option>
            </select>

            {exportOptions.dateRange === 'custom' && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={exportOptions.customDateStart}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, customDateStart: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">End Date</label>
                  <input
                    type="date"
                    value={exportOptions.customDateEnd}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, customDateEnd: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>
  );
}; 