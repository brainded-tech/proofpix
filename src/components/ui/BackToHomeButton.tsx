import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

interface BackToHomeButtonProps {
  variant?: 'default' | 'minimal' | 'enterprise';
  customText?: string;
  customPath?: string;
  className?: string;
  showIcon?: boolean;
}

export const BackToHomeButton: React.FC<BackToHomeButtonProps> = ({
  variant = 'default',
  customText,
  customPath = '/',
  className = '',
  showIcon = true
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(customPath);
  };

  const baseClasses = "inline-flex items-center transition-colors duration-200";
  
  const variantClasses = {
    default: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium",
    minimal: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100",
    enterprise: "px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 border border-slate-600 font-medium"
  };

  const iconClasses = {
    default: "h-4 w-4 mr-2",
    minimal: "h-4 w-4 mr-2",
    enterprise: "h-5 w-5 mr-2"
  };

  const text = customText || (customPath === '/' ? 'Back to Home' : 'Back');
  const Icon = customPath === '/' ? Home : ArrowLeft;

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {showIcon && <Icon className={iconClasses[variant]} />}
      {text}
    </button>
  );
};

export default BackToHomeButton; 