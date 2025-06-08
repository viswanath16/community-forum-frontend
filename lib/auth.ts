import { authAPI } from './api';
import { User } from '@/types';

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
    
    if (data.user && data.token) {
      // Store in localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      
      // Force page reload to update navbar
      window.location.reload();
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
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    window.location.href = '/';
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
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
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    return null;
  }
};