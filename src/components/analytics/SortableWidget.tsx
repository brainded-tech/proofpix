import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Settings, 
  Trash2, 
  GripVertical, 
  RefreshCw,
  LineChart,
  BarChart3,
  PieChart,
  Activity,
  FileBarChart,
  Gauge,
  Table,
  AlertTriangle
} from 'lucide-react';

import { DashboardWidget } from './CustomDashboardBuilder';

interface SortableWidgetProps {
  widget: DashboardWidget;
  theme: 'light' | 'dark';
  onRemove?: (id: string) => void;
  onSettings?: (widget: DashboardWidget) => void;
}

export const SortableWidget: React.FC<SortableWidgetProps> = ({
  widget,
  theme,
  onRemove,
  onSettings
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 1
  };

  // Widget icon mapping
  const getWidgetIcon = (type: DashboardWidget['type']) => {
    switch (type) {
      case 'metric': return <FileBarChart size={18} />;
      case 'line': return <LineChart size={18} />;
      case 'bar': return <BarChart3 size={18} />;
      case 'pie': return <PieChart size={18} />;
      case 'radar': return <Activity size={18} />;
      case 'gauge': return <Gauge size={18} />;
      case 'table': return <Table size={18} />;
      case 'alert': return <AlertTriangle size={18} />;
      default: return <FileBarChart size={18} />;
    }
  };

  // Placeholder content for each widget type
  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'metric':
        return (
          <div className="flex flex-col items-center justify-center h-32">
            <div className="text-3xl font-bold">42</div>
            <div className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Sample Metric
            </div>
          </div>
        );
      case 'line':
      case 'bar':
      case 'pie':
      case 'radar':
        return (
          <div className="flex items-center justify-center h-32">
            {getWidgetIcon(widget.type)}
            <span className="ml-2">{widget.type.charAt(0).toUpperCase() + widget.type.slice(1)} Chart</span>
          </div>
        );
      case 'gauge':
        return (
          <div className="flex items-center justify-center h-32">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 flex items-center justify-center">
                <Gauge size={48} className={theme === 'dark' ? 'text-blue-500' : 'text-blue-600'} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">75%</span>
              </div>
            </div>
          </div>
        );
      case 'table':
        return (
          <div className={`p-2 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} rounded-md h-32`}>
            <div className={`grid grid-cols-3 gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-sm`}>
              <div className={`p-1 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded`}>Header 1</div>
              <div className={`p-1 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded`}>Header 2</div>
              <div className={`p-1 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded`}>Header 3</div>
              <div className="p-1">Data 1</div>
              <div className="p-1">Data 2</div>
              <div className="p-1">Data 3</div>
              <div className="p-1">Data 4</div>
              <div className="p-1">Data 5</div>
              <div className="p-1">Data 6</div>
            </div>
          </div>
        );
      case 'alert':
        return (
          <div className={`flex items-center p-4 rounded-md ${
            theme === 'dark' ? 'bg-yellow-900/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
          } h-32`}>
            <AlertTriangle className="w-6 h-6 mr-3" />
            <div>
              <h4 className="font-medium">Warning Alert</h4>
              <p className="text-sm">This is a sample alert widget.</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-32">
            <span>Unknown widget type</span>
          </div>
        );
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-lg overflow-hidden border ${
        theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200 shadow-sm'
      }`}
    >
      {/* Widget Header */}
      <div className={`flex items-center justify-between p-3 border-b ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center">
          {getWidgetIcon(widget.type)}
          <h3 className="text-base font-medium ml-2">{widget.title}</h3>
        </div>
        <div className="flex items-center space-x-1">
          {widget.refreshInterval !== undefined && widget.refreshInterval > 0 && (
            <button
              className={`p-1 rounded-md ${
                theme === 'dark'
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-500'
              }`}
              title={`Auto-refresh every ${widget.refreshInterval} seconds`}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          
          {onSettings && (
            <button
              onClick={() => onSettings(widget)}
              className={`p-1 rounded-md ${
                theme === 'dark'
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-500'
              }`}
              title="Widget settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
          
          {onRemove && (
            <button
              onClick={() => onRemove(widget.id)}
              className={`p-1 rounded-md ${
                theme === 'dark'
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-500'
              }`}
              title="Remove widget"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          
          <div
            {...attributes}
            {...listeners}
            className={`p-1 rounded-md cursor-grab ${
              theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-400'
                : 'hover:bg-gray-100 text-gray-500'
            }`}
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </div>
        </div>
      </div>
      
      {/* Widget Content */}
      <div className="p-3">
        {renderWidgetContent()}
      </div>
    </div>
  );
};

export default SortableWidget; 