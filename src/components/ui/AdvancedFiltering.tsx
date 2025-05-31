import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Filter,
  Plus,
  X,
  Search,
  Calendar,
  ChevronDown,
  Save,
  Bookmark,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Settings,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Info
} from 'lucide-react';

interface FilterCondition {
  id: string;
  field: string;
  operator: FilterOperator;
  value: any;
  dataType: 'string' | 'number' | 'date' | 'boolean' | 'array';
  enabled: boolean;
}

interface FilterGroup {
  id: string;
  name: string;
  conditions: FilterCondition[];
  logic: 'AND' | 'OR';
  enabled: boolean;
}

interface SavedFilter {
  id: string;
  name: string;
  description?: string;
  groups: FilterGroup[];
  createdAt: Date;
  lastUsed?: Date;
  isPublic: boolean;
  tags: string[];
}

interface FilterField {
  key: string;
  label: string;
  dataType: 'string' | 'number' | 'date' | 'boolean' | 'array';
  options?: Array<{ value: any; label: string }>;
  placeholder?: string;
  validation?: (value: any) => boolean;
}

type FilterOperator = 
  | 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'starts_with' | 'ends_with'
  | 'greater_than' | 'less_than' | 'greater_equal' | 'less_equal' | 'between'
  | 'in' | 'not_in' | 'is_null' | 'is_not_null' | 'regex'
  | 'before' | 'after' | 'on' | 'within_days' | 'within_months';

interface AdvancedFilteringProps {
  fields: FilterField[];
  data?: any[];
  onFilterChange: (filteredData: any[], activeFilters: FilterGroup[]) => void;
  onSaveFilter?: (filter: SavedFilter) => void;
  onLoadFilter?: (filterId: string) => void;
  savedFilters?: SavedFilter[];
  className?: string;
  showSaveOptions?: boolean;
  showPresets?: boolean;
  maxGroups?: number;
  maxConditionsPerGroup?: number;
}

interface FilterConditionEditorProps {
  condition: FilterCondition;
  fields: FilterField[];
  onChange: (condition: FilterCondition) => void;
  onRemove: () => void;
}

const getOperatorsForDataType = (dataType: string): Array<{ value: FilterOperator; label: string }> => {
  const baseOperators = [
    { value: 'equals' as FilterOperator, label: 'Equals' },
    { value: 'not_equals' as FilterOperator, label: 'Not Equals' },
    { value: 'is_null' as FilterOperator, label: 'Is Empty' },
    { value: 'is_not_null' as FilterOperator, label: 'Is Not Empty' }
  ];

  switch (dataType) {
    case 'string':
      return [
        ...baseOperators,
        { value: 'contains', label: 'Contains' },
        { value: 'not_contains', label: 'Does Not Contain' },
        { value: 'starts_with', label: 'Starts With' },
        { value: 'ends_with', label: 'Ends With' },
        { value: 'regex', label: 'Matches Regex' }
      ];
    case 'number':
      return [
        ...baseOperators,
        { value: 'greater_than', label: 'Greater Than' },
        { value: 'less_than', label: 'Less Than' },
        { value: 'greater_equal', label: 'Greater or Equal' },
        { value: 'less_equal', label: 'Less or Equal' },
        { value: 'between', label: 'Between' }
      ];
    case 'date':
      return [
        ...baseOperators,
        { value: 'before', label: 'Before' },
        { value: 'after', label: 'After' },
        { value: 'on', label: 'On Date' },
        { value: 'within_days', label: 'Within Days' },
        { value: 'within_months', label: 'Within Months' }
      ];
    case 'array':
      return [
        { value: 'in', label: 'Contains Any' },
        { value: 'not_in', label: 'Does Not Contain' },
        { value: 'is_null', label: 'Is Empty' },
        { value: 'is_not_null', label: 'Is Not Empty' }
      ];
    case 'boolean':
      return [
        { value: 'equals', label: 'Is' },
        { value: 'not_equals', label: 'Is Not' }
      ];
    default:
      return baseOperators;
  }
};

