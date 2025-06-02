import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, Check, AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react';

// 🎯 MODERN ENTERPRISE BUTTON COMPONENT
interface EnterpriseButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'danger' | 'premium';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactElement;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  gradient?: boolean;
  glow?: boolean;
}

export const EnterpriseButton: React.FC<EnterpriseButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  children,
  onClick,
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
  fullWidth = false,
  gradient = false,
  glow = false
}) => {
  const baseClasses = 'btn-enterprise';
  const variantClasses = `btn-enterprise-${variant}`;
  const sizeClasses = size !== 'md' ? `btn-enterprise-${size}` : '';
  const fullWidthClasses = fullWidth ? 'w-full' : '';
  const glowClasses = glow ? 'enterprise-glow' : '';
  
  const classes = [baseClasses, variantClasses, sizeClasses, fullWidthClasses, glowClasses, className]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      whileTap={{ scale: disabled ? 1 : 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {loading && (
        <div className="enterprise-animate-spin w-4 h-4">
          <div className="w-full h-full border-2 border-current border-t-transparent rounded-full"></div>
        </div>
      )}
      {!loading && icon && iconPosition === 'left' && (
        <span className="flex-shrink-0">{icon}</span>
      )}
      {!loading && <span>{children}</span>}
      {!loading && icon && iconPosition === 'right' && (
        <span className="flex-shrink-0">{icon}</span>
      )}
    </motion.button>
  );
};

// 🎴 MODERN ENTERPRISE CARD COMPONENT
interface EnterpriseCardProps {
  variant?: 'light' | 'dark' | 'premium' | 'glass';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  interactive?: boolean;
  glow?: boolean;
  gradient?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
}

export const EnterpriseCard: React.FC<EnterpriseCardProps> = ({
  variant = 'light',
  children,
  className = '',
  onClick,
  hover = true,
  interactive = false,
  glow = false,
  gradient = false,
  padding = 'md'
}) => {
  const baseClasses = 'enterprise-card';
  const variantClasses = variant !== 'light' ? `enterprise-card-${variant}` : '';
  const hoverClasses = hover ? '' : 'hover:transform-none hover:shadow-none';
  const interactiveClasses = interactive ? 'enterprise-card-interactive' : '';
  const glowClasses = glow ? 'enterprise-glow' : '';
  const paddingClasses = padding !== 'md' ? `p-${padding === 'sm' ? '4' : padding === 'lg' ? '8' : '10'}` : '';
  
  const classes = [baseClasses, variantClasses, hoverClasses, interactiveClasses, glowClasses, paddingClasses, className]
    .filter(Boolean)
    .join(' ');

  const CardComponent = interactive ? motion.div : 'div';
  const motionProps = interactive ? {
    whileHover: { scale: 1.01, y: -1 },
    whileTap: { scale: 0.99 },
    transition: { type: "spring", stiffness: 400, damping: 25 }
  } : {};

  return (
    <CardComponent 
      className={classes} 
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </CardComponent>
  );
};

// 📝 MODERN ENTERPRISE INPUT COMPONENT
interface EnterpriseInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  variant?: 'light' | 'dark';
  icon?: React.ReactElement;
  iconPosition?: 'left' | 'right';
  error?: string;
  success?: boolean;
  label?: string;
  helpText?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const EnterpriseInput: React.FC<EnterpriseInputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  required = false,
  className = '',
  variant = 'light',
  icon,
  iconPosition = 'left',
  error,
  success = false,
  label,
  helpText,
  size = 'md'
}) => {
  const [focused, setFocused] = useState(false);
  
  const baseClasses = 'enterprise-input';
  const variantClasses = variant === 'dark' ? 'enterprise-input-dark' : '';
  const sizeClasses = size !== 'md' ? `enterprise-input-${size}` : '';
  const errorClasses = error ? 'border-red-500 focus:border-red-500' : '';
  const successClasses = success ? 'border-green-500 focus:border-green-500' : '';
  
  const classes = [baseClasses, variantClasses, sizeClasses, errorClasses, successClasses, className]
    .filter(Boolean)
    .join(' ');

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <div className="enterprise-input-wrapper space-y-1">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
            {React.cloneElement(icon, { className: 'w-4 h-4' })}
          </div>
        )}
        
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        disabled={disabled}
        required={required}
          className={`${classes} ${icon && iconPosition === 'left' ? 'pl-10' : ''} ${icon && iconPosition === 'right' ? 'pr-10' : ''}`}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
            {React.cloneElement(icon, { className: 'w-4 h-4' })}
          </div>
        )}
        
        {error && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
            <AlertCircle className="w-4 h-4" />
          </div>
        )}
        
        {success && !error && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
            <CheckCircle className="w-4 h-4" />
          </div>
        )}
      </div>
      
      {(error || helpText) && (
        <div className="text-xs">
          {error && <span className="text-red-600">{error}</span>}
          {!error && helpText && <span className="text-slate-500">{helpText}</span>}
        </div>
      )}
    </div>
  );
};

