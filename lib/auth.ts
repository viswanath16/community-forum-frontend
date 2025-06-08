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
    // Still remove token even if API call fails
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // Check if we have a token
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (!token) return null;

    // Get user profile from backend
    const userData = await authAPI.refreshToken();
    
    if (!userData.user) return null;

    // Convert backend user to our User type
    return {
      id: userData.user.id,
      email: userData.user.email,
      username: userData.user.username,
      avatarUrl: userData.user.avatar,
      createdAt: userData.user.createdAt,
      role: userData.user.role,
      rating: userData.user.rating,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    // Clear invalid token
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
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