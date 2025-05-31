import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  Filter,
  Download,
  Maximize2,
  Minimize2,
  RefreshCw,
  Settings,
  Eye,
  EyeOff,
  Info
} from 'lucide-react';

interface ChartDataPoint {
  label: string;
  value: number;
  timestamp?: Date;
  metadata?: Record<string, any>;
}

interface ChartSeries {
  id: string;
  name: string;
  data: ChartDataPoint[];
  color: string;
  type?: 'line' | 'bar' | 'area';
  visible?: boolean;
}

interface ChartConfig {
  title: string;
  subtitle?: string;
  type: 'line' | 'bar' | 'pie' | 'area' | 'combo';
  series: ChartSeries[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  interactive?: boolean;
  height?: number;
  timeRange?: '1h' | '24h' | '7d' | '30d' | '90d';
  refreshInterval?: number;
}

interface InteractiveChartsProps {
  config: ChartConfig;
  onDataPointClick?: (point: ChartDataPoint, series: ChartSeries) => void;
  onExport?: (format: 'png' | 'svg' | 'pdf' | 'csv') => void;
  onConfigChange?: (config: ChartConfig) => void;
  className?: string;
  loading?: boolean;
  error?: string;
}

interface ChartTooltipProps {
  point: ChartDataPoint;
  series: ChartSeries;
  position: { x: number; y: number };
  visible: boolean;
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({ point, series, position, visible }) => {
  if (!visible) return null;

  return (
    <div
      className="absolute z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 pointer-events-none"
      style={{
        left: position.x + 10,
        top: position.y - 10,
        transform: 'translateY(-100%)'
      }}
    >
      <div className="text-sm">
        <div className="flex items-center space-x-2 mb-1">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: series.color }}
          ></div>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {series.name}
          </span>
        </div>
        <div className="text-gray-600 dark:text-gray-400">
          <div>{point.label}: <span className="font-medium">{point.value.toLocaleString()}</span></div>
          {point.timestamp && (
            <div className="text-xs mt-1">
              {point.timestamp.toLocaleString()}
            </div>
          )}
          {point.metadata && Object.keys(point.metadata).length > 0 && (
            <div className="text-xs mt-1 space-y-1">
              {Object.entries(point.metadata).map(([key, value]) => (
                <div key={key}>
                  {key}: <span className="font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface ChartLegendProps {
  series: ChartSeries[];
  onToggleSeries: (seriesId: string) => void;
}

const ChartLegend: React.FC<ChartLegendProps> = ({ series, onToggleSeries }) => {
  return (
    <div className="flex flex-wrap gap-4 mt-4">
      {series.map((s) => (
        <button
          key={s.id}
          onClick={() => onToggleSeries(s.id)}
          className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm transition-all ${
            s.visible !== false
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
          }`}
        >
          <div
            className={`w-3 h-3 rounded-full transition-opacity ${
              s.visible !== false ? 'opacity-100' : 'opacity-30'
            }`}
            style={{ backgroundColor: s.color }}
          ></div>
          <span>{s.name}</span>
          {s.visible !== false ? (
            <Eye className="h-3 w-3" />
          ) : (
            <EyeOff className="h-3 w-3" />
          )}
        </button>
      ))}
    </div>
  );
};

interface MockChartRendererProps {
  config: ChartConfig;
  onDataPointHover: (point: ChartDataPoint | null, series: ChartSeries | null, position: { x: number; y: number }) => void;
  onDataPointClick?: (point: ChartDataPoint, series: ChartSeries) => void;
}

const MockChartRenderer: React.FC<MockChartRendererProps> = ({ 
  config, 
  onDataPointHover, 
  onDataPointClick 
}) => {
  const visibleSeries = config.series.filter(s => s.visible !== false);
  const maxValue = Math.max(...visibleSeries.flatMap(s => s.data.map(d => d.value)));
  const minValue = Math.min(...visibleSeries.flatMap(s => s.data.map(d => d.value)));
  const valueRange = maxValue - minValue;

  const handleMouseMove = (e: React.MouseEvent, point: ChartDataPoint, series: ChartSeries) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onDataPointHover(point, series, { x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseLeave = () => {
    onDataPointHover(null, null, { x: 0, y: 0 });
  };

  const handleClick = (point: ChartDataPoint, series: ChartSeries) => {
    if (onDataPointClick) {
      onDataPointClick(point, series);
    }
  };

  if (config.type === 'pie') {
    const totalValue = visibleSeries[0]?.data.reduce((sum, point) => sum + point.value, 0) || 1;
    let currentAngle = 0;

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <svg width="300" height="300" className="overflow-visible">
          {visibleSeries[0]?.data.map((point, index) => {
            const percentage = point.value / totalValue;
            const angle = percentage * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle += angle;

            const startAngleRad = (startAngle * Math.PI) / 180;
            const endAngleRad = (endAngle * Math.PI) / 180;
            const radius = 120;
            const centerX = 150;
            const centerY = 150;

            const x1 = centerX + radius * Math.cos(startAngleRad);
            const y1 = centerY + radius * Math.sin(startAngleRad);
            const x2 = centerX + radius * Math.cos(endAngleRad);
            const y2 = centerY + radius * Math.sin(endAngleRad);

            const largeArcFlag = angle > 180 ? 1 : 0;

            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');

            return (
              <path
                key={index}
                d={pathData}
                fill={visibleSeries[0].color}
                fillOpacity={0.8 - (index * 0.1)}
                stroke="white"
                strokeWidth="2"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onMouseMove={(e) => handleMouseMove(e, point, visibleSeries[0])}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick(point, visibleSeries[0])}
              />
            );
          })}
        </svg>
      </div>
    );
  }

  // Line/Bar/Area charts
  const chartWidth = 600;
  const chartHeight = 300;
  const padding = 40;
  const dataPoints = visibleSeries[0]?.data.length || 0;
  const stepX = (chartWidth - 2 * padding) / Math.max(dataPoints - 1, 1);

  return (
    <div className="relative w-full h-full">
      <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight + 80}`} className="overflow-visible">
        {/* Grid lines */}
        {config.showGrid && (
          <g className="opacity-20">
            {[...Array(5)].map((_, i) => {
              const y = padding + (i * (chartHeight - 2 * padding)) / 4;
              return (
                <line
                  key={i}
                  x1={padding}
                  y1={y}
                  x2={chartWidth - padding}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="1"
                />
              );
            })}
            {visibleSeries[0]?.data.map((_, i) => {
              const x = padding + i * stepX;
              return (
                <line
                  key={i}
                  x1={x}
                  y1={padding}
                  x2={x}
                  y2={chartHeight - padding}
                  stroke="currentColor"
                  strokeWidth="1"
                />
              );
            })}
          </g>
        )}

        {/* Chart data */}
        {visibleSeries.map((series, seriesIndex) => {
          if (config.type === 'bar') {
            const barWidth = stepX * 0.6;
            return (
              <g key={series.id}>
                {series.data.map((point, pointIndex) => {
                  const x = padding + pointIndex * stepX - barWidth / 2;
                  const normalizedValue = (point.value - minValue) / valueRange;
                  const height = normalizedValue * (chartHeight - 2 * padding);
                  const y = chartHeight - padding - height;

                  return (
                    <rect
                      key={pointIndex}
                      x={x}
                      y={y}
                      width={barWidth}
                      height={height}
                      fill={series.color}
                      fillOpacity={0.8}
                      className="cursor-pointer hover:opacity-60 transition-opacity"
                      onMouseMove={(e) => handleMouseMove(e, point, series)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handleClick(point, series)}
                    />
                  );
                })}
              </g>
            );
          } else {
            // Line chart
            const pathData = series.data
              .map((point, index) => {
                const x = padding + index * stepX;
                const normalizedValue = (point.value - minValue) / valueRange;
                const y = chartHeight - padding - normalizedValue * (chartHeight - 2 * padding);
                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
              })
              .join(' ');

            return (
              <g key={series.id}>
                {config.type === 'area' && (
                  <path
                    d={`${pathData} L ${padding + (series.data.length - 1) * stepX} ${chartHeight - padding} L ${padding} ${chartHeight - padding} Z`}
                    fill={series.color}
                    fillOpacity={0.3}
                  />
                )}
                <path
                  d={pathData}
                  fill="none"
                  stroke={series.color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {series.data.map((point, pointIndex) => {
                  const x = padding + pointIndex * stepX;
                  const normalizedValue = (point.value - minValue) / valueRange;
                  const y = chartHeight - padding - normalizedValue * (chartHeight - 2 * padding);

                  return (
                    <circle
                      key={pointIndex}
                      cx={x}
                      cy={y}
                      r="4"
                      fill={series.color}
                      className="cursor-pointer hover:r-6 transition-all"
                      onMouseMove={(e) => handleMouseMove(e, point, series)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handleClick(point, series)}
                    />
                  );
                })}
              </g>
            );
          }
        })}

        {/* Axes labels */}
        {config.xAxisLabel && (
          <text
            x={chartWidth / 2}
            y={chartHeight + 60}
            textAnchor="middle"
            className="text-sm fill-current text-gray-600 dark:text-gray-400"
          >
            {config.xAxisLabel}
          </text>
        )}
        {config.yAxisLabel && (
          <text
            x={20}
            y={chartHeight / 2}
            textAnchor="middle"
            transform={`rotate(-90, 20, ${chartHeight / 2})`}
            className="text-sm fill-current text-gray-600 dark:text-gray-400"
          >
            {config.yAxisLabel}
          </text>
        )}

        {/* Data labels */}
        {visibleSeries[0]?.data.map((point, index) => {
          const x = padding + index * stepX;
          return (
            <text
              key={index}
              x={x}
              y={chartHeight - padding + 20}
              textAnchor="middle"
              className="text-xs fill-current text-gray-500 dark:text-gray-400"
            >
              {point.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export const InteractiveCharts: React.FC<InteractiveChartsProps> = ({
  config,
  onDataPointClick,
  onExport,
  onConfigChange,
  className = '',
  loading = false,
  error
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [tooltip, setTooltip] = useState<{
    point: ChartDataPoint | null;
    series: ChartSeries | null;
    position: { x: number; y: number };
    visible: boolean;
  }>({
    point: null,
    series: null,
    position: { x: 0, y: 0 },
    visible: false
  });

  const [localConfig, setLocalConfig] = useState<ChartConfig>(config);

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleDataPointHover = useCallback((
    point: ChartDataPoint | null,
    series: ChartSeries | null,
    position: { x: number; y: number }
  ) => {
    setTooltip({
      point,
      series,
      position,
      visible: point !== null && series !== null
    });
  }, []);

  const handleSeriesToggle = useCallback((seriesId: string) => {
    const updatedConfig = {
      ...localConfig,
      series: localConfig.series.map(s =>
        s.id === seriesId ? { ...s, visible: s.visible !== false ? false : true } : s
      )
    };
    setLocalConfig(updatedConfig);
    if (onConfigChange) {
      onConfigChange(updatedConfig);
    }
  }, [localConfig, onConfigChange]);

  const handleExport = useCallback((format: 'png' | 'svg' | 'pdf' | 'csv') => {
    if (onExport) {
      onExport(format);
    }
  }, [onExport]);

  const getChartIcon = () => {
    switch (localConfig.type) {
      case 'line':
        return <LineChart className="h-5 w-5" />;
      case 'bar':
        return <BarChart3 className="h-5 w-5" />;
      case 'pie':
        return <PieChart className="h-5 w-5" />;
      case 'area':
        return <Activity className="h-5 w-5" />;
      default:
        return <BarChart3 className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/3"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-700 p-6 ${className}`}>
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="font-medium">Chart Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className} ${
      isFullscreen ? 'fixed inset-4 z-50' : ''
    }`}>
      {/* Chart Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-blue-600 dark:text-blue-400">
              {getChartIcon()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {localConfig.title}
              </h3>
              {localConfig.subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {localConfig.subtitle}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {localConfig.timeRange && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                {localConfig.timeRange}
              </span>
            )}
            
            {onExport && (
              <div className="relative group">
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  <Download className="h-4 w-4" />
                </button>
                <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => handleExport('png')}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                    >
                      Export as PNG
                    </button>
                    <button
                      onClick={() => handleExport('svg')}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                    >
                      Export as SVG
                    </button>
                    <button
                      onClick={() => handleExport('pdf')}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                    >
                      Export as PDF
                    </button>
                    <button
                      onClick={() => handleExport('csv')}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                    >
                      Export Data (CSV)
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <Settings className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Chart Content */}
      <div className="p-6">
        <div 
          className="relative"
          style={{ height: localConfig.height || 400 }}
        >
          <MockChartRenderer
            config={localConfig}
            onDataPointHover={handleDataPointHover}
            onDataPointClick={onDataPointClick}
          />
          
          {/* Tooltip */}
          {tooltip.visible && tooltip.point && tooltip.series && (
            <ChartTooltip
              point={tooltip.point}
              series={tooltip.series}
              position={tooltip.position}
              visible={tooltip.visible}
            />
          )}
        </div>

        {/* Legend */}
        {localConfig.showLegend && localConfig.series.length > 1 && (
          <ChartLegend
            series={localConfig.series}
            onToggleSeries={handleSeriesToggle}
          />
        )}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900/50">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">Chart Settings</h4>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={localConfig.showGrid}
                onChange={(e) => {
                  const updatedConfig = { ...localConfig, showGrid: e.target.checked };
                  setLocalConfig(updatedConfig);
                  if (onConfigChange) onConfigChange(updatedConfig);
                }}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Show Grid</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={localConfig.showLegend}
                onChange={(e) => {
                  const updatedConfig = { ...localConfig, showLegend: e.target.checked };
                  setLocalConfig(updatedConfig);
                  if (onConfigChange) onConfigChange(updatedConfig);
                }}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Show Legend</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}; 