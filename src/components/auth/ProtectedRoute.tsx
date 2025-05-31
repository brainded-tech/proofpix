import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Loader, Shield } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'enterprise' | 'standard' | 'free';
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallbackPath = '/auth/login'
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
          <Loader className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role-based access if required
  if (requiredRole && user) {
    const roleHierarchy = {
      'free': 0,
      'standard': 1,
      'enterprise': 2,
      'admin': 3
    };

    const userRoleLevel = roleHierarchy[user.role];
    const requiredRoleLevel = roleHierarchy[requiredRole];

    if (userRoleLevel < requiredRoleLevel) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You don't have permission to access this page. 
              {requiredRole === 'enterprise' && ' Please upgrade to an Enterprise plan.'}
              {requiredRole === 'admin' && ' Administrator access required.'}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.history.back()}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Go Back
              </button>
              {requiredRole === 'enterprise' && (
                <button
                  onClick={() => window.location.href = '/pricing'}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Upgrade to Enterprise
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }
  }

  // Render protected content
  return <>{children}</>;
}; 