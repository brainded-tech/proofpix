import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string | number;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon | React.ReactNode;
  iconColor?: string;
  description?: string;
  loading?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  iconColor = 'text-blue-500',
  description,
  loading = false
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600 dark:text-green-400';
      case 'negative':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const renderIcon = () => {
    if (React.isValidElement(icon)) {
      return icon;
    }
    const IconComponent = icon as LucideIcon;
    return <IconComponent className={`h-8 w-8 ${iconColor}`} />;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {loading ? '...' : value}
          </p>
          {change && !loading && (
            <p className={`text-sm ${getChangeColor()} mt-1`}>
              {typeof change === 'number' ? `+${change}%` : change}
            </p>
          )}
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
        <div className="flex-shrink-0">
          {renderIcon()}
        </div>
      </div>
    </div>
  );
}; 