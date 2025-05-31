import React, { useState, useEffect } from 'react';
import { 
  X, 
  Link, 
  Copy, 
  Check, 
  UserPlus, 
  Users, 
  Globe, 
  Lock, 
  AlertTriangle, 
  Calendar, 
  RefreshCw 
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { 
  DashboardSharing, 
  AnalyticsRole 
} from '../../models/AnalyticsPermission';
import { analyticsPermissionService } from '../../services/analyticsPermissionService';

interface DashboardShareModalProps {
  dashboardId: string;
  dashboardName: string;
  isOpen: boolean;
  onClose: () => void;
  theme?: 'light' | 'dark';
}

export const DashboardShareModal: React.FC<DashboardShareModalProps> = ({
  dashboardId,
  dashboardName,
  isOpen,
  onClose,
  theme = 'light'
}) => {
  const { user } = useAuth();
  const [sharing, setSharing] = useState<DashboardSharing | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState<string>('');
  const [inviteRole, setInviteRole] = useState<AnalyticsRole>('viewer');
  const [publicAccess, setPublicAccess] = useState<boolean>(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [linkExpiration, setLinkExpiration] = useState<number | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [showAddUser, setShowAddUser] = useState<boolean>(false);
  
  // Load sharing settings
  useEffect(() => {
    if (isOpen && dashboardId && user) {
      loadSharingSettings();
    }
  }, [isOpen, dashboardId, user]);
  
  const loadSharingSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const sharingData = await analyticsPermissionService.getDashboardSharing(dashboardId);
      
      if (sharingData) {
        setSharing(sharingData);
        setPublicAccess(sharingData.public);
        
        // Check if share link exists and is enabled
        if (sharingData.accessLink && sharingData.accessLink.enabled) {
          setShareLink(sharingData.accessLink.token);
          
          // Check if link has expiration
          if (sharingData.accessLink.expiresAt) {
            const daysLeft = Math.ceil(
              (sharingData.accessLink.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            );
            setLinkExpiration(daysLeft > 0 ? daysLeft : 0);
          } else {
            setLinkExpiration(null);
          }
        } else {
          setShareLink(null);
          setLinkExpiration(null);
        }
      } else {
        // Create initial sharing settings if none exist
        if (user) {
          const newSharing = await analyticsPermissionService.createDashboardSharing(
            dashboardId,
            dashboardName,
            user.id,
            false
          );
          
          if (newSharing) {
            setSharing(newSharing);
            setPublicAccess(false);
          } else {
            setError('Failed to create sharing settings');
          }
        }
      }
    } catch (error) {
      console.error('Failed to load sharing settings:', error);
      setError('Failed to load sharing settings');
    } finally {
      setLoading(false);
    }
  };
  
  // Toggle public access
  const handleTogglePublicAccess = async () => {
    if (!sharing || !user) return;
    
    try {
      const updatedSharing: DashboardSharing = {
        ...sharing,
        public: !publicAccess
      };
      
      const success = await analyticsPermissionService.updateDashboardSharing(
        updatedSharing,
        user
      );
      
      if (success) {
        setSharing(updatedSharing);
        setPublicAccess(!publicAccess);
      } else {
        setError('Failed to update public access');
      }
    } catch (error) {
      console.error('Failed to toggle public access:', error);
      setError('Failed to toggle public access');
    }
  };
  
  // Create share link
  const handleCreateShareLink = async () => {
    if (!dashboardId || !user) return;
    
    try {
      const token = await analyticsPermissionService.createShareLink(
        dashboardId,
        linkExpiration,
        user
      );
      
      if (token) {
        setShareLink(token);
        // Reload sharing settings to get updated link info
        loadSharingSettings();
      } else {
        setError('Failed to create share link');
      }
    } catch (error) {
      console.error('Failed to create share link:', error);
      setError('Failed to create share link');
    }
  };
  
  // Disable share link
  const handleDisableShareLink = async () => {
    if (!dashboardId || !user) return;
    
    try {
      const success = await analyticsPermissionService.disableShareLink(
        dashboardId,
        user
      );
      
      if (success) {
        setShareLink(null);
        setLinkExpiration(null);
        // Reload sharing settings
        loadSharingSettings();
      } else {
        setError('Failed to disable share link');
      }
    } catch (error) {
      console.error('Failed to disable share link:', error);
      setError('Failed to disable share link');
    }
  };
  
  // Copy link to clipboard
  const handleCopyLink = () => {
    if (!shareLink) return;
    
    try {
      const url = `${window.location.origin}/analytics/dashboard/${dashboardId}?token=${shareLink}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      setError('Failed to copy link to clipboard');
    }
  };
  
  // Share with user
  const handleShareWithUser = async () => {
    if (!dashboardId || !user || !inviteEmail.trim()) return;
    
    try {
      // In a real app, you would use a user lookup API to get the user ID from email
      // For demo purposes, we'll create a fake user ID from the email
      const userId = `user_${inviteEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
      
      const success = await analyticsPermissionService.shareDashboardWithUser(
        dashboardId,
        userId,
        inviteRole,
        user
      );
      
      if (success) {
        // Reset form
        setInviteEmail('');
        setShowAddUser(false);
        
        // Reload sharing settings
        loadSharingSettings();
      } else {
        setError('Failed to share dashboard with user');
      }
    } catch (error) {
      console.error('Failed to share dashboard with user:', error);
      setError('Failed to share dashboard with user');
    }
  };
  
  // Remove user
  const handleRemoveUser = async (userId: string) => {
    if (!dashboardId || !user) return;
    
    try {
      const success = await analyticsPermissionService.revokeDashboardAccess(
        dashboardId,
        userId,
        user
      );
      
      if (success) {
        // Reload sharing settings
        loadSharingSettings();
      } else {
        setError('Failed to remove user');
      }
    } catch (error) {
      console.error('Failed to remove user:', error);
      setError('Failed to remove user');
    }
  };
  
  // Update user role
  const handleUpdateUserRole = async (userId: string, role: AnalyticsRole) => {
    if (!dashboardId || !user) return;
    
    try {
      const success = await analyticsPermissionService.shareDashboardWithUser(
        dashboardId,
        userId,
        role,
        user
      );
      
      if (success) {
        // Reload sharing settings
        loadSharingSettings();
      } else {
        setError('Failed to update user role');
      }
    } catch (error) {
      console.error('Failed to update user role:', error);
      setError('Failed to update user role');
    }
  };
  
  // Get user name from sharing data
  const getUserNameById = (userId: string): string => {
    if (!sharing) return userId;
    
    // Owner is a special case
    if (userId === sharing.ownerId) {
      return `${userId} (Owner)`;
    }
    
    // In a real app, you would have a user lookup service
    // For demo purposes, we'll extract a name from the user ID
    return userId.replace('user_', '').replace(/_/g, ' ');
  };
  
  // Get role display name
  const getRoleDisplayName = (role: AnalyticsRole): string => {
    switch (role) {
      case 'viewer': return 'Viewer';
      case 'editor': return 'Editor';
      case 'admin': return 'Admin';
      case 'owner': return 'Owner';
      default: return role;
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`w-full max-w-2xl rounded-lg shadow-lg overflow-hidden ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Share Dashboard</h3>
            <button
              onClick={onClose}
              className={`p-1 rounded-full ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="px-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className={`w-8 h-8 animate-spin ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
              }`} />
            </div>
          ) : (
            <>
              {error && (
                <div className={`p-3 mb-4 rounded-md ${
                  theme === 'dark' ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-700'
                }`}>
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    <span>{error}</span>
                  </div>
                </div>
              )}
              
              {/* Dashboard Info */}
              <div className="mb-6">
                <h4 className={`text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Dashboard
                </h4>
                <p className="text-lg font-semibold">{dashboardName}</p>
              </div>
              
              {/* Public Access Toggle */}
              <div className={`p-4 mb-6 rounded-md ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {publicAccess ? (
                      <Globe className={`w-5 h-5 mr-2 ${
                        theme === 'dark' ? 'text-green-400' : 'text-green-500'
                      }`} />
                    ) : (
                      <Lock className={`w-5 h-5 mr-2 ${
                        theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
                      }`} />
                    )}
                    <div>
                      <h4 className="font-medium">
                        {publicAccess ? 'Public access' : 'Private access'}
                      </h4>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {publicAccess 
                          ? 'Anyone in your organization can view this dashboard' 
                          : 'Only people you share with can access'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleTogglePublicAccess}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      publicAccess 
                        ? theme === 'dark' ? 'bg-green-500' : 'bg-green-600' 
                        : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        publicAccess ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
              
              {/* Share Link */}
              <div className="mb-6">
                <h4 className={`text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Share Link
                </h4>
                
                {shareLink ? (
                  <div>
                    <div className="flex items-center mb-2">
                      <input
                        type="text"
                        value={`${window.location.origin}/analytics/dashboard/${dashboardId}?token=${shareLink}`}
                        readOnly
                        className={`flex-1 p-2 rounded-l-md border ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                      <button
                        onClick={handleCopyLink}
                        className={`p-2 rounded-r-md ${
                          theme === 'dark'
                            ? 'bg-gray-600 hover:bg-gray-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {copied ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    
                    <div className="flex items-center">
                      {linkExpiration !== null && (
                        <div className={`flex items-center text-sm mr-4 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>
                            {linkExpiration > 0 
                              ? `Expires in ${linkExpiration} days` 
                              : 'Expired'}
                          </span>
                        </div>
                      )}
                      
                      <button
                        onClick={handleDisableShareLink}
                        className={`text-sm ${
                          theme === 'dark' ? 'text-red-400' : 'text-red-600'
                        }`}
                      >
                        Disable link
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center mb-3">
                      <select
                        value={linkExpiration === null ? 'never' : linkExpiration.toString()}
                        onChange={(e) => {
                          const value = e.target.value;
                          setLinkExpiration(value === 'never' ? null : parseInt(value, 10));
                        }}
                        className={`p-2 rounded-md border mr-3 ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="never">No expiration</option>
                        <option value="1">1 day</option>
                        <option value="7">7 days</option>
                        <option value="30">30 days</option>
                        <option value="90">90 days</option>
                      </select>
                      
                      <button
                        onClick={handleCreateShareLink}
                        className={`flex items-center px-3 py-2 rounded-md ${
                          theme === 'dark'
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                      >
                        <Link className="w-4 h-4 mr-2" />
                        <span>Create link</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* User Sharing */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    People with access
                  </h4>
                  
                  <button
                    onClick={() => setShowAddUser(!showAddUser)}
                    className={`flex items-center text-sm ${
                      theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                    }`}
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    <span>Add people</span>
                  </button>
                </div>
                
                {/* Add user form */}
                {showAddUser && (
                  <div className={`p-4 mb-4 rounded-md ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <div className="flex items-center mb-3">
                      <input
                        type="email"
                        placeholder="Enter email address"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className={`flex-1 p-2 rounded-md border mr-3 ${
                          theme === 'dark'
                            ? 'bg-gray-600 border-gray-500 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                      
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value as AnalyticsRole)}
                        className={`p-2 rounded-md border ${
                          theme === 'dark'
                            ? 'bg-gray-600 border-gray-500 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="viewer">Viewer</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        onClick={() => setShowAddUser(false)}
                        className={`px-3 py-1 rounded-md mr-2 ${
                          theme === 'dark'
                            ? 'bg-gray-600 hover:bg-gray-500 text-white'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                      >
                        Cancel
                      </button>
                      
                      <button
                        onClick={handleShareWithUser}
                        disabled={!inviteEmail.trim()}
                        className={`px-3 py-1 rounded-md ${
                          theme === 'dark'
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        } ${!inviteEmail.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        Share
                      </button>
                    </div>
                  </div>
                )}
                
                {/* User list */}
                {sharing && (
                  <div className={`rounded-md border ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <div className={`px-4 py-2 text-sm font-medium ${
                      theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-700'
                    }`}>
                      <div className="grid grid-cols-3">
                        <div>User</div>
                        <div>Access</div>
                        <div></div>
                      </div>
                    </div>
                    
                    <div>
                      {sharing.users.map((userAccess) => (
                        <div
                          key={userAccess.userId}
                          className={`px-4 py-3 border-t ${
                            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                          }`}
                        >
                          <div className="grid grid-cols-3 items-center">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                                theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                              }`}>
                                <Users className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-medium">{getUserNameById(userAccess.userId)}</div>
                                <div className={`text-sm ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  {userAccess.userId}
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              {userAccess.userId === sharing.ownerId ? (
                                <span className="font-medium">Owner</span>
                              ) : (
                                <select
                                  value={userAccess.role}
                                  onChange={(e) => handleUpdateUserRole(
                                    userAccess.userId,
                                    e.target.value as AnalyticsRole
                                  )}
                                  className={`p-1 rounded border ${
                                    theme === 'dark'
                                      ? 'bg-gray-700 border-gray-600 text-white'
                                      : 'bg-white border-gray-300 text-gray-900'
                                  }`}
                                >
                                  <option value="viewer">Viewer</option>
                                  <option value="editor">Editor</option>
                                  <option value="admin">Admin</option>
                                </select>
                              )}
                            </div>
                            
                            <div className="text-right">
                              {userAccess.userId !== sharing.ownerId && (
                                <button
                                  onClick={() => handleRemoveUser(userAccess.userId)}
                                  className={`text-sm ${
                                    theme === 'dark' ? 'text-red-400' : 'text-red-600'
                                  }`}
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        
        {/* Footer */}
        <div className={`px-6 py-4 border-t ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-md ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardShareModal; 