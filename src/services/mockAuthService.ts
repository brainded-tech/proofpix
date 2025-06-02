/**
 * Mock Authentication Service for Local Development
 * 
 * This service provides a simple authentication system for testing Pro features
 * like Chain of Custody without requiring a full OAuth setup.
 */

import { useState, useEffect } from 'react';

export interface MockUser {
  id: string;
  email: string;
  name: string;
  tier: 'free' | 'pro' | 'enterprise';
  avatar?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: MockUser | null;
  loading: boolean;
}

class MockAuthService {
  private authState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: false
  };

  private listeners: ((state: AuthState) => void)[] = [];

  // Mock users for testing (NO PASSWORDS REQUIRED - just use the email addresses)
  private mockUsers: MockUser[] = [
    {
      id: 'user-1',
      email: 'demo@proofpixapp.com',
      name: 'Demo User',
      tier: 'free'
    },
    {
      id: 'user-2',
      email: 'pro@proofpixapp.com',
      name: 'Pro User',
      tier: 'pro'
    },
    {
      id: 'user-3',
      email: 'enterprise@proofpixapp.com',
      name: 'Enterprise User',
      tier: 'enterprise'
    }
  ];

  constructor() {
    // Check for existing session
    this.loadSession();
  }

  private loadSession() {
    try {
      const savedUser = localStorage.getItem('proofpix_mock_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        this.authState = {
          isAuthenticated: true,
          user,
          loading: false
        };
        this.notifyListeners();
      }
    } catch (error) {
      console.warn('Failed to load saved session:', error);
    }
  }

  private saveSession(user: MockUser) {
    localStorage.setItem('proofpix_mock_user', JSON.stringify(user));
    localStorage.setItem('proofpix_user_tier', user.tier);
  }

  private clearSession() {
    localStorage.removeItem('proofpix_mock_user');
    localStorage.removeItem('proofpix_user_tier');
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.authState));
  }

  // Subscribe to auth state changes
  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Get current auth state
  getAuthState(): AuthState {
    return { ...this.authState };
  }

  // Mock login with email
  async login(email: string): Promise<{ success: boolean; error?: string }> {
    this.authState.loading = true;
    this.notifyListeners();

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user = this.mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        this.authState.loading = false;
        this.notifyListeners();
        return { success: false, error: 'User not found. Try: demo@proofpixapp.com, pro@proofpixapp.com, or enterprise@proofpixapp.com' };
      }

      this.authState = {
        isAuthenticated: true,
        user,
        loading: false
      };

      this.saveSession(user);
      this.notifyListeners();

      return { success: true };
    } catch (error) {
      this.authState.loading = false;
      this.notifyListeners();
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }

  // Mock Google login
  async loginWithGoogle(): Promise<{ success: boolean; error?: string }> {
    this.authState.loading = true;
    this.notifyListeners();

    try {
      // Simulate OAuth flow delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // For demo purposes, log in as Pro user
      const user = this.mockUsers.find(u => u.tier === 'pro')!;
      
      this.authState = {
        isAuthenticated: true,
        user: {
          ...user,
          name: 'Google User',
          email: 'google.user@gmail.com',
          avatar: 'https://via.placeholder.com/40/4285f4/ffffff?text=G'
        },
        loading: false
      };

      this.saveSession(this.authState.user!);
      this.notifyListeners();

      return { success: true };
    } catch (error) {
      this.authState.loading = false;
      this.notifyListeners();
      return { success: false, error: 'Google login failed. Please try again.' };
    }
  }

  // Logout
  async logout(): Promise<void> {
    this.authState = {
      isAuthenticated: false,
      user: null,
      loading: false
    };

    this.clearSession();
    this.notifyListeners();
  }

  // Check if user has access to feature
  hasFeatureAccess(feature: 'chain-of-custody' | 'ai-features' | 'enterprise-sso'): boolean {
    if (!this.authState.isAuthenticated || !this.authState.user) {
      return false;
    }

    const { tier } = this.authState.user;

    switch (feature) {
      case 'chain-of-custody':
        return tier === 'pro' || tier === 'enterprise';
      case 'ai-features':
        return tier === 'pro' || tier === 'enterprise';
      case 'enterprise-sso':
        return tier === 'enterprise';
      default:
        return false;
    }
  }

  // Get available mock users for testing
  getMockUsers(): MockUser[] {
    return [...this.mockUsers];
  }
}

// Export singleton instance
export const mockAuthService = new MockAuthService();

// React hook for using auth state
export function useMockAuth() {
  const [authState, setAuthState] = useState<AuthState>(mockAuthService.getAuthState());

  useEffect(() => {
    const unsubscribe = mockAuthService.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  return {
    ...authState,
    login: mockAuthService.login.bind(mockAuthService),
    loginWithGoogle: mockAuthService.loginWithGoogle.bind(mockAuthService),
    logout: mockAuthService.logout.bind(mockAuthService),
    hasFeatureAccess: mockAuthService.hasFeatureAccess.bind(mockAuthService),
    getMockUsers: mockAuthService.getMockUsers.bind(mockAuthService)
  };
} 