import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

// Enhanced Button Component
interface EnhancedButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button'
}) => {
  const baseClasses = 'pp-btn pp-focus-enhanced inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClasses = {
    primary: 'pp-btn-primary',
    secondary: 'pp-btn-secondary',
    outline: 'pp-btn-outline',
    ghost: 'pp-btn-ghost',
    glass: 'pp-btn-glass'
  };
  const sizeClasses = {
    xs: 'pp-btn-xs',
    sm: 'pp-btn-sm',
    md: 'pp-btn-md',
    lg: 'pp-btn-lg',
    xl: 'pp-btn-xl'
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {Icon && iconPosition === 'left' && !loading && <Icon className="w-4 h-4" />}
      {children}
      {Icon && iconPosition === 'right' && !loading && <Icon className="w-4 h-4" />}
    </motion.button>
  );
};

// Enhanced Card Component
interface EnhancedCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'elevated' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const EnhancedCard: React.FC<EnhancedCardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
  hover = false
}) => {
  const baseClasses = 'pp-card transition-all duration-300';
  const variantClasses = {
    default: '',
    glass: 'pp-card-glass',
    elevated: 'pp-card-elevated',
    interactive: 'pp-interactive-card cursor-pointer'
  };
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12'
  };

  const Component = onClick ? motion.div : 'div';
  const motionProps = onClick ? {
    whileHover: { y: -4, scale: 1.02 },
    whileTap: { scale: 0.98 },
    onClick
  } : {};

  return (
    <Component
      {...motionProps}
      className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </Component>
  );
};

// Enhanced Badge Component
interface EnhancedBadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  className?: string;
}

export const EnhancedBadge: React.FC<EnhancedBadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center gap-1 font-medium rounded-full border';
  const variantClasses = {
    primary: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    secondary: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    success: 'bg-green-500/10 text-green-400 border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    error: 'bg-red-500/10 text-red-400 border-red-500/20',
    info: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
  };
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
};

// Enhanced Input Component
interface EnhancedInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  error?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  className?: string;
}

export const EnhancedInput: React.FC<EnhancedInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
  disabled = false,
  required = false,
  icon: Icon,
  iconPosition = 'left',
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block pp-text-body-sm font-medium text-slate-300">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            pp-input w-full
            ${Icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${Icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${error ? 'pp-input-error' : ''}
          `}
        />
        {Icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      {error && (
        <p className="pp-text-body-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

// Enhanced Loading Spinner Component
interface EnhancedSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
}

export const EnhancedSpinner: React.FC<EnhancedSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };
  const colorClasses = {
    primary: 'border-blue-500 border-t-transparent',
    secondary: 'border-emerald-500 border-t-transparent',
    white: 'border-white border-t-transparent'
  };

  return (
    <div
      className={`
        border-2 rounded-full animate-spin
        ${sizeClasses[size]}
        ${colorClasses[color]}
        ${className}
      `}
    />
  );
};

// Enhanced Progress Bar Component
interface EnhancedProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  className?: string;
}

export const EnhancedProgress: React.FC<EnhancedProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  color = 'primary',
  showLabel = false,
  className = ''
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };
  const colorClasses = {
    primary: 'bg-blue-500',
    secondary: 'bg-emerald-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && (
        <div className="flex justify-between pp-text-body-sm text-slate-400">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-700 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <motion.div
          className={`h-full ${colorClasses[color]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

// Enhanced Tooltip Component
interface EnhancedTooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const EnhancedTooltip: React.FC<EnhancedTooltipProps> = ({
  children,
  content,
  position = 'top',
  className = ''
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={`
            absolute z-50 px-3 py-2 pp-text-body-sm text-white bg-slate-800 rounded-lg shadow-lg border border-slate-700
            ${positionClasses[position]}
          `}
        >
          {content}
        </motion.div>
      )}
    </div>
  );
}; 