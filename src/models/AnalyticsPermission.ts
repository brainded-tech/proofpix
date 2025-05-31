import { User } from '../components/auth/AuthContext';

// Role-based access control for analytics features
export type AnalyticsRole = 'viewer' | 'editor' | 'admin' | 'owner';

// Permission types for analytics dashboard access
export type AnalyticsPermission = 
  | 'view_dashboards'        // Can view dashboards assigned to them
  | 'create_dashboards'      // Can create new dashboards
  | 'edit_dashboards'        // Can edit dashboards they have access to
  | 'delete_dashboards'      // Can delete dashboards they own
  | 'share_dashboards'       // Can share dashboards with other users
  | 'export_data'            // Can export analytics data
  | 'view_system_metrics'    // Can view system performance metrics
  | 'schedule_reports'       // Can schedule automated reports
  | 'manage_permissions';    // Can manage permissions for dashboards

// Dashboard sharing settings
export interface DashboardSharing {
  id: string;              // Dashboard ID
  name: string;            // Dashboard name
  ownerId: string;         // User ID of dashboard owner
  public: boolean;         // Whether dashboard is publicly accessible
  users: Array<{
    userId: string;        // User ID
    role: AnalyticsRole;   // User's role for this dashboard
    addedBy: string;       // User ID who added this user
    addedAt: Date;         // When user was added
  }>;
  teams?: Array<{
    teamId: string;        // Team ID
    role: AnalyticsRole;   // Team's role for this dashboard
    addedBy: string;       // User ID who added this team
    addedAt: Date;         // When team was added
  }>;
  accessLink?: {
    enabled: boolean;      // Whether access link is enabled
    token: string;         // Access token for the link
    createdAt: Date;       // When link was created
    expiresAt?: Date;      // Optional expiration date
  };
}

// User analytics preferences
export interface AnalyticsPreferences {
  defaultTimeRange: '24h' | '7d' | '30d' | '90d';
  defaultDashboardId?: string;
  autoRefresh: boolean;
  refreshInterval: number;
  theme: 'light' | 'dark' | 'system';
  alertsEnabled: boolean;
  compactView: boolean;
  dashboardLayout: 'grid' | 'list';
  favoriteMetrics: string[];
}

// User role mapping for different features
export const rolePermissionMap: Record<AnalyticsRole, AnalyticsPermission[]> = {
  viewer: [
    'view_dashboards',
    'export_data'
  ],
  editor: [
    'view_dashboards',
    'edit_dashboards',
    'export_data',
    'view_system_metrics',
    'schedule_reports'
  ],
  admin: [
    'view_dashboards',
    'create_dashboards',
    'edit_dashboards',
    'share_dashboards',
    'export_data',
    'view_system_metrics',
    'schedule_reports'
  ],
  owner: [
    'view_dashboards',
    'create_dashboards',
    'edit_dashboards',
    'delete_dashboards',
    'share_dashboards',
    'export_data',
    'view_system_metrics',
    'schedule_reports',
    'manage_permissions'
  ]
};

// Helper functions for permissions
export const hasPermission = (
  user: User | null, 
  permission: AnalyticsPermission, 
  dashboardOwnerId?: string
): boolean => {
  if (!user) return false;
  
  // Enterprise and admin users have all permissions
  if (user.role === 'admin') return true;
  if (user.role === 'enterprise') {
    // Enterprise users have all permissions for their own dashboards
    if (dashboardOwnerId && dashboardOwnerId === user.id) return true;
    
    // For other dashboards, they need to be assigned specific roles
    // This would be implemented based on dashboard sharing settings
    return ['view_dashboards', 'create_dashboards', 'export_data'].includes(permission);
  }
  
  // Standard users have limited permissions
  if (user.role === 'standard') {
    return ['view_dashboards', 'export_data'].includes(permission);
  }
  
  // Free users have no analytics permissions
  return false;
}; 