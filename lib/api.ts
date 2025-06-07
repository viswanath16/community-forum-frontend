import axios from 'axios';

const API_URL = 'https://community-forum-backend.netlify.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests when available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const fetchCategory = async (slug: string) => {
  try {
    const response = await api.get(`/categories/${slug}`);
    return response.data?.category || response.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
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
    console.error('Error fetching threads:', error);
    return [];
  }
};

export const fetchThread = async (id: string) => {
  try {
    const response = await api.get(`/threads/${id}`);
    return response.data?.thread || response.data;
  } catch (error) {
    console.error('Error fetching thread:', error);
    throw error;
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
    console.error('Error fetching posts:', error);
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
    console.error('Error searching content:', error);
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
    console.error('Error fetching listings:', error);
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
    console.error('Error fetching my listings:', error);
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
    console.error('Error fetching favorite listings:', error);
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
    console.error('Error fetching marketplace categories:', error);
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