// 📝 MODERN ENTERPRISE TEXTAREA COMPONENT
interface EnterpriseTextareaProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  className?: string;
  variant?: 'light' | 'dark';
  error?: string;
  success?: boolean;
  label?: string;
  helpText?: string;
  resize?: boolean;
}

export const EnterpriseTextarea: React.FC<EnterpriseTextareaProps> = ({
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  rows = 4,
  className = '',
  variant = 'light',
  error,
  success = false,
  label,
  helpText,
  resize = true
}) => {
  const baseClasses = 'enterprise-input enterprise-textarea';
  const variantClasses = variant === 'dark' ? 'enterprise-input-dark' : '';
  const errorClasses = error ? 'border-red-500 focus:border-red-500' : '';
  const successClasses = success ? 'border-green-500 focus:border-green-500' : '';
  const resizeClasses = resize ? 'resize-y' : 'resize-none';
  
  const classes = [baseClasses, variantClasses, errorClasses, successClasses, resizeClasses, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="enterprise-input-wrapper space-y-1">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      rows={rows}
      className={classes}
    />
      
      {(error || helpText) && (
        <div className="text-xs">
          {error && <span className="text-red-600">{error}</span>}
          {!error && helpText && <span className="text-slate-500">{helpText}</span>}
        </div>
      )}
    </div>
  );
};

// 🔽 MODERN ENTERPRISE SELECT COMPONENT
interface EnterpriseSelectProps {
  options: { value: string; label: string; disabled?: boolean }[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  variant?: 'light' | 'dark';
  error?: string;
  success?: boolean;
  label?: string;
  helpText?: string;
  searchable?: boolean;
}

export const EnterpriseSelect: React.FC<EnterpriseSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  disabled = false,
  required = false,
  className = '',
  variant = 'light',
  error,
  success = false,
  label,
  helpText,
  searchable = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const selectedOption = options.find(option => option.value === value);

  const baseClasses = 'enterprise-input enterprise-select';
  const variantClasses = variant === 'dark' ? 'enterprise-input-dark' : '';
  const errorClasses = error ? 'border-red-500 focus:border-red-500' : '';
  const successClasses = success ? 'border-green-500 focus:border-green-500' : '';
  
