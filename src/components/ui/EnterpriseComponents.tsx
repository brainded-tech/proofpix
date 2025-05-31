import React from 'react';
import { LucideIcon } from 'lucide-react';

// 🎯 ENTERPRISE BUTTON COMPONENT
interface EnterpriseButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactElement;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const EnterpriseButton: React.FC<EnterpriseButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  children,
  onClick,
  disabled = false,
  className = '',
  type = 'button'
}) => {
  const baseClasses = 'btn-enterprise';
  const variantClasses = `btn-enterprise-${variant}`;
  const sizeClasses = size !== 'md' ? `btn-enterprise-${size}` : '';
  
  const classes = [baseClasses, variantClasses, sizeClasses, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && iconPosition === 'left' && icon}
      {children}
      {icon && iconPosition === 'right' && icon}
    </button>
  );
};

// 🎨 ENTERPRISE CARD COMPONENT
interface EnterpriseCardProps {
  variant?: 'light' | 'dark';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const EnterpriseCard: React.FC<EnterpriseCardProps> = ({
  variant = 'light',
  children,
  className = '',
  onClick,
  hover = true
}) => {
  const baseClasses = 'enterprise-card';
  const variantClasses = variant === 'dark' ? 'enterprise-card-dark' : '';
  const hoverClasses = hover ? '' : 'hover:transform-none hover:shadow-none';
  
  const classes = [baseClasses, variantClasses, hoverClasses, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};

// 📝 ENTERPRISE INPUT COMPONENT
interface EnterpriseInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  variant?: 'light' | 'dark';
  icon?: React.ReactElement;
  iconPosition?: 'left' | 'right';
}

export const EnterpriseInput: React.FC<EnterpriseInputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  className = '',
  variant = 'light',
  icon,
  iconPosition = 'left'
}) => {
  const baseClasses = 'enterprise-input';
  const variantClasses = variant === 'dark' ? 'enterprise-input-dark' : '';
  const iconClasses = icon ? `enterprise-input-${iconPosition}-icon` : '';
  
  const classes = [baseClasses, variantClasses, iconClasses, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="enterprise-input-wrapper">
      {icon && iconPosition === 'left' && icon}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={classes}
      />
      {icon && iconPosition === 'right' && icon}
    </div>
  );
};

// 📝 ENTERPRISE TEXTAREA COMPONENT
interface EnterpriseTextareaProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  className?: string;
  variant?: 'light' | 'dark';
}

export const EnterpriseTextarea: React.FC<EnterpriseTextareaProps> = ({
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  rows = 4,
  className = '',
  variant = 'light'
}) => {
  const baseClasses = 'enterprise-input enterprise-textarea';
  const variantClasses = variant === 'dark' ? 'enterprise-input-dark' : '';
  
  const classes = [baseClasses, variantClasses, className]
    .filter(Boolean)
    .join(' ');

  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      rows={rows}
      className={classes}
    />
  );
};

// 🏷️ ENTERPRISE BADGE COMPONENT
interface EnterpriseBadgeProps {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  children: React.ReactNode;
  icon?: React.ReactElement;
  className?: string;
}

export const EnterpriseBadge: React.FC<EnterpriseBadgeProps> = ({
  variant = 'neutral',
  children,
  icon,
  className = ''
}) => {
  const baseClasses = 'enterprise-badge';
  const variantClasses = `enterprise-badge-${variant}`;
  
  const classes = [baseClasses, variantClasses, className]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes}>
      {icon}
      {children}
    </span>
  );
};

// 📊 ENTERPRISE METRIC COMPONENT
interface EnterpriseMetricProps {
  value: string | number;
  label: string;
  variant?: 'light' | 'dark';
  className?: string;
}

export const EnterpriseMetric: React.FC<EnterpriseMetricProps> = ({
  value,
  label,
  variant = 'light',
  className = ''
}) => {
  const baseClasses = 'enterprise-metric';
  const variantClasses = variant === 'dark' ? 'enterprise-metric-dark' : '';
  
  const classes = [baseClasses, variantClasses, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <div className="enterprise-metric-value">{value}</div>
      <div className="enterprise-metric-label">{label}</div>
    </div>
  );
};

// 🎯 ENTERPRISE NAVIGATION LINK COMPONENT
interface EnterpriseNavLinkProps {
  href?: string;
  onClick?: () => void;
  active?: boolean;
  variant?: 'light' | 'dark';
  icon?: React.ReactElement;
  children: React.ReactNode;
  className?: string;
}

export const EnterpriseNavLink: React.FC<EnterpriseNavLinkProps> = ({
  href,
  onClick,
  active = false,
  variant = 'light',
  icon,
  children,
  className = ''
}) => {
  const baseClasses = 'enterprise-nav-link';
  const variantClasses = variant === 'dark' ? 'enterprise-nav-link-dark' : '';
  const activeClasses = active ? 'enterprise-nav-link-active' : '';
  
  const classes = [baseClasses, variantClasses, activeClasses, className]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {icon}
      {children}
    </>
  );

  if (href) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {content}
    </button>
  );
};

