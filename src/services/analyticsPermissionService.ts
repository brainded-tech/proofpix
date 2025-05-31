import { 
  AnalyticsPermission, 
  AnalyticsRole, 
  DashboardSharing, 
  AnalyticsPreferences, 
  rolePermissionMap 
} from '../models/AnalyticsPermission';
import { User } from '../components/auth/AuthContext';

class AnalyticsPermissionService {
  private static instance: AnalyticsPermissionService;
  private sharingCache = new Map<string, DashboardSharing>();
  private userPreferencesCache = new Map<string, AnalyticsPreferences>();
  
  private defaultPreferences: AnalyticsPreferences = {
    defaultTimeRange: '7d',
    autoRefresh: true,
    refreshInterval: 60,
    theme: 'system',
    alertsEnabled: true,
    compactView: false,
    dashboardLayout: 'grid',
    favoriteMetrics: []
  };
  
  // Private constructor for singleton
  private constructor() {}
  
  // Get singleton instance
  static getInstance(): AnalyticsPermissionService {
    if (!AnalyticsPermissionService.instance) {
      AnalyticsPermissionService.instance = new AnalyticsPermissionService();
    }
    return AnalyticsPermissionService.instance;
  }
  
  // Check if user has permission for a dashboard
  async hasPermission(
    user: User | null, 
    permission: AnalyticsPermission, 
    dashboardId?: string
  ): Promise<boolean> {
    if (!user) return false;
    
    // Admin users have all permissions
    if (user.role === 'admin') return true;
    
    // Check if dashboard exists and user has access
    if (dashboardId) {
      const sharing = await this.getDashboardSharing(dashboardId);
      
      // Dashboard doesn't exist
      if (!sharing) return false;
      
      // If user is the owner, they have all permissions
      if (sharing.ownerId === user.id) return true;
      
      // Check if dashboard is public and permission is view
      if (sharing.public && permission === 'view_dashboards') return true;
      
      // Check user's role for this dashboard
      const userAccess = sharing.users.find(u => u.userId === user.id);
      if (userAccess) {
        const role = userAccess.role;
        return rolePermissionMap[role].includes(permission);
      }
      
      // Check team access if applicable
      // This would require additional team membership checks
      
      // No access found
      return false;
    }
    
    // If no specific dashboard, check general permissions
    if (user.role === 'enterprise') {
      return ['view_dashboards', 'create_dashboards', 'export_data'].includes(permission);
    }
    
    if (user.role === 'standard') {
      return ['view_dashboards', 'export_data'].includes(permission);
    }
    
    return false;
  }
  
