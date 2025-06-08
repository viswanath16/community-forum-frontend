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

// Mock data generators for threads/categories/posts only
const generateMockUser = (id: number): User => ({
  id: id.toString(),
  email: `user${id}@example.com`,
  username: `user${id}`,
  avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${id}`,
  createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
  role: 'user',
  rating: Math.floor(Math.random() * 5) + 1,
});

const generateMockCategory = (id: number): Category => ({
  id: id.toString(),
  name: `Category ${id}`,
  description: `Description for category ${id}. This is a sample category for demonstration purposes.`,
  slug: `category-${id}`,
  threadCount: Math.floor(Math.random() * 50) + 1,
  postCount: Math.floor(Math.random() * 200) + 10,
});

const generateMockThread = (id: number): Thread => ({
  id: id.toString(),
  title: `Thread ${id}: Discussion Topic`,
  slug: `thread-${id}`,
  content: `This is the content for thread ${id}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  categoryId: Math.floor(Math.random() * 5 + 1).toString(),
  author: generateMockUser(Math.floor(Math.random() * 10) + 1),
  authorId: Math.floor(Math.random() * 10 + 1).toString(),
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  viewCount: Math.floor(Math.random() * 1000),
  postCount: Math.floor(Math.random() * 20),
  isPinned: Math.random() > 0.9,
  isLocked: Math.random() > 0.95,
  lastPostAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
});

const generateMockPost = (id: number, threadId: string): Post => ({
  id: id.toString(),
  content: `This is post ${id} content. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  threadId,
  author: generateMockUser(Math.floor(Math.random() * 10) + 1),
  authorId: Math.floor(Math.random() * 10 + 1).toString(),
  createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
});

// Authentication API - Real backend implementation
export const authAPI = {
  register: async (email: string, password: string, username?: string) => {
    const response = await api.post('/auth/register', {
      email,
      password,
      username: username || email.split('@')[0]
    });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', {
      email,
      password
    });
    
    const data = response.data;
    
    // Store token and user data in localStorage
    if (data.token && typeof window !== 'undefined') {
      localStorage.setItem('authToken', data.token);
      if (data.user) {
        localStorage.setItem('currentUser', JSON.stringify(data.user));
      }
    }
    
    return data;
  },

  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      // Even if logout fails on server, we should clear local storage
      console.error('Logout API error:', error);
      return { success: true };
    } finally {
      // Always clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
      }
    }
  },

  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    
    const data = response.data;
    
    // Update stored token and user data
    if (data.token && typeof window !== 'undefined') {
      localStorage.setItem('authToken', data.token);
      if (data.user) {
        localStorage.setItem('currentUser', JSON.stringify(data.user));
      }
    }
    
    return data;
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

// Categories API - Using mock data
export const categoriesAPI = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const categories = [
      {
        id: '1',
        name: 'General Discussion',
        description: 'General topics and casual conversations',
        slug: 'general-discussion',
        threadCount: 45,
        postCount: 234,
      },
      {
        id: '2',
        name: 'Technology',
        description: 'Discussions about technology, programming, and innovation',
        slug: 'technology',
        threadCount: 32,
        postCount: 189,
      },
      {
        id: '3',
        name: 'Gaming',
        description: 'Video games, board games, and gaming culture',
        slug: 'gaming',
        threadCount: 28,
        postCount: 156,
      },
      {
        id: '4',
        name: 'Science',
        description: 'Scientific discoveries, research, and discussions',
        slug: 'science',
        threadCount: 21,
        postCount: 98,
      },
      {
        id: '5',
        name: 'Arts & Culture',
        description: 'Art, music, literature, and cultural discussions',
        slug: 'arts-culture',
        threadCount: 19,
        postCount: 87,
      },
      {
        id: '6',
        name: 'Sports',
        description: 'Sports news, discussions, and fan communities',
        slug: 'sports',
        threadCount: 15,
        postCount: 76,
      }
    ];
    return { data: categories };
  },

  getBySlug: async (slug: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const categories = [
      {
        id: '1',
        name: 'General Discussion',
        description: 'General topics and casual conversations',
        slug: 'general-discussion',
        threadCount: 45,
        postCount: 234,
      },
      {
        id: '2',
        name: 'Technology',
        description: 'Discussions about technology, programming, and innovation',
        slug: 'technology',
        threadCount: 32,
        postCount: 189,
      },
      {
        id: '3',
        name: 'Gaming',
        description: 'Video games, board games, and gaming culture',
        slug: 'gaming',
        threadCount: 28,
        postCount: 156,
      },
      {
        id: '4',
        name: 'Science',
        description: 'Scientific discoveries, research, and discussions',
        slug: 'science',
        threadCount: 21,
        postCount: 98,
      },
      {
        id: '5',
        name: 'Arts & Culture',
        description: 'Art, music, literature, and cultural discussions',
        slug: 'arts-culture',
        threadCount: 19,
        postCount: 87,
      },
      {
        id: '6',
        name: 'Sports',
        description: 'Sports news, discussions, and fan communities',
        slug: 'sports',
        threadCount: 15,
        postCount: 76,
      }
    ];
    
    const category = categories.find(cat => cat.slug === slug) || categories[0];
    return { data: category };
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

// Threads API - Using mock data
export const threadsAPI = {
  getAll: async (params?: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const threads = Array.from({ length: 20 }, (_, i) => generateMockThread(i + 1));
    return { data: threads };
  },

  getById: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const thread = generateMockThread(parseInt(id));
    return { data: thread };
  },

  create: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newThread = {
      ...generateMockThread(Date.now()),
      ...data,
      id: Date.now().toString(),
    };
    return { data: newThread };
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

// Posts API - Using mock data
export const postsAPI = {
  getByThread: async (threadId: string, params?: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const posts = Array.from({ length: 5 }, (_, i) => generateMockPost(i + 1, threadId));
    return { data: posts };
  },

  getById: async (id: string) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newPost = {
      ...generateMockPost(Date.now(), data.threadId),
      ...data,
      id: Date.now().toString(),
    };
    return { data: newPost };
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

// Marketplace API - Real backend implementation
export const marketplaceAPI = {
  getListings: async (params?: any) => {
    const response = await api.get('/marketplace', { params });
    return response.data;
  },

  getListing: async (id: string) => {
    const response = await api.get(`/marketplace/${id}`);
    return response.data;
  },

  createListing: async (data: any) => {
    const response = await api.post('/marketplace', data);
    return response.data;
  },

  updateListing: async (id: string, data: any) => {
    const response = await api.put(`/marketplace/${id}`, data);
    return response.data;
  },

  deleteListing: async (id: string) => {
    const response = await api.delete(`/marketplace/${id}`);
    return response.data;
  },

  getMyListings: async (params?: any) => {
    const response = await api.get('/marketplace/my-listings', { params });
    return response.data;
  },

  markAsSold: async (id: string) => {
    const response = await api.post(`/marketplace/${id}/sold`);
    return response.data;
  },

  toggleFavorite: async (id: string) => {
    const response = await api.post(`/marketplace/${id}/favorite`);
    return response.data;
  },

  getFavorites: async (params?: any) => {
    const response = await api.get('/marketplace/favorites', { params });
    return response.data;
  },

  reportListing: async (id: string, data: any) => {
    const response = await api.post(`/marketplace/${id}/report`, data);
    return response.data;
  },

  contactSeller: async (id: string, data: any) => {
    const response = await api.post(`/marketplace/${id}/contact`, data);
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