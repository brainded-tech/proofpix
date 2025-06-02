/**
 * Interactive Elements
 * Modals, tooltips, dropdowns, and other interactive components
 */

import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Info, HelpCircle, Settings, MoreVertical, Check } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
}

interface TooltipProps {
  content: string | React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click';
  children: React.ReactNode;
  className?: string;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
    divider?: boolean;
  }>;
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  className?: string;
}

interface TabsProps {
  tabs: Array<{
    id: string;
    label: string;
    content: React.ReactNode;
    icon?: React.ReactNode;
    disabled?: boolean;
  }>;
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
}

interface AccordionProps {
  items: Array<{
    id: string;
    title: string;
    content: React.ReactNode;
    icon?: React.ReactNode;
  }>;
  allowMultiple?: boolean;
  defaultOpen?: string[];
  className?: string;
}

// Modal Component
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = ''
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={closeOnOverlayClick ? onClose : undefined}
        />
        
        {/* Modal */}
        <div
          ref={modalRef}
          className={`relative bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} ${className}`}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Tooltip Component
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  trigger = 'hover',
  children,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-900',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-900',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-900',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-900'
  };

  return (
    <div
      ref={triggerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={trigger === 'hover' ? showTooltip : undefined}
      onMouseLeave={trigger === 'hover' ? hideTooltip : undefined}
      onClick={trigger === 'click' ? () => setIsVisible(!isVisible) : undefined}
    >
      {children}
      
      {isVisible && (
        <div className={`absolute z-50 ${positionClasses[position]}`}>
          <div className="bg-gray-900 text-white text-sm rounded-lg px-3 py-2 max-w-xs">
            {content}
            <div className={`absolute w-0 h-0 border-4 border-transparent ${arrowClasses[position]}`} />
          </div>
        </div>
      )}
    </div>
  );
};

// Dropdown Component
export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  position = 'bottom-left',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const positionClasses = {
    'bottom-left': 'top-full left-0 mt-2',
    'bottom-right': 'top-full right-0 mt-2',
    'top-left': 'bottom-full left-0 mb-2',
    'top-right': 'bottom-full right-0 mb-2'
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div className={`absolute z-50 ${positionClasses[position]} min-w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1`}>
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {item.divider ? (
                <div className="border-t border-gray-200 my-1" />
              ) : (
                <button
                  onClick={() => {
                    if (!item.disabled) {
                      item.onClick();
                      setIsOpen(false);
                    }
                  }}
                  disabled={item.disabled}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-2 transition-colors ${
                    item.disabled
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.icon && <span>{item.icon}</span>}
                  <span>{item.label}</span>
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

// Tabs Component
export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className={className}>
      {/* Tab Headers */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && handleTabChange(tab.id)}
              disabled={tab.disabled}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : tab.disabled
                  ? 'border-transparent text-gray-400 cursor-not-allowed'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="mt-6">
        {activeTabContent}
      </div>
    </div>
  );
};

// Accordion Component
export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultOpen = [],
  className = ''
}) => {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  const toggleItem = (itemId: string) => {
    if (allowMultiple) {
      setOpenItems(prev =>
        prev.includes(itemId)
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      );
    } else {
      setOpenItems(prev =>
        prev.includes(itemId) ? [] : [itemId]
      );
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);
        
        return (
          <div key={item.id} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-2">
                {item.icon && <span>{item.icon}</span>}
                <span className="font-medium text-gray-900">{item.title}</span>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            {isOpen && (
              <div className="px-4 pb-3 border-t border-gray-200">
                <div className="pt-3">
                  {item.content}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Toggle Switch Component
export const ToggleSwitch: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: { switch: 'h-4 w-7', thumb: 'h-3 w-3', translate: 'translate-x-3' },
    md: { switch: 'h-6 w-11', thumb: 'h-5 w-5', translate: 'translate-x-5' },
    lg: { switch: 'h-8 w-14', thumb: 'h-7 w-7', translate: 'translate-x-6' }
  };

  const classes = sizeClasses[size];

  return (
    <div className={`flex items-center ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`relative inline-flex items-center ${classes.switch} rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-200'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`inline-block ${classes.thumb} rounded-full bg-white shadow transform transition-transform ${
            checked ? classes.translate : 'translate-x-1'
          }`}
        />
      </button>
      
      {(label || description) && (
        <div className="ml-3">
          {label && (
            <div className="text-sm font-medium text-gray-900">{label}</div>
          )}
          {description && (
            <div className="text-sm text-gray-500">{description}</div>
          )}
        </div>
      )}
    </div>
  );
};

// Popover Component
export const Popover: React.FC<{
  trigger: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}> = ({ trigger, content, position = 'bottom', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  return (
    <div ref={popoverRef} className={`relative ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div className={`absolute z-50 ${positionClasses[position]} bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-64`}>
          {content}
        </div>
      )}
    </div>
  );
};

export default {
  Modal,
  Tooltip,
  Dropdown,
  Tabs,
  Accordion,
  ToggleSwitch,
  Popover
}; 