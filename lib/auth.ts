import { supabase } from './supabase';
import { User } from '@/types';

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  
  // Store the session token for API requests
  if (data.session?.access_token) {
    localStorage.setItem('authToken', data.session.access_token);
  }
  
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  // Remove the token from storage
  localStorage.removeItem('authToken');
  
  if (error) throw error;
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data } = await supabase.auth.getUser();
  
  if (!data.user) return null;
  
  // Convert Supabase User to our custom User type
  return {
    id: data.user.id,
    email: data.user.email || '',
    username: data.user.user_metadata?.username,
    avatarUrl: data.user.user_metadata?.avatar_url,
    createdAt: data.user.created_at,
    role: data.user.user_metadata?.role,
    rating: data.user.user_metadata?.rating,
  };
};

export const getSession = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};