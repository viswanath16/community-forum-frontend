import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

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

// Mock data for development when backend is not available
const mockCategories = [
  {
    id: '1',
    name: 'General Discussion',
    slug: 'general-discussion',
    description: 'General topics and community discussions',
    threadCount: 15,
    postCount: 142,
    parentId: null,
    subcategories: []
  },
  {
    id: '2',
    name: 'Technology',
    slug: 'technology',
    description: 'Discussions about technology, programming, and innovation',
    threadCount: 23,
    postCount: 189,
    parentId: null,
    subcategories: []
  },
  {
    id: '3',
    name: 'Marketplace',
    slug: 'marketplace',
    description: 'Buy, sell, and trade items with community members',
    threadCount: 8,
    postCount: 45,
    parentId: null,
    subcategories: []
  },
  {
    id: '4',
    name: 'Help & Support',
    slug: 'help-support',
    description: 'Get help and support from the community',
    threadCount: 12,
    postCount: 78,
    parentId: null,
    subcategories: []
  },
  {
    id: '5',
    name: 'Off Topic',
    slug: 'off-topic',
    description: 'Casual conversations and off-topic discussions',
    threadCount: 19,
    postCount: 156,
    parentId: null,
    subcategories: []
  },
  {
    id: '6',
    name: 'Announcements',
    slug: 'announcements',
    description: 'Official announcements and news',
    threadCount: 5,
    postCount: 23,
    parentId: null,
    subcategories: []
  }
];

const mockThreads = [
  {
    id: '1',
    title: 'Welcome to the Community Forum!',
    content: 'Welcome everyone to our new community forum. Feel free to introduce yourself and start discussions.',
    categoryId: '1',
    authorId: 'admin',
    author: { username: 'Admin', avatar: null },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    postCount: 5,
    viewCount: 42,
    isPinned: true,
    isLocked: false
  },
  {
    id: '2',
    title: 'Latest Tech Trends 2025',
    content: 'What are your thoughts on the latest technology trends this year?',
    categoryId: '2',
    authorId: 'user1',
    author: { username: 'TechEnthusiast', avatar: null },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    postCount: 12,
    viewCount: 89,
    isPinned: false,
    isLocked: false
  }
];

// Categories API
export const fetchCategories = async () => {
  try {
    const response = await api.get('/categories');
    // Handle different possible response structures
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data?.categories || response.data?.data || [];
  } catch (error) {
    console.warn('Backend not available, using mock data for categories');
    // Return mock data when backend is not available
    return mockCategories;
  }
};

export const fetchCategory = async (slug: string) => {
  try {
    const response = await api.get(`/categories/${slug}`);
    return response.data?.category || response.data;
  } catch (error) {
    console.warn('Backend not available, using mock data for category');
    // Return mock category data
    const category = mockCategories.find(cat => cat.slug === slug);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }
};

// Threads API
export const fetchThreads = async (categoryId?: string) => {
  try {
    const url = categoryId ? `/threads?categoryId=${categoryId}` : '/threads';
    const response = await api.get(url);
    // Handle different possible response structures
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data?.threads || response.data?.data || [];
  } catch (error) {
    console.warn('Backend not available, using mock data for threads');
    // Return mock threads, filtered by category if specified
    let threads = mockThreads;
    if (categoryId) {
      threads = mockThreads.filter(thread => thread.categoryId === categoryId);
    }
    return threads;
  }
};

export const fetchThread = async (id: string) => {
  try {
    const response = await api.get(`/threads/${id}`);
    return response.data?.thread || response.data;
  } catch (error) {
    console.warn('Backend not available, using mock data for thread');
    const thread = mockThreads.find(t => t.id === id);
    if (!thread) {
      throw new Error('Thread not found');
    }
    return thread;
  }
};

export const createThread = async (data: {
  title: string;
  content: string;
  categoryId: string;
}) => {
  try {
    const response = await api.post('/threads', data);
    return response.data?.thread || response.data;
  } catch (error) {
    console.error('Error creating thread:', error);
    throw error;
  }
};

