import React from 'react';
import { UnifiedHeader } from './UnifiedHeader';
import { UnifiedFooter } from './UnifiedFooter';

interface StandardLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showHero?: boolean;
  heroContent?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl' | 'full';
  backgroundColor?: 'white' | 'slate-50' | 'slate-100' | 'dark' | 'slate-800' | 'slate-900';
  className?: string;
}

export const StandardLayout: React.FC<StandardLayoutProps> = ({
  children,
  title,
  description,
  showHero = false,
  heroContent,
  maxWidth = '7xl',
  backgroundColor = 'dark',
  className = ''
}) => {
  const maxWidthClasses = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    'full': 'max-w-full'
  };

  const backgroundClasses = {
    'white': 'bg-white text-slate-900',
    'slate-50': 'bg-slate-50 text-slate-900',
    'slate-100': 'bg-slate-100 text-slate-900',
    'dark': 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100',
    'slate-800': 'bg-slate-800 text-slate-100',
    'slate-900': 'bg-slate-900 text-slate-100'
  };

  return (
    <div className={`min-h-screen ${backgroundClasses[backgroundColor]} ${className}`}>
      <UnifiedHeader />
      
      {/* Hero Section */}
      {showHero && (
        <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-emerald-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-emerald-600/20"></div>
          <div className="relative">
            {heroContent || (
              <div className={`${maxWidthClasses[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8 py-20`}>
                {title && (
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-center">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="text-xl text-blue-100 text-center max-w-3xl mx-auto">
                    {description}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`${maxWidthClasses[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8`}>
        {children}
      </main>

      <UnifiedFooter />
    </div>
  );
}; 