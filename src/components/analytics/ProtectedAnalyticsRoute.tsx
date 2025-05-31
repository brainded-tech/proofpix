import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader, Shield, AlertTriangle } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { AnalyticsPermission } from '../../models/AnalyticsPermission';
import { analyticsPermissionService } from '../../services/analyticsPermissionService';

interface ProtectedAnalyticsRouteProps {
  children: React.ReactNode;
  requiredPermission?: AnalyticsPermission;
  dashboardId?: string;
  fallbackPath?: string;
}

/**
 * A route wrapper that protects analytics routes based on user permissions
 */
export const ProtectedAnalyticsRoute: React.FC<ProtectedAnalyticsRouteProps> = ({
  children,
  requiredPermission = 'view_dashboards',
  dashboardId,
  fallbackPath = '/auth/login'
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [hasPermission, setHasPermission] = React.useState<boolean | null>(null);
  const [checkingPermission, setCheckingPermission] = React.useState<boolean>(true);
  
  React.useEffect(() => {
    const checkPermission = async () => {
      if (!isAuthenticated || !user) {
        setHasPermission(false);
        setCheckingPermission(false);
        return;
      }
      
      try {
        // Check if user has the required permission
        const permitted = await analyticsPermissionService.hasPermission(
          user,
          requiredPermission,
          dashboardId
        );
        
        setHasPermission(permitted);
      } catch (error) {
        console.error('Permission check error:', error);
        setHasPermission(false);
      } finally {
        setCheckingPermission(false);
      }
    };
    
    checkPermission();
  }, [user, isAuthenticated, requiredPermission, dashboardId]);
  
  // While checking auth status or permissions
  if (isLoading || checkingPermission) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            {isLoading ? 'Checking authentication...' : 'Verifying permissions...'}
          </p>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }
  
  // Show permission denied page
  if (!hasPermission) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full px-6 py-8 bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Access Denied
            </h2>
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2" />
              <p className="text-gray-600 dark:text-gray-300">
                You don't have permission to access this analytics feature.
              </p>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {dashboardId 
                ? "You don't have access to this specific dashboard. Please contact the dashboard owner for access."
                : `This feature requires ${requiredPermission.replace(/_/g, ' ')} permission. Please contact your administrator.`
              }
            </p>
            <div className="flex flex-col space-y-3">
              <a 
                href="/analytics"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Back to Analytics Home
              </a>
              <a 
                href="/"
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition-colors"
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // User has permission, render children
  return <>{children}</>;
};

export default ProtectedAnalyticsRoute; 