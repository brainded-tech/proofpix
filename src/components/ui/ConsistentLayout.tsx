import React from 'react';
import { StandardHeader } from './StandardHeader';
import { EnhancedFooter } from '../EnhancedFooter';

interface ConsistentLayoutProps {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

export const ConsistentLayout: React.FC<ConsistentLayoutProps> = ({
  children,
  className = '',
  showHeader = true,
  showFooter = true
}) => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {showHeader && <StandardHeader />}
      
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      
      {showFooter && <EnhancedFooter />}
    </div>
  );
}; 