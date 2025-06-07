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

// Helper function to transform backend category data to frontend format
const transformCategoryData = (backendCategory: any) => {
  return {
    id: backendCategory.value || backendCategory.id,
    name: backendCategory.label || backendCategory.name,
    slug: (backendCategory.value || backendCategory.label || '').toLowerCase().replace(/\s+/g, '-'),
    description: backendCategory.description || `Discussions about ${backendCategory.label || backendCategory.name}`,
    threadCount: backendCategory.threadCount || 0,
    postCount: backendCategory.postCount || 0,
    parentId: backendCategory.parentId || null,
    subcategories: backendCategory.subcategories || []
  };
};

// Categories API
export const fetchCategories = async () => {
  try {
    const response = await api.get('/categories');
    console.log('Categories API response:', response.data);
    
    let categories = [];
    
    // Handle the actual backend response structure
    if (response.data?.success && response.data?.data) {
      categories = response.data.data;
    } else if (Array.isArray(response.data)) {
      categories = response.data;
    } else if (response.data?.categories) {
      categories = response.data.categories;
    } else {
      categories = response.data || [];
    }
    
    // Transform the categories to match frontend expectations
    return categories.map(transformCategoryData);
  } catch (error) {
    console.warn('Backend not available, using mock data for categories');
    // Return mock data when backend is not available
    return mockCategories;
  }
};

export const fetchCategory = async (slug: string) => {
  try {
    const response = await api.get(`/categories/${slug}`);
    console.log('Category API response:', response.data);
    
    let category = null;
    
    // Handle the actual backend response structure
    if (response.data?.success && response.data?.data) {
      category = response.data.data;
    } else if (response.data?.category) {
      category = response.data.category;
    } else {
      category = response.data;
    }
    
    if (category) {
      return transformCategoryData(category);
    }
    
    throw new Error('Category not found');
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
    console.log('Threads API response:', response.data);
    
    // Handle the actual backend response structure
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    
    // Handle direct array response
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    // Handle nested threads property
    if (response.data?.threads) {
      return response.data.threads;
    }
    
    return response.data || [];
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
    console.log('Thread API response:', response.data);
    
    // Handle the actual backend response structure
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    
    if (response.data?.thread) {
      return response.data.thread;
    }
    
    return response.data;
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
    console.log('Create thread API response:', response.data);
    
    // Handle the actual backend response structure
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    
    if (response.data?.thread) {
      return response.data.thread;
    }
    
    return response.data;
  } catch (error) {
    console.warn('Backend not available, creating mock thread');
    // Create a mock thread when backend is not available
    const newThread = {
      id: Math.random().toString(36).substr(2, 9),
      title: data.title,
      content: data.content,
      categoryId: data.categoryId,
      authorId: 'current-user',
      author: { username: 'CurrentUser', avatar: null },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      postCount: 0,
      viewCount: 0,
      isPinned: false,
      isLocked: false
    };
    
    // Add to mock threads array for future fetches
    mockThreads.push(newThread);
    
    return newThread;
  }
};

// Posts API
export const fetchPosts = async (threadId: string) => {
  try {
    const response = await api.get(`/threads/${threadId}/posts`);
    console.log('Posts API response:', response.data);
    
    // Handle the actual backend response structure
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    
    // Handle direct array response
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    // Handle nested posts property
    if (response.data?.posts) {
      return response.data.posts;
    }
    
    return response.data || [];
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
    console.log('Create post API response:', response.data);
    
    // Handle the actual backend response structure
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    
    if (response.data?.post) {
      return response.data.post;
    }
    
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// Users API
export const fetchUserProfile = async (userId: string) => {
  try {
    const response = await api.get(`/users/${userId}`);
    console.log('User profile API response:', response.data);
    
    // Handle the actual backend response structure
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    
    if (response.data?.user) {
      return response.data.user;
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, data: any) => {
  try {
    const response = await api.put(`/users/${userId}`, data);
    console.log('Update user profile API response:', response.data);
    
    // Handle the actual backend response structure
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    
    if (response.data?.user) {
      return response.data.user;
    }
    
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Search API
export const searchContent = async (query: string) => {
  try {
    const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
    console.log('Search API response:', response.data);
    
    // Handle the actual backend response structure
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    
    if (response.data?.results) {
      return response.data.results;
    }
    
    return response.data || [];
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
    console.log('Listings API response:', response.data);
    
    // Handle the actual backend response structure
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    
    // Handle direct array response
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    // Handle nested listings property
    if (response.data?.listings) {
      return response.data.listings;
    }
    
    return response.data || [];
  } catch (error) {
    console.warn('Backend not available, returning empty listings');
    return [];
  }
};

export const fetchListing = async (id: string) => {
  try {
    const response = await api.get(`/marketplace/listings/${id}`);
    console.log('Listing API response:', response.data);
    
    // Handle the actual backend response structure
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    
    if (response.data?.listing) {
      return response.data.listing;
    }
    
    return response.data;
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
    console.log('Create listing API response:', response.data);
    
    // Handle the actual backend response structure
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    
    if (response.data?.listing) {
      return response.data.listing;
    }
    
    return response.data;
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
    console.log('Update listing API response:', response.data);
    
    // Handle the actual backend response structure
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    
    if (response.data?.listing) {
      return response.data.listing;
    }
    
    return response.data;
  } catch (error) {
    console.error('Error updating listing:', error);
    throw error;
  }
};

export const deleteListing = async (id: string) => {
  try {
    const response = await api.delete(`/marketplace/listings/${id}`);
    console.log('Delete listing API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting listing:', error);
    throw error;
  }
};

export const fetchMyListings = async () => {
  try {
    const response = await api.get('/marketplace/my-listings');
    console.log('My listings API response:', response.data);
    
    // Handle the actual backend response structure
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    if (response.data?.listings) {
      return response.data.listings;
    }
    
    return response.data || [];
  } catch (error) {
    console.warn('Backend not available, returning empty listings');
    return [];
  }
};

export const markListingAsSold = async (id: string) => {
  try {
    const response = await api.patch(`/marketplace/listings/${id}/sold`);
    console.log('Mark as sold API response:', response.data);
    
    // Handle the actual backend response structure
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    
    if (response.data?.listing) {
      return response.data.listing;
    }
    
    return response.data;
  } catch (error) {
    console.error('Error marking listing as sold:', error);
    throw error;
  }
};

export const favoriteListingToggle = async (id: string) => {
  try {
    const response = await api.post(`/marketplace/listings/${id}/favorite`);
    console.log('Favorite toggle API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
};

export const fetchFavoriteListings = async () => {
  try {
    const response = await api.get('/marketplace/favorites');
    console.log('Favorite listings API response:', response.data);
    
    // Handle the actual backend response structure
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    if (response.data?.listings) {
      return response.data.listings;
    }
    
    return response.data || [];
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
    console.log('Report listing API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error reporting listing:', error);
    throw error;
  }
};

export const fetchMarketplaceCategories = async () => {
  try {
    const response = await api.get('/marketplace/categories');
    console.log('Marketplace categories API response:', response.data);
    
    // Handle the actual backend response structure
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    
    // Handle direct array response
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    // Handle nested categories property
    if (response.data?.categories) {
      return response.data.categories;
    }
    
    return response.data || [];
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
    console.log('Contact seller API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error contacting seller:', error);
    throw error;
  }
};

export default api;