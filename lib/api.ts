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
    return response.data?.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const fetchCategory = async (slug: string) => {
  const response = await api.get(`/categories/${slug}`);
  return response.data;
};

// Threads API
export const fetchThreads = async (categoryId?: string) => {
  try {
    const url = categoryId ? `/threads?categoryId=${categoryId}` : '/threads';
    const response = await api.get(url);
    return response.data?.threads || [];
  } catch (error) {
    console.error('Error fetching threads:', error);
    return [];
  }
};

export const fetchThread = async (id: string) => {
  const response = await api.get(`/threads/${id}`);
  return response.data;
};

export const createThread = async (data: {
  title: string;
  content: string;
  categoryId: string;
}) => {
  const response = await api.post('/threads', data);
  return response.data;
};

// Posts API
export const fetchPosts = async (threadId: string) => {
  const response = await api.get(`/posts?threadId=${threadId}`);
  return response.data?.posts || [];
};

export const createPost = async (data: {
  content: string;
  threadId: string;
}) => {
  const response = await api.post('/posts', data);
  return response.data;
};

// Users API
export const fetchUserProfile = async (userId: string) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const updateUserProfile = async (userId: string, data: any) => {
  const response = await api.put(`/users/${userId}`, data);
  return response.data;
};

// Search API
export const searchContent = async (query: string) => {
  const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
  return response.data;
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

    const url = `/listings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.get(url);
    return response.data?.listings || [];
  } catch (error) {
    console.error('Error fetching listings:', error);
    return [];
  }
};

export const fetchListing = async (id: string) => {
  const response = await api.get(`/marketplace/listings/${id}`);
  return response.data;
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
  const response = await api.post('/marketplace/listings', data);
  return response.data;
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
  const response = await api.put(`/marketplace/listings/${id}`, data);
  return response.data;
};

export const deleteListing = async (id: string) => {
  const response = await api.delete(`/marketplace/listings/${id}`);
  return response.data;
};

export const fetchMyListings = async () => {
  const response = await api.get('/marketplace/my-listings');
  return response.data?.listings || [];
};

export const markListingAsSold = async (id: string) => {
  const response = await api.patch(`/marketplace/listings/${id}/sold`);
  return response.data;
};

export const favoriteListingToggle = async (id: string) => {
  const response = await api.post(`/marketplace/listings/${id}/favorite`);
  return response.data;
};

export const fetchFavoriteListings = async () => {
  const response = await api.get('/marketplace/favorites');
  return response.data?.listings || [];
};

export const reportListing = async (id: string, reason: string, description?: string) => {
  const response = await api.post(`/marketplace/listings/${id}/report`, {
    reason,
    description
  });
  return response.data;
};

export const fetchMarketplaceCategories = async () => {
  try {
    const response = await api.get('/marketplace/categories');
    return response.data?.categories || [];
  } catch (error) {
    console.error('Error fetching marketplace categories:', error);
    return [];
  }
};

export const contactSeller = async (listingId: string, message: string) => {
  const response = await api.post(`/marketplace/listings/${listingId}/contact`, {
    message
  });
  return response.data;
};

export default api;