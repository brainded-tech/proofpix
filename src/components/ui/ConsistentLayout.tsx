import React from 'react';
import { UnifiedHeader } from './UnifiedHeader';
import { UnifiedFooter } from './UnifiedFooter';

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
      {showHeader && <UnifiedHeader />}
      
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      
      {showFooter && <UnifiedFooter />}
    </div>
  );
}; 