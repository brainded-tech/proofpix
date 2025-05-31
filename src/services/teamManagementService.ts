/**
 * Team Management Service
 * Handles team collaboration features for hybrid architecture
 */

import { EventEmitter } from 'events';

interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  status: 'active' | 'pending' | 'inactive';
  joinedAt: string;
  lastActive?: string;
  permissions: TeamPermissions;
}

interface TeamPermissions {
  canUpload: boolean;
  canProcess: boolean;
  canShare: boolean;
  canManageMembers: boolean;
  canManageSettings: boolean;
  canViewAnalytics: boolean;
  canExport: boolean;
}

interface Team {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  settings: TeamSettings;
  members: TeamMember[];
  stats: TeamStats;
}

interface TeamSettings {
  maxMembers: number;
  allowGuestAccess: boolean;
  requireApproval: boolean;
  sessionTimeout: number; // in hours
  maxFileSize: number;
  allowedFileTypes: string[];
  retentionPeriod: number; // in hours
  encryptionLevel: 'standard' | 'enhanced';
}

interface TeamStats {
  totalMembers: number;
  activeMembers: number;
  totalSessions: number;
  totalFilesProcessed: number;
  storageUsed: number;
  lastActivity: string;
}

interface TeamInvitation {
  id: string;
  teamId: string;
  email: string;
  role: TeamMember['role'];
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  token: string;
}

class TeamManagementService extends EventEmitter {
  private readonly API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  private currentTeam: Team | null = null;
  private userTeams: Team[] = [];

  constructor() {
    super();
    this.initialize();
  }

  /**
   * Initialize service
   */
  private initialize(): void {
    // Load cached team data
    this.loadCachedData();
  }

