import React from 'react';
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

interface AdvancedChartsProps {
  data?: ChartData;
  type: 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'gauge' | 'heatmap' | 'treemap';
  title?: string;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  animate?: boolean;
  value?: number;
  max?: number;
  options?: any;
  loading?: boolean;
  color?: string;
}

export const AdvancedCharts: React.FC<AdvancedChartsProps> = ({
  data,
  type,
  title = 'Chart',
  height = 300,
  showLegend = true,
  showGrid = true,
  animate = true,
  value = 0,
  max = 100,
  options = {},
  loading = false,
  color
}) => {
  // Mock chart implementation - in a real app, you'd use a charting library like Chart.js or Recharts
  const getChartIcon = () => {
    switch (type) {
      case 'bar':
        return <BarChart3 className="h-8 w-8 text-blue-500" />;
      case 'line':
        return <TrendingUp className="h-8 w-8 text-green-500" />;
      case 'pie':
        return <PieChart className="h-8 w-8 text-purple-500" />;
      case 'area':
        return <Activity className="h-8 w-8 text-orange-500" />;
      default:
        return <BarChart3 className="h-8 w-8 text-gray-500" />;
    }
  };

  const getMaxValue = () => {
    if (!data || !data.datasets.length) return 100;
    return Math.max(...data.datasets.flatMap(dataset => dataset.data));
  };

  const renderBarChart = () => {
    if (!data) return <div className="flex items-center justify-center h-full text-gray-500">No data available</div>;
    
    const maxValue = getMaxValue();
    
    return (
      <div className="flex items-end justify-between h-full space-x-2 px-4">
        {data.labels.map((label, index) => (
          <div key={label} className="flex flex-col items-center flex-1">
            <div className="flex flex-col justify-end h-full space-y-1">
              {data.datasets.map((dataset, datasetIndex) => {
                const value = dataset.data[index];
                const height = (value / maxValue) * 100;
                return (
                  <div
                    key={datasetIndex}
                    className={`w-full rounded-t transition-all duration-500 ${
                      animate ? 'animate-pulse' : ''
                    }`}
                    style={{
                      height: `${height}%`,
                      backgroundColor: Array.isArray(dataset.backgroundColor) 
                        ? dataset.backgroundColor[index] || dataset.backgroundColor[0]
                        : dataset.backgroundColor || '#3B82F6',
                      minHeight: '4px'
                    }}
                    title={`${dataset.label}: ${value}`}
                  />
                );
              })}
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
              {label}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderLineChart = () => {
    if (!data) return <div className="flex items-center justify-center h-full text-gray-500">No data available</div>;
    
    const maxValue = getMaxValue();
    
    return (
      <div className="relative h-full p-4">
        <svg className="w-full h-full" viewBox="0 0 400 200">
          {showGrid && (
            <g className="grid">
              {[0, 1, 2, 3, 4].map(i => (
                <line
                  key={i}
                  x1="0"
                  y1={i * 40}
                  x2="400"
                  y2={i * 40}
                  stroke="currentColor"
                  strokeOpacity="0.1"
                  className="text-gray-400"
                />
              ))}
            </g>
          )}
          {data.datasets.map((dataset, datasetIndex) => {
            const points = dataset.data.map((value, index) => {
              const x = (index / (data.labels.length - 1)) * 380 + 10;
              const y = 180 - (value / maxValue) * 160;
              return `${x},${y}`;
            }).join(' ');
            
            return (
              <polyline
                key={datasetIndex}
                points={points}
                fill="none"
                stroke={dataset.borderColor || '#3B82F6'}
                strokeWidth={dataset.borderWidth || 2}
                className={animate ? 'animate-pulse' : ''}
              />
            );
          })}
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4">
          {data.labels.map(label => (
            <span key={label} className="text-xs text-gray-600 dark:text-gray-400">
              {label}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderPieChart = () => {
    if (!data || !data.datasets[0]) return <div className="flex items-center justify-center h-full text-gray-500">No data available</div>;
    
    const total = data.datasets[0]?.data.reduce((sum, value) => sum + value, 0) || 1;
    let currentAngle = 0;
    
    return (
      <div className="flex items-center justify-center h-full">
        <div className="relative">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {data.datasets[0]?.data.map((value, index) => {
              const percentage = value / total;
              const angle = percentage * 360;
              const startAngle = currentAngle;
              const endAngle = currentAngle + angle;
              
              const x1 = 100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180);
              const y1 = 100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180);
              const x2 = 100 + 80 * Math.cos((endAngle - 90) * Math.PI / 180);
              const y2 = 100 + 80 * Math.sin((endAngle - 90) * Math.PI / 180);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const pathData = [
                `M 100 100`,
                `L ${x1} ${y1}`,
                `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');
              
              currentAngle += angle;
              
              return (
                <path
                  key={index}
                  d={pathData}
                  fill={Array.isArray(data.datasets[0].backgroundColor) 
                    ? data.datasets[0].backgroundColor[index] 
                    : `hsl(${index * 60}, 70%, 50%)`}
                  className={animate ? 'animate-pulse' : ''}
                />
              );
            })}
          </svg>
          {showLegend && (
            <div className="absolute -right-32 top-0 space-y-2">
              {data.labels.map((label, index) => (
                <div key={label} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{
                      backgroundColor: Array.isArray(data.datasets[0]?.backgroundColor) 
                        ? data.datasets[0].backgroundColor[index] 
                        : `hsl(${index * 60}, 70%, 50%)`
                    }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return renderBarChart();
      case 'line':
      case 'area':
        return renderLineChart();
      case 'pie':
        return renderPieChart();
      case 'gauge':
        return renderGaugeChart();
      case 'heatmap':
        return renderHeatmapChart();
      case 'treemap':
        return renderTreemapChart();
      case 'scatter':
        return renderScatterChart();
      default:
        return renderBarChart();
    }
  };

  const renderGaugeChart = () => {
    const percentage = (value / max) * 100;
    const angle = (percentage / 100) * 180;
    
    return (
      <div className="flex items-center justify-center h-full">
        <div className="relative">
          <svg width="200" height="120" viewBox="0 0 200 120">
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="20"
              strokeLinecap="round"
            />
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke={color || "#3B82F6"}
              strokeWidth="20"
              strokeLinecap="round"
              strokeDasharray={`${(angle / 180) * 251.3} 251.3`}
              className={animate ? 'animate-pulse' : ''}
            />
            <text x="100" y="90" textAnchor="middle" className="text-2xl font-bold fill-gray-900 dark:fill-white">
              {Math.round(percentage)}%
            </text>
          </svg>
        </div>
      </div>
    );
  };

  const renderHeatmapChart = () => {
    const mockData = Array.from({ length: 7 }, (_, i) => 
      Array.from({ length: 24 }, (_, j) => Math.random() * 100)
    );
    
    return (
      <div className="p-4">
        <div className="grid grid-cols-24 gap-1">
          {mockData.flat().map((value, index) => (
            <div
              key={index}
              className="w-3 h-3 rounded"
              style={{
                backgroundColor: `rgba(59, 130, 246, ${value / 100})`,
              }}
              title={`Value: ${Math.round(value)}`}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderTreemapChart = () => {
    const mockData = [
      { name: 'Category A', value: 40, color: '#3B82F6' },
      { name: 'Category B', value: 30, color: '#10B981' },
      { name: 'Category C', value: 20, color: '#F59E0B' },
      { name: 'Category D', value: 10, color: '#EF4444' },
    ];
    
    return (
      <div className="grid grid-cols-2 gap-2 h-full p-4">
        {mockData.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-center text-white font-semibold rounded"
            style={{
              backgroundColor: item.color,
              height: `${item.value * 2}px`,
            }}
          >
            <div className="text-center">
              <div className="text-sm">{item.name}</div>
              <div className="text-xs">{item.value}%</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderScatterChart = () => {
    const mockPoints = Array.from({ length: 20 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    
    return (
      <div className="relative h-full p-4">
        <svg className="w-full h-full" viewBox="0 0 400 300">
          {showGrid && (
            <g className="grid">
              {[0, 1, 2, 3, 4, 5].map(i => (
                <g key={i}>
                  <line
                    x1="0"
                    y1={i * 50}
                    x2="400"
                    y2={i * 50}
                    stroke="currentColor"
                    strokeOpacity="0.1"
                    className="text-gray-400"
                  />
                  <line
                    x1={i * 80}
                    y1="0"
                    x2={i * 80}
                    y2="300"
                    stroke="currentColor"
                    strokeOpacity="0.1"
                    className="text-gray-400"
                  />
                </g>
              ))}
            </g>
          )}
          {mockPoints.map((point, index) => (
            <circle
              key={index}
              cx={(point.x / 100) * 380 + 10}
              cy={280 - (point.y / 100) * 260}
              r="4"
              fill="#3B82F6"
              className={animate ? 'animate-pulse' : ''}
            />
          ))}
        </svg>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        {getChartIcon()}
      </div>
      
      <div style={{ height: `${height}px` }} className="relative">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          renderChart()
        )}
      </div>
      
      {showLegend && type !== 'pie' && !loading && data && (
        <div className="mt-4 flex flex-wrap gap-4">
          {data.datasets.map((dataset, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded"
                style={{
                  backgroundColor: Array.isArray(dataset.backgroundColor) 
                    ? dataset.backgroundColor[0] 
                    : dataset.backgroundColor || '#3B82F6'
                }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">{dataset.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 