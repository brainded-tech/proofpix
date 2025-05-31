import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, ApiUser } from '../../utils/apiClient';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'enterprise' | 'standard' | 'free';
  subscription?: {
    plan: string;
    status: 'active' | 'canceled' | 'past_due';
    currentPeriodEnd: string;
  };
  usage?: {
    filesProcessed: number;
    monthlyLimit: number;
    resetDate: string;
  };
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    autoExport: boolean;
  };
  createdAt: string;
  lastLoginAt?: string;
}

// Helper function to convert ApiUser to User
const convertApiUserToUser = (apiUser: ApiUser): User => {
  return {
    id: apiUser.id,
    email: apiUser.email,
    name: apiUser.name,
    role: apiUser.role,
    subscription: apiUser.subscription,
    usage: apiUser.usage,
    preferences: apiUser.preferences,
    createdAt: apiUser.createdAt,
    lastLoginAt: apiUser.lastLoginAt,
  };
};

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const response = await api.auth.me();
        if (response.success && response.data) {
          setUser(convertApiUserToUser(response.data));
        } else {
          // Invalid token, clear it
          localStorage.removeItem('auth_token');
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      localStorage.removeItem('auth_token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const response = await api.auth.login({ email, password });
      
      if (response.success && response.data) {
        const { token, user: userData } = response.data;
        localStorage.setItem('auth_token', token);
        setUser(convertApiUserToUser(userData));
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const response = await api.auth.register({ email, password, name });
      
      if (response.success && response.data) {
        const { token, user: userData } = response.data;
        localStorage.setItem('auth_token', token);
        setUser(convertApiUserToUser(userData));
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await api.auth.me();
      if (response.success && response.data) {
        setUser(convertApiUserToUser(response.data));
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await api.users.updateProfile(data);
      
      if (response.success && response.data) {
        setUser(prev => prev ? { ...prev, ...convertApiUserToUser(response.data!) } : null);
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Update failed' };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await api.users.changePassword({ currentPassword, newPassword });
      
      if (response.success) {
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Password change failed' };
      }
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const deleteAccount = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await api.users.deleteAccount();
      
      if (response.success) {
        localStorage.removeItem('auth_token');
        setUser(null);
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Account deletion failed' };
      }
    } catch (error) {
      console.error('Delete account error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
    changePassword,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 