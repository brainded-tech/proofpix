import React, { memo, useState, useRef, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';

const ExportDropdown = memo(({ 
  onExport, 
  canExport = true, 
  disabled = false,
  remainingExports = 0 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleExport = (format) => {
    setIsOpen(false);
    onExport(format);
  };

  const exportOptions = [
    {
      id: 'json',
      label: 'Export as JSON',
      description: 'Structured data format',
      icon: LucideIcons.FileText,
      format: 'application/json'
    },
    {
      id: 'csv',
      label: 'Export as CSV',
      description: 'Spreadsheet compatible',
      icon: LucideIcons.Table,
      format: 'text/csv'
    },
    {
      id: 'raw',
      label: 'Raw EXIF Data',
      description: 'Complete metadata dump',
      icon: LucideIcons.Code,
      format: 'text/plain'
    },
    {
      id: 'clipboard',
      label: 'Copy to Clipboard',
      description: 'Copy formatted data',
      icon: LucideIcons.Copy,
      format: 'clipboard'
    }
  ];

  return (
    <div className="export-dropdown" ref={dropdownRef}>
      <button
        className={`export-trigger ${disabled || !canExport ? 'disabled' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || !canExport}
        aria-label="Export metadata options"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <LucideIcons.Download size={16} />
        <span>Export Data</span>
        <LucideIcons.ChevronDown 
          size={14} 
          className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
        />
      </button>

      {!canExport && (
        <div className="export-limit-notice">
          Export limit reached today
        </div>
      )}

      {isOpen && canExport && (
        <div className="export-dropdown-menu">
          <div className="dropdown-header">
            <span>Export Options</span>
          </div>
          
          {exportOptions.map((option) => (
            <button
              key={option.id}
              className="export-option"
              onClick={() => handleExport(option.id)}
            >
              <div className="option-icon">
                <option.icon size={16} />
              </div>
              <div className="option-content">
                <div className="option-label">{option.label}</div>
                <div className="option-description">{option.description}</div>
              </div>
              <LucideIcons.ChevronRight size={14} className="option-arrow" />
            </button>
          ))}
          
          <div className="dropdown-footer">
            <span>All exports happen locally</span>
          </div>
        </div>
      )}
    </div>
  );
});

ExportDropdown.displayName = 'ExportDropdown';
export default ExportDropdown;