  const classes = [baseClasses, variantClasses, errorClasses, successClasses, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="enterprise-input-wrapper space-y-1">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative" ref={selectRef}>
        <button
          type="button"
          className={`${classes} flex items-center justify-between w-full text-left`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <span className={selectedOption ? 'text-slate-900' : 'text-slate-400'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto"
            >
              {searchable && (
                <div className="p-2 border-b border-slate-200">
                  <input
                    type="text"
                    placeholder="Search options..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              
              <div className="py-1">
                {filteredOptions.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-slate-500">No options found</div>
                ) : (
                  filteredOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-50 focus:bg-slate-50 focus:outline-none ${
                        option.disabled ? 'text-slate-400 cursor-not-allowed' : 'text-slate-900'
                      } ${value === option.value ? 'bg-blue-50 text-blue-600' : ''}`}
                      onClick={() => !option.disabled && handleSelect(option.value)}
                      disabled={option.disabled}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option.label}</span>
                        {value === option.value && <Check className="w-4 h-4" />}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {(error || helpText) && (
        <div className="text-xs">
          {error && <span className="text-red-600">{error}</span>}
          {!error && helpText && <span className="text-slate-500">{helpText}</span>}
        </div>
      )}
    </div>
  );
};

// 🏷️ MODERN ENTERPRISE BADGE COMPONENT
interface EnterpriseBadgeProps {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'premium';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactElement;
  className?: string;
  pulse?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

export const EnterpriseBadge: React.FC<EnterpriseBadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  children,
  icon,
  className = '',
  pulse = false,
  removable = false,
  onRemove
}) => {
  const baseClasses = 'enterprise-badge';
  const variantClasses = `enterprise-badge-${variant}`;
  const sizeClasses = size !== 'md' ? `text-${size === 'sm' ? 'xs' : 'sm'}` : '';
  const pulseClasses = pulse ? 'animate-pulse' : '';
  
  const classes = [baseClasses, variantClasses, sizeClasses, pulseClasses, className]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes}>
      {icon && React.cloneElement(icon, { className: 'w-3 h-3' })}
      <span>{children}</span>
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

// 📊 MODERN ENTERPRISE METRIC COMPONENT
interface EnterpriseMetricProps {
  value: string | number;
  label: string;
  variant?: 'light' | 'dark';
  className?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactElement;
  color?: 'blue' | 'green' | 'purple' | 'red' | 'orange';
}

export const EnterpriseMetric: React.FC<EnterpriseMetricProps> = ({
  value,
  label,
  variant = 'light',
  className = '',
  trend,
  trendValue,
  icon,
  color = 'blue'
}) => {
  const baseClasses = 'enterprise-metric';
  const variantClasses = variant === 'dark' ? 'enterprise-metric-dark' : '';
  
  const classes = [baseClasses, variantClasses, className]
    .filter(Boolean)
    .join(' ');

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-slate-500';
    }
  };

  const getIconColor = () => {
    switch (color) {
      case 'green': return 'text-green-600';
      case 'purple': return 'text-purple-600';
      case 'red': return 'text-red-600';
      case 'orange': return 'text-orange-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <div className={classes}>
      {icon && (
        <div className={`mb-2 ${getIconColor()}`}>
          {React.cloneElement(icon, { className: 'w-5 h-5' })}
        </div>
      )}
      <div className="enterprise-metric-value">{value}</div>
      <div className="enterprise-metric-label">{label}</div>
      {trend && trendValue && (
        <div className={`text-xs mt-1 ${getTrendColor()}`}>
          {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {trendValue}
        </div>
      )}
    </div>
  );
};

// 🧭 MODERN ENTERPRISE NAV LINK COMPONENT
interface EnterpriseNavLinkProps {
  href?: string;
  onClick?: () => void;
  active?: boolean;
  variant?: 'light' | 'dark';
  icon?: React.ReactElement;
  children: React.ReactNode;
  className?: string;
  badge?: string | number;
  disabled?: boolean;
}

export const EnterpriseNavLink: React.FC<EnterpriseNavLinkProps> = ({
  href,
  onClick,
  active = false,
  variant = 'light',
  icon,
  children,
  className = '',
  badge,
  disabled = false
}) => {
  const baseClasses = 'enterprise-nav-link';
  const variantClasses = variant === 'dark' ? 'enterprise-nav-link-dark' : '';
  const activeClasses = active ? 'enterprise-nav-link-active' : '';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  const classes = [baseClasses, variantClasses, activeClasses, disabledClasses, className]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {icon && React.cloneElement(icon, { className: 'w-4 h-4' })}
      <span>{children}</span>
      {badge && (
        <span className="ml-auto bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </>
  );

  if (href && !disabled) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={!disabled ? onClick : undefined}
      className={classes}
      disabled={disabled}
    >
      {content}
    </button>
  );
};

// 🏗️ MODERN ENTERPRISE SECTION COMPONENT
interface EnterpriseSectionProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  className?: string;
  background?: 'transparent' | 'light' | 'dark' | 'gradient';
  container?: boolean;
}

export const EnterpriseSection: React.FC<EnterpriseSectionProps> = ({
  size = 'md',
  children,
  className = '',
  background = 'transparent',
  container = true
}) => {
  const sizeClasses = size !== 'md' ? `enterprise-section-${size}` : 'enterprise-section';
  const backgroundClasses = background !== 'transparent' ? `bg-${background === 'light' ? 'slate-50' : background === 'dark' ? 'slate-900' : 'gradient-to-br from-blue-50 to-purple-50'}` : '';
  const containerClasses = container ? 'enterprise-container' : '';
  
  const classes = [sizeClasses, backgroundClasses, className]
    .filter(Boolean)
    .join(' ');

  return (
    <section className={classes}>
      {container ? (
        <div className={containerClasses}>
        {children}
      </div>
      ) : (
        children
      )}
    </section>
  );
};

// 🏗️ MODERN ENTERPRISE GRID COMPONENT
interface EnterpriseGridProps {
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  className?: string;
  responsive?: boolean;
}

export const EnterpriseGrid: React.FC<EnterpriseGridProps> = ({
  columns = 3,
  gap = 'md',
  children,
  className = '',
  responsive = true
}) => {
  const baseClasses = 'enterprise-grid';
  const columnClasses = `enterprise-grid-${columns}`;
  const gapClasses = gap !== 'md' ? `gap-${gap === 'sm' ? '4' : gap === 'lg' ? '8' : '10'}` : '';
  
  const classes = [baseClasses, columnClasses, gapClasses, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

// 🦸 MODERN ENTERPRISE HERO COMPONENT
interface EnterpriseHeroProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const EnterpriseHero: React.FC<EnterpriseHeroProps> = ({
  children,
  className = '',
  variant = 'default',
  size = 'lg'
}) => {
  const baseClasses = 'enterprise-hero';
  const variantClasses = variant !== 'default' ? `enterprise-hero-${variant}` : '';
  const sizeClasses = size !== 'lg' ? `py-${size === 'sm' ? '12' : size === 'md' ? '16' : '24'}` : '';
  
  const classes = [baseClasses, variantClasses, sizeClasses, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <div className="enterprise-hero-content">
          {children}
        </div>
      </div>
  );
};

// 📱 MODERN ENTERPRISE MOBILE MENU COMPONENT
interface EnterpriseMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: 'light' | 'dark';
  children: React.ReactNode;
  title?: string;
}

export const EnterpriseMobileMenu: React.FC<EnterpriseMobileMenuProps> = ({
  isOpen,
  onClose,
  variant = 'light',
  children,
  title
}) => {
  const baseClasses = 'enterprise-mobile-menu';
  const variantClasses = variant === 'dark' ? 'enterprise-mobile-menu-dark' : '';
  const openClasses = isOpen ? 'open' : '';
  
  const classes = [baseClasses, variantClasses, openClasses]
    .filter(Boolean)
    .join(' ');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <div className={classes} onClick={onClose}>
      <div className="enterprise-mobile-menu-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ⏳ MODERN ENTERPRISE LOADING COMPONENT
interface EnterpriseLoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'primary';
  text?: string;
  overlay?: boolean;
}

export const EnterpriseLoading: React.FC<EnterpriseLoadingProps> = ({
  size = 'md',
  variant = 'light',
  text = 'Loading...',
  overlay = false
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    light: 'text-slate-600',
    dark: 'text-white',
    primary: 'text-blue-600'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className={`enterprise-animate-spin ${sizeClasses[size]} ${colorClasses[variant]}`}>
        <div className="w-full h-full border-2 border-current border-t-transparent rounded-full"></div>
      </div>
      {text && (
        <p className={`text-sm font-medium ${colorClasses[variant]}`}>
          {text}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
};

// 🚨 MODERN ENTERPRISE ALERT COMPONENT
interface EnterpriseAlertProps {
  variant?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactElement;
  onClose?: () => void;
  className?: string;
  dismissible?: boolean;
}

export const EnterpriseAlert: React.FC<EnterpriseAlertProps> = ({
  variant = 'info',
  title,
  children,
  icon,
  onClose,
  className = '',
  dismissible = false
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const variantStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    danger: 'bg-red-50 border-red-200 text-red-800'
  };

  const iconStyles = {
    info: 'text-blue-500',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    danger: 'text-red-500'
  };

  const defaultIcons = {
    info: <Info className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    danger: <XCircle className="w-5 h-5" />
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`border rounded-lg p-4 ${variantStyles[variant]} ${className}`}
    >
      <div className="flex items-start">
        <div className={`flex-shrink-0 ${iconStyles[variant]}`}>
          {icon || defaultIcons[variant]}
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-semibold mb-1">
              {title}
            </h3>
          )}
          <div className="text-sm">
            {children}
          </div>
        </div>
        {dismissible && (
          <button
            onClick={handleClose}
            className="flex-shrink-0 ml-3 hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

// 💬 MODERN ENTERPRISE TOOLTIP COMPONENT
interface EnterpriseTooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export const EnterpriseTooltip: React.FC<EnterpriseTooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 500
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 px-3 py-2 text-sm text-white bg-slate-900 rounded-lg shadow-lg whitespace-nowrap ${positionClasses[position]}`}
          >
        {content}
            <div className={`absolute w-2 h-2 bg-slate-900 transform rotate-45 ${
              position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' :
              position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' :
              position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' :
              'right-full top-1/2 -translate-y-1/2 -mr-1'
            }`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 🪟 MODERN ENTERPRISE MODAL COMPONENT
interface EnterpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlay?: boolean;
  showCloseButton?: boolean;
}

export const EnterpriseModal: React.FC<EnterpriseModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlay = true,
  showCloseButton = true
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={closeOnOverlay ? onClose : undefined}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`relative bg-white rounded-xl shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden`}
          >
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
        {title && (
                  <h2 className="text-xl font-semibold text-slate-900">
                    {title}
                  </h2>
                )}
                {showCloseButton && (
            <button
              onClick={onClose}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
                    <X className="w-5 h-5" />
            </button>
                )}
          </div>
        )}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}; 