// Posts API
export const fetchPosts = async (threadId: string) => {
  try {
    const response = await api.get(`/threads/${threadId}/posts`);
    // Handle different possible response structures
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data?.posts || response.data?.data || [];
  } catch (error) {
    console.warn('Backend not available, returning empty posts');
    return [];
  }
};

export const createPost = async (data: {
  content: string;
  threadId: string;
}) => {
  try {
    const response = await api.post('/posts', data);
    return response.data?.post || response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// Users API
export const fetchUserProfile = async (userId: string) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data?.user || response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, data: any) => {
  try {
    const response = await api.put(`/users/${userId}`, data);
    return response.data?.user || response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Search API
export const searchContent = async (query: string) => {
  try {
    const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
    return response.data?.results || response.data || [];
  } catch (error) {
    console.warn('Backend not available, returning empty search results');
    return [];
  }
};

// Marketplace API endpoints
export const fetchListings = async (params?: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
    if (params?.location) queryParams.append('location', params.location);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const url = `/marketplace/listings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.get(url);
    
    // Handle different possible response structures
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data?.listings || response.data?.data || [];
  } catch (error) {
    console.warn('Backend not available, returning empty listings');
    return [];
  }
};

export const fetchListing = async (id: string) => {
  try {
    const response = await api.get(`/marketplace/listings/${id}`);
    return response.data?.listing || response.data;
  } catch (error) {
    console.error('Error fetching listing:', error);
    throw error;
  }
};

export const createListing = async (data: {
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images?: string[];
  condition?: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  tags?: string[];
}) => {
  try {
    const response = await api.post('/marketplace/listings', data);
    return response.data?.listing || response.data;
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
};

export const updateListing = async (id: string, data: {
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  location?: string;
  images?: string[];
  condition?: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  tags?: string[];
  status?: 'active' | 'sold' | 'inactive';
}) => {
  try {
    const response = await api.put(`/marketplace/listings/${id}`, data);
    return response.data?.listing || response.data;
  } catch (error) {
    console.error('Error updating listing:', error);
    throw error;
  }
};

export const deleteListing = async (id: string) => {
  try {
    const response = await api.delete(`/marketplace/listings/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting listing:', error);
    throw error;
  }
};

export const fetchMyListings = async () => {
  try {
    const response = await api.get('/marketplace/my-listings');
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data?.listings || response.data?.data || [];
  } catch (error) {
    console.warn('Backend not available, returning empty listings');
    return [];
  }
};

export const markListingAsSold = async (id: string) => {
  try {
    const response = await api.patch(`/marketplace/listings/${id}/sold`);
    return response.data?.listing || response.data;
  } catch (error) {
    console.error('Error marking listing as sold:', error);
    throw error;
  }
};

export const favoriteListingToggle = async (id: string) => {
  try {
    const response = await api.post(`/marketplace/listings/${id}/favorite`);
    return response.data;
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
};

export const fetchFavoriteListings = async () => {
  try {
    const response = await api.get('/marketplace/favorites');
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data?.listings || response.data?.data || [];
  } catch (error) {
    console.warn('Backend not available, returning empty favorites');
    return [];
  }
};

export const reportListing = async (id: string, reason: string, description?: string) => {
  try {
    const response = await api.post(`/marketplace/listings/${id}/report`, {
      reason,
      description
    });
    return response.data;
  } catch (error) {
    console.error('Error reporting listing:', error);
    throw error;
  }
};

export const fetchMarketplaceCategories = async () => {
  try {
    const response = await api.get('/marketplace/categories');
    // Handle different possible response structures
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data?.categories || response.data?.data || [];
  } catch (error) {
    console.warn('Backend not available, returning empty marketplace categories');
    return [];
  }
};

export const contactSeller = async (listingId: string, message: string) => {
  try {
    const response = await api.post(`/marketplace/listings/${listingId}/contact`, {
      message
    });
    return response.data;
  } catch (error) {
    console.error('Error contacting seller:', error);
    throw error;
  }
};

export default api;