import { supabase } from './supabase';
import { authAPI } from './api';
import { User } from '@/types';

// Use backend authentication instead of Supabase for main auth flow
export const signUp = async (email: string, password: string, username?: string) => {
  try {
    const data = await authAPI.register(email, password, username);
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create account');
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const data = await authAPI.login(email, password);
    
    // Store user data in localStorage for immediate access
    if (data.user && typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      localStorage.setItem('authToken', data.token);
    }
    
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in');
  }
};

export const signOut = async () => {
  try {
    await authAPI.logout();
  } catch (error) {
    console.error('Error during logout:', error);
    // Still remove data even if API call fails
  } finally {
    // Always clear local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
    }
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // Check if we have a token first
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (!token) return null;

    // Get stored user data for immediate access
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          // Convert to our User type format
          const user: User = {
            id: userData.id,
            email: userData.email,
            username: userData.username,
            avatarUrl: userData.avatar || userData.avatarUrl,
            createdAt: userData.createdAt,
            role: userData.role || 'user',
            rating: userData.rating,
          };
          
          // Validate token in background (don't wait for it)
          authAPI.refreshToken().catch(() => {
            // If token is invalid, clear storage
            if (typeof window !== 'undefined') {
              localStorage.removeItem('authToken');
              localStorage.removeItem('currentUser');
            }
          });
          
          return user;
        } catch (parseError) {
          console.error('Error parsing stored user data:', parseError);
          localStorage.removeItem('currentUser');
          localStorage.removeItem('authToken');
        }
      }
    }

    // If no stored user, try to refresh/validate token with backend
    try {
      const userData = await authAPI.refreshToken();
      
      if (!userData.user) {
        // Clear invalid data
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
          localStorage.removeItem('currentUser');
        }
        return null;
      }

      // Convert backend user to our User type and store it
      const user: User = {
        id: userData.user.id,
        email: userData.user.email,
        username: userData.user.username,
        avatarUrl: userData.user.avatar || userData.user.avatarUrl,
        createdAt: userData.user.createdAt,
        role: userData.user.role || 'user',
        rating: userData.user.rating,
      };

      // Store updated user data
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(userData.user));
      }

      return user;
    } catch (refreshError) {
      console.error('Error refreshing token:', refreshError);
      // Clear invalid token and user data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
      }
      return null;
    }
  } catch (error) {
    console.error('Error getting current user:', error);
    // Clear invalid data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
    }
    return null;
  }
};

export const getSession = async () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  return token ? { access_token: token } : null;
};

export const forgotPassword = async (email: string) => {
  try {
    const data = await authAPI.forgotPassword(email);
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to send reset email');
  }
};

export const resetPassword = async (token: string, password: string) => {
  try {
    const data = await authAPI.resetPassword(token, password);
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to reset password');
  }
};

export const verifyEmail = async (token: string) => {
  try {
    const data = await authAPI.verifyEmail(token);
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to verify email');
  }
};

export const resendVerification = async (email: string) => {
  try {
    const data = await authAPI.resendVerification(email);
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to resend verification');
  }
};