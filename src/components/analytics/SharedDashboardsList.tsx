import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Share2, 
  RefreshCw, 
  AlertTriangle, 
  Eye, 
  Edit, 
  Trash2,
  Lock,
  Globe,
  Users,
  Clock,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { analyticsPermissionService } from '../../services/analyticsPermissionService';
import { AnalyticsRole } from '../../models/AnalyticsPermission';
import { DashboardShareModal } from './DashboardShareModal';

interface SharedDashboardsListProps {
  className?: string;
  theme?: 'light' | 'dark';
  onDashboardSelect?: (dashboardId: string) => void;
}

interface SharedDashboard {
  id: string;
  name: string;
  ownerId: string;
  role: AnalyticsRole;
  lastUpdated: Date;
}

export const SharedDashboardsList: React.FC<SharedDashboardsListProps> = ({
  className = '',
  theme = 'light',
  onDashboardSelect
}) => {
  const { user } = useAuth();
  const [dashboards, setDashboards] = useState<SharedDashboard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);
  const [selectedDashboard, setSelectedDashboard] = useState<SharedDashboard | null>(null);
  
  useEffect(() => {
    if (user) {
      loadSharedDashboards();
    }
  }, [user]);
  
  const loadSharedDashboards = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const sharedDashboards = await analyticsPermissionService.getSharedDashboards(user.id);
      setDashboards(sharedDashboards);
    } catch (error) {
      console.error('Failed to load shared dashboards:', error);
      setError('Failed to load shared dashboards. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleShareClick = (dashboard: SharedDashboard) => {
    setSelectedDashboard(dashboard);
    setShareModalOpen(true);
  };
  
  const handleViewDashboard = (dashboardId: string) => {
    if (onDashboardSelect) {
      onDashboardSelect(dashboardId);
    }
  };
  
  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 30) {
      return date.toLocaleDateString();
    } else if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMins > 0) {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };
  
  // Get user name by ID - in a real app, this would come from a user service
  const getUserNameById = (userId: string): string => {
    // For demo purposes, return a formatted version of the ID
    return userId.replace('user_', '').replace(/_/g, ' ');
  };
  
  // Get color for role badge
  const getRoleBadgeColor = (role: AnalyticsRole): string => {
    const isDarkTheme = theme === 'dark';
    
    switch (role) {
      case 'owner':
        return isDarkTheme 
          ? 'bg-purple-900/30 text-purple-300' 
          : 'bg-purple-100 text-purple-800';
      case 'admin':
        return isDarkTheme 
          ? 'bg-red-900/30 text-red-300' 
          : 'bg-red-100 text-red-800';
      case 'editor':
        return isDarkTheme 
          ? 'bg-blue-900/30 text-blue-300' 
          : 'bg-blue-100 text-blue-800';
      case 'viewer':
        return isDarkTheme 
          ? 'bg-green-900/30 text-green-300' 
          : 'bg-green-100 text-green-800';
      default:
        return isDarkTheme 
          ? 'bg-gray-700 text-gray-300' 
          : 'bg-gray-200 text-gray-800';
    }
  };
  
  const getRoleDisplayName = (role: AnalyticsRole): string => {
    switch (role) {
      case 'owner': return 'Owner';
      case 'admin': return 'Admin';
      case 'editor': return 'Editor';
      case 'viewer': return 'Viewer';
      default: return role;
    }
  };
  
  const isDarkTheme = theme === 'dark';
  
  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-semibold ${
          isDarkTheme ? 'text-white' : 'text-gray-900'
        }`}>
          Shared Dashboards
        </h2>
        
        <button
          onClick={loadSharedDashboards}
          className={`flex items-center px-3 py-1.5 rounded-md text-sm ${
            isDarkTheme
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          <span>Refresh</span>
        </button>
      </div>
      
      {error && (
        <div className={`p-3 mb-4 rounded-md ${
          isDarkTheme ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-700'
        }`}>
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className={`w-8 h-8 animate-spin ${
            isDarkTheme ? 'text-blue-400' : 'text-blue-500'
          }`} />
        </div>
      ) : dashboards.length === 0 ? (
        <div className={`text-center py-12 ${
          isDarkTheme ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">No shared dashboards found</p>
          <p className="text-sm">
            Dashboards shared with you will appear here
          </p>
        </div>
      ) : (
        <div className={`rounded-md border overflow-hidden ${
          isDarkTheme ? 'border-gray-700' : 'border-gray-200'
        }`}>
          {dashboards.map((dashboard) => (
            <div 
              key={dashboard.id}
              className={`border-b last:border-b-0 ${
                isDarkTheme ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <div className={`p-4 ${
                isDarkTheme ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`text-lg font-medium mb-1 ${
                      isDarkTheme ? 'text-white' : 'text-gray-900'
                    }`}>
                      {dashboard.name}
                    </h3>
                    
                    <div className="flex items-center text-sm space-x-3 mb-2">
                      <span className={`px-2 py-0.5 rounded-full ${getRoleBadgeColor(dashboard.role)}`}>
                        {getRoleDisplayName(dashboard.role)}
                      </span>
                      
                      <span className={isDarkTheme ? 'text-gray-400' : 'text-gray-500'}>
                        Owner: {getUserNameById(dashboard.ownerId)}
                      </span>
                    </div>
                    
                    <div className={`flex items-center text-xs ${
                      isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <Clock className="w-3 h-3 mr-1" />
                      <span>Updated {formatTimeAgo(dashboard.lastUpdated)}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewDashboard(dashboard.id)}
                      className={`p-2 rounded-md ${
                        isDarkTheme
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                      title="View dashboard"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    {['owner', 'admin', 'editor'].includes(dashboard.role) && (
                      <button
                        onClick={() => {/* Navigate to edit page */}}
                        className={`p-2 rounded-md ${
                          isDarkTheme
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                        title="Edit dashboard"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    
                    {['owner', 'admin'].includes(dashboard.role) && (
                      <>
                        <button
                          onClick={() => handleShareClick(dashboard)}
                          className={`p-2 rounded-md ${
                            isDarkTheme
                              ? 'bg-blue-700 hover:bg-blue-600 text-white'
                              : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                          }`}
                          title="Share dashboard"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        
                        {dashboard.role === 'owner' && (
                          <button
                            onClick={() => {/* Delete dashboard (would need confirmation) */}}
                            className={`p-2 rounded-md ${
                              isDarkTheme
                                ? 'bg-red-900/30 hover:bg-red-800/50 text-red-300'
                                : 'bg-red-100 hover:bg-red-200 text-red-700'
                            }`}
                            title="Delete dashboard"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={`px-4 py-2 flex justify-between items-center ${
                isDarkTheme ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center space-x-4">
                  {/* This would come from the dashboard sharing settings in a real app */}
                  <div className={`flex items-center text-xs ${
                    isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <Globe className="w-3 h-3 mr-1" />
                    <span>Public</span>
                  </div>
                  
                  <div className={`flex items-center text-xs ${
                    isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <Users className="w-3 h-3 mr-1" />
                    <span>5 collaborators</span>
                  </div>
                </div>
                
                <Link
                  to={`/analytics/dashboard/${dashboard.id}`}
                  className={`flex items-center text-xs ${
                    isDarkTheme ? 'text-blue-400' : 'text-blue-600'
                  }`}
                >
                  <span>Open dashboard</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Share modal */}
      {selectedDashboard && (
        <DashboardShareModal
          isOpen={shareModalOpen}
          onClose={() => {
            setShareModalOpen(false);
            setSelectedDashboard(null);
            // Refresh the list when modal is closed
            loadSharedDashboards();
          }}
          dashboardId={selectedDashboard.id}
          dashboardName={selectedDashboard.name}
          theme={theme}
        />
      )}
    </div>
  );
};

export default SharedDashboardsList; 