  /**
   * Create a new team
   */
  async createTeam(teamData: {
    name: string;
    description?: string;
    settings?: Partial<TeamSettings>;
  }): Promise<Team> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${this.API_BASE_URL}/teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: teamData.name,
          description: teamData.description,
          settings: {
            maxMembers: 10,
            allowGuestAccess: false,
            requireApproval: true,
            sessionTimeout: 24,
            maxFileSize: 50 * 1024 * 1024,
            allowedFileTypes: ['image/jpeg', 'image/png', 'image/tiff', 'image/webp', 'application/pdf'],
            retentionPeriod: 24,
            encryptionLevel: 'enhanced',
            ...teamData.settings
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to create team: ${response.statusText}`);
      }

      const result = await response.json();
      const team = result.data;

      // Add to user teams
      this.userTeams.push(team);
      this.currentTeam = team;

      // Cache data
      this.cacheData();

      this.emit('teamCreated', team);
      return team;
    } catch (error) {
      console.error('Failed to create team:', error);
      throw error;
    }
  }

  /**
   * Get user's teams
   */
  async getUserTeams(): Promise<Team[]> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${this.API_BASE_URL}/teams`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get teams: ${response.statusText}`);
      }

      const result = await response.json();
      this.userTeams = result.data;

      // Cache data
      this.cacheData();

      return this.userTeams;
    } catch (error) {
      console.error('Failed to get user teams:', error);
      throw error;
    }
  }

  /**
   * Get team details
   */
  async getTeam(teamId: string): Promise<Team> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${this.API_BASE_URL}/teams/${teamId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get team: ${response.statusText}`);
      }

      const result = await response.json();
      const team = result.data;

      // Update current team if it's the same
      if (this.currentTeam?.id === teamId) {
        this.currentTeam = team;
      }

      // Update in user teams list
      const index = this.userTeams.findIndex(t => t.id === teamId);
      if (index !== -1) {
        this.userTeams[index] = team;
      }

      this.cacheData();
      return team;
    } catch (error) {
      console.error('Failed to get team:', error);
      throw error;
    }
  }

  /**
   * Update team settings
   */
  async updateTeamSettings(teamId: string, settings: Partial<TeamSettings>): Promise<Team> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${this.API_BASE_URL}/teams/${teamId}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        throw new Error(`Failed to update team settings: ${response.statusText}`);
      }

      const result = await response.json();
      const team = result.data;

      // Update current team
      if (this.currentTeam?.id === teamId) {
        this.currentTeam = team;
      }

      this.emit('teamUpdated', team);
      return team;
    } catch (error) {
      console.error('Failed to update team settings:', error);
      throw error;
    }
  }

  /**
   * Invite member to team
   */
  async inviteMember(teamId: string, memberData: {
    email: string;
    role: TeamMember['role'];
    permissions?: Partial<TeamPermissions>;
  }): Promise<TeamInvitation> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${this.API_BASE_URL}/teams/${teamId}/invitations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: memberData.email,
          role: memberData.role,
          permissions: {
            canUpload: true,
            canProcess: true,
            canShare: memberData.role !== 'viewer',
            canManageMembers: memberData.role === 'admin' || memberData.role === 'owner',
            canManageSettings: memberData.role === 'admin' || memberData.role === 'owner',
            canViewAnalytics: memberData.role !== 'viewer',
            canExport: memberData.role !== 'viewer',
            ...memberData.permissions
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to invite member: ${response.statusText}`);
      }

      const result = await response.json();
      const invitation = result.data;

      this.emit('memberInvited', { teamId, invitation });
      return invitation;
    } catch (error) {
      console.error('Failed to invite member:', error);
      throw error;
    }
  }

  /**
   * Accept team invitation
   */
  async acceptInvitation(token: string): Promise<Team> {
    try {
      const authToken = this.getAuthToken();
      if (!authToken) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${this.API_BASE_URL}/teams/invitations/${token}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to accept invitation: ${response.statusText}`);
      }

      const result = await response.json();
      const team = result.data;

      // Add to user teams
      this.userTeams.push(team);
      this.cacheData();

      this.emit('invitationAccepted', team);
      return team;
    } catch (error) {
      console.error('Failed to accept invitation:', error);
      throw error;
    }
  }

  /**
   * Remove member from team
   */
  async removeMember(teamId: string, memberId: string): Promise<void> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${this.API_BASE_URL}/teams/${teamId}/members/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to remove member: ${response.statusText}`);
      }

      // Update team data
      await this.getTeam(teamId);

      this.emit('memberRemoved', { teamId, memberId });
    } catch (error) {
      console.error('Failed to remove member:', error);
      throw error;
    }
  }

  /**
   * Update member role and permissions
   */
  async updateMember(teamId: string, memberId: string, updates: {
    role?: TeamMember['role'];
    permissions?: Partial<TeamPermissions>;
  }): Promise<TeamMember> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${this.API_BASE_URL}/teams/${teamId}/members/${memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error(`Failed to update member: ${response.statusText}`);
      }

      const result = await response.json();
      const member = result.data;

      // Update team data
      await this.getTeam(teamId);

      this.emit('memberUpdated', { teamId, member });
      return member;
    } catch (error) {
      console.error('Failed to update member:', error);
      throw error;
    }
  }

  /**
   * Leave team
   */
  async leaveTeam(teamId: string): Promise<void> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${this.API_BASE_URL}/teams/${teamId}/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to leave team: ${response.statusText}`);
      }

      // Remove from user teams
      this.userTeams = this.userTeams.filter(t => t.id !== teamId);
      
      // Clear current team if it's the one we left
      if (this.currentTeam?.id === teamId) {
        this.currentTeam = null;
      }

      this.cacheData();
      this.emit('teamLeft', teamId);
    } catch (error) {
      console.error('Failed to leave team:', error);
      throw error;
    }
  }

  /**
   * Delete team (owner only)
   */
  async deleteTeam(teamId: string): Promise<void> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${this.API_BASE_URL}/teams/${teamId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete team: ${response.statusText}`);
      }

      // Remove from user teams
      this.userTeams = this.userTeams.filter(t => t.id !== teamId);
      
      // Clear current team if it's the one we deleted
      if (this.currentTeam?.id === teamId) {
        this.currentTeam = null;
      }

      this.cacheData();
      this.emit('teamDeleted', teamId);
    } catch (error) {
      console.error('Failed to delete team:', error);
      throw error;
    }
  }

  /**
   * Set current active team
   */
  setCurrentTeam(teamId: string): void {
    const team = this.userTeams.find(t => t.id === teamId);
    if (team) {
      this.currentTeam = team;
      this.cacheData();
      this.emit('currentTeamChanged', team);
    }
  }

  /**
   * Get current team
   */
  getCurrentTeam(): Team | null {
    return this.currentTeam;
  }

  /**
   * Get user's role in team
   */
  getUserRole(teamId: string, userId: string): TeamMember['role'] | null {
    const team = this.userTeams.find(t => t.id === teamId);
    if (!team) return null;

    const member = team.members.find(m => m.id === userId);
    return member?.role || null;
  }

  /**
   * Check if user has permission
   */
  hasPermission(teamId: string, userId: string, permission: keyof TeamPermissions): boolean {
    const team = this.userTeams.find(t => t.id === teamId);
    if (!team) return false;

    const member = team.members.find(m => m.id === userId);
    if (!member) return false;

    return member.permissions[permission];
  }

  /**
   * Get team analytics
   */
  async getTeamAnalytics(teamId: string, timeframe: '24h' | '7d' | '30d' = '7d'): Promise<any> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${this.API_BASE_URL}/teams/${teamId}/analytics?timeframe=${timeframe}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get analytics: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Failed to get team analytics:', error);
      throw error;
    }
  }

  /**
   * Get authentication token
   */
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  }

  /**
   * Load cached data
   */
  private loadCachedData(): void {
    try {
      const cached = localStorage.getItem('team_management_data');
      if (cached) {
        const data = JSON.parse(cached);
        this.userTeams = data.userTeams || [];
        this.currentTeam = data.currentTeam || null;
      }
    } catch (error) {
      console.error('Failed to load cached team data:', error);
    }
  }

  /**
   * Cache data
   */
  private cacheData(): void {
    try {
      const data = {
        userTeams: this.userTeams,
        currentTeam: this.currentTeam,
        lastUpdated: Date.now()
      };
      localStorage.setItem('team_management_data', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to cache team data:', error);
    }
  }

  /**
   * Clear cached data
   */
  clearCache(): void {
    localStorage.removeItem('team_management_data');
    this.userTeams = [];
    this.currentTeam = null;
  }
}

// Export singleton instance
export const teamManagementService = new TeamManagementService();
export default teamManagementService;

// Export types
export type {
  Team,
  TeamMember,
  TeamPermissions,
  TeamSettings,
  TeamStats,
  TeamInvitation
}; 