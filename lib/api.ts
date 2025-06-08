import axios from 'axios';
import { Thread, User, Category, Post } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://community-forum-backend.netlify.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add auth token to requests when available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  register: async (email: string, password: string, username?: string) => {
    const response = await api.post('/auth/register', {
      email,
      password,
      username
    });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', {
      email,
      password
    });
    
    // Store token if provided
    if (response.data.token && typeof window !== 'undefined') {
      localStorage.setItem('authToken', response.data.token);
    }
    
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    
    // Remove token from storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
    
    return response.data;
  },

  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    
    // Update token if provided
    if (response.data.token && typeof window !== 'undefined') {
      localStorage.setItem('authToken', response.data.token);
    }
    
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, password: string) => {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },

  verifyEmail: async (token: string) => {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },

  resendVerification: async (email: string) => {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  }
};

// Users API
export const usersAPI = {
  getProfile: async (userId?: string) => {
    const endpoint = userId ? `/users/${userId}` : '/users/me';
    const response = await api.get(endpoint);
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await api.put('/users/me', data);
    return response.data;
  },

  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.post('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getUsers: async (params?: any) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  updateUserRole: async (userId: string, role: string) => {
    const response = await api.put(`/users/${userId}/role`, { role });
    return response.data;
  },

  banUser: async (userId: string, reason?: string) => {
    const response = await api.post(`/users/${userId}/ban`, { reason });
    return response.data;
  },

  unbanUser: async (userId: string) => {
    const response = await api.delete(`/users/${userId}/ban`);
    return response.data;
  }
};

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  getBySlug: async (slug: string) => {
    const response = await api.get(`/categories/${slug}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  reorder: async (categoryIds: string[]) => {
    const response = await api.put('/categories/reorder', { categoryIds });
    return response.data;
  }
};

// Threads API
export const threadsAPI = {
  getAll: async (params?: any) => {
    const response = await api.get('/threads', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/threads/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/threads', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/threads/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/threads/${id}`);
    return response.data;
  },

  pin: async (id: string) => {
    const response = await api.post(`/threads/${id}/pin`);
    return response.data;
  },

  unpin: async (id: string) => {
    const response = await api.delete(`/threads/${id}/pin`);
    return response.data;
  },

  lock: async (id: string) => {
    const response = await api.post(`/threads/${id}/lock`);
    return response.data;
  },

  unlock: async (id: string) => {
    const response = await api.delete(`/threads/${id}/lock`);
    return response.data;
  },

  vote: async (id: string, type: 'up' | 'down') => {
    const response = await api.post(`/threads/${id}/vote`, { type });
    return response.data;
  },

  removeVote: async (id: string) => {
    const response = await api.delete(`/threads/${id}/vote`);
    return response.data;
  }
};

