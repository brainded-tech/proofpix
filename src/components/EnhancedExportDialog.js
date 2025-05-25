// Enhanced Export Dialog with Custom Options
import React, { useState, useCallback, memo } from 'react';
import * as LucideIcons from 'lucide-react';
import { useEnhancedPdfGenerator } from '../utils/enhancedPdfGenerator';
import { useEnhancedDataExporter } from '../utils/enhancedDataExporter';
import { LoadingSpinner, ProgressBar } from './LoadingStates';
import './EnhancedExportDialog.css';

const EnhancedExportDialog = memo(({ 
  isOpen, 
  onClose, 
  data, 
  onExportComplete 
}) => {
  const [exportType, setExportType] = useState('pdf');
  const [pdfTemplate, setPdfTemplate] = useState('professional');
  const [selectedFields, setSelectedFields] = useState([]);
  const [exportOptions, setExportOptions] = useState({
    includeSummary: true,
    includeComputed: false,
    includeFieldDefinitions: false,
    watermark: false,
    compact: false
  });
  const [customFilename, setCustomFilename] = useState('');

  const { generatePdf, generateBatchPdf, isGenerating: isPdfGenerating, progress: pdfProgress } = useEnhancedPdfGenerator();
  const { exportData, getAvailableFields, getFieldCategories, isExporting: isDataExporting, progress: dataProgress } = useEnhancedDataExporter();

  const isProcessing = isPdfGenerating || isDataExporting;
  const progress = isPdfGenerating ? pdfProgress : dataProgress;

  // Get available fields and categories
  const availableFields = React.useMemo(() => {
    if (!data) return [];
    return getAvailableFields(data);
  }, [data, getAvailableFields]);

  const fieldCategories = React.useMemo(() => {
    return getFieldCategories();
  }, [getFieldCategories]);

  // Handle export
  const handleExport = useCallback(async () => {
    if (!data) return;

    try {
      let filename;
      const options = {
        ...exportOptions,
        filename: customFilename || undefined,
        fields: selectedFields.length > 0 ? selectedFields : undefined
      };

      if (exportType === 'pdf') {
        if (Array.isArray(data)) {
          filename = await generateBatchPdf(data, {
            template: pdfTemplate,
            ...options
          });
        } else {
          filename = await generatePdf(data, pdfTemplate, options);
        }
      } else {
        filename = await exportData(data, exportType, options);
      }

      onExportComplete?.(filename, exportType);
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      // Error will be handled by the error handler system
    }
  }, [data, exportType, pdfTemplate, selectedFields, exportOptions, customFilename, generatePdf, generateBatchPdf, exportData, onExportComplete, onClose]);

  // Handle field selection
  const handleFieldToggle = useCallback((field) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  }, []);

  const handleCategoryToggle = useCallback((category) => {
    const categoryFields = fieldCategories[category] || [];
    const allSelected = categoryFields.every(field => selectedFields.includes(field));
    
    if (allSelected) {
      // Deselect all fields in category
      setSelectedFields(prev => prev.filter(field => !categoryFields.includes(field)));
    } else {
      // Select all fields in category
      setSelectedFields(prev => [...new Set([...prev, ...categoryFields])]);
    }
  }, [fieldCategories, selectedFields]);

  const handleSelectAll = useCallback(() => {
    setSelectedFields(availableFields);
  }, [availableFields]);

  const handleSelectNone = useCallback(() => {
    setSelectedFields([]);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="export-dialog-overlay">
      <div className="export-dialog">
        <div className="export-dialog-header">
          <h2 className="export-dialog-title">
            <LucideIcons.Download size={24} />
            Enhanced Export Options
          </h2>
          <button 
            className="export-dialog-close"
            onClick={onClose}
            disabled={isProcessing}
          >
            <LucideIcons.X size={20} />
          </button>
        </div>

        <div className="export-dialog-content">
          {/* Export Type Selection */}
          <div className="export-section">
            <h3 className="export-section-title">Export Format</h3>
            <div className="export-format-grid">
              {[
                { id: 'pdf', label: 'PDF Report', icon: LucideIcons.FileText, description: 'Professional formatted report' },
                { id: 'json', label: 'JSON Data', icon: LucideIcons.Code, description: 'Structured data format' },
                { id: 'csv', label: 'CSV Spreadsheet', icon: LucideIcons.Table, description: 'Excel-compatible format' },
                { id: 'xml', label: 'XML Data', icon: LucideIcons.FileCode, description: 'Markup format' }
              ].map(format => (
                <div 
                  key={format.id}
                  className={`export-format-option ${exportType === format.id ? 'selected' : ''}`}
                  onClick={() => setExportType(format.id)}
                >
                  <format.icon size={24} />
                  <div className="export-format-info">
                    <div className="export-format-label">{format.label}</div>
                    <div className="export-format-description">{format.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PDF Template Selection */}
          {exportType === 'pdf' && (
            <div className="export-section">
              <h3 className="export-section-title">PDF Template</h3>
              <div className="pdf-template-grid">
                {[
                  { id: 'professional', label: 'Professional', description: 'Business-ready report with branding' },
                  { id: 'forensic', label: 'Forensic', description: 'Legal/investigative format' },
                  { id: 'minimal', label: 'Minimal', description: 'Clean and simple layout' },
                  { id: 'detailed', label: 'Detailed', description: 'Comprehensive analysis' }
                ].map(template => (
                  <div 
                    key={template.id}
                    className={`pdf-template-option ${pdfTemplate === template.id ? 'selected' : ''}`}
                    onClick={() => setPdfTemplate(template.id)}
                  >
                    <div className="pdf-template-label">{template.label}</div>
                    <div className="pdf-template-description">{template.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Field Selection for Data Exports */}
          {exportType !== 'pdf' && (
            <div className="export-section">
              <h3 className="export-section-title">Field Selection</h3>
              <div className="field-selection-controls">
                <button 
                  className="field-control-button"
                  onClick={handleSelectAll}
                  type="button"
                >
                  Select All
                </button>
                <button 
                  className="field-control-button"
                  onClick={handleSelectNone}
                  type="button"
                >
                  Select None
                </button>
                <span className="field-count">
                  {selectedFields.length} of {availableFields.length} fields selected
                </span>
              </div>

              <div className="field-categories">
                {Object.entries(fieldCategories).map(([category, fields]) => (
                  <div key={category} className="field-category">
                    <div 
                      className="field-category-header"
                      onClick={() => handleCategoryToggle(category)}
                    >
                      <LucideIcons.ChevronRight 
                        size={16} 
                        className={`category-chevron ${fields.every(field => selectedFields.includes(field)) ? 'expanded' : ''}`}
                      />
                      <span className="field-category-name">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                      <span className="field-category-count">
                        ({fields.filter(field => selectedFields.includes(field)).length}/{fields.length})
                      </span>
                    </div>
                    <div className="field-category-fields">
                      {fields.map(field => (
                        <label key={field} className="field-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedFields.includes(field)}
                            onChange={() => handleFieldToggle(field)}
                          />
                          <span className="field-label">{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Export Options */}
          <div className="export-section">
            <h3 className="export-section-title">Export Options</h3>
            <div className="export-options-grid">
              <label className="export-option">
                <input
                  type="checkbox"
                  checked={exportOptions.includeSummary}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, includeSummary: e.target.checked }))}
                />
                <span className="export-option-label">Include Summary Statistics</span>
                <span className="export-option-description">Add overview and analysis summary</span>
              </label>

              {exportType !== 'pdf' && (
                <>
                  <label className="export-option">
                    <input
                      type="checkbox"
                      checked={exportOptions.includeComputed}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, includeComputed: e.target.checked }))}
                    />
                    <span className="export-option-label">Include Computed Fields</span>
                    <span className="export-option-description">Add calculated values like aspect ratio, megapixels</span>
                  </label>

                  <label className="export-option">
                    <input
                      type="checkbox"
                      checked={exportOptions.includeFieldDefinitions}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, includeFieldDefinitions: e.target.checked }))}
                    />
                    <span className="export-option-label">Include Field Definitions</span>
                    <span className="export-option-description">Add documentation for each field</span>
                  </label>

                  <label className="export-option">
                    <input
                      type="checkbox"
                      checked={exportOptions.compact}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, compact: e.target.checked }))}
                    />
                    <span className="export-option-label">Compact Format</span>
                    <span className="export-option-description">Minimize file size (JSON only)</span>
                  </label>
                </>
              )}

              {exportType === 'pdf' && (
                <label className="export-option">
                  <input
                    type="checkbox"
                    checked={exportOptions.watermark}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, watermark: e.target.checked }))}
                  />
                  <span className="export-option-label">Add Watermark</span>
                  <span className="export-option-description">Add ProofPix watermark to PDF</span>
                </label>
              )}
            </div>
          </div>

          {/* Custom Filename */}
          <div className="export-section">
            <h3 className="export-section-title">Filename (Optional)</h3>
            <input
              type="text"
              className="custom-filename-input"
              placeholder={`proofpix-${exportType}-${Date.now()}`}
              value={customFilename}
              onChange={(e) => setCustomFilename(e.target.value)}
              disabled={isProcessing}
            />
          </div>
        </div>

        {/* Progress Indicator */}
        {isProcessing && (
          <div className="export-progress">
            <ProgressBar 
              progress={progress} 
              message={`Generating ${exportType.toUpperCase()}...`}
              animated={true}
            />
          </div>
        )}

        {/* Dialog Actions */}
        <div className="export-dialog-actions">
          <button 
            className="export-dialog-button secondary"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button 
            className="export-dialog-button primary"
            onClick={handleExport}
            disabled={isProcessing || !data}
          >
            {isProcessing ? (
              <>
                <LoadingSpinner size="small" showMessage={false} />
                Exporting...
              </>
            ) : (
              <>
                <LucideIcons.Download size={16} />
                Export {exportType.toUpperCase()}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

export default EnhancedExportDialog; 