  // Get a dashboard's sharing settings
  async getDashboardSharing(dashboardId: string): Promise<DashboardSharing | null> {
    // Check cache first
    if (this.sharingCache.has(dashboardId)) {
      return this.sharingCache.get(dashboardId)!;
    }
    
    try {
      // In a real implementation, this would fetch from an API
      // For now, we'll simulate API data
      
      // Check localStorage for demo data
      const storedSharing = localStorage.getItem(`dashboard_sharing_${dashboardId}`);
      if (storedSharing) {
        const sharing = JSON.parse(storedSharing) as DashboardSharing;
        // Convert date strings back to Date objects
        sharing.users.forEach(u => {
          u.addedAt = new Date(u.addedAt);
        });
        if (sharing.teams) {
          sharing.teams.forEach(t => {
            t.addedAt = new Date(t.addedAt);
          });
        }
        if (sharing.accessLink) {
          sharing.accessLink.createdAt = new Date(sharing.accessLink.createdAt);
          if (sharing.accessLink.expiresAt) {
            sharing.accessLink.expiresAt = new Date(sharing.accessLink.expiresAt);
          }
        }
        
        this.sharingCache.set(dashboardId, sharing);
        return sharing;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get dashboard sharing settings:', error);
      return null;
    }
  }
  
  // Update a dashboard's sharing settings
  async updateDashboardSharing(
    sharing: DashboardSharing,
    currentUser: User
  ): Promise<boolean> {
    try {
      // Verify user has permission to update sharing
      const hasPermission = await this.hasPermission(
        currentUser, 
        'share_dashboards', 
        sharing.id
      );
      
      if (!hasPermission) {
        throw new Error('User does not have permission to share this dashboard');
      }
      
      // Update cache
      this.sharingCache.set(sharing.id, sharing);
      
      // In a real implementation, this would save to an API
      // For demo purposes, we'll save to localStorage
      localStorage.setItem(`dashboard_sharing_${sharing.id}`, JSON.stringify(sharing));
      
      return true;
    } catch (error) {
      console.error('Failed to update dashboard sharing settings:', error);
      return false;
    }
  }
  
  // Share dashboard with a user
  async shareDashboardWithUser(
    dashboardId: string,
    userId: string,
    role: AnalyticsRole,
    currentUser: User
  ): Promise<boolean> {
    try {
      // Get current sharing settings
      let sharing = await this.getDashboardSharing(dashboardId);
      if (!sharing) {
        throw new Error('Dashboard not found');
      }
      
      // Verify current user has permission to share
      const hasPermission = await this.hasPermission(
        currentUser, 
        'share_dashboards', 
        dashboardId
      );
      
      if (!hasPermission) {
        throw new Error('You do not have permission to share this dashboard');
      }
      
      // Check if user already has access
      const existingUserIndex = sharing.users.findIndex(u => u.userId === userId);
      
      if (existingUserIndex >= 0) {
        // Update existing user's role
        sharing.users[existingUserIndex] = {
          ...sharing.users[existingUserIndex],
          role,
          addedBy: currentUser.id,
          addedAt: new Date()
        };
      } else {
        // Add new user
        sharing.users.push({
          userId,
          role,
          addedBy: currentUser.id,
          addedAt: new Date()
        });
      }
      
      // Update sharing settings
      return this.updateDashboardSharing(sharing, currentUser);
    } catch (error) {
      console.error('Failed to share dashboard with user:', error);
      return false;
    }
  }
  
  // Revoke user access to dashboard
  async revokeDashboardAccess(
    dashboardId: string,
    userId: string,
    currentUser: User
  ): Promise<boolean> {
    try {
      // Get current sharing settings
      let sharing = await this.getDashboardSharing(dashboardId);
      if (!sharing) {
        throw new Error('Dashboard not found');
      }
      
      // Verify current user has permission to manage sharing
      const hasPermission = await this.hasPermission(
        currentUser, 
        'share_dashboards', 
        dashboardId
      );
      
      if (!hasPermission) {
        throw new Error('You do not have permission to modify sharing for this dashboard');
      }
      
      // Remove user
      sharing.users = sharing.users.filter(u => u.userId !== userId);
      
      // Update sharing settings
      return this.updateDashboardSharing(sharing, currentUser);
    } catch (error) {
      console.error('Failed to revoke dashboard access:', error);
      return false;
    }
  }
  
  // Create a public share link
  async createShareLink(
    dashboardId: string,
    expiresInDays: number | null,
    currentUser: User
  ): Promise<string | null> {
    try {
      // Get current sharing settings
      let sharing = await this.getDashboardSharing(dashboardId);
      if (!sharing) {
        throw new Error('Dashboard not found');
      }
      
      // Verify current user has permission to share
      const hasPermission = await this.hasPermission(
        currentUser, 
        'share_dashboards', 
        dashboardId
      );
      
      if (!hasPermission) {
        throw new Error('You do not have permission to share this dashboard');
      }
      
      // Generate token
      const token = `${dashboardId}_${Math.random().toString(36).substring(2, 15)}`;
      
      // Create or update access link
      sharing.accessLink = {
        enabled: true,
        token,
        createdAt: new Date(),
        expiresAt: expiresInDays ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000) : undefined
      };
      
      // Update sharing settings
      const success = await this.updateDashboardSharing(sharing, currentUser);
      
      if (success) {
        return token;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to create share link:', error);
      return null;
    }
  }
  
  // Disable share link
  async disableShareLink(
    dashboardId: string,
    currentUser: User
  ): Promise<boolean> {
    try {
      // Get current sharing settings
      let sharing = await this.getDashboardSharing(dashboardId);
      if (!sharing || !sharing.accessLink) {
        return true; // No link to disable
      }
      
      // Verify current user has permission to share
      const hasPermission = await this.hasPermission(
        currentUser, 
        'share_dashboards', 
        dashboardId
      );
      
      if (!hasPermission) {
        throw new Error('You do not have permission to modify sharing for this dashboard');
      }
      
      // Disable access link
      sharing.accessLink.enabled = false;
      
      // Update sharing settings
      return this.updateDashboardSharing(sharing, currentUser);
    } catch (error) {
      console.error('Failed to disable share link:', error);
      return false;
    }
  }
  
  // Get user analytics preferences
  async getUserPreferences(userId: string): Promise<AnalyticsPreferences> {
    // Check cache first
    if (this.userPreferencesCache.has(userId)) {
      return this.userPreferencesCache.get(userId)!;
    }
    
    try {
      // In a real implementation, this would fetch from an API
      // For now, we'll simulate API data
      
      // Check localStorage for demo data
      const storedPreferences = localStorage.getItem(`analytics_preferences_${userId}`);
      if (storedPreferences) {
        const preferences = JSON.parse(storedPreferences) as AnalyticsPreferences;
        this.userPreferencesCache.set(userId, preferences);
        return preferences;
      }
      
      // Return default preferences if none found
      return this.defaultPreferences;
    } catch (error) {
      console.error('Failed to get user preferences:', error);
      return this.defaultPreferences;
    }
  }
  
  // Update user analytics preferences
  async updateUserPreferences(
    userId: string,
    preferences: Partial<AnalyticsPreferences>
  ): Promise<boolean> {
    try {
      // Get current preferences
      const currentPreferences = await this.getUserPreferences(userId);
      
      // Merge with updates
      const updatedPreferences = {
        ...currentPreferences,
        ...preferences
      };
      
      // Update cache
      this.userPreferencesCache.set(userId, updatedPreferences);
      
      // In a real implementation, this would save to an API
      // For demo purposes, we'll save to localStorage
      localStorage.setItem(`analytics_preferences_${userId}`, JSON.stringify(updatedPreferences));
      
      return true;
    } catch (error) {
      console.error('Failed to update user preferences:', error);
      return false;
    }
  }
  
  // Get dashboards shared with user
  async getSharedDashboards(userId: string): Promise<Array<{
    id: string;
    name: string;
    ownerId: string;
    role: AnalyticsRole;
    lastUpdated: Date;
  }>> {
    try {
      // In a real implementation, this would fetch from an API
      // For now, we'll scan localStorage for demo data
      
      const sharedDashboards = [];
      
      // Scan localStorage for dashboard sharing settings
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('dashboard_sharing_')) {
          const dashboardId = key.replace('dashboard_sharing_', '');
          const sharing = await this.getDashboardSharing(dashboardId);
          
          if (sharing) {
            // Check if user has access
            const userAccess = sharing.users.find(u => u.userId === userId);
            
            if (userAccess || sharing.public) {
              sharedDashboards.push({
                id: sharing.id,
                name: sharing.name,
                ownerId: sharing.ownerId,
                role: userAccess?.role || 'viewer',
                lastUpdated: new Date() // This would come from the dashboard metadata in a real app
              });
            }
          }
        }
      }
      
      return sharedDashboards;
    } catch (error) {
      console.error('Failed to get shared dashboards:', error);
      return [];
    }
  }
  
  // Create initial sharing settings for a new dashboard
  async createDashboardSharing(
    dashboardId: string,
    name: string,
    ownerId: string,
    isPublic: boolean = false
  ): Promise<DashboardSharing | null> {
    try {
      const sharing: DashboardSharing = {
        id: dashboardId,
        name,
        ownerId,
        public: isPublic,
        users: [{
          userId: ownerId,
          role: 'owner',
          addedBy: ownerId,
          addedAt: new Date()
        }]
      };
      
      // Save to cache and storage
      this.sharingCache.set(dashboardId, sharing);
      localStorage.setItem(`dashboard_sharing_${dashboardId}`, JSON.stringify(sharing));
      
      return sharing;
    } catch (error) {
      console.error('Failed to create dashboard sharing settings:', error);
      return null;
    }
  }
  
  // Clear caches (for testing/logout)
  clearCaches(): void {
    this.sharingCache.clear();
    this.userPreferencesCache.clear();
  }
}

// Export singleton instance
export const analyticsPermissionService = AnalyticsPermissionService.getInstance();
export default analyticsPermissionService; 