// Posts API
export const postsAPI = {
  getByThread: async (threadId: string, params?: any) => {
    const response = await api.get(`/threads/${threadId}/posts`, { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/posts', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/posts/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  vote: async (id: string, type: 'up' | 'down') => {
    const response = await api.post(`/posts/${id}/vote`, { type });
    return response.data;
  },

  removeVote: async (id: string) => {
    const response = await api.delete(`/posts/${id}/vote`);
    return response.data;
  },

  markAsAnswer: async (id: string) => {
    const response = await api.post(`/posts/${id}/answer`);
    return response.data;
  },

  unmarkAsAnswer: async (id: string) => {
    const response = await api.delete(`/posts/${id}/answer`);
    return response.data;
  }
};

// Search API
export const searchAPI = {
  search: async (params: any) => {
    const response = await api.get('/search', { params });
    return response.data;
  },

  suggestions: async (q: string) => {
    const response = await api.get('/search/suggestions', { params: { q } });
    return response.data;
  }
};

// Notifications API
export const notificationsAPI = {
  getAll: async (params?: any) => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  markAsRead: async (id: string) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  }
};

// Marketplace API
export const marketplaceAPI = {
  getListings: async (params?: any) => {
    const response = await api.get('/marketplace/listings', { params });
    return response.data;
  },

  getListing: async (id: string) => {
    const response = await api.get(`/marketplace/listings/${id}`);
    return response.data;
  },

  createListing: async (data: any) => {
    const response = await api.post('/marketplace/listings', data);
    return response.data;
  },

  updateListing: async (id: string, data: any) => {
    const response = await api.put(`/marketplace/listings/${id}`, data);
    return response.data;
  },

  deleteListing: async (id: string) => {
    const response = await api.delete(`/marketplace/listings/${id}`);
    return response.data;
  },

  getMyListings: async (params?: any) => {
    const response = await api.get('/marketplace/my-listings', { params });
    return response.data;
  },

  markAsSold: async (id: string) => {
    const response = await api.post(`/marketplace/listings/${id}/sold`);
    return response.data;
  },

  toggleFavorite: async (id: string) => {
    const response = await api.post(`/marketplace/listings/${id}/favorite`);
    return response.data;
  },

  getFavorites: async (params?: any) => {
    const response = await api.get('/marketplace/favorites', { params });
    return response.data;
  },

  reportListing: async (id: string, data: any) => {
    const response = await api.post(`/marketplace/listings/${id}/report`, data);
    return response.data;
  },

  contactSeller: async (id: string, data: any) => {
    const response = await api.post(`/marketplace/listings/${id}/contact`, data);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/marketplace/categories');
    return response.data;
  },

  uploadImages: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });
    
    const response = await api.post('/marketplace/upload-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

// Messages API
export const messagesAPI = {
  getConversations: async (params?: any) => {
    const response = await api.get('/messages/conversations', { params });
    return response.data;
  },

  getConversation: async (id: string, params?: any) => {
    const response = await api.get(`/messages/conversations/${id}`, { params });
    return response.data;
  },

  sendMessage: async (data: any) => {
    const response = await api.post('/messages', data);
    return response.data;
  },

  markAsRead: async (conversationId: string) => {
    const response = await api.put(`/messages/conversations/${conversationId}/read`);
    return response.data;
  },

  deleteConversation: async (id: string) => {
    const response = await api.delete(`/messages/conversations/${id}`);
    return response.data;
  }
};

// Reports API
export const reportsAPI = {
  create: async (data: any) => {
    const response = await api.post('/reports', data);
    return response.data;
  },

  getAll: async (params?: any) => {
    const response = await api.get('/reports', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, status: string) => {
    const response = await api.put(`/reports/${id}/status`, { status });
    return response.data;
  }
};

// Analytics API
export const analyticsAPI = {
  getStats: async () => {
    const response = await api.get('/analytics/stats');
    return response.data;
  },

  getUserActivity: async (params?: any) => {
    const response = await api.get('/analytics/user-activity', { params });
    return response.data;
  },

  getPopularContent: async (params?: any) => {
    const response = await api.get('/analytics/popular-content', { params });
    return response.data;
  }
};

// Legacy API functions for backward compatibility
export const fetchCategories = async () => {
  const response = await categoriesAPI.getAll();
  return response.data || response;
};

export const fetchCategory = async (slug: string) => {
  const response = await categoriesAPI.getBySlug(slug);
  return response.data || response;
};

export const fetchThreads = async (params?: any) => {
  const response = await threadsAPI.getAll(params);
  return response.data || response;
};

export const fetchThread = async (id: string) => {
  const response = await threadsAPI.getById(id);
  return response.data || response;
};

export const createThread = async (data: any) => {
  const response = await threadsAPI.create(data);
  return response.data || response;
};

export const fetchPosts = async (threadId: string, params?: any) => {
  const response = await postsAPI.getByThread(threadId, params);
  return response.data || response;
};

export const createPost = async (data: any) => {
  const response = await postsAPI.create(data);
  return response.data || response;
};

export const fetchUserProfile = async (userId?: string) => {
  const response = await usersAPI.getProfile(userId);
  return response.data || response;
};

export const updateUserProfile = async (data: any) => {
  const response = await usersAPI.updateProfile(data);
  return response.data || response;
};

export const searchContent = async (params: any) => {
  const response = await searchAPI.search(params);
  return response.data || response;
};

export const fetchListings = async (params?: any) => {
  const response = await marketplaceAPI.getListings(params);
  return response.data || response;
};

export const fetchListing = async (id: string) => {
  const response = await marketplaceAPI.getListing(id);
  return response.data || response;
};

export const createListing = async (data: any) => {
  const response = await marketplaceAPI.createListing(data);
  return response.data || response;
};

export const updateListing = async (id: string, data: any) => {
  const response = await marketplaceAPI.updateListing(id, data);
  return response.data || response;
};

export const deleteListing = async (id: string) => {
  const response = await marketplaceAPI.deleteListing(id);
  return response.data || response;
};

export const fetchMyListings = async (params?: any) => {
  const response = await marketplaceAPI.getMyListings(params);
  return response.data || response;
};

export const markListingAsSold = async (id: string) => {
  const response = await marketplaceAPI.markAsSold(id);
  return response.data || response;
};

export const favoriteListingToggle = async (id: string) => {
  const response = await marketplaceAPI.toggleFavorite(id);
  return response.data || response;
};

export const fetchFavoriteListings = async (params?: any) => {
  const response = await marketplaceAPI.getFavorites(params);
  return response.data || response;
};

export const reportListing = async (id: string, reason: string, description?: string) => {
  const response = await marketplaceAPI.reportListing(id, { reason, description });
  return response.data || response;
};

export const fetchMarketplaceCategories = async () => {
  const response = await marketplaceAPI.getCategories();
  return response.data || response;
};

export const contactSeller = async (listingId: string, message: string) => {
  const response = await marketplaceAPI.contactSeller(listingId, { message });
  return response.data || response;
};

// Mock function to get current user (will be replaced with actual auth)
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    if (typeof window !== 'undefined' && localStorage.getItem('authToken')) {
      const response = await usersAPI.getProfile();
      return response.data || response;
    }
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    // Clear invalid token
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
    return null;
  }
};

// Default export for compatibility
export default {
  authAPI,
  usersAPI,
  categoriesAPI,
  threadsAPI,
  postsAPI,
  searchAPI,
  notificationsAPI,
  marketplaceAPI,
  messagesAPI,
  reportsAPI,
  analyticsAPI
};