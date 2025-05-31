import React, { useState } from 'react';
import { Filter, X, Calendar, Search } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  value: string;
  type: 'select' | 'date' | 'text' | 'multiselect';
  options?: { value: string; label: string }[];
}

interface FilterPanelProps {
  filters: FilterOption[];
  onFiltersChange: (filters: Record<string, any>) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  isOpen,
  onToggle
}) => {
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

  const handleFilterChange = (filterId: string, value: any) => {
    const newFilters = { ...activeFilters, [filterId]: value };
    setActiveFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilter = (filterId: string) => {
    const newFilters = { ...activeFilters };
    delete newFilters[filterId];
    setActiveFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    onFiltersChange({});
  };

  const activeFilterCount = Object.keys(activeFilters).length;

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <Filter className="h-4 w-4" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            {activeFilterCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
        <div className="flex items-center space-x-2">
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Clear all
            </button>
          )}
          <button
            onClick={onToggle}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filters.map((filter) => (
          <div key={filter.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {filter.label}
            </label>
            
            {filter.type === 'text' && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={activeFilters[filter.id] || ''}
                  onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                  placeholder={`Search ${filter.label.toLowerCase()}...`}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {filter.type === 'date' && (
              <input
                type="date"
                value={activeFilters[filter.id] || ''}
                onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}

            {filter.type === 'select' && filter.options && (
              <select
                value={activeFilters[filter.id] || ''}
                onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All {filter.label}</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}

            {filter.type === 'multiselect' && filter.options && (
              <div className="space-y-2">
                {filter.options.map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(activeFilters[filter.id] || []).includes(option.value)}
                      onChange={(e) => {
                        const currentValues = activeFilters[filter.id] || [];
                        const newValues = e.target.checked
                          ? [...currentValues, option.value]
                          : currentValues.filter((v: string) => v !== option.value);
                        handleFilterChange(filter.id, newValues);
                      }}
                      className="mr-2 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {activeFilters[filter.id] && (
              <button
                onClick={() => clearFilter(filter.id)}
                className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                Clear {filter.label}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 