const FilterConditionEditor: React.FC<FilterConditionEditorProps> = ({
  condition,
  fields,
  onChange,
  onRemove
}) => {
  const selectedField = fields.find(f => f.key === condition.field);
  const availableOperators = selectedField ? getOperatorsForDataType(selectedField.dataType) : [];

  const handleFieldChange = (fieldKey: string) => {
    const field = fields.find(f => f.key === fieldKey);
    if (field) {
      onChange({
        ...condition,
        field: fieldKey,
        dataType: field.dataType,
        operator: getOperatorsForDataType(field.dataType)[0]?.value || 'equals',
        value: field.dataType === 'boolean' ? false : ''
      });
    }
  };

  const handleOperatorChange = (operator: FilterOperator) => {
    onChange({
      ...condition,
      operator,
      value: operator === 'between' ? { min: '', max: '' } : 
             operator === 'is_null' || operator === 'is_not_null' ? null :
             selectedField?.dataType === 'boolean' ? false : ''
    });
  };

  const handleValueChange = (value: any) => {
    onChange({ ...condition, value });
  };

  const renderValueInput = () => {
    if (!selectedField) return null;

    const { dataType, options } = selectedField;
    const { operator } = condition;

    // No value input needed for null checks
    if (operator === 'is_null' || operator === 'is_not_null') {
      return null;
    }

    // Between operator needs two inputs
    if (operator === 'between') {
      return (
        <div className="flex space-x-2">
          <input
            type={dataType === 'number' ? 'number' : dataType === 'date' ? 'date' : 'text'}
            value={condition.value?.min || ''}
            onChange={(e) => handleValueChange({ ...condition.value, min: e.target.value })}
            placeholder="Min"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <span className="flex items-center text-gray-500 dark:text-gray-400">to</span>
          <input
            type={dataType === 'number' ? 'number' : dataType === 'date' ? 'date' : 'text'}
            value={condition.value?.max || ''}
            onChange={(e) => handleValueChange({ ...condition.value, max: e.target.value })}
            placeholder="Max"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      );
    }

    // Options dropdown
    if (options && options.length > 0) {
      return (
        <select
          value={condition.value}
          onChange={(e) => handleValueChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="">Select...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    // Boolean checkbox
    if (dataType === 'boolean') {
      return (
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={condition.value}
            onChange={(e) => handleValueChange(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">True</span>
        </label>
      );
    }

    // Array input (comma-separated)
    if (dataType === 'array' || operator === 'in' || operator === 'not_in') {
      return (
        <input
          type="text"
          value={Array.isArray(condition.value) ? condition.value.join(', ') : condition.value}
          onChange={(e) => handleValueChange(e.target.value.split(',').map(v => v.trim()))}
          placeholder="Enter values separated by commas"
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      );
    }

    // Default input
    return (
      <input
        type={dataType === 'number' ? 'number' : dataType === 'date' ? 'date' : 'text'}
        value={condition.value}
        onChange={(e) => handleValueChange(e.target.value)}
        placeholder={selectedField.placeholder || `Enter ${selectedField.label.toLowerCase()}`}
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      />
    );
  };

  return (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Enable/Disable Toggle */}
      <button
        onClick={() => onChange({ ...condition, enabled: !condition.enabled })}
        className={`p-1 rounded ${
          condition.enabled 
            ? 'text-green-600 dark:text-green-400' 
            : 'text-gray-400 dark:text-gray-500'
        }`}
      >
        {condition.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      </button>

      {/* Field Selection */}
      <select
        value={condition.field}
        onChange={(e) => handleFieldChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      >
        <option value="">Select Field</option>
        {fields.map((field) => (
          <option key={field.key} value={field.key}>
            {field.label}
          </option>
        ))}
      </select>

      {/* Operator Selection */}
      <select
        value={condition.operator}
        onChange={(e) => handleOperatorChange(e.target.value as FilterOperator)}
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        disabled={!condition.field}
      >
        {availableOperators.map((op) => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>

      {/* Value Input */}
      <div className="flex-1">
        {renderValueInput()}
      </div>

      {/* Remove Button */}
      <button
        onClick={onRemove}
        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export const AdvancedFiltering: React.FC<AdvancedFilteringProps> = ({
  fields,
  data = [],
  onFilterChange,
  onSaveFilter,
  onLoadFilter,
  savedFilters = [],
  className = '',
  showSaveOptions = true,
  showPresets = true,
  maxGroups = 5,
  maxConditionsPerGroup = 10
}) => {
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveFilterName, setSaveFilterName] = useState('');
  const [saveFilterDescription, setSaveFilterDescription] = useState('');
  const [saveFilterTags, setSaveFilterTags] = useState('');
  const [isPublicFilter, setIsPublicFilter] = useState(false);
  const [selectedSavedFilter, setSelectedSavedFilter] = useState<string>('');

  // Generate unique IDs
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Create initial filter group
  useEffect(() => {
    if (filterGroups.length === 0) {
      setFilterGroups([{
        id: generateId(),
        name: 'Filter Group 1',
        conditions: [],
        logic: 'AND',
        enabled: true
      }]);
    }
  }, []);

  // Apply filters to data
  const filteredData = useMemo(() => {
    if (!data.length || !filterGroups.some(g => g.enabled && g.conditions.some(c => c.enabled))) {
      return data;
    }

    return data.filter(item => {
      return filterGroups.some(group => {
        if (!group.enabled) return true;
        
        const enabledConditions = group.conditions.filter(c => c.enabled && c.field);
        if (enabledConditions.length === 0) return true;

        const conditionResults = enabledConditions.map(condition => {
          const fieldValue = item[condition.field];
          const { operator, value } = condition;

          switch (operator) {
            case 'equals':
              return fieldValue === value;
            case 'not_equals':
              return fieldValue !== value;
            case 'contains':
              return String(fieldValue).toLowerCase().includes(String(value).toLowerCase());
            case 'not_contains':
              return !String(fieldValue).toLowerCase().includes(String(value).toLowerCase());
            case 'starts_with':
              return String(fieldValue).toLowerCase().startsWith(String(value).toLowerCase());
            case 'ends_with':
              return String(fieldValue).toLowerCase().endsWith(String(value).toLowerCase());
            case 'greater_than':
              return Number(fieldValue) > Number(value);
            case 'less_than':
              return Number(fieldValue) < Number(value);
            case 'greater_equal':
              return Number(fieldValue) >= Number(value);
            case 'less_equal':
              return Number(fieldValue) <= Number(value);
            case 'between':
              return Number(fieldValue) >= Number(value.min) && Number(fieldValue) <= Number(value.max);
            case 'in':
              return Array.isArray(value) && value.some(v => 
                Array.isArray(fieldValue) ? fieldValue.includes(v) : fieldValue === v
              );
            case 'not_in':
              return Array.isArray(value) && !value.some(v => 
                Array.isArray(fieldValue) ? fieldValue.includes(v) : fieldValue === v
              );
            case 'is_null':
              return fieldValue == null || fieldValue === '';
            case 'is_not_null':
              return fieldValue != null && fieldValue !== '';
            case 'regex':
              try {
                return new RegExp(value, 'i').test(String(fieldValue));
              } catch {
                return false;
              }
            case 'before':
              return new Date(fieldValue) < new Date(value);
            case 'after':
              return new Date(fieldValue) > new Date(value);
            case 'on':
              return new Date(fieldValue).toDateString() === new Date(value).toDateString();
            default:
              return true;
          }
        });

        return group.logic === 'AND' 
          ? conditionResults.every(result => result)
          : conditionResults.some(result => result);
      });
    });
  }, [data, filterGroups]);

  // Notify parent of filter changes
  useEffect(() => {
    onFilterChange(filteredData, filterGroups.filter(g => g.enabled));
  }, [filteredData, filterGroups, onFilterChange]);

  const addFilterGroup = () => {
    if (filterGroups.length < maxGroups) {
      setFilterGroups([...filterGroups, {
        id: generateId(),
        name: `Filter Group ${filterGroups.length + 1}`,
        conditions: [],
        logic: 'AND',
        enabled: true
      }]);
    }
  };

  const removeFilterGroup = (groupId: string) => {
    setFilterGroups(filterGroups.filter(g => g.id !== groupId));
  };

  const updateFilterGroup = (groupId: string, updates: Partial<FilterGroup>) => {
    setFilterGroups(filterGroups.map(g => 
      g.id === groupId ? { ...g, ...updates } : g
    ));
  };

  const addCondition = (groupId: string) => {
    const group = filterGroups.find(g => g.id === groupId);
    if (group && group.conditions.length < maxConditionsPerGroup) {
      const newCondition: FilterCondition = {
        id: generateId(),
        field: '',
        operator: 'equals',
        value: '',
        dataType: 'string',
        enabled: true
      };

      updateFilterGroup(groupId, {
        conditions: [...group.conditions, newCondition]
      });
    }
  };

  const removeCondition = (groupId: string, conditionId: string) => {
    const group = filterGroups.find(g => g.id === groupId);
    if (group) {
      updateFilterGroup(groupId, {
        conditions: group.conditions.filter(c => c.id !== conditionId)
      });
    }
  };

  const updateCondition = (groupId: string, condition: FilterCondition) => {
    const group = filterGroups.find(g => g.id === groupId);
    if (group) {
      updateFilterGroup(groupId, {
        conditions: group.conditions.map(c => 
          c.id === condition.id ? condition : c
        )
      });
    }
  };

  const clearAllFilters = () => {
    setFilterGroups([{
      id: generateId(),
      name: 'Filter Group 1',
      conditions: [],
      logic: 'AND',
      enabled: true
    }]);
  };

  const saveCurrentFilter = () => {
    if (!saveFilterName.trim()) return;

    const newFilter: SavedFilter = {
      id: generateId(),
      name: saveFilterName.trim(),
      description: saveFilterDescription.trim(),
      groups: filterGroups,
      createdAt: new Date(),
      isPublic: isPublicFilter,
      tags: saveFilterTags.split(',').map(t => t.trim()).filter(t => t)
    };

    if (onSaveFilter) {
      onSaveFilter(newFilter);
    }

    // Reset save dialog
    setSaveFilterName('');
    setSaveFilterDescription('');
    setSaveFilterTags('');
    setIsPublicFilter(false);
    setShowSaveDialog(false);
  };

  const loadSavedFilter = (filterId: string) => {
    const filter = savedFilters.find(f => f.id === filterId);
    if (filter) {
      setFilterGroups(filter.groups);
      setSelectedSavedFilter(filterId);
      if (onLoadFilter) {
        onLoadFilter(filterId);
      }
    }
  };

  const activeFilterCount = filterGroups.reduce((count, group) => 
    count + (group.enabled ? group.conditions.filter(c => c.enabled && c.field).length : 0), 0
  );

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Advanced Filters
            </h3>
            {activeFilterCount > 0 && (
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-full">
                {activeFilterCount} active
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Saved Filters Dropdown */}
            {showPresets && savedFilters.length > 0 && (
              <select
                value={selectedSavedFilter}
                onChange={(e) => e.target.value ? loadSavedFilter(e.target.value) : setSelectedSavedFilter('')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              >
                <option value="">Load Saved Filter...</option>
                {savedFilters.map((filter) => (
                  <option key={filter.id} value={filter.id}>
                    {filter.name}
                  </option>
                ))}
              </select>
            )}
            
            {showSaveOptions && (
              <button
                onClick={() => setShowSaveDialog(true)}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                disabled={activeFilterCount === 0}
              >
                <Save className="h-4 w-4 mr-1 inline" />
                Save
              </button>
            )}
            
            <button
              onClick={clearAllFilters}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Filter Groups */}
      <div className="p-6 space-y-6">
        {filterGroups.map((group, groupIndex) => (
          <div key={group.id} className="border border-gray-200 dark:border-gray-700 rounded-lg">
            {/* Group Header */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updateFilterGroup(group.id, { enabled: !group.enabled })}
                  className={`p-1 rounded ${
                    group.enabled 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {group.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                
                <input
                  type="text"
                  value={group.name}
                  onChange={(e) => updateFilterGroup(group.id, { name: e.target.value })}
                  className="bg-transparent border-none text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none"
                />
                
                <select
                  value={group.logic}
                  onChange={(e) => updateFilterGroup(group.id, { logic: e.target.value as 'AND' | 'OR' })}
                  className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs"
                >
                  <option value="AND">AND</option>
                  <option value="OR">OR</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => addCondition(group.id)}
                  className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                  disabled={group.conditions.length >= maxConditionsPerGroup}
                >
                  <Plus className="h-3 w-3 mr-1 inline" />
                  Add Condition
                </button>
                
                {filterGroups.length > 1 && (
                  <button
                    onClick={() => removeFilterGroup(group.id)}
                    className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Conditions */}
            <div className="p-4 space-y-3">
              {group.conditions.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No conditions added yet</p>
                  <button
                    onClick={() => addCondition(group.id)}
                    className="mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
                  >
                    Add your first condition
                  </button>
                </div>
              ) : (
                group.conditions.map((condition, conditionIndex) => (
                  <div key={condition.id}>
                    {conditionIndex > 0 && (
                      <div className="flex justify-center py-2">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                          {group.logic}
                        </span>
                      </div>
                    )}
                    <FilterConditionEditor
                      condition={condition}
                      fields={fields}
                      onChange={(updatedCondition) => updateCondition(group.id, updatedCondition)}
                      onRemove={() => removeCondition(group.id, condition.id)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        ))}

        {/* Add Group Button */}
        {filterGroups.length < maxGroups && (
          <button
            onClick={addFilterGroup}
            className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2 inline" />
            Add Filter Group
          </button>
        )}
      </div>

      {/* Results Summary */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Showing {filteredData.length} of {data.length} results
          </span>
          {activeFilterCount > 0 && (
            <span className="text-blue-600 dark:text-blue-400">
              {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} applied
            </span>
          )}
        </div>
      </div>

      {/* Save Filter Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Save Filter
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Filter Name *
                </label>
                <input
                  type="text"
                  value={saveFilterName}
                  onChange={(e) => setSaveFilterName(e.target.value)}
                  placeholder="Enter filter name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={saveFilterDescription}
                  onChange={(e) => setSaveFilterDescription(e.target.value)}
                  placeholder="Optional description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  value={saveFilterTags}
                  onChange={(e) => setSaveFilterTags(e.target.value)}
                  placeholder="Enter tags separated by commas"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isPublicFilter}
                  onChange={(e) => setIsPublicFilter(e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Make this filter public (visible to other users)
                </span>
              </label>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveCurrentFilter}
                disabled={!saveFilterName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 