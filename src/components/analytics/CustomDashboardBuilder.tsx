import React, { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { 
  Grid,
  Layout,
  PlusCircle,
  Trash2,
  Save,
  Settings,
  ChevronDown,
  Palette,
  X,
  AlertTriangle,
  LineChart,
  BarChart3,
  PieChart,
  Activity,
  FileBarChart,
  Gauge,
  Table,
  ListFilter,
  RefreshCw
} from 'lucide-react';

import { SortableWidget } from './SortableWidget';
import { WidgetSettings } from './WidgetSettings';
import { advancedAnalyticsService } from '../../services/advancedAnalyticsService';

// Define widget types
export interface DashboardWidget {
  id: string;
  type: 'metric' | 'line' | 'bar' | 'pie' | 'radar' | 'gauge' | 'table' | 'alert';
  title: string;
  position: { x: number; y: number; width: number; height: number };
  dataSource: string;
  config: Record<string, any>;
  refreshInterval?: number;
}

interface Dashboard {
  id: string;
  name: string;
  description?: string;
  widgets: DashboardWidget[];
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  theme: 'light' | 'dark' | 'system';
}

interface CustomDashboardBuilderProps {
  dashboardId?: string;
  onSave?: (dashboard: Dashboard) => void;
  theme?: 'light' | 'dark';
  isEditMode?: boolean;
}

export const CustomDashboardBuilder: React.FC<CustomDashboardBuilderProps> = ({
  dashboardId,
  onSave,
  theme = 'light',
  isEditMode = true
}) => {
  // Dashboard state
  const [dashboard, setDashboard] = useState<Dashboard>({
    id: dashboardId || `dashboard_${Date.now()}`,
    name: 'My Custom Dashboard',
    widgets: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublic: false,
    theme: 'light'
  });

  // UI state
  const [activeWidget, setActiveWidget] = useState<DashboardWidget | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [selectedWidget, setSelectedWidget] = useState<DashboardWidget | null>(null);
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // Available data sources
  const [dataSources, setDataSources] = useState<Array<{id: string, name: string, type: string}>>([
    { id: 'files_processed', name: 'Files Processed', type: 'timeSeries' },
    { id: 'data_volume', name: 'Data Volume', type: 'timeSeries' },
    { id: 'privacy_risks', name: 'Privacy Risks', type: 'category' },
    { id: 'file_types', name: 'File Types', type: 'category' },
    { id: 'processing_times', name: 'Processing Times', type: 'timeSeries' },
    { id: 'error_rates', name: 'Error Rates', type: 'timeSeries' },
    { id: 'users_active', name: 'Active Users', type: 'metric' },
    { id: 'system_health', name: 'System Health', type: 'gauge' }
  ]);

  // DnD sensors setup
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load dashboard data
  useEffect(() => {
    const loadDashboard = async () => {
      if (!dashboardId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Load dashboard from API
        const dashboardData = await advancedAnalyticsService.getDashboardData(dashboardId);
        
        // Transform to expected format if needed
        setDashboard({
          id: dashboardId,
          name: dashboardData.name || 'Custom Dashboard',
          widgets: dashboardData.widgets || [],
          createdAt: new Date(dashboardData.createdAt),
          updatedAt: new Date(dashboardData.updatedAt),
          isPublic: dashboardData.isPublic || false,
          theme: dashboardData.theme || 'light'
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load dashboard', error);
        setError('Failed to load dashboard. Please try again later.');
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [dashboardId]);

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const widget = dashboard.widgets.find(w => w.id === active.id);
    if (widget) {
      setActiveWidget(widget);
    }
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setDashboard(dashboard => {
        const oldIndex = dashboard.widgets.findIndex(w => w.id === active.id);
        const newIndex = dashboard.widgets.findIndex(w => w.id === over.id);
        
        return {
          ...dashboard,
          widgets: arrayMove(dashboard.widgets, oldIndex, newIndex),
          updatedAt: new Date()
        };
      });
    }
    
    setActiveWidget(null);
  };

  // Add new widget
  const handleAddWidget = (widgetType: DashboardWidget['type'], dataSource: string) => {
    const newWidget: DashboardWidget = {
      id: `widget_${Date.now()}`,
      type: widgetType,
      title: getDefaultWidgetTitle(widgetType, dataSource),
      position: getNextWidgetPosition(),
      dataSource,
      config: getDefaultWidgetConfig(widgetType, dataSource),
      refreshInterval: 30
    };

    setDashboard({
      ...dashboard,
      widgets: [...dashboard.widgets, newWidget],
      updatedAt: new Date()
    });

    setIsAddWidgetOpen(false);
  };

  // Remove widget
  const handleRemoveWidget = (widgetId: string) => {
    setDashboard({
      ...dashboard,
      widgets: dashboard.widgets.filter(w => w.id !== widgetId),
      updatedAt: new Date()
    });

    // Close settings if the removed widget was selected
    if (selectedWidget && selectedWidget.id === widgetId) {
      setSelectedWidget(null);
      setIsSettingsOpen(false);
    }
  };

  // Open widget settings
  const handleWidgetSettings = (widget: DashboardWidget) => {
    setSelectedWidget(widget);
    setIsSettingsOpen(true);
  };

  // Update widget settings
  const handleUpdateWidget = (updatedWidget: DashboardWidget) => {
    setDashboard({
      ...dashboard,
      widgets: dashboard.widgets.map(w => 
        w.id === updatedWidget.id ? updatedWidget : w
      ),
      updatedAt: new Date()
    });

    setIsSettingsOpen(false);
    setSelectedWidget(null);
  };

  // Utility function to map DashboardWidget to RealTimeDashboard widget type
  const mapToServiceWidgetType = (widgetType: DashboardWidget['type']): 'metric' | 'chart' | 'table' | 'alert' | 'kpi' => {
    switch (widgetType) {
      case 'metric':
        return 'metric';
      case 'table':
        return 'table';
      case 'alert':
        return 'alert';
      case 'line':
      case 'bar':
      case 'pie':
      case 'radar':
      case 'gauge':
        return 'chart';
      default:
        return 'chart';
    }
  };

  // Save dashboard
  const handleSaveDashboard = async () => {
    try {
      setIsSaving(true);
      setError(null);

      // Call the onSave callback or save directly to API
      if (onSave) {
        onSave(dashboard);
      } else {
        // Map widgets to the format expected by the service
        const serviceWidgets = dashboard.widgets.map(widget => ({
          ...widget,
          type: mapToServiceWidgetType(widget.type),
          refreshInterval: widget.refreshInterval || 30, // Ensure refreshInterval has a value
        }));

        // Save to backend API
        await advancedAnalyticsService.createRealTimeDashboard(
          dashboard.name,
          serviceWidgets,
          { viewers: [], editors: [], isPublic: dashboard.isPublic }
        );
      }

      setIsSaving(false);
    } catch (error) {
      console.error('Failed to save dashboard', error);
      setError('Failed to save dashboard. Please try again later.');
      setIsSaving(false);
    }
  };

  // Update dashboard name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDashboard({
      ...dashboard,
      name: e.target.value,
      updatedAt: new Date()
    });
  };

  // Update dashboard theme
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setDashboard({
      ...dashboard,
      theme: newTheme,
      updatedAt: new Date()
    });
  };

  // Toggle dashboard public status
  const handleTogglePublic = () => {
    setDashboard({
      ...dashboard,
      isPublic: !dashboard.isPublic,
      updatedAt: new Date()
    });
  };

  // Helper functions
  const getDefaultWidgetTitle = (type: DashboardWidget['type'], dataSource: string): string => {
    const dataSourceName = dataSources.find(ds => ds.id === dataSource)?.name || dataSource;
    
    switch (type) {
      case 'metric': return `${dataSourceName} Metric`;
      case 'line': return `${dataSourceName} Trend`;
      case 'bar': return `${dataSourceName} Chart`;
      case 'pie': return `${dataSourceName} Distribution`;
      case 'radar': return `${dataSourceName} Radar`;
      case 'gauge': return `${dataSourceName} Gauge`;
      case 'table': return `${dataSourceName} Table`;
      case 'alert': return `${dataSourceName} Alert`;
      default: return `New ${type} Widget`;
    }
  };

  const getDefaultWidgetConfig = (type: DashboardWidget['type'], dataSource: string): Record<string, any> => {
    const dataSourceType = dataSources.find(ds => ds.id === dataSource)?.type || 'timeSeries';
    
    // Base configuration for all widget types
    const baseConfig = {
      showTitle: true,
      showLegend: true,
      borderColor: '#e5e7eb',
      borderWidth: 1,
      backgroundColor: '#ffffff',
      textColor: '#111827',
      animation: true
    };
    
    switch (type) {
      case 'metric':
        return {
          ...baseConfig,
          format: 'number',
          prefix: '',
          suffix: '',
          showChange: true,
          positiveColor: '#10b981',
          negativeColor: '#ef4444',
          neutralColor: '#6b7280',
          showIcon: true,
          icon: 'trending-up'
        };
      case 'line':
        return {
          ...baseConfig,
          showArea: true,
          smoothLine: true,
          lineColor: '#3b82f6',
          areaColor: 'rgba(59, 130, 246, 0.2)',
          yAxisMin: 'auto',
          yAxisMax: 'auto',
          includeZero: true,
          timeRange: '7d',
          granularity: 'day'
        };
      case 'bar':
        return {
          ...baseConfig,
          barColors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
          stacked: false,
          horizontal: false,
          showGrid: true,
          showValues: false,
          sortBy: 'value',
          sortOrder: 'desc',
          limit: 10
        };
      case 'pie':
        return {
          ...baseConfig,
          colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
          donut: true,
          showLabels: true,
          showPercentage: true,
          sortBy: 'value',
          sortOrder: 'desc',
          limit: 5
        };
      case 'radar':
        return {
          ...baseConfig,
          colors: ['#3b82f6'],
          fillArea: true,
          showGrid: true,
          showLabels: true,
          scale: { min: 0, max: 100 }
        };
      case 'gauge':
        return {
          ...baseConfig,
          min: 0,
          max: 100,
          thresholds: [
            { value: 30, color: '#ef4444' },
            { value: 70, color: '#f59e0b' },
            { value: 100, color: '#10b981' }
          ],
          showValue: true,
          arcWidth: 20
        };
      case 'table':
        return {
          ...baseConfig,
          columns: [],
          pageSize: 10,
          showPagination: true,
          sortable: true,
          filterType: 'simple',
          stripeRows: true,
          highlightRow: true
        };
      case 'alert':
        return {
          ...baseConfig,
          type: 'threshold',
          threshold: 90,
          operator: '>',
          severity: 'warning',
          message: `${dataSource} threshold exceeded`,
          showIcon: true,
          icon: 'alert-triangle',
          color: '#f59e0b'
        };
      default:
        return baseConfig;
    }
  };

  const getNextWidgetPosition = () => {
    // Determine the next available position on the grid
    const numWidgets = dashboard.widgets.length;
    const columns = 3; // Number of columns in the grid
    
    return {
      x: (numWidgets % columns) * 1,
      y: Math.floor(numWidgets / columns) * 1,
      width: 1,
      height: 1
    };
  };

  // Widget icon mapping
  const getWidgetIcon = (type: DashboardWidget['type']) => {
    switch (type) {
      case 'metric': return <FileBarChart size={20} />;
      case 'line': return <LineChart size={20} />;
      case 'bar': return <BarChart3 size={20} />;
      case 'pie': return <PieChart size={20} />;
      case 'radar': return <Activity size={20} />;
      case 'gauge': return <Gauge size={20} />;
      case 'table': return <Table size={20} />;
      case 'alert': return <AlertTriangle size={20} />;
      default: return <FileBarChart size={20} />;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className={`w-8 h-8 animate-spin ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
      </div>
    );
  }

  return (
    <div className={`w-full ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      {/* Dashboard Header */}
      <div className={`p-4 flex flex-wrap items-center justify-between border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex-1">
          {isEditMode ? (
            <input
              type="text"
              value={dashboard.name}
              onChange={handleNameChange}
              className={`text-xl font-semibold px-2 py-1 border rounded ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Dashboard Name"
            />
          ) : (
            <h2 className="text-xl font-semibold">{dashboard.name}</h2>
          )}
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Last updated: {dashboard.updatedAt.toLocaleString()}
          </p>
        </div>
        
        {isEditMode && (
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <div className="relative group">
              <button
                className={`p-2 rounded-md ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Palette className="w-5 h-5" />
              </button>
              <div className={`absolute right-0 mt-1 w-40 p-2 rounded-md shadow-lg z-10 hidden group-hover:block ${
                theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <div className="space-y-1">
                  <button
                    onClick={() => handleThemeChange('light')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                      dashboard.theme === 'light'
                        ? theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                        : ''
                    }`}
                  >
                    Light Theme
                  </button>
                  <button
                    onClick={() => handleThemeChange('dark')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                      dashboard.theme === 'dark'
                        ? theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                        : ''
                    }`}
                  >
                    Dark Theme
                  </button>
                  <button
                    onClick={() => handleThemeChange('system')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                      dashboard.theme === 'system'
                        ? theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                        : ''
                    }`}
                  >
                    System Theme
                  </button>
                </div>
              </div>
            </div>
            
            {/* Add Widget Button */}
            <button
              onClick={() => setIsAddWidgetOpen(true)}
              className={`flex items-center px-3 py-2 rounded-md ${
                theme === 'dark'
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Widget
            </button>
            
            {/* Save Dashboard Button */}
            <button
              onClick={handleSaveDashboard}
              disabled={isSaving}
              className={`flex items-center px-3 py-2 rounded-md ${
                theme === 'dark'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Dashboard
            </button>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className={`m-4 p-4 rounded-md ${theme === 'dark' ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-700'}`}>
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      <div className="p-4">
        {dashboard.widgets.length === 0 ? (
          <div className={`p-12 rounded-md border-2 border-dashed text-center ${
            theme === 'dark' ? 'border-gray-700 text-gray-400' : 'border-gray-300 text-gray-500'
          }`}>
            <Grid className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Widgets Added Yet</h3>
            <p className="mb-4 max-w-md mx-auto">
              Start building your custom dashboard by adding widgets to visualize your data.
            </p>
            {isEditMode && (
              <button
                onClick={() => setIsAddWidgetOpen(true)}
                className={`inline-flex items-center px-4 py-2 rounded-md ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Add Your First Widget
              </button>
            )}
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={dashboard.widgets.map(widget => widget.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboard.widgets.map(widget => (
                  <SortableWidget
                    key={widget.id}
                    widget={widget}
                    theme={theme}
                    onRemove={isEditMode ? handleRemoveWidget : undefined}
                    onSettings={isEditMode ? handleWidgetSettings : undefined}
                  />
                ))}
              </div>
            </SortableContext>
            
            {/* Drag overlay */}
            <DragOverlay>
              {activeWidget && (
                <div className={`p-4 rounded-lg border shadow-md ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {getWidgetIcon(activeWidget.type)}
                      <h3 className="text-lg font-medium ml-2">{activeWidget.title}</h3>
                    </div>
                  </div>
                </div>
              )}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      {/* Add Widget Modal */}
      {isAddWidgetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`w-full max-w-md p-6 rounded-lg shadow-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Add New Widget</h3>
              <button 
                onClick={() => setIsAddWidgetOpen(false)}
                className={`p-1 rounded-full ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Select Data Source
              </label>
              <select 
                className={`w-full p-2 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                id="dataSource"
                defaultValue=""
              >
                <option value="" disabled>Choose a data source</option>
                {dataSources.map(source => (
                  <option key={source.id} value={source.id}>
                    {source.name} ({source.type})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Widget Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {(['metric', 'line', 'bar', 'pie', 'radar', 'gauge', 'table', 'alert'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      const selectElement = document.getElementById('dataSource') as HTMLSelectElement;
                      if (selectElement.value) {
                        handleAddWidget(type, selectElement.value);
                      }
                    }}
                    className={`p-3 rounded-md border text-center ${
                      theme === 'dark'
                        ? 'border-gray-700 hover:bg-gray-700'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      {getWidgetIcon(type)}
                      <span className="mt-1 text-xs capitalize">{type}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setIsAddWidgetOpen(false)}
                className={`px-4 py-2 rounded-md mr-2 ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Widget Settings Modal */}
      {isSettingsOpen && selectedWidget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`w-full max-w-xl p-6 rounded-lg shadow-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Widget Settings</h3>
              <button 
                onClick={() => {
                  setIsSettingsOpen(false);
                  setSelectedWidget(null);
                }}
                className={`p-1 rounded-full ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Basic Settings */}
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Widget Title
              </label>
              <input
                type="text"
                value={selectedWidget.title}
                onChange={(e) => setSelectedWidget({
                  ...selectedWidget,
                  title: e.target.value
                })}
                className={`w-full p-2 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Data Source
              </label>
              <select 
                value={selectedWidget.dataSource}
                onChange={(e) => setSelectedWidget({
                  ...selectedWidget,
                  dataSource: e.target.value
                })}
                className={`w-full p-2 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {dataSources.map(source => (
                  <option key={source.id} value={source.id}>
                    {source.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Refresh Interval (seconds)
              </label>
              <input
                type="number"
                min="0"
                value={selectedWidget.refreshInterval || 30}
                onChange={(e) => setSelectedWidget({
                  ...selectedWidget,
                  refreshInterval: parseInt(e.target.value) || 0
                })}
                className={`w-full p-2 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            
            {/* Advanced Settings - simplified for this component */}
            <div className="mb-6">
              <div className={`p-3 rounded-md ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <div className="flex items-center justify-between cursor-pointer">
                  <span className={`font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Advanced Settings
                  </span>
                  <ChevronDown className="w-5 h-5" />
                </div>
                <div className="mt-2">
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Advanced widget configuration available in full settings panel.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  setSelectedWidget(null);
                }}
                className={`px-4 py-2 rounded-md mr-2 ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedWidget) {
                    handleUpdateWidget(selectedWidget);
                  }
                }}
                className={`px-4 py-2 rounded-md ${
                  theme === 'dark'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDashboardBuilder; 