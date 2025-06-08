import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://community-forum-backend.netlify.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout for better reliability
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
    if (error.response?.status === 401) {
      // Clear invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
      }
    }
    
    // Handle HTML error responses (like 404 pages) more gracefully
    if (error.response?.data && typeof error.response.data === 'string' && error.response.data.startsWith('<!DOCTYPE html>')) {
      console.error(`API Error: Received HTML error page (${error.response.status} ${error.response.statusText})`);
      throw new Error(`Server error: ${error.response.status} ${error.response.statusText}`);
    }
    
    // Extract error message from response
    const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
    throw new Error(errorMessage);
  }
);

// Authentication API
export const authAPI = {
  register: async (email: string, password: string, username?: string) => {
    const response = await api.post('/auth/register', { email, password, username });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('authToken');
    }
  },

  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    if (response.data.token) {
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
    const endpoint = userId ? `/users/${userId}` : '/users/profile';
    const response = await api.get(endpoint);
    return response.data;
  },

  updateProfile: async (data: {
    username?: string;
    bio?: string;
    location?: string;
    website?: string;
    avatar?: string;
  }) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }) => {
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

  create: async (data: {
    name: string;
    description: string;
    slug: string;
    parentId?: string;
    color?: string;
    icon?: string;
  }) => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  update: async (id: string, data: {
    name?: string;
    description?: string;
    slug?: string;
    parentId?: string;
    color?: string;
    icon?: string;
  }) => {
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
  getAll: async (params?: {
    categoryId?: string;
    page?: number;
    limit?: number;
    sort?: 'latest' | 'popular' | 'oldest';
    search?: string;
  }) => {
    const response = await api.get('/threads', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/threads/${id}`);
    return response.data;
  },

  create: async (data: {
    title: string;
    content: string;
    categoryId: string;
    tags?: string[];
    isPinned?: boolean;
  }) => {
    const response = await api.post('/threads', data);
    return response.data;
  },

  update: async (id: string, data: {
    title?: string;
    content?: string;
    categoryId?: string;
    tags?: string[];
    isPinned?: boolean;
    isLocked?: boolean;
  }) => {
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
  getByThread: async (threadId: string, params?: {
    page?: number;
    limit?: number;
    sort?: 'oldest' | 'newest' | 'popular';
  }) => {
    const response = await api.get(`/threads/${threadId}/posts`, { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  create: async (data: {
    content: string;
    threadId: string;
    parentId?: string;
  }) => {
    const response = await api.post('/posts', data);
    return response.data;
  },

  update: async (id: string, data: {
    content: string;
  }) => {
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
  search: async (params: {
    q: string;
    type?: 'all' | 'threads' | 'posts' | 'users';
    categoryId?: string;
    page?: number;
    limit?: number;
  }) => {
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
  getAll: async (params?: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
  }) => {
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
  getListings: async (params?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    condition?: string;
    status?: string;
    page?: number;
    limit?: number;
    sort?: 'newest' | 'oldest' | 'price-low' | 'price-high' | 'popular';
  }) => {
    const response = await api.get('/marketplace/listings', { params });
    return response.data;
  },

  getListing: async (id: string) => {
    const response = await api.get(`/marketplace/listings/${id}`);
    return response.data;
  },

  createListing: async (data: {
    title: string;
    description: string;
    price: number;
    category: string;
    location: string;
    condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
    images?: string[];
    tags?: string[];
  }) => {
    const response = await api.post('/marketplace/listings', data);
    return response.data;
  },

  updateListing: async (id: string, data: {
    title?: string;
    description?: string;
    price?: number;
    category?: string;
    location?: string;
    condition?: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
    images?: string[];
    tags?: string[];
    status?: 'active' | 'sold' | 'inactive';
  }) => {
    const response = await api.put(`/marketplace/listings/${id}`, data);
    return response.data;
  },

  deleteListing: async (id: string) => {
    const response = await api.delete(`/marketplace/listings/${id}`);
    return response.data;
  },

  getMyListings: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => {
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

  getFavorites: async (params?: {
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/marketplace/favorites', { params });
    return response.data;
  },

  reportListing: async (id: string, data: {
    reason: string;
    description?: string;
  }) => {
    const response = await api.post(`/marketplace/listings/${id}/report`, data);
    return response.data;
  },

  contactSeller: async (id: string, data: {
    message: string;
  }) => {
    const response = await api.post(`/marketplace/listings/${id}/contact`, data);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/marketplace/categories');
    return response.data;
  },

  uploadImages: async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    const response = await api.post('/marketplace/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};

// Messages API
export const messagesAPI = {
  getConversations: async (params?: {
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/messages/conversations', { params });
    return response.data;
  },

  getConversation: async (id: string, params?: {
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get(`/messages/conversations/${id}`, { params });
    return response.data;
  },

  sendMessage: async (data: {
    recipientId?: string;
    conversationId?: string;
    content: string;
  }) => {
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
  create: async (data: {
    type: 'thread' | 'post' | 'user' | 'listing';
    targetId: string;
    reason: string;
    description?: string;
  }) => {
    const response = await api.post('/reports', data);
    return response.data;
  },

  getAll: async (params?: {
    type?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/reports', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, status: 'pending' | 'resolved' | 'dismissed') => {
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

  getUserActivity: async (params?: {
    period?: 'day' | 'week' | 'month' | 'year';
    userId?: string;
  }) => {
    const response = await api.get('/analytics/user-activity', { params });
    return response.data;
  },

  getPopularContent: async (params?: {
    type?: 'threads' | 'posts';
    period?: 'day' | 'week' | 'month' | 'year';
    limit?: number;
  }) => {
    const response = await api.get('/analytics/popular-content', { params });
    return response.data;
  }
};

// Legacy API functions for backward compatibility
export const fetchCategories = categoriesAPI.getAll;
export const fetchCategory = categoriesAPI.getBySlug;
export const fetchThreads = threadsAPI.getAll;
export const fetchThread = threadsAPI.getById;
export const createThread = threadsAPI.create;
export const fetchPosts = postsAPI.getByThread;
export const createPost = postsAPI.create;
export const fetchUserProfile = usersAPI.getProfile;
export const updateUserProfile = usersAPI.updateProfile;
export const searchContent = searchAPI.search;
export const fetchListings = marketplaceAPI.getListings;
export const fetchListing = marketplaceAPI.getListing;
export const createListing = marketplaceAPI.createListing;
export const updateListing = marketplaceAPI.updateListing;
export const deleteListing = marketplaceAPI.deleteListing;
export const fetchMyListings = marketplaceAPI.getMyListings;
export const markListingAsSold = marketplaceAPI.markAsSold;
export const favoriteListingToggle = marketplaceAPI.toggleFavorite;
export const fetchFavoriteListings = marketplaceAPI.getFavorites;
export const reportListing = marketplaceAPI.reportListing;
export const fetchMarketplaceCategories = marketplaceAPI.getCategories;
export const contactSeller = marketplaceAPI.contactSeller;

export default api;