// 🏢 ENTERPRISE SECTION COMPONENT
interface EnterpriseSectionProps {
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  background?: 'transparent' | 'light' | 'dark';
}

export const EnterpriseSection: React.FC<EnterpriseSectionProps> = ({
  size = 'md',
  children,
  className = '',
  background = 'transparent'
}) => {
  const baseClasses = size === 'md' ? 'enterprise-section' : `enterprise-section-${size}`;
  const backgroundClasses = {
    transparent: '',
    light: 'bg-slate-50',
    dark: 'bg-slate-900'
  }[background];
  
  const classes = [baseClasses, backgroundClasses, className]
    .filter(Boolean)
    .join(' ');

  return (
    <section className={classes}>
      <div className="enterprise-container">
        {children}
      </div>
    </section>
  );
};

// 🎨 ENTERPRISE GRID COMPONENT
interface EnterpriseGridProps {
  columns?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
  className?: string;
}

export const EnterpriseGrid: React.FC<EnterpriseGridProps> = ({
  columns = 3,
  children,
  className = ''
}) => {
  const baseClasses = 'enterprise-grid';
  const columnClasses = `enterprise-grid-${columns}`;
  
  const classes = [baseClasses, columnClasses, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

// 🎯 ENTERPRISE HERO COMPONENT
interface EnterpriseHeroProps {
  children: React.ReactNode;
  className?: string;
}

export const EnterpriseHero: React.FC<EnterpriseHeroProps> = ({
  children,
  className = ''
}) => {
  const classes = ['enterprise-hero', className].filter(Boolean).join(' ');

  return (
    <section className={classes}>
      <div className="enterprise-hero-content">
        <div className="enterprise-container">
          {children}
        </div>
      </div>
    </section>
  );
};

// 📱 ENTERPRISE MOBILE MENU COMPONENT
interface EnterpriseMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: 'light' | 'dark';
  children: React.ReactNode;
}

export const EnterpriseMobileMenu: React.FC<EnterpriseMobileMenuProps> = ({
  isOpen,
  onClose,
  variant = 'light',
  children
}) => {
  if (!isOpen) return null;

  const baseClasses = 'enterprise-mobile-menu';
  const variantClasses = variant === 'dark' ? 'enterprise-mobile-menu-dark' : '';
  
  const classes = [baseClasses, variantClasses].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <div className="enterprise-container py-6">
        {children}
      </div>
    </div>
  );
};

// 🎨 ENTERPRISE LOADING COMPONENT
interface EnterpriseLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  text?: string;
}

export const EnterpriseLoading: React.FC<EnterpriseLoadingProps> = ({
  size = 'md',
  variant = 'light',
  text = 'Loading...'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }[size];

  const colorClasses = variant === 'dark' ? 'text-white' : 'text-slate-600';

  return (
    <div className={`flex items-center justify-center gap-3 ${colorClasses}`}>
      <div className={`${sizeClasses} animate-spin rounded-full border-2 border-current border-t-transparent`} />
      {text && <span className="text-sm font-medium">{text}</span>}
    </div>
  );
};

// 🎯 ENTERPRISE ALERT COMPONENT
interface EnterpriseAlertProps {
  variant?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactElement;
  onClose?: () => void;
  className?: string;
}

export const EnterpriseAlert: React.FC<EnterpriseAlertProps> = ({
  variant = 'info',
  title,
  children,
  icon,
  onClose,
  className = ''
}) => {
  const variantStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    danger: 'bg-red-50 border-red-200 text-red-800'
  }[variant];

  return (
    <div className={`border rounded-lg p-4 ${variantStyles} ${className}`}>
      <div className="flex items-start gap-3">
        {icon}
        <div className="flex-1">
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          <div>{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-current hover:opacity-70 transition-opacity"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

// 🎯 ENTERPRISE TOOLTIP COMPONENT
interface EnterpriseTooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const EnterpriseTooltip: React.FC<EnterpriseTooltipProps> = ({
  content,
  children,
  position = 'top'
}) => {
  return (
    <div className="relative group">
      {children}
      <div className={`
        absolute z-50 px-2 py-1 text-xs font-medium text-white bg-slate-900 rounded opacity-0 
        group-hover:opacity-100 transition-opacity duration-200 pointer-events-none
        ${position === 'top' ? 'bottom-full left-1/2 transform -translate-x-1/2 mb-1' : ''}
        ${position === 'bottom' ? 'top-full left-1/2 transform -translate-x-1/2 mt-1' : ''}
        ${position === 'left' ? 'right-full top-1/2 transform -translate-y-1/2 mr-1' : ''}
        ${position === 'right' ? 'left-full top-1/2 transform -translate-y-1/2 ml-1' : ''}
      `}>
        {content}
      </div>
    </div>
  );
};

// 🎯 ENTERPRISE MODAL COMPONENT
interface EnterpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const EnterpriseModal: React.FC<EnterpriseModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }[size];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative bg-white rounded-xl shadow-2xl w-full ${sizeClasses} max-h-[90vh] overflow-auto`}>
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              ×
            </button>
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}; 