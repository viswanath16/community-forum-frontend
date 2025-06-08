import { authAPI } from './api';
import { User } from '@/types';

// Custom event for auth state changes
const dispatchAuthChange = (user: User | null) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('authStateChanged', { detail: user }));
  }
};

export const signUp = async (email: string, password: string, username?: string) => {
  try {
    const data = await authAPI.register(email, password, username);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to create account');
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const data = await authAPI.login(email, password);
    
    if (data.user && data.token && typeof window !== 'undefined') {
      // Store in localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      
      // Convert to our User type
      const user: User = {
        id: data.user.id,
        email: data.user.email,
        username: data.user.username,
        avatarUrl: data.user.avatar || data.user.avatarUrl,
        createdAt: data.user.createdAt,
        role: data.user.role || 'user',
        rating: data.user.rating,
      };
      
      // Dispatch auth change event
      dispatchAuthChange(user);
    }
    
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to sign in');
  }
};

export const signOut = async () => {
  try {
    await authAPI.logout();
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      
      // Dispatch auth change event
      dispatchAuthChange(null);
      
      // Redirect to home
      window.location.href = '/';
    }
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    if (typeof window === 'undefined') return null;
    
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('currentUser');
    
    if (!token || !userData) return null;
    
    const user = JSON.parse(userData);
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      avatarUrl: user.avatar || user.avatarUrl,
      createdAt: user.createdAt,
      role: user.role || 'user',
      rating: user.rating,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
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
    throw new Error(error.response?.data?.message || error.message || 'Failed to send reset email');
  }
};

export const resetPassword = async (token: string, password: string) => {
  try {
    const data = await authAPI.resetPassword(token, password);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to reset password');
  }
};

export const verifyEmail = async (token: string) => {
  try {
    const data = await authAPI.verifyEmail(token);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to verify email');
  }
};

export const resendVerification = async (email: string) => {
  try {
    const data = await authAPI.resendVerification(email);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to resend verification');
  }
};