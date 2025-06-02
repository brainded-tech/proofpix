/**
 * Data Visualization Components
 * Charts, metrics, and dashboard widgets for better data presentation
 */

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Activity, 
  Users, 
  FileText, 
  Shield,
  Eye,
  Download,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
  className?: string;
}

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface LineChartProps {
  data: Array<{ label: string; value: number }>;
  title?: string;
  height?: number;
  color?: string;
  showGrid?: boolean;
  className?: string;
}

interface BarChartProps {
  data: ChartDataPoint[];
  title?: string;
  height?: number;
  horizontal?: boolean;
  className?: string;
}

interface PieChartProps {
  data: ChartDataPoint[];
  title?: string;
  size?: number;
  showLegend?: boolean;
  className?: string;
}

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red';
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  className?: string;
}

// Metric Card Component
export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  color = 'blue',
  className = ''
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    gray: 'bg-gray-50 border-gray-200 text-gray-700'
  };

  const iconColorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    yellow: 'text-yellow-500',
    red: 'text-red-500',
    purple: 'text-purple-500',
    gray: 'text-gray-500'
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          
          {change && (
            <div className="flex items-center mt-2">
              {change.type === 'increase' ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                change.type === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {change.value}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs {change.period}</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
            <div className={iconColorClasses[color]}>
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Simple Line Chart Component
export const SimpleLineChart: React.FC<LineChartProps> = ({
  data,
  title,
  height = 200,
  color = '#3B82F6',
  showGrid = true,
  className = ''
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((point.value - minValue) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      
      <div className="relative" style={{ height }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0"
        >
          {showGrid && (
            <g className="text-gray-200">
              {[0, 25, 50, 75, 100].map(y => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="100"
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              ))}
            </g>
          )}
          
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2"
            points={points}
            vectorEffect="non-scaling-stroke"
          />
          
          {/* Data points */}
          {data.map((point, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((point.value - minValue) / range) * 100;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill={color}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>
        
        {/* Labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 mt-2">
          {data.map((point, index) => (
            <span key={index} className="text-center">
              {point.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Simple Bar Chart Component
export const SimpleBarChart: React.FC<BarChartProps> = ({
  data,
  title,
  height = 200,
  horizontal = false,
  className = ''
}) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      
      <div className="space-y-3" style={{ height }}>
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-20 text-sm text-gray-600 text-right">
              {item.label}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
              <div
                className="h-6 rounded-full transition-all duration-500"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color || '#3B82F6'
                }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Progress Bar Component
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  color = 'blue',
  size = 'md',
  showPercentage = true,
  className = ''
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500'
  };

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className={className}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercentage && (
            <span className="text-sm text-gray-500">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      
      <div className={`bg-gray-200 rounded-full ${sizeClasses[size]}`}>
        <div
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Activity Feed Component
export const ActivityFeed: React.FC<{
  activities: Array<{
    id: string;
    type: 'upload' | 'process' | 'download' | 'share' | 'error';
    message: string;
    timestamp: Date;
    user?: string;
  }>;
  className?: string;
}> = ({ activities, className = '' }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'upload':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'process':
        return <Activity className="w-4 h-4 text-green-500" />;
      case 'download':
        return <Download className="w-4 h-4 text-purple-500" />;
      case 'share':
        return <Users className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              {getIcon(activity.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{activity.message}</p>
              <div className="flex items-center space-x-2 mt-1">
                {activity.user && (
                  <span className="text-xs text-gray-500">{activity.user}</span>
                )}
                <span className="text-xs text-gray-400">
                  {formatTime(activity.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Stats Grid Component
export const StatsGrid: React.FC<{
  stats: Array<{
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
    change?: {
      value: number;
      type: 'increase' | 'decrease';
      period: string;
    };
  }>;
  columns?: 2 | 3 | 4;
  className?: string;
}> = ({ stats, columns = 4, className = '' }) => {
  const gridClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid gap-6 ${gridClasses[columns]} ${className}`}>
      {stats.map((stat, index) => (
        <MetricCard
          key={index}
          title={stat.label}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          change={stat.change}
        />
      ))}
    </div>
  );
};

// Usage Analytics Component
export const UsageAnalytics: React.FC<{
  data: {
    totalUploads: number;
    totalProcessed: number;
    totalUsers: number;
    successRate: number;
    recentActivity: Array<{ label: string; value: number }>;
  };
  className?: string;
}> = ({ data, className = '' }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <StatsGrid
        stats={[
          {
            label: 'Total Uploads',
            value: data.totalUploads.toLocaleString(),
            icon: <FileText className="w-6 h-6" />,
            color: 'blue'
          },
          {
            label: 'Processed Images',
            value: data.totalProcessed.toLocaleString(),
            icon: <Activity className="w-6 h-6" />,
            color: 'green'
          },
          {
            label: 'Active Users',
            value: data.totalUsers.toLocaleString(),
            icon: <Users className="w-6 h-6" />,
            color: 'purple'
          },
          {
            label: 'Success Rate',
            value: `${data.successRate}%`,
            icon: <CheckCircle className="w-6 h-6" />,
            color: 'green'
          }
        ]}
      />
      
      <SimpleLineChart
        data={data.recentActivity}
        title="Processing Activity (Last 7 Days)"
        height={250}
        color="#10B981"
        showGrid={true}
      />
    </div>
  );
};

export default {
  MetricCard,
  SimpleLineChart,
  SimpleBarChart,
  ProgressBar,
  ActivityFeed,
  StatsGrid,
  UsageAnalytics
}; 