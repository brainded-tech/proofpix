import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface TestUser {
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

// Test users for different roles
const TEST_USERS: Record<string, TestUser> = {
  'admin@proofpix.com': {
    id: 'test-admin-1',
    email: 'admin@proofpix.com',
    name: 'Admin User',
    role: 'admin',
    subscription: {
      plan: 'enterprise',
      status: 'active',
      currentPeriodEnd: '2024-12-31T23:59:59Z'
    },
    usage: {
      filesProcessed: 1250,
      monthlyLimit: 10000,
      resetDate: '2024-02-01T00:00:00Z'
    },
    preferences: {
      theme: 'dark',
      notifications: true,
      autoExport: true
    },
    createdAt: '2023-01-15T10:30:00Z',
    lastLoginAt: new Date().toISOString()
  },
  'enterprise@proofpix.com': {
    id: 'test-enterprise-1',
    email: 'enterprise@proofpix.com',
    name: 'Enterprise User',
    role: 'enterprise',
    subscription: {
      plan: 'enterprise',
      status: 'active',
      currentPeriodEnd: '2024-12-31T23:59:59Z'
    },
    usage: {
      filesProcessed: 850,
      monthlyLimit: 5000,
      resetDate: '2024-02-01T00:00:00Z'
    },
    preferences: {
      theme: 'light',
      notifications: true,
      autoExport: false
    },
    createdAt: '2023-03-20T14:15:00Z',
    lastLoginAt: new Date().toISOString()
  },
  'standard@proofpix.com': {
    id: 'test-standard-1',
    email: 'standard@proofpix.com',
    name: 'Standard User',
    role: 'standard',
    subscription: {
      plan: 'standard',
      status: 'active',
      currentPeriodEnd: '2024-02-28T23:59:59Z'
    },
    usage: {
      filesProcessed: 45,
      monthlyLimit: 100,
      resetDate: '2024-02-01T00:00:00Z'
    },
    preferences: {
      theme: 'system',
      notifications: false,
      autoExport: false
    },
    createdAt: '2023-11-10T09:45:00Z',
    lastLoginAt: new Date().toISOString()
  },
  'free@proofpix.com': {
    id: 'test-free-1',
    email: 'free@proofpix.com',
    name: 'Free User',
    role: 'free',
    subscription: {
      plan: 'free',
      status: 'active',
      currentPeriodEnd: '2024-12-31T23:59:59Z'
    },
    usage: {
      filesProcessed: 8,
      monthlyLimit: 10,
      resetDate: '2024-02-01T00:00:00Z'
    },
    preferences: {
      theme: 'light',
      notifications: false,
      autoExport: false
    },
    createdAt: '2024-01-05T16:20:00Z',
    lastLoginAt: new Date().toISOString()
  }
};

// Test password for all accounts
const TEST_PASSWORD = 'test123';

export interface TestAuthContextType {
  user: TestUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithOAuth: (provider: 'google' | 'microsoft') => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: Partial<TestUser>) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
  switchUser: (email: string) => void; // For testing different roles
}

const TestAuthContext = createContext<TestAuthContextType | undefined>(undefined);

export const useTestAuth = (): TestAuthContextType => {
  const context = useContext(TestAuthContext);
  if (!context) {
    throw new Error('useTestAuth must be used within a TestAuthProvider');
  }
  return context;
};

interface TestAuthProviderProps {
  children: ReactNode;
}

export const TestAuthProvider: React.FC<TestAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<TestUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = !!user;

  // Initialize with stored user if available
  useEffect(() => {
    const storedUser = localStorage.getItem('test_auth_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('test_auth_user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const testUser = TEST_USERS[email.toLowerCase()];
      
      if (!testUser) {
        return { success: false, error: 'User not found. Try: admin@proofpix.com, enterprise@proofpix.com, standard@proofpix.com, or free@proofpix.com' };
      }
      
      if (password !== TEST_PASSWORD) {
        return { success: false, error: `Invalid password. Use: ${TEST_PASSWORD}` };
      }
      
      // Update last login
      const updatedUser = { ...testUser, lastLoginAt: new Date().toISOString() };
      setUser(updatedUser);
      localStorage.setItem('test_auth_user', JSON.stringify(updatedUser));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithOAuth = async (provider: 'google' | 'microsoft'): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Simulate OAuth flow
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // For testing, automatically log in as enterprise user
      const oauthUser: TestUser = {
        id: `oauth-${provider}-1`,
        email: `${provider}@proofpix.com`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} OAuth User`,
        role: 'enterprise',
        subscription: {
          plan: 'enterprise',
          status: 'active',
          currentPeriodEnd: '2024-12-31T23:59:59Z'
        },
        usage: {
          filesProcessed: 500,
          monthlyLimit: 5000,
          resetDate: '2024-02-01T00:00:00Z'
        },
        preferences: {
          theme: 'system',
          notifications: true,
          autoExport: true
        },
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      
      setUser(oauthUser);
      localStorage.setItem('test_auth_user', JSON.stringify(oauthUser));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: `${provider} OAuth login failed. Please try again.` };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const newUser: TestUser = {
        id: `test-new-${Date.now()}`,
        email: email.toLowerCase(),
        name,
        role: 'free',
        subscription: {
          plan: 'free',
          status: 'active',
          currentPeriodEnd: '2024-12-31T23:59:59Z'
        },
        usage: {
          filesProcessed: 0,
          monthlyLimit: 10,
          resetDate: '2024-02-01T00:00:00Z'
        },
        preferences: {
          theme: 'system',
          notifications: true,
          autoExport: false
        },
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      
      setUser(newUser);
      localStorage.setItem('test_auth_user', JSON.stringify(newUser));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    localStorage.removeItem('test_auth_user');
  };

  const refreshUser = async (): Promise<void> => {
    // In test mode, just update the last login time
    if (user) {
      const updatedUser = { ...user, lastLoginAt: new Date().toISOString() };
      setUser(updatedUser);
      localStorage.setItem('test_auth_user', JSON.stringify(updatedUser));
    }
  };

  const updateProfile = async (data: Partial<TestUser>): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }
    
    try {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('test_auth_user', JSON.stringify(updatedUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Profile update failed' };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    // In test mode, always succeed
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true };
  };

  const deleteAccount = async (): Promise<{ success: boolean; error?: string }> => {
    await logout();
    return { success: true };
  };

  const switchUser = (email: string): void => {
    const testUser = TEST_USERS[email.toLowerCase()];
    if (testUser) {
      const updatedUser = { ...testUser, lastLoginAt: new Date().toISOString() };
      setUser(updatedUser);
      localStorage.setItem('test_auth_user', JSON.stringify(updatedUser));
    }
  };

  const value: TestAuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    loginWithOAuth,
    register,
    logout,
    refreshUser,
    updateProfile,
    changePassword,
    deleteAccount,
    switchUser
  };

  return (
    <TestAuthContext.Provider value={value}>
      {children}
    </TestAuthContext.Provider>
  );
}; 