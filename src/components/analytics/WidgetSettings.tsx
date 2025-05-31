import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronDown, 
  ChevronRight, 
  Check, 
  RotateCcw,
  Eye,
  EyeOff
} from 'lucide-react';
import { DashboardWidget } from './CustomDashboardBuilder';

interface WidgetSettingsProps {
  widget: DashboardWidget;
  onClose: () => void;
  onUpdate: (widget: DashboardWidget) => void;
  onReset?: () => void;
  theme?: 'light' | 'dark';
}

export const WidgetSettings: React.FC<WidgetSettingsProps> = ({
  widget,
  onClose,
  onUpdate,
  onReset,
  theme = 'light'
}) => {
  // Local state for the widget being edited
  const [editedWidget, setEditedWidget] = useState<DashboardWidget>({ ...widget });
  const [activeSection, setActiveSection] = useState<string>('general');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  // Update hasChanges when the edited widget changes
  useEffect(() => {
    const widgetJson = JSON.stringify(widget);
    const editedWidgetJson = JSON.stringify(editedWidget);
    setHasChanges(widgetJson !== editedWidgetJson);
  }, [widget, editedWidget]);

  // Handle input changes
  const handleInputChange = (
    field: string, 
    value: string | number | boolean | Record<string, any>
  ) => {
    setEditedWidget(prev => {
      if (field.includes('.')) {
        // Handle nested properties
        const [parent, child] = field.split('.');
        // Create a safer version by checking if the parent property exists
        const parentObj = parent in prev 
          ? (prev[parent as keyof DashboardWidget] as Record<string, any>) 
          : {} as Record<string, any>;
        
        return {
          ...prev,
          [parent]: {
            ...parentObj,
            [child]: value
          }
        };
      }
      
      return {
        ...prev,
        [field]: value
      };
    });
  };

  // Handle config changes
  const handleConfigChange = (
    configKey: string,
    value: any
  ) => {
    setEditedWidget(prev => ({
      ...prev,
      config: {
        ...prev.config,
        [configKey]: value
      }
    }));
  };

  // Apply changes and close
  const handleApply = () => {
    onUpdate(editedWidget);
  };

  // Reset changes
  const handleReset = () => {
    if (onReset) {
      onReset();
    }
    setEditedWidget({ ...widget });
  };

  // Helper to render input based on type
  const renderInput = (
    label: string,
    field: string,
    value: string | number | boolean,
    type: 'text' | 'number' | 'checkbox' | 'select' | 'color',
    options?: Array<{ value: string; label: string }>,
    min?: number,
    max?: number,
    step?: number
  ) => {
    const isConfig = field.startsWith('config.');
    const actualField = isConfig ? field.replace('config.', '') : field;
    const actualValue = isConfig 
      ? editedWidget.config[actualField] 
      : value;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const target = e.target;
      let newValue: string | number | boolean = target.value;
      
      if (type === 'number') {
        newValue = target.value === '' ? 0 : Number(target.value);
      } else if (type === 'checkbox') {
        newValue = (target as HTMLInputElement).checked;
      }
      
      if (isConfig) {
        handleConfigChange(actualField, newValue);
      } else {
        handleInputChange(field, newValue);
      }
    };

    return (
      <div className="mb-4">
        <label className={`block text-sm font-medium mb-1 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {label}
        </label>
        
        {type === 'text' && (
          <input
            type="text"
            value={actualValue as string}
            onChange={handleChange}
            className={`w-full p-2 rounded-md border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        )}
        
        {type === 'number' && (
          <input
            type="number"
            value={actualValue as number}
            onChange={handleChange}
            min={min}
            max={max}
            step={step}
            className={`w-full p-2 rounded-md border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        )}
        
        {type === 'checkbox' && (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={actualValue as boolean}
              onChange={handleChange}
              className={`w-4 h-4 rounded ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-blue-500'
                  : 'bg-white border-gray-300 text-blue-600'
              }`}
            />
            <span className={`ml-2 text-sm ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Enabled
            </span>
          </div>
        )}
        
        {type === 'select' && options && (
          <select
            value={actualValue as string}
            onChange={handleChange}
            className={`w-full p-2 rounded-md border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
        
        {type === 'color' && (
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={actualValue as string}
              onChange={handleChange}
              className="w-8 h-8 rounded-md border cursor-pointer"
            />
            <input
              type="text"
              value={actualValue as string}
              onChange={handleChange}
              className={`flex-1 p-2 rounded-md border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
        )}
      </div>
    );
  };

  // Render appropriate settings based on widget type
  const renderTypeSpecificSettings = () => {
    switch (editedWidget.type) {
      case 'metric':
        return (
          <>
            {renderInput('Value Format', 'config.format', '', 'select', [
              { value: 'number', label: 'Number' },
              { value: 'currency', label: 'Currency' },
              { value: 'percentage', label: 'Percentage' },
              { value: 'decimal', label: 'Decimal' }
            ])}
            {renderInput('Prefix', 'config.prefix', '', 'text')}
            {renderInput('Suffix', 'config.suffix', '', 'text')}
            {renderInput('Show Change Indicator', 'config.showChange', true, 'checkbox')}
            {renderInput('Positive Color', 'config.positiveColor', '#10b981', 'color')}
            {renderInput('Negative Color', 'config.negativeColor', '#ef4444', 'color')}
          </>
        );
      case 'line':
        return (
          <>
            {renderInput('Show Area', 'config.showArea', true, 'checkbox')}
            {renderInput('Smooth Line', 'config.smoothLine', true, 'checkbox')}
            {renderInput('Line Color', 'config.lineColor', '#3b82f6', 'color')}
            {renderInput('Area Color', 'config.areaColor', 'rgba(59, 130, 246, 0.2)', 'color')}
            {renderInput('Y-Axis Minimum', 'config.yAxisMin', 'auto', 'text')}
            {renderInput('Y-Axis Maximum', 'config.yAxisMax', 'auto', 'text')}
            {renderInput('Include Zero', 'config.includeZero', true, 'checkbox')}
            {renderInput('Time Range', 'config.timeRange', '7d', 'select', [
              { value: '24h', label: 'Last 24 Hours' },
              { value: '7d', label: 'Last 7 Days' },
              { value: '30d', label: 'Last 30 Days' },
              { value: '90d', label: 'Last 90 Days' }
            ])}
            {renderInput('Granularity', 'config.granularity', 'day', 'select', [
              { value: 'hour', label: 'Hour' },
              { value: 'day', label: 'Day' },
              { value: 'week', label: 'Week' },
              { value: 'month', label: 'Month' }
            ])}
          </>
        );
      case 'bar':
        return (
          <>
            {renderInput('Stacked', 'config.stacked', false, 'checkbox')}
            {renderInput('Horizontal', 'config.horizontal', false, 'checkbox')}
            {renderInput('Show Grid', 'config.showGrid', true, 'checkbox')}
            {renderInput('Show Values', 'config.showValues', false, 'checkbox')}
            {renderInput('Sort By', 'config.sortBy', 'value', 'select', [
              { value: 'value', label: 'Value' },
              { value: 'label', label: 'Label' },
              { value: 'none', label: 'None' }
            ])}
            {renderInput('Sort Order', 'config.sortOrder', 'desc', 'select', [
              { value: 'asc', label: 'Ascending' },
              { value: 'desc', label: 'Descending' }
            ])}
            {renderInput('Limit', 'config.limit', 10, 'number', undefined, 1, 100, 1)}
          </>
        );
      case 'pie':
        return (
          <>
            {renderInput('Donut Style', 'config.donut', true, 'checkbox')}
            {renderInput('Show Labels', 'config.showLabels', true, 'checkbox')}
            {renderInput('Show Percentages', 'config.showPercentage', true, 'checkbox')}
            {renderInput('Sort By', 'config.sortBy', 'value', 'select', [
              { value: 'value', label: 'Value' },
              { value: 'label', label: 'Label' },
              { value: 'none', label: 'None' }
            ])}
            {renderInput('Sort Order', 'config.sortOrder', 'desc', 'select', [
              { value: 'asc', label: 'Ascending' },
              { value: 'desc', label: 'Descending' }
            ])}
            {renderInput('Limit', 'config.limit', 5, 'number', undefined, 1, 100, 1)}
          </>
        );
      case 'radar':
        return (
          <>
            {renderInput('Fill Area', 'config.fillArea', true, 'checkbox')}
            {renderInput('Show Grid', 'config.showGrid', true, 'checkbox')}
            {renderInput('Show Labels', 'config.showLabels', true, 'checkbox')}
            {renderInput('Min Scale', 'config.scale.min', 0, 'number')}
            {renderInput('Max Scale', 'config.scale.max', 100, 'number')}
          </>
        );
      case 'gauge':
        return (
          <>
            {renderInput('Minimum Value', 'config.min', 0, 'number')}
            {renderInput('Maximum Value', 'config.max', 100, 'number')}
            {renderInput('Show Value', 'config.showValue', true, 'checkbox')}
            {renderInput('Arc Width', 'config.arcWidth', 20, 'number', undefined, 1, 50, 1)}
          </>
        );
      case 'table':
        return (
          <>
            {renderInput('Page Size', 'config.pageSize', 10, 'number', undefined, 1, 100, 1)}
            {renderInput('Show Pagination', 'config.showPagination', true, 'checkbox')}
            {renderInput('Sortable', 'config.sortable', true, 'checkbox')}
            {renderInput('Filter Type', 'config.filterType', 'simple', 'select', [
              { value: 'none', label: 'None' },
              { value: 'simple', label: 'Simple' },
              { value: 'advanced', label: 'Advanced' }
            ])}
            {renderInput('Stripe Rows', 'config.stripeRows', true, 'checkbox')}
            {renderInput('Highlight Row', 'config.highlightRow', true, 'checkbox')}
          </>
        );
      case 'alert':
        return (
          <>
            {renderInput('Alert Type', 'config.type', 'threshold', 'select', [
              { value: 'threshold', label: 'Threshold' },
              { value: 'change', label: 'Change' },
              { value: 'anomaly', label: 'Anomaly' }
            ])}
            {renderInput('Threshold Value', 'config.threshold', 90, 'number')}
            {renderInput('Operator', 'config.operator', '>', 'select', [
              { value: '>', label: 'Greater Than' },
              { value: '<', label: 'Less Than' },
              { value: '=', label: 'Equal To' },
              { value: '>=', label: 'Greater Than or Equal To' },
              { value: '<=', label: 'Less Than or Equal To' },
              { value: '!=', label: 'Not Equal To' }
            ])}
            {renderInput('Severity', 'config.severity', 'warning', 'select', [
              { value: 'info', label: 'Info' },
              { value: 'warning', label: 'Warning' },
              { value: 'error', label: 'Error' },
              { value: 'critical', label: 'Critical' }
            ])}
            {renderInput('Message', 'config.message', '', 'text')}
            {renderInput('Show Icon', 'config.showIcon', true, 'checkbox')}
            {renderInput('Alert Color', 'config.color', '#f59e0b', 'color')}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50`}>
      <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h3 className="text-lg font-medium">Widget Settings: {editedWidget.title}</h3>
          <button 
            onClick={onClose}
            className={`p-1 rounded-full ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Navigation tabs */}
          <div className={`flex mb-6 border-b ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button
              onClick={() => setActiveSection('general')}
              className={`px-4 py-2 text-sm font-medium ${
                activeSection === 'general'
                  ? theme === 'dark'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-blue-600 border-b-2 border-blue-600'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveSection('appearance')}
              className={`px-4 py-2 text-sm font-medium ${
                activeSection === 'appearance'
                  ? theme === 'dark'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-blue-600 border-b-2 border-blue-600'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Appearance
            </button>
            <button
              onClick={() => setActiveSection('data')}
              className={`px-4 py-2 text-sm font-medium ${
                activeSection === 'data'
                  ? theme === 'dark'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-blue-600 border-b-2 border-blue-600'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Data
            </button>
          </div>

          {/* General settings */}
          {activeSection === 'general' && (
            <div>
              {renderInput('Widget Title', 'title', editedWidget.title, 'text')}
              {renderInput('Refresh Interval (seconds)', 'refreshInterval', editedWidget.refreshInterval || 0, 'number', undefined, 0, 3600, 5)}
              
              {/* Advanced toggle */}
              <div className={`p-3 rounded-md cursor-pointer mb-4 ${
                theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              }`} onClick={() => setShowAdvanced(!showAdvanced)}>
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Advanced Settings
                  </span>
                  {showAdvanced ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </div>
                
                {showAdvanced && (
                  <div className="mt-3 space-y-4">
                    {renderInput('Position X', 'position.x', editedWidget.position.x, 'number', undefined, 0, 10, 1)}
                    {renderInput('Position Y', 'position.y', editedWidget.position.y, 'number', undefined, 0, 10, 1)}
                    {renderInput('Width', 'position.width', editedWidget.position.width, 'number', undefined, 1, 3, 1)}
                    {renderInput('Height', 'position.height', editedWidget.position.height, 'number', undefined, 1, 3, 1)}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Appearance settings */}
          {activeSection === 'appearance' && (
            <div>
              {renderInput('Show Title', 'config.showTitle', true, 'checkbox')}
              {renderInput('Show Legend', 'config.showLegend', true, 'checkbox')}
              {renderInput('Animation', 'config.animation', true, 'checkbox')}
              {renderInput('Background Color', 'config.backgroundColor', '#ffffff', 'color')}
              {renderInput('Text Color', 'config.textColor', '#111827', 'color')}
              {renderInput('Border Color', 'config.borderColor', '#e5e7eb', 'color')}
              {renderInput('Border Width', 'config.borderWidth', 1, 'number', undefined, 0, 10, 1)}
              
              {/* Widget type specific appearance settings */}
              <div className="mt-6">
                <h4 className={`text-sm font-medium mb-3 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {editedWidget.type.charAt(0).toUpperCase() + editedWidget.type.slice(1)} Settings
                </h4>
                {renderTypeSpecificSettings()}
              </div>
            </div>
          )}

          {/* Data settings */}
          {activeSection === 'data' && (
            <div>
              {renderInput('Data Source', 'dataSource', editedWidget.dataSource, 'text')}
              {/* Add more data-specific settings based on the widget type */}
            </div>
          )}

          {/* Footer with action buttons */}
          <div className="flex justify-end mt-6 pt-4 border-t space-x-2 ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }">
            <button
              onClick={handleReset}
              disabled={!hasChanges}
              className={`flex items-center px-3 py-2 rounded-md ${
                theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } ${!hasChanges ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </button>
            <button
              onClick={onClose}
              className={`px-3 py-2 rounded-md ${
                theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={!hasChanges}
              className={`flex items-center px-3 py-2 rounded-md ${
                theme === 'dark'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              } ${!hasChanges ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Check className="w-4 h-4 mr-2" />
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetSettings; 